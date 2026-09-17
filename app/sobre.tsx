import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Sobre() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-indigo-600">Cardápio</Text>
      <Text className="mt-3 text-center text-gray-600">
        Exemplo de roteamento baseado em arquivos com Expo Router e NativeWind.
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
