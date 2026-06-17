/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/codigo', '<rootDir>/testes'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'codigo/**/*.ts',
    '!codigo/principal.ts',
    '!codigo/apresentacao/http/servidor.ts',
  ],
  clearMocks: true,
};
