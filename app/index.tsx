import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const PRATOS = [
  { nome: 'Pizza Margherita', preco: 45 },
  { nome: 'Lasanha', preco: 38 },
  { nome: 'Salada Caesar', preco: 27 },
];

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <FlatList
        data={PRATOS}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-3 rounded-xl bg-white p-4 shadow-sm"
            onPress={() =>
              router.push(`/detalhe?nome=${item.nome}&preco=${item.preco}`)
            }
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes de ${item.nome}`}
          >
            <Text className="text-lg font-bold text-gray-800">{item.nome}</Text>
            <Text className="mt-1 text-indigo-600">R$ {item.preco},00</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="mt-6 text-center text-gray-500">
            Nenhum prato disponível.
          </Text>
        }
      />

      <TouchableOpacity
        className="mt-2 rounded-lg bg-indigo-600 px-6 py-3"
        onPress={() => router.push('/sobre')}
        accessibilityRole="button"
        accessibilityLabel="Abrir tela sobre o aplicativo"
      >
        <Text className="text-center font-bold text-white">Sobre o app</Text>
      </TouchableOpacity>
    </View>
  );
}
