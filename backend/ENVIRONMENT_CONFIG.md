# Environment Configuration Examples

This file contains example environment configurations for different deployment scenarios.

## Development Environment

**File: `.env.development`**

```
MONGODB_URI=mongodb://localhost:27017/karigarustaad
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
```

## Staging Environment

**File: `.env.staging`**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/karigarustaad-staging
JWT_SECRET=staging_secret_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=staging
LOG_LEVEL=info
```

## Production Environment

**File: `.env.production`**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/karigarustaad
JWT_SECRET=production_super_secret_key_minimum_32_characters_required
JWT_EXPIRE=30d
PORT=3000
NODE_ENV=production
LOG_LEVEL=error
```

## Environment Variables Explanation

### Database Configuration

**MONGODB_URI**
- Local development: `mongodb://localhost:27017/database_name`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database_name`
- Alternative local: `mongodb://127.0.0.1:27017/database_name`

### JWT Configuration

**JWT_SECRET**
- Should be minimum 32 characters
- Use strong random string
- Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**JWT_EXPIRE**
- Format: `<number><unit>`
- Units: s (seconds), m (minutes), h (hours), d (days)
- Examples: `7d`, `24h`, `1h`

### Server Configuration

**PORT**
- Development: 5000
- Production: 3000 or 8000
- Ensure port is not in use

**NODE_ENV**
- Values: `development`, `staging`, `production`
- Controls logging and error handling behavior

### Logging

**LOG_LEVEL**
- error: Only errors
- warn: Warnings and errors
- info: General information
- debug: Detailed debugging info

---

## Using Different Environments

### Method 1: Command Line

```bash
# Development
NODE_ENV=development npm run dev

# Staging
NODE_ENV=staging npm start

# Production
NODE_ENV=production npm start
```

### Method 2: .env Files

Create separate files:
- `.env.development`
- `.env.staging`
- `.env.production`

Then load specific one:
```bash
# Using dotenv-cli (npm install dotenv-cli)
dotenv -e .env.staging npm start
```

### Method 3: Docker Environment

In `docker-compose.yml`:
```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=5000
```

---

## MongoDB Atlas Setup

### 1. Create Account
- Go to [mongodb.com](https://www.mongodb.com/cloud/atlas)
- Sign up for free account

### 2. Create Cluster
- Click "Create a Deployment"
- Select "M0 (Free Tier)"
- Choose your region
- Create cluster

### 3. Database Access
- Go to "Database Access"
- Click "Add New Database User"
- Create username and password
- Select "Built-in Role: Atlas Admin"

### 4. Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (for development)
- Or add specific IPs for production

### 5. Get Connection String
- Go to "Clusters" → "Connect"
- Click "Drivers"
- Copy connection string
- Replace `<password>` with your database user password
- Replace `<database_name>` with your database

**Example:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/karigarustaad?retryWrites=true&w=majority
```

---

## Docker Environment Setup

### Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: karigarustaad_db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DB: karigarustaad
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: .
    container_name: karigarustaad_api
    environment:
      MONGODB_URI: mongodb://root:password@mongodb:27017/karigarustaad?authSource=admin
      JWT_SECRET: your_secret_key
      JWT_EXPIRE: 7d
      PORT: 5000
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    restart: unless-stopped

volumes:
  mongodb_data:
```

### Start with Docker

```bash
docker-compose up -d
```

---

## Heroku Deployment

### 1. Create Heroku App

```bash
heroku create karigarustaad-api
```

### 2. Add MongoDB Add-on

```bash
heroku addons:create mongolab:sandbox
```

### 3. Set Environment Variables

```bash
heroku config:set JWT_SECRET=your_production_secret_key
heroku config:set JWT_EXPIRE=30d
heroku config:set NODE_ENV=production
```

### 4. Deploy

```bash
git push heroku main
```

### 5. View Logs

```bash
heroku logs --tail
```

---

## AWS Deployment

### 1. Create EC2 Instance
- Instance type: t3.micro (free tier)
- Security group: Allow SSH, HTTP, HTTPS, and 5000

### 2. Connect to Instance

```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

### 3. Install Node.js and MongoDB

```bash
# Update
sudo yum update

# Node.js
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# MongoDB
sudo yum install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Clone and Setup

```bash
git clone your-repo
cd backend
npm install
```

### 5. Create .env File

```bash
nano .env
# Add your production environment variables
```

### 6. Start with PM2

```bash
npm install -g pm2
pm2 start server.js --name "karigarustaad-api"
pm2 startup
pm2 save
```

### 7. Setup Nginx Reverse Proxy

```bash
sudo yum install -y nginx

sudo nano /etc/nginx/conf.d/karigarustaad.conf
```

Add:
```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Environment Variable Generator

Run this to generate strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Checklist for Production Deployment

- [ ] MongoDB production database configured
- [ ] JWT_SECRET set to strong random value
- [ ] NODE_ENV=production
- [ ] MONGODB_URI points to production database
- [ ] Error logging configured
- [ ] CORS configuration verified
- [ ] Rate limiting added
- [ ] SSL/HTTPS enabled
- [ ] Database backups scheduled
- [ ] Monitoring and alerting setup
- [ ] Security headers configured
- [ ] Log rotation configured
- [ ] Auto-restart configured (PM2, systemd, etc.)

---

## Monitoring Tools

### PM2 Monitoring

```bash
npm install -g pm2
pm2 start server.js --name "api"
pm2 monit
```

### Application Logging

```bash
# View logs
pm2 logs

# Save to file
pm2 logs > app.log
```

### Database Monitoring

- MongoDB Atlas: Automatic monitoring dashboard
- Local: Use MongoDB Compass

---

**Remember:** Never commit `.env` files with real secrets to version control!
