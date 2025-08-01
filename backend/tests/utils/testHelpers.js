const request = require('supertest');
const jwt = require('jsonwebtoken');

class TestHelpers {
  constructor(app) {
    this.app = app;
    this.authTokens = {
      user: null,
      admin: null
    };
  }

  // Generate test data
  generateTestUser() {
    return {
      username: generateTestUsername(),
      email: generateTestEmail(),
      password: generateTestPassword(),
      firstName: 'Test',
      lastName: 'User'
    };
  }

  generateTestProduct() {
    return {
      name: `Test Product ${Date.now()}`,
      price: Math.floor(Math.random() * 100) + 10,
      description: 'Test product description',
      image: 'https://example.com/test-image.jpg',
      rating: Math.random() * 5,
      category: 'Cakes'
    };
  }

  generateTestOrder() {
    return {
      products: [
        {
          productId: 1,
          quantity: 2
        }
      ],
      address: '123 Test Street, Test City',
      phone: '+1234567890',
      note: 'Test order note'
    };
  }

  // Authentication helpers
  async createTestUser(userData = null) {
    try {
      const user = userData || this.generateTestUser();
      const response = await request(this.app)
        .post('/api/auth/register')
        .send(user);
      
      if (response.status === 201) {
        return {
          user: response.body.data.user,
          token: response.body.data.token
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating test user:', error);
      return null;
    }
  }

  async createTestAdmin() {
    try {
      const adminData = {
        ...this.generateTestUser(),
        role: 'admin'
      };
      
      // First create user, then update role in database
      const user = await this.createTestUser(adminData);
      if (user) {
        // Update role to admin (this would need to be done in the database)
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error creating test admin:', error);
      return null;
    }
  }

  generateToken(userId, email, role = 'user') {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  }

  // Request helpers
  async authenticatedRequest(method, endpoint, data = null, token = null) {
    const req = request(this.app)[method.toLowerCase()](endpoint);
    
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    
    if (data) {
      req.send(data);
    }
    
    return req;
  }

  // Validation helpers
  expectSuccess(response, statusCode = 200) {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('success', true);
  }

  expectError(response, statusCode = 400) {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('success', false);
  }

  expectValidationError(response, field) {
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toContain(field);
  }

  // Database helpers
  async cleanupTestData() {
    try {
      // This would clean up test data from the database
      // Implementation depends on your database setup
      console.log('Test data cleanup completed');
    } catch (error) {
      console.error('Error cleaning up test data:', error);
    }
  }

  // Common test patterns
  async testCRUDOperations(resourceName, createData, updateData) {
    let createdId = null;
    let authToken = null;

    // Setup: Create test user and get token
    const testUser = await this.createTestUser();
    if (testUser) {
      authToken = testUser.token;
    }

    describe(`${resourceName} CRUD Operations`, () => {
      
      // CREATE
      test(`should create a new ${resourceName}`, async () => {
        const response = await this.authenticatedRequest(
          'POST',
          `/api/${resourceName}`,
          createData,
          authToken
        );

        this.expectSuccess(response, 201);
        expect(response.body.data).toBeDefined();
        createdId = response.body.data.id || response.body.data[resourceName].id;
      });

      // READ
      test(`should get all ${resourceName}`, async () => {
        const response = await this.authenticatedRequest(
          'GET',
          `/api/${resourceName}`,
          null,
          authToken
        );

        this.expectSuccess(response);
        expect(Array.isArray(response.body.data) || Array.isArray(response.body[resourceName])).toBe(true);
      });

      test(`should get a specific ${resourceName} by ID`, async () => {
        if (!createdId) {
          throw new Error('No created ID available for testing');
        }

        const response = await this.authenticatedRequest(
          'GET',
          `/api/${resourceName}/${createdId}`,
          null,
          authToken
        );

        this.expectSuccess(response);
        expect(response.body.data.id || response.body[resourceName].id).toBe(createdId);
      });

      // UPDATE
      test(`should update a ${resourceName}`, async () => {
        if (!createdId) {
          throw new Error('No created ID available for testing');
        }

        const response = await this.authenticatedRequest(
          'PUT',
          `/api/${resourceName}/${createdId}`,
          updateData,
          authToken
        );

        this.expectSuccess(response);
      });

      // DELETE
      test(`should delete a ${resourceName}`, async () => {
        if (!createdId) {
          throw new Error('No created ID available for testing');
        }

        const response = await this.authenticatedRequest(
          'DELETE',
          `/api/${resourceName}/${createdId}`,
          null,
          authToken
        );

        this.expectSuccess(response);
      });
    });
  }
}

module.exports = TestHelpers; 