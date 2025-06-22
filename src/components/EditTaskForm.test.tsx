import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTaskForm } from './EditTaskForm'
import type { Task } from '../types/Task'

describe('EditTaskForm', () => {
  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()
  
  const mockTask: Task = {
    id: '1',
    title: 'Original Task',
    description: 'Original Description',
    category: 'inbox',
    priority: 'medium',
    completed: false,
    createdAt: new Date('2024-01-01'),
    order: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Modal Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      expect(screen.getByText('Aufgabe bearbeiten')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Original Task')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Original Description')).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={false}
        />
      )
      
      expect(screen.queryByText('Aufgabe bearbeiten')).not.toBeInTheDocument()
    })

    it('should display task data in form fields', () => {
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      expect(screen.getByDisplayValue('Original Task')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Original Description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('inbox')).toBeInTheDocument()
      expect(screen.getByDisplayValue('medium')).toBeInTheDocument()
    })

    it('should display due date when available', () => {
      const taskWithDueDate: Task = {
        ...mockTask,
        dueDate: new Date('2024-01-15'),
      }
      
      render(
        <EditTaskForm
          task={taskWithDueDate}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      expect(screen.getByDisplayValue('15.01.2024')).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('should update title when typing', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const titleInput = screen.getByDisplayValue('Original Task')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Task')
      
      expect(titleInput).toHaveValue('Updated Task')
    })

    it('should update description when typing', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const descriptionInput = screen.getByDisplayValue('Original Description')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'Updated Description')
      
      expect(descriptionInput).toHaveValue('Updated Description')
    })

    it('should update category when selecting different option', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const categorySelect = screen.getByDisplayValue('inbox')
      await user.selectOptions(categorySelect, 'next')
      
      expect(categorySelect).toHaveValue('next')
    })

    it('should update priority when selecting different option', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const prioritySelect = screen.getByDisplayValue('medium')
      await user.selectOptions(prioritySelect, 'high')
      
      expect(prioritySelect).toHaveValue('high')
    })
  })

  describe('Form Submission', () => {
    it('should call onSave with updated data when save button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const titleInput = screen.getByDisplayValue('Original Task')
      const descriptionInput = screen.getByDisplayValue('Original Description')
      const categorySelect = screen.getByDisplayValue('inbox')
      const prioritySelect = screen.getByDisplayValue('medium')
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Task')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'Updated Description')
      await user.selectOptions(categorySelect, 'next')
      await user.selectOptions(prioritySelect, 'high')
      await user.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        category: 'next',
        priority: 'high',
      })
    })

    it('should not submit when title is empty', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const titleInput = screen.getByDisplayValue('Original Task')
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      
      await user.clear(titleInput)
      await user.click(saveButton)
      
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('should not submit when title is only whitespace', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const titleInput = screen.getByDisplayValue('Original Task')
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      
      await user.clear(titleInput)
      await user.type(titleInput, '   ')
      await user.click(saveButton)
      
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('Modal Actions', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i })
      await user.click(cancelButton)
      
      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should call onCancel when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      
      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should call onCancel when clicking outside modal', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <EditTaskForm
            task={mockTask}
            onSave={mockOnSave}
            onCancel={mockOnCancel}
            isOpen={true}
          />
          <div data-testid="outside">Outside</div>
        </div>
      )
      
      const outsideElement = screen.getByTestId('outside')
      await user.click(outsideElement)
      
      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  describe('DatePicker Integration', () => {
    it('should include DatePicker component', () => {
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      expect(screen.getByPlaceholderText('Fälligkeitsdatum auswählen')).toBeInTheDocument()
    })

    it('should handle date selection', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const datePicker = screen.getByPlaceholderText('Fälligkeitsdatum auswählen')
      await user.click(datePicker)
      
      // Calendar should open
      expect(screen.getByText(/2024/)).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should require title field', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const titleInput = screen.getByDisplayValue('Original Task')
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      
      await user.clear(titleInput)
      await user.click(saveButton)
      
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('should allow empty description', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const descriptionInput = screen.getByDisplayValue('Original Description')
      const saveButton = screen.getByRole('button', { name: /speichern/i })
      
      await user.clear(descriptionInput)
      await user.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        id: '1',
        title: 'Original Task',
        description: '',
        category: 'inbox',
        priority: 'medium',
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper modal structure', () => {
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /speichern/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /abbrechen/i })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      const titleInput = screen.getByDisplayValue('Original Task')
      titleInput.focus()
      await user.keyboard('{Tab}')
      await user.keyboard('{Enter}')
      
      expect(mockOnSave).toHaveBeenCalled()
    })

    it('should close modal on Escape key', async () => {
      const user = userEvent.setup()
      render(
        <EditTaskForm
          task={mockTask}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isOpen={true}
        />
      )
      
      await user.keyboard('{Escape}')
      
      expect(mockOnCancel).toHaveBeenCalled()
    })
  })
}) 
