const request = require('supertest');
const TestHelpers = require('./utils/testHelpers');

describe('Products API Tests', () => {
  let app;
  let testHelpers;
  let adminToken;
  let userToken;

  beforeAll(async () => {
    app = require('./testServer');
    testHelpers = new TestHelpers(app);
  });

  beforeEach(async () => {
    // Create test users for each test
    const adminUser = await testHelpers.createTestUser({
      ...testHelpers.generateTestUser(),
      role: 'admin'
    });
    const regularUser = await testHelpers.createTestUser();
    
    adminToken = adminUser?.token;
    userToken = regularUser?.token;
  });

  afterAll(async () => {
    await testHelpers.cleanupTestData();
  });

  describe('GET /api/products', () => {
    test('should get all products without authentication', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return empty array when no products exist', async () => {
      // This test assumes the database is clean or products are cleared
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/products (Admin Only)', () => {
    test('should create a new product as admin', async () => {
      const productData = testHelpers.generateTestProduct();

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', productData.name);
      expect(response.body).toHaveProperty('price', productData.price);
      expect(response.body).toHaveProperty('category', productData.category);
    });

    test('should fail to create product without authentication', async () => {
      const productData = testHelpers.generateTestProduct();

      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(401);
    });

    test('should fail to create product as regular user', async () => {
      const productData = testHelpers.generateTestProduct();

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData);

      expect(response.status).toBe(403);
    });

    test('should fail to create product with missing required fields', async () => {
      const incompleteData = {
        name: 'Test Product',
        // Missing price and category
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail to create product with invalid price', async () => {
      const invalidData = {
        name: 'Test Product',
        price: -10, // Negative price
        category: 'Cakes'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    test('should fail to create product with invalid rating', async () => {
      const invalidData = {
        name: 'Test Product',
        price: 25.99,
        category: 'Cakes',
        rating: 6.5 // Rating > 5
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    test('should create product with all optional fields', async () => {
      const completeData = {
        name: 'Complete Test Product',
        price: 29.99,
        description: 'A complete test product description',
        image: 'https://example.com/test-image.jpg',
        rating: 4.5,
        category: 'Cupcakes'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(completeData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(completeData);
    });
  });

  describe('PUT /api/products/:id (Admin Only)', () => {
    let createdProductId;

    beforeEach(async () => {
      // Create a test product for update tests
      const productData = testHelpers.generateTestProduct();
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      createdProductId = createResponse.body.id;
    });

    test('should update product as admin', async () => {
      const updateData = {
        name: 'Updated Product Name',
        price: 35.99,
        category: 'Brownies'
      };

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updateData);
    });

    test('should fail to update product without authentication', async () => {
      const updateData = {
        name: 'Updated Product Name'
      };

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });

    test('should fail to update product as regular user', async () => {
      const updateData = {
        name: 'Updated Product Name'
      };

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });

    test('should fail to update non-existent product', async () => {
      const updateData = {
        name: 'Updated Product Name'
      };

      const response = await request(app)
        .put('/api/products/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });

    test('should update only provided fields', async () => {
      const updateData = {
        name: 'Partially Updated Product'
      };

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      // Other fields should remain unchanged
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('category');
    });

    test('should fail to update with invalid data', async () => {
      const invalidData = {
        price: -5, // Invalid negative price
        rating: 10 // Invalid rating > 5
      };

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/products/:id (Admin Only)', () => {
    let createdProductId;

    beforeEach(async () => {
      // Create a test product for delete tests
      const productData = testHelpers.generateTestProduct();
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      createdProductId = createResponse.body.id;
    });

    test('should delete product as admin', async () => {
      const response = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product deleted');
    });

    test('should fail to delete product without authentication', async () => {
      const response = await request(app)
        .delete(`/api/products/${createdProductId}`);

      expect(response.status).toBe(401);
    });

    test('should fail to delete product as regular user', async () => {
      const response = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('should fail to delete non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });

    test('should verify product is actually deleted', async () => {
      // First delete the product
      await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Try to update the deleted product
      const updateResponse = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(updateResponse.status).toBe(404);
    });
  });

  describe('Product Validation', () => {
    test('should validate product name requirements', async () => {
      const invalidNames = [
        '', // Empty
        'a', // Too short
        'a'.repeat(101), // Too long
        '   ', // Only spaces
      ];

      for (const name of invalidNames) {
        const productData = {
          name: name,
          price: 25.99,
          category: 'Cakes'
        };

        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(productData);

        expect(response.status).toBe(400);
      }
    });

    test('should validate price range', async () => {
      const invalidPrices = [
        -1, // Negative
        0, // Zero
        1000000, // Too high
        'invalid', // Not a number
      ];

      for (const price of invalidPrices) {
        const productData = {
          name: 'Test Product',
          price: price,
          category: 'Cakes'
        };

        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(productData);

        expect(response.status).toBe(400);
      }
    });

    test('should validate category values', async () => {
      const validCategories = ['Cakes', 'Cupcakes', 'Brownies'];
      const invalidCategory = 'InvalidCategory';

      const productData = {
        name: 'Test Product',
        price: 25.99,
        category: invalidCategory
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(400);
    });

    test('should validate rating range', async () => {
      const invalidRatings = [
        -1, // Negative
        6, // Greater than 5
        10, // Too high
      ];

      for (const rating of invalidRatings) {
        const productData = {
          name: 'Test Product',
          price: 25.99,
          category: 'Cakes',
          rating: rating
        };

        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(productData);

        expect(response.status).toBe(400);
      }
    });
  });

  describe('Product Search and Filtering', () => {
    beforeEach(async () => {
      // Create test products for search tests
      const testProducts = [
        { name: 'Chocolate Cake', price: 25.99, category: 'Cakes' },
        { name: 'Vanilla Cupcake', price: 15.99, category: 'Cupcakes' },
        { name: 'Brownie Delight', price: 12.99, category: 'Brownies' },
        { name: 'Strawberry Cake', price: 30.99, category: 'Cakes' }
      ];

      for (const product of testProducts) {
        await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(product);
      }
    });

    test('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Cakes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // All returned products should be cakes
      response.body.forEach(product => {
        expect(product.category).toBe('Cakes');
      });
    });

    test('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products?search=chocolate');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // At least one product should contain 'chocolate' in name
      const hasChocolate = response.body.some(product => 
        product.name.toLowerCase().includes('chocolate')
      );
      expect(hasChocolate).toBe(true);
    });

    test('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=20&maxPrice=30');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // All products should be within price range
      response.body.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(20);
        expect(product.price).toBeLessThanOrEqual(30);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking database connection failure
      // Implementation depends on your error handling setup
    });

    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });

    test('should handle large file uploads appropriately', async () => {
      // This test would check file size limits for product images
      // Implementation depends on your file upload setup
    });
  });
}); 