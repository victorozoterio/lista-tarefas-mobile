import '../global.css';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuthContext } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthScreen = segments[0] === 'login' || segments[0] === 'register';

    if (!user && !inAuthScreen) {
      router.replace('/login');
    } else if (user && inAuthScreen) {
      router.replace('/');
    }
  }, [loading, router, segments, user]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-gray-600">Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#f9fafb' },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
      <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
      <Stack.Screen name="profile" options={{ title: '👤 Meu Perfil' }} />
    </Stack>
  );
}
