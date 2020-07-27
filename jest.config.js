module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation|react-navigation)',
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['mock.ts', 'web.js', 'web.ts', 'js', 'json', 'jsx', 'ts', 'tsx'],
};
