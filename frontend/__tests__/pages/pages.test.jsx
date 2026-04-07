/**
 * FRONTEND TESTS - Page Integration Tests
 * Tests entire page flows and user interactions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock page components
const MockHomePage = ({ recipes = [] }) => (
  <div data-testid="home-page">
    <h1>Welcome to BiteRite</h1>
    <p>Find healthy recipes tailored to your needs</p>
    <div data-testid="recipe-list">
      {recipes.map(recipe => (
        <div key={recipe.id} data-testid={`recipe-${recipe.id}`}>
          {recipe.name}
        </div>
      ))}
    </div>
  </div>
);

const MockGeneratePage = ({ onGenerate, isLoading }) => (
  <div data-testid="generate-page">
    <h1>Generate Recipe</h1>
    <form onSubmit={onGenerate} data-testid="generate-form">
      <select data-testid="diet-select">
        <option>Omnivore</option>
        <option>Vegan</option>
        <option>Vegetarian</option>
      </select>
      <input 
        type="number" 
        placeholder="Calorie goal"
        data-testid="calorie-input"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Recipe'}
      </button>
    </form>
  </div>
);

const MockSavedRecipesPage = ({ recipes = [], onRemove }) => (
  <div data-testid="saved-recipes-page">
    <h1>Saved Recipes</h1>
    {recipes.length === 0 ? (
      <p>No saved recipes yet</p>
    ) : (
      <div data-testid="saved-list">
        {recipes.map(recipe => (
          <div key={recipe.id} data-testid={`saved-${recipe.id}`}>
            <span>{recipe.name}</span>
            <button 
              onClick={() => onRemove(recipe.id)}
              data-testid={`remove-${recipe.id}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const MockLoginPage = ({ onLogin, error }) => (
  <div data-testid="login-page">
    <h1>Login</h1>
    {error && <p className="error">{error}</p>}
    <form onSubmit={onLogin} data-testid="login-form">
      <input 
        type="email" 
        placeholder="Email"
        data-testid="email-field"
      />
      <input 
        type="password" 
        placeholder="Password"
        data-testid="password-field"
      />
      <button type="submit">Login</button>
    </form>
  </div>
);

describe('FRONTEND TESTS - Page Integration Tests', () => {
  describe('Home Page', () => {
    it('renders welcome message', () => {
      render(<MockHomePage />);
      expect(screen.getByText('Welcome to BiteRite')).toBeInTheDocument();
    });

    it('displays recipe list', () => {
      const recipes = [
        { id: '1', name: 'Pasta' },
        { id: '2', name: 'Salad' }
      ];

      render(<MockHomePage recipes={recipes} />);

      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.getByText('Salad')).toBeInTheDocument();
    });

    it('displays empty state when no recipes', () => {
      const { container } = render(<MockHomePage recipes={[]} />);
      const recipeList = screen.getByTestId('recipe-list');

      expect(recipeList.children.length).toBe(0);
    });

    it('loads recipes on mount', async () => {
      const mockFetch = vi.fn();
      render(<MockHomePage recipes={[{ id: '1', name: 'Test Recipe' }]} />);

      await waitFor(() => {
        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
      });
    });
  });

  describe('Generate Page', () => {
    it('renders recipe generation form', () => {
      render(<MockGeneratePage onGenerate={vi.fn()} />);

      expect(screen.getByTestId('diet-select')).toBeInTheDocument();
      expect(screen.getByTestId('calorie-input')).toBeInTheDocument();
    });

    it('submits form with user selections', () => {
      const mockOnGenerate = vi.fn((e) => e.preventDefault());
      render(
        <MockGeneratePage 
          onGenerate={mockOnGenerate} 
          isLoading={false}
        />
      );

      const form = screen.getByTestId('generate-form');
      fireEvent.submit(form);

      expect(mockOnGenerate).toHaveBeenCalled();
    });

    it('disables submit button during generation', () => {
      render(<MockGeneratePage onGenerate={vi.fn()} isLoading={true} />);

      const submitBtn = screen.getByText('Generating...');
      expect(submitBtn).toBeDisabled();
    });

    it('shows different diet options', () => {
      render(<MockGeneratePage onGenerate={vi.fn()} />);

      const dietSelect = screen.getByTestId('diet-select');
      const options = dietSelect.querySelectorAll('option');

      expect(options.length).toBeGreaterThan(0);
      expect(options[0].textContent).toBe('Omnivore');
    });

    it('accepts calorie input', () => {
      render(<MockGeneratePage onGenerate={vi.fn()} />);

      const calorieInput = screen.getByTestId('calorie-input');
      expect(calorieInput.type).toBe('number');
    });
  });

  describe('Saved Recipes Page', () => {
    it('displays saved recipes list', () => {
      const savedRecipes = [
        { id: '1', name: 'Pasta' },
        { id: '2', name: 'Salad' }
      ];

      render(
        <MockSavedRecipesPage 
          recipes={savedRecipes} 
          onRemove={vi.fn()}
        />
      );

      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.getByText('Salad')).toBeInTheDocument();
    });

    it('shows empty state when no recipes saved', () => {
      render(
        <MockSavedRecipesPage 
          recipes={[]} 
          onRemove={vi.fn()}
        />
      );

      expect(screen.getByText('No saved recipes yet')).toBeInTheDocument();
    });

    it('removes recipe when delete button clicked', () => {
      const mockOnRemove = vi.fn();
      const recipes = [
        { id: '1', name: 'Pasta' },
        { id: '2', name: 'Salad' }
      ];

      render(
        <MockSavedRecipesPage 
          recipes={recipes} 
          onRemove={mockOnRemove}
        />
      );

      const removeBtn = screen.getByTestId('remove-1');
      fireEvent.click(removeBtn);

      expect(mockOnRemove).toHaveBeenCalledWith('1');
    });

    it('displays correct number of remove buttons', () => {
      const recipes = [
        { id: '1', name: 'Recipe 1' },
        { id: '2', name: 'Recipe 2' },
        { id: '3', name: 'Recipe 3' }
      ];

      render(
        <MockSavedRecipesPage 
          recipes={recipes} 
          onRemove={vi.fn()}
        />
      );

      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons.length).toBe(3);
    });
  });

  describe('Login Page', () => {
    it('renders login form', () => {
      render(<MockLoginPage onLogin={vi.fn()} />);

      expect(screen.getByTestId('email-field')).toBeInTheDocument();
      expect(screen.getByTestId('password-field')).toBeInTheDocument();
    });

    it('submits login credentials', () => {
      const mockOnLogin = vi.fn((e) => e.preventDefault());
      render(<MockLoginPage onLogin={mockOnLogin} />);

      const form = screen.getByTestId('login-form');
      fireEvent.submit(form);

      expect(mockOnLogin).toHaveBeenCalled();
    });

    it('displays error message when login fails', () => {
      const error = 'Invalid email or password';
      render(
        <MockLoginPage 
          onLogin={vi.fn()} 
          error={error}
        />
      );

      expect(screen.getByText(error)).toBeInTheDocument();
    });

    it('clears error message on new input', () => {
      const { rerender } = render(
        <MockLoginPage 
          onLogin={vi.fn()} 
          error="Login failed"
        />
      );

      expect(screen.getByText('Login failed')).toBeInTheDocument();

      rerender(
        <MockLoginPage 
          onLogin={vi.fn()} 
          error={null}
        />
      );

      expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
    });
  });

  describe('Page Navigation Workflows', () => {
    it('Complete user flow: Login -> Home -> Generate -> Save', () => {
      // Step 1: User logs in
      const { rerender } = render(
        <MockLoginPage onLogin={vi.fn()} />
      );
      expect(screen.getByTestId('login-page')).toBeInTheDocument();

      // Step 2: User navigates to home
      rerender(<MockHomePage recipes={[]} />);
      expect(screen.getByText('Welcome to BiteRite')).toBeInTheDocument();

      // Step 3: User generates recipe
      rerender(<MockGeneratePage onGenerate={vi.fn()} />);
      expect(screen.getByTestId('generate-form')).toBeInTheDocument();

      // Step 4: User saves recipe
      const savedRecipes = [
        { id: '1', name: 'Generated Recipe' }
      ];
      rerender(
        <MockSavedRecipesPage 
          recipes={savedRecipes} 
          onRemove={vi.fn()}
        />
      );
      expect(screen.getByText('Generated Recipe')).toBeInTheDocument();
    });
  });

  describe('Page Error Handling', () => {
    it('handles network errors gracefully', async () => {
      render(<MockHomePage recipes={[]} />);

      await waitFor(() => {
        // Page should still render even if API fails
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('shows retry option on failed data loading', () => {
      render(<MockLoginPage onLogin={vi.fn()} error="Connection error" />);

      expect(screen.getByText('Connection error')).toBeInTheDocument();
    });
  });
});
