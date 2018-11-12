module.exports = {
  cache: false,
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  preset: 'jest-expo',
  transformIgnorePatterns: [
      'node_modules/(?!((jest-)?react-native|react-clone-referenced-element|expo(nent)?|@expo(nent)?/.*|react-navigation|sentry-expo|native-base))'
  ],
  testMatch: ['**/*.test.ts?(x)'],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'ios.ts',
    'ios.tsx',
    'android.ts',
    'android.tsx'
  ],
  setupTestFrameworkScriptFile: '<rootDir>/test/setup.js'
}
