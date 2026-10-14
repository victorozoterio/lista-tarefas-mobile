import { useCallback, useEffect, useState } from 'react';
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
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as TaskRepository from '../src/database/taskRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const isEditing = Boolean(id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const loadTask = useCallback(async () => {
    if (!id) return;

    const taskId = Number(id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      Alert.alert('Tarefa inválida', 'Não foi possível encontrar a tarefa.');
      router.back();
      return;
    }

    try {
      setLoading(true);
      const task = await TaskRepository.getTaskById(taskId);

      if (!task) {
        Alert.alert('Tarefa não encontrada', 'Ela pode ter sido removida.');
        router.back();
        return;
      }

      setTitle(task.title);
      setDescription(task.description ?? '');
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível carregar a tarefa.');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    void loadTask();
  }, [loadTask]);

  async function handleSave() {
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim() || null;

    if (!normalizedTitle) {
      Alert.alert('Título obrigatório', 'Digite um título para a tarefa.');
      return;
    }

    try {
      setSaving(true);

      if (isEditing && id) {
        await TaskRepository.updateTask({
          id: Number(id),
          title: normalizedTitle,
          description: normalizedDescription,
        });
      } else {
        await TaskRepository.createTask({
          title: normalizedTitle,
          description: normalizedDescription,
        });
      }

      router.back();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: isEditing ? 'Editar Tarefa' : 'Nova Tarefa' }} />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-2 text-sm font-bold text-gray-700">Título *</Text>
          <TextInput
            className="mb-5 rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
            placeholder="Ex.: Estudar React Native"
            value={title}
            onChangeText={setTitle}
            autoFocus={!isEditing}
            maxLength={120}
            returnKeyType="next"
          />

          <Text className="mb-2 text-sm font-bold text-gray-700">Descrição</Text>
          <TextInput
            className="min-h-32 rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
            placeholder="Adicione mais detalhes se quiser"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          <TouchableOpacity
            className={`mt-6 rounded-lg p-4 ${
              saving ? 'bg-indigo-300' : 'bg-indigo-600'
            }`}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? 'Salvar alterações' : 'Criar tarefa'}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center font-bold text-white">
                {isEditing ? 'Salvar alterações' : 'Criar tarefa'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
