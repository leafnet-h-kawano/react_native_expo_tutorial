import { Text, View } from 'react-native';

import { Link } from 'expo-router';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        1 Welcome to React Native Expo Tutorial!
      </Text>
      <Link href="/">Go back to home</Link>
    </View>
  );
}
