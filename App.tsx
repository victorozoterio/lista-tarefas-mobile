import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [contador, setContador] = useState(0);
  const [texto, setTexto] = useState('');
  const [recados, setRecados] = useState<string[]>([]);

  function adicionar() {
    if (texto.trim() === '') return;

    setRecados([texto.trim(), ...recados]);
    setTexto('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mural de Recados</Text>
      <Text style={styles.contador}>{contador}</Text>

      <TextInput
        style={styles.input}
        placeholder="Escreva um recado..."
        value={texto}
        onChangeText={setTexto}
        onSubmitEditing={adicionar}
        returnKeyType="done"
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={adicionar}
        accessibilityRole="button"
        accessibilityLabel="Adicionar recado"
      >
        <Text style={styles.textoBotao}>Adicionar recado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoContador}
        onPress={() => setContador(contador + 1)}
        accessibilityRole="button"
        accessibilityLabel="Somar uma visita"
      >
        <Text style={styles.textoBotaoContador}>Somar 1 visita</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.lista}
        data={recados}
        keyExtractor={(item, index) => `${index}-${item}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum recado ainda.</Text>
        }
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: '#f9fafb',
  },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  contador: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  botao: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 8 },
  textoBotao: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  botaoContador: {
    borderColor: '#4f46e5',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotaoContador: {
    color: '#4f46e5',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lista: { marginTop: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginTop: 8 },
  vazio: { textAlign: 'center', color: '#9ca3af', marginTop: 24 },
});
