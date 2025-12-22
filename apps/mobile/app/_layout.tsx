import { QueryProvider } from '@core/src/providers/QueryProvider';
import { Stack } from 'expo-router';
import { ErrorModal } from '../components/ErrorModal';

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Home" }} />
      </Stack>

      {/* グローバルエラーモーダル */}
      <ErrorModal />
    </QueryProvider>
  );
}
