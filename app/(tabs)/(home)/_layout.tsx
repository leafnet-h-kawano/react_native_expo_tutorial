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
    </Stack>
  );
}