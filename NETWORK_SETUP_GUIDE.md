# 🔧 Network Configuration Guide for KarigarUstaad

## Overview
This guide helps you configure the connection between your Expo React Native app and Node.js backend server for both local development and testing on physical devices/emulators.

---

## 📋 Prerequisites
- Backend server running on your local machine (Windows, Mac, or Linux)
- MongoDB running and accessible
- Mobile app (Expo) ready to connect to the backend
- Both machines on the same local network (or same machine for web testing)

---

## 🚀 Quick Setup

### Step 1: Find Your Local IP Address (Windows)
1. Open **Command Prompt** (Win + R, type `cmd`)
2. Type: `ipconfig`
3. Look for your network adapter (usually "Ethernet" or "Wireless LAN")
4. Find **IPv4 Address** (format: `192.168.x.x`, `10.x.x.x`, etc.)
5. **Copy this IP** - you'll use it in the next steps

Example output:
```
Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . . . . : 192.168.1.100
```

### Step 2: Verify Backend is Listening on 0.0.0.0
The backend server has been updated to listen on `0.0.0.0` instead of just `localhost`.
This allows external devices to connect to it.

**Verify in your terminal where the backend is running:**
```
✅ Server started on 0.0.0.0:5000
📍 Available at http://localhost:5000 (local machine)
📱 For mobile/emulator, use your local IP: http://<YOUR_IP>:5000
```

### Step 3: Configure Frontend API URL
Edit the file: `mobile-app/.env`

Replace `EXPO_PUBLIC_API_URL` based on your setup:

#### Option A: Local Machine Development (Web/Simulator on Same Machine)
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

#### Option B: Physical Device or Emulator on Different Machine
```env
# Replace 192.168.1.100 with YOUR local IP from Step 1
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

#### Option C: Android Emulator on Same Machine (Special Case)
```env
# Android emulator on the same machine uses this special IP
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
```

---

## 🧪 Testing the Connection

### Test 1: Backend is Running
From your machine running the backend, open your browser:
- Visit: `http://localhost:5000/api`
- You should see "Cannot GET /api" (that's normal - it means the backend is running)
- Check the terminal - you should see logs of the request

### Test 2: Backend is Accessible from Your IP
From ANY machine on the same network:
- Visit: `http://<YOUR_IP_FROM_STEP_1>:5000/api`
- Example: `http://192.168.1.100:5000/api`
- You should see "Cannot GET /api" (that's normal)
- Check the backend terminal for logs

### Test 3: Mobile App Can Reach Backend
Once you've configured `.env`:

1. **For Expo CLI:**
   ```bash
   cd mobile-app
   npx expo start
   ```

2. **In the app:**
   - Create a new job or try any API call
   - Check the app console for logs (Expo Dev Tools)
   - Check the backend terminal for incoming request logs

---

## 📊 Common Network Scenarios

### Scenario 1: Web Development (Everything on Local Machine)
```
┌─────────────────────┐
│  Your Windows PC    │
├─────────────────────┤
│ Browser on :3000    │  ─→ API at localhost:5000
│ OR Simulator on     │
└─────────────────────┘

.env Configuration:
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

### Scenario 2: Physical Device on Same Network
```
┌─────────────────────┐         ┌────────────────────┐
│  Your Windows PC    │         │  Android/iPhone    │
│  (Backend Server)   │  ← → │  (Mobile App)      │
│  IP: 192.168.1.100  │         │  Same WiFi Network │
└─────────────────────┘         └────────────────────┘

.env Configuration:
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

### Scenario 3: Android Emulator (Same Machine)
```
┌──────────────────────────┐
│  Your Windows PC         │
├──────────────────────────┤
│ ┌────────────────────┐   │
│ │ Android Emulator   │   │
│ │ (runs on VM)       │ ─→ API at 10.0.2.2
│ └────────────────────┘   │
│ ▲ Backend at localhost   │
└──────────────────────────┘

.env Configuration:
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
```

---

## 🔍 Debugging

### Check Backend is Running
```bash
# In backend folder
node server.js

# Expected output:
✅ Server started on 0.0.0.0:5000
📍 Available at http://localhost:5000 (local machine)
📱 For mobile/emulator, use your local IP: http://<YOUR_IP>:5000
🌍 Environment: development
🗄️  Database: MongoDB Connected
```

### Check MongoDB is Connected
```bash
# In backend terminal, you should see:
[INFO] Connected to MongoDB

# If you see errors, check:
1. Is MongoDB service running? (Services → MongoDB)
2. Is MONGODB_URI correct in .env?
3. Can you connect locally? `mongo` in terminal
```

### View Network Logs
The app now logs all API calls. In Expo, you'll see:

**Frontend Logs (When Making API Call):**
```
📤 POST /jobs
   data: { ... }
   hasAuth: true

✅ 201 http://192.168.1.100:5000/api/jobs
   { success: true, data: { ... } }
```

**Backend Logs (Incoming Request):**
```
📨 [2024-01-15T10:30:45Z] POST /api/jobs
   Client IP: 192.168.1.105
   Body: { title: "Fix Door Lock", ... }...
   ✅ Status: 201 | Duration: 45ms
```

---

## 🆘 Troubleshooting

### Problem: "Cannot reach server - check API_BASE_URL"
**Cause:** App cannot connect to backend
**Solution:**
1. Check `.env` has correct IP address
2. Verify backend is running: `node server.js`
3. Verify MongoDB is running
4. Try `http://localhost:5000/api` from your browser first
5. Check backend terminal for connection errors

### Problem: Mobile App Stuck on Loading
**Cause:** API call timing out
**Solution:**
1. Check `.env` configuration
2. Look at backend logs for incoming requests
3. If no logs appear, network connectivity is broken
4. Restart both frontend and backend

### Problem: MongoDB Connection Error
**Cause:** Backend can't connect to MongoDB
**Solution:**
1. Check MongoDB is running (Windows Services)
2. Verify `MONGODB_URI` in `backend/.env`
3. Default is: `mongodb://localhost:27017/karigarustaad`
4. Try connecting directly: `mongo` in cmd

### Problem: "Job posted but not found when navigating"
**Cause:** Job ID not passing correctly or API latency
**Solution:**
1. Check console logs for jobId in navigation parameters
2. Ensure job creation response includes job ID
3. Check backend logs show job was created

---

## 📝 Environment Files Reference

### backend/.env
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/karigarustaad
JWT_SECRET=your_jwt_secret_key_here
```

### mobile-app/.env
```ini
# For web/local simulator:
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# For physical device (replace IP with your actual local IP):
# EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api

# For Android emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

NODE_ENV=development
```

---

## ✅ Verification Checklist

- [ ] Backend running and listening on 0.0.0.0:5000
- [ ] MongoDB is running and connected
- [ ] `.env` file exists in both backend and mobile-app folders
- [ ] `EXPO_PUBLIC_API_URL` in mobile-app/.env is correct for your setup
- [ ] You can see logs in both frontend and backend terminals
- [ ] Test job creation from app and verify in backend logs
- [ ] Navigate to job details and verify job loads correctly

---

## 🎯 Next Steps

1. **Update `.env`** with your local IP address
2. **Restart backend:** `node server.js`
3. **Restart app:** `npx expo start` (in mobile-app folder)
4. **Create a test job** and watch the console logs
5. **Check backend terminal** for request logs
6. **Navigate through the app** and verify all features work

---

## 📞 Need Help?

Check the console logs in:
- **Frontend:** Expo DevTools console or terminal where you ran `npx expo start`
- **Backend:** Terminal where you ran `node server.js`

All API calls are logged with 📤📨✅❌ emojis for easy identification.

