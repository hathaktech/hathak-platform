// tests/buyForMeRequest.test.js - Comprehensive Test Suite for BuyForMe Requests
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../App.js';
import BuyForMeRequest from '../models/BuyForMeRequest.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { generateSecureToken } from '../middleware/security.js';

// Test data
const testUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Customer',
  email: 'test@example.com',
  password: 'hashedpassword',
  isActive: true
};

const testAdmin = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'hashedpassword',
  role: 'admin',
  permissions: {
    orderManagement: true,
    financialAccess: true,
    userManagement: true
  },
  isActive: true
};

const testRequest = {
  customerId: testUser._id,
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  items: [{
    name: 'Test Product',
    url: 'https://example.com/product',
    quantity: 1,
    price: 100,
    currency: 'USD'
  }],
  totalAmount: 100,
  currency: 'USD',
  status: 'pending',
  priority: 'medium',
  shippingAddress: {
    name: 'Test Customer',
    street: '123 Test Street',
    city: 'Test City',
    country: 'US',
    postalCode: '12345'
  }
};

let adminToken;
let userToken;

describe('BuyForMe Request API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/hathak-test');
    
    // Create test user and admin
    await User.create(testUser);
    await Admin.create(testAdmin);
    
    // Generate tokens
    adminToken = generateSecureToken(
      { id: testAdmin._id, type: 'admin' },
      process.env.JWT_SECRET,
      '1h'
    );
    
    userToken = generateSecureToken(
      { id: testUser._id, type: 'user' },
      process.env.JWT_SECRET,
      '1h'
    );
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Admin.deleteMany({});
    await BuyForMeRequest.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up requests before each test
    await BuyForMeRequest.deleteMany({});
  });

  describe('GET /api/admin/buyforme-requests', () => {
    it('should get all requests with admin authentication', async () => {
      // Create test request
      await BuyForMeRequest.create(testRequest);
      
      const response = await request(app)
        .get('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requests).toHaveLength(1);
      expect(response.body.data.requests[0].customerName).toBe('Test Customer');
    });

    it('should filter requests by status', async () => {
      // Create requests with different statuses
      await BuyForMeRequest.create({ ...testRequest, status: 'pending' });
      await BuyForMeRequest.create({ ...testRequest, status: 'approved' });
      
      const response = await request(app)
        .get('/api/admin/buyforme-requests?status=pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requests).toHaveLength(1);
      expect(response.body.data.requests[0].status).toBe('pending');
    });

    it('should search requests by customer name', async () => {
      await BuyForMeRequest.create(testRequest);
      
      const response = await request(app)
        .get('/api/admin/buyforme-requests?search=Test')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requests).toHaveLength(1);
    });

    it('should paginate results', async () => {
      // Create multiple requests
      for (let i = 0; i < 15; i++) {
        await BuyForMeRequest.create({
          ...testRequest,
          requestNumber: `BFM${String(i + 1).padStart(8, '0')}`
        });
      }
      
      const response = await request(app)
        .get('/api/admin/buyforme-requests?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requests).toHaveLength(10);
      expect(response.body.data.pagination.total).toBe(15);
      expect(response.body.data.pagination.pages).toBe(2);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/admin/buyforme-requests')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('authentication');
    });

    it('should reject user tokens', async () => {
      const response = await request(app)
        .get('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('authorization');
    });
  });

  describe('POST /api/admin/buyforme-requests', () => {
    it('should create a new request with valid data', async () => {
      const requestData = {
        customerId: testUser._id.toString(),
        items: [{
          name: 'New Product',
          url: 'https://example.com/new-product',
          quantity: 2,
          price: 50,
          currency: 'USD'
        }],
        shippingAddress: {
          name: 'Test Customer',
          street: '123 Test Street',
          city: 'Test City',
          country: 'US',
          postalCode: '12345'
        },
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(requestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.customerName).toBe('Test Customer');
      expect(response.body.data.totalAmount).toBe(100);
      expect(response.body.data.priority).toBe('high');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });

    it('should validate URL format', async () => {
      const requestData = {
        customerId: testUser._id.toString(),
        items: [{
          name: 'Test Product',
          url: 'invalid-url',
          quantity: 1,
          price: 100,
          currency: 'USD'
        }],
        shippingAddress: {
          name: 'Test Customer',
          street: '123 Test Street',
          city: 'Test City',
          country: 'US',
          postalCode: '12345'
        }
      };

      const response = await request(app)
        .post('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(requestData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });

    it('should validate customer exists', async () => {
      const requestData = {
        customerId: new mongoose.Types.ObjectId().toString(),
        items: [{
          name: 'Test Product',
          url: 'https://example.com/product',
          quantity: 1,
          price: 100,
          currency: 'USD'
        }],
        shippingAddress: {
          name: 'Test Customer',
          street: '123 Test Street',
          city: 'Test City',
          country: 'US',
          postalCode: '12345'
        }
      };

      const response = await request(app)
        .post('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(requestData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('not_found');
    });
  });

  describe('PATCH /api/admin/buyforme-requests/:id/status', () => {
    let requestId;

    beforeEach(async () => {
      const request = await BuyForMeRequest.create(testRequest);
      requestId = request._id.toString();
    });

    it('should update request status', async () => {
      const response = await request(app)
        .patch(`/api/admin/buyforme-requests/${requestId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'approved',
          adminNotes: 'Approved by admin'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('approved');
      expect(response.body.data.adminNotes).toBe('Approved by admin');
    });

    it('should validate status transitions', async () => {
      // First approve the request
      await BuyForMeRequest.findByIdAndUpdate(requestId, { status: 'approved' });

      // Try invalid transition
      const response = await request(app)
        .patch(`/api/admin/buyforme-requests/${requestId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'pending'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });

    it('should require valid request ID', async () => {
      const response = await request(app)
        .patch('/api/admin/buyforme-requests/invalid-id/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'approved'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });
  });

  describe('POST /api/admin/buyforme-requests/:id/review', () => {
    let requestId;

    beforeEach(async () => {
      const request = await BuyForMeRequest.create(testRequest);
      requestId = request._id.toString();
    });

    it('should approve request with comment', async () => {
      const response = await request(app)
        .post(`/api/admin/buyforme-requests/${requestId}/review`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reviewStatus: 'approved',
          comment: 'Request looks good',
          isInternal: false
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewStatus).toBe('approved');
      expect(response.body.data.status).toBe('approved');
      expect(response.body.data.reviewComments).toHaveLength(1);
    });

    it('should reject request with reason', async () => {
      const response = await request(app)
        .post(`/api/admin/buyforme-requests/${requestId}/review`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reviewStatus: 'rejected',
          comment: 'Request rejected',
          rejectionReason: 'Invalid product URL',
          isInternal: false
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewStatus).toBe('rejected');
      expect(response.body.data.status).toBe('cancelled');
      expect(response.body.data.rejectionReason).toBe('Invalid product URL');
    });

    it('should request modification', async () => {
      const response = await request(app)
        .post(`/api/admin/buyforme-requests/${requestId}/review`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reviewStatus: 'needs_modification',
          comment: 'Please provide more details',
          isInternal: false
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewStatus).toBe('needs_modification');
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('POST /api/admin/buyforme-requests/:id/payment', () => {
    let requestId;

    beforeEach(async () => {
      const request = await BuyForMeRequest.create({
        ...testRequest,
        status: 'approved'
      });
      requestId = request._id.toString();
    });

    it('should process payment', async () => {
      const response = await request(app)
        .post(`/api/admin/buyforme-requests/${requestId}/payment`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentMethod: 'credit_card',
          transactionId: 'TXN123456789',
          amount: 100
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentStatus).toBe('paid');
      expect(response.body.data.status).toBe('in_progress');
      expect(response.body.data.subStatus).toBe('payment_completed');
    });

    it('should validate payment amount', async () => {
      const response = await request(app)
        .post(`/api/admin/buyforme-requests/${requestId}/payment`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentMethod: 'credit_card',
          transactionId: 'TXN123456789',
          amount: 50 // Wrong amount
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });

    it('should require approved status', async () => {
      // Create pending request
      const pendingRequest = await BuyForMeRequest.create(testRequest);
      
      const response = await request(app)
        .post(`/api/admin/buyforme-requests/${pendingRequest._id}/payment`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentMethod: 'credit_card',
          transactionId: 'TXN123456789',
          amount: 100
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });
  });

  describe('DELETE /api/admin/buyforme-requests/:id', () => {
    let requestId;

    beforeEach(async () => {
      const request = await BuyForMeRequest.create(testRequest);
      requestId = request._id.toString();
    });

    it('should delete pending request', async () => {
      const response = await request(app)
        .delete(`/api/admin/buyforme-requests/${requestId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // Verify request is deleted
      const deletedRequest = await BuyForMeRequest.findById(requestId);
      expect(deletedRequest).toBeNull();
    });

    it('should not delete non-pending request', async () => {
      // Update request to approved status
      await BuyForMeRequest.findByIdAndUpdate(requestId, { status: 'approved' });

      const response = await request(app)
        .delete(`/api/admin/buyforme-requests/${requestId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });
  });

  describe('GET /api/admin/buyforme-requests/stats', () => {
    beforeEach(async () => {
      // Create test requests with different statuses
      await BuyForMeRequest.create({ ...testRequest, status: 'pending', totalAmount: 100 });
      await BuyForMeRequest.create({ ...testRequest, status: 'approved', totalAmount: 200 });
      await BuyForMeRequest.create({ ...testRequest, status: 'delivered', totalAmount: 150 });
    });

    it('should get statistics', async () => {
      const response = await request(app)
        .get('/api/admin/buyforme-requests/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalRequests).toBe(3);
      expect(response.body.data.totalValue).toBe(450);
      expect(response.body.data.averageValue).toBe(150);
      expect(response.body.data.statusCounts.pending).toBe(1);
      expect(response.body.data.statusCounts.approved).toBe(1);
      expect(response.body.data.statusCounts.delivered).toBe(1);
    });

    it('should filter statistics by date range', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);

      const response = await request(app)
        .get(`/api/admin/buyforme-requests/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalRequests).toBe(3);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to admin routes', async () => {
      // Make multiple requests quickly
      const promises = Array(10).fill().map(() =>
        request(app)
          .get('/api/admin/buyforme-requests')
          .set('Authorization', `Bearer ${adminToken}`)
      );

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Security', () => {
    it('should sanitize input data', async () => {
      const maliciousData = {
        customerId: testUser._id.toString(),
        items: [{
          name: '<script>alert("xss")</script>',
          url: 'https://example.com/product',
          quantity: 1,
          price: 100,
          currency: 'USD'
        }],
        shippingAddress: {
          name: 'Test Customer',
          street: '123 Test Street',
          city: 'Test City',
          country: 'US',
          postalCode: '12345'
        }
      };

      const response = await request(app)
        .post('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(maliciousData)
        .expect(201);

      // Check that script tags are removed
      expect(response.body.data.items[0].name).not.toContain('<script>');
    });

    it('should validate admin permissions', async () => {
      // Create admin without order management permission
      const limitedAdmin = await Admin.create({
        ...testAdmin,
        _id: new mongoose.Types.ObjectId(),
        email: 'limited@example.com',
        permissions: {
          orderManagement: false,
          financialAccess: false
        }
      });

      const limitedToken = generateSecureToken(
        { id: limitedAdmin._id, type: 'admin' },
        process.env.JWT_SECRET,
        '1h'
      );

      const response = await request(app)
        .post('/api/admin/buyforme-requests')
        .set('Authorization', `Bearer ${limitedToken}`)
        .send(testRequest)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('authorization');
    });
  });
});

export default {};
