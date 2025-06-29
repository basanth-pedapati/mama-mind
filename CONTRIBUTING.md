# 🤝 Contributing to Mama Mind

Thank you for your interest in contributing to Mama Mind! This guide will help you get started with contributing to our maternity care platform.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mama-mind.git
   cd mama-mind
   ```
3. **Set up the development environment**:
   ```bash
   npm install
   cd server && npm install && cd ..
   npm run setup
   ```
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes** and test them
6. **Submit a pull request**

## 🔧 Development Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Emergency fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding tests

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

#### Examples:
```bash
feat(dashboard): add pregnancy progress visualization
fix(auth): resolve login redirect issue
docs(api): update endpoint documentation
style(components): improve button hover animations
refactor(vitals): optimize data fetching logic
test(auth): add unit tests for authentication service
chore(deps): update dependencies to latest versions
```

## 📋 Code Standards

### Frontend (React/Next.js)

#### Component Structure
```typescript
// ✅ Good - Proper component structure
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ComponentProps {
  title: string
  variant?: 'default' | 'secondary'
  className?: string
}

export function Component({ title, variant = 'default', className }: ComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      <h2>{title}</h2>
      <Button variant={variant}>Action</Button>
    </div>
  )
}

Component.displayName = 'Component'
```

#### TypeScript Guidelines
- Always use TypeScript, never `any` types
- Define proper interfaces for props and data
- Use generic types where appropriate
- Export types that might be reused

```typescript
// ✅ Good - Proper TypeScript usage
interface User {
  id: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
}

interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

function fetchUser(id: string): Promise<ApiResponse<User>> {
  // Implementation
}
```

#### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the design system colors and spacing
- Make components responsive by default
- Use CSS variables for theming

```typescript
// ✅ Good - Responsive and accessible
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
  gap-4 p-4 
  bg-background text-foreground
  focus-visible:outline-none focus-visible:ring-2
">
```

### Backend (Fastify/Node.js)

#### API Route Structure
```typescript
// ✅ Good - Proper route structure
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

interface CreateVitalRequest {
  type: string
  value: number
  unit: string
  notes?: string
}

export default async function vitalsRoutes(fastify: FastifyInstance) {
  const schema = {
    body: {
      type: 'object',
      required: ['type', 'value', 'unit'],
      properties: {
        type: { type: 'string' },
        value: { type: 'number' },
        unit: { type: 'string' },
        notes: { type: 'string', maxLength: 500 }
      }
    }
  }

  fastify.post('/', {
    preHandler: [fastify.authenticate],
    schema
  }, async (request: FastifyRequest<{
    Body: CreateVitalRequest
  }>, reply: FastifyReply) => {
    try {
      // Implementation
      return { success: true }
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({ error: 'Internal server error' })
    }
  })
}
```

#### Error Handling
```typescript
// ✅ Good - Proper error handling
try {
  const result = await risky Operation()
  return result
} catch (error) {
  if (error instanceof ValidationError) {
    reply.status(400).send({ error: error.message })
  } else if (error instanceof AuthenticationError) {
    reply.status(401).send({ error: 'Unauthorized' })
  } else {
    request.log.error(error)
    reply.status(500).send({ error: 'Internal server error' })
  }
}
```

### Database Guidelines

#### Supabase Queries
```typescript
// ✅ Good - Efficient and safe queries
const { data, error } = await supabase
  .from('vitals')
  .select(`
    id,
    type,
    value,
    unit,
    recorded_at,
    user_profiles!inner(
      full_name,
      role
    )
  `)
  .eq('user_id', userId)
  .gte('recorded_at', startDate.toISOString())
  .order('recorded_at', { ascending: false })
  .limit(50)

if (error) {
  throw new DatabaseError(`Failed to fetch vitals: ${error.message}`)
}
```

## 🧪 Testing Requirements

### Frontend Tests
Every component should have:
- Unit tests for core functionality
- Integration tests for user interactions
- Accessibility tests

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Backend Tests
Every API endpoint should have:
- Success case tests
- Error case tests
- Authentication/authorization tests

```typescript
// routes/__tests__/vitals.test.ts
describe('POST /api/vitals', () => {
  it('creates vital record for authenticated user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/vitals',
      headers: { authorization: 'Bearer valid-token' },
      payload: {
        type: 'blood_pressure',
        value: 120,
        unit: 'mmHg'
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({
      vital: expect.objectContaining({
        type: 'blood_pressure',
        value: 120
      })
    })
  })
})
```

## 📝 Documentation Requirements

### Code Documentation
- Document complex functions with JSDoc
- Add inline comments for business logic
- Update README files when adding features

```typescript
/**
 * Calculates pregnancy week based on last menstrual period
 * @param lmpDate - Last menstrual period date
 * @param currentDate - Current date (defaults to now)
 * @returns Pregnancy week as a number
 */
function calculatePregnancyWeek(lmpDate: Date, currentDate = new Date()): number {
  // Implementation with clear comments
}
```

### API Documentation
- Update OpenAPI/Swagger specs for new endpoints
- Include request/response examples
- Document error codes and messages

## 🚦 Pull Request Process

### Before Submitting
- [ ] Run tests: `npm test` (both frontend and backend)
- [ ] Run linting: `npm run lint`
- [ ] Run type checking: `npm run type-check`
- [ ] Test your changes manually
- [ ] Update documentation if needed
- [ ] Add tests for new functionality

### PR Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

### Review Process
1. **Automated Checks** - CI/CD pipeline runs tests and linting
2. **Code Review** - At least one team member reviews the code
3. **Testing** - QA team tests the changes if needed
4. **Approval** - Maintainer approves and merges

## 🐛 Bug Reports

When reporting bugs, please include:

- **Environment**: OS, browser, Node.js version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console errors**: Any error messages

Use this template:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12]
- Browser: [e.g. Chrome 96, Safari 15]
- Node.js version: [e.g. 18.17.0]

**Additional Context**
Add any other context about the problem here.
```

## 💡 Feature Requests

For feature requests, please include:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other ways to solve this
- **Additional context**: Screenshots, mockups, etc.

## 🎯 Areas We Need Help

### High Priority
- 🧪 **Testing Coverage** - Add more unit and integration tests
- ♿ **Accessibility** - Improve keyboard navigation and screen reader support
- 📱 **Mobile Experience** - Optimize for mobile devices
- 🌐 **Internationalization** - Add support for multiple languages

### Medium Priority
- 📊 **Data Visualization** - Create better charts and graphs
- 🔔 **Real-time Features** - Implement WebSocket connections
- 🎨 **UI Polish** - Improve animations and micro-interactions
- 📝 **Documentation** - Expand guides and API docs

### Backend Tasks
- 🚀 **Performance** - Optimize database queries
- 🔒 **Security** - Implement additional security measures
- 📈 **Monitoring** - Add application monitoring and alerting
- 🧩 **Integrations** - Connect with health APIs

## 🤔 Questions?

- **General Questions**: Create a discussion on GitHub
- **Bug Reports**: Open an issue with the bug template
- **Feature Requests**: Open an issue with the feature template
- **Security Issues**: Email security@mamamind.com (private disclosure)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md):

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

Thank you for contributing to Mama Mind! 🤱💕
