import { useState, useRef } from 'react';
import type { Task, TaskCategory } from '../types/Task';

interface DragAndDropTaskListProps {
  tasks: Task[];
  category: TaskCategory;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, category: TaskCategory) => void;
  onEdit: (task: Task) => void;
  onReorder: (category: TaskCategory, taskIds: string[]) => void;
}

export const DragAndDropTaskList = ({ 
  tasks, 
  category, 
  onToggleComplete, 
  onDelete, 
  onMove, 
  onEdit,
  onReorder 
}: DragAndDropTaskListProps) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverTask, setDragOverTask] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', taskId);
      e.dataTransfer.setData('application/json', JSON.stringify({ taskId, sourceCategory: category }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragEnter = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    if (draggedTask !== taskId) {
      setDragOverTask(taskId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTask(null);
  };

  const handleDrop = (e: React.DragEvent, dropTaskId: string) => {
    e.preventDefault();
    
    try {
      if (!e.dataTransfer) return;
      
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const { taskId: draggedTaskId, sourceCategory } = dragData;
      
      if (draggedTaskId && draggedTaskId !== dropTaskId) {
        // If dropping on a task in the same category, reorder
        if (sourceCategory === category) {
          const draggedIndex = tasks.findIndex(task => task.id === draggedTaskId);
          const dropIndex = tasks.findIndex(task => task.id === dropTaskId);
          
          if (draggedIndex !== -1 && dropIndex !== -1) {
            const newTaskOrder = [...tasks];
            const [draggedTaskItem] = newTaskOrder.splice(draggedIndex, 1);
            newTaskOrder.splice(dropIndex, 0, draggedTaskItem);
            
            const taskIds = newTaskOrder.map(task => task.id);
            onReorder(category, taskIds);
          }
        } else {
          // If dropping on a task in a different category, move the task
          onMove(draggedTaskId, category);
        }
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    }
    
    setDraggedTask(null);
    setDragOverTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Keine Aufgaben in dieser Kategorie.</p>
        <p className="drag-hint">Ziehen Sie Aufgaben hierher, um sie in diese Kategorie zu verschieben.</p>
      </div>
    );
  }

  return (
    <div className="task-list" ref={dragRef}>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''} ${
            draggedTask === task.id ? 'dragging' : ''
          } ${dragOverTask === task.id ? 'drag-over' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, task.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, task.id)}
          onDragEnd={handleDragEnd}
        >
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
                    📅 {task.dueDate.toLocaleDateString('de-DE')}
                  </span>
                )}
                {task.priority && (
                  <span 
                    className="task-priority"
                    style={{ 
                      backgroundColor: 
                        task.priority === 'high' ? '#f87171' :
                        task.priority === 'medium' ? '#fbbf24' : '#4ade80'
                    }}
                  >
                    {task.priority}
                  </span>
                )}
                <span className="task-created">
                  Erstellt: {task.createdAt.toLocaleDateString('de-DE')}
                </span>
              </div>
            </div>
          </div>
          <div className="task-actions">
            <button
              onClick={() => onEdit(task)}
              className="edit-btn"
              title="Aufgabe bearbeiten"
            >
              ✏️
            </button>
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
