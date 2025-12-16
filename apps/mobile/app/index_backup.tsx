import {
    getEnvironmentConfig,
    isDevelopment,
    isProduction,
    isStaging,
    utils
} from '@core/src/utils/utils';
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  console.log(process.env.APP_VARIANT);
  
  // 環境設定を取得
  const env = getEnvironmentConfig();
  const isDev = isDevelopment();
  const isStag = isStaging();
  const isProd = isProduction();
  
  // 環境に応じたデバッグログ
  utils.debugLog('App started', { environment: env.appVariant });
  
  // 環境別の背景色
  const getBackgroundColor = () => {
    if (isDev) return '#e8f5e8'; // 薄い緑
    if (isStag) return '#fff3cd'; // 薄い黄色
    if (isProd) return '#f8f9fa'; // 薄いグレー
    return '#ffffff';
  };
  
  const getEnvironmentBadgeColor = () => {
    if (isDev) return '#28a745'; // 緑
    if (isStag) return '#ffc107'; // 黄色
    if (isProd) return '#007bff'; // 青
    return '#6c757d';
  };
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: getBackgroundColor(),
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {env.appName}
      </Text>
      
      <View
        style={{
          backgroundColor: getEnvironmentBadgeColor(),
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          {env.appVariant.toUpperCase()}
        </Text>
      </View>
      
      <View style={{ alignItems: 'flex-start', width: '100%', maxWidth: 300 }}>
        <Text style={{ marginBottom: 10, fontSize: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>API URL:</Text> {env.apiUrl}
        </Text>
        
        <Text style={{ marginBottom: 10, fontSize: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>Log Level:</Text> {env.logLevel}
        </Text>
        
        <Text style={{ marginBottom: 10, fontSize: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>Flipper:</Text> {env.enableFlipper ? 'Enabled' : 'Disabled'}
        </Text>
        
        <Text style={{ marginBottom: 10, fontSize: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>Bundle ID:</Text> {env.bundleIdentifier}
        </Text>
      </View>
      
      <Text style={{ marginTop: 30, fontSize: 12, color: 'gray', textAlign: 'center' }}>
        Environment variables are loaded from .env.{env.appVariant} file
      </Text>
      
      <Text style={{ marginTop: 10, fontSize: 12, color: 'gray' }}>
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href="/test1">About</Link>
    </View>
  );
}
