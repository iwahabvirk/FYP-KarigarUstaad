# KarigarUstaad API Documentation

## Overview

This is a comprehensive REST API for the KarigarUstaad job marketplace platform. The API handles user authentication, job management, and job applications with role-based access control.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Data Types

- **String**: Text data
- **Number**: Integer or decimal numbers
- **Boolean**: true/false
- **Date**: ISO 8601 format (2023-01-01T12:00:00Z)
- **ObjectId**: MongoDB unique identifier

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Endpoints

### Authentication Endpoints

#### 1. Register User

Create a new user account.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Ali Raza",
  "email": "ali.raza@example.com",
  "password": "password123",
  "role": "worker"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | User's full name (max 100 characters) |
| email | String | Yes | Valid email address (unique) |
| password | String | Yes | Password (min 6 characters) |
| role | String | Yes | Either "worker" or "employer" |

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ali Raza",
    "email": "ali.raza@example.com",
    "role": "worker"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

#### 2. Login User

Authenticate user and receive JWT token.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ali.raza@example.com",
  "password": "password123"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | User's email |
| password | String | Yes | User's password |

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ali Raza",
    "email": "ali.raza@example.com",
    "role": "worker"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### 3. Get Current User

Retrieve authenticated user's profile.

**Request:**
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ali Raza",
    "email": "ali.raza@example.com",
    "role": "worker",
    "skills": ["Carpentry", "Woodwork"],
    "experience": "10 years",
    "rating": 4.8,
    "completedJobs": 45,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
}
```

---

### Job Endpoints

#### 4. Get All Jobs

Retrieve all available jobs with optional filters.

**Request:**
```http
GET /jobs?category=Carpentry&search=paint&minBudget=100&maxBudget=500
```

**Query Parameters:**
| Parameter | Type | Optional | Description |
|-----------|------|----------|-------------|
| category | String | Yes | Filter by category |
| search | String | Yes | Search in title/description |
| minBudget | Number | Yes | Minimum budget filter |
| maxBudget | Number | Yes | Maximum budget filter |

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Fix Kitchen Cabinet Door",
      "description": "Need to fix a broken cabinet door in kitchen",
      "budget": 150,
      "location": "New York",
      "category": "Carpentry",
      "status": "active",
      "requiredSkills": ["Carpentry", "Woodwork"],
      "applicationCount": 5,
      "employer": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Home Repairs Co",
        "email": "employer@example.com",
        "rating": 4.8
      },
      "createdAt": "2023-01-01T12:00:00Z"
    }
  ]
}
```

---

#### 5. Get Job Details

Retrieve specific job information.

**Request:**
```http
GET /jobs/:id
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | String | Yes | Job ID |

**Response (200):**
```json
{
  "success": true,
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Fix Kitchen Cabinet Door",
    "description": "Need to fix a broken cabinet door in kitchen",
    "budget": 150,
    "location": "New York",
    "category": "Carpentry",
    "status": "active",
    "requiredSkills": ["Carpentry", "Woodwork"],
    "applicationCount": 5,
    "employer": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Home Repairs Co",
      "email": "employer@example.com",
      "rating": 4.8
    },
    "createdAt": "2023-01-01T12:00:00Z"
  }
}
```

---

#### 6. Create Job

Create a new job (Employer only).

**Request:**
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Paint Living Room",
  "description": "Paint entire living room with 2 coats",
  "budget": 300,
  "location": "New York",
  "category": "Painting",
  "requiredSkills": ["Painting", "Color Matching"]
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Job title (max 200 chars) |
| description | String | Yes | Job description (max 5000 chars) |
| budget | Number | Yes | Job budget (must be > 0) |
| location | String | No | Job location |
| category | String | Yes | Job category |
| requiredSkills | Array | No | Array of required skills |

**Valid Categories:**
- Carpentry
- Painting
- Electrical
- Plumbing
- Tiling
- Installation
- Other

**Response (201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Paint Living Room",
    "description": "Paint entire living room with 2 coats",
    "budget": 300,
    "location": "New York",
    "category": "Painting",
    "status": "active",
    "requiredSkills": ["Painting", "Color Matching"],
    "applicationCount": 0,
    "employer": "507f1f77bcf86cd799439012",
    "createdAt": "2023-01-01T12:00:00Z"
  }
}
```

---

#### 7. Get My Jobs

Retrieve jobs posted by authenticated employer.

**Request:**
```http
GET /jobs/my
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Paint Living Room",
      "description": "Paint entire living room with 2 coats",
      "budget": 300,
      "status": "active",
      "applicationCount": 3,
      "createdAt": "2023-01-01T12:00:00Z"
    }
  ]
}
```

---

#### 8. Update Job

Update a job (Employer only - must be owner).

**Request:**
```http
PATCH /jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "budget": 350,
  "status": "closed"
}
```

**Parameters:**
| Field | Type | Optional | Description |
|-------|------|----------|-------------|
| title | String | Yes | Job title |
| description | String | Yes | Job description |
| budget | Number | Yes | Job budget |
| location | String | Yes | Job location |
| category | String | Yes | Job category |
| status | String | Yes | "active" or "closed" |

**Response (200):**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "job": { ... }
}
```

---

#### 9. Delete Job

Delete a job (Employer only - must be owner).

**Request:**
```http
DELETE /jobs/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

#### 10. Get Job Applicants

Retrieve applicants for a specific job (Employer only - must be owner).

**Request:**
```http
GET /jobs/:id/applicants
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "job": "507f1f77bcf86cd799439010",
      "worker": {
        "_id": "507f1f77bcf86cd799439009",
        "name": "Ali Raza",
        "email": "ali.raza@example.com",
        "rating": 4.8,
        "skills": ["Carpentry", "Woodwork"]
      },
      "status": "pending",
      "coverLetter": "I'm interested in this job...",
      "createdAt": "2023-01-01T12:00:00Z"
    }
  ]
}
```

---

### Application Endpoints

#### 11. Apply to Job

Submit job application (Worker only).

**Request:**
```http
POST /applications/:jobId/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I have 10 years of experience in carpentry..."
}
```

**Parameters:**
| Field | Type | Optional | Description |
|-------|------|----------|-------------|
| coverLetter | String | Yes | Application cover letter |

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "_id": "507f1f77bcf86cd799439011",
    "job": "507f1f77bcf86cd799439010",
    "worker": "507f1f77bcf86cd799439009",
    "status": "pending",
    "coverLetter": "I have 10 years of experience in carpentry...",
    "createdAt": "2023-01-01T12:00:00Z"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "You have already applied to this job"
}
```

---

#### 12. Get My Applications

Retrieve applications submitted by authenticated worker.

**Request:**
```http
GET /applications/my
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "job": {
        "_id": "507f1f77bcf86cd799439010",
        "title": "Fix Kitchen Cabinet",
        "description": "...",
        "budget": 150,
        "category": "Carpentry",
        "employer": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Home Repairs Co"
        }
      },
      "status": "pending",
      "coverLetter": "I'm interested...",
      "createdAt": "2023-01-01T12:00:00Z"
    }
  ]
}
```

---

#### 13. Get Application Details

Retrieve specific application information.

**Request:**
```http
GET /applications/:applicationId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "application": {
    "_id": "507f1f77bcf86cd799439011",
    "job": { ... },
    "worker": {
      "_id": "507f1f77bcf86cd799439009",
      "name": "Ali Raza",
      "email": "ali.raza@example.com",
      "skills": ["Carpentry", "Woodwork"],
      "rating": 4.8
    },
    "status": "pending",
    "coverLetter": "...",
    "createdAt": "2023-01-01T12:00:00Z"
  }
}
```

---

#### 14. Update Application Status

Update application status (Employer only - must be job owner).

**Request:**
```http
PATCH /applications/:applicationId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted",
  "rejectionReason": ""
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | String | Yes | "pending", "accepted", or "rejected" |
| rejectionReason | String | No | Reason if rejecting |

**Response (200):**
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "application": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "accepted",
    "createdAt": "2023-01-01T12:00:00Z"
  }
}
```

---

#### 15. Withdraw Application

Withdraw submitted application (Worker only).

**Request:**
```http
DELETE /applications/:applicationId/withdraw
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application withdrawn successfully"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Messages

| Message | Status | Cause |
|---------|--------|-------|
| Not authorized to access this route | 401 | Missing or invalid token |
| User role 'worker' is not authorized | 403 | User doesn't have required role |
| Job not found | 404 | Invalid job ID |
| You have already applied to this job | 400 | Duplicate application |
| Email already registered | 400 | Email already exists |

---

## Rate Limiting

Currently, there is no rate limiting. In production, implement rate limiting to prevent abuse.

---

## Security Best Practices

1. **Store tokens securely** - Keep JWT tokens in secure storage
2. **Use HTTPS** - Always use HTTPS in production
3. **Validate input** - All inputs are validated on the server
4. **Password security** - Passwords are hashed with bcryptjs
5. **Token expiration** - Tokens expire after the JWT_EXPIRE duration

---

## Examples

### Complete Workflow: Worker Applying for a Job

```javascript
// 1. Register Worker
POST /auth/register
{
  "name": "Ali Raza",
  "email": "ali.raza@example.com",
  "password": "password123",
  "role": "worker"
}
// Response: token = "eyJhbGc..."

// 2. View Available Jobs
GET /jobs?category=Carpentry

// 3. Get Job Details
GET /jobs/507f1f77bcf86cd799439011

// 4. Apply to Job
POST /applications/507f1f77bcf86cd799439011/apply
Authorization: Bearer eyJhbGc...
{
  "coverLetter": "I'm interested in this job..."
}

// 5. View My Applications
GET /applications/my
Authorization: Bearer eyJhbGc...
```

### Complete Workflow: Employer Managing Jobs

```javascript
// 1. Register Employer
POST /auth/register
{
  "name": "Home Repairs Co",
  "email": "employer@example.com",
  "password": "password123",
  "role": "employer"
}
// Response: token = "eyJhbGc..."

// 2. Create Job
POST /jobs
Authorization: Bearer eyJhbGc...
{
  "title": "Fix Kitchen Cabinet",
  "description": "Need to fix broken cabinet door",
  "budget": 150,
  "category": "Carpentry"
}

// 3. View My Jobs
GET /jobs/my
Authorization: Bearer eyJhbGc...

// 4. View Applicants
GET /jobs/507f1f77bcf86cd799439011/applicants
Authorization: Bearer eyJhbGc...

// 5. Accept an Application
PATCH /applications/507f1f77bcf86cd799439020/status
Authorization: Bearer eyJhbGc...
{
  "status": "accepted"
}
```

---

## Version

API Version: 1.0.0

## Support

For issues or questions, please contact the development team.
