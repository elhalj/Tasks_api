import globals from 'globals';
import js from '@eslint/js';

const config = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-undef': 'error',
      'no-dupe-else-if': 'error',
      'no-import-assign': 'error',
      'no-setter-return': 'error',
      'no-useless-catch': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'require-await': 'warn',
      'semi': ['error', 'always']
    },
    ignores: [
      '**/node_modules/**',
      '**/.git/**',
      '**/coverage/**',
      '**/dist/**'
    ]
  }
];

export default config;
