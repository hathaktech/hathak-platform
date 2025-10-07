# BuyForMe Management System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [Workflow Process](#workflow-process)
7. [Status Management](#status-management)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Installation & Setup](#installation--setup)
10. [Configuration](#configuration)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)
14. [API Reference](#api-reference)

## System Overview

The BuyForMe Management System is a comprehensive platform for managing customer requests to purchase items from external websites. The system handles the entire workflow from request submission to final delivery, including payment processing, order management, shipping tracking, quality control, and customer communication.

### Key Features
- **Request Management**: Complete request lifecycle management
- **Payment Processing**: Secure payment handling and tracking
- **Order Management**: Purchase tracking and supplier management
- **Shipping Management**: Complete shipping and delivery tracking
- **Quality Control**: Admin inspection and photography system
- **Customer Communication**: Review, approval, and feedback system
- **Return/Replacement**: Complete return and replacement workflow
- **Analytics**: Comprehensive reporting and statistics

### Technology Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: JWT-based admin authentication
- **File Upload**: Image handling for product photos
- **Real-time Updates**: Status tracking and notifications

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Panel   │    │   API Routes    │    │   Collections   │
│   Components    │    │   Controllers   │    │   Models        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Structure
```
frontend/src/
├── app/admin/buyme/           # Admin BuyForMe pages
├── components/admin/          # Admin components
│   ├── BuyForMeManagement.tsx
│   ├── BuyForMeRequestDetail.tsx
│   └── BuyForMeRequestReview.tsx
└── services/                  # API services

backend/
├── controllers/               # Request handlers
│   └── buyForMeController.js
├── models/                    # Database models
│   └── BuyForMe.js
├── routes/                    # API routes
│   └── buyForMeRoutes.js
└── middleware/                # Custom middleware
```

## Database Schema

### BuyForMe Model
```javascript
{
  // Basic Information
  customerId: ObjectId,           // Reference to User
  customerName: String,           // Customer name
  customerEmail: String,          // Customer email
  
  // Request Details
  items: [{
    name: String,                 // Product name
    url: String,                  // Product URL
    quantity: Number,             // Quantity requested
    price: Number,                // Product price
    description: String,          // Product description
    photos: [String],             // Item photos
    received: Boolean,            // Received status
    receivedAt: Date,             // Received date
    condition: String,            // Item condition
    notes: String                 // Item notes
  }],
  
  totalAmount: Number,            // Total request amount
  
  // Status Management
  status: String,                 // Current status
  priority: String,               // Request priority
  reviewStatus: String,           // Review status
  
  // Review System
  reviewComments: [{
    comment: String,              // Comment text
    adminId: ObjectId,            // Admin who commented
    adminName: String,            // Admin name
    createdAt: Date,              // Comment date
    isInternal: Boolean           // Internal comment flag
  }],
  
  // Payment Information
  paymentDetails: {
    paymentMethod: String,        // Payment method
    transactionId: String,        // Transaction ID
    paymentDate: Date,            // Payment date
    amount: Number,               // Payment amount
    currency: String              // Currency
  },
  
  // Purchase Information
  purchaseDetails: {
    purchaseDate: Date,           // Purchase date
    purchasedBy: ObjectId,        // Admin who purchased
    supplier: String,             // Supplier name
    purchaseOrderNumber: String,  // Purchase order number
    estimatedDelivery: Date,      // Estimated delivery
    actualDelivery: Date          // Actual delivery
  },
  
  // Shipping Information
  shippingDetails: {
    trackingNumber: String,       // Tracking number
    carrier: String,              // Shipping carrier
    shippedDate: Date,            // Shipped date
    estimatedArrival: Date,       // Estimated arrival
    actualArrival: Date,          // Actual arrival
    boxAddress: {                 // Box address
      name: String,
      address: String,
      city: String,
      country: String,
      postalCode: String
    }
  },
  
  // Control Information
  controlDetails: {
    controlledBy: ObjectId,       // Admin who controlled
    controlDate: Date,            // Control date
    controlNotes: String,         // Control notes
    photos: [String],             // Control photos
    itemConditions: [{            // Item conditions
      itemId: ObjectId,
      condition: String,
      notes: String,
      photos: [String]
    }]
  },
  
  // Customer Review
  customerReview: {
    reviewedAt: Date,             // Review date
    customerDecision: String,     // Customer decision
    customerNotes: String,        // Customer notes
    rejectedItems: [{             // Rejected items
      itemId: ObjectId,
      reason: String,
      action: String
    }]
  },
  
  // Packing Choice
  packingChoice: {
    choice: String,               // Packing choice
    chosenAt: Date,               // Choice date
    customerNotes: String         // Customer notes
  },
  
  // Shipping Address
  shippingAddress: {
    name: String,                 // Recipient name
    address: String,              // Street address
    city: String,                 // City
    country: String,              // Country
    postalCode: String            // Postal code
  },
  
  // Metadata
  createdAt: Date,                // Creation date
  updatedAt: Date,                // Last update
  reviewedAt: Date,               // Review date
  reviewedBy: ObjectId,           // Admin who reviewed
  customerNotified: Boolean,      // Notification status
  notes: String,                  // General notes
  adminNotes: String,             // Admin notes
  trackingNumber: String,         // Tracking number
  packagingChoice: String,        // Packaging choice
  rejectionReason: String,        // Rejection reason
  estimatedDelivery: Date,        // Estimated delivery
  actualDelivery: Date,           // Actual delivery
  cancelledAt: Date,              // Cancellation date
  cancellationReason: String      // Cancellation reason
}
```

### Status Enum Values
```javascript
const STATUSES = [
  'pending',                    // Initial request
  'under_review',              // Under admin review
  'approved',                  // Approved by admin
  'rejected',                  // Rejected by admin
  'payment_pending',           // Waiting for payment
  'payment_completed',         // Payment received
  'purchased',                 // Items purchased
  'to_be_shipped_to_box',      // Shipping to box
  'arrived_to_box',            // Arrived at box
  'admin_control',             // Admin inspection
  'customer_review',           // Customer review
  'customer_approved',         // Customer approved
  'customer_rejected',         // Customer rejected
  'packing_choice',            // Packing choice
  'packed',                    // Items packed
  'shipped',                   // Shipped to customer
  'delivered',                 // Delivered
  'return_requested',          // Return requested
  'replacement_requested',     // Replacement requested
  'cancelled'                  // Cancelled
];
```

## API Endpoints

### Base URL
```
/api/admin/buyme
```

### Authentication
All endpoints require admin authentication via JWT token in the Authorization header:
```
Authorization: Bearer <admin_jwt_token>
```

### Endpoints Overview

#### 1. Request Management
- `GET /requests` - Get all requests with filtering
- `GET /requests/:id` - Get single request
- `DELETE /requests/:id` - Delete request

#### 2. Review System
- `GET /requests/pending-review` - Get pending review requests
- `POST /requests/:id/review` - Review and approve/reject request
- `POST /requests/:id/comments` - Add comment to request

#### 3. Payment Processing
- `POST /requests/:id/process-payment` - Process payment completion

#### 4. Order Management
- `POST /requests/:id/purchase` - Mark items as purchased

#### 5. Shipping Management
- `PATCH /requests/:id/shipping` - Update shipping status

#### 6. Quality Control
- `POST /requests/:id/admin-control` - Admin control and photography

#### 7. Customer Review
- `POST /requests/:id/customer-review` - Customer review and approval

#### 8. Packing Management
- `POST /requests/:id/packing-choice` - Record packing choice

#### 9. Return/Replacement
- `POST /requests/:id/return-replacement` - Handle returns/replacements

#### 10. Notifications
- `POST /requests/:id/notify` - Notify customer

#### 11. Statistics
- `GET /statistics` - Get system statistics

### Detailed Endpoint Documentation

#### GET /requests
Get all BuyForMe requests with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `search` (optional): Search term
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [...],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50,
      "limit": 10
    },
    "statusCounts": {
      "pending": 5,
      "approved": 10,
      "purchased": 8
    }
  }
}
```

#### POST /requests/:id/review
Review and approve/reject a BuyForMe request.

**Request Body:**
```json
{
  "reviewStatus": "approved|rejected|needs_modification",
  "comment": "Review comment",
  "rejectionReason": "Reason for rejection",
  "isInternal": false,
  "modifiedItems": [
    {
      "itemId": "item_id",
      "action": "remove|modify",
      "updates": {
        "name": "Updated name",
        "url": "Updated URL",
        "price": 99.99,
        "quantity": 2
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Request approved successfully"
}
```

#### POST /requests/:id/process-payment
Process payment completion for an approved request.

**Request Body:**
```json
{
  "paymentMethod": "credit_card|paypal|bank_transfer|cash",
  "transactionId": "TXN123456789",
  "amount": 299.99
}
```

#### POST /requests/:id/purchase
Mark items as purchased after payment completion.

**Request Body:**
```json
{
  "supplier": "Amazon",
  "purchaseOrderNumber": "PO-2024-001",
  "estimatedDelivery": "2024-02-15T00:00:00Z"
}
```

#### PATCH /requests/:id/shipping
Update shipping status and tracking information.

**Request Body:**
```json
{
  "status": "shipped|arrived",
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "UPS",
  "estimatedArrival": "2024-02-20T00:00:00Z"
}
```

#### POST /requests/:id/admin-control
Complete admin control and photography of arrived items.

**Request Body:**
```json
{
  "controlNotes": "All items in good condition",
  "photos": ["photo1.jpg", "photo2.jpg"],
  "itemConditions": [
    {
      "itemId": "item_id",
      "condition": "excellent|good|fair|damaged|defective",
      "notes": "Item condition notes",
      "photos": ["item_photo1.jpg"]
    }
  ]
}
```

#### POST /requests/:id/customer-review
Record customer review and approval/rejection.

**Request Body:**
```json
{
  "customerDecision": "approved|rejected|needs_replacement",
  "customerNotes": "Customer feedback",
  "rejectedItems": [
    {
      "itemId": "item_id",
      "reason": "Item damaged",
      "action": "return|replace|refund"
    }
  ]
}
```

#### POST /requests/:id/packing-choice
Record customer packing choice.

**Request Body:**
```json
{
  "choice": "pack_now|wait_in_box",
  "customerNotes": "Please pack carefully"
}
```

#### POST /requests/:id/return-replacement
Handle return or replacement requests.

**Request Body:**
```json
{
  "action": "return|replace",
  "items": ["item_id1", "item_id2"],
  "reason": "Items damaged during shipping",
  "replacementDetails": {
    "newItems": [...],
    "estimatedDelivery": "2024-02-25T00:00:00Z"
  }
}
```

## Frontend Components

### BuyForMeManagement.tsx
Main management interface for BuyForMe requests.

**Features:**
- Request overview dashboard
- Status filtering and search
- Request table with actions
- Status overview cards
- Export functionality

**Props:**
- None (uses context for admin authentication)

**State:**
- `requests`: Array of BuyForMe requests
- `selectedRequest`: Currently selected request
- `reviewRequest`: Request being reviewed
- `filterStatus`: Current status filter
- `searchTerm`: Search term
- `isLoading`: Loading state

**Key Methods:**
- `getStatusColor(status)`: Get color for status badge
- `getStatusIcon(status)`: Get icon for status
- `filteredRequests`: Filtered requests based on search and status

### BuyForMeRequestDetail.tsx
Detailed view and management of individual requests.

**Features:**
- Tabbed interface (Overview, Workflow, Items, Packaging, Shipping)
- Workflow step management
- Item-level operations
- Photo management
- Status updates
- Comment system

**Props:**
- `request`: BuyForMe request object
- `onUpdate`: Update callback function
- `onClose`: Close callback function

**State:**
- `currentRequest`: Current request data
- `activeTab`: Active tab identifier
- `isEditing`: Edit mode state
- `newPhoto`: New photo file
- `newNote`: New note text

### BuyForMeRequestReview.tsx
Request review and approval interface.

**Features:**
- Review decision interface
- Item modification system
- URL editing with validation
- Comment system
- Rejection reason handling
- Item removal/modification

**Props:**
- `request`: BuyForMe request object
- `onReview`: Review submission callback
- `onClose`: Close callback function

**State:**
- `reviewStatus`: Review decision
- `comment`: Review comment
- `rejectionReason`: Rejection reason
- `isInternal`: Internal comment flag
- `modifiedItems`: Modified items array
- `isEditingItems`: Item editing mode
- `editingItem`: Currently editing item
- `urlValidation`: URL validation state

## Workflow Process

### 1. Request Submission
1. Customer submits BuyForMe request
2. Request status: `pending`
3. Admin receives notification

### 2. Admin Review
1. Admin reviews request details
2. Admin can modify items, URLs, prices
3. Admin makes decision:
   - **Approve**: Status → `approved`
   - **Reject**: Status → `rejected`
   - **Needs Modification**: Status → `under_review`

### 3. Payment Processing
1. Customer receives approval notification
2. Customer makes payment
3. Admin processes payment: Status → `payment_completed`

### 4. Order Management
1. Admin purchases items from suppliers
2. Admin records purchase details: Status → `purchased`
3. Items shipped to company box address

### 5. Shipping Tracking
1. Items shipped: Status → `to_be_shipped_to_box`
2. Items arrive at box: Status → `arrived_to_box`
3. Admin receives arrival notification

### 6. Quality Control
1. Admin inspects items
2. Admin photographs items
3. Admin records item conditions
4. Admin completes control: Status → `customer_review`

### 7. Customer Review
1. Customer reviews items and photos
2. Customer makes decision:
   - **Approve**: Status → `customer_approved`
   - **Reject**: Status → `customer_rejected`
   - **Needs Replacement**: Status → `replacement_requested`

### 8. Packing Choice
1. Customer chooses packing option:
   - **Pack Now**: Status → `packed`
   - **Wait in Box**: Status → `packing_choice`

### 9. Final Shipping
1. Items packed and shipped: Status → `shipped`
2. Items delivered: Status → `delivered`

### 10. Return/Replacement
1. For rejected items:
   - **Return**: Status → `return_requested`
   - **Replace**: Status → `replacement_requested`
2. Admin processes return/replacement

## Status Management

### Status Flow Diagram
```
pending → under_review → approved → payment_completed → purchased
                                                           ↓
delivered ← shipped ← packed ← customer_approved ← customer_review
    ↑                                                    ↓
cancelled ← return_requested ← customer_rejected ← admin_control
    ↑                                                    ↓
replacement_requested ← arrived_to_box ← to_be_shipped_to_box
```

### Status Descriptions

#### Initial States
- **pending**: Request submitted, awaiting admin review
- **under_review**: Request under admin review
- **approved**: Request approved by admin
- **rejected**: Request rejected by admin

#### Payment States
- **payment_pending**: Waiting for customer payment
- **payment_completed**: Payment received and processed

#### Order States
- **purchased**: Items purchased by admin
- **to_be_shipped_to_box**: Items shipped to company box
- **arrived_to_box**: Items arrived at company box

#### Control States
- **admin_control**: Admin inspecting and photographing items
- **customer_review**: Customer reviewing items and photos

#### Customer Decision States
- **customer_approved**: Customer approved all items
- **customer_rejected**: Customer rejected some/all items
- **replacement_requested**: Customer requested replacements

#### Packing States
- **packing_choice**: Customer choosing packing option
- **packed**: Items packed and ready for shipping

#### Final States
- **shipped**: Items shipped to customer
- **delivered**: Items delivered to customer
- **return_requested**: Return process initiated
- **replacement_requested**: Replacement process initiated
- **cancelled**: Request cancelled

## User Roles & Permissions

### Admin Roles
- **Super Admin**: Full system access
- **Manager**: Request management and approval
- **Operator**: Order processing and shipping
- **Support**: Customer communication and returns

### Permissions
- **userManagement**: Manage user accounts
- **productManagement**: Manage products
- **orderManagement**: Manage orders
- **financialAccess**: Access financial data
- **systemSettings**: Modify system settings
- **analyticsAccess**: View analytics
- **canGrantPermissions**: Grant permissions to others
- **canCreateAdmins**: Create admin accounts

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Configure .env file
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Configure .env.local file
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hathak-platform
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Configuration

### Database Configuration
```javascript
// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

### CORS Configuration
```javascript
// backend/App.js
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
```

### Authentication Middleware
```javascript
// middleware/adminAuthMiddleware.js
export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the provided REST files in `backend/Tests/`:
- `buyme.rest` - BuyForMe API tests
- `users.rest` - User management tests

## Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb://production-db:27017/hathak-platform
JWT_SECRET=production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running and connection string is correct.

#### 2. JWT Token Error
```
Error: jwt malformed
```
**Solution**: Check JWT secret configuration and token format.

#### 3. CORS Error
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Verify CORS configuration in backend.

#### 4. File Upload Error
```
Error: File too large
```
**Solution**: Configure file size limits in multer middleware.

### Debug Mode
Enable debug logging:
```env
DEBUG=app:*
NODE_ENV=development
```

### Log Files
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Access logs: `logs/access.log`

## API Reference

### Error Responses
All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Success Responses
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Rate Limiting
API endpoints are rate-limited:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

### Pagination
List endpoints support pagination:
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)
- `total`: Total number of items
- `pages`: Total number of pages

### Filtering
List endpoints support filtering:
- `status`: Filter by status
- `priority`: Filter by priority
- `search`: Text search
- `sortBy`: Sort field
- `sortOrder`: Sort direction

### Validation
All input is validated using express-validator:
- Required fields are enforced
- Data types are validated
- Format validation (email, URL, etc.)
- Custom validation rules

---

## Support

For technical support or questions about the BuyForMe Management System:

1. Check this documentation first
2. Review the troubleshooting section
3. Check the GitHub issues
4. Contact the development team

## Version History

- **v1.0.0** - Initial release with basic request management
- **v1.1.0** - Added review and approval system
- **v1.2.0** - Added payment processing
- **v1.3.0** - Added shipping and tracking
- **v1.4.0** - Added quality control and photography
- **v1.5.0** - Added customer review system
- **v1.6.0** - Added return/replacement workflow
- **v2.0.0** - Complete workflow system with all features

---

*This documentation is maintained by the development team and updated with each release.*
