import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DragAndDropTaskList } from './DragAndDropTaskList'
import type { Task, TaskCategory } from '../types/Task'

describe('DragAndDropTaskList', () => {
  const mockOnToggleComplete = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnMove = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnReorder = vi.fn()

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      category: 'inbox',
      priority: 'high',
      completed: false,
      createdAt: new Date('2024-01-01'),
      order: 0,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      category: 'inbox',
      priority: 'medium',
      completed: true,
      createdAt: new Date('2024-01-02'),
      order: 1,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all tasks', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
      expect(screen.getByText('Description 1')).toBeInTheDocument()
      expect(screen.getByText('Description 2')).toBeInTheDocument()
    })

    it('should render empty state when no tasks', () => {
      render(
        <DragAndDropTaskList
          tasks={[]}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      expect(screen.getByText(/keine aufgaben/i)).toBeInTheDocument()
    })

    it('should display task priorities correctly', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const highPriorityTask = screen.getByText('🔴 Hoch')
      const mediumPriorityTask = screen.getByText('🟡 Mittel')
      
      expect(highPriorityTask).toBeInTheDocument()
      expect(mediumPriorityTask).toBeInTheDocument()
    })

    it('should show completed tasks with strikethrough', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const completedTask = screen.getByText('Task 2').closest('div')
      expect(completedTask).toHaveClass('completed')
    })
  })

  describe('Task Interactions', () => {
    it('should call onToggleComplete when checkbox is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])
      
      expect(mockOnToggleComplete).toHaveBeenCalledWith('1')
    })

    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await user.click(editButtons[0])
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0])
    })

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])
      
      expect(mockOnDelete).toHaveBeenCalledWith('1')
    })

    it('should call onMove when category is changed', async () => {
      const user = userEvent.setup()
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const moveSelects = screen.getAllByRole('combobox')
      await user.selectOptions(moveSelects[0], 'next')
      
      expect(mockOnMove).toHaveBeenCalledWith('1', 'next')
    })
  })

  describe('Drag and Drop', () => {
    it('should handle drag start events', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const taskItem = screen.getByText('Task 1').closest('div')!
      
      const mockDragEvent = {
        dataTransfer: {
          setData: vi.fn(),
        },
      } as any
      
      fireEvent.dragStart(taskItem, mockDragEvent)
      
      expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
        'application/json',
        JSON.stringify({ taskId: '1', category: 'inbox' })
      )
      expect(taskItem).toHaveClass('dragging')
    })

    it('should handle drag over events', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const taskItem = screen.getByText('Task 2').closest('div')!
      
      fireEvent.dragOver(taskItem)
      
      expect(taskItem).toHaveClass('drag-over')
    })

    it('should handle drag leave events', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const taskItem = screen.getByText('Task 2').closest('div')!
      
      fireEvent.dragOver(taskItem)
      expect(taskItem).toHaveClass('drag-over')
      
      fireEvent.dragLeave(taskItem)
      expect(taskItem).not.toHaveClass('drag-over')
    })

    it('should handle drop events for same category', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const targetTask = screen.getByText('Task 2').closest('div')!
      
      const mockDragEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue(JSON.stringify({ taskId: '1', category: 'inbox' })),
        },
      } as any
      
      fireEvent.drop(targetTask, mockDragEvent)
      
      expect(mockOnReorder).toHaveBeenCalledWith('inbox', ['2', '1'])
    })

    it('should handle drop events for different category', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const targetTask = screen.getByText('Task 2').closest('div')!
      
      const mockDragEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue(JSON.stringify({ taskId: '1', category: 'next' })),
        },
      } as any
      
      fireEvent.drop(targetTask, mockDragEvent)
      
      expect(mockOnMove).toHaveBeenCalledWith('1', 'inbox')
    })

    it('should handle invalid drop data gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const targetTask = screen.getByText('Task 2').closest('div')!
      
      const mockDragEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue('invalid-json'),
        },
      } as any
      
      fireEvent.drop(targetTask, mockDragEvent)
      
      expect(mockOnReorder).not.toHaveBeenCalled()
      expect(mockOnMove).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Task Information Display', () => {
    it('should display due date when available', () => {
      const tasksWithDueDate: Task[] = [
        {
          ...mockTasks[0],
          dueDate: new Date('2024-01-15'),
        },
      ]
      
      render(
        <DragAndDropTaskList
          tasks={tasksWithDueDate}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      expect(screen.getByText(/15\.01\.2024/)).toBeInTheDocument()
    })

    it('should display creation date', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      expect(screen.getByText(/01\.01\.2024/)).toBeInTheDocument()
      expect(screen.getByText(/02\.01\.2024/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      expect(screen.getAllByRole('checkbox')).toHaveLength(2)
      expect(screen.getAllByRole('button')).toHaveLength(4) // 2 edit + 2 delete buttons
      expect(screen.getAllByRole('combobox')).toHaveLength(2) // 2 move selects
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <DragAndDropTaskList
          tasks={mockTasks}
          category="inbox"
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
        />
      )
      
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes[0].focus()
      await user.keyboard('{Space}')
      
      expect(mockOnToggleComplete).toHaveBeenCalledWith('1')
    })
  })
}) 
