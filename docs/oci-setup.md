# Oracle Cloud Infrastructure (OCI) Setup Guide

This guide provides step-by-step instructions for setting up the infrastructure required to deploy the SAM LMS on Oracle Cloud Infrastructure (OCI) Free Tier.

## Prerequisites

Before you begin, ensure you have:

- An OCI account (sign up at https://www.oracle.com/cloud/free/)
- OCI CLI installed on your local machine (optional, but recommended)
- Basic understanding of cloud infrastructure concepts

## Phase 1: Account Setup

### Step 1: Create OCI Free Tier Account

1. Visit https://www.oracle.com/cloud/free/
2. Click "Start for free" and complete the registration process
3. Verify your email address and phone number
4. Provide payment information (required for verification, but you won't be charged for Free Tier resources)

### Step 2: Access OCI Console

1. Log in to the OCI Console at https://cloud.oracle.com/
2. Select your home region (choose the region closest to your target audience)
3. Familiarize yourself with the console navigation

## Phase 2: Network Configuration

### Step 3: Create a Compartment

Compartments help organize and isolate your cloud resources.

1. Navigate to **Identity & Security** > **Compartments**
2. Click **Create Compartment**
3. Enter the following details:
   - **Name**: `sam-lms-compartment`
   - **Description**: `Compartment for SAM LMS resources`
   - **Parent Compartment**: Select your root compartment
4. Click **Create Compartment**

### Step 4: Set Up Virtual Cloud Network (VCN)

1. Navigate to **Networking** > **Virtual Cloud Networks**
2. Ensure you're in the correct compartment (`sam-lms-compartment`)
3. Click **Start VCN Wizard**
4. Select **Create VCN with Internet Connectivity**
5. Enter the following details:
   - **VCN Name**: `sam-lms-vcn`
   - **Compartment**: `sam-lms-compartment`
   - **VCN CIDR Block**: `10.0.0.0/16`
   - **Public Subnet CIDR Block**: `10.0.1.0/24`
   - **Private Subnet CIDR Block**: `10.0.2.0/24`
6. Click **Next** and review the configuration
7. Click **Create** to provision the VCN

### Step 5: Configure Security Lists

Security lists act as virtual firewalls for your instances.

#### For Public Subnet (Frontend and API):

1. Navigate to **Networking** > **Virtual Cloud Networks** > **sam-lms-vcn**
2. Click on **Security Lists** in the left menu
3. Click on the **Default Security List for sam-lms-vcn**
4. Click **Add Ingress Rules** and add the following rules:

| Source CIDR | IP Protocol | Source Port Range | Destination Port Range | Description |
|---|---|---|---|---|
| 0.0.0.0/0 | TCP | All | 22 | SSH access |
| 0.0.0.0/0 | TCP | All | 80 | HTTP access |
| 0.0.0.0/0 | TCP | All | 443 | HTTPS access |
| 0.0.0.0/0 | TCP | All | 3000 | Next.js frontend (development) |
| 0.0.0.0/0 | TCP | All | 3001 | Express API |

5. Click **Add Ingress Rules**

**Note**: For production, restrict SSH access (port 22) to your specific IP address instead of `0.0.0.0/0`.

## Phase 3: Compute Resources

### Step 6: Create Compute Instances

OCI Free Tier provides two VM.Standard.E2.1.Micro instances. We'll create two instances: one for the API and one for Redis.

#### Instance 1: API Server

1. Navigate to **Compute** > **Instances**
2. Click **Create Instance**
3. Enter the following details:
   - **Name**: `sam-lms-api`
   - **Compartment**: `sam-lms-compartment`
   - **Availability Domain**: Select any available domain
   - **Image**: Ubuntu 22.04 (or latest LTS)
   - **Shape**: VM.Standard.E2.1.Micro (Always Free-eligible)
   - **Virtual Cloud Network**: `sam-lms-vcn`
   - **Subnet**: Public Subnet
   - **Assign a public IPv4 address**: Yes
4. Under **Add SSH keys**, either:
   - Upload your public SSH key, or
   - Generate a new SSH key pair (download and save the private key securely)
5. Click **Create**
6. Wait for the instance to provision (status will change to "Running")
7. Note the **Public IP Address** for later use

#### Instance 2: Redis Server

Repeat the same steps as above, but with the following changes:
- **Name**: `sam-lms-redis`
- Keep all other settings the same

### Step 7: Connect to Compute Instances

Once the instances are running, connect via SSH:

```bash
ssh -i /path/to/your/private-key ubuntu@<PUBLIC_IP_ADDRESS>
```

Replace `<PUBLIC_IP_ADDRESS>` with the public IP of your instance.

## Phase 4: Database Setup

### Step 8: Create Autonomous PostgreSQL Database

1. Navigate to **Oracle Database** > **Autonomous Database**
2. Click **Create Autonomous Database**
3. Enter the following details:
   - **Compartment**: `sam-lms-compartment`
   - **Display Name**: `sam-lms-db`
   - **Database Name**: `samlmsdb`
   - **Workload Type**: Transaction Processing
   - **Deployment Type**: Shared Infrastructure
   - **Database Version**: 19c (or latest)
   - **OCPU Count**: 1 (Always Free-eligible)
   - **Storage**: 20 GB (Always Free-eligible)
   - **Auto Scaling**: Disabled (for Free Tier)
4. Under **Create Administrator Credentials**:
   - **Username**: `admin` (default)
   - **Password**: Create a strong password and save it securely
5. Under **Network Access**:
   - **Access Type**: Secure access from everywhere (for development)
   - For production, restrict to specific IP addresses or VCN
6. Click **Create Autonomous Database**
7. Wait for the database to provision (status will change to "Available")

### Step 9: Get Database Connection String

1. Once the database is available, click on its name
2. Click **DB Connection**
3. Under **Connection Strings**, copy the **TNS Name** or **Connection String**
4. The connection string format will be:
   ```
   postgresql://admin:<password>@<hostname>:<port>/<database_name>
   ```
5. Save this connection string for use in your backend `.env` file

## Phase 5: Object Storage

### Step 10: Create Object Storage Bucket

1. Navigate to **Storage** > **Object Storage & Archive Storage** > **Buckets**
2. Click **Create Bucket**
3. Enter the following details:
   - **Bucket Name**: `sam-lms-assets`
   - **Compartment**: `sam-lms-compartment`
   - **Storage Tier**: Standard
   - **Encryption**: Encrypt using Oracle-managed keys
   - **Emit Object Events**: No (optional)
4. Click **Create**

### Step 11: Configure Bucket for Public Access (Optional)

If you want to serve static assets directly from Object Storage:

1. Click on the bucket name (`sam-lms-assets`)
2. Under **Resources**, click **Visibility**
3. Change visibility to **Public** (use with caution)
4. Alternatively, use pre-authenticated requests (PAR) for controlled access

## Phase 6: Additional Configuration

### Step 12: Install Required Software on Compute Instances

SSH into each compute instance and install the necessary software.

#### On API Server (`sam-lms-api`):

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS)
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
nano .env  # Edit with your actual values

# Build the application
npm run build

# Start the application with PM2
pm2 start dist/index.js --name sam-lms-api
pm2 save
pm2 startup
```

#### On Redis Server (`sam-lms-redis`):

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Redis
sudo apt install -y redis-server

# Configure Redis to accept connections from the API server
sudo nano /etc/redis/redis.conf

# Find and modify the following lines:
# bind 127.0.0.1 -> bind 0.0.0.0 (or bind to the private IP of the VCN)
# protected-mode yes -> protected-mode no (or set up authentication)

# Restart Redis
sudo systemctl restart redis-server

# Enable Redis to start on boot
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping  # Should return "PONG"
```

### Step 13: Set Up SSL Certificates (Optional, for Production)

For production deployments, use Let's Encrypt to obtain free SSL certificates:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure Nginx and set up auto-renewal
```

## Phase 7: Monitoring and Maintenance

### Step 14: Set Up OCI Monitoring

1. Navigate to **Observability & Management** > **Monitoring**
2. Create alarms for:
   - Compute instance CPU usage
   - Database CPU and storage usage
   - Network traffic
3. Configure notifications via email or SMS

### Step 15: Regular Maintenance Tasks

- **Backups**: OCI Autonomous Database automatically backs up your data
- **Updates**: Regularly update system packages and application dependencies
- **Security**: Review security lists and access controls periodically
- **Monitoring**: Check OCI Monitoring dashboards for performance metrics

## Troubleshooting

### Common Issues

1. **Cannot connect to compute instance via SSH**
   - Verify the security list allows inbound traffic on port 22
   - Ensure you're using the correct SSH key
   - Check the public IP address is correct

2. **Cannot connect to the database**
   - Verify the connection string is correct
   - Ensure the database allows connections from your IP address
   - Check firewall rules on the compute instance

3. **Application not accessible**
   - Verify the security list allows inbound traffic on the application port
   - Check if the application is running (`pm2 status`)
   - Review application logs (`pm2 logs`)

## Cost Management

OCI Free Tier provides generous resources, but be mindful of the following:

- **Always Free resources**: 2 Compute instances, 2 Autonomous Databases, 10 GB Object Storage
- **Free Trial credits**: $300 for 30 days (for additional resources)
- **Monitor usage**: Use OCI Cost Management to track your spending

## Next Steps

After completing the infrastructure setup:

1. Deploy your backend and frontend applications
2. Configure domain names and DNS records
3. Set up CI/CD pipelines with GitHub Actions
4. Implement monitoring and alerting
5. Perform load testing and optimization

## Additional Resources

- [OCI Documentation](https://docs.oracle.com/en-us/iaas/Content/home.htm)
- [OCI Free Tier](https://www.oracle.com/cloud/free/)
- [OCI CLI Installation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm)
- [Autonomous Database Documentation](https://docs.oracle.com/en/cloud/paas/autonomous-database/index.html)

---

**Need help?** Open an issue on GitHub or consult the OCI documentation.
