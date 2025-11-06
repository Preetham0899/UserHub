/** @type {import('jest').Config} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.e2e.js'],
  testTimeout: 120000,
  testEnvironment: 'node', //  must be 'node', not Detox path
  setupFilesAfterEnv: ['./e2e/init.js'],
  verbose: true,
};
