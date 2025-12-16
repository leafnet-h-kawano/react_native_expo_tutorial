module.exports = {
  expoConfig: {
    name: 'Test App',
    extra: {
      appVariant: 'develop',
      apiUrl: 'http://localhost',
      logLevel: 'debug',
      enableFlipper: false,
    },
    ios: {
      bundleIdentifier: 'test.bundle.id',
    },
  },
};
