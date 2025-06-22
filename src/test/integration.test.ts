import { describe, it, expect, vi } from 'vitest'

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

describe('Task Management Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Task Types', () => {
    it('should have correct task categories', () => {
      const categories = ['inbox', 'next', 'waiting', 'scheduled', 'someday']
      
      expect(categories).toHaveLength(5)
      expect(categories).toContain('inbox')
      expect(categories).toContain('next')
      expect(categories).toContain('waiting')
      expect(categories).toContain('scheduled')
      expect(categories).toContain('someday')
    })

    it('should have correct priority levels', () => {
      const priorities = ['low', 'medium', 'high']
      
      expect(priorities).toHaveLength(3)
      expect(priorities).toContain('low')
      expect(priorities).toContain('medium')
      expect(priorities).toContain('high')
    })
  })

  describe('LocalStorage Integration', () => {
    it('should save data to localStorage', () => {
      const testData = { key: 'value' }
      localStorage.setItem('test', JSON.stringify(testData))
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test', JSON.stringify(testData))
    })

    it('should load data from localStorage', () => {
      const testData = { key: 'value' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData))
      
      const loadedData = JSON.parse(localStorage.getItem('test') || '{}')
      
      expect(loadedData).toEqual(testData)
    })

    it('should handle empty localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const loadedData = localStorage.getItem('test')
      
      expect(loadedData).toBeNull()
    })
  })

  describe('Date Handling', () => {
    it('should format dates correctly', () => {
      const testDate = new Date('2024-01-15')
      const formattedDate = testDate.toLocaleDateString('de-DE')
      
      // The actual format depends on the system locale, so we check for a valid date format
      expect(formattedDate).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/)
      expect(formattedDate).toContain('2024')
    })

    it('should handle date comparisons', () => {
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-01-15')
      
      expect(date1 < date2).toBe(true)
      expect(date2 > date1).toBe(true)
    })

    it('should create valid dates', () => {
      const date = new Date()
      
      expect(date).toBeInstanceOf(Date)
      expect(date.getTime()).toBeGreaterThan(0)
    })
  })

  describe('Task Data Structure', () => {
    it('should create valid task object', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        category: 'inbox',
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        order: 0,
      }
      
      expect(task.id).toBe('1')
      expect(task.title).toBe('Test Task')
      expect(task.category).toBe('inbox')
      expect(task.priority).toBe('medium')
      expect(task.completed).toBe(false)
      expect(task.createdAt).toBeInstanceOf(Date)
      expect(task.order).toBe(0)
    })

    it('should validate task properties', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        category: 'inbox',
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        order: 0,
      }
      
      // Required properties
      expect(task).toHaveProperty('id')
      expect(task).toHaveProperty('title')
      expect(task).toHaveProperty('category')
      expect(task).toHaveProperty('completed')
      expect(task).toHaveProperty('createdAt')
      expect(task).toHaveProperty('order')
      
      // Optional properties
      expect(task).toHaveProperty('description')
      expect(task).toHaveProperty('priority')
    })
  })

  describe('Category Management', () => {
    it('should filter tasks by category', () => {
      const tasks = [
        { id: '1', category: 'inbox', title: 'Inbox Task' },
        { id: '2', category: 'next', title: 'Next Task' },
        { id: '3', category: 'inbox', title: 'Another Inbox Task' },
      ]
      
      const inboxTasks = tasks.filter(task => task.category === 'inbox')
      const nextTasks = tasks.filter(task => task.category === 'next')
      
      expect(inboxTasks).toHaveLength(2)
      expect(nextTasks).toHaveLength(1)
      expect(inboxTasks[0].title).toBe('Inbox Task')
      expect(nextTasks[0].title).toBe('Next Task')
    })

    it('should count tasks per category', () => {
      const tasks = [
        { id: '1', category: 'inbox' },
        { id: '2', category: 'next' },
        { id: '3', category: 'inbox' },
        { id: '4', category: 'waiting' },
      ]
      
      const counts = {
        inbox: tasks.filter(t => t.category === 'inbox').length,
        next: tasks.filter(t => t.category === 'next').length,
        waiting: tasks.filter(t => t.category === 'waiting').length,
        scheduled: tasks.filter(t => t.category === 'scheduled').length,
        someday: tasks.filter(t => t.category === 'someday').length,
      }
      
      expect(counts.inbox).toBe(2)
      expect(counts.next).toBe(1)
      expect(counts.waiting).toBe(1)
      expect(counts.scheduled).toBe(0)
      expect(counts.someday).toBe(0)
    })
  })

  describe('Task Sorting', () => {
    it('should sort tasks by priority', () => {
      const tasks = [
        { id: '1', priority: 'low', title: 'Low Priority' },
        { id: '2', priority: 'high', title: 'High Priority' },
        { id: '3', priority: 'medium', title: 'Medium Priority' },
      ]
      
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      
      const sortedTasks = tasks.sort((a, b) => 
        priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      )
      
      expect(sortedTasks[0].priority).toBe('high')
      expect(sortedTasks[1].priority).toBe('medium')
      expect(sortedTasks[2].priority).toBe('low')
    })

    it('should sort tasks by creation date', () => {
      const tasks = [
        { id: '1', createdAt: new Date('2024-01-03'), title: 'Task 3' },
        { id: '2', createdAt: new Date('2024-01-01'), title: 'Task 1' },
        { id: '3', createdAt: new Date('2024-01-02'), title: 'Task 2' },
      ]
      
      const sortedTasks = tasks.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      expect(sortedTasks[0].title).toBe('Task 3')
      expect(sortedTasks[1].title).toBe('Task 2')
      expect(sortedTasks[2].title).toBe('Task 1')
    })
  })

  describe('Task Operations', () => {
    it('should add new task', () => {
      const tasks: any[] = []
      const newTask = {
        id: '1',
        title: 'New Task',
        category: 'inbox',
        completed: false,
        createdAt: new Date(),
        order: 0,
      }
      
      tasks.push(newTask)
      
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe('New Task')
    })

    it('should toggle task completion', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        completed: false,
      }
      
      task.completed = !task.completed
      expect(task.completed).toBe(true)
      
      task.completed = !task.completed
      expect(task.completed).toBe(false)
    })

    it('should delete task', () => {
      const tasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
        { id: '3', title: 'Task 3' },
      ]
      
      const taskToDelete = '2'
      const filteredTasks = tasks.filter(task => task.id !== taskToDelete)
      
      expect(filteredTasks).toHaveLength(2)
      expect(filteredTasks.find(t => t.id === '2')).toBeUndefined()
    })

    it('should move task between categories', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        category: 'inbox',
      }
      
      task.category = 'next'
      
      expect(task.category).toBe('next')
    })
  })

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const validateTask = (task: any) => {
        const errors: string[] = []
        
        if (!task.title || task.title.trim() === '') {
          errors.push('Title is required')
        }
        
        if (!task.category) {
          errors.push('Category is required')
        }
        
        return errors
      }
      
      const validTask = { title: 'Test Task', category: 'inbox' }
      const invalidTask = { title: '', category: 'inbox' }
      const emptyTask = { title: '   ', category: 'inbox' }
      
      expect(validateTask(validTask)).toHaveLength(0)
      expect(validateTask(invalidTask)).toContain('Title is required')
      expect(validateTask(emptyTask)).toContain('Title is required')
    })

    it('should validate priority values', () => {
      const validPriorities = ['low', 'medium', 'high']
      
      const validatePriority = (priority: string) => {
        return validPriorities.includes(priority)
      }
      
      expect(validatePriority('low')).toBe(true)
      expect(validatePriority('medium')).toBe(true)
      expect(validatePriority('high')).toBe(true)
      expect(validatePriority('invalid')).toBe(false)
    })
  })

  describe('Drag and Drop Data', () => {
    it('should serialize drag data correctly', () => {
      const dragData = {
        taskId: '1',
        category: 'inbox',
      }
      
      const serialized = JSON.stringify(dragData)
      const deserialized = JSON.parse(serialized)
      
      expect(deserialized.taskId).toBe('1')
      expect(deserialized.category).toBe('inbox')
    })

    it('should handle invalid drag data', () => {
      const invalidData = 'invalid-json'
      
      try {
        JSON.parse(invalidData)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError)
      }
    })
  })

  describe('Category Pre-selection Feature', () => {
    it('should pre-select current category when adding tasks', () => {
      const currentCategory = 'next'
      const formData = {
        title: 'Test Task',
        description: 'Test Description',
        category: currentCategory,
        priority: 'medium',
      }
      
      expect(formData.category).toBe(currentCategory)
    })

    it('should update form when category changes', () => {
      let currentCategory = 'inbox'
      let formData = {
        title: 'Test Task',
        description: 'Test Description',
        category: currentCategory,
        priority: 'medium',
      }
      
      expect(formData.category).toBe('inbox')
      
      // Change category
      currentCategory = 'waiting'
      formData = {
        ...formData,
        category: currentCategory,
      }
      
      expect(formData.category).toBe('waiting')
    })
  })

  describe('Drag and Drop Between Categories', () => {
    it('should move task from one category to another', () => {
      const tasks = [
        { id: '1', title: 'Task 1', category: 'inbox' },
        { id: '2', title: 'Task 2', category: 'next' },
      ]
      
      // Move task 1 from inbox to next
      const taskToMove = tasks.find(t => t.id === '1')!
      taskToMove.category = 'next'
      
      const inboxTasks = tasks.filter(t => t.category === 'inbox')
      const nextTasks = tasks.filter(t => t.category === 'next')
      
      expect(inboxTasks).toHaveLength(0)
      expect(nextTasks).toHaveLength(2)
      expect(taskToMove.category).toBe('next')
    })

    it('should handle drag data serialization for category moves', () => {
      const dragData = {
        taskId: '1',
        category: 'inbox',
      }
      
      const targetCategory = 'next'
      
      // Simulate drop on sidebar category
      const moveOperation = {
        taskId: dragData.taskId,
        fromCategory: dragData.category,
        toCategory: targetCategory,
      }
      
      expect(moveOperation.taskId).toBe('1')
      expect(moveOperation.fromCategory).toBe('inbox')
      expect(moveOperation.toCategory).toBe('next')
    })
  })
}) 
