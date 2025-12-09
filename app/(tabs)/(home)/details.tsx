import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { getEnvironmentConfig } from '../../../utils/utils';

export default function DetailsScreen() {
  const env = getEnvironmentConfig();

  const getThemeColor = () => {
    switch (env.appVariant) {
      case 'develop': return '#28a745';
      case 'staging': return '#ffc107';
      case 'production': return '#007AFF';
      default: return '#007AFF';
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }} contentContainerStyle={{ padding: 20 }}>
      {/* 環境情報カード */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
          環境詳細情報
        </Text>
        
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>現在の環境</Text>
          <View style={{
            backgroundColor: getThemeColor(),
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            alignSelf: 'flex-start',
          }}>
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
              {env.appVariant.toUpperCase()}
            </Text>
          </View>
        </View>
        
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

      {/* 機能説明カード */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <Ionicons name="information-circle" size={24} color={getThemeColor()} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#333' }}>
            機能について
          </Text>
        </View>
        
        <Text style={{ fontSize: 16, color: '#666', lineHeight: 24 }}>
          この詳細画面は、ボトムナビゲーションを維持したまま遷移できることを示しています。
          画面下部のタブナビゲーションが常に表示され、他のタブに切り替えることができます。
        </Text>
      </View>
    </ScrollView>
  );
}