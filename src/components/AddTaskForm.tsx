import { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker';
import type { TaskCategory, TaskFormData } from '../types/Task';

interface AddTaskFormProps {
  onAddTask: (taskData: TaskFormData) => void;
  currentCategory: TaskCategory;
}

export const AddTaskForm = ({ onAddTask, currentCategory }: AddTaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: currentCategory,
    priority: 'medium',
  });

  // Update form data when currentCategory changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category: currentCategory,
    }));
  }, [currentCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddTask(formData);
      setFormData({
        title: '',
        description: '',
        category: currentCategory,
        priority: 'medium',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="Aufgabentitel..."
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="task-title-input"
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as TaskCategory }))}
          className="category-select"
        >
          <option value="inbox">📥 Inbox</option>
          <option value="next">⏭️ Next</option>
          <option value="waiting">⏳ Waiting</option>
          <option value="scheduled">📅 Scheduled</option>
          <option value="someday">💭 Someday</option>
        </select>
      </div>
      
      <div className="form-row">
        <textarea
          placeholder="Beschreibung (optional)..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="task-description-input"
          rows={3}
        />
      </div>
      
      <div className="form-row">
        <DatePicker
          value={formData.dueDate}
          onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
          placeholder="Fälligkeitsdatum auswählen"
          className="date-picker-field"
        />
        <select
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
          className="priority-select"
        >
          <option value="low">🟢 Niedrig</option>
          <option value="medium">🟡 Mittel</option>
          <option value="high">🔴 Hoch</option>
        </select>
        <button type="submit" className="add-btn">
          Aufgabe hinzufügen
        </button>
      </div>
    </form>
  );
}; 
