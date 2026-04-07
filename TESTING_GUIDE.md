# BiteRite Testing Guide

## Overview

This project includes comprehensive testing coverage with both **Black Box Testing** (testing APIs and user workflows without knowing implementation) and **White Box Testing** (testing internal code logic with knowledge of implementation).

### Testing Strategy

- **Black Box Tests**: API endpoints, user workflows, integration tests
- **White Box Tests**: Unit tests for controllers, services, models
- **E2E Tests**: Complete user scenarios and critical paths

---

## Backend Testing (Node.js/Express)

### Setup

All dependencies are installed. Jest is configured for backend testing.

### Running Tests

```bash
# Navigate to backend directory
cd backend

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only E2E tests
npm run test:e2e
```

### Test Files Location

```
backend/tests/
├── integration/
│   └── api.test.js              # BLACK BOX: API endpoint tests
├── unit/
│   ├── authController.test.js   # WHITE BOX: Auth logic
│   ├── recipeController.test.js # WHITE BOX: Recipe logic
│   ├── geminiService.test.js    # WHITE BOX: AI service
│   └── models.test.js           # WHITE BOX: Data validation
└── e2e/                         # Full user workflows
```

### Backend Test Descriptions

#### 1. **api.test.js** (BLACK BOX) - API Endpoint Testing
Tests the backend APIs as a client would use them.

**Test Cases:**
- `POST /auth/register` - User registration with validation
- `POST /auth/login` - User authentication and JWT token
- `GET /recipes` - Fetch all recipes
- `GET /recipes/:id` - Fetch specific recipe
- Complete workflow tests (register → login → get recipes)

**Run specific test:**
```bash
npm test -- api.test.js
```

#### 2. **authController.test.js** (WHITE BOX) - Auth Logic
Tests the authentication business logic with mocked database.

**Test Cases:**
- Password hashing with bcryptjs (10 salt rounds)
- User existence validation
- JWT token creation with user role
- Error handling for missing credentials
- Duplicate user prevention

**Run specific test:**
```bash
npm test -- authController.test.js
```

#### 3. **recipeController.test.js** (WHITE BOX) - Recipe Logic
Tests recipe operations and filtering.

**Test Cases:**
- Fetch all recipes
- Fetch recipe by ID
- Save recipe to user collection
- Prevent duplicate saves
- Filter by dietary type
- Filter by calorie range
- Filter by allergies

**Run specific test:**
```bash
npm test -- recipeController.test.js
```

#### 4. **geminiService.test.js** (WHITE BOX) - AI Service
Tests AI recipe generation and health rule validation.

**Test Cases:**
- Recipe generation with user preferences
- Allergy information inclusion
- Calorie limit validation
- API error handling
- Recipe output parsing
- Macro ratio validation
- Sodium content checking
- Fiber content validation

**Run specific test:**
```bash
npm test -- geminiService.test.js
```

#### 5. **models.test.js** (WHITE BOX) - Data Models
Tests MongoDB schema validation and model relationships.

**Test Cases:**
- User schema required fields
- Recipe schema validation
- User-Recipe relationships
- Default values
- Array field handling

---

## Frontend Testing (React/Vitest)

### Setup

All dependencies are installed. Vitest is configured for frontend testing.

### Running Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Files Location

```
frontend/__tests__/
├── components/
│   └── components.test.jsx      # Component unit tests
├── pages/
│   └── pages.test.jsx           # Page integration tests
└── e2e/
    └── e2e.test.jsx            # Full user workflows
```

### Frontend Test Descriptions

#### 1. **components.test.jsx** - Component Unit Tests
Tests individual React components in isolation.

**Test Cases:**
- **Navbar Component**
  - Renders with username
  - Search functionality
  - Create button callback
  - Theme toggle

- **RecipeCard Component**
  - Displays recipe data
  - Shows cooking time
  - Displays calories
  - Handles click events
  - Graceful error handling for missing data

- **Login Form Component**
  - Input fields render
  - Form submission
  - Loading states
  - Input validation
  - Password field security

**Run specific tests:**
```bash
npm test -- components.test.jsx
```

#### 2. **pages.test.jsx** - Page Integration Tests
Tests full page components and user workflows.

**Test Cases:**
- **Home Page**
  - Welcome message
  - Recipe list display
  - Empty states
  - Recipe loading

- **Generate Page**
  - Form rendering
  - Diet selection options
  - Calorie input
  - Loading states

- **Saved Recipes Page**
  - Display saved recipes
  - Remove recipe functionality
  - Empty state messages

- **Login Page**
  - Login form rendering
  - Form submission
  - Error messages
  - Error clearing

**Run specific tests:**
```bash
npm test -- pages.test.jsx
```

#### 3. **e2e.test.jsx** - End-to-End User Scenarios
Tests complete user workflows across multiple pages and features.

**Critical User Paths Tested:**
1. New user registration and onboarding
2. Recipe generation and saving
3. Viewing and managing saved recipes
4. Community forum interaction
5. Dietician recipe verification
6. Search and filtering functionality
7. Profile updates
8. Authentication with JWT
9. Error handling and recovery
10. Performance with large data sets

**Run E2E tests:**
```bash
npm test -- e2e.test.jsx
```

---

## Running All Tests

### Backend
```bash
cd backend
npm test                    # All tests
npm run test:coverage      # With coverage report
```

### Frontend
```bash
cd frontend
npm test                    # All tests
npm run test:coverage      # With coverage report
npm run test:ui           # With visual UI
```

### Both (from root)
```bash
# Run both backend and frontend tests
cd backend && npm test && cd ../frontend && npm test
```

---

## Understanding Test Coverage

### Coverage Report
After running `npm run test:coverage`, check the reports:

**Backend:**
- `backend/coverage/index.html` - Interactive coverage report

**Frontend:**
- `frontend/coverage/index.html` - Interactive coverage report

### Target Coverage Goals
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Key Areas for Testing

**Backend Priority:**
1. Authentication (HIGH) ✅
2. Recipe APIs (HIGH) ✅
3. Data validation (HIGH) ✅
4. Error handling (MEDIUM) ✅
5. AI service integration (MEDIUM) ✅

**Frontend Priority:**
1. Login/Auth flow (HIGH) ✅
2. Recipe display (HIGH) ✅
3. Form handling (HIGH) ✅
4. Navigation (MEDIUM) ✅
5. Error boundaries (MEDIUM) ✅

---

## Test Execution Flow

### Black Box Testing (User Perspective)
1. Tests run without knowledge of internal code
2. Focus on inputs and outputs
3. Test API requests and responses
4. Test user workflows
5. Validate business logic results

**Example:**
```javascript
// User sends login request
POST /auth/login
{ email: "user@test.com", password: "pass123" }

// We test: Is status 200? Does response contain token?
// We DON'T test: How password hashing works?
```

### White Box Testing (Developer Perspective)
1. Tests run with knowledge of code structure
2. Test internal logic and edge cases
3. Validate error handling paths
4. Mock dependencies
5. Test individual functions

**Example:**
```javascript
// Test EXACTLY how password is hashed
expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
expect(savedPassword).not.toBe('plaintext');
```

---

## Common Testing Patterns

### Testing API Endpoints (Black Box)
```javascript
const response = await request(app)
  .post('/auth/register')
  .send({ email: 'test@test.com', password: 'pass123' });

expect(response.status).toBe(201);
expect(response.body).toHaveProperty('token');
```

### Testing Controller Logic (White Box)
```javascript
User.findOne.mockResolvedValue(null);
bcrypt.hash.mockResolvedValue('hashedPassword');

await authController.register(req, res);

expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
```

### Testing React Components
```javascript
render(<RecipeCard recipe={mockRecipe} onClick={mockFn} />);
fireEvent.click(screen.getByTestId('recipe-card'));
expect(mockFn).toHaveBeenCalledWith(mockRecipe);
```

---

## Troubleshooting

### Backend Tests Not Running
```bash
# Clear Jest cache
npm test -- --clearCache

# Run specific test file
npm test authController.test.js

# Run in verbose mode
npm test -- --verbose
```

### Frontend Tests Not Running
```bash
# Clear Vitest cache
rm -rf node_modules/.vitest

# Run specific test
npm test -- components.test.jsx

# Run in UI mode for debugging
npm run test:ui
```

### Database Connection Issues
Tests use in-memory MongoDB for testing. Ensure:
```bash
# Check jest.setup.js has test DB configuration
# MONGODB_URI should be mongodb://localhost:27017/biterite-test

# Or use MongoDB Memory Server
npm install --save-dev mongodb-memory-server
```

---

## Best Practices

### Writing New Tests
1. **Descriptive Names**: `test('should hash password before saving')`
2. **Arrange-Act-Assert**: Setup → Execute → Verify
3. **Single Responsibility**: One test, one concept
4. **Mock External Dependencies**: Database, APIs, external services
5. **Test Edge Cases**: Empty inputs, errors, boundary conditions

### Test Organization
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  describe('Specific Behavior', () => {
    test('should do X when Y happens', () => {
      // Arrange
      const input = ...;

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe(...);
    });
  });
});
```

### Debugging Failed Tests
```bash
# Run single test
npm test -- specificTest.test.js

# Add console.log to test
test('debug test', () => {
  console.log('Debug info:', data);
  expect(...).toBe(...);
});

# Run with verbose output
npm test -- --verbose
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Run tests
        run: |
          cd backend && npm test -- --coverage
          cd ../frontend && npm test -- --coverage
```

---

## Next Steps

1. **Run the tests**: `npm test` in each directory
2. **Check coverage**: `npm run test:coverage`
3. **Add more tests**: As you add features, add corresponding tests
4. **Set up CI/CD**: Automate test running on every commit
5. **Monitor coverage**: Aim for > 80% code coverage

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
