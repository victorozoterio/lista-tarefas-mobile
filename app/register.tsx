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

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'As senhas digitadas são diferentes.');
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password);
    } catch (error: unknown) {
      Alert.alert('Erro ao criar conta', getErrorMessage(error));
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
            <Text className="mb-2 text-4xl font-bold text-gray-800">Criar conta 🚀</Text>
            <Text className="text-base text-gray-600">Cadastre-se para organizar suas tarefas</Text>
          </View>

          <AuthInput
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
          />
          <AuthInput
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            secureTextEntry
          />
          <AuthInput
            label="Confirmar senha"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
            secureTextEntry
          />

          <TouchableOpacity
            className={`mb-6 rounded-xl py-4 ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center text-base font-semibold text-white">Criar conta</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-gray-600">Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={loading}>
              <Text className="text-sm font-semibold text-indigo-600">Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  editable: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address';
}

function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  editable,
  secureTextEntry = false,
  keyboardType,
}: AuthInputProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-800"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Tente novamente.';
}
