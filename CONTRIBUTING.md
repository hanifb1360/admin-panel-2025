# Contributing to Modern Admin Panel & Dashboard

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Add tests if applicable
5. Ensure the test suite passes
6. Make sure your code lints
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setting up the development environment

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:5173 in your browser

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utility functions and services
├── types/         # TypeScript type definitions
├── hooks/         # Custom React hooks
└── assets/        # Static assets
```

## Style Guide

### TypeScript

- Use TypeScript for all new files
- Define proper types for all props and state
- Use interface over type when possible
- Avoid `any` type

### React

- Use functional components with hooks
- Use proper prop destructuring
- Implement proper error boundaries
- Use React.memo for performance optimization when needed

### Tailwind CSS

- Use Tailwind utility classes
- Follow the existing design system
- Use custom classes in `@layer components` for reusable styles
- Ensure responsive design

### Code Style

- Use meaningful variable and function names
- Write clear, concise comments
- Follow the existing code formatting
- Use ESLint rules provided

## Testing

- Write unit tests for new components
- Test responsive design
- Test accessibility features
- Ensure cross-browser compatibility

## Documentation

- Update README.md if needed
- Add JSDoc comments for complex functions
- Update CHANGELOG.md for notable changes

## Commit Messages

Use conventional commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example: `feat: add user profile management component`

## Branch Naming

- `feature/description` for new features
- `bugfix/description` for bug fixes
- `hotfix/description` for urgent fixes
- `docs/description` for documentation

## Review Process

1. All submissions require review before merging
2. Maintainers will review PRs and provide feedback
3. Address any requested changes
4. Once approved, the PR will be merged

## Questions?

Feel free to reach out by creating an issue or contacting the maintainers directly.

Thank you for contributing! 🚀
