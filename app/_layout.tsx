import { Stack } from "expo-router";
import { QueryProvider } from '../providers/QueryProvider';
import { ErrorModal } from './components/ErrorModal';

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }}
        />
      </Stack>
      
      {/* グローバルエラーモーダル */}
      <ErrorModal />
    </QueryProvider>
  );
}
