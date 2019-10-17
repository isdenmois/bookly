module.exports = {
  extends: ['prettier', '@react-native-community'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'linebreak-style': 0,
    'jsx-quotes': ['error', 'prefer-single'],
    'react-hooks/exhaustive-deps': ['warn'],
    curly: 0,
  },
};
