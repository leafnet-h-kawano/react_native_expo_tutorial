import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { getEnvironmentConfig } from '../../../utils/utils';

export default function ProfileScreen() {
  const env = getEnvironmentConfig();

  const getThemeColor = () => {
    switch (env.appVariant) {
      case 'develop': return '#28a745';
      case 'staging': return '#ffc107';
      case 'production': return '#007AFF';
      default: return '#007AFF';
    }
  };

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Developer',
    joinDate: '2023-01-15',
    projects: 12,
    commits: 1247,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }} contentContainerStyle={{ padding: 20 }}>
      {/* プロフィールカード */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 30,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: getThemeColor(),
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
          {userInfo.name}
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: '#666',
          marginBottom: 10,
        }}>
          {userInfo.email}
        </Text>

        <View style={{
          backgroundColor: getThemeColor(),
          paddingHorizontal: 15,
          paddingVertical: 5,
          borderRadius: 15,
        }}>
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '500',
          }}>
            {userInfo.role}
          </Text>
        </View>
      </View>

      {/* 統計情報 */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 15,
        }}>
          統計情報
        </Text>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: getThemeColor(),
            }}>
              {userInfo.projects}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
            }}>
              プロジェクト
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: getThemeColor(),
            }}>
              {userInfo.commits}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
            }}>
              コミット
            </Text>
          </View>
        </View>
      </View>

      {/* 詳細情報 */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 15,
        }}>
          詳細情報
        </Text>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>参加日</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>{userInfo.joinDate}</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>環境</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>{env.appVariant}</Text>
        </View>

        <View>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>アプリバージョン</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}