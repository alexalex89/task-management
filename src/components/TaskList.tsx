import type { Task, TaskCategory } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  category: TaskCategory;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, category: TaskCategory) => void;
}

const priorityColors = {
  low: '#4ade80',
  medium: '#fbbf24',
  high: '#f87171',
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const TaskList = ({ tasks, category, onToggleComplete, onDelete, onMove }: TaskListProps) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by priority first, then by creation date
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority || 'low'];
    const bPriority = priorityOrder[b.priority || 'low'];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Keine Aufgaben in dieser Kategorie.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {sortedTasks.map((task) => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-header">
            <div className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
              />
            </div>
            <div className="task-content">
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <div className="task-meta">
                {task.dueDate && (
                  <span className="task-due-date">
                    📅 {formatDate(task.dueDate)}
                  </span>
                )}
                {task.priority && (
                  <span 
                    className="task-priority"
                    style={{ backgroundColor: priorityColors[task.priority] }}
                  >
                    {task.priority}
                  </span>
                )}
                <span className="task-created">
                  Erstellt: {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="task-actions">
            <select
              value={category}
              onChange={(e) => onMove(task.id, e.target.value as TaskCategory)}
              className="move-select"
            >
              <option value="inbox">Inbox</option>
              <option value="next">Next</option>
              <option value="waiting">Waiting</option>
              <option value="scheduled">Scheduled</option>
              <option value="someday">Someday</option>
            </select>
            <button
              onClick={() => onDelete(task.id)}
              className="delete-btn"
              title="Aufgabe löschen"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 
