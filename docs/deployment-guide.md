# SAM LMS Deployment Guide

This guide provides step-by-step instructions for deploying the SAM LMS application to AWS Free Tier.

## Phase Completion Status

| Phase | Description | Status |
| --- | --- | --- |
| 1 | Project Initialization and Environment Setup | ✅ Completed |
| 2 | AWS Infrastructure Setup | ⏳ Not Started |
| 3 | Database Setup and Schema Creation | ⏳ Not Started |
| 4 | Backend Development (BetterAuth, API, Services) | 🚧 In Progress |
| 5 | Frontend Development (React, BetterAuth Client, UI) | 🚧 In Progress |
| 6 | Service Integrations (Paystack, Africa's Talking, Resend) | 🚧 In Progress |
| 7 | Testing and Security | ⏳ Not Started |
| 8 | Deployment and CI/CD | 🚧 In Progress |
| 9 | Post-Launch Monitoring and Maintenance | ⏳ Not Started |

## Prerequisites

- AWS account with Free Tier access
- AWS RDS PostgreSQL database (already created: `database-1.czsg80quu5jg.eu-north-1.rds.amazonaws.com`)
- AWS EC2 instance (optional, for hosting the backend)
- Domain name (optional, for production)
- API keys for Paystack, Africa\'s Talking, and Resend

## Step 1: Database Setup

### 1.1 Connect to AWS RDS PostgreSQL

From your local machine or EC2 instance:

```bash
psql -h database-1.czsg80quu5jg.eu-north-1.rds.amazonaws.com -U sudhirdpn -d database-1
```

Enter password when prompted: `Sudhirdpn`

### 1.2 Run Database Schema Migration

Execute the schema file:

```bash
psql -h database-1.czsg80quu5jg.eu-north-1.rds.amazonaws.com -U sudhirdpn -d database-1 -f infrastructure/database/schema.sql
```

Or copy and paste the SQL from `infrastructure/database/schema.sql` directly into the psql prompt.

### 1.3 Verify Tables Were Created

```sql
\dt
```

You should see the following tables:
- `user_profiles`
- `courses`
- `course_modules`
- `course_lessons`
- `enrollments`
- `user_progress`
- `payments`
- `notifications`

### 1.4 Create BetterAuth Tables

BetterAuth will automatically create its required tables on first run, but you can also manually create them. The tables include:
- `users`
- `sessions`
- `accounts`
- `verification_tokens`

## Step 2: Backend Deployment

### Option A: Deploy to AWS EC2

#### 2.1 Launch EC2 Instance

If you haven\'t already:

1. Launch a `t2.micro` instance (Free Tier eligible)
2. Use Ubuntu 22.04 LTS AMI
3. Configure security group to allow:
   - SSH (port 22) from your IP
   - HTTP (port 80) from anywhere
   - HTTPS (port 443) from anywhere
   - Custom TCP (port 3001) from anywhere (for API)

#### 2.2 Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

#### 2.3 Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install PostgreSQL client (for migrations)
sudo apt install -y postgresql-client
```

#### 2.4 Clone Repository

```bash
git clone https://github.com/Sudz/sam-lms.git
cd sam-lms/backend
```

#### 2.5 Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Update the `.env` file with your actual values:

```env
NODE_ENV=production
PORT=3001

# Frontend URL (update with your actual domain or EC2 IP)
FRONTEND_URL=http://your-ec2-ip:3000

# Database
DATABASE_URL=postgresql://sudhirdpn:Sudhirdpn@database-1.czsg80quu5jg.eu-north-1.rds.amazonaws.com:5432/database-1

# BetterAuth (generate a secure random string)
BETTERAUTH_SECRET=your_secure_random_string_min_32_characters_long
BETTERAUTH_EMAIL_FROM=no-reply@samlms.com

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret

# Africa\'s Talking
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your_africastalking_api_key
AFRICASTALKING_SENDER_ID=SAM LMS

# Resend
RESEND_API_KEY=re_your_resend_api_key

# Redis (optional, install Redis on EC2 or use AWS ElastiCache)
REDIS_URL=redis://localhost:6379
```

#### 2.6 Install Dependencies and Build

```bash
npm install
npm run build
```

#### 2.7 Start Backend with PM2

```bash
pm2 start dist/index.js --name sam-lms-api
pm2 save
pm2 startup
```

Follow the instructions from `pm2 startup` to enable PM2 to start on system boot.

#### 2.8 Verify Backend is Running

```bash
pm2 status
pm2 logs sam-lms-api
```

Test the API:

```bash
curl http://localhost:3001
```

You should see: `{\"message\":\"LMS API is running\"}`

### Option B: Deploy to Vercel/Railway/Render

You can also deploy the backend to platforms like Vercel, Railway, or Render. Follow their respective deployment guides and configure the environment variables accordingly.

## Step 3: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub (already done)
2. Go to [Vercel](https://vercel.com/)
3. Click \"New Project\"
4. Import your GitHub repository (`Sudz/sam-lms`)
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   - `VITE_API_URL`: Your backend API URL (e.g., `http://your-ec2-ip:3001/api`)
7. Click \"Deploy\"

### Option B: Deploy to AWS EC2 (Same Instance as Backend)

#### 3.1 Build Frontend

On your EC2 instance:

```bash
cd ~/sam-lms/frontend
npm install
```

Create `.env.local`:

```bash
nano .env.local
```

Add:

```env
VITE_API_URL=http://your-ec2-ip:3001/api
```

Build the frontend:

```bash
npm run build
```

#### 3.2 Serve with Nginx

Install Nginx:

```bash
sudo apt install -y nginx
```

Configure Nginx:

```bash
sudo nano /etc/nginx/sites-available/sam-lms
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your EC2 public IP

    root /home/ubuntu/sam-lms/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection \'upgrade\';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/sam-lms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 4: SSL Certificate (Production)

### 4.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

## Step 5: Monitoring and Maintenance

### 5.1 Monitor Backend Logs

```bash
pm2 logs sam-lms-api
```

### 5.2 Monitor Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 5.3 Database Backups

AWS RDS automatically backs up your database. You can also create manual snapshots:

1. Go to RDS in AWS Console
2. Select your database (`database-1`)
3. Click **Actions** > **Take snapshot**

### 5.4 Update Application

```bash
cd ~/sam-lms
git pull origin main
cd backend
npm install
npm run build
pm2 restart sam-lms-api
```

## Step 6: Testing

### 6.1 Test Backend API

```bash
# Health check
curl http://your-domain.com/api

# Test course listing (should return empty array initially)
curl http://your-domain.com/api/courses
```

### 6.2 Test Frontend

Open your browser and navigate to:
- `http://your-domain.com` (or `http://your-ec2-ip`)

You should see the SAM LMS homepage.

### 6.3 Test Authentication

1. Click \"Sign Up\"
2. Create a new account
3. Check your email for verification (if Resend is configured)
4. Log in with your credentials

## Troubleshooting

### Backend won\'t start

```bash
pm2 logs sam-lms-api
```

Check for:
- Database connection errors (verify DATABASE_URL)
- Missing environment variables
- Port conflicts

### Frontend shows blank page

- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Check Nginx configuration

### Database connection timeout

- Verify RDS security group allows inbound traffic on port 5432
- Check if RDS is publicly accessible (if connecting from outside VPC)
- Verify DATABASE_URL credentials

### Payment not working

- Verify Paystack API keys are correct
- Check Paystack dashboard for test mode
- Review backend logs for payment errors

## Next Steps

1. **Add sample courses**: Create some test courses via the API or admin interface
2. **Configure domain**: Point your domain to your EC2 instance or Vercel deployment
3. **Set up monitoring**: Use AWS CloudWatch or third-party services
4. **Implement CI/CD**: Set up GitHub Actions for automated deployments
5. **Scale as needed**: Monitor usage and scale resources accordingly

## Support

For issues or questions:
- Check the [GitHub repository](https://github.com/Sudz/sam-lms)
- Review the [AWS Setup Guide](aws-setup.md)
- Open an issue on GitHub

---

**Congratulations!** Your SAM LMS is now deployed and ready to use.
