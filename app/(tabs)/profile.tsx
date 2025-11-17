import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useEnvironment } from '../../hooks/useEnvironment';

export default function ProfileTab() {
  const env = useEnvironment();

  const profileItems = [
    {
      icon: 'person-outline',
      title: 'アカウント情報',
      subtitle: 'プロフィール設定',
      onPress: () => Alert.alert('アカウント情報', 'プロフィール設定画面を開きます'),
    },
    {
      icon: 'notifications-outline',
      title: '通知設定',
      subtitle: 'プッシュ通知の管理',
      onPress: () => Alert.alert('通知設定', '通知設定画面を開きます'),
    },
    {
      icon: 'lock-closed-outline',
      title: 'プライバシー',
      subtitle: 'データとプライバシー',
      onPress: () => Alert.alert('プライバシー', 'プライバシー設定画面を開きます'),
    },
    {
      icon: 'help-circle-outline',
      title: 'ヘルプ & サポート',
      subtitle: 'よくある質問',
      onPress: () => Alert.alert('ヘルプ', 'ヘルプページを開きます'),
    },
    {
      icon: 'information-circle-outline',
      title: 'アプリについて',
      subtitle: `Version 1.0.0 (${env.appVariant})`,
      onPress: () => Alert.alert('アプリ情報', `アプリバージョン: 1.0.0\n環境: ${env.appVariant}\nBundle ID: ${env.bundleIdentifier}`),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* プロフィールヘッダー */}
        <View style={{
          backgroundColor: 'white',
          padding: 30,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#007AFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 5,
          }}>
            ユーザー名
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#666',
          }}>
            user@example.com
          </Text>
        </View>

        {/* プロフィール項目 */}
        <View style={{ padding: 20 }}>
          {profileItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 20,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 15,
              }}>
                <Ionicons name={item.icon as any} size={20} color="#007AFF" />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: 2,
                }}>
                  {item.title}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                }}>
                  {item.subtitle}
                </Text>
              </View>
              
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 環境情報 */}
        <View style={{ padding: 20 }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            borderLeftWidth: 4,
            borderLeftColor: env.appVariant === 'develop' ? '#28a745' : 
                           env.appVariant === 'staging' ? '#ffc107' : '#007bff',
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 10,
            }}>
              現在の環境
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#666',
              marginBottom: 5,
            }}>
              Environment: {env.appVariant}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
            }}>
              API: {env.apiUrl}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}