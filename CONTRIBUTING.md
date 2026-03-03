# Contributing to LaunchPad

First off, thank you for considering contributing to LaunchPad! It's people like you that make LaunchPad such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template**:
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari]
 - Node version: [e.g. 18.17.0]
 - Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the steps
- **Describe the current behavior** and **explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/launchpad.git
cd launchpad

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/launchpad.git

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your local values

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Development Workflow

1. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow the coding standards
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
```bash
npm run lint          # Check code style
npm run type-check    # TypeScript validation
npm test              # Run unit tests
npm run test:e2e      # Run E2E tests
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add amazing feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Checklist:
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable):
Add screenshots to help explain your changes.
```

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUser(x: any): any {
  return prisma.user.findUnique({ where: { id: x } });
}
```

### React Components

```tsx
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// ❌ Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### API Routes

```typescript
// ✅ Good
import { validateSchema } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/api-response';
import { productSchema } from '@/validators/product.validator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateSchema(productSchema, body);
    
    // Business logic here
    
    return successResponse(result);
  } catch (error) {
    logger.error('Failed to create product', error);
    return errorResponse('Failed to create product', 500);
  }
}

// ❌ Bad
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await db.create(body);
  return NextResponse.json(result);
}
```

### File Organization

```
src/
├── app/
│   └── api/
│       └── products/
│           ├── route.ts              # API route handler
│           └── [id]/
│               └── route.ts          # Dynamic route
├── services/
│   └── product.service.ts            # Business logic
├── validators/
│   └── product.validator.ts          # Zod schemas
└── types/
    └── product.ts                    # Type definitions
```

### Testing

```typescript
// Unit test example
describe('ProductService', () => {
  it('should create a product', async () => {
    const data = {
      title: 'Test Product',
      price: 99,
      // ... other fields
    };

    const product = await productService.createProduct(data, 'seller-id');

    expect(product).toBeDefined();
    expect(product.title).toBe('Test Product');
  });
});

// E2E test example
test('user can purchase a product', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-1"]');
  await page.click('[data-testid="buy-button"]');
  await page.fill('[data-testid="card-number"]', '4242424242424242');
  await page.click('[data-testid="submit-payment"]');
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

## Project Structure Conventions

### Naming Conventions

- **Files**: kebab-case (`product.service.ts`)
- **Components**: PascalCase (`Button.tsx`)
- **Interfaces**: PascalCase (`interface User {}`)
- **Functions**: camelCase (`getUserById()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react';
import { NextRequest } from 'next/server';

// 2. External packages
import { z } from 'zod';

// 3. Internal modules
import { prisma } from '@/lib/db';
import { logger } from '@/utils/logger';

// 4. Types
import type { User } from '@/types';

// 5. Styles
import styles from './styles.module.css';
```

## Documentation

### Code Comments

```typescript
/**
 * Creates a new product listing in the marketplace.
 * 
 * @param data - Product data validated against schema
 * @param sellerId - ID of the seller creating the product
 * @returns The created product with generated ID
 * @throws {ValidationError} If data doesn't match schema
 * @throws {Error} If database operation fails
 */
async function createProduct(data: CreateProductInput, sellerId: string) {
  // Implementation
}
```

### API Documentation

When adding new API endpoints, update the API documentation:

```typescript
/**
 * @route POST /api/products
 * @access Seller only
 * @ratelimit 30 requests per minute
 * 
 * @body {CreateProductInput} Product data
 * @returns {Product} Created product
 * 
 * @example
 * POST /api/products
 * {
 *   "title": "My SaaS Kit",
 *   "price": 99,
 *   "category": "AI"
 * }
 */
```

## Questions?

Don't hesitate to ask questions! You can:
- Open an issue with the `question` label
- Join our Discord server (coming soon)
- Email the maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (coming soon)

Thank you for contributing to LaunchPad! 🚀
