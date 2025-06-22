import type { TaskCategory } from '../types/Task';

interface SidebarProps {
  activeCategory: TaskCategory;
  onCategoryChange: (category: TaskCategory) => void;
  taskCounts: Record<TaskCategory, number>;
  onTaskDrop?: (taskId: string, targetCategory: TaskCategory) => void;
}

const categoryLabels: Record<TaskCategory, string> = {
  inbox: 'Inbox',
  next: 'Next',
  waiting: 'Waiting',
  scheduled: 'Scheduled',
  someday: 'Someday',
};

const categoryIcons: Record<TaskCategory, string> = {
  inbox: '📥',
  next: '⏭️',
  waiting: '⏳',
  scheduled: '📅',
  someday: '💭',
};

export const Sidebar = ({ activeCategory, onCategoryChange, taskCounts, onTaskDrop }: SidebarProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent, category: TaskCategory) => {
    e.preventDefault();
    
    try {
      if (!e.dataTransfer) return;
      
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const { taskId } = dragData;
      
      if (taskId && onTaskDrop) {
        onTaskDrop(taskId, category);
      }
    } catch (error) {
      console.error('Error processing drop on sidebar:', error);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Task Management</h1>
      </div>
      <nav className="sidebar-nav">
        {Object.entries(categoryLabels).map(([category, label]) => (
          <button
            key={category}
            className={`nav-item ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category as TaskCategory)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, category as TaskCategory)}
            aria-pressed={activeCategory === category}
            aria-label={`${label} (${taskCounts[category as TaskCategory]} Aufgaben)`}
          >
            <span className="nav-icon">{categoryIcons[category as TaskCategory]}</span>
            <span className="nav-label">{label}</span>
            <span className="nav-count">{taskCounts[category as TaskCategory]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}; 
