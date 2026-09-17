import { Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Detalhe() {
  const { nome, preco } = useLocalSearchParams<{
    nome?: string;
    preco?: string;
  }>();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="mb-4 text-6xl">🍽️</Text>
      <Text className="text-center text-2xl font-bold text-gray-800">
        {nome ?? 'Prato'}
      </Text>
      <Text className="mt-2 text-xl text-indigo-600">
        R$ {preco ?? '0'},00
      </Text>

      <TouchableOpacity
        className="mt-8 rounded-lg bg-indigo-600 px-6 py-3"
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Voltar para o cardápio"
      >
        <Text className="font-bold text-white">Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
