# Contributing to connectruas

Thank you for your interest in contributing to connectruas! We welcome contributions from the community and are excited to see how you can help improve our platform.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Style Guide](#style-guide)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to treat each other with respect and maintain a professional and inclusive environment.

## Getting Started

1. Fork the repository
2. Clone your forked repository
3. Install dependencies with `pnpm install`
4. Create a new branch for your feature or bug fix
5. Make your changes
6. Test your changes
7. Submit a pull request

## How to Contribute

### Reporting Bugs
- Check if the bug has already been reported
- If not, create a new issue with a clear title and description
- Include steps to reproduce the bug
- Include screenshots or code examples if relevant

### Suggesting Enhancements
- Create a new issue with a clear title and description
- Explain why the enhancement would be useful
- Provide examples or mockups if possible

### Code Contributions
1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes following our style guide
4. Write tests for your changes if applicable
5. Ensure all tests pass
6. Commit your changes with a clear commit message
7. Push your changes to your fork
8. Submit a pull request

## Development Process

### Prerequisites
- Node.js (version 18 or higher)
- pnpm package manager
- SQLite (for local development)

### Setting Up the Development Environment
1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables in `.env` file
4. Run database migrations with `npx prisma migrate dev`
5. Start the development server with `pnpm dev`

### Running Tests
- Run all tests with `pnpm test`
- Run specific tests with `pnpm test -- testName`

### Building the Project
- Build the project with `pnpm build`

## Style Guide

### Code Style
- Follow the existing code style in the project
- Use TypeScript for type safety
- Write clear, concise, and well-documented code
- Use meaningful variable and function names

### File Naming
- Use kebab-case for file names (e.g., `user-profile.tsx`)
- Use PascalCase for React component files (e.g., `UserProfile.tsx`)

### Component Structure
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript interfaces for props

### CSS and Styling
- Use Tailwind CSS classes for styling
- Follow the existing design system
- Use consistent spacing and typography

## Commit Messages

We follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(dashboard): add new statistics component
fix(api): resolve user authentication issue
docs(readme): update installation instructions
```

## Pull Request Process

1. Ensure your code follows our style guide
2. Write clear and descriptive pull request titles
3. Include a detailed description of your changes
4. Reference any related issues
5. Ensure all tests pass
6. Request review from maintainers
7. Address any feedback during the review process

### Pull Request Template
When creating a pull request, please include:

- A clear title summarizing the changes
- A detailed description of what changed and why
- References to any related issues
- Screenshots or GIFs if applicable
- Testing instructions

## Reporting Issues

### Before Creating an Issue
1. Check if the issue already exists
2. Try to reproduce the issue in the latest version
3. Check the documentation for relevant information

### Creating an Issue
When creating an issue, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or code examples if relevant
- Your environment (OS, browser, etc.)

## Community

If you have questions or need help, feel free to:

- Join our community discussions
- Reach out to the maintainers
- Participate in our community events

Thank you for contributing to connectruas!