# KarigarUstaad: Dummy Data to Database-Driven Conversion Guide

## Overview
This guide documents the conversion of the KarigarUstaad mobile app from dummy data to a fully database-driven system with JWT authentication and API integration.

## What Was Changed

### 1. Service Layer (`mobile-app/src/services/`)

#### ✅ jobService.ts
- **Removed:** Dummy data imports and fallback to `dummyJobs`
- **Removed:** `getLocalJobItem()` helper function
- **Changed:** `getMyJobs()` - No longer returns fallback dummy data on error
- **Changed:** `getJobById()` - Directly calls API without checking dummy data first
- **Changed:** `completeJob()` - Removed local dummy job handling
- **Changed:** `acceptJob()` - Removed local dummy job handling
- **Added:** `customerId` field to `JobPayload` interface (optional, auto-set by backend)

#### ✅ authService.ts
- No changes needed - already uses real API endpoints

#### ✅ userService.ts
- No changes needed - already uses real API endpoints

#### ✅ applicationService.ts
- No changes needed - already uses real API endpoints

---

### 2. Authentication Screens (`mobile-app/app/(auth)/`)

#### ✅ login.tsx
- **Changed:** From simulated login to actual `loginUser()` API call
- **Added:** Role-based navigation after login
  - Workers → `/(worker)/dashboard`
  - Employers → `/(employer)/dashboard`
  - Customers → `/(customer)/home`
- **Added:** Error handling and user feedback

#### ✅ signup.tsx
- **Changed:** From simulated signup to multi-step flow
- **New Flow:**
  1. User enters name, email, password
  2. Validates email format and password length (min 6)
  3. Navigates to `select-role` with parameters
  4. No actual API call yet (deferred to register screen)

#### ✅ select-role.tsx
- **Updated:** To pass user data (name, email, password) as route parameters
- **Flow:** Passes all data to register screen with selected role

#### ✅ register.tsx
- **Enhanced:** Pre-fills form fields from route parameters
- **Added:** Form validation (email format, password length)
- **Changed:** Worker navigation to `/(worker)/dashboard` (was `/(worker)/home`)
- **Changed:** Calls `registerUser()` with complete user data and role
- **Added:** Comprehensive error handling and logging

---

### 3. Customer Screens (`mobile-app/app/(customer)/`)

#### ✅ home.tsx
- **Changed:** Removed `dummyCategories` usage
- **Added:** Static `CATEGORIES` array (configuration data, not dummy)
- **Changed:** Removed `getFeaturedWorkers()` call
- **Added:** API call to `getRecommendedWorkers()` 
- **Added:** User data fetching via `getMe()`
- **Added:** Dynamic user name and location display
- **Added:** Loading and error states
- **Added:** Proper error handling with graceful fallback

#### ✅ my-jobs.tsx
- **Already Dynamic:** No changes needed - already uses `getMyJobs()` API
- ✅ Properly filters by current user (backend handles this via JWT)
- ✅ Shows only user's posted jobs

#### ✅ post-job.tsx
- **Already Dynamic:** No changes needed
- ✅ Uses `createJob()` API
- ✅ customerId automatically set by backend from JWT token
- ✅ Proper validation and error handling

---

### 4. Worker Screens (`mobile-app/app/(worker)/`)

#### ✅ available-jobs.tsx
- **Changed:** Removed `dummyJobs` import
- **Changed:** Now fetches available jobs from `getAllJobs()` API
- **Added:** Loading state with spinner
- **Added:** Error state with retry button
- **Added:** Proper error handling
- **Added:** Data fetching on component mount
- **Added:** Refresh button (gear icon → refresh icon)

#### ✅ dashboard.tsx
- **Changed:** Completely rewritten to use real data
- **Added:** User profile data fetching via `getMe()`
- **Added:** Job availability fetching via `getAllJobs()`
- **Changed:** Dynamic greeting with user's actual name
- **Changed:** Dynamic earnings display from wallet data
- **Changed:** Dynamic stats (completed jobs, pending balance, rating)
- **Changed:** Dynamic skills display from user profile
- **Added:** Loading state
- **Added:** Error handling

#### ✅ job-details.tsx
- **Already Dynamic:** No changes needed
- ✅ Uses `getJobById()` and `acceptJob()` API calls
- ✅ Proper error handling

---

## Database Schema Expectations

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String ('worker' | 'employer' | 'customer'),
  profileImage: String,
  phone: String,
  bio: String,
  skills: [String],
  experience: String,
  location: String,
  rating: Number,
  totalReviews: Number,
  completedJobs: Number,
  wallet: {
    balance: Number,
    pending: Number
  },
  createdAt: Date
}
```

### Job Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  budget: Number,
  location: String,
  requiredSkills: [String],
  customerId: ObjectId (references User),
  workerId: ObjectId (references User, null if not accepted),
  status: String ('pending' | 'accepted' | 'in_progress' | 'completed' | 'paid'),
  applicationCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Integration Points

### Authentication
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/auth/register` | POST | ✅ Working | Used in register.tsx |
| `/auth/login` | POST | ✅ Working | Used in login.tsx |
| `/auth/me` | GET | ✅ Working | Used in multiple screens |

### Jobs
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/jobs` | GET | ✅ Working | Used in available-jobs.tsx, home.tsx |
| `/jobs/:id` | GET | ✅ Working | Used in job-details.tsx |
| `/jobs/my` | GET | ✅ Working | Used in my-jobs.tsx |
| `/jobs` | POST | ✅ Working | Used in post-job.tsx |
| `/jobs/:id/accept` | PUT | ✅ Working | Used in job-details.tsx |
| `/jobs/:id/complete` | PUT | ✅ Working | Worker completion |
| `/jobs/:id/status` | PUT | ✅ Working | Status updates |

### Users
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/users/me` | GET | ✅ Working | Used in dashboard.tsx, home.tsx |
| `/users/me` | PUT | ✅ Working | Profile updates |
| `/users/worker/:id` | GET | ✅ Working | Worker profile view |

---

## Testing Checklist

### 1. Authentication Flow ✅
- [ ] **Sign Up Flow**
  - [ ] Navigate to signup screen
  - [ ] Fill in name, email, password
  - [ ] Select role (Worker/Employer)
  - [ ] Account created successfully
  - [ ] Redirected to appropriate dashboard
  - [ ] Check backend logs for user creation

- [ ] **Login Flow**
  - [ ] Login with correct credentials
  - [ ] Token stored in AsyncStorage
  - [ ] Redirected to correct role-based screen
  - [ ] Login with incorrect password → Error shown
  - [ ] Login with non-existent email → Error shown

- [ ] **Token Persistence**
  - [ ] Close and reopen app after login
  - [ ] Still logged in (token in AsyncStorage)
  - [ ] User data loads correctly

- [ ] **Logout**
  - [ ] Token cleared from AsyncStorage
  - [ ] Redirected to login screen

### 2. Customer Flow ✅
- [ ] **Home Screen**
  - [ ] User name displays correctly
  - [ ] User location displays correctly
  - [ ] Categories load and display
  - [ ] Recommended workers show up
  - [ ] No dummy data visible

- [ ] **Post Job**
  - [ ] Fill job form with all required fields
  - [ ] Submit job
  - [ ] Verify in backend that `customerId` is set to current user
  - [ ] Job appears in "My Jobs" list

- [ ] **My Jobs**
  - [ ] Shows only current user's posted jobs
  - [ ] Not showing other users' jobs
  - [ ] Job status tracking works
  - [ ] Job count updates correctly

- [ ] **Service Details**
  - [ ] Click on recommended worker
  - [ ] Worker profile loads from API
  - [ ] Real data displays (not dummy)

### 3. Worker Flow ✅
- [ ] **Dashboard**
  - [ ] User name displays dynamically
  - [ ] Earnings data shows (wallet balance)
  - [ ] Completed jobs count displays
  - [ ] Skills display from profile
  - [ ] Available jobs count shows

- [ ] **Available Jobs**
  - [ ] Shows real jobs from database
  - [ ] Filters by pending status
  - [ ] Jobs load on screen enter
  - [ ] Can refresh to reload jobs

- [ ] **Job Details**
  - [ ] View job details (title, budget, location, description)
  - [ ] Customer info displays
  - [ ] All real data from API

- [ ] **Accept Job**
  - [ ] Click "Accept Job" button
  - [ ] Backend updates workerId and status
  - [ ] Navigate to "In Progress"
  - [ ] Job no longer appears in "Available Jobs"
  - [ ] Appears in "In Progress" list

- [ ] **In Progress Jobs**
  - [ ] Only shows jobs with workerId = current user
  - [ ] Status is "in_progress" or "accepted"
  - [ ] Can complete job from here

### 4. Employer Flow ✅
- [ ] **Dashboard**
  - [ ] Shows jobs posted by current user
  - [ ] Job statistics display correctly

- [ ] **Post Job**
  - [ ] Same as customer flow
  - [ ] Job appears in job listings

- [ ] **Applicants**
  - [ ] View applications for posted jobs
  - [ ] Accept/Reject applications
  - [ ] Status updates reflected in UI

### 5. Error Handling ✅
- [ ] **Network Errors**
  - [ ] API unreachable → User sees error message
  - [ ] Can retry action
  - [ ] No crashes or undefined states

- [ ] **Validation Errors**
  - [ ] Empty fields → Form validation error
  - [ ] Invalid email → Email validation error
  - [ ] Short password → Password validation error

- [ ] **Authentication Errors**
  - [ ] Expired token → Redirected to login
  - [ ] Invalid credentials → Error alert
  - [ ] 401 Unauthorized → Token cleared, login redirect

- [ ] **API Errors**
  - [ ] 404 Not Found → Friendly error message
  - [ ] 500 Server Error → Retry option shown
  - [ ] Validation errors from API → Displayed to user

### 6. Data Consistency ✅
- [ ] **Job Posting**
  - [ ] `customerId` properly set to logged-in user ID
  - [ ] Not possible to post job for another user
  - [ ] MongoDB ObjectId used throughout

- [ ] **Job Acceptance**
  - [ ] `workerId` set to accepting worker's ID
  - [ ] Status changed to "in_progress"
  - [ ] Worker and customer both see updated status

- [ ] **My Jobs Filtering**
  - [ ] Only shows logged-in user's jobs
  - [ ] Backend enforces via JWT token
  - [ ] Not possible to see other users' jobs via API

---

## Environment Setup

### Backend Requirements
```bash
# .env file should have:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/karigarustaad
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Mobile App Requirements
```bash
# .env or .env.local in mobile-app directory:
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_IP:5000/api
```

For local development:
- Use `http://localhost:5000/api` (from simulator)
- Use `http://192.168.x.x:5000/api` (from physical device, replace x.x with your IP)

---

## Debugging Tips

### 1. Check Console Logs
- Backend: `console.log` with emoji prefixes
  - 🔧 Configuration
  - 🔑 Authentication
  - 📤 Outgoing requests
  - ✅ Successful responses
  - ❌ Errors

- Mobile: Similar emoji prefixes in app logs

### 2. Test API Directly
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Test getting jobs (with token)
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Check AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// In console or debugger:
const token = await AsyncStorage.getItem('karigarAuthToken');
console.log('Token:', token);
```

### 4. Monitor Network Requests
- Use React Native Debugger
- Check browser DevTools Network tab
- Enable request logging in `api.ts`

---

## Migration Checklist

- [ ] All dummy data removed from service methods
- [ ] All screens updated to use API endpoints
- [ ] Authentication flow working end-to-end
- [ ] Error handling implemented throughout
- [ ] AsyncStorage properly manages tokens
- [ ] customerId automatically set in job creation
- [ ] My Jobs filters by user
- [ ] Job acceptance updates workerId
- [ ] User names display dynamically
- [ ] All loading states implemented
- [ ] All error states with retry options
- [ ] MongoDB ObjectIds used everywhere
- [ ] JWT token included in all protected requests
- [ ] 401 responses trigger re-authentication
- [ ] No console errors or warnings

---

## Common Issues & Solutions

### Issue: "Cannot read property 'data' of undefined"
**Solution:** Check API response structure. Backend should return `{ success: true, data: {...} }`

### Issue: "No jobs available" even though jobs exist
**Solution:** Check JWT token is being sent. Verify in network requests that Authorization header is present.

### Issue: App crashes on login
**Solution:** Ensure role navigation paths exist: `/(customer)/home`, `/(worker)/dashboard`, `/(employer)/dashboard`

### Issue: Jobs show dummy data still
**Solution:** Ensure jobService imports removed and services fallback logic removed.

### Issue: "Cannot find module" errors
**Solution:** Ensure all imports use correct paths with `@/` alias for src directory

---

## Performance Considerations

1. **Caching**: Consider implementing React Query or SWR for better data caching
2. **Pagination**: For large job lists, implement pagination in getAllJobs
3. **Infinite Scroll**: Consider for infinite scrolling job lists
4. **Image Loading**: Add image optimization for worker avatars
5. **API Rate Limiting**: Add request deduplication to prevent duplicate API calls

---

## Next Steps (Future Enhancements)

1. **Payment Integration**: Integrate Stripe/JazzCash for payments
2. **Reviews System**: Implement reviews for workers
3. **Chat System**: Real-time messaging between workers and customers
4. **Notifications**: Push notifications for job updates
5. **Admin Dashboard**: Admin panel for system management
6. **Analytics**: Track user activity and system health
7. **Search & Filters**: Advanced search and filtering for jobs
8. **Recommendations**: ML-based worker recommendations

---

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify backend is running at correct URL
3. Check MongoDB connection
4. Verify JWT_SECRET is configured
5. Check AsyncStorage has token after login
6. Verify API endpoints match backend routes

