# CLAUDE.md

This file provides guidance for AI assistants (Claude Code) working in this repository.

## Project Overview

This is the `murray0330/claudecode` repository. It is a new project under active development.

## Development Workflow

### Git Conventions

- Use descriptive commit messages that explain the "why" behind changes
- Branch names should follow the pattern: `feature/<description>`, `fix/<description>`, `refactor/<description>`
- Keep commits focused and atomic: one logical change per commit
- Write commit messages in imperative mood (e.g., "Add feature" not "Added feature")

### Code Quality

- Run linting and type-checking after making a series of code changes
- Write tests for new functionality before considering a task complete
- Prefer running individual relevant tests over the full test suite during development
- Fix all lint errors and type errors before committing

### Pull Requests

- PR titles should be concise (under 70 characters)
- Include a summary section with key changes as bullet points
- Include a test plan describing how changes were verified

## Code Style

- Prefer clear, readable code over clever one-liners
- Use descriptive variable and function names
- Keep functions focused on a single responsibility
- Add comments only where the logic is non-obvious; avoid restating what the code does

## Working in This Repository

### Before Making Changes

- Read existing code before proposing modifications
- Understand the existing patterns and conventions in the codebase
- Check for existing implementations before creating new abstractions

### When Implementing

- Follow existing patterns in the codebase for consistency
- Avoid over-engineering: only make changes that are directly requested or clearly necessary
- Do not add features, refactor code, or make improvements beyond what was asked
- Keep solutions simple and focused on the task at hand

### After Making Changes

- Verify changes compile and pass type-checking
- Run relevant tests and ensure they pass
- Review your own changes for security issues (injection, XSS, SQL injection, etc.)
