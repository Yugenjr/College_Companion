# Contributing to College Companion

Thank you for your interest in contributing to College Companion! We welcome contributions from the community. This document provides guidelines and instructions to help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Local Development Setup](#local-development-setup)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We do not tolerate harassment or discrimination in any form.

## Getting Started

### Prerequisites

Before you start contributing, ensure you have:

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase Account** (for backend development)
- A code editor (VS Code recommended)

### Forking and Cloning

1. **Fork the repository** on GitHub
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/College_Companion.git
   cd College_Companion
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_REPO/College_Companion.git
   ```

## Local Development Setup

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` (if available)
   - Add your Firebase credentials
   - Required variables:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Frontend will be available at `http://localhost:5173`

4. **Run linting:**
   ```bash
   npm run lint
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add Firebase Admin SDK credentials
   - Required variables:
     ```
     PORT=5000
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_PRIVATE_KEY=your_private_key
     FIREBASE_CLIENT_EMAIL=your_client_email
     GEMINI_API_KEY=your_gemini_api_key
     ```

4. **Start backend server:**
   ```bash
   npm start
   ```
   - Backend will run on `http://localhost:5000`

### Question Generator Backend

```bash
cd backend-question-generator
npm install
npm start
```

### All Services at Once

```bash
./start-all.ps1  # Windows PowerShell
```

## Branch Naming Conventions

Use clear, descriptive branch names that follow this format:

### Pattern

```
<type>/<feature-or-issue-name>
```

### Types

- **feature/** - New features
  ```
  feature/attendance-tracking
  feature/study-arena-chat
  ```

- **fix/** - Bug fixes
  ```
  fix/firebase-auth-error
  fix/attendance-calculation
  ```

- **refactor/** - Code refactoring (no feature changes)
  ```
  refactor/user-service
  refactor/component-structure
  ```

- **docs/** - Documentation updates
  ```
  docs/setup-guide
  docs/api-endpoints
  ```

- **test/** - Test additions or improvements
  ```
  test/attendance-api
  test/profile-module
  ```

- **chore/** - Maintenance tasks, dependencies
  ```
  chore/update-dependencies
  chore/setup-ci
  ```

### Examples

✅ Good branch names:
- `feature/real-time-notifications`
- `fix/profile-loading-bug`
- `docs/contributing-guide`

❌ Bad branch names:
- `update-stuff`
- `fix-bug`
- `newfeature`

## Making Changes

### 1. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Keep commits small and focused
- Test your changes thoroughly
- Update tests if modifying existing functionality

### 3. Sync with Upstream

Before submitting your PR:

```bash
git fetch upstream
git rebase upstream/main
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### General Guidelines

- **Language**: TypeScript for all frontend code
- **Formatter**: Follow ESLint configuration
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Comments**: Write clear, meaningful comments
- **DRY Principle**: Don't repeat yourself

### Frontend (React + TypeScript)

#### File Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── contexts/           # React Context
├── hooks/              # Custom hooks
├── services/           # API calls
└── types/              # TypeScript types
```

#### Component Guidelines

```typescript
// ✅ Good
interface UserProfileProps {
  userId: string;
  userName: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  userName,
  onUpdate,
}) => {
  // Component logic
  return <div>{userName}</div>;
};

export default UserProfile;
```

#### TypeScript Usage

- Always define interfaces/types for props
- Use strict typing (avoid `any`)
- Define return types for functions

```typescript
// ✅ Good
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  // Implementation
}

// ❌ Avoid
async function fetchUser(id: any): Promise<any> {
  // Implementation
}
```

### Backend (Node.js + Express)

#### File Structure

```
backend/
├── controllers/        # Route handlers
├── routes/            # API routes
├── models/            # Database models
├── services/          # Business logic
├── middleware/        # Express middleware
└── utils/             # Helper functions
```

#### Code Style

```javascript
// ✅ Good - Clear, consistent naming
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// ❌ Avoid
const getUser = async (u) => {
  return User.findById(u);
};
```

### Linting and Formatting

Run linting before committing:

```bash
# Frontend
npm run lint

# Backend
cd backend && npm run lint
```

Fix linting issues automatically:

```bash
npm run lint -- --fix
```

## Pull Request Process

### 1. Create a Pull Request

- Use a descriptive title
- Reference related issues (e.g., `Fixes #123`)
- Fill out the PR template

### 2. PR Title Format

```
[Type] Brief description
```

Examples:
- `[Feature] Add real-time attendance tracking`
- `[Fix] Resolve Firebase authentication error`
- `[Docs] Update setup guide`

### 3. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123
Relates to #124

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Tests added/updated
- [ ] No breaking changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### 4. Review Process

- At least one approval required
- All GitHub checks must pass
- Maintainers reserve the right to request changes
- Be responsive to feedback

### 5. Merging

- Squash and merge preferred for cleaner history
- Delete branch after merging
- Update related documentation

## Commit Message Guidelines

Follow this format for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Scope

The area of the codebase affected (optional):

```
feat(auth): add two-factor authentication
fix(attendance): correct calculation logic
docs(readme): update installation steps
```

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

### Body

- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer

Reference issues and breaking changes:

```
Fixes #123
Relates to #124
BREAKING CHANGE: description
```

### Examples

✅ Good commit messages:

```
feat(profile): add profile picture upload

Users can now upload a profile picture during registration.
This improves user identification and engagement.

Fixes #45
```

```
fix(attendance): correct daily attendance calculation

The previous logic was counting half-days as full days.
Updated calculation to properly weight partial attendance.

Relates to #67
```

## Questions or Need Help?

- **Documentation**: Check the [docs](./README.md) folder
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers directly

## Recognition

Contributors will be acknowledged in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

Thank you for contributing to College Companion! 🎓
