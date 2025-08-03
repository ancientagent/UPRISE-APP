module.exports = {
    root: true,
    extends: '@react-native-community',
    parser: '@babel/eslint-parser',
    plugins: [
      'jest',
      'babel',
      'detox',
      'jsx-max-len',
      'unicorn'
    ],
    rules: {
      // We can add specific rules here later if needed
    },
    ignorePatterns: [
      'node_modules/',
      'Webapp_API-Develop/',
      'webapp-ui/',
      'legacy-angular-app/',
      'android/',
      'ios/',
      'coverage/',
      '*.config.js',
      '*.bat',
      '*.ps1',
      '*.md',
    ],
  };