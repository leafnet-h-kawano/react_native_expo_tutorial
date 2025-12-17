// // Environment configuration
// type AppVariant = 'develop' | 'staging' | 'production';

// export const getEnvironmentVars = () => {
//   const appVariant = (process.env.APP_VARIANT as AppVariant) || 'production';

//   const environments: Record<AppVariant, {
//     API_URL: string;
//     APP_NAME: string;
//     LOG_LEVEL: string;
//     ENABLE_FLIPPER: boolean;
//   }> = {
//     develop: {
//       API_URL: 'https://develop-api.yourapp.com',
//       APP_NAME: 'React Native Expo Tutorial (Dev)',
//       LOG_LEVEL: 'debug',
//       ENABLE_FLIPPER: true,
//     },
//     staging: {
//       API_URL: 'https://staging-api.yourapp.com',
//       APP_NAME: 'React Native Expo Tutorial (Staging)',
//       LOG_LEVEL: 'info',
//       ENABLE_FLIPPER: false,
//     },
//     production: {
//       API_URL: 'https://api.yourapp.com',
//       APP_NAME: 'React Native Expo Tutorial',
//       LOG_LEVEL: 'error',
//       ENABLE_FLIPPER: false,
//     },
//   };

//   return environments[appVariant] || environments.production;
// };

// export default getEnvironmentVars();
