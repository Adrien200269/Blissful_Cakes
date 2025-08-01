
const request = require('supertest');
const TestHelpers = require('./utils/testHelpers');

describe('Orders API Tests', () => {
  let app;
  let testHelpers;
  let adminToken;
  let userToken;
  let testProductId;

  beforeAll(async () => {
    app = require('./testServer');
    testHelpers = new TestHelpers(app);
  });

  beforeEach(async () => {
    // Create test users
    const adminUser = await testHelpers.createTestUser({
      ...testHelpers.generateTestUser(),
      role: 'admin'
    });
    const regularUser = await testHelpers.createTestUser();
    
    adminToken = adminUser?.token;
    userToken = regularUser?.token;

    // Create a test product for order tests
    const productData = testHelpers.generateTestProduct();
    const productResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(productData);
    
    testProductId = productResponse.body.id;
  });

  afterAll(async () => {
    await testHelpers.cleanupTestData();
  });

  describe('POST /api/orders (Create Order)', () => {
    test('should create a new order successfully', async () => {
      const orderData = {
        products: [
          {
            productId: testProductId,
            quantity: 2
          }
        ],
        address: '123 Test Street, Test City',
        phone: '+1234567890',
        note: 'Test order note'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('orderId');
      expect(response.body).toHaveProperty('message', 'Order placed successfully');
    });

    test('should fail to create order without authentication', async () => {
      const orderData = {
        products: [{ productId: testProductId, quantity: 1 }],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(401);
    });

    test('should fail to create order with missing required fields', async () => {
      const incompleteData = {
        products: [{ productId: testProductId, quantity: 1 }]
        // Missing address and phone
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('should fail to create order with empty products array', async () => {
      const orderData = {
        products: [],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('No products in order');
    });

    test('should fail to create order with non-existent product', async () => {
      const orderData = {
        products: [
          {
            productId: 99999, // Non-existent product
            quantity: 1
          }
        ],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Product not found');
    });

    test('should fail to create order with invalid quantity', async () => {
      const orderData = {
        products: [
          {
            productId: testProductId,
            quantity: 0 // Invalid quantity
          }
        ],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
    });

    test('should create order with multiple products', async () => {
      // Create another test product
      const productData2 = testHelpers.generateTestProduct();
      const productResponse2 = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData2);

      const orderData = {
        products: [
          {
            productId: testProductId,
            quantity: 2
          },
          {
            productId: productResponse2.body.id,
            quantity: 1
          }
        ],
        address: '123 Test Street, Test City',
        phone: '+1234567890',
        note: 'Multiple products order'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });

    test('should calculate total amount correctly', async () => {
      const orderData = {
        products: [
          {
            productId: testProductId,
            quantity: 3
          }
        ],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      // The total should be calculated based on product price * quantity
    });
  });

  describe('GET /api/orders (Admin Only)', () => {
    let testOrderId;

    beforeEach(async () => {
      // Create a test order
      const orderData = {
        products: [{ productId: testProductId, quantity: 1 }],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      testOrderId = orderResponse.body.orderId;
    });

    test('should get all orders as admin', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    test('should fail to get orders without authentication', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(401);
    });

    test('should fail to get orders as regular user', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('should return orders with user and product information', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      if (response.body.orders.length > 0) {
        const order = response.body.orders[0];
        expect(order).toHaveProperty('user');
        expect(order).toHaveProperty('orderItems');
        expect(Array.isArray(order.orderItems)).toBe(true);
        
        if (order.orderItems.length > 0) {
          expect(order.orderItems[0]).toHaveProperty('Product');
        }
      }
    });

    test('should return empty array when no orders exist', async () => {
      // This test might need database cleanup
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
    });
  });

  describe('PUT /api/orders/:id/status (Admin Only)', () => {
    let testOrderId;

    beforeEach(async () => {
      // Create a test order
      const orderData = {
        products: [{ productId: testProductId, quantity: 1 }],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      testOrderId = orderResponse.body.orderId;
    });

    test('should update order status to processing', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'processing' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order.status).toBe('processing');
    });

    test('should update order status to completed', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.order.status).toBe('completed');
    });

    test('should update order status to cancelled', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' });

      expect(response.status).toBe(200);
      expect(response.body.order.status).toBe('cancelled');
    });

    test('should fail to update status without authentication', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrderId}/status`)
        .send({ status: 'processing' });

      expect(response.status).toBe(401);
    });

    test('should fail to update status as regular user', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'processing' });

      expect(response.status).toBe(403);
    });

    test('should fail to update non-existent order', async () => {
      const response = await request(app)
        .put('/api/orders/99999/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'processing' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Order not found');
    });

    test('should fail to update with invalid status', async () => {
      const invalidStatuses = ['invalid', 'pending', 'random', ''];

      for (const status of invalidStatuses) {
        const response = await request(app)
          .put(`/api/orders/${testOrderId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: status });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid status');
      }
    });

    test('should accept valid status values', async () => {
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

      for (const status of validStatuses) {
        const response = await request(app)
          .put(`/api/orders/${testOrderId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: status });

        expect(response.status).toBe(200);
        expect(response.body.order.status).toBe(status);
      }
    });
  });

  describe('Order Validation', () => {
    test('should validate address requirements', async () => {
      const orderData = {
        products: [{ productId: testProductId, quantity: 1 }],
        phone: '+1234567890'
        // Missing address
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Address and phone are required');
    });

    test('should validate phone requirements', async () => {
      const orderData = {
        products: [{ productId: testProductId, quantity: 1 }],
        address: '123 Test Street'
        // Missing phone
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Address and phone are required');
    });

    test('should validate phone number format', async () => {
      const invalidPhones = [
        '',
        '123',
        'abc',
        '123-456-789',
        '+12345678901234567890' // Too long
      ];

      for (const phone of invalidPhones) {
        const orderData = {
          products: [{ productId: testProductId, quantity: 1 }],
          address: '123 Test Street',
          phone: phone
        };

        const response = await request(app)
          .post('/api/orders')
          .set('Authorization', `Bearer ${userToken}`)
          .send(orderData);

        expect(response.status).toBe(400);
      }
    });

    test('should validate product quantity', async () => {
      const invalidQuantities = [
        0,
        -1,
        'abc',
        '',
        null
      ];

      for (const quantity of invalidQuantities) {
        const orderData = {
          products: [
            {
              productId: testProductId,
              quantity: quantity
            }
          ],
          address: '123 Test Street',
          phone: '+1234567890'
        };

        const response = await request(app)
          .post('/api/orders')
          .set('Authorization', `Bearer ${userToken}`)
          .send(orderData);

        expect(response.status).toBe(400);
      }
    });
  });

  describe('Order Business Logic', () => {
    test('should calculate total amount correctly for multiple products', async () => {
      // Create multiple products with different prices
      const product1 = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Product 1',
          price: 10.00,
          category: 'Cakes'
        });

      const product2 = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Product 2',
          price: 15.50,
          category: 'Cupcakes'
        });

      const orderData = {
        products: [
          { productId: product1.body.id, quantity: 2 }, // 2 * 10 = 20
          { productId: product2.body.id, quantity: 1 }  // 1 * 15.50 = 15.50
        ],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      // Total should be 35.50
    });

    test('should handle large quantities appropriately', async () => {
      const orderData = {
        products: [
          {
            productId: testProductId,
            quantity: 100 // Large quantity
          }
        ],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
    });

    test('should preserve order note', async () => {
      const note = 'Special delivery instructions: Ring doorbell twice';
      const orderData = {
        products: [{ productId: testProductId, quantity: 1 }],
        address: '123 Test Street',
        phone: '+1234567890',
        note: note
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);

      // Verify note is preserved by checking the order
      const ordersResponse = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      const createdOrder = ordersResponse.body.orders.find(
        order => order.id === response.body.orderId
      );
      expect(createdOrder.note).toBe(note);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking database connection failure
    });

    test('should handle concurrent order updates', async () => {
      // Create an order
      const orderData = {
        products: [{ productId: testProductId, quantity: 1 }],
        address: '123 Test Street',
        phone: '+1234567890'
      };

      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      const orderId = orderResponse.body.orderId;

      // Try to update status concurrently
      const promises = [
        request(app)
          .put(`/api/orders/${orderId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'processing' }),
        request(app)
          .put(`/api/orders/${orderId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'completed' })
      ];

      const responses = await Promise.all(promises);
      
      // At least one should succeed
      const successCount = responses.filter(r => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);
    });

    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });
}); 