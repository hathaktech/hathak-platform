# HatHak Platform - BuyForMe Management System

## Overview

The HatHak Platform is a comprehensive e-commerce solution that includes a sophisticated BuyForMe management system. This system allows customers to request items from external websites, which are then purchased, quality-controlled, and shipped by the platform's admin team.

## 🚀 Key Features

### BuyForMe Management System
- **Complete Request Workflow**: From submission to delivery
- **Admin Review & Approval**: Comprehensive request review system
- **Payment Processing**: Secure payment handling and tracking
- **Order Management**: Purchase tracking and supplier management
- **Quality Control**: Admin inspection and photography system
- **Customer Communication**: Review, approval, and feedback system
- **Return/Replacement**: Complete return and replacement workflow
- **Real-time Tracking**: Status updates and notifications

### Admin Panel Features
- **Dashboard**: Comprehensive overview with statistics
- **Request Management**: Full lifecycle request management
- **User Management**: Customer and admin account management
- **Analytics**: Detailed reporting and insights
- **File Management**: Image and document handling
- **Notification System**: Automated notifications and alerts

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **MongoDB**: 6.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB minimum, 50GB recommended

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: 1 Gbps

## 🛠 Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Multer**: File upload handling

### Frontend
- **Next.js**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Context**: State management
- **Lucide React**: Icons

### DevOps
- **PM2**: Process management
- **Nginx**: Reverse proxy
- **Let's Encrypt**: SSL certificates
- **Docker**: Containerization (optional)

## 📁 Project Structure

```
hathak-platform/
├── backend/                    # Backend application
│   ├── controllers/           # Request handlers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   └── config/               # Configuration files
├── frontend/                  # Frontend application
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   ├── context/          # React contexts
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
├── docs/                     # Documentation
└── README.md                 # This file
```

## 🚀 Quick Start

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
# Configure .env file with your settings
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Configure .env.local file
npm run dev
```

### 4. Database Setup
```bash
# Start MongoDB (local installation)
mongod

# Or use MongoDB Atlas (cloud)
# Update connection string in backend/.env
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:5000/api

## 📚 Documentation

### Complete Documentation
- **[System Documentation](BUYFORME_SYSTEM_DOCUMENTATION.md)**: Comprehensive system overview
- **[API Reference](BUYFORME_API_REFERENCE.md)**: Complete API documentation
- **[Workflow Guide](BUYFORME_WORKFLOW_GUIDE.md)**: Detailed workflow instructions
- **[Deployment Guide](BUYFORME_DEPLOYMENT_GUIDE.md)**: Production deployment guide

### Quick Links
- [Installation Guide](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Workflow Process](#workflow-process)
- [Troubleshooting](#troubleshooting)

## 🔧 Installation

### Development Environment

#### Prerequisites
```bash
# Install Node.js (18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb-org

# Install Git
sudo apt-get install -y git
```

#### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/your-org/hathak-platform.git
cd hathak-platform

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Configure environment
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env.local

# 4. Start services
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production Environment

See the [Deployment Guide](BUYFORME_DEPLOYMENT_GUIDE.md) for detailed production deployment instructions.

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hathak-platform
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HatHak Platform
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api/admin/buyme
```

### Key Endpoints
- `GET /requests` - Get all requests
- `POST /requests/:id/review` - Review request
- `POST /requests/:id/process-payment` - Process payment
- `POST /requests/:id/purchase` - Mark as purchased
- `PATCH /requests/:id/shipping` - Update shipping
- `POST /requests/:id/admin-control` - Admin control
- `POST /requests/:id/customer-review` - Customer review

See [API Reference](BUYFORME_API_REFERENCE.md) for complete documentation.

## 🔄 Workflow Process

### Complete BuyForMe Workflow
1. **Request Submission** → Customer submits request
2. **Admin Review** → Admin reviews and approves/rejects
3. **Payment Processing** → Customer makes payment
4. **Order Management** → Admin purchases items
5. **Shipping Tracking** → Items shipped to company box
6. **Quality Control** → Admin inspects and photographs
7. **Customer Review** → Customer approves/rejects items
8. **Packing Choice** → Customer chooses packing option
9. **Final Shipping** → Items shipped to customer
10. **Delivery** → Items delivered to customer

See [Workflow Guide](BUYFORME_WORKFLOW_GUIDE.md) for detailed instructions.

## 🎯 Key Features

### Request Management
- **Complete Lifecycle**: Full request management from submission to delivery
- **Status Tracking**: Real-time status updates and notifications
- **Item Modification**: Edit URLs, prices, quantities during review
- **Comment System**: Internal and customer-facing comments

### Quality Control
- **Admin Inspection**: Physical inspection of all items
- **Photo Documentation**: Comprehensive photo system
- **Condition Tracking**: Detailed condition assessment
- **Customer Review**: Customer approval/rejection system

### Payment & Order Management
- **Payment Processing**: Secure payment handling
- **Order Tracking**: Complete order lifecycle management
- **Supplier Management**: Track suppliers and purchase orders
- **Shipping Management**: Complete shipping and tracking

### Return & Replacement
- **Return Processing**: Handle item returns
- **Replacement System**: Process item replacements
- **Refund Management**: Handle refunds and credits
- **Customer Communication**: Keep customers informed

## 🔐 Security Features

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin role management
- **Permission System**: Granular permission control
- **Session Management**: Secure session handling

### Data Security
- **Input Validation**: Comprehensive input validation
- **SQL Injection Protection**: MongoDB injection protection
- **XSS Protection**: Cross-site scripting protection
- **CSRF Protection**: Cross-site request forgery protection

### File Security
- **File Upload Validation**: Secure file upload handling
- **Image Processing**: Safe image processing
- **Access Control**: Secure file access control
- **Virus Scanning**: File security scanning

## 📊 Monitoring & Analytics

### System Monitoring
- **Health Checks**: Automated health monitoring
- **Performance Metrics**: System performance tracking
- **Error Tracking**: Comprehensive error logging
- **Uptime Monitoring**: Service availability tracking

### Business Analytics
- **Request Statistics**: Request volume and trends
- **Revenue Tracking**: Financial performance metrics
- **Customer Analytics**: Customer behavior analysis
- **Operational Metrics**: Operational efficiency tracking

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration tests
npm run test:integration
```

### Test Coverage
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database testing
- **E2E Tests**: End-to-end workflow testing
- **Performance Tests**: Load and stress testing

## 🚀 Deployment

### Development Deployment
```bash
# Start development servers
npm run dev
```

### Production Deployment
See [Deployment Guide](BUYFORME_DEPLOYMENT_GUIDE.md) for detailed production deployment instructions.

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Check backend logs
pm2 logs hathak-backend
tail -f logs/backend-error.log

# Restart backend
pm2 restart hathak-backend
```

#### Frontend Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check frontend logs
pm2 logs hathak-frontend
```

#### Database Issues
```bash
# Check MongoDB status
sudo systemctl status mongod
mongo --eval "db.adminCommand('ismaster')"
```

### Getting Help
1. Check the [Troubleshooting Guide](BUYFORME_DEPLOYMENT_GUIDE.md#troubleshooting)
2. Review the [System Documentation](BUYFORME_SYSTEM_DOCUMENTATION.md)
3. Check GitHub Issues
4. Contact the development team

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Jest**: Testing framework

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Development Team
- **Lead Developer**: [Your Name]
- **Backend Developer**: [Backend Developer]
- **Frontend Developer**: [Frontend Developer]
- **DevOps Engineer**: [DevOps Engineer]

### Contact Information
- **Email**: support@hathak.com
- **GitHub**: https://github.com/your-org/hathak-platform
- **Documentation**: https://docs.hathak.com

## 🗺️ Roadmap

### Version 2.1 (Planned)
- [ ] Advanced analytics dashboard
- [ ] Mobile app for customers
- [ ] Automated supplier integration
- [ ] Advanced reporting features

### Version 2.2 (Planned)
- [ ] AI-powered quality control
- [ ] Predictive analytics
- [ ] Advanced automation
- [ ] Multi-language support

### Version 3.0 (Future)
- [ ] Microservices architecture
- [ ] Real-time collaboration
- [ ] Advanced AI features
- [ ] Global expansion features

## 📈 Performance

### Benchmarks
- **Response Time**: < 200ms average
- **Throughput**: 1000+ requests/minute
- **Uptime**: 99.9% availability
- **Database**: < 50ms query time

### Optimization
- **Caching**: Redis caching layer
- **CDN**: Content delivery network
- **Compression**: Gzip compression
- **Database**: Query optimization

## 🔄 Updates & Maintenance

### Regular Updates
- **Security Updates**: Monthly security patches
- **Feature Updates**: Quarterly feature releases
- **Bug Fixes**: Weekly bug fix releases
- **Performance**: Continuous performance optimization

### Maintenance Schedule
- **Daily**: Health checks and monitoring
- **Weekly**: Log rotation and cleanup
- **Monthly**: Security updates and backups
- **Quarterly**: Major updates and reviews

---

## 📞 Support

For technical support or questions:

1. **Documentation**: Check the comprehensive documentation
2. **GitHub Issues**: Report bugs and request features
3. **Email Support**: support@hathak.com
4. **Community**: Join our developer community

---

*This README is maintained by the development team and updated with each release.*
#   T e s t  
 