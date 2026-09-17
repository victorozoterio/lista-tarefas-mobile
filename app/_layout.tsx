import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen name="index" options={{ title: '🍕 Cardápio' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhe' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre' }} />
    </Stack>
  );
}
