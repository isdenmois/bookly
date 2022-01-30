module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@react-native|react-native|@react-native-community|@react-navigation|react-navigation|react-native-dynamic|nanostores|@nanostores)/).*/',
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['mock.ts', 'web.js', 'web.ts', 'js', 'json', 'jsx', 'ts', 'tsx'],
  setupFiles: ['<rootDir>/tests/setup.js'],
};
