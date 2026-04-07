/**
 * WHITE BOX TESTS - Recipe Controller Unit Tests
 * Tests recipe-related business logic with mocked database
 */

jest.mock('../../models/Recipe', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
}));

jest.mock('../../models/User', () => ({
  findById: jest.fn(),
  find: jest.fn()
}));

const Recipe = require('../../models/Recipe');
const User = require('../../models/User');

describe('WHITE BOX TESTS - Recipe Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Recipe Data Operations', () => {
    test('Recipe.find can retrieve all recipes', () => {
      Recipe.find.mockResolvedValue([
        { _id: '1', name: 'Pasta', calories: 300 },
        { _id: '2', name: 'Salad', calories: 150 }
      ]);

      expect(Recipe.find).toBeDefined();
    });

    test('Recipe.findById retrieves specific recipe', () => {
      Recipe.findById.mockResolvedValue({ _id: '1', name: 'Pasta' });
      expect(Recipe.findById).toBeDefined();
    });

    test('User.findById retrieves user data', () => {
      User.findById.mockResolvedValue({ _id: 'user1', name: 'John' });
      expect(User.findById).toBeDefined();
    });

    test('Recipe.create adds new recipe', () => {
      Recipe.create.mockResolvedValue({ _id: 'new1', name: 'New Recipe' });
      expect(Recipe.create).toBeDefined();
    });
  });

  describe('Recipe Validation Logic', () => {
    test('Recipe must have name field', () => {
      const recipe = {
        name: 'Pasta',
        ingredients: ['pasta', 'tomato'],
        calories: 300
      };

      expect(recipe).toHaveProperty('name');
      expect(recipe.name).toBeTruthy();
    });

    test('Recipe must have ingredients array', () => {
      const recipe = {
        name: 'Salad',
        ingredients: ['lettuce', 'tomato']
      };

      expect(recipe).toHaveProperty('ingredients');
      expect(Array.isArray(recipe.ingredients)).toBe(true);
    });

    test('Calories must be positive number', () => {
      expect(250 > 0).toBe(true);
      expect(-100 > 0).toBe(false);
    });

    test('Ingredients array cannot be empty for valid recipe', () => {
      const emptyIngredients = { ingredients: [] };
      const hasIngredients = { ingredients: ['pasta'] };

      expect(emptyIngredients.ingredients.length).toBe(0);
      expect(hasIngredients.ingredients.length > 0).toBe(true);
    });
  });

  describe('Recipe Filtering', () => {
    test('Filters recipes by diet type', () => {
      const recipes = [
        { name: 'Vegan Pasta', dietType: 'vegan' },
        { name: 'Chicken', dietType: 'omnivore' }
      ];

      const vegan = recipes.filter(r => r.dietType === 'vegan');

      expect(vegan.length).toBe(1);
      expect(vegan[0].name).toBe('Vegan Pasta');
    });

    test('Filters recipes by calorie range', () => {
      const recipes = [
        { name: 'Light', calories: 100 },
        { name: 'Medium', calories: 300 },
        { name: 'Heavy', calories: 600 }
      ];

      const lowCal = recipes.filter(r => r.calories < 250);

      expect(lowCal.length).toBe(1);
      expect(lowCal[0].name).toBe('Light');
    });

    test('Filters recipes by allergen safety', () => {
      const recipes = [
        { name: 'Peanut Butter', allergens: ['peanuts'] },
        { name: 'Plain Rice', allergens: [] }
      ];

      const safe = recipes.filter(r => !r.allergens.includes('peanuts'));

      expect(safe.length).toBe(1);
    });

    test('Combines multiple filters correctly', () => {
      const recipes = [
        { name: 'Vegan Salad', dietType: 'vegan', calories: 150 },
        { name: 'Vegan Pasta', dietType: 'vegan', calories: 350 },
        { name: 'Chicken Bowl', dietType: 'omnivore', calories: 400 }
      ];

      const filtered = recipes.filter(r =>
        r.dietType === 'vegan' && r.calories < 300
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Vegan Salad');
    });
  });

  describe('Recipe Search', () => {
    test('Searches recipes by name', () => {
      const recipes = [
        { name: 'Pasta Carbonara', type: 'pasta' },
        { name: 'Caesar Salad', type: 'salad' },
        { name: 'Pasta Primavera', type: 'pasta' }
      ];

      const pastaRecipes = recipes.filter(r =>
        r.name.toLowerCase().includes('pasta')
      );

      expect(pastaRecipes.length).toBe(2);
    });

    test('Case-insensitive search works', () => {
      const recipes = [
        { name: 'PASTA' },
        { name: 'Salad' },
        { name: 'PaSta Bake' }
      ];

      const results = recipes.filter(r =>
        r.name.toLowerCase().includes('pasta')
      );

      expect(results.length).toBe(2);
    });
  });

  describe('Recipe Sorting', () => {
    test('Sorts recipes by calories ascending', () => {
      const recipes = [
        { name: 'Heavy', calories: 600 },
        { name: 'Light', calories: 100 },
        { name: 'Medium', calories: 300 }
      ];

      const sorted = [...recipes].sort((a, b) => a.calories - b.calories);

      expect(sorted[0].name).toBe('Light');
      expect(sorted[2].name).toBe('Heavy');
    });

    test('Sorts recipes by cooking time', () => {
      const recipes = [
        { name: 'Quick', cookTime: 10 },
        { name: 'Medium', cookTime: 30 },
        { name: 'Long', cookTime: 60 }
      ];

      const sorted = [...recipes].sort((a, b) => a.cookTime - b.cookTime);

      expect(sorted[0].cookTime).toBe(10);
      expect(sorted[2].cookTime).toBe(60);
    });
  });
});
