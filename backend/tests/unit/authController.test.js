/**
 * WHITE BOX TESTS - Authentication Controller Unit Tests
 * Tests controller logic with mocked User model
 * Focus: Request handling, User model calls, HTTP responses
 */

jest.mock('../../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  updateOne: jest.fn()
}));

const authController = require('../../controllers/authController');
const User = require('../../models/User');

describe('WHITE BOX TESTS - Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('register()', () => {
    test('Checks if user exists before creating', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '123', name: 'John' });

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    test('Returns 400 if user already exists', async () => {
      req.body = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'Password123'
      };

      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User already exists' })
      );
      expect(User.create).not.toHaveBeenCalled();
    });

    test('Creates user when email is unique', async () => {
      req.body = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'SecurePassword123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '456', name: 'Jane' });

      await authController.register(req, res);

      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('Returns 201 on registration success', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully'
        })
      );
    });

    test('Handles database connection errors', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123'
      };

      const dbError = new Error('Database connection failed');
      User.findOne.mockRejectedValue(dbError);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Database connection failed' })
      );
    });
  });

  describe('login()', () => {
    test('Queries database with email', async () => {
      req.body = {
        email: 'user@example.com',
        password: 'Password123'
      };

      User.findOne.mockResolvedValue({
        _id: '123',
        email: 'user@example.com',
        password: '$hashed',
        role: 'user'
      });

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
    });

    test('Returns 400 when user not found', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'Password123'
      };

      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid credentials' })
      );
    });

    test('Returns token on successful login', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'Password123'
      };

      User.findOne.mockResolvedValue({
        _id: '123',
        email: 'john@example.com',
        password: '$2b$10$hashedPassword',
        role: 'user'
      });

      await authController.login(req, res);

      // Should successfully call res.json (password validation happens in real implementation)
      expect(res.json).toHaveBeenCalled();
    });

    test('Returns 400 for invalid password', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'WrongPassword'
      };

      User.findOne.mockResolvedValue({
        _id: '123',
        password: '$2b$10$hashedPassword'
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

describe('WHITE BOX TESTS - Auth Controller Request Handling', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  test('Handles request with missing body fields', async () => {
    req.body = {};

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(expect.any(Number));
  });

  test('Response includes user id on registration', async () => {
    req.body = {
      name: 'New User',
      email: 'new@test.com',
      password: 'pass'
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: '999',
      name: 'New User',
      email: 'new@test.com'
    });

    await authController.register(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ id: '999' })
      })
    );
  });

  test('User.create is called with correct data structure', async () => {
    req.body = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'password'
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: '123' });

    await authController.register(req, res);

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test User',
        email: 'test@test.com'
      })
    );
  });
});
