import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTasks } from './useTasks'
import type { Task, TaskCategory, TaskFormData } from '../types/Task'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useTasks Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Initialization', () => {
    it('should initialize with empty tasks when localStorage is empty', () => {
      const { result } = renderHook(() => useTasks())
      
      expect(result.current.tasks).toEqual([])
    })

    it('should load tasks from localStorage on initialization', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      
      const { result } = renderHook(() => useTasks())
      
      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('Test Task')
    })
  })

  describe('addTask', () => {
    it('should add a new task', () => {
      const { result } = renderHook(() => useTasks())
      
      const newTask: TaskFormData = {
        title: 'New Task',
        description: 'New Description',
        category: 'inbox',
        priority: 'high',
      }
      
      act(() => {
        result.current.addTask(newTask)
      })
      
      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('New Task')
      expect(result.current.tasks[0].category).toBe('inbox')
      expect(result.current.tasks[0].priority).toBe('high')
      expect(result.current.tasks[0].completed).toBe(false)
      expect(result.current.tasks[0].id).toBeDefined()
      expect(result.current.tasks[0].createdAt).toBeInstanceOf(Date)
    })

    it('should save tasks to localStorage when adding', () => {
      const { result } = renderHook(() => useTasks())
      
      const newTask: TaskFormData = {
        title: 'New Task',
        description: 'New Description',
        category: 'inbox',
        priority: 'medium',
      }
      
      act(() => {
        result.current.addTask(newTask)
      })
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('tasks', expect.any(String))
    })
  })

  describe('editTask', () => {
    it('should edit an existing task', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Original Task',
          description: 'Original Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      const { result } = renderHook(() => useTasks())
      
      const editData = {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        category: 'next' as TaskCategory,
        priority: 'high' as const,
      }
      
      act(() => {
        result.current.editTask(editData)
      })
      
      expect(result.current.tasks[0].title).toBe('Updated Task')
      expect(result.current.tasks[0].description).toBe('Updated Description')
      expect(result.current.tasks[0].category).toBe('next')
      expect(result.current.tasks[0].priority).toBe('high')
    })
  })

  describe('toggleTaskComplete', () => {
    it('should toggle task completion status', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      const { result } = renderHook(() => useTasks())
      
      act(() => {
        result.current.toggleTaskComplete('1')
      })
      
      expect(result.current.tasks[0].completed).toBe(true)
      
      act(() => {
        result.current.toggleTaskComplete('1')
      })
      
      expect(result.current.tasks[0].completed).toBe(false)
    })
  })

  describe('deleteTask', () => {
    it('should delete a task', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Task to Delete',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      const { result } = renderHook(() => useTasks())
      
      expect(result.current.tasks).toHaveLength(1)
      
      act(() => {
        result.current.deleteTask('1')
      })
      
      expect(result.current.tasks).toHaveLength(0)
    })
  })

  describe('moveTask', () => {
    it('should move a task to a different category', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Task to Move',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      const { result } = renderHook(() => useTasks())
      
      act(() => {
        result.current.moveTask('1', 'next')
      })
      
      expect(result.current.tasks[0].category).toBe('next')
    })
  })

  describe('reorderTasks', () => {
    it('should reorder tasks within a category', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-02'),
          order: 1,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      const { result } = renderHook(() => useTasks())
      
      act(() => {
        result.current.reorderTasks('inbox', ['2', '1'])
      })
      
      const inboxTasks = result.current.getTasksByCategory('inbox')
      expect(inboxTasks[0].id).toBe('2')
      expect(inboxTasks[1].id).toBe('1')
    })
  })

  describe('getTasksByCategory', () => {
    it('should return tasks filtered by category', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Inbox Task',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        },
        {
          id: '2',
          title: 'Next Task',
          description: 'Test Description',
          category: 'next',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-02'),
          order: 0,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      const { result } = renderHook(() => useTasks())
      
      const inboxTasks = result.current.getTasksByCategory('inbox')
      const nextTasks = result.current.getTasksByCategory('next')
      
      expect(inboxTasks).toHaveLength(1)
      expect(inboxTasks[0].title).toBe('Inbox Task')
      expect(nextTasks).toHaveLength(1)
      expect(nextTasks[0].title).toBe('Next Task')
    })

    it('should return empty array for category with no tasks', () => {
      const { result } = renderHook(() => useTasks())
      
      const waitingTasks = result.current.getTasksByCategory('waiting')
      
      expect(waitingTasks).toEqual([])
    })
  })

  describe('Task sorting', () => {
    it('should sort tasks by priority and creation date', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Low Priority Task',
          description: 'Test Description',
          category: 'inbox',
          priority: 'low',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        },
        {
          id: '2',
          title: 'High Priority Task',
          description: 'Test Description',
          category: 'inbox',
          priority: 'high',
          completed: false,
          createdAt: new Date('2024-01-02'),
          order: 0,
        },
        {
          id: '3',
          title: 'Medium Priority Task',
          description: 'Test Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-03'),
          order: 0,
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      const { result } = renderHook(() => useTasks())
      
      const inboxTasks = result.current.getTasksByCategory('inbox')
      
      // High priority should come first
      expect(inboxTasks[0].priority).toBe('high')
      expect(inboxTasks[0].title).toBe('High Priority Task')
      
      // Medium priority should come second
      expect(inboxTasks[1].priority).toBe('medium')
      expect(inboxTasks[1].title).toBe('Medium Priority Task')
      
      // Low priority should come last
      expect(inboxTasks[2].priority).toBe('low')
      expect(inboxTasks[2].title).toBe('Low Priority Task')
    })
  })
}) 
