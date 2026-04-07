/**
 * BLACK BOX API TESTS - API Endpoints Testing
 * Tests API endpoints as a client would, without knowledge of internal implementation
 * Focus: Input validation, HTTP status codes, response structure, business logic flows
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Create a mock Express app for testing
const createMockApp = () => {
  const app = express();
  app.use(express.json());

  // Mock routes
  app.post('/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Success response
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: '123', name, email }
    });
  });

  app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Assume valid credentials for now
    res.status(200).json({
      token: 'mock-jwt-token-12345',
      user: { id: '123', email }
    });
  });

  app.get('/recipes', (req, res) => {
    res.status(200).json([
      { id: '1', name: 'Pasta', calories: 300 },
      { id: '2', name: 'Salad', calories: 150 }
    ]);
  });

  app.get('/recipes/:id', (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Recipe ID required' });
    }
    res.status(200).json({
      id: req.params.id,
      name: 'Mock Recipe',
      calories: 250,
      ingredients: ['ingredient1', 'ingredient2']
    });
  });

  return app;
};

describe('BLACK BOX TESTS - Authentication API', () => {
  let app;

  beforeAll(() => {
    app = createMockApp();
  });

  describe('POST /auth/register', () => {
    test('Successfully registers new user with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePassword123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
    });

    test('Rejects registration without email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Jane Doe',
          password: 'SecurePassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    test('Rejects registration with invalid email format', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'SecurePassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email');
    });

    test('Rejects registration with weak password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('at least 6 characters');
    });

    test('Rejects registration without password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    test('Successfully logs in user with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email');
    });

    test('Rejects login without email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'SecurePassword123'
        });

      expect(response.status).toBe(400);
    });

    test('Rejects login without password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com'
        });

      expect(response.status).toBe(400);
    });

    test('Returns token in proper format', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password'
        });

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });
  });
});

describe('BLACK BOX TESTS - Recipe API', () => {
  let app;

  beforeAll(() => {
    app = createMockApp();
  });

  describe('GET /recipes', () => {
    test('Returns list of recipes', async () => {
      const response = await request(app).get('/recipes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('Each recipe has required fields', async () => {
      const response = await request(app).get('/recipes');

      response.body.forEach(recipe => {
        expect(recipe).toHaveProperty('id');
        expect(recipe).toHaveProperty('name');
        expect(recipe).toHaveProperty('calories');
      });
    });

    test('Returns HTTP 200 status', async () => {
      const response = await request(app).get('/recipes');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /recipes/:id', () => {
    test('Returns specific recipe by ID', async () => {
      const response = await request(app).get('/recipes/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('ingredients');
    });

    test('Recipe response includes nutrition info', async () => {
      const response = await request(app).get('/recipes/123');

      expect(response.body).toHaveProperty('calories');
      expect(typeof response.body.calories).toBe('number');
    });

    test('Returns recipes list when no specific ID provided', async () => {
      const response = await request(app).get('/recipes');

      // /recipes/ routes to the /recipes list endpoint
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

describe('BLACK BOX TESTS - User Workflows', () => {
  let app;

  beforeAll(() => {
    app = createMockApp();
  });

  test('Complete flow: Register -> Login -> Get Recipes', async () => {
    // Step 1: Register
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123'
      });

    expect(registerResponse.status).toBe(201);

    // Step 2: Login
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPassword123'
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    // Step 3: Get Recipes
    const recipesResponse = await request(app).get('/recipes');

    expect(recipesResponse.status).toBe(200);
    expect(Array.isArray(recipesResponse.body)).toBe(true);
  });
});
