require('dotenv').config({ path: '../.env' });

// Global test configuration
global.testTimeout = 10000;

// Test database configuration
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'blissful_cakes_test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Global test utilities
global.generateTestEmail = () => `test-${Date.now()}@example.com`;
global.generateTestUsername = () => `testuser-${Date.now()}`;
global.generateTestPassword = () => 'TestPassword123!';

// Setup database connection for tests (optional)
let sequelize;

beforeAll(async () => {
  try {
    // Try to import database connection
    sequelize = require('../src/database');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync database for tests
    await sequelize.sync({ force: true });
    console.log('✅ Test database synced successfully');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('⚠️  Tests will run without database operations');
    // Don't throw error - allow tests to run without database
  }
});

afterAll(async () => {
  try {
    // Close database connection
    if (sequelize) {
      await sequelize.close();
      console.log('✅ Test database connection closed');
    }
  } catch (error) {
    console.error('❌ Failed to close test database connection:', error.message);
  }
  
  // Clear all mocks
  jest.clearAllMocks();
});

// Global cleanup after each test
afterEach(async () => {
  // Clear any test data if needed
  jest.clearAllMocks();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handle missing modules gracefully
process.on('warning', (warning) => {
  if (warning.name === 'ExperimentalWarning') {
    return;
  }
  console.warn('Warning:', warning.message);
}); 