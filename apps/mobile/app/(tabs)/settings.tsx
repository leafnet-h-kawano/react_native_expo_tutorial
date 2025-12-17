import { getEnvironmentConfig } from '@core/src/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

interface SwitchItem {
  icon: string;
  title: string;
  subtitle: string;
  type: 'switch';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface ButtonItem {
  icon: string;
  title: string;
  subtitle: string;
  type: 'button';
  onPress: () => void;
}

type SettingItem = SwitchItem | ButtonItem;

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsTab() {
  const env = getEnvironmentConfig();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);

  const settingSections: SettingSection[] = [
    {
      title: '一般',
      items: [
        {
          icon: 'notifications-outline',
          title: 'プッシュ通知',
          subtitle: '新しい情報をお知らせします',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'moon-outline',
          title: 'ダークモード',
          subtitle: '暗いテーマを使用',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'download-outline',
          title: '自動更新',
          subtitle: 'アプリを自動的に更新',
          type: 'switch',
          value: autoUpdate,
          onValueChange: setAutoUpdate,
        },
      ],
    },
    {
      title: 'アカウント',
      items: [
        {
          icon: 'key-outline',
          title: 'パスワード変更',
          subtitle: 'セキュリティ設定',
          type: 'button',
          onPress: () => Alert.alert('パスワード変更', 'パスワード変更画面を開きます'),
        },
        {
          icon: 'shield-checkmark-outline',
          title: '二段階認証',
          subtitle: 'アカウントのセキュリティを強化',
          type: 'button',
          onPress: () => Alert.alert('二段階認証', '二段階認証設定画面を開きます'),
        },
      ],
    },
    {
      title: '開発者向け',
      items: [
        {
          icon: 'code-outline',
          title: '環境情報',
          subtitle: `現在: ${env.appVariant}`,
          type: 'button',
          onPress: () =>
            Alert.alert(
              '環境情報',
              `Environment: ${env.appVariant}\nAPI URL: ${env.apiUrl}\nLog Level: ${env.logLevel}\nBundle ID: ${env.bundleIdentifier}`,
            ),
        },
        {
          icon: 'bug-outline',
          title: 'デバッグログ',
          subtitle: 'ログレベル: ' + env.logLevel,
          type: 'button',
          onPress: () => Alert.alert('デバッグログ', 'ログ設定画面を開きます'),
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#666',
                marginBottom: 10,
                marginLeft: 20,
                textTransform: 'uppercase',
              }}
            >
              {section.title}
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                marginHorizontal: 20,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: '#f0f0f0',
                  }}
                  onPress={item.type === 'button' ? item.onPress : undefined}
                  activeOpacity={item.type === 'switch' ? 1 : 0.7}
                  disabled={item.type === 'switch'}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: '#f0f0f0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 15,
                    }}
                  >
                    <Ionicons name={item.icon as any} size={18} color="#007AFF" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: '#333',
                        marginBottom: 2,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#666',
                      }}
                    >
                      {item.subtitle}
                    </Text>
                  </View>

                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                      thumbColor={item.value ? 'white' : '#f4f3f4'}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* アプリ情報 */}
        <View style={{ padding: 20, marginTop: 30, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 14,
              color: '#999',
              marginBottom: 5,
            }}
          >
            {env.appName}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#ccc',
            }}
          >
            Version 1.0.0 ({env.appVariant})
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
