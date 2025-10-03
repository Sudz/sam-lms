# AWS Free Tier Setup Guide

This guide provides step-by-step instructions for setting up the infrastructure required to deploy the SAM LMS on AWS Free Tier.

## Prerequisites

Before you begin, ensure you have:

- An AWS account (sign up at https://aws.amazon.com/free/)
- AWS CLI installed on your local machine (optional, but recommended)
- Basic understanding of cloud infrastructure concepts

## Phase 1: Account Setup

### Step 1: Create AWS Free Tier Account

1. Visit https://aws.amazon.com/free/
2. Click "Create a Free Account" and complete the registration process.
3. Verify your email address and phone number.
4. Provide payment information (required for verification, but you won't be charged for Free Tier resources).

### Step 2: Access AWS Management Console

1. Log in to the AWS Management Console at https://aws.amazon.com/console/
2. Select your region (e.g., `eu-north-1` as indicated by your database endpoint) closest to your target audience.
3. Familiarize yourself with the console navigation.

## Phase 2: Network Configuration (VPC)

### Step 3: Create a VPC

1. Navigate to **VPC** > **Your VPCs**.
2. Click **Create VPC**.
3. Select **VPC and more**.
4. Configure the following:
   - **Name tag auto-generation**: `sam-lms-vpc`
   - **IPv4 CIDR block**: `10.0.0.0/16`
   - **Number of Availability Zones (AZs)**: 1 (for Free Tier simplicity)
   - **Number of public subnets**: 1
   - **Number of private subnets**: 1
   - **NAT gateways**: None (for Free Tier simplicity)
   - **VPC endpoints**: None
   - **DNS hostnames**: Enable
   - **DNS resolution**: Enable
5. Click **Create VPC**.

### Step 4: Configure Security Groups

Security groups act as virtual firewalls for your instances and database.

#### For EC2 Instances (Frontend and API):

1. Navigate to **EC2** > **Security Groups**.
2. Click **Create security group**.
3. Enter the following details:
   - **Security group name**: `sam-lms-ec2-sg`
   - **Description**: `Security group for SAM LMS EC2 instances`
   - **VPC**: Select `sam-lms-vpc`
4. **Inbound rules**:
   - **Type**: SSH, **Source**: My IP (or a specific IP range for production)
   - **Type**: HTTP, **Source**: Anywhere IPv4
   - **Type**: HTTPS, **Source**: Anywhere IPv4
   - **Type**: Custom TCP, **Port range**: 3000 (for frontend dev), **Source**: Anywhere IPv4
   - **Type**: Custom TCP, **Port range**: 3001 (for backend API), **Source**: Anywhere IPv4
5. **Outbound rules**: All traffic (default)
6. Click **Create security group**.

#### For RDS PostgreSQL Database:

1. Navigate to **RDS** > **Security groups** (or **EC2** > **Security Groups**).
2. Click **Create security group**.
3. Enter the following details:
   - **Security group name**: `sam-lms-rds-sg`
   - **Description**: `Security group for SAM LMS RDS PostgreSQL`
   - **VPC**: Select `sam-lms-vpc`
4. **Inbound rules**:
   - **Type**: PostgreSQL, **Source**: Custom (select `sam-lms-ec2-sg`)
5. **Outbound rules**: All traffic (default)
6. Click **Create security group**.

## Phase 3: Compute Resources (EC2)

### Step 5: Create EC2 Instances

AWS Free Tier provides one t2.micro instance for 750 hours/month. We'll create one instance for the API and potentially Redis, or two if you manage your Free Tier usage carefully.

#### Instance 1: API Server (and Redis)

1. Navigate to **EC2** > **Instances**.
2. Click **Launch instances**.
3. Enter the following details:
   - **Name**: `sam-lms-api`
   - **Application and OS Images (Amazon Machine Image - AMI)**: Select `Ubuntu Server 22.04 LTS (HVM), SSD Volume Type` (Free tier eligible)
   - **Instance type**: `t2.micro` (Free tier eligible)
   - **Key pair (login)**: Create a new key pair or choose an existing one (download and save the `.pem` file securely).
   - **Network settings**: 
     - **VPC**: Select `sam-lms-vpc`
     - **Subnet**: Select the public subnet of `sam-lms-vpc`
     - **Auto-assign public IP**: Enable
     - **Firewall (security groups)**: Select `sam-lms-ec2-sg`
   - **Configure storage**: 8 GiB General Purpose SSD (gp2) (Free tier eligible)
4. Click **Launch instance**.
5. Wait for the instance to provision (status will change to "Running").
6. Note the **Public IPv4 address** for later use.

### Step 6: Connect to EC2 Instance

Once the instance is running, connect via SSH:

```bash
ssh -i /path/to/your/key-pair.pem ubuntu@<PUBLIC_IPV4_ADDRESS>
```

Replace `<PUBLIC_IPV4_ADDRESS>` with the public IP of your instance.

## Phase 4: Database Setup (RDS PostgreSQL)

### Step 7: Create RDS PostgreSQL Database

1. Navigate to **RDS** > **Databases**.
2. Click **Create database**.
3. Choose **Standard create**.
4. **Engine options**:
   - **Engine type**: PostgreSQL
   - **Engine version**: Select a compatible version (e.g., PostgreSQL 14.x)
5. **Templates**: Free tier
6. **DB instance identifier**: `sam-lms-db`
7. **Master username**: `postgres` (or your preferred username)
8. **Master password**: Create a strong password and save it securely.
9. **DB instance size**: `db.t2.micro` (Free tier eligible)
10. **Storage**: 20 GiB General Purpose SSD (gp2) (Free tier eligible)
11. **Connectivity**:
    - **VPC**: Select `sam-lms-vpc`
    - **Subnet group**: Create new (or choose existing if applicable)
    - **Publicly accessible**: Yes (for development, restrict for production)
    - **VPC security groups**: Select `sam-lms-rds-sg`
12. **Database authentication**: Password authentication
13. Click **Create database**.
14. Wait for the database to provision (status will change to "Available").

### Step 8: Get Database Connection String

1. Once the database is available, click on its name (`sam-lms-db`).
2. Under the **Connectivity & security** tab, note the **Endpoint**.
3. The connection string format will be:
   ```
   postgresql://<username>:<password>@<endpoint>:<port>/<database_name>
   ```
   Using your provided endpoint: `postgresql://<username>:<password>@database-1.czsg80quu5jg.eu-north-1.rds.amazonaws.com:5432/postgres` (default database name is `postgres`)
4. Save this connection string for use in your backend `.env` file.

## Phase 5: Object Storage (S3)

### Step 9: Create S3 Bucket

1. Navigate to **S3** > **Buckets**.
2. Click **Create bucket**.
3. Enter the following details:
   - **AWS Region**: Select the same region as your other resources.
   - **Bucket name**: `sam-lms-assets-<your-unique-suffix>` (must be globally unique)
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access settings for this bucket**: Keep default (Block all public access) for now. You can configure specific public access for static assets later if needed.
4. Click **Create bucket**.

## Phase 6: Additional Configuration

### Step 10: Install Required Software on EC2 Instance

SSH into your EC2 instance (`sam-lms-api`) and install the necessary software.

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS or newer)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Clone your repository
git clone https://github.com/Sudz/sam-lms.git
cd sam-lms/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env  # Edit with your actual values, especially DATABASE_URL

# Build the application
npm run build

# Start the application with PM2
pm2 start dist/index.js --name sam-lms-api
pm2 save
pm2 startup
```

### Step 11: Set Up SSL Certificates (Optional, for Production)

For production deployments, use Let's Encrypt to obtain free SSL certificates:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure Nginx and set up auto-renewal
```

## Phase 7: Monitoring and Maintenance

### Step 12: Set Up AWS Monitoring

1. Navigate to **CloudWatch**.
2. Create alarms for:
   - EC2 instance CPU usage
   - RDS database CPU and storage usage
   - Network traffic
3. Configure notifications via SNS.

### Step 13: Regular Maintenance Tasks

- **Backups**: AWS RDS automatically backs up your data.
- **Updates**: Regularly update system packages and application dependencies.
- **Security**: Review security groups and IAM roles periodically.
- **Monitoring**: Check CloudWatch dashboards for performance metrics.

## Troubleshooting

### Common Issues

1. **Cannot connect to EC2 instance via SSH**
   - Verify the security group allows inbound traffic on port 22 from your IP.
   - Ensure you're using the correct SSH key (`.pem` file).
   - Check the public IPv4 address is correct.

2. **Cannot connect to the database**
   - Verify the connection string is correct (username, password, endpoint, port, database name).
   - Ensure the RDS security group allows inbound traffic on port 5432 from your EC2 instance's security group.
   - Check if the database is publicly accessible if connecting from outside the VPC.

3. **Application not accessible**
   - Verify the EC2 security group allows inbound traffic on the application port (e.g., 3000, 3001).
   - Check if the application is running (`pm2 status`).
   - Review application logs (`pm2 logs`).

## Cost Management

AWS Free Tier provides generous resources, but be mindful of the following:

- **Always Free resources**: 1 t2.micro EC2 instance (750 hours/month), 1 db.t2.micro RDS instance (750 hours/month), 5 GB S3 storage.
- **Free Trial credits**: 12 months of free usage for many services.
- **Monitor usage**: Use AWS Cost Explorer to track your spending.

## Next Steps

After completing the infrastructure setup:

1. Deploy your backend and frontend applications.
2. Configure domain names and DNS records.
3. Set up CI/CD pipelines with GitHub Actions.
4. Implement monitoring and alerting.
5. Perform load testing and optimization.

## Additional Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/index.html)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/index.html)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/index.html)

---

**Need help?** Open an issue on GitHub or consult the AWS documentation.

