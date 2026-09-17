// Entidade persistida na tabela tasks.
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: number; // 0 = pendente, 1 = concluída
  createdAt: string; // formato ISO 8601
}

// Filtros disponíveis para a lista de tarefas.
export type TaskFilter = 'all' | 'pending' | 'completed';

// Dados necessários para criar uma tarefa.
export interface CreateTaskInput {
  title: string;
  description: string | null;
}

// Dados editáveis de uma tarefa existente.
export interface UpdateTaskInput {
  id: number;
  title: string;
  description: string | null;
}
