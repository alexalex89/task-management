import { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  value?: string;
  onChange: (date: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({ value, onChange, placeholder = "Datum auswählen", className = "" }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentDate(date); // Also update current date to show the correct month
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDate(null);
    onChange(undefined);
  };

  const goToPreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onChange(today.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleCalendarToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() && 
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === currentDate.getMonth() && 
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  return (
    <div className={`date-picker ${className}`} ref={datePickerRef}>
      <div className="date-input-container">
        <input
          type="text"
          value={selectedDate ? formatDate(selectedDate) : ''}
          placeholder={placeholder}
          onClick={handleInputClick}
          readOnly
          className="date-input"
        />
        <button
          type="button"
          onClick={handleCalendarToggle}
          className="calendar-toggle"
        >
          📅
        </button>
        {selectedDate && (
          <button
            type="button"
            onClick={handleClearDate}
            className="clear-date"
            title="Datum löschen"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button 
              type="button"
              onClick={goToPreviousMonth} 
              className="nav-btn"
            >
              ‹
            </button>
            <span className="current-month">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button 
              type="button"
              onClick={goToNextMonth} 
              className="nav-btn"
            >
              ›
            </button>
          </div>

          <div className="calendar-weekdays">
            <div>Mo</div>
            <div>Di</div>
            <div>Mi</div>
            <div>Do</div>
            <div>Fr</div>
            <div>Sa</div>
            <div>So</div>
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>

          <div className="calendar-footer">
            <button 
              type="button"
              onClick={goToToday} 
              className="today-btn"
            >
              Heute
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 
