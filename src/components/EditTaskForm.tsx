import { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker';
import type { Task, TaskCategory, EditTaskData } from '../types/Task';

interface EditTaskFormProps {
  task: Task;
  onSave: (editData: EditTaskData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const EditTaskForm = ({ task, onSave, onCancel, isOpen }: EditTaskFormProps) => {
  const [formData, setFormData] = useState<EditTaskData>({
    id: task.id,
    title: task.title,
    description: task.description || '',
    category: task.category,
    priority: task.priority || 'medium',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : undefined,
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-task-overlay">
      <div className="edit-task-modal">
        <div className="modal-header">
          <h3>Aufgabe bearbeiten</h3>
          <button onClick={onCancel} className="close-btn">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-task-form">
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
              className="date-picker-field modal-date-picker"
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
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Abbrechen
            </button>
            <button type="submit" className="save-btn">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
