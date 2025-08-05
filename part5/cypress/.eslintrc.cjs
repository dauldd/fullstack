module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
    'cypress/globals': true,
    node: true
  },
  plugins: ['react', 'jest', 'cypress'],
  extends: ['eslint:recommended'],
  rules: {
    indent: ['error', 2],
    'comma-spacing': ['error', { before: false, after: true }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'padded-blocks': ['error', 'never'],
  },
};
