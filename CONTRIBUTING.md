# Contributing to Gravity AI Agent Platform

Thank you for your interest in contributing to Gravity! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account (free tier works)
- Anthropic API key for testing

### Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Gravity-SaaS-Agent.git
   cd Gravity-SaaS-Agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Define types** explicitly, avoid `any`
- **Use interfaces** for object shapes
- **Prefer const** over let when possible

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (id: string): Promise<UserProfile> => {
  // implementation
};

// Avoid
const fetchUser = async (id: any): Promise<any> => {
  // implementation
};
```

### React Components

- **Use functional components** with hooks
- **Keep components small** and focused
- **Extract custom hooks** for reusable logic
- **Use proper prop types** with TypeScript

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick} 
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)

### Code Organization

```
src/
├── app/              # Next.js app routes
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── features/    # Feature-specific components
├── lib/             # Utilities and helpers
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(dashboard): add agent analytics chart
fix(auth): resolve token expiration bug
docs(readme): update installation instructions
refactor(gateway): simplify caching logic
```

## Pull Request Process

### Before Submitting

1. **Update from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   npm test
   npm run lint
   npm run typecheck
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

### Creating the PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Use a clear, descriptive title
   - Reference any related issues
   - Provide a detailed description
   - Include screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Manual testing completed
   - [ ] All tests passing

   ## Screenshots (if applicable)
   
   ## Related Issues
   Closes #123
   ```

### Review Process

- PRs require at least one approval
- Address all review comments
- Keep PRs focused and reasonably sized
- Be responsive to feedback

## Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific workspace
npm test -w @gravity/gateway
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2026-01-30');
    expect(formatDate(date)).toBe('Jan 30, 2026');
  });

  it('should handle invalid dates', () => {
    expect(formatDate(null)).toBe('Invalid Date');
  });
});
```

### Test Coverage Goals

- **Unit tests**: 80%+ coverage
- **Integration tests**: Critical paths
- **E2E tests**: Main user flows

## Documentation

### Code Comments

```typescript
/**
 * Fetches user profile from the database
 * @param userId - The unique identifier for the user
 * @param options - Optional fetch configuration
 * @returns User profile data or null if not found
 * @throws {DatabaseError} If database connection fails
 */
async function fetchUserProfile(
  userId: string,
  options?: FetchOptions
): Promise<UserProfile | null> {
  // implementation
}
```

### README Updates

- Update README.md for new features
- Keep installation steps current
- Document new environment variables
- Add examples for new APIs

### API Documentation

- Document all public APIs
- Include request/response examples
- Note any breaking changes
- Update OpenAPI/Swagger specs

## Questions?

- Open an issue for bugs
- Start a discussion for feature ideas
- Join our Discord community
- Email: dev@gravity.ai

Thank you for contributing to Gravity! 🚀
