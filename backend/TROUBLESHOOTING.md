# Troubleshooting Guide

Common issues and their solutions when running the KarigarUstaad backend API.

## Database Issues

### Issue: "MongoDB Connected: (blank)" / Connection Refuses

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Verify MongoDB is installed
2. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. Check if MongoDB is running on correct port:
   ```bash
   netstat -an | grep 27017
   ```
4. Verify `MONGODB_URI` in `.env` file is correct
5. If using MongoDB Atlas, check:
   - Internet connection
   - IP address is whitelisted
   - Username/password is correct
   - Connection string format is correct

---

### Issue: "MongooseError: buffering timed out after 10000ms"

**Symptoms:**
```
Error: buffering timed out after 10000ms
```

**Solutions:**
1. MongoDB server is not running
2. MongoDB Atlas cluster is paused - wake it up
3. Network connection is unstable
4. MongoDB URI is incorrect
5. Try increasing timeout:
   ```javascript
   // In config/database.js
   await mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     serverSelectionTimeoutMS: 20000, // Increase timeout
   });
   ```

---

### Issue: "Authentication failed"

**Symptoms:**
```
MongoError: authentication failed
```

**Solutions:**
1. Username/password in connection string is wrong
2. User doesn't exist in MongoDB
3. User doesn't have access to database
4. Try connecting directly with MongoDB Compass:
   ```
   mongodb://username:password@host:port/database
   ```
5. Verify special characters are URL-encoded in password

---

## Server Issues

### Issue: Port 5000 Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Kill process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. Use different port in `.env`:
   ```
   PORT=5001
   ```
3. Wait a few minutes for the port to be freed by OS

---

### Issue: Server Crashes on Startup

**Symptoms:**
```
TypeError: Cannot read property 'env' of undefined
```

**Solutions:**
1. Install dotenv:
   ```bash
   npm install dotenv
   ```
2. Add to top of `server.js`:
   ```javascript
   require('dotenv').config();
   ```
3. Check `.env` file exists and is readable
4. Verify `.env` syntax is correct (no quotes around values)

---

### Issue: "Cannot find module 'express'"

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solutions:**
1. Dependencies not installed:
   ```bash
   npm install
   ```
2. node_modules deleted:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check package.json exists and is valid
4. Try installing specific package:
   ```bash
   npm install express
   ```

---

## Authentication Issues

### Issue: "JWT Token Invalid"

**Symptoms:**
```
{
  "success": false,
  "message": "Invalid token"
}
```

**Solutions:**
1. Token is malformed - get new token by logging in
2. Token is expired - get new token
3. JWT_SECRET changed - use original secret
4. Token not in correct format:
   ```
   Authorization: Bearer <token>
   # NOT
   Authorization: <token>
   Authorization: "Bearer <token>"
   ```

---

### Issue: "Token Expired"

**Symptoms:**
```
{
  "success": false,
  "message": "Token expired"
}
```

**Solutions:**
1. Login again to get new token
2. Increase JWT_EXPIRE in `.env`:
   ```
   JWT_EXPIRE=30d
   ```
3. Current token expiry: Check JWT_EXPIRE in `.env`

---

### Issue: "Invalid email or password"

**Symptoms:**
Login fails even with correct credentials

**Solutions:**
1. Check email is exact match (case-sensitive storage, case-insensitive query)
2. Check password is correct
3. User doesn't exist - register first
4. Database might be empty - check MongoDB directly
5. Ensure password wasn't modified in database

---

### Issue: "User not found" / No User Data

**Symptoms:**
```
{
  "success": false,
  "message": "User not found"
}
```

**Solutions:**
1. User ID in token is invalid
2. User was deleted from database
3. Database connection issue
4. Get new token by logging in again

---

## API Issues

### Issue: CORS Error

**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**
1. CORS middleware not enabled - check `server.js`:
   ```javascript
   app.use(cors());
   ```
2. Frontend URL not allowed:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:3000'
   }));
   ```
3. Try adding to fetch request:
   ```javascript
   fetch(url, {
     headers: {
       'Content-Type': 'application/json',
     }
   })
   ```

---

### Issue: 404 Not Found on Valid Endpoint

**Symptoms:**
```
{
  "success": false,
  "message": "Route not found"
}
```

**Solutions:**
1. Check endpoint path is correct
2. Verify route is registered in `server.js`:
   ```javascript
   app.use('/api/auth', authRoutes);
   ```
3. Check HTTP method (GET, POST, etc.)
4. Typo in endpoint name
5. Server not restarted after code changes

---

### Issue: 400 Bad Request

**Symptoms:**
```
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**Solutions:**
1. Missing required fields in request body
2. Wrong data type (string vs number)
3. Empty fields
4. Check API documentation for required fields
5. Verify JSON is valid

Example:
```javascript
// WRONG
{
  "name": "John",
  "email": "john@example.com"
  // Missing "password" and "role"
}

// CORRECT
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123",
  "role": "worker"
}
```

---

### Issue: 403 Forbidden

**Symptoms:**
```
{
  "success": false,
  "message": "User role 'worker' is not authorized to access this route"
}
```

**Solutions:**
1. Wrong user role for operation
2. Worker trying to create job (employer only)
3. Employer trying to apply for job (worker only)
4. Check endpoint requirements in API documentation

---

### Issue: 500 Server Error

**Symptoms:**
```
{
  "success": false,
  "message": "Some server error"
}
```

**Solutions:**
1. Check server console for detailed error
2. Database connection issue
3. Invalid data in request
4. Unhandled exception in code
5. Check MongoDB is running
6. Restart server:
   ```bash
   npm run dev
   ```

---

## Application Issues

### Issue: Duplicate Application Error

**Symptoms:**
```
{
  "success": false,
  "message": "You have already applied to this job"
}
```

**Solutions:**
1. You already applied to this job
2. Check "My Applications" to see previous applications
3. Withdraw previous application if needed:
   ```
   DELETE /api/applications/:id/withdraw
   ```

---

### Issue: Application Status Won't Update

**Symptoms:**
Status doesn't change to "accepted" or "rejected"

**Solutions:**
1. User is not the job owner
2. Application doesn't exist
3. Wrong application ID
4. Check you're logged in as employer
5. Verify job belongs to your account

---

### Issue: Job Won't Update/Delete

**Symptoms:**
```
{
  "success": false,
  "message": "Not authorized to update this job"
}
```

**Solutions:**
1. Not logged in as job owner
2. Different user created the job
3. Wrong job ID
4. Login as correct employer account
5. Check job ownership in "My Jobs"

---

## Testing Issues

### Issue: Postman Returns Empty Response

**Symptoms:**
```
{}
```

**Solutions:**
1. Check if Content-Type header is set: `application/json`
2. Check if request body is valid JSON
3. Server not running
4. Wrong URL/endpoint
5. Check server console for errors

---

### Issue: Token Expires Too Quickly

**Symptoms:**
Token valid but expires after short time

**Solutions:**
1. Increase JWT_EXPIRE in `.env`:
   ```
   JWT_EXPIRE=30d  # Change from 7d to 30d
   ```
2. Restart server after changing
3. Login again to get new token
4. Check system time is correct (affects token validation)

---

### Issue: Variables Not Working in Postman

**Symptoms:**
`{{BASE_URL}}` shows as literal text

**Solutions:**
1. Set Postman environment variables
2. Check variable name matches: `{{BASE_URL}}`
3. Use `Manage Environments` to create environment
4. Set variables:
   - BASE_URL: http://localhost:5000/api
   - TOKEN: your_jwt_token
5. Select environment from dropdown (top-right)

---

## Performance Issues

### Issue: API Response Slow

**Symptoms:**
Endpoints take > 1 second to respond

**Solutions:**
1. MongoDB is slow:
   - Check MongoDB is running
   - Check network connection to MongoDB
   - Add indexes to frequently queried fields
2. Large data response:
   - Implement pagination
   - Limit query results
3. Server resources:
   - Check CPU/Memory usage
   - Close unnecessary applications

---

### Issue: Server Memory Leak

**Symptoms:**
Memory usage keeps increasing

**Solutions:**
1. Check for infinite loops in code
2. Monitor with PM2:
   ```bash
   pm2 monit
   ```
3. Use memory profiling tools
4. Restart server periodically:
   ```bash
   pm2 restart all
   ```

---

## Debugging Tips

### 1. Enable Debug Logging

Add to `server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});
```

### 2. Check MongoDB Directly

```bash
# Connect to MongoDB
mongo

# List databases
show dbs

# Use database
use karigarustaad

# List collections
show collections

# View users
db.users.find().pretty()

# View jobs
db.jobs.find().pretty()
```

### 3. Use MongoDB Compass

- Download: [mongodb.com/compass](https://www.mongodb.com/products/compass)
- Visual interface to browse database
- Execute queries
- View collections and documents

### 4. Check Environment Variables

```bash
node -e "console.log(process.env.MONGODB_URI)"
```

### 5. Test Endpoints with curl

```bash
curl http://localhost:5000/api/health

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Getting Help

1. Check this troubleshooting guide first
2. Read API_DOCUMENTATION.md for endpoint details
3. Check server console output for error messages
4. Verify MongoDB is running: `mongod`
5. Try restarting everything:
   ```bash
   # Kill processes
   npm stop
   
   # Clear and reinstall
   rm -rf node_modules
   npm install
   
   # Start fresh
   npm run dev
   ```

---

**Last Updated:** 2024
**Version:** 1.0.0
