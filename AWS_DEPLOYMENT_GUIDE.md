# 🚀 AWS EC2 Deployment Guide - Codo-Leet Platform

## 📋 Overview

This guide will help you deploy the Codo-Leet platform on AWS EC2 instances using a microservices architecture. We'll set up multiple EC2 instances, configure them, and deploy each service independently for scalability and maintainability.

---

## 🏗️ AWS Architecture Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud                               │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                   │
│  │   Load Balancer │    │   Frontend EC2  │                   │
│  │   (Optional)    │    │   Port 80/443   │                   │
│  └─────────────────┘    └─────────────────┘                   │
│           │                       │                           │
│           └───────────────────────┼───────────────────────────│
│                                   │                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐│
│  │  User Service   │    │ Problem Service │    │ Submission  ││
│  │     EC2         │    │      EC2        │    │ Service EC2 ││
│  │   Port 3001     │    │   Port 3002     │    │  Port 3003  ││
│  └─────────────────┘    └─────────────────┘    └─────────────┘│
│           │                       │                    │      │
│           └───────────────────────┼────────────────────┘      │
│                                   │                           │
│  ┌─────────────────┐              │                           │
│  │ Evaluator EC2   │              │                           │
│  │   Port 3004     │              │                           │
│  └─────────────────┘              │                           │
│           │                       │                           │
│           └───────────────────────┘                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              MongoDB Atlas (External)                      ││
│  │           mongodb+srv://cluster...                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ EC2 Instance Requirements

### Option 1: Separate Instance per Service (Recommended for Production)

- **Total Instances**: 5 EC2 instances
- **Instance Type**: t3.small or t3.medium
- **Operating System**: Ubuntu 22.04 LTS

| Service            | Instance Type | vCPU | RAM | Storage | Port   |
| ------------------ | ------------- | ---- | --- | ------- | ------ |
| Frontend           | t3.small      | 2    | 2GB | 20GB    | 80/443 |
| User Service       | t3.small      | 2    | 2GB | 20GB    | 3001   |
| Problem Service    | t3.small      | 2    | 2GB | 20GB    | 3002   |
| Submission Service | t3.small      | 2    | 2GB | 20GB    | 3003   |
| Evaluator Service  | t3.medium     | 2    | 4GB | 20GB    | 3004   |

### Option 2: Consolidated Setup (Cost-Effective for Development)

- **Total Instances**: 2 EC2 instances
- **Instance Type**: t3.medium or t3.large

| Purpose  | Services       | Instance Type | vCPU | RAM | Storage |
| -------- | -------------- | ------------- | ---- | --- | ------- |
| Backend  | All 4 services | t3.medium     | 2    | 4GB | 30GB    |
| Frontend | React app      | t3.small      | 2    | 2GB | 20GB    |

---

## 🔧 Prerequisites

### 1. AWS Account Setup

- Active AWS account
- AWS CLI installed and configured
- IAM user with EC2 permissions

### 2. Local Preparation

- Your Codo-Leet project code
- GitHub repository (recommended)
- Environment variables documented

### 3. Domain Setup (Optional)

- Domain name for production deployment
- Route 53 hosted zone (if using AWS domains)

---

## 📦 Step-by-Step Deployment

### Step 1: Create Security Groups

#### 1.1 Create Backend Security Group

```bash
# Allow SSH and service ports
aws ec2 create-security-group \
  --group-name codo-leet-backend-sg \
  --description "Security group for Codo-Leet backend services"

# Add rules
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0  # SSH access

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3001-3004 \
  --cidr 0.0.0.0/0  # Service ports
```

#### 1.2 Create Frontend Security Group

```bash
# Allow HTTP, HTTPS, and SSH
aws ec2 create-security-group \
  --group-name codo-leet-frontend-sg \
  --description "Security group for Codo-Leet frontend"

# Add rules
aws ec2 authorize-security-group-ingress \
  --group-id sg-yyyyyyyyy \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0  # SSH

aws ec2 authorize-security-group-ingress \
  --group-id sg-yyyyyyyyy \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0  # HTTP

aws ec2 authorize-security-group-ingress \
  --group-id sg-yyyyyyyyy \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0  # HTTPS
```

### Step 2: Launch EC2 Instances

#### 2.1 Launch Backend Instances

```bash
# User Service Instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=codo-leet-user-service}]'

# Problem Service Instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=codo-leet-problem-service}]'

# Submission Service Instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=codo-leet-submission-service}]'

# Evaluator Service Instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=codo-leet-evaluator-service}]'
```

#### 2.2 Launch Frontend Instance

```bash
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-yyyyyyyyy \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=codo-leet-frontend}]'
```

### Step 3: Connect to Instances

#### 3.1 Get Instance Public IPs

```bash
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=codo-leet-*" \
  --query 'Reservations[].Instances[].{Name:Tags[?Key==`Name`].Value|[0],PublicIP:PublicIpAddress,InstanceId:InstanceId}'
```

#### 3.2 SSH into Each Instance

```bash
ssh -i your-key-pair.pem ubuntu@INSTANCE_PUBLIC_IP
```

---

## 🔨 Server Configuration

### Step 4: Configure Each Instance

#### 4.1 Basic Setup (Run on ALL instances)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install git -y

# Install build essentials (for C++ compilation)
sudo apt install build-essential -y

# Verify installations
node --version
npm --version
pm2 --version
```

#### 4.2 Clone Repository (Run on ALL instances)

```bash
# Clone your project
git clone https://github.com/yourusername/codo-leet-platform.git
cd codo-leet-platform

# Install dependencies
npm install
```

---

## 🚀 Service Deployment

### Step 5: Deploy Backend Services

#### 5.1 User Service Deployment

**On User Service Instance:**

```bash
cd codo-leet-platform/services/user-service

# Install dependencies
npm install

# Create environment file
sudo nano .env
```

Add to `.env`:

```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algocode-submissions
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

```bash
# Build the service
npm run build

# Start with PM2
pm2 start dist/index.js --name "user-service"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 5.2 Problem Service Deployment

**On Problem Service Instance:**

```bash
cd codo-leet-platform/services/problem-service

# Install dependencies
npm install

# Create environment file
sudo nano .env
```

Add to `.env`:

```env
PORT=3002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algocode-submissions
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

```bash
# Build and start
npm run build
pm2 start dist/index.js --name "problem-service"
```

#### 5.3 Submission Service Deployment

**On Submission Service Instance:**

```bash
cd codo-leet-platform/services/submission-service

# Install dependencies
npm install

# Create environment file
sudo nano .env
```

Add to `.env`:

```env
PORT=3003
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algocode-submissions
JWT_SECRET=your-jwt-secret-key
PROBLEM_SERVICE_URL=http://PROBLEM_SERVICE_INSTANCE_IP:3002
EVALUATOR_SERVICE_URL=http://EVALUATOR_SERVICE_INSTANCE_IP:3004
NODE_ENV=production
```

```bash
# Build and start
npm run build
pm2 start dist/index.js --name "submission-service"
```

#### 5.4 Evaluator Service Deployment

**On Evaluator Service Instance:**

```bash
cd codo-leet-platform/services/evaluator-service

# Install dependencies
npm install

# Create environment file
sudo nano .env
```

Add to `.env`:

```env
PORT=3004
NODE_ENV=production
```

```bash
# Build and start
npm run build
pm2 start dist/index.js --name "evaluator-service"
```

### Step 6: Deploy Frontend

#### 6.1 Frontend Deployment

**On Frontend Instance:**

```bash
cd codo-leet-platform/frontend

# Install dependencies
npm install

# Create environment file
sudo nano .env
```

Add to `.env`:

```env
VITE_USER_SERVICE_URL=http://USER_SERVICE_INSTANCE_IP:3001
VITE_PROBLEM_SERVICE_URL=http://PROBLEM_SERVICE_INSTANCE_IP:3002
VITE_SUBMISSION_SERVICE_URL=http://SUBMISSION_SERVICE_INSTANCE_IP:3003
```

```bash
# Build for production
npm run build

# Install and configure Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/codo-leet
```

Add Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or public IP

    root /home/ubuntu/codo-leet-platform/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional if using CORS)
    location /api/ {
        proxy_pass http://USER_SERVICE_INSTANCE_IP:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/codo-leet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🔧 Configuration Updates

### Step 7: Update Service URLs

After deployment, update all service configurations with actual EC2 instance IPs:

#### 7.1 Update Submission Service

```bash
# On Submission Service Instance
sudo nano /home/ubuntu/codo-leet-platform/services/submission-service/.env
```

Update:

```env
PROBLEM_SERVICE_URL=http://ACTUAL_PROBLEM_SERVICE_IP:3002
EVALUATOR_SERVICE_URL=http://ACTUAL_EVALUATOR_SERVICE_IP:3004
```

#### 7.2 Update Frontend Environment

```bash
# On Frontend Instance
sudo nano /home/ubuntu/codo-leet-platform/frontend/.env
```

Update:

```env
VITE_USER_SERVICE_URL=http://ACTUAL_USER_SERVICE_IP:3001
VITE_PROBLEM_SERVICE_URL=http://ACTUAL_PROBLEM_SERVICE_IP:3002
VITE_SUBMISSION_SERVICE_URL=http://ACTUAL_SUBMISSION_SERVICE_IP:3003
```

#### 7.3 Rebuild and Restart Services

```bash
# Restart backend services
pm2 restart all

# Rebuild and redeploy frontend
cd /home/ubuntu/codo-leet-platform/frontend
npm run build
sudo systemctl restart nginx
```

---

## 🗄️ Database Setup

### Step 8: MongoDB Atlas Configuration

#### 8.1 MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**: Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose AWS as cloud provider
3. **Configure Network Access**: Add EC2 instance IPs to IP whitelist
4. **Create Database User**: With read/write permissions
5. **Get Connection String**: For environment variables

#### 8.2 Seed Database

```bash
# On any backend instance
cd /home/ubuntu/codo-leet-platform
node seed.js
```

---

## 🔒 Security Hardening

### Step 9: Secure Your Deployment

#### 9.1 Update Security Groups

```bash
# Remove SSH access from 0.0.0.0/0, add only your IP
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr YOUR_IP/32

# Remove public access to backend ports, allow only frontend instance
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3001-3004 \
  --source-group sg-yyyyyyyyy
```

#### 9.2 SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoring and Maintenance

### Step 10: Setup Monitoring

#### 10.1 PM2 Monitoring

```bash
# View all processes
pm2 list

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart specific service
pm2 restart user-service
```

#### 10.2 Nginx Monitoring

```bash
# Check Nginx status
sudo systemctl status nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

#### 10.3 System Monitoring

```bash
# Check system resources
htop
df -h
free -m

# Check service ports
netstat -tulpn | grep :3001
```

---

## 💰 Cost Optimization

### Estimated Monthly Costs (US East-1)

#### Option 1: Separate Instances

- **5 × t3.small**: ~$75/month
- **1 × t3.medium**: ~$30/month
- **Total**: ~$105/month

#### Option 2: Consolidated

- **1 × t3.medium**: ~$30/month
- **1 × t3.small**: ~$15/month
- **Total**: ~$45/month

#### Additional Costs

- **Data Transfer**: ~$9/GB out
- **EBS Storage**: ~$0.10/GB/month
- **Elastic IP**: $3.65/month (if not attached to running instance)

### Cost Saving Tips

1. **Use Reserved Instances**: Save up to 75%
2. **Schedule Instances**: Auto-stop during off-hours
3. **Use Application Load Balancer**: Instead of multiple Elastic IPs
4. **Monitor Usage**: Use AWS Cost Explorer

---

## 🚀 Deployment Commands Summary

### Quick Deployment Script

```bash
#!/bin/bash
# Save as deploy.sh

# Backend Services
ssh -i key.pem ubuntu@$USER_SERVICE_IP "cd codo-leet-platform/services/user-service && git pull && npm run build && pm2 restart user-service"

ssh -i key.pem ubuntu@$PROBLEM_SERVICE_IP "cd codo-leet-platform/services/problem-service && git pull && npm run build && pm2 restart problem-service"

ssh -i key.pem ubuntu@$SUBMISSION_SERVICE_IP "cd codo-leet-platform/services/submission-service && git pull && npm run build && pm2 restart submission-service"

ssh -i key.pem ubuntu@$EVALUATOR_SERVICE_IP "cd codo-leet-platform/services/evaluator-service && git pull && npm run build && pm2 restart evaluator-service"

# Frontend
ssh -i key.pem ubuntu@$FRONTEND_IP "cd codo-leet-platform/frontend && git pull && npm run build && sudo systemctl restart nginx"

echo "Deployment completed!"
```

---

## 🎯 Post-Deployment Testing

### Step 11: Verify Deployment

#### 11.1 Health Checks

```bash
# Check service health
curl http://USER_SERVICE_IP:3001/health
curl http://PROBLEM_SERVICE_IP:3002/health
curl http://SUBMISSION_SERVICE_IP:3003/health
curl http://EVALUATOR_SERVICE_IP:3004/health

# Check frontend
curl http://FRONTEND_IP
```

#### 11.2 Functional Testing

1. **Access Frontend**: Visit your domain/IP
2. **Register User**: Create test account
3. **Login**: Verify authentication
4. **Browse Problems**: Check problem loading
5. **Submit Solution**: Test code submission
6. **Check Leaderboard**: Verify rankings
7. **WebSocket**: Confirm real-time updates

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Service Not Starting

```bash
# Check logs
pm2 logs service-name

# Check port availability
sudo netstat -tulpn | grep :3001

# Restart service
pm2 restart service-name
```

#### 2. Database Connection Issues

```bash
# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_MONGODB_URI').then(() => console.log('Connected')).catch(console.error)"
```

#### 3. CORS Issues

```bash
# Add CORS middleware in each service
npm install cors
```

#### 4. WebSocket Connection Issues

```bash
# Check if port 3003 is accessible
telnet SUBMISSION_SERVICE_IP 3003
```

---

## 🎉 Conclusion

You now have a fully deployed Codo-Leet platform running on AWS EC2 with:

✅ **Scalable Microservices Architecture**  
✅ **Real-time WebSocket Communication**  
✅ **Production-ready Configuration**  
✅ **SSL Security (if configured)**  
✅ **Process Management with PM2**  
✅ **Web Server with Nginx**  
✅ **Cost-optimized Setup**

Your platform is ready to handle multiple users solving coding problems with real-time feedback and competitive leaderboards!

### Next Steps

1. **Setup CI/CD Pipeline**: Automate deployments with GitHub Actions
2. **Configure Monitoring**: Add CloudWatch or third-party monitoring
3. **Setup Backups**: Regular database backups
4. **Load Testing**: Test with multiple concurrent users
5. **Performance Optimization**: Add caching and CDN

**Happy Coding! 🚀**
