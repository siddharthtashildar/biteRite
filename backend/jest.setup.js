// jest.setup.js - Global test setup
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biterite-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';

// Suppress console output during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn((...args) => {
    // Only log test framework messages, not application logs
    if (args[0]?.includes?.('●') || args[0]?.includes?.('PASS') || args[0]?.includes?.('FAIL')) {
      originalConsoleLog(...args);
    }
  });
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
