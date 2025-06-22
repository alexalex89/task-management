import { useState, useEffect } from 'react';
import type { Task, TaskCategory, TaskFormData, EditTaskData } from '../types/Task';

const STORAGE_KEY = 'gtd-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        order: task.order || 0, // Ensure order property exists
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      completed: false,
      createdAt: new Date(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      priority: taskData.priority,
      order: Date.now(), // Use timestamp as initial order
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const editTask = (editData: EditTaskData) => {
    setTasks(prev => prev.map(task => {
      if (task.id === editData.id) {
        return {
          ...task,
          title: editData.title,
          description: editData.description,
          category: editData.category,
          dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
          priority: editData.priority,
        };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : undefined,
        };
      }
      return task;
    }));
  };

  const moveTask = (id: string, newCategory: TaskCategory) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, category: newCategory } : task
    ));
  };

  const reorderTasks = (category: TaskCategory, taskIds: string[]) => {
    setTasks(prev => prev.map(task => {
      if (task.category === category) {
        const newOrder = taskIds.indexOf(task.id);
        if (newOrder !== -1) {
          return { ...task, order: newOrder };
        }
      }
      return task;
    }));
  };

  const getTasksByCategory = (category: TaskCategory) => {
    return tasks
      .filter(task => task.category === category)
      .sort((a, b) => a.order - b.order);
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };

  const getActiveTasks = () => {
    return tasks.filter(task => !task.completed);
  };

  return {
    tasks,
    addTask,
    updateTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    moveTask,
    reorderTasks,
    getTasksByCategory,
    getCompletedTasks,
    getActiveTasks,
  };
}; 
