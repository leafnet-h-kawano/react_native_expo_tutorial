import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'ホーム',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: '詳細画面',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'ユーザ詳細',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="api-sample"
        options={{
          title: 'API通信サンプル',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="advanced-api"
        options={{
          title: '高度なAPI通信',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="comprehensive-demo"
        options={{
          title: '包括的技術デモ',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="webview-home"
        options={{
          title: 'webview',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
    </Stack>
  );
}
