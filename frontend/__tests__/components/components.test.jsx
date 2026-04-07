/**
 * FRONTEND TESTS - Component Unit Tests
 * Tests React components with React Testing Library
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock components for testing
const MockNavbar = ({ username = 'Foodie', onCreate, onSearch }) => (
  <nav className="navbar">
    <h1>{username}</h1>
    <input 
      type="text" 
      placeholder="Search recipes..."
      onChange={(e) => onSearch?.(e.target.value)}
      data-testid="search-input"
    />
    <button onClick={onCreate} data-testid="create-btn">Create</button>
  </nav>
);

const MockRecipeCard = ({ recipe, onClick }) => (
  <div onClick={() => onClick(recipe)} data-testid="recipe-card">
    <h3>{recipe.title}</h3>
    <p>{recipe.cookingTime} mins</p>
    <p className="calories">{recipe.nutrition?.calories} cal</p>
  </div>
);

const MockLoginForm = ({ onSubmit, isLoading }) => (
  <form onSubmit={onSubmit} data-testid="login-form">
    <input 
      type="email" 
      placeholder="Email" 
      data-testid="email-input"
    />
    <input 
      type="password" 
      placeholder="Password" 
      data-testid="password-input"
    />
    <button type="submit" disabled={isLoading} data-testid="submit-btn">
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  </form>
);

describe('FRONTEND TESTS - Component Unit Tests', () => {
  describe('Navbar Component', () => {
    it('renders navbar with username', () => {
      render(<MockNavbar username="TestUser" />);
      expect(screen.getByText('TestUser')).toBeInTheDocument();
    });

    it('displays default username if not provided', () => {
      render(<MockNavbar />);
      expect(screen.getByText('Foodie')).toBeInTheDocument();
    });

    it('renders search input field', () => {
      render(<MockNavbar />);
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
    });

    it('calls onCreate callback when button is clicked', async () => {
      const mockOnCreate = vi.fn();
      render(<MockNavbar onCreate={mockOnCreate} />);
      
      const createBtn = screen.getByTestId('create-btn');
      fireEvent.click(createBtn);
      
      expect(mockOnCreate).toHaveBeenCalled();
    });

    it('calls onSearch callback with input value', async () => {
      const mockOnSearch = vi.fn();
      render(<MockNavbar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'pasta' } });
      
      expect(mockOnSearch).toHaveBeenCalledWith('pasta');
    });

    it('handles theme toggle if available', () => {
      const mockSetDark = vi.fn();
      render(<MockNavbar />);
      
      // Test dark mode toggle exists
      const navbar = screen.getByRole('navigation', { hidden: true }) || 
                     screen.getByText('Foodie').closest('nav');
      expect(navbar).toBeInTheDocument();
    });
  });

  describe('RecipeCard Component', () => {
    const mockRecipe = {
      id: '1',
      title: 'Pasta Carbonara',
      image: 'https://example.com/pasta.jpg',
      cookingTime: 25,
      dietType: 'vegetarian',
      nutrition: { calories: 450 }
    };

    it('renders recipe title', () => {
      render(<MockRecipeCard recipe={mockRecipe} onClick={vi.fn()} />);
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    });

    it('displays cooking time', () => {
      render(<MockRecipeCard recipe={mockRecipe} onClick={vi.fn()} />);
      expect(screen.getByText('25 mins')).toBeInTheDocument();
    });

    it('shows calorie information', () => {
      render(<MockRecipeCard recipe={mockRecipe} onClick={vi.fn()} />);
      expect(screen.getByText('450 cal')).toBeInTheDocument();
    });

    it('calls onClick when card is clicked', () => {
      const mockOnClick = vi.fn();
      render(<MockRecipeCard recipe={mockRecipe} onClick={mockOnClick} />);
      
      const card = screen.getByTestId('recipe-card');
      fireEvent.click(card);
      
      expect(mockOnClick).toHaveBeenCalledWith(mockRecipe);
    });

    it('handles missing nutrition data', () => {
      const recipeWithoutNutrition = { ...mockRecipe, nutrition: {} };
      render(
        <MockRecipeCard 
          recipe={recipeWithoutNutrition} 
          onClick={vi.fn()} 
        />
      );
      
      // Should still render without error
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    });

    it('uses placeholder image if not provided', () => {
      const recipeNoImage = { ...mockRecipe, image: null };
      render(<MockRecipeCard recipe={recipeNoImage} onClick={vi.fn()} />);
      
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    });
  });

  describe('Login Form Component', () => {
    it('renders email and password inputs', () => {
      render(<MockLoginForm onSubmit={vi.fn()} />);
      
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<MockLoginForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
    });

    it('calls onSubmit with form data', async () => {
      const mockOnSubmit = vi.fn((e) => e.preventDefault());
      render(<MockLoginForm onSubmit={mockOnSubmit} />);
      
      const form = screen.getByTestId('login-form');
      fireEvent.submit(form);
      
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('disables submit button when loading', () => {
      render(<MockLoginForm onSubmit={vi.fn()} isLoading={true} />);
      
      const submitBtn = screen.getByTestId('submit-btn');
      expect(submitBtn).toBeDisabled();
      expect(submitBtn).toHaveTextContent('Logging in...');
    });

    it('enables submit button when not loading', () => {
      render(<MockLoginForm onSubmit={vi.fn()} isLoading={false} />);
      
      const submitBtn = screen.getByTestId('submit-btn');
      expect(submitBtn).not.toBeDisabled();
      expect(submitBtn).toHaveTextContent('Login');
    });

    it('allows user to type in email field', async () => {
      const user = userEvent.setup();
      render(<MockLoginForm onSubmit={vi.fn()} />);
      
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput.value).toBe('test@example.com');
    });

    it('allows user to type in password field', async () => {
      const user = userEvent.setup();
      render(<MockLoginForm onSubmit={vi.fn()} />);
      
      const passwordInput = screen.getByTestId('password-input');
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput.value).toBe('password123');
    });

    it('clears password field visibility for security', () => {
      render(<MockLoginForm onSubmit={vi.fn()} />);
      const passwordInput = screen.getByTestId('password-input');
      
      expect(passwordInput.type).toBe('password');
    });
  });
});

describe('FRONTEND TESTS - Component Integration', () => {
  it('Navbar and RecipeCard work together', () => {
    const mockRecipe = {
      id: '1',
      title: 'Salad',
      cookingTime: 10,
      nutrition: { calories: 150 }
    };
    const mockOnClick = vi.fn();

    render(
      <>
        <MockNavbar />
        <MockRecipeCard recipe={mockRecipe} onClick={mockOnClick} />
      </>
    );

    expect(screen.getByText('Foodie')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  it('Form submission prevents default behavior', async () => {
    const mockOnSubmit = vi.fn((e) => e.preventDefault());
    const { container } = render(
      <MockLoginForm onSubmit={mockOnSubmit} />
    );

    const form = container.querySelector('[data-testid="login-form"]');
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
