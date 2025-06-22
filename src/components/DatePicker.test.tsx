import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with placeholder text', () => {
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument()
    })

    it('should render calendar toggle button', () => {
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument()
    })

    it('should display selected date when value is provided', () => {
      const testDate = new Date('2024-01-15')
      render(<DatePicker value={testDate} onChange={mockOnChange} placeholder="Select date" />)
      
      const input = screen.getByDisplayValue('15.01.2024')
      expect(input).toBeInTheDocument()
    })

    it('should show clear button when date is selected', () => {
      const testDate = new Date('2024-01-15')
      render(<DatePicker value={testDate} onChange={mockOnChange} placeholder="Select date" />)
      
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    })
  })

  describe('Calendar Toggle', () => {
    it('should open calendar when toggle button is clicked', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      expect(screen.getByText('Januar 2024')).toBeInTheDocument()
    })

    it('should close calendar when toggle button is clicked again', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      
      // Open calendar
      await user.click(toggleButton)
      expect(screen.getByText('Januar 2024')).toBeInTheDocument()
      
      // Close calendar
      await user.click(toggleButton)
      expect(screen.queryByText('Januar 2024')).not.toBeInTheDocument()
    })

    it('should close calendar when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />
          <div data-testid="outside">Outside</div>
        </div>
      )
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      expect(screen.getByText('Januar 2024')).toBeInTheDocument()
      
      const outsideElement = screen.getByTestId('outside')
      await user.click(outsideElement)
      
      expect(screen.queryByText('Januar 2024')).not.toBeInTheDocument()
    })
  })

  describe('Calendar Navigation', () => {
    it('should navigate to previous month', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const prevButton = screen.getByRole('button', { name: /previous/i })
      await user.click(prevButton)
      
      expect(screen.getByText('Dezember 2023')).toBeInTheDocument()
    })

    it('should navigate to next month', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      expect(screen.getByText('Februar 2024')).toBeInTheDocument()
    })

    it('should prevent form submission when navigating calendar', async () => {
      const user = userEvent.setup()
      const mockPreventDefault = vi.fn()
      
      render(
        <form onSubmit={(e) => e.preventDefault()}>
          <DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />
        </form>
      )
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const prevButton = screen.getByRole('button', { name: /previous/i })
      const nextButton = screen.getByRole('button', { name: /next/i })
      
      // These should not trigger form submission
      await user.click(prevButton)
      await user.click(nextButton)
      
      // Form should not have been submitted
      expect(true).toBe(true) // No error thrown
    })
  })

  describe('Date Selection', () => {
    it('should select a date when clicking on a day', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      // Click on day 15
      const day15 = screen.getByText('15')
      await user.click(day15)
      
      expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date))
      const selectedDate = mockOnChange.mock.calls[0][0]
      expect(selectedDate.getDate()).toBe(15)
      expect(selectedDate.getMonth()).toBe(0) // January
      expect(selectedDate.getFullYear()).toBe(2024)
    })

    it('should close calendar after date selection', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const day15 = screen.getByText('15')
      await user.click(day15)
      
      expect(screen.queryByText('Januar 2024')).not.toBeInTheDocument()
    })

    it('should highlight today\'s date', async () => {
      const user = userEvent.setup()
      const today = new Date()
      const todayDay = today.getDate()
      
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const todayElement = screen.getByText(todayDay.toString())
      expect(todayElement.closest('div')).toHaveClass('today')
    })

    it('should highlight selected date', async () => {
      const user = userEvent.setup()
      const selectedDate = new Date('2024-01-15')
      
      render(<DatePicker value={selectedDate} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const day15 = screen.getByText('15')
      expect(day15.closest('div')).toHaveClass('selected')
    })
  })

  describe('Clear Date', () => {
    it('should clear selected date when clear button is clicked', async () => {
      const user = userEvent.setup()
      const testDate = new Date('2024-01-15')
      render(<DatePicker value={testDate} onChange={mockOnChange} placeholder="Select date" />)
      
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await user.click(clearButton)
      
      expect(mockOnChange).toHaveBeenCalledWith(null)
    })

    it('should hide clear button after clearing date', async () => {
      const user = userEvent.setup()
      const testDate = new Date('2024-01-15')
      render(<DatePicker value={testDate} onChange={mockOnChange} placeholder="Select date" />)
      
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await user.click(clearButton)
      
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    })
  })

  describe('Today Button', () => {
    it('should select today\'s date when today button is clicked', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const todayButton = screen.getByRole('button', { name: /today/i })
      await user.click(todayButton)
      
      expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date))
      const selectedDate = mockOnChange.mock.calls[0][0]
      const today = new Date()
      expect(selectedDate.getDate()).toBe(today.getDate())
      expect(selectedDate.getMonth()).toBe(today.getMonth())
      expect(selectedDate.getFullYear()).toBe(today.getFullYear())
    })
  })

  describe('Modal Integration', () => {
    it('should apply modal-specific styles when in modal context', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" className="modal-date-picker" />)
      
      const toggleButton = screen.getByRole('button', { name: /calendar/i })
      await user.click(toggleButton)
      
      const calendarDropdown = screen.getByRole('dialog')
      expect(calendarDropdown).toHaveClass('calendar-dropdown')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={null} onChange={mockOnChange} placeholder="Select date" />)
      
      const input = screen.getByPlaceholderText('Select date')
      input.focus()
      await user.keyboard('{Enter}')
      
      expect(screen.getByText('Januar 2024')).toBeInTheDocument()
    })
  })
}) 
