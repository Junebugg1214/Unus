module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'react-app/jest'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }], // Ignore unused React import warning
    'react/react-in-jsx-scope': 'off', // Not needed for React 17+ since JSX runtime handles it automatically
  },
  settings: {
    react: {
      version: 'detect', // Automatically detects the React version for linting purposes
    },
  },
};

  