module.exports = {
  extends: ['prettier'],
  parser: 'babel-eslint',
  env: {
    jest: true,
  },
  rules: {
  },
  globals: {
    fetch: true,
    document: true,
    __DEV__: true,
    localStorage: true,
  },
};
