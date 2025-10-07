# BuyForMe API Reference

## Base URL
```
http://localhost:5000/api/admin/buyme
```

## Authentication
All endpoints require admin authentication via JWT token:
```
Authorization: Bearer <admin_jwt_token>
```

## Endpoints

### 1. Request Management

#### GET /requests
Get all BuyForMe requests with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page (max 100) |
| status | string | No | - | Filter by status |
| priority | string | No | - | Filter by priority (low/medium/high) |
| search | string | No | - | Search term |
| sortBy | string | No | createdAt | Sort field |
| sortOrder | string | No | desc | Sort order (asc/desc) |

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "customerId": "64f1a2b3c4d5e6f7g8h9i0j2",
        "customerName": "John Smith",
        "customerEmail": "john@example.com",
        "items": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
            "name": "iPhone 15 Pro",
            "url": "https://apple.com/iphone-15-pro",
            "quantity": 1,
            "price": 999,
            "description": "Latest iPhone model"
          }
        ],
        "totalAmount": 999,
        "status": "pending",
        "priority": "high",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T14:20:00Z"
      }
    ],
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

#### GET /requests/:id
Get a single BuyForMe request by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "customerId": "64f1a2b3c4d5e6f7g8h9i0j2",
    "customerName": "John Smith",
    "customerEmail": "john@example.com",
    "items": [...],
    "totalAmount": 999,
    "status": "pending",
    "priority": "high",
    "shippingAddress": {
      "name": "John Smith",
      "address": "123 Main St",
      "city": "New York",
      "country": "USA",
      "postalCode": "10001"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:20:00Z"
  }
}
```

#### DELETE /requests/:id
Delete a BuyForMe request.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Response:**
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

### 2. Review System

#### GET /requests/pending-review
Get requests pending review.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page |
| priority | string | No | - | Filter by priority |
| sortBy | string | No | createdAt | Sort field |
| sortOrder | string | No | desc | Sort order |

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [...],
    "pagination": {
      "current": 1,
      "pages": 3,
      "total": 25,
      "limit": 10
    }
  }
}
```

#### POST /requests/:id/review
Review and approve/reject a BuyForMe request.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "reviewStatus": "approved",
  "comment": "Request looks good, approved for processing",
  "rejectionReason": "",
  "isInternal": false,
  "modifiedItems": [
    {
      "itemId": "64f1a2b3c4d5e6f7g8h9i0j3",
      "action": "modify",
      "updates": {
        "name": "iPhone 15 Pro Max",
        "url": "https://apple.com/iphone-15-pro-max",
        "price": 1099,
        "quantity": 1
      }
    }
  ]
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| reviewStatus | string | Yes | approved/rejected/needs_modification |
| comment | string | No | Review comment |
| rejectionReason | string | No | Reason for rejection |
| isInternal | boolean | No | Internal comment flag |
| modifiedItems | array | No | Array of item modifications |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "approved",
    "reviewStatus": "approved",
    "reviewedAt": "2024-01-15T15:30:00Z",
    "reviewedBy": "64f1a2b3c4d5e6f7g8h9i0j4",
    "reviewComments": [
      {
        "comment": "Request looks good, approved for processing",
        "adminId": "64f1a2b3c4d5e6f7g8h9i0j4",
        "adminName": "Admin User",
        "createdAt": "2024-01-15T15:30:00Z",
        "isInternal": false
      }
    ],
    "updatedAt": "2024-01-15T15:30:00Z"
  },
  "message": "Request approved successfully"
}
```

#### POST /requests/:id/comments
Add a comment to a request.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "comment": "Additional notes about this request",
  "isInternal": true
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| comment | string | Yes | Comment text |
| isInternal | boolean | No | Internal comment flag |

**Response:**
```json
{
  "success": true,
  "data": {
    "reviewComments": [
      {
        "comment": "Additional notes about this request",
        "adminId": "64f1a2b3c4d5e6f7g8h9i0j4",
        "adminName": "Admin User",
        "createdAt": "2024-01-15T16:00:00Z",
        "isInternal": true
      }
    ]
  },
  "message": "Comment added successfully"
}
```

### 3. Payment Processing

#### POST /requests/:id/process-payment
Process payment completion for an approved request.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "paymentMethod": "credit_card",
  "transactionId": "TXN123456789",
  "amount": 1099.00
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| paymentMethod | string | Yes | credit_card/paypal/bank_transfer/cash |
| transactionId | string | Yes | Payment transaction ID |
| amount | number | No | Payment amount (defaults to request total) |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "payment_completed",
    "paymentDetails": {
      "paymentMethod": "credit_card",
      "transactionId": "TXN123456789",
      "amount": 1099.00,
      "paymentDate": "2024-01-15T16:30:00Z",
      "currency": "USD"
    },
    "updatedAt": "2024-01-15T16:30:00Z"
  },
  "message": "Payment processed successfully"
}
```

### 4. Order Management

#### POST /requests/:id/purchase
Mark items as purchased after payment completion.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "supplier": "Apple Store",
  "purchaseOrderNumber": "PO-2024-001",
  "estimatedDelivery": "2024-01-20T00:00:00Z"
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| supplier | string | Yes | Supplier name |
| purchaseOrderNumber | string | Yes | Purchase order number |
| estimatedDelivery | string | Yes | Estimated delivery date (ISO 8601) |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "purchased",
    "purchaseDetails": {
      "purchaseDate": "2024-01-15T17:00:00Z",
      "purchasedBy": "64f1a2b3c4d5e6f7g8h9i0j4",
      "supplier": "Apple Store",
      "purchaseOrderNumber": "PO-2024-001",
      "estimatedDelivery": "2024-01-20T00:00:00Z"
    },
    "updatedAt": "2024-01-15T17:00:00Z"
  },
  "message": "Items marked as purchased successfully"
}
```

### 5. Shipping Management

#### PATCH /requests/:id/shipping
Update shipping status and tracking information.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "UPS",
  "estimatedArrival": "2024-01-22T00:00:00Z"
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | Yes | shipped/arrived |
| trackingNumber | string | No | Tracking number |
| carrier | string | No | Shipping carrier |
| estimatedArrival | string | No | Estimated arrival date (ISO 8601) |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "to_be_shipped_to_box",
    "shippingDetails": {
      "trackingNumber": "1Z999AA1234567890",
      "carrier": "UPS",
      "shippedDate": "2024-01-15T18:00:00Z",
      "estimatedArrival": "2024-01-22T00:00:00Z"
    },
    "updatedAt": "2024-01-15T18:00:00Z"
  },
  "message": "Shipping status updated successfully"
}
```

### 6. Quality Control

#### POST /requests/:id/admin-control
Complete admin control and photography of arrived items.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "controlNotes": "All items received in excellent condition",
  "photos": ["control_photo1.jpg", "control_photo2.jpg"],
  "itemConditions": [
    {
      "itemId": "64f1a2b3c4d5e6f7g8h9i0j3",
      "condition": "excellent",
      "notes": "Item in perfect condition, original packaging intact",
      "photos": ["item_photo1.jpg", "item_photo2.jpg"]
    }
  ]
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| controlNotes | string | No | Control notes |
| photos | array | No | Array of photo URLs |
| itemConditions | array | No | Array of item conditions |

**Item Condition Object:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| itemId | string | Yes | Item ID |
| condition | string | Yes | excellent/good/fair/damaged/defective |
| notes | string | No | Condition notes |
| photos | array | No | Array of item photos |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "customer_review",
    "controlDetails": {
      "controlledBy": "64f1a2b3c4d5e6f7g8h9i0j4",
      "controlDate": "2024-01-22T10:00:00Z",
      "controlNotes": "All items received in excellent condition",
      "photos": ["control_photo1.jpg", "control_photo2.jpg"],
      "itemConditions": [
        {
          "itemId": "64f1a2b3c4d5e6f7g8h9i0j3",
          "condition": "excellent",
          "notes": "Item in perfect condition, original packaging intact",
          "photos": ["item_photo1.jpg", "item_photo2.jpg"]
        }
      ]
    },
    "updatedAt": "2024-01-22T10:00:00Z"
  },
  "message": "Admin control completed successfully"
}
```

### 7. Customer Review

#### POST /requests/:id/customer-review
Record customer review and approval/rejection.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "customerDecision": "approved",
  "customerNotes": "Items look great, ready for packing",
  "rejectedItems": []
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| customerDecision | string | Yes | approved/rejected/needs_replacement |
| customerNotes | string | No | Customer notes |
| rejectedItems | array | No | Array of rejected items |

**Rejected Item Object:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| itemId | string | Yes | Item ID |
| reason | string | Yes | Rejection reason |
| action | string | Yes | return/replace/refund |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "customer_approved",
    "customerReview": {
      "reviewedAt": "2024-01-22T14:00:00Z",
      "customerDecision": "approved",
      "customerNotes": "Items look great, ready for packing",
      "rejectedItems": []
    },
    "updatedAt": "2024-01-22T14:00:00Z"
  },
  "message": "Customer review completed successfully"
}
```

### 8. Packing Management

#### POST /requests/:id/packing-choice
Record customer packing choice.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "choice": "pack_now",
  "customerNotes": "Please pack carefully with bubble wrap"
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| choice | string | Yes | pack_now/wait_in_box |
| customerNotes | string | No | Customer packing notes |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "packed",
    "packingChoice": {
      "choice": "pack_now",
      "chosenAt": "2024-01-22T15:00:00Z",
      "customerNotes": "Please pack carefully with bubble wrap"
    },
    "updatedAt": "2024-01-22T15:00:00Z"
  },
  "message": "Packing choice recorded successfully"
}
```

### 9. Return/Replacement

#### POST /requests/:id/return-replacement
Handle return or replacement requests.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "action": "return",
  "items": ["64f1a2b3c4d5e6f7g8h9i0j3"],
  "reason": "Item damaged during shipping",
  "replacementDetails": {
    "newItems": [
      {
        "name": "iPhone 15 Pro Max",
        "url": "https://apple.com/iphone-15-pro-max",
        "quantity": 1,
        "price": 1099
      }
    ],
    "estimatedDelivery": "2024-01-25T00:00:00Z"
  }
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| action | string | Yes | return/replace |
| items | array | Yes | Array of item IDs |
| reason | string | Yes | Reason for return/replacement |
| replacementDetails | object | No | Replacement details (for replace action) |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "return_requested",
    "returnReplacementNotes": [
      {
        "action": "return",
        "items": ["64f1a2b3c4d5e6f7g8h9i0j3"],
        "reason": "Item damaged during shipping",
        "processedBy": "64f1a2b3c4d5e6f7g8h9i0j4",
        "processedAt": "2024-01-22T16:00:00Z"
      }
    ],
    "updatedAt": "2024-01-22T16:00:00Z"
  },
  "message": "return processed successfully"
}
```

### 10. Notifications

#### POST /requests/:id/notify
Notify customer about request status.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Request ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "notificationType": "status_update",
  "customMessage": "Your request has been approved and is ready for payment"
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| notificationType | string | Yes | Type of notification |
| customMessage | string | No | Custom message |

**Response:**
```json
{
  "success": true,
  "message": "Customer notification sent successfully"
}
```

### 11. Statistics

#### GET /statistics
Get system statistics.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| period | integer | No | 30 | Period in days |

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRequests": 150,
    "totalValue": 45000.00,
    "averageValue": 300.00,
    "statusCounts": {
      "pending": 5,
      "approved": 10,
      "purchased": 8,
      "delivered": 120
    }
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common Error Codes

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "field": "status",
    "message": "Invalid status value"
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Request not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **User Limit**: 1000 requests per hour per authenticated user
- **Headers**: Rate limit information is included in response headers:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1640995200
  ```

## Pagination

List endpoints support pagination with the following parameters:

- **page**: Page number (1-based)
- **limit**: Items per page (max 100)
- **total**: Total number of items
- **pages**: Total number of pages

Example pagination response:
```json
{
  "pagination": {
    "current": 2,
    "pages": 10,
    "total": 95,
    "limit": 10
  }
}
```

## Filtering and Sorting

### Available Filters
- **status**: Filter by request status
- **priority**: Filter by priority (low/medium/high)
- **search**: Text search across customer name, email, and item names
- **dateRange**: Filter by date range (planned feature)

### Available Sort Fields
- **createdAt**: Creation date
- **updatedAt**: Last update date
- **totalAmount**: Total amount
- **status**: Status
- **priority**: Priority

### Sort Orders
- **asc**: Ascending order
- **desc**: Descending order (default)

## Data Validation

All input data is validated using express-validator with the following rules:

### Required Fields
- All required fields are enforced
- Missing required fields return 400 Bad Request

### Data Types
- **String**: Text fields
- **Number**: Numeric fields
- **Boolean**: True/false fields
- **Date**: ISO 8601 date format
- **ObjectId**: MongoDB ObjectId format

### Format Validation
- **Email**: Valid email format
- **URL**: Valid URL format
- **Date**: ISO 8601 format
- **ObjectId**: Valid MongoDB ObjectId

### Custom Validation
- **Status**: Must be one of the defined status values
- **Priority**: Must be low/medium/high
- **Payment Method**: Must be one of the supported methods
- **Condition**: Must be one of the defined condition values

## Webhooks (Planned)

Future versions will include webhook support for:
- Status changes
- Payment completion
- Shipping updates
- Customer reviews

## SDKs and Libraries

### JavaScript/Node.js
```javascript
const BuyForMeAPI = require('@hathak/buyme-api');

const client = new BuyForMeAPI({
  baseURL: 'http://localhost:5000/api/admin/buyme',
  token: 'your-jwt-token'
});

// Get all requests
const requests = await client.requests.getAll({
  page: 1,
  limit: 10,
  status: 'pending'
});

// Review a request
await client.requests.review('request-id', {
  reviewStatus: 'approved',
  comment: 'Request approved'
});
```

### Python
```python
from hathak_buyme import BuyForMeClient

client = BuyForMeClient(
    base_url='http://localhost:5000/api/admin/buyme',
    token='your-jwt-token'
)

# Get all requests
requests = client.requests.get_all(
    page=1,
    limit=10,
    status='pending'
)

# Review a request
client.requests.review('request-id', {
    'reviewStatus': 'approved',
    'comment': 'Request approved'
})
```

## Testing

### Test Environment
- **Base URL**: `http://localhost:5000/api/admin/buyme`
- **Test Token**: Use the test admin token from your development environment

### Postman Collection
Import the provided Postman collection for easy API testing:
- `BuyForMe-API.postman_collection.json`

### cURL Examples

#### Get all requests
```bash
curl -X GET "http://localhost:5000/api/admin/buyme/requests" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

#### Review a request
```bash
curl -X POST "http://localhost:5000/api/admin/buyme/requests/64f1a2b3c4d5e6f7g8h9i0j1/review" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewStatus": "approved",
    "comment": "Request approved for processing"
  }'
```

#### Process payment
```bash
curl -X POST "http://localhost:5000/api/admin/buyme/requests/64f1a2b3c4d5e6f7g8h9i0j1/process-payment" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "credit_card",
    "transactionId": "TXN123456789",
    "amount": 999.00
  }'
```

## Support

For API support:
1. Check this documentation
2. Review error messages and status codes
3. Test with the provided Postman collection
4. Contact the development team

---

*This API reference is maintained by the development team and updated with each release.*
