import Constants from 'expo-constants';

// =============================================================================
// 環境設定
// =============================================================================

///NOTE: React Nativeからの呼び出しを想定しているため、Next.jsで使用するには対応が必要になる

export interface EnvConfig {
  appVariant: 'develop' | 'staging' | 'production';
  apiUrl: string;
  logLevel: string;
  enableFlipper: boolean;
  appName: string;
  bundleIdentifier?: string;
}

/**
 * 環境設定を取得
 */
export const getEnvironmentConfig = (): EnvConfig => {
  const config = Constants.expoConfig?.extra;
  return {
    appVariant: config?.appVariant || 'develop',
    apiUrl: config?.apiUrl || 'https://develop-api.yourapp.com',
    logLevel: config?.logLevel || 'debug',
    enableFlipper: config?.enableFlipper || false,
    appName: Constants.expoConfig?.name || 'React Native Expo Tutorial',
    bundleIdentifier: Constants.expoConfig?.ios?.bundleIdentifier,
  };
};

/**
 * 開発環境かどうかを判定
 */
export const isDevelopment = (): boolean => {
  const { appVariant } = getEnvironmentConfig();
  return appVariant === 'develop';
};

/**
 * ステージング環境かどうかを判定
 */
export const isStaging = (): boolean => {
  const { appVariant } = getEnvironmentConfig();
  return appVariant === 'staging';
};

/**
 * 本番環境かどうかを判定
 */
export const isProduction = (): boolean => {
  const { appVariant } = getEnvironmentConfig();
  return appVariant === 'production';
};

// =============================================================================
// ユーティリティ
// =============================================================================

/**
 * ユーティリティ
 */
export const utils = {
  /**
   * デバッグログを環境に応じて出力
   */
  debugLog: (message: string, ...args: any[]): void => {
    const { logLevel } = getEnvironmentConfig();

    if (logLevel === 'debug' || isDevelopment()) {
      console.log(`[${new Date().toISOString()}] ${message}`, ...args);
    }
  },
} as const;

export default utils;
