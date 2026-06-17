/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/codigo', '<rootDir>/testes'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
};
