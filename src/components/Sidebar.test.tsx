import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './Sidebar'
import type { TaskCategory } from '../types/Task'

describe('Sidebar', () => {
  const mockOnCategoryChange = vi.fn()
  const mockOnTaskDrop = vi.fn()
  
  const defaultTaskCounts = {
    inbox: 5,
    next: 3,
    waiting: 2,
    scheduled: 1,
    someday: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all category buttons', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      expect(screen.getByRole('button', { name: /📥 Inbox/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /⏭️ Next/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /⏳ Waiting/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /📅 Scheduled/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /💭 Someday/ })).toBeInTheDocument()
    })

    it('should display task counts', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should highlight active category', () => {
      render(
        <Sidebar
          activeCategory="next"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      expect(nextButton).toHaveClass('active')
    })
  })

  describe('Navigation', () => {
    it('should call onCategoryChange when clicking a category', async () => {
      const user = userEvent.setup()
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      await user.click(nextButton)
      
      expect(mockOnCategoryChange).toHaveBeenCalledWith('next')
    })

    it('should call onCategoryChange for each category', async () => {
      const user = userEvent.setup()
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      const categories: TaskCategory[] = ['inbox', 'next', 'waiting', 'scheduled', 'someday']
      const buttonSelectors = [
        /📥 Inbox/,
        /⏭️ Next/,
        /⏳ Waiting/,
        /📅 Scheduled/,
        /💭 Someday/
      ]
      
      for (let i = 0; i < categories.length; i++) {
        const button = screen.getByRole('button', { name: buttonSelectors[i] })
        await user.click(button)
        expect(mockOnCategoryChange).toHaveBeenCalledWith(categories[i])
      }
    })
  })

  describe('Drag and Drop', () => {
    it('should handle drag over events', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
          onTaskDrop={mockOnTaskDrop}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      
      fireEvent.dragOver(nextButton)
      
      expect(nextButton).toHaveClass('drag-over')
    })

    it('should handle drag enter and leave events', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
          onTaskDrop={mockOnTaskDrop}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      
      fireEvent.dragEnter(nextButton)
      expect(nextButton).toHaveClass('drag-over')
      
      fireEvent.dragLeave(nextButton)
      expect(nextButton).not.toHaveClass('drag-over')
    })

    it('should handle task drop events', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
          onTaskDrop={mockOnTaskDrop}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      
      const mockDragEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue(JSON.stringify({ taskId: 'task-1' })),
        },
      } as any
      
      fireEvent.drop(nextButton, mockDragEvent)
      
      expect(mockOnTaskDrop).toHaveBeenCalledWith('task-1', 'next')
    })

    it('should handle invalid drop data gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
          onTaskDrop={mockOnTaskDrop}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      
      const mockDragEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue('invalid-json'),
        },
      } as any
      
      fireEvent.drop(nextButton, mockDragEvent)
      
      expect(mockOnTaskDrop).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('should not call onTaskDrop when no handler is provided', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      
      const mockDragEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue(JSON.stringify({ taskId: 'task-1' })),
        },
      } as any
      
      fireEvent.drop(nextButton, mockDragEvent)
      
      // Should not throw error when onTaskDrop is not provided
      expect(true).toBe(true)
    })
  })

  describe('Task Counts', () => {
    it('should display zero count for empty categories', () => {
      const emptyCounts = {
        inbox: 0,
        next: 0,
        waiting: 0,
        scheduled: 0,
        someday: 0,
      }
      
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={emptyCounts}
        />
      )
      
      const countElements = screen.getAllByText('0')
      expect(countElements).toHaveLength(5)
    })

    it('should display large numbers correctly', () => {
      const largeCounts = {
        inbox: 999,
        next: 1000,
        waiting: 1001,
        scheduled: 9999,
        someday: 10000,
      }
      
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={largeCounts}
        />
      )
      
      expect(screen.getByText('999')).toBeInTheDocument()
      expect(screen.getByText('1000')).toBeInTheDocument()
      expect(screen.getByText('1001')).toBeInTheDocument()
      expect(screen.getByText('9999')).toBeInTheDocument()
      expect(screen.getByText('10000')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Task Management' })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      
      nextButton.focus()
      expect(nextButton).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mockOnCategoryChange).toHaveBeenCalledWith('next')
    })

    it('should have proper ARIA attributes', () => {
      render(
        <Sidebar
          activeCategory="inbox"
          onCategoryChange={mockOnCategoryChange}
          taskCounts={defaultTaskCounts}
        />
      )
      
      const inboxButton = screen.getByRole('button', { name: /📥 Inbox/ })
      expect(inboxButton).toHaveAttribute('aria-pressed', 'true')
      
      const nextButton = screen.getByRole('button', { name: /⏭️ Next/ })
      expect(nextButton).toHaveAttribute('aria-pressed', 'false')
    })
  })
}) 
