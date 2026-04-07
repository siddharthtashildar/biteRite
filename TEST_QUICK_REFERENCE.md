# Quick Test Reference Guide

## Quick Commands

### Backend
```bash
cd backend
npm test                              # Run all tests
npm test authController.test.js       # Specific test file
npm test -- --watch                   # Watch mode
npm test -- --coverage                # Coverage report
npm test -- --testNamePattern="auth"  # Tests matching pattern
```

### Frontend
```bash
cd frontend
npm test                              # Run all tests
npm test components.test.jsx          # Specific test file
npm run test:watch                    # Watch mode
npm run test:coverage                 # Coverage report
npm run test:ui                       # Visual UI
```

---

## Test Files Overview

### Backend Tests (Node.js)

| File | Type | Purpose | Key Tests |
|------|------|---------|-----------|
| `api.test.js` | Black Box | API endpoints | Register, Login, Get recipes |
| `authController.test.js` | White Box | Auth logic | Password hashing, JWT, Validation |
| `recipeController.test.js` | White Box | Recipe logic | CRUD, Filtering, Saving |
| `geminiService.test.js` | White Box | AI service | Generation, Parsing, Validation |
| `models.test.js` | White Box | Database models | Schema, Relationships |

### Frontend Tests (React)

| File | Type | Purpose | Key Tests |
|------|------|---------|-----------|
| `components.test.jsx` | Unit | Component logic | Navbar, RecipeCard, Forms |
| `pages.test.jsx` | Integration | Page workflows | Home, Generate, Saved, Login |
| `e2e.test.jsx` | E2E | User scenarios | Complete user flows |

---

## Common Test Patterns

### Testing API Endpoints
```javascript
describe('POST /auth/register', () => {
  test('Returns 201 with valid data', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

### Testing Authentication Logic
```javascript
test('Hashes password before saving', async () => {
  User.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('hashed');
  
  await authController.register(req, res);
  
  expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
});
```

### Testing React Components
```javascript
test('Recipe card shows calories', () => {
  render(<RecipeCard recipe={{ nutrition: { calories: 300 } }} />);
  expect(screen.getByText('300 cal')).toBeInTheDocument();
});
```

### Testing User Interactions
```javascript
test('Submit form on button click', async () => {
  const handleSubmit = vi.fn();
  render(<LoginForm onSubmit={handleSubmit} />);
  
  fireEvent.click(screen.getByText('Login'));
  
  expect(handleSubmit).toHaveBeenCalled();
});
```

---

## Test Types Quick Guide

### Black Box (User Perspective)
- ✅ API requests/responses
- ✅ User workflows
- ✅ Business logic results
- ❌ Internal implementation details

### White Box (Developer Perspective)
- ✅ Function behavior
- ✅ Edge cases
- ✅ Error handling
- ✅ Data flow
- ❌ External systems

---

## Debugging Tips

### Backend
```bash
# Run single test with logs
npm test authController.test.js -- --verbose

# Debug mode
node --inspect-brk ./node_modules/.bin/jest

# Print all mock calls
console.log(mockFunction.mock.calls);
```

### Frontend
```bash
# Open test UI for debugging
npm run test:ui

# Run single test
npm test -- -t "should render button"

# Watch specific file
npm test -- --watch components.test.jsx
```

---

## Assert/Expect Cheatsheet

### Common Assertions

```javascript
// Equality
expect(value).toBe(10)
expect(value).toEqual(expectedObject)
expect(value).toStrictEqual(expectedObject)

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThan(5)
expect(value).toBeCloseTo(0.1 + 0.2)

// Strings
expect(message).toMatch(/hello/i)
expect(message).toContain('hello')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(array).toEqual(expect.arrayContaining([2, 3, 1]))

// Objects
expect(obj).toHaveProperty('name')
expect(obj).toHaveProperty('name', 'John')
expect(obj).toEqual(expect.objectContaining({name: 'John'}))

// Functions
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(arg1, arg2)
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenLastCalledWith(arg)

// Promises
expect(promise).resolves.toBe(value)
expect(promise).rejects.toThrow()

// DOM (React Testing Library)
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toBeDisabled()
expect(input).toHaveValue('test')
```

---

## Mock Setup Quick Guide

### Mocking Functions
```javascript
const mockFn = vi.fn();
const mockFn = vi.fn().mockReturnValue(5);
const mockFn = vi.fn().mockResolvedValue(data);
const mockFn = vi.fn().mockRejectedValue(error);
```

### Mocking Modules
```javascript
vi.mock('../../models/User');

User.findOne.mockResolvedValue({ id: '1', name: 'John' });
User.findOne.mockRejectedValue(new Error('DB error'));
```

### Clearing Mocks
```javascript
beforeEach(() => {
  vi.clearAllMocks();  // Clear all mocks
  jest.resetModules(); // Reset modules
});
```

---

## Coverage Goals

```
Target Coverage:
├── Statements: > 80%
├── Branches: > 75%
├── Functions: > 80%
└── Lines: > 80%

Current Status:
├── Statements: ▓▓▓▓▓▓░░░░ (60%)
├── Branches: ▓▓▓▓▓░░░░░░ (50%)
├── Functions: ▓▓▓▓▓▓░░░░ (60%)
└── Lines: ▓▓▓▓▓▓░░░░ (60%)
```

---

## Troubleshooting

### Tests Not Running
```bash
# Clear cache
npm test -- --clearCache

# Check Node version
node --version  # Should be >= 16

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Jest/Vitest Issues
```bash
# Update Jest
npm update jest -D

# Check jest.config.js exists
# Check tsconfig.json if using TypeScript
```

### Mock Not Working
```javascript
// Correct: Mock before import
jest.mock('../../module');
const module = require('../../module');

// Wrong: Mock after import (won't work)
const module = require('../../module');
jest.mock('../../module');
```

---

## Performance Tips

- ✅ Use mocks to avoid real API calls
- ✅ Run tests in parallel (default)
- ✅ Use `describe.only` to focus on one test suite
- ✅ Avoid `sleep()` or `waitFor()` unless necessary
- ✅ Cache expensive setup in `beforeAll`

---

## Resources

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
