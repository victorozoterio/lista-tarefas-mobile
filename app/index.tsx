import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../src/components/EmptyState';
import { FilterBar } from '../src/components/FilterBar';
import { TaskItem } from '../src/components/TaskItem';
import { useTasks } from '../src/hooks/useTasks';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    tasks,
    allTasksCount,
    pendingCount,
    completedCount,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  } = useTasks();

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <FilterBar
        filter={filter}
        allTasksCount={allTasksCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
        onChange={setFilter}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="mt-3 text-gray-500">Carregando tarefas...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={toggleTask} onDelete={removeTask} />
          )}
          ListEmptyComponent={<EmptyState filter={filter} />}
          contentContainerClassName={tasks.length === 0 ? 'flex-grow' : 'pb-24'}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
        style={{ bottom: insets.bottom + 24 }}
        onPress={() => router.push('/form')}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova tarefa"
      >
        <Text className="text-3xl leading-none text-white">+</Text>
      </TouchableOpacity>
    </View>
  );
}
