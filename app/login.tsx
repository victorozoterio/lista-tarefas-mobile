import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Campos obrigatórios', 'Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (error: unknown) {
      Alert.alert('Erro ao fazer login', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: unknown) {
      Alert.alert('Erro ao fazer login com Google', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerClassName="flex-grow" keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center bg-gray-50 px-6">
          <View className="mb-8">
            <Text className="mb-2 text-4xl font-bold text-gray-800">Bem-vindo! 👋</Text>
            <Text className="text-base text-gray-600">Faça login para acessar suas tarefas</Text>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-gray-700">Email</Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-800"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-gray-700">Senha</Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-800"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            className={`mb-4 rounded-xl py-4 ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center text-base font-semibold text-white">Entrar</Text>
            )}
          </TouchableOpacity>

          <View className="my-6 flex-row items-center">
            <View className="h-px flex-1 bg-gray-300" />
            <Text className="mx-4 text-sm text-gray-500">OU</Text>
            <View className="h-px flex-1 bg-gray-300" />
          </View>

          <TouchableOpacity
            className="mb-6 flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-4"
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text className="mr-3 text-2xl" style={{ lineHeight: 32 }}>🔍</Text>
            <Text className="text-base font-semibold text-gray-800">Entrar com Google</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-gray-600">Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')} disabled={loading}>
              <Text className="text-sm font-semibold text-indigo-600">Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Tente novamente.';
}
