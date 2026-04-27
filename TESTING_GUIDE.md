# 🧪 Comprehensive Testing Guide

## Pre-Testing Setup

### Backend Running
```bash
cd backend
npm start
# Should see: ✅ Server started on 0.0.0.0:5000
```

### Frontend Running
```bash
cd mobile-app
npx expo start
# Should see: › Press i to open iOS, a to open Android, w to open web
```

### Network Configuration
- Get your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
- Update EXPO_PUBLIC_API_URL: `http://192.168.x.x:5000/api`
- Make sure phone can ping backend IP

### Test Accounts
Create these test users in database:
```javascript
// Customer account
db.users.insertOne({
  name: "Test Customer",
  email: "customer@test.com",
  password: "hashed_password",
  role: "customer",
  skills: [],
  wallet: { balance: 10000, pending: 0 }
})

// Worker account
db.users.insertOne({
  name: "Test Worker",
  email: "worker@test.com",
  password: "hashed_password",
  role: "worker",
  skills: ["Electrician", "Plumber"],
  wallet: { balance: 0, pending: 0 }
})
```

Or use the signup flow to create them.

---

## Test Suite 1: Authentication

### Test 1.1: Login Works
**Steps:**
1. Launch app
2. Go to login screen
3. Enter email: `customer@test.com`
4. Enter password: (your password)
5. Tap "Login"

**Expected Results:**
- ✅ No error shown
- ✅ Redirected to customer home
- ✅ Token visible in console: `✅ Login successful`
- ✅ Token stored in AsyncStorage (checked via Expo dev tools)

**Console Output:**
```
✅ LoginScreen: Login successful for user: Test Customer Role: customer
📤 POST /api/auth/login { data: {...} }
✅ 200 /api/auth/login
🔑 Auth token saved
```

---

### Test 1.2: Register Works
**Steps:**
1. From login screen, tap "Sign up"
2. Fill form:
   - Name: `New User`
   - Email: `newuser@test.com`
   - Password: `password123`
   - Role: `worker`
3. Tap "Register"

**Expected Results:**
- ✅ Account created
- ✅ Logged in automatically
- ✅ Redirected to worker dashboard
- ✅ Token stored

**Verify in Database:**
```javascript
db.users.findOne({ email: "newuser@test.com" })
// Should exist with role: "worker"
```

---

### Test 1.3: Logout Works
**Steps:**
1. From any dashboard, tap profile icon
2. Go to Profile screen
3. Scroll down to "Logout" button
4. Tap "Logout"
5. Confirm "Yes, logout"

**Expected Results:**
- ✅ Alert shown: "Are you sure?"
- ✅ Token cleared from AsyncStorage
- ✅ Redirected to login screen
- ✅ Cannot use back button to return
- ✅ If you try to access protected screen, get redirected to login

**Console Output:**
```
🔑 Profile: Starting logout process...
🔑 AuthService: Calling logout endpoint...
✅ AuthService: User logged out successfully
✅ Profile: Logout successful, redirecting to login...
🔑 Auth token cleared
```

**Verify:**
- Try to manually open a protected route - should redirect to login
- Token should NOT be in AsyncStorage anymore

---

### Test 1.4: Token in API Requests
**Steps:**
1. Login as any user
2. Navigate to any screen that fetches data
3. Open Expo console or Safari DevTools

**Expected Results:**
- ✅ Every request has header: `Authorization: Bearer eyJhbG...`
- ✅ All protected endpoints work
- ✅ Public endpoints (get jobs) work without token

**Console Output Example:**
```
📤 GET /api/jobs
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   hasAuth: true
✅ 200 /api/jobs { success: true, data: [...] }
```

---

### Test 1.5: Token Expiry
**Steps (Optional - requires JWT_EXPIRE config):**
1. Wait for token to expire (set JWT_EXPIRE=1m for testing)
2. Or manually modify token in AsyncStorage to invalid value
3. Try to fetch data

**Expected Results:**
- ✅ 401 error received
- ✅ Token automatically cleared
- ✅ User redirected to login

---

## Test Suite 2: Job Posting (Customer)

### Test 2.1: Post Job - All Fields Required
**Steps:**
1. Login as customer
2. Tap "Post Job" button
3. Try to submit empty form

**Expected Results:**
- ✅ Error alert: "Missing fields"
- ✅ Form not submitted
- ✅ Can retry

---

### Test 2.2: Post Job - Valid Job
**Steps:**
1. Login as customer
2. Tap "Post Job" button
3. Fill form:
   - Title: `Need Electrician for home wiring`
   - Category: Select `Electrician`
   - Description: `Need to install new switches and rewire my bedroom`
   - Location: `Karachi, Pakistan`
   - Budget: `5000`
4. Tap "Post Job"

**Expected Results:**
- ✅ Loading state shows "Posting..."
- ✅ Success alert: "Job posted successfully"
- ✅ Redirected to "My Jobs" screen
- ✅ New job appears in list with status "Pending"
- ✅ Form cleared

**Console Output:**
```
🛠️ Post Job: Starting job posting process...
🛠️ Post Job: Form validation - inputs: ✅✅✅✅✅
📤 POST /api/jobs { title: "Need Electrician...", ... }
✅ 201 /api/jobs { data: { id: "635f...", ... } }
📋 JobService: Got jobs: 1
✅ Post Job: Job created successfully with ID: 635f...
```

**Verify in Database:**
```javascript
db.jobs.findOne({ title: "Need Electrician for home wiring" })
// Should have:
// status: "pending"
// employer: ObjectId of customer
// budget: 5000
```

---

### Test 2.3: Post Job - Invalid Budget
**Steps:**
1. Go to "Post Job"
2. Fill form correctly except Budget
3. Enter budget: `-100` or `0` or `abc`
4. Tap "Post Job"

**Expected Results:**
- ✅ Error alert: "Budget must be a valid number greater than 0"
- ✅ Job not posted

---

### Test 2.4: View My Jobs
**Steps:**
1. As customer, after posting job
2. Tap "My Jobs"
3. See all posted jobs

**Expected Results:**
- ✅ All jobs listed with status
- ✅ Shows count of pending, in-progress, completed
- ✅ Each job shows title, description, budget, location
- ✅ Refresh button works
- ✅ Data refreshes when returning to screen

**Console Output:**
```
👀 MyJobsScreen: Screen focused, fetching jobs...
📤 GET /api/jobs/my
✅ 200 /api/jobs/my { data: [...] }
✅ MyJobsScreen: Got 2 jobs
```

---

## Test Suite 3: Job Discovery (Worker)

### Test 3.1: View Available Jobs
**Steps:**
1. Login as worker
2. Go to dashboard
3. Tap "View All Jobs" or go to "Available Jobs"

**Expected Results:**
- ✅ All pending jobs shown
- ✅ Customer's posted jobs appear here
- ✅ Jobs show: title, category, budget, location, description
- ✅ No hardcoded data
- ✅ Data refreshes on screen focus

**Console Output:**
```
👀 AvailableJobsScreen: Screen focused, fetching jobs...
📋 JobService: Fetching all jobs...
📤 GET /api/jobs
✅ 200 /api/jobs { success: true, data: [...] }
📋 JobService: Got 3 jobs
✅ AvailableJobsScreen: Got 3 available jobs
```

---

### Test 3.2: View Job Details
**Steps:**
1. From "Available Jobs", tap any job card
2. View full job details

**Expected Results:**
- ✅ All details loaded correctly
- ✅ No "Job not found" error
- ✅ Shows customer info
- ✅ "Accept Job" button visible
- ✅ Cannot go back without error

**Console Output:**
```
👷 Job Details Screen: Mounted with params: { jobId: "635f..." }
👷 Job Details Screen: Loading job details for jobId: 635f...
👷 Job Details Screen: Fetching job from API...
📤 GET /api/jobs/635f...
✅ 200 /api/jobs/635f...
✅ Job Details Screen: Job loaded successfully: { id: "635f...", title: "Need Electrician..." }
```

---

### Test 3.3: No "Job Not Found" Error
**Steps:**
1. Have multiple jobs available
2. Click on each job
3. Wait for load

**Expected Results:**
- ✅ All jobs load successfully
- ✅ No "Job not found" messages
- ✅ Proper _id to id conversion
- ✅ All job details correct

**This verifies the MongoDB ObjectId fix!**

---

## Test Suite 4: Job Acceptance & Workflow

### Test 4.1: Accept Job
**Steps:**
1. From job details, tap "Accept Job" button
2. Confirm acceptance

**Expected Results:**
- ✅ Loading state
- ✅ Alert: "You've accepted job. You'll start working now."
- ✅ Job status changes to "in_progress"
- ✅ Redirected to "In Progress" screen

**Console Output:**
```
👷 Job Details Screen: Accepting job: { jobId: "635f...", jobTitle: "Need Electrician..." }
📋 JobService: Accepting job 635f...
📤 PUT /api/jobs/635f.../accept
✅ 200 /api/jobs/635f.../accept
📋 JobService: Job accepted
👷 Job Details Screen: Job accepted successfully
```

**Verify in Database:**
```javascript
db.jobs.findOne({ _id: ObjectId("635f...") })
// Should have: status: "in_progress"

db.applications.findOne({ job: ObjectId("635f...") })
// Should have: status: "accepted", worker: ObjectId(worker)
```

---

### Test 4.2: Job Timer & In Progress Screen
**Steps:**
1. On "In Progress" screen (after accepting job)
2. Wait 10 seconds

**Expected Results:**
- ✅ Timer shows elapsed time (0:00, 0:01, ... 0:10)
- ✅ Job details displayed
- ✅ Notes input field visible
- ✅ "Complete Job" button visible

---

### Test 4.3: Complete Job
**Steps:**
1. On "In Progress" screen
2. Add notes: `"Completed the wiring installation"`
3. Tap "Complete Job"

**Expected Results:**
- ✅ Loading state
- ✅ Job marked as "completed"
- ✅ Alert: "Work completed successfully!"
- ✅ Redirected to "Job Completed" screen
- ✅ Show earnings

**Console Output:**
```
📋 JobService: Completing job 635f...
📤 PUT /api/jobs/635f.../complete { notes: "Completed..." }
✅ 200 /api/jobs/635f.../complete
✅ JobService: Job completed
```

**Verify in Database:**
```javascript
db.jobs.findOne({ _id: ObjectId("635f...") })
// Should have: status: "completed"

db.users.findOne({ _id: ObjectId(worker_id) })
// Should have wallet.pending increased by job budget
```

---

### Test 4.4: Completed Job Not in Available
**Steps:**
1. After completing job
2. Go back to "Available Jobs"

**Expected Results:**
- ✅ Completed job no longer appears
- ✅ Only pending jobs shown
- ✅ No refresh issues

---

## Test Suite 5: Error Handling

### Test 5.1: Network Error - Disconnect
**Steps:**
1. Go to "Available Jobs"
2. Disconnect from internet
3. Try to refresh

**Expected Results:**
- ✅ Error alert shown
- ✅ Clear message: Cannot connect to server
- ✅ Can tap retry when back online

**Console Output:**
```
📤 GET /api/jobs
❌ API Error: { networkError: "Cannot reach server - check API_BASE_URL" }
❌ AvailableJobsScreen: Error, Failed to load jobs
```

---

### Test 5.2: API Error - Wrong Credentials
**Steps:**
1. On login screen
2. Enter wrong email/password
3. Tap Login

**Expected Results:**
- ✅ Error alert: "Invalid email or password"
- ✅ Not logged in
- ✅ Can retry

---

### Test 5.3: Job Not Found (Deleted)
**Steps (Advanced):**
1. Get job ID from available jobs
2. Delete job from database manually
3. Try to access that job

**Expected Results:**
- ✅ Error alert: "Job not found"
- ✅ Can go back to list
- ✅ Job disappears from next refresh

---

## Test Suite 6: State Management & Data Refresh

### Test 6.1: Fresh Data on Screen Return
**Steps:**
1. Login as customer
2. Go to "My Jobs" - note job count
3. Go to "Post Job"
4. Post a new job
5. Automatically on "My Jobs"

**Expected Results:**
- ✅ New job appears in list
- ✅ Count increased
- ✅ No manual refresh needed
- ✅ Data is fresh

**This verifies useFocusEffect is working!**

---

### Test 6.2: Worker Dashboard Refresh
**Steps:**
1. Login as worker
2. Note "Available Jobs" count on dashboard
3. Have customer post new job
4. Go back to worker dashboard

**Expected Results:**
- ✅ Count updated
- ✅ New job visible
- ✅ Data auto-refreshed on focus

---

### Test 6.3: No Hardcoded Data
**Steps:**
1. Clear all jobs from database
2. Load app
3. Check "Available Jobs"

**Expected Results:**
- ✅ No jobs shown
- ✅ "No jobs available" message
- ✅ Not showing mock/hardcoded data
- ✅ Real data from API

---

## Test Suite 7: User Data

### Test 7.1: Display User Name
**Steps:**
1. Login as any user
2. View dashboard

**Expected Results:**
- ✅ Shows: `Welcome, [User Name]! 👋`
- ✅ Name is dynamic (from database)
- ✅ Changes after profile update

---

### Test 7.2: Display User Stats
**Steps:**
1. As worker, view dashboard
2. Check stats shown

**Expected Results:**
- ✅ Total Earnings: `Rs. [amount]`
- ✅ Jobs Done: `[count]`
- ✅ Rating: `[rating]⭐`
- ✅ All values from database

---

## Test Suite 8: Multiple User Scenarios

### Test 8.1: Two Users - Post & Accept
**Steps:**
1. On Device 1: Login as Customer
2. Post Job: "Need Painter"
3. On Device 2: Login as Worker
4. See job in Available Jobs
5. Accept job
6. Back on Device 1: Refresh "My Jobs"

**Expected Results:**
- ✅ Device 2 can see Device 1's job
- ✅ Job status changes across devices when accepted
- ✅ Real-time synchronization works

---

### Test 8.2: Three Users - Multiple Jobs
**Steps:**
1. Customer 1 posts Job A
2. Customer 2 posts Job B
3. Worker sees both
4. Worker accepts Job A
5. Customer 1 sees Job A as "in_progress"
6. Customer 2 still sees Job B as "pending"

**Expected Results:**
- ✅ All users see correct status
- ✅ No cross-contamination of data
- ✅ Each job tracked independently

---

## Test Suite 9: Navigation Flows

### Test 9.1: Complete Customer Flow
```
Login 
  ↓
Home/Dashboard 
  ↓
Post Job 
  ↓
My Jobs (job shows) 
  ↓
Refresh 
  ↓
Job still shows with updated status
```

**Expected**: Every step works without errors

---

### Test 9.2: Complete Worker Flow
```
Login 
  ↓
Worker Dashboard 
  ↓
Available Jobs 
  ↓
Job Details 
  ↓
Accept Job 
  ↓
In Progress 
  ↓
Complete Job 
  ↓
Job Completed 
  ↓
Earnings shown
```

**Expected**: Every step works without errors

---

### Test 9.3: Logout & Login Again
```
Any screen 
  ↓
Logout (with confirmation) 
  ↓
Login screen (no back button works) 
  ↓
Login with different account 
  ↓
New dashboard (with new user's data)
```

**Expected**: Clean transition, no old data visible

---

## Performance Tests

### Test P1: Load 100 Jobs
**Steps:**
1. Create 100 jobs in database
2. Load "Available Jobs"

**Expected Results:**
- ✅ Loads within 5 seconds
- ✅ Scrolling smooth
- ✅ No crashes

---

### Test P2: Memory Usage
**Steps:**
1. Load app
2. Navigate between screens 10 times
3. Check memory (Expo dev tools)

**Expected Results:**
- ✅ No memory leaks
- ✅ Memory stable
- ✅ App responsive

---

## Final Verification Checklist

- [ ] All 5 issues from requirements are fixed
- [ ] Customer can post job
- [ ] Job appears to worker
- [ ] Worker can accept job
- [ ] Job status updates
- [ ] Logout works
- [ ] Token managed correctly
- [ ] No hardcoded data
- [ ] Error handling works
- [ ] Data refreshes properly
- [ ] No "Job not found" errors
- [ ] User data displayed dynamically
- [ ] Navigation flows correct
- [ ] App doesn't crash
- [ ] Network errors handled
- [ ] Multiple users can interact
- [ ] All console logs are present
- [ ] No warnings in console

---

## Sign Off

Once ALL tests pass:

✅ App is **Production Ready**
✅ Ready to **Deploy**
✅ Ready for **User Testing**

**Date Tested**: ___________
**Tested By**: ___________
**Issues Found**: ___________
**Ready for Production**: YES / NO
