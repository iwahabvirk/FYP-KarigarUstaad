# KarigarUstaad Backend API

Complete REST API for the KarigarUstaad job marketplace application.

## Features

- **User Authentication**: Register and login with JWT
- **Job Management**: Post, view, update, and delete jobs
- **Job Applications**: Apply to jobs, track applications
- **Role-Based Access**: Different features for workers and employers
- **Secure Endpoints**: Protected routes with JWT middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/karigarustaad
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

4. Start MongoDB locally:
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "worker"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Jobs

#### Get All Jobs (Public)
```
GET /api/jobs?category=Carpentry&search=paint&minBudget=100&maxBudget=500
```

#### Get Job by ID
```
GET /api/jobs/:id
```

#### Create Job (Employer only)
```
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fix Kitchen Cabinet",
  "description": "Need to fix broken cabinet door",
  "budget": 150,
  "location": "New York",
  "category": "Carpentry",
  "requiredSkills": ["Carpentry", "Woodwork"]
}
```

#### Get My Jobs (Employer only)
```
GET /api/jobs/my
Authorization: Bearer <token>
```

#### Update Job (Employer only)
```
PATCH /api/jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "closed"
}
```

#### Delete Job (Employer only)
```
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

#### Get Job Applicants (Employer only)
```
GET /api/jobs/:id/applicants
Authorization: Bearer <token>
```

### Applications

#### Apply to Job (Worker only)
```
POST /api/applications/:jobId/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I'm interested in this job..."
}
```

#### Get My Applications (Worker only)
```
GET /api/applications/my
Authorization: Bearer <token>
```

#### Update Application Status (Employer only)
```
PATCH /api/applications/:applicationId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted",
  "rejectionReason": ""
}
```

#### Get Application Details
```
GET /api/applications/:applicationId
Authorization: Bearer <token>
```

#### Withdraw Application (Worker only)
```
DELETE /api/applications/:applicationId/withdraw
Authorization: Bearer <token>
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Database Schema

### User Model
- name (String, required)
- email (String, unique, required)
- password (String, hashed)
- role (String: "worker" or "employer")
- skills (Array of strings)
- experience (String)
- rating (Number, 0-5)
- completedJobs (Number)
- profileImage (String)

### Job Model
- title (String, required)
- description (String, required)
- budget (Number, required)
- location (String)
- category (String)
- employer (Reference to User)
- status (String: "active" or "closed")
- requiredSkills (Array of strings)
- applicationCount (Number)

### Application Model
- job (Reference to Job)
- worker (Reference to User)
- status (String: "pending", "accepted", "rejected")
- coverLetter (String)
- rejectionReason (String)

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── jobController.js     # Job logic
│   └── applicationController.js # Application logic
├── models/
│   ├── User.js              # User schema
│   ├── Job.js               # Job schema
│   └── Application.js       # Application schema
├── routes/
│   ├── authRoutes.js        # Auth routes
│   ├── jobRoutes.js         # Job routes
│   └── applicationRoutes.js # Application routes
├── middleware/
│   └── auth.js              # JWT middleware
├── utils/
│   └── (utilities if needed)
├── .env                     # Environment variables
├── package.json             # Dependencies
└── server.js                # Entry point
```

## Error Handling

The API includes proper error handling with appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

## Security Features

- Password hashing with bcryptjs
- JWT authentication tokens
- Role-based access control
- Request validation
- CORS enabled

## Development

Start development server with hot reload:
```bash
npm run dev
```

Start production server:
```bash
npm start
```

## Author

KarigarUstaad Team
