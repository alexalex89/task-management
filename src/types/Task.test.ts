import { describe, it, expect } from 'vitest'
import type { Task, TaskCategory, TaskFormData } from './Task'

describe('Task Types', () => {
  describe('TaskCategory', () => {
    it('should have all required categories', () => {
      const categories: TaskCategory[] = ['inbox', 'next', 'waiting', 'scheduled', 'someday']
      
      expect(categories).toHaveLength(5)
      expect(categories).toContain('inbox')
      expect(categories).toContain('next')
      expect(categories).toContain('waiting')
      expect(categories).toContain('scheduled')
      expect(categories).toContain('someday')
    })
  })

  describe('Task interface', () => {
    it('should have all required properties', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        category: 'inbox',
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
        order: 0,
      }

      expect(task).toHaveProperty('id')
      expect(task).toHaveProperty('title')
      expect(task).toHaveProperty('description')
      expect(task).toHaveProperty('category')
      expect(task).toHaveProperty('priority')
      expect(task).toHaveProperty('completed')
      expect(task).toHaveProperty('createdAt')
      expect(task).toHaveProperty('dueDate')
      expect(task).toHaveProperty('order')
    })
  })

  describe('TaskFormData interface', () => {
    it('should have all required properties', () => {
      const formData: TaskFormData = {
        title: 'Test Task',
        description: 'Test Description',
        category: 'inbox',
        priority: 'medium',
        dueDate: new Date().toISOString(),
      }

      expect(formData).toHaveProperty('title')
      expect(formData).toHaveProperty('description')
      expect(formData).toHaveProperty('category')
      expect(formData).toHaveProperty('priority')
      expect(formData).toHaveProperty('dueDate')
    })
  })
}) 
