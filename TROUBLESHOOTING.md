# 🆘 Troubleshooting Guide - KarigarUstaad Network Issues

Quick reference for common problems and solutions.

---

## 🔴 Backend Exit Code 1 / Won't Start

### Problem
```
Backend exits immediately with exit code 1
No logs are printed
```

### Causes & Solutions

#### 1. **MongoDB Not Running**
**Check:**
```bash
# Windows: Open Services (services.msc) and look for MongoDB
# Or try to connect:
mongo
```

**Fix:**
```bash
# Windows - Start MongoDB Service
net start MongoDB

# If exists, else install MongoDB Community
# Download: https://www.mongodb.com/try/download/community
```

#### 2. **MongoDB Connection String Invalid**
**Check:** `backend/.env` file
```ini
MONGODB_URI=mongodb://localhost:27017/karigarustaad
```

**Fix:**
- Verify MongoDB is running on that port
- Try connecting directly: `mongo mongodb://localhost:27017/karigarustaad`
- Check for typos in MONGODB_URI

#### 3. **Port Already in Use**
**Check:**
```bash
# Windows: See what's using port 5000
netstat -ano | findstr :5000
```

**Fix:**
- Kill the process using port 5000
- Or change PORT in `backend/.env` to 5001

#### 4. **Missing Dependencies**
**Check:**
```bash
cd backend
npm list
```

**Fix:**
```bash
cd backend
npm install
```

---

## 🔴 "Cannot GET /api/" (Browser or API Test)

### Problem
Browser shows "Cannot GET /api/" and it's **not** working

### Not-a-Problem First!
If you see "Cannot GET /api/" in browser, that's actually **normal**! The API doesn't have a response for GET /api/. This means the backend IS running.

### If This Doesn't Happen

**Check 1:** Is backend actually running?
```bash
# Terminal running node server.js should show:
✅ Server started on 0.0.0.0:5000
```

**Check 2:** Can you reach it from same machine?
```bash
curl http://localhost:5000/api
```

**Check 3:** From another machine with backend IP?
```bash
# Replace 192.168.1.100 with your actual IP
curl http://192.168.1.100:5000/api
```

---

## 🔴 Frontend: "Cannot reach server - check API_BASE_URL"

### Problem
App shows network error when trying to create job or load jobs

### Step 1: Verify Backend is Running
```bash
# In backend terminal, should see:
✅ Server started on 0.0.0.0:5000
```

### Step 2: Check .env File
**File:** `mobile-app/.env`
```ini
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

**For different scenarios:**
- **Web/Simulator on same machine:** `http://localhost:5000/api`
- **Physical device on same network:** `http://192.168.1.100:5000/api` (replace IP)
- **Android emulator:** `http://10.0.2.2:5000/api`

### Step 3: Restart Both Services
```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: Frontend
cd mobile-app
npx expo start
```

### Step 4: Check Logs
**Frontend Console (in Expo):**
Should show API endpoint being used:
```
🔧 API Configuration:
   Base URL: http://192.168.1.100:5000/api
```

**Backend Console:**
Should show incoming request:
```
📨 [2024-01-15T10:30:45Z] GET /api
   Client IP: 192.168.1.105
```

If backend logs don't show the request, **network connectivity is broken**.

---

## 🔴 Frontend: Job Posted But Can't Find It

### Problem
- Job created successfully (see ✅ status)
- But when navigating, see "Job not found"
- Or get "Cannot find job" error

### Causes

#### 1. **jobId Not Passed in Navigation**
**Check:** `app/(customer)/home.tsx` or similar where job is listed
```typescript
router.push({
  pathname: '/(worker)/job-details',
  params: { jobId: job.id },  // Make sure jobId is included
});
```

**Check:** `mobile-app/app/(worker)/job-details.tsx`
```typescript
const jobId = params.jobId as string;
console.log('👷 Job Details Screen: Mounted with params:', { jobId });
// If jobId is undefined, it wasn't passed correctly
```

#### 2. **API Latency - Job Not Yet in Database**
**Solution:** Wait a moment or add retry logic
```typescript
const [retries, setRetries] = useState(0);

const loadJobDetails = async () => {
  try {
    const jobData = await getJobById(jobId);
    setJob(jobData);
  } catch (error) {
    if (retries < 3) {
      setTimeout(() => {
        setRetries(retries + 1);
        loadJobDetails();
      }, 500);
    }
  }
};
```

#### 3. **Job ID Format Mismatch**
**Check:** Backend is returning correct ID format
```javascript
// In backend logs, check:
✅ JobController: Job created successfully { jobId: 507f1f77bcf86cd799439011, ...}
```

**Check:** Frontend is receiving same format
```typescript
console.log('✅ JobService: Job created with ID:', response.data.data.id);
```

---

## 🔴 Frontend: App Stuck on Loading

### Problem
- Screen shows loading spinner forever
- Nothing progresses
- No error message

### Causes

#### 1. **API Call Timeout**
**Frontend logs expected:**
```
📤 GET /jobs
   data: undefined
   hasAuth: true

❌ API Error: { status: undefined, message: 'Error: timeout of 30000ms...' }
```

**Check:**
- Backend logs show incoming request? If not, network is broken
- If backend shows request but no response, backend is hanging

**Fix:**
- Check MongoDB is working
- Check backend process is responsive
- Restart backend and frontend

#### 2. **Network Connection Lost**
**Check Backend Terminal:**
- Still printing logs for other requests?
- If yes: Only this specific API call has problem
- If no: Backend crashed or hung

**Fix:**
```bash
# Restart backend
cd backend
node server.js
```

---

## 🔴 Frontend: Wrong Data Returned

### Problem
- API call succeeds (✅ status 200)
- But data is wrong or incomplete
- Job shows wrong title or missing fields

### Debugging Steps

#### Step 1: Check API Response Logs
**Frontend console:**
```
✅ 200 http://192.168.1.100:5000/api/jobs/123
{ success: true, data: { id: "123", title: "Fix Door", ... } }
```

**Read all fields** in the response to identify what's wrong

#### Step 2: Check Backend Response
**Backend logs:**
```
💼 JobController: getJobById called { jobId: 123 }
✅ JobController: Job retrieved { jobId: 123, title: "Fix Door", status: "pending" }
```

Compare backend logs with frontend received data.

#### Step 3: Check Database
```bash
# Connect to MongoDB
mongo

# In mongo shell:
use karigarustaad
db.jobs.findOne({ _id: ObjectId("123") })
```

**Compare all three sources:**
- Database has correct data? ✓ Problem is in API response formatting
- API returns wrong data? ✓ Problem is in backend code
- Frontend receives wrong data? ✓ Problem is in frontend parsing

---

## 🟡 Slow Performance / High Latency

### Problem
- API calls take 5+ seconds
- Jobs load slowly
- Navigation is sluggish

### Check Duration in Logs

**Backend logs show:**
```
✅ Status: 201 | Duration: 2500ms  // Should be < 500ms
```

### Causes & Fixes

#### 1. **MongoDB Slow**
**Check:**
```bash
# Test MongoDB directly
mongo
> use karigarustaad
> db.jobs.find().limit(1)  // Should return instantly
```

**Fix:**
- MongoDB indexes needed
- Run this once:
```javascript
db.jobs.createIndex({ status: 1 })
db.jobs.createIndex({ employer: 1 })
db.jobs.createIndex({ worker: 1 })
```

#### 2. **Network Latency**
**Check:** Ping backend from frontend machine
```bash
# Windows
ping 192.168.1.100
```

If ping > 100ms, network is slow. Check WiFi signal or network cable.

#### 3. **Backend Processing Slow**
**Check Backend Logs:**
Can see what operations take long:
```
📨 POST /jobs
   💼 JobController: Checking field validation...  (1ms)
   💼 JobController: Creating job in database...    (2000ms) ← SLOW!
   ✅ Status: 201 | Duration: 2003ms
```

If database operation is slow, see MongoDB fixes above.

---

## 🟡 Auth Token Issues

### Problem
- First API call works
- But second API call returns 401 Unauthorized
- App asks to login again

### Check 1: Auth Token Stored?
**Frontend logs should show:**
```
🔑 Auth token saved
🔑 Retrieved auth token: exists
```

If shows "not found", token wasn't saved correctly.

### Check 2: Auth Header Sent?
**API logs should show:**
```
📤 POST /jobs
   data: {...}
   hasAuth: true  ← Should be true
```

If `hasAuth: false`, token not being sent.

### Fix: Clear and Re-login
```javascript
// In app or via settings
await clearAuthToken();
// Force user to login again
```

---

## 🟢 Testing Tools

### Use These to Verify Setup

#### 1. **Test Backend Connection**
```bash
# In Windows Command Prompt
curl http://localhost:5000/api
curl http://192.168.1.100:5000/api
```

#### 2. **Test MongoDB**
```bash
mongo
> use karigarustaad
> db.jobs.find().pretty()
```

#### 3. **View All Backend Logs**
```bash
cd backend
node server.js 2>&1 | tee logs.txt
# tee saves to logs.txt while showing on screen
```

#### 4. **Test Network between Machines**
```bash
# From frontend machine to backend machine
ping 192.168.1.100
```

---

## ✅ Verification Checklist

Run through this when something isn't working:

- [ ] Backend running: `node server.js` works?
- [ ] MongoDB connected: "Database Connected" in backend logs?
- [ ] Can curl backend: `curl http://localhost:5000/api` works?
- [ ] .env file exists: `mobile-app/.env` present?
- [ ] .env has correct URL: Check `EXPO_PUBLIC_API_URL`
- [ ] Frontend started: `npx expo start` ran?
- [ ] Logs visible: Can see emoji-marked logs in console?
- [ ] API calls show in backend: Do logs appear for frontend actions?
- [ ] Response codes correct: Seeing ✅ 200/201 not ❌ errors?

---

## 📞 Getting Help

### If Problem Persists

**Collect Information:**
1. Screenshot of backend console when it starts
2. Screenshot of backend console when frontend tries API call
3. Screenshot of frontend console showing the error
4. Output of `ipconfig` (your local IP)
5. Output of `node server.js` (full error if any)

**Check These Files:**
- `backend/.env` - Database and API settings
- `mobile-app/.env` - Frontend API URL
- `backend/server.js` - Line 26+ shows listen configuration
- `mobile-app/src/services/api.ts` - Line 10 shows base URL

---

## 🎓 Common Error Messages

### "ECONNREFUSED: Connection refused"
**Means:** Backend is not running or not listening at that address
**Fix:** Start backend with `node server.js`

### "Cannot GET /api"
**Means:** Backend is running! (This is normal)
**Why:** API endpoint / doesn't exist, but server is working

### "Job not found"  
**Means:** Job ID doesn't exist in database or wasn't synced yet
**Fix:** Check jobId was passed in navigation params

### "Unauthorized" (401)
**Means:** Auth token missing or expired
**Fix:** Log out and log in again

### "MongoServerError: connect ECONNREFUSED"
**Means:** MongoDB isn't running or wrong connection string
**Fix:** Start MongoDB service or check MONGODB_URI in .env

---

## 📝 Log Examples

### ✅ Everything Working

**Frontend Console:**
```
🔧 API Configuration:
   Base URL: http://192.168.1.100:5000/api

🛠️  Post Job: Started job posting process...
📤 POST /jobs
   data: { title: "Fix Door", ... }
   hasAuth: true
✅ 201 http://192.168.1.100:5000/api/jobs
   { success: true, data: { id: "507f...", ... } }
```

**Backend Console:**
```
✅ Server started on 0.0.0.0:5000
📨 [2024-01-15T10:30:45Z] POST /api/jobs
   Client IP: 192.168.1.105
   Body: { title: "Fix Door", ... }...
💼 JobController: createJob called { title: "Fix Door", ... }
✅ JobController: Job created successfully { jobId: "507f...", ... }
   ✅ Status: 201 | Duration: 45ms
```

### 🔴 Network Problem

**Frontend Console:**
```
🔧 API Configuration:
   Base URL: http://192.168.1.100:5000/api

🛠️  Post Job: Started job posting process...
📤 POST /jobs
   data: { title: "Fix Door", ... }
   hasAuth: true
❌ API Error: {
  status: undefined,
  url: 'http://192.168.1.100:5000/api/jobs',
  message: 'Error: ECONNREFUSED - Connection refused',
  networkError: 'Cannot reach server - check API_BASE_URL'
}
```

**Backend Console:**
- No new logs appear
- This means request never reached backend

---

## 🚀 Next Steps After Fixing

1. Create a test job as customer
2. Accept job as worker
3. Mark job as in-progress
4. Mark job as completed
5. Check wallet updated with earnings

If all these work, the system is properly set up!

