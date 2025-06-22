export type TaskCategory = 'inbox' | 'next' | 'waiting' | 'scheduled' | 'someday';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  order: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface EditTaskData {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
} 
