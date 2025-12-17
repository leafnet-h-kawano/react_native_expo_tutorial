const path = require('path');
const fs = require('fs');

/**
 * Parse .env file content manually
 * @param {string} content - The content of the .env file
 * @returns {object} Parsed environment variables
 */
function parseEnvFile(content) {
  const envVars = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        // Remove quotes if present
        envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return envVars;
}

/**
 * Load environment variables from .env files based on APP_VARIANT
 * @param {string} variant - The app variant (develop, staging, production)
 * @returns {object} Environment variables object
 */
function loadEnvironmentConfig(variant = 'develop') {
  console.log('__dirname');
  console.log(__dirname);
  const envFile = `.env.${variant}`;
  // Prefer repository root (three levels up from apps/mobile/config), but also
  // try process.cwd() and __dirname as fallbacks to be robust across invocations.
  const possibleRoots = [path.resolve(__dirname, '../../..'), process.cwd(), __dirname];

  let envPath = null;
  for (const root of possibleRoots) {
    const candidate = path.resolve(root, envFile);
    if (fs.existsSync(candidate)) {
      envPath = candidate;
      break;
    }
  }

  // If not found, default to the first candidate (repo root) for logging/fallback
  if (!envPath) {
    envPath = path.resolve(__dirname, '../../..', envFile);
  }

  console.log(`Looking for env file at: ${envPath}`);

  let envVars = {};

  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      envVars = parseEnvFile(content);
      console.log('Successfully loaded .env file:', envFile);
      console.log('Environment variables:', envVars);
    } else {
      console.warn(`Environment file not found: ${envPath}`);
      // Try fallback to .env.develop
      const fallbackPath = path.resolve(__dirname, '../../..', '.env.develop');
      if (fs.existsSync(fallbackPath)) {
        const content = fs.readFileSync(fallbackPath, 'utf8');
        envVars = parseEnvFile(content);
        console.log('Using fallback .env.develop file');
      }
    }

    // Merge with process.env, giving priority to loaded file
    Object.keys(envVars).forEach((key) => {
      process.env[key] = envVars[key];
    });

    // Return the configuration object
    return {
      NODE_ENV: envVars.NODE_ENV || process.env.NODE_ENV || 'development',
      APP_VARIANT: envVars.APP_VARIANT || process.env.APP_VARIANT || variant,
      API_URL: envVars.API_URL || process.env.API_URL || 'https://develop-api.yourapp.com',
      APP_NAME: envVars.APP_NAME || process.env.APP_NAME || 'React Native Expo Tutorial (Dev)',
      LOG_LEVEL: envVars.LOG_LEVEL || process.env.LOG_LEVEL || 'debug',
      ENABLE_FLIPPER: envVars.ENABLE_FLIPPER || process.env.ENABLE_FLIPPER || 'true',
      BUNDLE_IDENTIFIER:
        envVars.BUNDLE_IDENTIFIER ||
        process.env.BUNDLE_IDENTIFIER ||
        'jp.leafnet.reactNativeExpoTurtorial.develop',
      ANDROID_PACKAGE:
        envVars.ANDROID_PACKAGE ||
        process.env.ANDROID_PACKAGE ||
        'jp.leafnet.reactNativeExpoTurtorial.develop',
    };
  } catch (error) {
    console.error(`Error loading environment config for ${variant}:`, error);
    // Return default config
    return {
      NODE_ENV: 'development',
      APP_VARIANT: variant,
      API_URL: 'https://develop-api.yourapp.com',
      APP_NAME: 'React Native Expo Tutorial (Dev)',
      LOG_LEVEL: 'debug',
      ENABLE_FLIPPER: 'true',
      BUNDLE_IDENTIFIER: 'jp.leafnet.reactNativeExpoTurtorial.develop',
      ANDROID_PACKAGE: 'jp.leafnet.reactNativeExpoTurtorial.develop',
    };
  }
}

module.exports = { loadEnvironmentConfig };

module.exports = { loadEnvironmentConfig };
