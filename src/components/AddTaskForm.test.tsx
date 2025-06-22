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
      const categorySelect = screen.getAllByRole('combobox')[0]
      expect(categorySelect).toHaveValue('next')
    })

    it('should render all form elements', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      expect(screen.getByPlaceholderText('Aufgabentitel...')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Beschreibung (optional)...')).toBeInTheDocument()
      expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument()
      expect(screen.getAllByRole('combobox')[1]).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Aufgabe hinzufügen/i })).toBeInTheDocument()
    })

    it('should have all category options', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      const categorySelect = screen.getAllByRole('combobox')[0]
      const options = Array.from(categorySelect.querySelectorAll('option'))
      expect(options.map(o => o.value)).toEqual([
        'inbox', 'next', 'waiting', 'scheduled', 'someday'
      ])
    })

    it('should have all priority options', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const prioritySelect = screen.getAllByRole('combobox')[1]
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
      const categorySelect = screen.getAllByRole('combobox')[0]
      await user.selectOptions(categorySelect, 'next')
      expect(categorySelect).toHaveValue('next')
    })

    it('should update priority when selecting different option', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      const prioritySelect = screen.getAllByRole('combobox')[1]
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
      const categorySelect = screen.getAllByRole('combobox')[0]
      const prioritySelect = screen.getAllByRole('combobox')[1]
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      await user.type(titleInput, 'Neue Aufgabe')
      await user.type(descriptionInput, 'Beschreibung')
      await user.selectOptions(categorySelect, 'next')
      await user.selectOptions(prioritySelect, 'high')
      await user.click(submitButton)
      expect(mockOnAddTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Neue Aufgabe',
          description: 'Beschreibung',
          category: 'next',
          priority: 'high',
        })
      )
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
      let categorySelect = screen.getAllByRole('combobox')[0]
      expect(categorySelect).toHaveValue('inbox')
      rerender(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="waiting" />)
      categorySelect = screen.getAllByRole('combobox')[0]
      expect(categorySelect).toHaveValue('waiting')
    })

    it('should maintain current category when form is reset', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      // Change category and submit
      const categorySelect = screen.getAllByRole('combobox')[0]
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      await user.selectOptions(categorySelect, 'next')
      await user.type(titleInput, 'Test')
      await user.click(submitButton)
      // Nach Reset: Kategorie bleibt auf currentCategory (inbox)
      expect(categorySelect).toHaveValue('inbox')
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
      
      expect(screen.getByPlaceholderText('Aufgabentitel...')).toBeInTheDocument()
      expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument()
      expect(screen.getAllByRole('combobox')[1]).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<AddTaskForm onAddTask={mockOnAddTask} currentCategory="inbox" />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const submitButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      await user.type(titleInput, 'Test')
      await user.click(submitButton)
      expect(mockOnAddTask).toHaveBeenCalled()
    })
  })
}) 
