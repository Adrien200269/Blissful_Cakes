const request = require('supertest');
const TestHelpers = require('./utils/testHelpers');

describe('Users API Tests', () => {
  let app;
  let testHelpers;
  let adminToken;
  let userToken;
  let testUserId;

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
    testUserId = regularUser?.user.id;
  });

  afterAll(async () => {
    await testHelpers.cleanupTestData();
  });

  describe('GET /api/user/profile', () => {
    test('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email');
      expect(response.body.data.user).toHaveProperty('username');
      expect(response.body.data.user).not.toHaveProperty('password'); // Password should be excluded
    });

    test('should fail to get profile without authentication', async () => {
      const response = await request(app)
        .get('/api/user/profile');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access token required');
    });

    test('should fail to get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token');
    });

    test('should fail to get profile with expired token', async () => {
      // This test would require a properly expired token
      // For now, we'll test with an invalid token
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer expired-token');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/user/profile', () => {
    test('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.user).toMatchObject(updateData);
    });

    test('should fail to update profile without authentication', async () => {
      const updateData = {
        firstName: 'Updated'
      };

      const response = await request(app)
        .put('/api/user/profile')
        .send(updateData);

      expect(response.status).toBe(401);
    });

    test('should update only provided fields', async () => {
      const updateData = {
        firstName: 'Partial Update'
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.user.firstName).toBe(updateData.firstName);
      // Other fields should remain unchanged
      expect(response.body.data.user).toHaveProperty('lastName');
      expect(response.body.data.user).toHaveProperty('email');
    });

    test('should fail to update with invalid email format', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
    });

    test('should fail to update with duplicate email', async () => {
      // First, create another user
      const anotherUser = await testHelpers.createTestUser();
      
      const updateData = {
        email: anotherUser.user.email
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    test('should validate email format', async () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test..test@example.com'
      ];

      for (const email of invalidEmails) {
        const updateData = { email };

        const response = await request(app)
          .put('/api/user/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData);

        expect(response.status).toBe(400);
      }
    });
  });

  describe('GET /api/admin/users (Admin Only)', () => {
    test('should get all users as admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    test('should fail to get users without authentication', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
    });

    test('should fail to get users as regular user', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('should return users without passwords', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      if (response.body.users.length > 0) {
        response.body.users.forEach(user => {
          expect(user).not.toHaveProperty('password');
        });
      }
    });

    test('should include user statistics', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('activeUsers');
      expect(response.body).toHaveProperty('newUsersThisMonth');
    });
  });

  describe('DELETE /api/admin/users/:id (Admin Only)', () => {
    test('should delete user as admin', async () => {
      // Create a user to delete
      const userToDelete = await testHelpers.createTestUser();
      
      const response = await request(app)
        .delete(`/api/admin/users/${userToDelete.user.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('User deleted successfully');
    });

    test('should fail to delete user without authentication', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`);

      expect(response.status).toBe(401);
    });

    test('should fail to delete user as regular user', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('should fail to delete non-existent user', async () => {
      const response = await request(app)
        .delete('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    test('should fail to delete admin user', async () => {
      // Try to delete an admin user
      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // This might fail if the user is an admin
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot delete admin user');
    });

    test('should verify user is actually deleted', async () => {
      // Create a user to delete
      const userToDelete = await testHelpers.createTestUser();
      
      // Delete the user
      await request(app)
        .delete(`/api/admin/users/${userToDelete.user.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Try to get the deleted user's profile
      const profileResponse = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userToDelete.token}`);

      expect(profileResponse.status).toBe(401);
    });
  });

  describe('PUT /api/admin/users/:id/ban (Admin Only)', () => {
    test('should ban user as admin', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('User banned successfully');
    });

    test('should fail to ban user without authentication', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`);

      expect(response.status).toBe(401);
    });

    test('should fail to ban user as regular user', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('should fail to ban non-existent user', async () => {
      const response = await request(app)
        .put('/api/admin/users/99999/ban')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    test('should fail to ban admin user', async () => {
      // Try to ban an admin user
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot ban admin user');
    });
  });

  describe('PUT /api/admin/users/:id/unban (Admin Only)', () => {
    test('should unban user as admin', async () => {
      // First ban the user
      await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Then unban the user
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('User unbanned successfully');
    });

    test('should fail to unban user without authentication', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/unban`);

      expect(response.status).toBe(401);
    });

    test('should fail to unban user as regular user', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('should fail to unban non-existent user', async () => {
      const response = await request(app)
        .put('/api/admin/users/99999/unban')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('User Validation', () => {
    test('should validate username requirements', async () => {
      const invalidUsernames = [
        '', // Empty
        'a', // Too short
        'a'.repeat(51), // Too long
        'user name', // Contains space
        'user@name', // Contains special character
        'user-name', // Contains hyphen
        'user_name' // Contains underscore
      ];

      for (const username of invalidUsernames) {
        const userData = {
          username: username,
          email: generateTestEmail(),
          password: generateTestPassword()
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        expect(response.status).toBe(400);
      }
    });

    test('should validate email format', async () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test..test@example.com',
        'test@example..com',
        'test@.com',
        '.test@example.com'
      ];

      for (const email of invalidEmails) {
        const userData = {
          username: generateTestUsername(),
          email: email,
          password: generateTestPassword()
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        expect(response.status).toBe(400);
      }
    });

    test('should validate password strength', async () => {
      const weakPasswords = [
        '123',
        'abc',
        'password',
        '123456',
        '',
        'a'.repeat(51), // Too long
        'onlylowercase',
        'ONLYUPPERCASE',
        '123456789'
      ];

      for (const password of weakPasswords) {
        const userData = {
          username: generateTestUsername(),
          email: generateTestEmail(),
          password: password
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        expect(response.status).toBe(400);
      }
    });

    test('should accept valid user data', async () => {
      const validUserData = {
        username: 'validuser123',
        email: 'valid@example.com',
        password: 'ValidPassword123!',
        firstName: 'Valid',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('User Security', () => {
    test('should not expose password in responses', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    test('should hash passwords in database', async () => {
      const userData = testHelpers.generateTestUser();
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      
      // The password should be hashed, not plain text
      // This would require database access to verify
    });

    test('should prevent SQL injection', async () => {
      const maliciousData = {
        username: "'; DROP TABLE users; --",
        email: "'; DROP TABLE users; --",
        password: "'; DROP TABLE users; --"
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(maliciousData);

      // Should handle gracefully without crashing
      expect(response.status).toBe(400);
    });

    test('should prevent XSS attacks', async () => {
      const xssData = {
        username: '<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(xssData);

      expect(response.status).toBe(400);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking database connection failure
    });

    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });

    test('should handle concurrent profile updates', async () => {
      const updateData = {
        firstName: 'Concurrent',
        lastName: 'Update'
      };

      const promises = [
        request(app)
          .put('/api/user/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData),
        request(app)
          .put('/api/user/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
      ];

      const responses = await Promise.all(promises);
      
      // At least one should succeed
      const successCount = responses.filter(r => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);
    });
  });
}); 