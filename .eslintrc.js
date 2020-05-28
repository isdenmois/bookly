module.exports = {
  extends: ['prettier', '@react-native-community'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'linebreak-style': 0,
    'jsx-quotes': ['error', 'prefer-single'],
    'react-hooks/exhaustive-deps': ['warn'],
    curly: 0,
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
