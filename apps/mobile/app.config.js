const { loadEnvironmentConfig } = require('../../config/environment');

// Load environment config based on APP_VARIANT
const appVariant = process.env.APP_VARIANT || 'develop';
console.log('APP_VARIANT from process.env:', appVariant);

const envConfig = loadEnvironmentConfig(appVariant);
console.log('Final envConfig:', envConfig);

const IS_DEV = envConfig.APP_VARIANT === 'develop';
const IS_STAGING = envConfig.APP_VARIANT === 'staging';
export default {
  expo: {
    name: envConfig.APP_NAME,
    slug: 'react_native_expo_tutorial',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'reactnativeexpotutorial',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: envConfig.BUNDLE_IDENTIFIER,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: envConfig.ANDROID_PACKAGE,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'ccb90c0e-b5cf-4ac7-a57d-2e3772b99e41',
      },
      appVariant: envConfig.APP_VARIANT,
      apiUrl: envConfig.API_URL,
      logLevel: envConfig.LOG_LEVEL,
      enableFlipper: envConfig.ENABLE_FLIPPER === 'true',
    },
  },
};
