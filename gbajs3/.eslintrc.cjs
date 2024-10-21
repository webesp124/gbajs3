module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:styled-components-a11y/recommended',
    'plugin:jest-dom/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: [
    'react-refresh',
    'import',
    'jsx-a11y',
    'styled-components-a11y',
    'testing-library',
    'jest-dom'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    'react-refresh/only-export-components': 'warn',
    'import/no-default-export': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in imports (come from NodeJS native) go first
          'external', // <- External imports
          'internal', // <- Absolute imports
          ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
          'index', // <- index imports
          'object', // <- object imports
          'type', // <- type imports
          'unknown' // <- unknown
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'testing-library/consistent-data-testid': [
      'error',
      { testIdPattern: '^([a-z0-9]+-?:?)+$' }
    ]
  },
  overrides: [
    {
      // some plugins should only be enabled for test files
      files: ['**/test/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react']
    }
  ]
};
