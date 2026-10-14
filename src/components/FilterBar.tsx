import { Text, TouchableOpacity, View } from 'react-native';
import { TaskFilter } from '../types/task';

interface FilterBarProps {
  filter: TaskFilter;
  allTasksCount: number;
  pendingCount: number;
  completedCount: number;
  onChange: (filter: TaskFilter) => void;
}

const FILTERS: Array<{ key: TaskFilter; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'completed', label: 'Concluídas' },
];

export function FilterBar({
  filter,
  allTasksCount,
  pendingCount,
  completedCount,
  onChange,
}: FilterBarProps) {
  const counts: Record<TaskFilter, number> = {
    all: allTasksCount,
    pending: pendingCount,
    completed: completedCount,
  };

  return (
    <View className="mb-4 flex-row rounded-xl bg-gray-200 p-1">
      {FILTERS.map(({ key, label }) => {
        const active = filter === key;

        return (
          <TouchableOpacity
            key={key}
            className={`flex-1 rounded-lg px-2 py-2 ${
              active ? 'bg-indigo-600' : ''
            }`}
            onPress={() => onChange(key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filtrar tarefas: ${label}`}
          >
            <Text
              className={`text-center text-xs font-bold ${
                active ? 'text-white' : 'text-gray-600'
              }`}
            >
              {label} ({counts[key]})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
