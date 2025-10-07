# BuyForMe System Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Development Environment Setup](#development-environment-setup)
4. [Production Environment Setup](#production-environment-setup)
5. [Database Setup](#database-setup)
6. [Backend Deployment](#backend-deployment)
7. [Frontend Deployment](#frontend-deployment)
8. [Environment Configuration](#environment-configuration)
9. [SSL/HTTPS Setup](#sslhttps-setup)
10. [Monitoring and Logging](#monitoring-and-logging)
11. [Backup and Recovery](#backup-and-recovery)
12. [Security Configuration](#security-configuration)
13. [Performance Optimization](#performance-optimization)
14. [Troubleshooting](#troubleshooting)
15. [Maintenance](#maintenance)

## Overview

This guide provides comprehensive instructions for deploying the BuyForMe Management System in both development and production environments. The system consists of a Node.js/Express backend and a Next.js frontend, with MongoDB as the database.

## Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 100 Mbps

#### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: 1 Gbps

### Software Requirements

#### Required Software
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **MongoDB**: 6.0 or higher
- **Git**: Latest version

#### Optional Software
- **PM2**: Process manager for Node.js
- **Nginx**: Web server and reverse proxy
- **Docker**: Containerization
- **Redis**: Caching (optional)

### Domain and SSL
- **Domain Name**: Registered domain for production
- **SSL Certificate**: Valid SSL certificate
- **DNS Configuration**: Proper DNS setup

## Development Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/hathak-platform.git
cd hathak-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
```

### 4. Database Setup
```bash
# Start MongoDB (if installed locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update connection string in .env
```

### 5. Environment Configuration

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hathak-platform
JWT_SECRET=your-development-jwt-secret
SESSION_SECRET=your-development-session-secret
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HatHak Platform
```

### 6. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 7. Verify Installation
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## Production Environment Setup

### 1. Server Preparation

#### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

#### CentOS/RHEL
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB
sudo yum install -y mongodb-org

# Install Nginx
sudo yum install nginx -y

# Install PM2
sudo npm install -g pm2

# Install Git
sudo yum install git -y
```

### 2. Create Application User
```bash
# Create user
sudo useradd -m -s /bin/bash hathak
sudo usermod -aG sudo hathak

# Switch to user
sudo su - hathak
```

### 3. Clone and Setup Application
```bash
# Clone repository
git clone https://github.com/your-org/hathak-platform.git
cd hathak-platform

# Setup backend
cd backend
npm install --production
cp env.example .env

# Setup frontend
cd ../frontend
npm install --production
cp env.example .env.local
```

## Database Setup

### 1. MongoDB Configuration

#### Local MongoDB
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use hathak-platform
db.createUser({
  user: "hathak_user",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "hathak-platform" }
  ]
})
```

#### MongoDB Atlas (Cloud)
1. Create MongoDB Atlas account
2. Create new cluster
3. Create database user
4. Whitelist server IP
5. Get connection string
6. Update .env file

### 2. Database Initialization
```bash
# Run database seeder
cd backend
node seeder.js
node adminSeeder.js
```

### 3. Database Backup Setup
```bash
# Create backup script
cat > /home/hathak/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/hathak/backups"
mkdir -p $BACKUP_DIR

mongodump --db hathak-platform --out $BACKUP_DIR/backup_$DATE
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
EOF

chmod +x /home/hathak/backup-db.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/hathak/backup-db.sh
```

## Backend Deployment

### 1. Environment Configuration
```bash
# Production .env
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://hathak_user:secure_password@localhost:27017/hathak-platform
JWT_SECRET=your-super-secure-jwt-secret-key
SESSION_SECRET=your-super-secure-session-secret-key
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
UPLOAD_DIR=/home/hathak/uploads
MAX_FILE_SIZE=10485760
```

### 2. PM2 Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hathak-backend',
    script: './backend/index.js',
    cwd: '/home/hathak/hathak-platform',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/home/hathak/logs/backend-error.log',
    out_file: '/home/hathak/logs/backend-out.log',
    log_file: '/home/hathak/logs/backend-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF
```

### 3. Start Backend with PM2
```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u hathak --hp /home/hathak
```

### 4. Backend Health Check
```bash
# Check status
pm2 status
pm2 logs hathak-backend

# Test endpoint
curl http://localhost:5000/api/health
```

## Frontend Deployment

### 1. Build Frontend
```bash
cd frontend
npm run build
```

### 2. Environment Configuration
```bash
# Production .env.local
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=HatHak Platform
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret
EOF
```

### 3. PM2 Configuration for Frontend
```bash
# Add frontend to ecosystem.config.js
cat >> ecosystem.config.js << 'EOF'
  }, {
    name: 'hathak-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/hathak/hathak-platform/frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/hathak/logs/frontend-error.log',
    out_file: '/home/hathak/logs/frontend-out.log',
    log_file: '/home/hathak/logs/frontend-combined.log',
    time: true,
    max_memory_restart: '1G'
  }]
};
EOF
```

### 4. Start Frontend with PM2
```bash
# Restart PM2 with new configuration
pm2 restart ecosystem.config.js
pm2 save
```

## Environment Configuration

### 1. Nginx Configuration
```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/hathak-platform << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static Files
    location /static/ {
        alias /home/hathak/hathak-platform/frontend/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads
    location /uploads/ {
        alias /home/hathak/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # File Upload Size
    client_max_body_size 10M;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/hathak-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Firewall Configuration
```bash
# Configure UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## SSL/HTTPS Setup

### 1. Let's Encrypt SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 2. SSL Auto-Renewal
```bash
# Add to crontab
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### 1. Log Directory Setup
```bash
# Create log directories
mkdir -p /home/hathak/logs
mkdir -p /var/log/hathak

# Set permissions
sudo chown -R hathak:hathak /home/hathak/logs
sudo chown -R hathak:hathak /var/log/hathak
```

### 2. Log Rotation
```bash
# Create logrotate configuration
sudo cat > /etc/logrotate.d/hathak-platform << 'EOF'
/home/hathak/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 hathak hathak
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

### 3. Monitoring Setup
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# PM2 monitoring
pm2 install pm2-logrotate
pm2 install pm2-server-monit
```

### 4. Health Check Script
```bash
# Create health check script
cat > /home/hathak/health-check.sh << 'EOF'
#!/bin/bash

# Check backend
if ! curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "$(date): Backend health check failed" >> /home/hathak/logs/health-check.log
    pm2 restart hathak-backend
fi

# Check frontend
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "$(date): Frontend health check failed" >> /home/hathak/logs/health-check.log
    pm2 restart hathak-frontend
fi

# Check MongoDB
if ! pgrep mongod > /dev/null; then
    echo "$(date): MongoDB not running" >> /home/hathak/logs/health-check.log
    sudo systemctl start mongod
fi
EOF

chmod +x /home/hathak/health-check.sh

# Add to crontab
crontab -e
# Add: */5 * * * * /home/hathak/health-check.sh
```

## Backup and Recovery

### 1. Database Backup
```bash
# Enhanced backup script
cat > /home/hathak/backup-full.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/hathak/backups"
mkdir -p $BACKUP_DIR

# Database backup
mongodump --db hathak-platform --out $BACKUP_DIR/db_backup_$DATE
tar -czf $BACKUP_DIR/db_backup_$DATE.tar.gz -C $BACKUP_DIR db_backup_$DATE
rm -rf $BACKUP_DIR/db_backup_$DATE

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='logs' \
    /home/hathak/hathak-platform

# Uploads backup
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /home/hathak/uploads

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*_backup_*.tar.gz" -mtime +30 -delete

echo "$(date): Backup completed" >> /home/hathak/logs/backup.log
EOF

chmod +x /home/hathak/backup-full.sh

# Schedule daily backup
crontab -e
# Add: 0 3 * * * /home/hathak/backup-full.sh
```

### 2. Recovery Procedures
```bash
# Database recovery
tar -xzf db_backup_20240115_030000.tar.gz
mongorestore --db hathak-platform db_backup_20240115_030000/hathak-platform

# Application recovery
tar -xzf app_backup_20240115_030000.tar.gz -C /home/hathak/
cd /home/hathak/hathak-platform
npm install --production

# Uploads recovery
tar -xzf uploads_backup_20240115_030000.tar.gz -C /home/hathak/
```

## Security Configuration

### 1. System Security
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install fail2ban
sudo apt install fail2ban -y

# Configure fail2ban
sudo cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
EOF

sudo systemctl restart fail2ban
```

### 2. Application Security
```bash
# Set proper file permissions
chmod 600 /home/hathak/hathak-platform/backend/.env
chmod 600 /home/hathak/hathak-platform/frontend/.env.local
chmod 700 /home/hathak/uploads
chmod 700 /home/hathak/logs
```

### 3. Environment Security
```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Performance Optimization

### 1. Node.js Optimization
```bash
# Update PM2 configuration for better performance
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hathak-backend',
    script: './backend/index.js',
    cwd: '/home/hathak/hathak-platform',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      NODE_OPTIONS: '--max-old-space-size=2048'
    },
    error_file: '/home/hathak/logs/backend-error.log',
    out_file: '/home/hathak/logs/backend-out.log',
    log_file: '/home/hathak/logs/backend-combined.log',
    time: true,
    max_memory_restart: '2G',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};
EOF
```

### 2. MongoDB Optimization
```bash
# MongoDB configuration
sudo cat > /etc/mongod.conf << 'EOF'
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
EOF

sudo systemctl restart mongod
```

### 3. Nginx Optimization
```bash
# Update Nginx configuration for better performance
sudo cat >> /etc/nginx/nginx.conf << 'EOF'
worker_processes auto;
worker_cpu_affinity auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;
    
    # Buffer sizes
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    output_buffers 1 32k;
    postpone_output 1460;
}
EOF

sudo nginx -t && sudo systemctl restart nginx
```

## Troubleshooting

### 1. Common Issues

#### Backend Not Starting
```bash
# Check logs
pm2 logs hathak-backend
tail -f /home/hathak/logs/backend-error.log

# Check environment
cat backend/.env

# Check dependencies
cd backend && npm list
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run build

# Check environment variables
cat .env.local
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod
mongo --eval "db.adminCommand('ismaster')"

# Check connection string
grep MONGODB_URI backend/.env
```

#### Nginx Issues
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
```

### 2. Performance Issues

#### High Memory Usage
```bash
# Check memory usage
free -h
htop

# Restart PM2 processes
pm2 restart all
pm2 save
```

#### Slow Database Queries
```bash
# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check slow queries
mongo --eval "db.setProfilingLevel(2, {slowms: 100})"
```

#### High CPU Usage
```bash
# Check CPU usage
top
htop

# Check PM2 processes
pm2 monit
```

### 3. Log Analysis
```bash
# Application logs
tail -f /home/hathak/logs/backend-combined.log
tail -f /home/hathak/logs/frontend-combined.log

# System logs
sudo tail -f /var/log/syslog
sudo tail -f /var/log/nginx/error.log

# Database logs
sudo tail -f /var/log/mongodb/mongod.log
```

## Maintenance

### 1. Regular Maintenance Tasks

#### Daily Tasks
```bash
# Check system status
pm2 status
sudo systemctl status mongod nginx

# Check disk space
df -h

# Check logs for errors
grep -i error /home/hathak/logs/*.log
```

#### Weekly Tasks
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean old logs
sudo logrotate -f /etc/logrotate.d/hathak-platform

# Check backup status
ls -la /home/hathak/backups/
```

#### Monthly Tasks
```bash
# Update Node.js dependencies
cd /home/hathak/hathak-platform/backend
npm audit fix
npm update

cd /home/hathak/hathak-platform/frontend
npm audit fix
npm update

# Rebuild frontend
npm run build
pm2 restart hathak-frontend
```

### 2. Update Procedures

#### Application Updates
```bash
# Backup current version
/home/hathak/backup-full.sh

# Pull latest changes
cd /home/hathak/hathak-platform
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart hathak-backend

# Update frontend
cd ../frontend
npm install --production
npm run build
pm2 restart hathak-frontend
```

#### System Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Update MongoDB (if needed)
sudo apt update
sudo apt install mongodb-org
```

### 3. Monitoring and Alerts

#### Setup Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# PM2 monitoring
pm2 install pm2-server-monit
```

#### Alert Configuration
```bash
# Create alert script
cat > /home/hathak/alert.sh << 'EOF'
#!/bin/bash
# Send alerts for critical issues
# Implement your preferred alerting method (email, Slack, etc.)
EOF

chmod +x /home/hathak/alert.sh
```

---

## Conclusion

This deployment guide provides comprehensive instructions for deploying the BuyForMe Management System in production. Follow these steps carefully and adapt them to your specific environment and requirements.

For additional support or questions about deployment, please refer to the main system documentation or contact the development team.

---

*This deployment guide is maintained by the development team and updated with each system release.*
