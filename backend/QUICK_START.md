# KarigarUstaad Backend - Quick Start Guide

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)
- **Postman** (optional, for API testing) - [Download](https://www.postman.com/downloads/)

## Installation Steps

### 1. Install MongoDB

**On Windows:**
- Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
- Run the installer and follow the setup wizard
- MongoDB will start as a service automatically

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### 2. Clone/Setup Backend Project

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- nodemon (dev)

### 4. Configure Environment Variables

The `.env` file is already created with default values:

```
MONGODB_URI=mongodb://localhost:27017/karigarustaad
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**For Production:**
- Change `JWT_SECRET` to a strong random string
- Update `MONGODB_URI` to your production MongoDB URL
- Set `NODE_ENV=production`

### 5. Start MongoDB (if not running as service)

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
brew services start mongodb-community
# or
mongod
```

### 6. Start the Server

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
Server started on port 5000
Environment: development
MongoDB Connected: localhost
```

## Quick API Test

### 1. Register as Worker

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Carpenter",
    "email": "john@example.com",
    "password": "password123",
    "role": "worker"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Carpenter",
    "email": "john@example.com",
    "role": "worker"
  }
}
```

### 2. Register as Employer

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Home Repairs Co",
    "email": "employer@example.com",
    "password": "password123",
    "role": "employer"
  }'
```

### 3. Create a Job (as Employer)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Fix Kitchen Cabinet",
    "description": "Need to fix broken cabinet door",
    "budget": 150,
    "location": "New York",
    "category": "Carpentry",
    "requiredSkills": ["Carpentry", "Woodwork"]
  }'
```

### 4. Get All Jobs

```bash
curl http://localhost:5000/api/jobs
```

### 5. Apply to Job (as Worker)

```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_WORKER_TOKEN" \
  -d '{
    "coverLetter": "I am interested in this job"
  }'
```

Replace `JOB_ID` with actual job ID from step 3.

## Using Postman

1. Open Postman
2. Click **Import** 
3. Select the file: `KarigarUstaad_API.postman_collection.json`
4. Set variables in Postman:
   - `BASE_URL`: `http://localhost:5000/api`
   - `TOKEN`: Your JWT token from login
   - `JOB_ID`: Job ID from API response
   - `APPLICATION_ID`: Application ID from API response

5. Start testing endpoints from the collection

## Verify Installation

Check if server is running:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── jobController.js      # Job management logic
│   └── applicationController.js # Application logic
├── models/
│   ├── User.js               # User schema
│   ├── Job.js                # Job schema
│   └── Application.js        # Application schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── jobRoutes.js          # Job endpoints
│   └── applicationRoutes.js  # Application endpoints
├── middleware/
│   └── auth.js               # JWT authentication
├── utils/
│   └── validators.js         # Validation utilities
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
├── server.js                 # Main entry point
├── README.md                 # Full documentation
├── API_DOCUMENTATION.md      # API reference
├── API_TESTS.js              # Test examples
└── KarigarUstaad_API.postman_collection.json # Postman collection
```

## Common Issues

### Issue: MongoDB Connection Error
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check if `MONGODB_URI` in `.env` is correct
- Verify MongoDB port (default: 27017)

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change PORT in .env to an available port
PORT=5001

# Or kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: JWT Token Invalid/Expired
**Solution:**
- Get a new token by logging in again
- Check `JWT_EXPIRE` in `.env` (default: 7d)

### Issue: CORS Errors
**Solution:**
- CORS is already enabled in `server.js`
- If frontend is on different domain, update CORS settings

## API Endpoints Summary

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/me` | Protected | Get current user |
| GET | `/jobs` | Public | Get all jobs |
| GET | `/jobs/:id` | Public | Get job details |
| POST | `/jobs` | Employer | Create job |
| GET | `/jobs/my` | Employer | Get my jobs |
| PATCH | `/jobs/:id` | Employer | Update job |
| DELETE | `/jobs/:id` | Employer | Delete job |
| GET | `/jobs/:id/applicants` | Employer | View applicants |
| POST | `/applications/:jobId/apply` | Worker | Apply to job |
| GET | `/applications/my` | Worker | My applications |
| GET | `/applications/:id` | Protected | Application details |
| PATCH | `/applications/:id/status` | Employer | Update application |
| DELETE | `/applications/:id/withdraw` | Worker | Withdraw application |

## Next Steps

1. ✅ Backend API is running
2. 📱 Connect your mobile app to this API
3. 🔐 Implement proper JWT token storage in mobile app
4. 🗄️ Add database backups for production
5. 🚀 Deploy to production server

## Support

For detailed API documentation, see `API_DOCUMENTATION.md`
For testing examples, see `API_TESTS.js`

---

**Backend Status:** ✅ Ready to use
**Version:** 1.0.0
**Last Updated:** 2024
