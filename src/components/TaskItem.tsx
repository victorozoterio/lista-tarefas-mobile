import { Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, currentCompleted: number) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const router = useRouter();
  const completed = task.completed === 1;

  function confirmDelete() {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja excluir esta tarefa?')) {
        onDelete(task.id);
      }
      return;
    }

    Alert.alert('Excluir tarefa', 'Deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => onDelete(task.id),
      },
    ]);
  }

  return (
    <View className="mb-3 flex-row rounded-xl bg-white p-4 shadow-sm">
      <TouchableOpacity
        className={`mr-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
          completed ? 'border-green-500 bg-green-500' : 'border-gray-300'
        }`}
        onPress={() => onToggle(task.id, task.completed)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        accessibilityLabel={`Marcar ${task.title} como ${
          completed ? 'pendente' : 'concluída'
        }`}
      >
        {completed && <Text className="text-xs font-bold text-white">✓</Text>}
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={`text-base font-bold ${
            completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text className="mt-1 text-sm text-gray-500">{task.description}</Text>
        ) : null}

        <Text className="mt-2 text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleString('pt-BR')}
        </Text>

        <View className="mt-3 flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.push(`/form?id=${task.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${task.title}`}
          >
            <Text className="font-bold text-indigo-600">Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel={`Excluir ${task.title}`}
          >
            <Text className="font-bold text-red-500">Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
