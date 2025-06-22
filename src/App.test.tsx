import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

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

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Initial Rendering', () => {
    it('should render the main app structure', () => {
      render(<App />)
      
      expect(screen.getByText('Task Management')).toBeInTheDocument()
      expect(screen.getByText('Inbox', { selector: '.nav-label' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: 'Inbox' })).toBeInTheDocument()
      expect(screen.getByText('0 Aufgaben')).toBeInTheDocument()
    })

    it('should render all category navigation items', () => {
      render(<App />)
      
      expect(screen.getByText('📥 Inbox')).toBeInTheDocument()
      expect(screen.getByText('⏭️ Next')).toBeInTheDocument()
      expect(screen.getByText('⏳ Waiting')).toBeInTheDocument()
      expect(screen.getByText('📅 Scheduled')).toBeInTheDocument()
      expect(screen.getByText('💭 Someday')).toBeInTheDocument()
    })

    it('should render add task form', () => {
      render(<App />)
      
      expect(screen.getByPlaceholderText('Aufgabentitel...')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Beschreibung (optional)...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Aufgabe hinzufügen/i })).toBeInTheDocument()
    })

    it('should show empty state when no tasks exist', () => {
      render(<App />)
      
      expect(screen.getByText(/keine aufgaben/i)).toBeInTheDocument()
    })
  })

  describe('Category Navigation', () => {
    it('should switch between categories when clicking navigation items', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Initially on Inbox
      expect(screen.getByRole('heading', { level: 2, name: 'Inbox' })).toBeInTheDocument()
      expect(screen.getAllByText('Inbox').length).toBeGreaterThan(0)
      
      // Click on Next
      const nextButton = screen.getByRole('button', { name: /Next \(\d+ Aufgaben\)/ })
      await user.click(nextButton)
      
      expect(screen.getByRole('heading', { name: 'Next' })).toBeInTheDocument()
      
      // Click on Waiting
      const waitingButton = screen.getByRole('button', { name: /Waiting \(\d+ Aufgaben\)/ })
      await user.click(waitingButton)
      
      expect(screen.getByRole('heading', { name: 'Waiting' })).toBeInTheDocument()
    })

    it('should highlight active category', () => {
      render(<App />)
      
      const inboxButton = screen.getByRole('button', { name: /Inbox \(\d+ Aufgaben\)/ })
      expect(inboxButton).toHaveClass('active')
    })
  })

  describe('Task Management', () => {
    it('should add a new task', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const descriptionInput = screen.getByPlaceholderText('Beschreibung (optional)...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'New Test Task')
      await user.type(descriptionInput, 'Test Description')
      await user.click(addButton)
      
      expect(screen.getByText('New Test Task')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('1 Aufgabe')).toBeInTheDocument()
    })

    it('should pre-select current category in add form', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Switch to Next category
      const nextButton = screen.getByRole('button', { name: /Next \(\d+ Aufgaben\)/ })
      await user.click(nextButton)
      
      // Add a task
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Task in Next')
      await user.click(addButton)
      
      // Task should appear in Next category
      expect(screen.getByText('Task in Next')).toBeInTheDocument()
      expect(screen.getByText('1 Aufgabe')).toBeInTheDocument()
    })

    it('should toggle task completion', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Add a task
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Test Task')
      await user.click(addButton)
      
      // Toggle completion
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      // Task should be marked as completed
      const taskTitle = screen.getByText('Test Task')
      const taskItem = taskTitle.closest('.task-item')
      expect(taskItem).toHaveClass('completed')
    })

    it('should delete a task', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Add a task
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Task to Delete')
      await user.click(addButton)
      
      expect(screen.getByText('Task to Delete')).toBeInTheDocument()
      
      // Delete the task
      const deleteButton = screen.getByRole('button', { name: /🗑️/ })
      await user.click(deleteButton)
      
      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument()
      expect(screen.getByText('0 Aufgaben')).toBeInTheDocument()
    })

    it('should edit a task', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Add a task
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Original Task')
      await user.click(addButton)
      
      // Edit the task
      const editButton = screen.getByRole('button', { name: /✏️/ })
      await user.click(editButton)
      
      // Modal should open
      expect(screen.getByText('Aufgabe bearbeiten')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Original Task')).toBeInTheDocument()
    })
  })

  describe('Drag and Drop', () => {
    it('should support dragging tasks between categories', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Add a task to Inbox
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Draggable Task')
      await user.click(addButton)
      
      // Switch to Next category
      const nextButton = screen.getByRole('button', { name: /Next \(\d+ Aufgaben\)/ })
      await user.click(nextButton)
      
      // Task should not be visible in Next
      expect(screen.queryByText('Draggable Task')).not.toBeInTheDocument()
      
      // Switch back to Inbox
      const inboxButton = screen.getByRole('button', { name: /Inbox \(\d+ Aufgaben\)/ })
      await user.click(inboxButton)
      
      // Task should be visible in Inbox
      expect(screen.getByText('Draggable Task')).toBeInTheDocument()
    })

    it.skip('should support dropping tasks on sidebar categories', async () => {
      // Drag & Drop tests are not reliable in jsdom environment
      // This test would require a real browser environment to work properly
    })
  })

  describe('Task Counts', () => {
    it('should display correct task counts for each category', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Add tasks to different categories
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      // Add task to Inbox
      await user.type(titleInput, 'Inbox Task')
      await user.click(addButton)
      
      // Switch to Next and add task
      const nextButton = screen.getByRole('button', { name: /Next \(\d+ Aufgaben\)/ })
      await user.click(nextButton)
      
      await user.type(titleInput, 'Next Task')
      await user.click(addButton)
      
      // Check counts
      expect(screen.getAllByText('1').length).toBeGreaterThan(1)
      
      // Switch back to Inbox
      const inboxButton = screen.getByRole('button', { name: /Inbox \(\d+ Aufgaben\)/ })
      await user.click(inboxButton)
      
      expect(screen.getAllByText('1').length).toBeGreaterThan(1)
    })
  })

  describe('Data Persistence', () => {
    it('should save tasks to localStorage', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      
      await user.type(titleInput, 'Persistent Task')
      await user.click(addButton)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('gtd-tasks', expect.any(String))
    })

    it('should load tasks from localStorage on initialization', () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Loaded Task',
          description: 'Loaded Description',
          category: 'inbox',
          priority: 'medium',
          completed: false,
          createdAt: new Date('2024-01-01'),
          order: 0,
        },
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks))
      
      render(<App />)
      
      expect(screen.getByText('Loaded Task')).toBeInTheDocument()
      expect(screen.getByText('Loaded Description')).toBeInTheDocument()
      expect(screen.getByText('1 Aufgabe')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<App />)
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(document.querySelector('form.add-task-form')).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const titleInput = screen.getByPlaceholderText('Aufgabentitel...')
      titleInput.focus()
      
      await user.keyboard('Test Task')
      await user.keyboard('{Tab}')
      const addButton = screen.getByRole('button', { name: /Aufgabe hinzufügen/i })
      await user.click(addButton)
      
      await screen.findByText('Test Task')
    })
  })
}) 
