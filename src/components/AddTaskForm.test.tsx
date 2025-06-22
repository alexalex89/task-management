import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTaskForm } from './AddTaskForm'
import type { TaskCategory } from '../types/Task'

describe('AddTaskForm', () => {
  const mockOnAddTask = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should render with current category pre-selected', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="next" />)
      
      const categorySelect = screen.getByRole('combobox', { name: /category/i })
      expect(categorySelect).toHaveValue('next')
    })

    it('should render all form elements', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      expect(screen.getByPlaceholderText('Aufgabentitel...')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Beschreibung (optional)...')).toBeInTheDocument()
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
      expect(screen.getByRole('combobox', { name: /priority/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Aufgabe hinzufügen/i })).toBeInTheDocument()
    })

    it('should have all category options', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const categorySelect = screen.getByRole('combobox', { name: /category/i })
      const options = Array.from(categorySelect.querySelectorAll('option'))
      
      expect(options).toHaveLength(5)
      expect(options[0]).toHaveValue('inbox')
      expect(options[1]).toHaveValue('next')
      expect(options[2]).toHaveValue('waiting')
      expect(options[3]).toHaveValue('scheduled')
      expect(options[4]).toHaveValue('someday')
    })

    it('should have all priority options', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const prioritySelect = screen.getByRole('combobox', { name: /priority/i })
      const options = Array.from(prioritySelect.querySelectorAll('option'))
      
      expect(options).toHaveLength(3)
      expect(options[0]).toHaveValue('low')
      expect(options[1]).toHaveValue('medium')
      expect(options[2]).toHaveValue('high')
    })
  })

  describe('Form Interaction', () => {
    it('should update title when typing', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      await user.type(titleInput, 'New Task Title')
      
      expect(titleInput).toHaveValue('New Task Title')
    })

    it('should update description when typing', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const descriptionInput = screen.getByPlaceholderText('Beschreibung (optional)...')
      await user.type(descriptionInput, 'New task description')
      
      expect(descriptionInput).toHaveValue('New task description')
    })

    it('should update category when selecting different option', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const categorySelect = screen.getByRole('combobox', { name: /category/i })
      await user.selectOptions(categorySelect, 'next')
      
      expect(categorySelect).toHaveValue('next')
    })

    it('should update priority when selecting different option', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const prioritySelect = screen.getByRole('combobox', { name: /priority/i })
      await user.selectOptions(prioritySelect, 'high')
      
      expect(prioritySelect).toHaveValue('high')
    })
  })

  describe('Form Submission', () => {
    it('should call onAddTask with form data when submitted', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const descriptionInput = screen.getByPlaceholderText('Beschreibung (optional)...')
      const categorySelect = screen.getByRole('combobox', { name: /category/i })
      const prioritySelect = screen.getByRole('combobox', { name: /priority/i })
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Test Task')
      await user.type(descriptionInput, 'Test Description')
      await user.selectOptions(categorySelect, 'next')
      await user.selectOptions(prioritySelect, 'high')
      await user.click(submitButton)
      
      expect(mockOnAddTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        category: 'next',
        priority: 'high',
      })
    })

    it('should not submit when title is empty', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      await user.click(submitButton)
      
      expect(mockOnAddTask).not.toHaveBeenCalled()
    })

    it('should not submit when title is only whitespace', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, '   ')
      await user.click(submitButton)
      
      expect(mockOnAddTask).not.toHaveBeenCalled()
    })

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const descriptionInput = screen.getByPlaceholderText('Beschreibung (optional)...')
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Test Task')
      await user.type(descriptionInput, 'Test Description')
      await user.click(submitButton)
      
      expect(titleInput).toHaveValue('')
      expect(descriptionInput).toHaveValue('')
    })
  })

  describe('Category Pre-selection', () => {
    it('should update form when currentCategory prop changes', () => {
      const { rerender } = render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      let categorySelect = screen.getByRole('combobox', { name: /category/i })
      expect(categorySelect).toHaveValue('inbox')
      
      rerender(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="next" />)
      
      categorySelect = screen.getByRole('combobox', { name: /category/i })
      expect(categorySelect).toHaveValue('next')
    })

    it('should maintain current category when form is reset', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      // Change category and submit
      const categorySelect = screen.getByRole('combobox', { name: /category/i })
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.selectOptions(categorySelect, 'next')
      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)
      
      // Form should reset to current category (inbox), not the selected category (next)
      expect(categorySelect).toHaveValue('inbox')
      
      // Change current category and submit again
      rerender(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="waiting" />)
      
      await user.type(titleInput, 'Another Task')
      await user.click(submitButton)
      
      // Form should reset to new current category (waiting)
      expect(categorySelect).toHaveValue('waiting')
    })
  })

  describe('DatePicker Integration', () => {
    it('should include DatePicker component', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      expect(screen.getByPlaceholderText('Fälligkeitsdatum auswählen')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and roles', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument()
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
      expect(screen.getByRole('combobox', { name: /priority/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Aufgabe hinzufügen/i })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Test Task')
      await user.keyboard('{Tab}')
      await user.keyboard('{Enter}')
      
      expect(mockOnAddTask).toHaveBeenCalled()
    })
  })
}) 
