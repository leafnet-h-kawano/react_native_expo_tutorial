import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useEnvironment } from '../../hooks/useEnvironment';

export default function TabLayout() {
  const env = useEnvironment();
  
  // 環境に応じた色設定
  const getThemeColor = () => {
    switch (env.appVariant) {
      case 'develop': return '#28a745';
      case 'staging': return '#ffc107';
      case 'production': return '#007AFF';
      default: return '#007AFF';
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: getThemeColor(),
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 90,
            paddingBottom: 10,
            paddingTop: 10,
          },
          android: {
            backgroundColor: 'white',
            elevation: 8,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: {
              height: -2,
              width: 0,
            },
            height: 70,
            paddingBottom: 10,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'ホーム',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '探索',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'search' : 'search-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'プロフィール',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}