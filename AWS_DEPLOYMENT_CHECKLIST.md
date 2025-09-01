# 📋 AWS Deployment Checklist - Codo-Leet Platform

## 🎯 Pre-Deployment Checklist

### ✅ AWS Prerequisites

- [ ] AWS Account created and verified
- [ ] AWS CLI installed and configured
- [ ] EC2 Key Pair created and downloaded
- [ ] IAM user with EC2 permissions
- [ ] MongoDB Atlas cluster created

### ✅ Local Prerequisites

- [ ] Code pushed to GitHub repository
- [ ] Environment variables documented
- [ ] Domain name registered (optional)

---

## 🚀 Quick Deployment Steps

### Step 1: Create Security Groups (5 minutes)

```bash
# Backend Security Group
aws ec2 create-security-group --group-name codo-leet-backend-sg
aws ec2 authorize-security-group-ingress --protocol tcp --port 22,3001-3004

# Frontend Security Group
aws ec2 create-security-group --group-name codo-leet-frontend-sg
aws ec2 authorize-security-group-ingress --protocol tcp --port 22,80,443
```

### Step 2: Launch EC2 Instances (10 minutes)

#### Option A: Separate Instances (Recommended)

- [ ] User Service Instance (t3.small)
- [ ] Problem Service Instance (t3.small)
- [ ] Submission Service Instance (t3.small)
- [ ] Evaluator Service Instance (t3.medium)
- [ ] Frontend Instance (t3.small)

#### Option B: Consolidated (Cost-effective)

- [ ] Backend Instance (t3.medium) - All 4 services
- [ ] Frontend Instance (t3.small)

### Step 3: Configure Each Instance (15 minutes per instance)

```bash
# On each instance
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential git
sudo npm install -g pm2
git clone YOUR_GITHUB_REPO
cd project && npm install
```

### Step 4: Deploy Services (20 minutes)

#### Backend Services Environment Variables:

```env
# User Service (.env)
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret

# Problem Service (.env)
PORT=3002
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret

# Submission Service (.env)
PORT=3003
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
PROBLEM_SERVICE_URL=http://PROBLEM_IP:3002
EVALUATOR_SERVICE_URL=http://EVALUATOR_IP:3004

# Evaluator Service (.env)
PORT=3004
```

#### Deploy Commands:

```bash
# On each service instance
cd services/SERVICE_NAME
npm run build
pm2 start dist/index.js --name "SERVICE_NAME"
pm2 save && pm2 startup
```

### Step 5: Deploy Frontend (15 minutes)

```bash
# Create .env file
VITE_USER_SERVICE_URL=http://USER_IP:3001
VITE_PROBLEM_SERVICE_URL=http://PROBLEM_IP:3002
VITE_SUBMISSION_SERVICE_URL=http://SUBMISSION_IP:3003

# Build and deploy
npm run build
sudo apt install nginx -y
# Configure nginx (see full guide)
sudo systemctl restart nginx
```

### Step 6: Database Setup (5 minutes)

```bash
# Run on any backend instance
node seed.js
```

---

## 🔍 Health Check Commands

### Service Health Checks

```bash
curl http://USER_IP:3001/health
curl http://PROBLEM_IP:3002/health
curl http://SUBMISSION_IP:3003/health
curl http://EVALUATOR_IP:3004/health
curl http://FRONTEND_IP
```

### PM2 Monitoring

```bash
pm2 list        # View all processes
pm2 logs        # View logs
pm2 monit       # Resource monitoring
pm2 restart all # Restart all services
```

---

## 💰 Cost Estimate

### Option A: Separate Instances

| Service            | Instance  | Monthly Cost   |
| ------------------ | --------- | -------------- |
| User Service       | t3.small  | ~$15           |
| Problem Service    | t3.small  | ~$15           |
| Submission Service | t3.small  | ~$15           |
| Evaluator Service  | t3.medium | ~$30           |
| Frontend           | t3.small  | ~$15           |
| **Total**          |           | **~$90/month** |

### Option B: Consolidated

| Service         | Instance  | Monthly Cost   |
| --------------- | --------- | -------------- |
| Backend (All 4) | t3.medium | ~$30           |
| Frontend        | t3.small  | ~$15           |
| **Total**       |           | **~$45/month** |

**💡 Cost Saving Tip**: Use AWS Reserved Instances for 75% savings!

---

## 🚨 Common Issues & Solutions

### Issue 1: Service Won't Start

```bash
# Check logs
pm2 logs service-name

# Check if port is available
sudo netstat -tulpn | grep :3001

# Restart service
pm2 restart service-name
```

### Issue 2: Database Connection Failed

```bash
# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_URI').then(() => console.log('OK')).catch(console.error)"

# Check MongoDB Atlas IP whitelist
# Add EC2 instance IPs to Atlas
```

### Issue 3: Frontend Can't Connect to Backend

```bash
# Check CORS in backend services
# Verify service URLs in frontend .env
# Check security group rules
```

### Issue 4: WebSocket Not Working

```bash
# Check if port 3003 is accessible
telnet SUBMISSION_IP 3003

# Verify Socket.IO client/server versions match
```

---

## 🎯 Production Readiness Checklist

### Security

- [ ] Remove SSH access from 0.0.0.0/0
- [ ] Configure SSL certificate with Let's Encrypt
- [ ] Update default passwords and secrets
- [ ] Enable VPC and private subnets (advanced)

### Monitoring

- [ ] Setup CloudWatch monitoring
- [ ] Configure log aggregation
- [ ] Setup uptime monitoring
- [ ] Create backup strategies

### Performance

- [ ] Configure load balancer (if needed)
- [ ] Setup auto-scaling (if needed)
- [ ] Optimize database queries
- [ ] Add caching layer (Redis)

### Maintenance

- [ ] Setup automated backups
- [ ] Create deployment scripts
- [ ] Document incident response procedures
- [ ] Setup CI/CD pipeline

---

## 🚀 Quick Deploy Script

Save as `quick-deploy.sh`:

```bash
#!/bin/bash

# Set your IPs
USER_IP="1.2.3.4"
PROBLEM_IP="1.2.3.5"
SUBMISSION_IP="1.2.3.6"
EVALUATOR_IP="1.2.3.7"
FRONTEND_IP="1.2.3.8"
KEY_PATH="your-key.pem"

echo "🚀 Starting deployment..."

# Deploy backend services
echo "📦 Deploying User Service..."
ssh -i $KEY_PATH ubuntu@$USER_IP "cd codo-leet-platform/services/user-service && git pull && npm run build && pm2 restart user-service"

echo "📦 Deploying Problem Service..."
ssh -i $KEY_PATH ubuntu@$PROBLEM_IP "cd codo-leet-platform/services/problem-service && git pull && npm run build && pm2 restart problem-service"

echo "📦 Deploying Submission Service..."
ssh -i $KEY_PATH ubuntu@$SUBMISSION_IP "cd codo-leet-platform/services/submission-service && git pull && npm run build && pm2 restart submission-service"

echo "📦 Deploying Evaluator Service..."
ssh -i $KEY_PATH ubuntu@$EVALUATOR_IP "cd codo-leet-platform/services/evaluator-service && git pull && npm run build && pm2 restart evaluator-service"

echo "🌐 Deploying Frontend..."
ssh -i $KEY_PATH ubuntu@$FRONTEND_IP "cd codo-leet-platform/frontend && git pull && npm run build && sudo systemctl restart nginx"

echo "✅ Deployment completed!"
echo "🔗 Access your app at: http://$FRONTEND_IP"
```

---

## 📞 Support & Resources

### AWS Documentation

- [EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [Cost Calculator](https://calculator.aws/)

### Useful Commands

```bash
# AWS CLI - List instances
aws ec2 describe-instances --query 'Reservations[].Instances[].{Name:Tags[?Key==`Name`].Value|[0],IP:PublicIpAddress,State:State.Name}'

# PM2 - Save configuration
pm2 save && pm2 startup

# Nginx - Test configuration
sudo nginx -t

# System - Check resources
htop && df -h && free -m
```

**🎉 Your Codo-Leet platform is now running on AWS!**

**Total Deployment Time**: ~90 minutes  
**Ongoing Management**: ~30 minutes/week
