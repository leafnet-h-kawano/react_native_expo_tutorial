import Constants from 'expo-constants';
import { useMemo } from 'react';

export interface EnvConfig {
  appVariant: 'develop' | 'staging' | 'production';
  apiUrl: string;
  logLevel: string;
  enableFlipper: boolean;
  appName: string;
  bundleIdentifier?: string;
}

/**
 * 環境変数を取得するカスタムフック（React Hook）
 */
export const useEnvironment = (): EnvConfig => {
  const config = useMemo(() => {
    return Constants.expoConfig?.extra;
  }, []);
  
  return useMemo(() => ({
    appVariant: config?.appVariant || 'develop',
    apiUrl: config?.apiUrl || 'https://develop-api.yourapp.com',
    logLevel: config?.logLevel || 'debug',
    enableFlipper: config?.enableFlipper || false,
    appName: Constants.expoConfig?.name || 'React Native Expo Tutorial',
    bundleIdentifier: Constants.expoConfig?.ios?.bundleIdentifier,
  }), [config]);
};

/**
 * 開発環境かどうかを判定するフック
 */
export const useIsDevelopment = (): boolean => {
  const { appVariant } = useEnvironment();
  return useMemo(() => appVariant === 'develop', [appVariant]);
};

/**
 * ステージング環境かどうかを判定するフック
 */
export const useIsStaging = (): boolean => {
  const { appVariant } = useEnvironment();
  return useMemo(() => appVariant === 'staging', [appVariant]);
};

/**
 * 本番環境かどうかを判定するフック
 */
export const useIsProduction = (): boolean => {
  const { appVariant } = useEnvironment();
  return useMemo(() => appVariant === 'production', [appVariant]);
};

// 非Hook版の関数も提供（React外での使用用）
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

export const isDevelopment = (): boolean => {
  const { appVariant } = getEnvironmentConfig();
  return appVariant === 'develop';
};

export const isStaging = (): boolean => {
  const { appVariant } = getEnvironmentConfig();
  return appVariant === 'staging';
};

export const isProduction = (): boolean => {
  const { appVariant } = getEnvironmentConfig();
  return appVariant === 'production';
};

/**
 * デバッグログを環境に応じて出力
 */
export const debugLog = (message: string, ...args: any[]): void => {
  const { logLevel } = getEnvironmentConfig();
  
  if (logLevel === 'debug' || isDevelopment()) {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args);
  }
};