import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as TaskRepository from '../database/taskRepository';
import { Task, TaskFilter } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TaskRepository.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadTasks();
    }, [loadTasks]),
  );

  const toggleTask = useCallback(
    async (id: number, currentCompleted: number) => {
      try {
        const newCompleted = currentCompleted === 0 ? 1 : 0;
        await TaskRepository.toggleTaskComplete(id, newCompleted);
        await loadTasks();
      } catch (error) {
        console.error('Erro ao alterar tarefa:', error);
      }
    },
    [loadTasks],
  );

  const removeTask = useCallback(
    async (id: number) => {
      try {
        await TaskRepository.deleteTask(id);
        await loadTasks();
      } catch (error) {
        console.error('Erro ao remover tarefa:', error);
      }
    },
    [loadTasks],
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.completed === 0;
    if (filter === 'completed') return task.completed === 1;
    return true;
  });

  return {
    tasks: filteredTasks,
    allTasksCount: tasks.length,
    pendingCount: tasks.filter((task) => task.completed === 0).length,
    completedCount: tasks.filter((task) => task.completed === 1).length,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  };
}
