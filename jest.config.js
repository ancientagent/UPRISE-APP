
const transformPackageNames = [
  'native-base-shoutem-theme',
  '@react-native',
  'react-native',
  'react-native-easy-grid',
  'react-native-drawer',
  '@react-native-community',
  'react-native-vector-icons',
  'react-native-keyboard-aware-scroll-view',
  '@codler',
  'react-native-iphone-x-helper',
  '@react-native-picker',
];

module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    `node_modules/(?!(${transformPackageNames.join('|')})/)`,
    // './node_modules/(react-clone-referenced-element|@react-native-community|react-navigation|@react-navigation/.*|@unimodules/.*|native-base|react-native-code-push)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/screens/*',
    '!src/**/*.test.js',
  ],
  coveragePathIgnorePatterns: [
    'src/actions/*',
    'src/assets/*',
    'src/reducers/*',
    'src/services/*',
    'src/styles/*',
    'src/utilities/*',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
  ],
  transform: {
    '^.+\\.(js)$': './node_modules/babel-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: [
    '\\.snap$',
    './node_modules/',
    './lib/',
  ],
  globals: {
    __TESTING__: true,
  },
  setupFiles: [
    './src/setupTests.js',
  ],
};
