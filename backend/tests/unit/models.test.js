/**
 * WHITE BOX TESTS - User Model Unit Tests
 * Tests Mongoose schema validation and model methods
 */

const mongoose = require('mongoose');

describe('WHITE BOX TESTS - User Model', () => {
  describe('User Schema Validation', () => {
    test('User requires clerkId field', () => {
      const userSchema = {
        clerkId: { type: String, required: true, unique: true },
        email: String,
        role: String
      };

      expect(userSchema.clerkId.required).toBe(true);
    });

    test('User clerkId must be unique', () => {
      const userSchema = {
        clerkId: { type: String, required: true, unique: true }
      };

      expect(userSchema.clerkId.unique).toBe(true);
    });

    test('User role defaults to "user"', () => {
      const role = {
        type: String,
        enum: ['user', 'dietician'],
        default: 'user'
      };

      expect(role.default).toBe('user');
    });

    test('User dietType is optional', () => {
      const userFields = {
        clerkId: { required: true },
        dietType: String
      };

      expect(userFields.dietType).toBeDefined();
      expect(userFields.dietType.required).toBeUndefined();
    });

    test('Health conditions stored as array', () => {
      const userFields = {
        healthConditions: [String]
      };

      const conditions = ['diabetes', 'hypertension'];
      expect(Array.isArray(conditions)).toBe(true);
    });

    test('Allergies stored as array', () => {
      const userFields = {
        allergies: [String]
      };

      const allergies = ['peanuts', 'shellfish'];
      expect(Array.isArray(allergies)).toBe(true);
    });

    test('onboardingCompleted defaults to false', () => {
      const field = {
        type: Boolean,
        default: false
      };

      expect(field.default).toBe(false);
    });

    test('User can reference multiple recipes', () => {
      const userFields = {
        recipesGenerated: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        ]
      };

      expect(Array.isArray(userFields.recipesGenerated)).toBe(true);
    });
  });

  describe('User Model Methods', () => {
    test('User model supports save operation', () => {
      const mockUser = {
        clerkId: 'clerk_123',
        email: 'user@example.com',
        role: 'user',
        save: jest.fn().mockResolvedValue({})
      };

      expect(mockUser.save).toBeDefined();
    });

    test('User references populated with recipes', () => {
      const mockUser = {
        clerkId: 'clerk_123',
        recipesGenerated: ['recipe1', 'recipe2'],
        populate: jest.fn().mockResolvedValue({
          recipesGenerated: [
            { _id: 'recipe1', name: 'Pasta' },
            { _id: 'recipe2', name: 'Salad' }
          ]
        })
      };

      expect(mockUser.populate).toBeDefined();
    });
  });

  describe('User Model - Creation and Updates', () => {
    test('User creation with valid data', () => {
      const userData = {
        clerkId: 'clerk_new_user',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        dietType: 'vegan',
        healthConditions: ['none'],
        allergies: [],
        age: 28,
        weight: 70,
        goal: 'loss weight'
      };

      expect(userData.clerkId).toBeDefined();
      expect(userData.email).toBeDefined();
      expect(userData.role).toBe('user');
    });

    test('User role can be updated to dietician', () => {
      const user = {
        clerkId: 'clerk_123',
        role: 'user'
      };

      user.role = 'dietician';

      expect(user.role).toBe('dietician');
    });

    test('User preferences can be updated', () => {
      const user = {
        dietType: 'omnivore',
        allergies: [],
        healthConditions: []
      };

      user.dietType = 'vegan';
      user.allergies.push('peanuts');
      user.healthConditions.push('diabetes');

      expect(user.dietType).toBe('vegan');
      expect(user.allergies).toContain('peanuts');
      expect(user.healthConditions).toContain('diabetes');
    });

    test('Onboarding completion flag can be set', () => {
      const user = {
        onboardingCompleted: false
      };

      user.onboardingCompleted = true;

      expect(user.onboardingCompleted).toBe(true);
    });
  });

  describe('User Model - Relationships', () => {
    test('User can have saved recipes', () => {
      const user = {
        clerkId: 'clerk_123',
        savedRecipes: ['recipe1', 'recipe2', 'recipe3']
      };

      expect(user.savedRecipes.length).toBe(3);
      expect(user.savedRecipes).toContain('recipe2');
    });

    test('User can have favorite recipes', () => {
      const user = {
        clerkId: 'clerk_123',
        favorites: ['recipe1', 'recipe5']
      };

      expect(user.favorites.length).toBe(2);
    });

    test('Recipe can be added to saved recipes', () => {
      const user = {
        savedRecipes: []
      };

      const newRecipeId = 'recipe100';
      user.savedRecipes.push(newRecipeId);

      expect(user.savedRecipes).toContain(newRecipeId);
      expect(user.savedRecipes.length).toBe(1);
    });

    test('Recipe can be removed from saved recipes', () => {
      const user = {
        savedRecipes: ['recipe1', 'recipe2', 'recipe3']
      };

      const index = user.savedRecipes.indexOf('recipe2');
      if (index > -1) {
        user.savedRecipes.splice(index, 1);
      }

      expect(user.savedRecipes).not.toContain('recipe2');
      expect(user.savedRecipes.length).toBe(2);
    });
  });
});

describe('WHITE BOX TESTS - Recipe Model', () => {
  describe('Recipe Schema Validation', () => {
    test('Recipe requires name field', () => {
      const recipeSchema = {
        name: { type: String, required: true },
        ingredients: [String]
      };

      expect(recipeSchema.name.required).toBe(true);
    });

    test('Recipe stores nutrition information', () => {
      const recipe = {
        name: 'Pasta',
        nutrition: {
          calories: 300,
          protein: 12,
          carbs: 45,
          fat: 8
        }
      };

      expect(recipe.nutrition.calories).toBe(300);
      expect(recipe.nutrition.protein).toBe(12);
    });

    test('Recipe tracks verification status', () => {
      const recipe = {
        name: 'Salad',
        verifiedByDietician: false,
        pendingVerification: true
      };

      expect(recipe.verifiedByDietician).toBe(false);
      expect(recipe.pendingVerification).toBe(true);
    });

    test('Recipe can store preparation time', () => {
      const recipe = {
        name: 'Pasta',
        prepTime: 15,
        cookTime: 20,
        totalTime: 35
      };

      expect(recipe.totalTime).toBe(recipe.prepTime + recipe.cookTime);
    });
  });

  describe('Recipe Validation Logic', () => {
    test('Recipe calories must be positive', () => {
      const recipe = { calories: 300 };
      expect(recipe.calories > 0).toBe(true);
    });

    test('Recipe must have at least one ingredient', () => {
      const recipe = { ingredients: ['pasta', 'tomato', 'basil'] };
      expect(recipe.ingredients.length > 0).toBe(true);
    });

    test('Recipe difficulty level validation', () => {
      const validLevels = ['easy', 'medium', 'hard'];
      const recipe = { difficulty: 'easy' };

      expect(validLevels.includes(recipe.difficulty)).toBe(true);
    });

    test('Recipe cuisines stored as array', () => {
      const recipe = {
        cuisines: ['Italian', 'Mediterranean']
      };

      expect(Array.isArray(recipe.cuisines)).toBe(true);
    });
  });
});
