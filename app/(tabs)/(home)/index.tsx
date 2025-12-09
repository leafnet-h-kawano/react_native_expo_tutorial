import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  getEnvironmentConfig,
  isDevelopment,
  isProduction,
  isStaging,
  utils
} from '../../../utils/utils';

export default function HomeTab() {
  console.log(process.env.APP_VARIANT);
  
  // 環境設定を取得
  const env = getEnvironmentConfig();
  const isDev = isDevelopment();
  const isStag = isStaging();
  const isProd = isProduction();
  
  // 環境に応じたデバッグログ
  utils.debugLog('Home tab loaded', { environment: env.appVariant });
  
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

  const getThemeColor = () => {
    if (isDev) return '#28a745'; // 緑
    if (isStag) return '#ffc107'; // 黄色
    if (isProd) return '#007AFF'; // 青
    return '#007AFF';
  };
  
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: getBackgroundColor(),
      }}
      contentContainerStyle={{
        padding: 20,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        {env.appName}
      </Text>
      
      <View
        style={{
          backgroundColor: getEnvironmentBadgeColor(),
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 20,
          marginBottom: 30,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          {env.appVariant.toUpperCase()}
        </Text>
      </View>

      <View style={{ 
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
          環境情報
        </Text>
        
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>API URL</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>{env.apiUrl}</Text>
        </View>
        
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Log Level</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>{env.logLevel}</Text>
        </View>
        
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Flipper</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>
            {env.enableFlipper ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        
        <View>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Bundle ID</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>{env.bundleIdentifier}</Text>
        </View>
      </View>

      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
          ようこそ！
        </Text>
        <Text style={{ fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 }}>
          このアプリは環境別設定に対応しています。現在は{env.appVariant}環境で動作しています。
        </Text>
        
        {/* ナビゲーションボタン */}
        <View style={{ gap: 10 }}>
          <Link href="/details" asChild>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="information-circle-outline" size={20} color={getThemeColor()} />
              <Text style={{ 
                marginLeft: 10, 
                fontSize: 16, 
                color: '#333',
                fontWeight: '500' 
              }}>
                詳細画面へ
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#999" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </Link>

          <Link href="/profile" asChild>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={20} color={getThemeColor()} />
              <Text style={{ 
                marginLeft: 10, 
                fontSize: 16, 
                color: '#333',
                fontWeight: '500' 
              }}>
                ユーザー詳細
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#999" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </Link>

          <Link href="/api-sample" asChild>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="cloud-outline" size={20} color={getThemeColor()} />
              <Text style={{ 
                marginLeft: 10, 
                fontSize: 16, 
                color: '#333',
                fontWeight: '500' 
              }}>
                API通信サンプル
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#999" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </Link>

          {/* <Link href="/advanced-api" asChild>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="rocket-outline" size={20} color={getThemeColor()} />
              <Text style={{ 
                marginLeft: 10, 
                fontSize: 16, 
                color: '#333',
                fontWeight: '500' 
              }}>
                高度なAPI通信
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#999" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </Link> */}

          <Link href="/comprehensive-demo" asChild>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f0f9ff',
                paddingVertical: 15,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#007AFF',
                marginTop: 10,
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="rocket-outline" size={24} color="#007AFF" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ 
                  fontSize: 18, 
                  color: '#007AFF',
                  fontWeight: 'bold' 
                }}>
                  包括的技術デモ
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  color: '#0066cc',
                  marginTop: 2,
                }}>
                  Axios + Zod + ts-to-zod + Jest + Zustand
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#007AFF" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      
      <Text style={{ marginTop: 30, fontSize: 12, color: 'gray', textAlign: 'center' }}>
        Environment variables are loaded from .env.{env.appVariant} file
      </Text>
    </ScrollView>
  );
}