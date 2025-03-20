# Rill Project Tests

This directory contains unit tests for the Rill project, focusing on non-UI business logic, utilities, and server-side code.

## Test Structure

- `unit/lib/` - Tests for utility functions
- `unit/providers/` - Tests for WebSocket and data synchronization
- `unit/server/` - Tests for server-side functionality

## Running Tests

Tests are set up to run with Bun's built-in test runner. To run all tests:

```bash
bun test
```

To run a specific test file:

```bash
bun test tests/unit/lib/utils.test.ts
```

To run tests with a specific pattern:

```bash
bun test --pattern "WebSocket"
```

To run tests with coverage:

```bash
bun test --coverage
```

## Writing New Tests

When writing new tests:

1. Place tests in the appropriate subdirectory
2. Name test files with either `.test.ts` or `_test.ts` suffix
3. Use Bun's test utilities: `import { test, expect, describe } from "bun:test"`
4. Focus on testing business logic and utilities rather than UI components

## Test Approach

These tests focus on:

1. **Unit Testing** - Testing individual functions and classes in isolation
2. **Integration Testing** - Testing how components work together, especially WebSocket and Y.js functionality
3. **Testing Core Logic** - Ensuring business logic behaves as expected without UI dependencies

UI component testing would require additional setup with a React testing library like `@testing-library/react`.

## Bun Testing Tips

- Use `mock()` or `spyOn()` to create mocks and spies
- Use `beforeAll()`, `afterAll()`, `beforeEach()`, and `afterEach()` for setup/teardown
- Use `describe()` to group related tests
- Use `test()` or `it()` to define individual test cases
- Use `expect()` for assertions 
