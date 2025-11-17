export interface EnvConfig {
  NODE_ENV: string;
  APP_VARIANT: 'develop' | 'staging' | 'production';
  API_URL: string;
  APP_NAME: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_FLIPPER: string;
  BUNDLE_IDENTIFIER: string;
  ANDROID_PACKAGE: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {}
  }
}

export { };
