# 🔧 Quick Fix Reference

## Backend Changes

### 1. server.js
```javascript
// ADDED:
const userRoutes = require('./routes/userRoutes');

// CHANGED:
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  // ← NEW LINE
app.use('/api/jobs', jobRoutes);
```

### 2. controllers/authController.js
```javascript
// ADDED logout function:
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

### 3. routes/authRoutes.js
```javascript
// ADDED import:
const { register, login, getCurrentUser, logout } = ...;

// ADDED route:
router.post('/logout', protect, logout);
```

### 4. models/Job.js
```javascript
// ADDED field after employer:
assignedWorker: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
},

// ALREADY EXISTED (good!):
toJSON: {
  transform(doc, ret) {
    ret.id = ret._id;  // Converts _id to id
    delete ret._id;
  },
},
```

### 5. routes/jobRoutes.js
```javascript
// REORDERED to put specific routes BEFORE :id routes:
router.post('/', protect, authorizeRoles('employer', 'customer'), createJob);
router.get('/my', protect, authorizeRoles('employer', 'customer'), getMyJobs);

router.put('/:id/accept', protect, authorizeRoles('worker'), acceptJob);
router.put('/:id/complete', protect, authorizeRoles('worker'), completeJob);
router.post('/:id/apply', protect, authorizeRoles('worker'), applyJob);

router.get('/:id/applicants', protect, authorizeRoles('employer'), getJobApplicants);
router.patch('/:id', protect, authorizeRoles('employer'), updateJob);
// ... other routes

router.get('/', getAllJobs);
router.get('/:id', getJobById);  // MUST be last
```

---

## Frontend Changes

### 1. src/services/authService.ts
```typescript
// ADDED constants:
const USER_DATA_KEY = 'karigarUserData';

// UPDATED loginUser & registerUser:
await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));

// UPDATED logoutUser:
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/auth/logout', {});
  } catch (error) {
    console.warn('⚠️  Logout endpoint failed (clearing locally anyway):', error);
  }
  await clearAuthToken();
  await AsyncStorage.removeItem(USER_DATA_KEY);
};

// ADDED getStoredUser:
export const getStoredUser = async (): Promise<UserPayload | null> => {
  const userData = await AsyncStorage.getItem(USER_DATA_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse stored user data', error);
      return null;
    }
  }
  return null;
};
```

### 2. src/services/jobService.ts
```typescript
// ADDED normalizer functions:
const normalizeJob = (job: any): JobItem => {
  if (!job.id && job._id) {
    job.id = job._id;
  }
  return job as JobItem;
};

const normalizeJobs = (jobs: any[]): JobItem[] => {
  return jobs.map(normalizeJob);
};

// UPDATED all functions to normalize:
export const getAllJobs = async (): Promise<JobItem[]> => {
  const response = await api.get<{ success: boolean; data: JobItem[] }>('/jobs');
  return normalizeJobs(response.data.data);  // ← normalization
};

export const createJob = async (payload: JobPayload): Promise<JobItem> => {
  const response = await api.post<{ success: boolean; data: JobItem }>('/jobs', payload);
  return normalizeJob(response.data.data);  // ← normalization
};

// Similar for: getMyJobs, getJobById, completeJob, acceptJob
```

### 3. src/services/userService.ts
```typescript
// ADDED normalizer:
const normalizeUser = (user: any): UserProfile => {
  if (!user.id && user._id) {
    user.id = user._id;
  }
  return user as UserProfile;
};

// UPDATED all functions:
export const getMe = async (): Promise<UserProfile> => {
  const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
  return normalizeUser(response.data.data);  // ← normalization
};

// Similar for: updateMe, getWorkerProfile, getCustomerProfile
```

### 4. app/(auth)/login.tsx
```typescript
// Already correct, just note it handles:
if (response.user.role === 'worker') {
  router.replace('/(worker)/dashboard');
} else if (response.user.role === 'employer') {
  router.replace('/(employer)/dashboard');
} else {
  router.replace('/(customer)/home');
}
```

### 5. app/(worker)/profile.tsx
```typescript
// UPDATED logout handler:
const handleLogout = async () => {
  Alert.alert('Logout', 'Are you sure?', [
    {
      text: 'Logout',
      onPress: async () => {
        try {
          await logoutUser();
          router.replace('/(auth)/login');  // No going back!
        } catch (error) {
          Alert.alert('Error', 'Failed to logout');
        }
      },
    },
  ]);
};
```

### 6. app/(customer)/profile.tsx
```typescript
// SAME UPDATE as worker profile
```

### 7. app/(employer)/profile.tsx
```typescript
// SAME UPDATE as worker profile
```

### 8. app/(customer)/my-jobs.tsx
```typescript
// ADDED import:
import { useFocusEffect } from 'expo-router';

// CHANGED useEffect to useFocusEffect:
useFocusEffect(
  React.useCallback(() => {
    console.log('Screen focused, fetching jobs...');
    fetchJobs();
  }, [])
);

// Result: Data refreshes every time user navigates to this screen
```

### 9. app/(worker)/available-jobs.tsx
```typescript
// ADDED import:
import { useFocusEffect } from 'expo-router';

// CHANGED useEffect to useFocusEffect:
useFocusEffect(
  React.useCallback(() => {
    console.log('Screen focused, fetching jobs...');
    fetchAvailableJobs();
  }, [])
);

// Result: Always shows latest pending jobs
```

### 10. app/(customer)/post-job.tsx
```typescript
// Already correct - has proper navigation:
Alert.alert('Success', 'Job posted successfully.', [
  {
    text: 'OK',
    onPress: () => {
      resetForm();
      router.replace('/(customer)/my-jobs');  // Navigate and refresh
    },
  },
]);
```

---

## Type Updates

### JobItem interface
```typescript
export interface JobItem {
  id: string;
  _id?: string;  // ← Added for compatibility
  title: string;
  description: string;
  // ... rest of fields
  assignedWorker?: string;  // ← Added
  createdAt?: string;       // ← Added
  updatedAt?: string;       // ← Added
}
```

### UserProfile interface
```typescript
export interface UserProfile {
  id: string;
  _id?: string;  // ← Added for compatibility
  name: string;
  email: string;
  // ... all fields marked optional with ? except id
}
```

---

## Database Queries to Verify

### Check jobs are being saved
```javascript
db.jobs.find().pretty()

// Should show:
{
  _id: ObjectId(...),
  title: "...",
  description: "...",
  budget: 5000,
  location: "...",
  employer: ObjectId(...),
  status: "pending",
  assignedWorker: null,
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

### Check user has been created
```javascript
db.users.findOne({ email: "test@example.com" })
```

### Check application was created
```javascript
db.applications.find({ job: ObjectId("...") }).pretty()
```

---

## API Endpoints Summary

### Auth
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/logout` | ✅ | Logout (new!) |

### Jobs
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/jobs` | ❌ | All pending jobs |
| POST | `/api/jobs` | ✅ | Create job |
| GET | `/api/jobs/my` | ✅ | My jobs |
| GET | `/api/jobs/:id` | ❌ | Job details |
| PUT | `/api/jobs/:id/accept` | ✅ | Accept job (worker) |
| PUT | `/api/jobs/:id/complete` | ✅ | Complete job (worker) |
| PUT | `/api/jobs/:id/status` | ✅ | Update status (employer) |

### Users
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/users/me` | ✅ | Get profile |
| PUT | `/api/users/me` | ✅ | Update profile |

---

## Testing Checklist

- [ ] Customer posts job → Job appears in DB
- [ ] Worker sees job → Job visible in available list
- [ ] Worker accepts → Job status changes to 'in_progress'
- [ ] Worker completes → Job status changes to 'completed'
- [ ] Logout button → Clears token, redirects to login
- [ ] Cannot go back → No navigation history after logout
- [ ] Job not found error → Fixed (using proper ObjectId)
- [ ] Network errors → Shows user-friendly message
- [ ] Token included → All requests have Authorization header
- [ ] Data refreshes → useFocusEffect triggers on screen navigation

---

## Common Commands

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd mobile-app
npx expo start
```

### Test API
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/jobs
```

### Check Logs
```bash
# Backend: Check console
# Frontend: Check expo console or device logs
```

---

## Before Deploying

1. [ ] Test all flows locally
2. [ ] Check MongoDB is accessible
3. [ ] Verify JWT_SECRET is set
4. [ ] Update API_URL to production
5. [ ] Check CORS settings
6. [ ] Verify all routes are registered
7. [ ] Test logout thoroughly
8. [ ] Check token expiry handling
9. [ ] Verify error messages are user-friendly
10. [ ] Monitor logs on first deploy

---

**All Changes Are Non-Breaking! ✅**

Your app is fully backward compatible. All old data will still work correctly with the new system.
