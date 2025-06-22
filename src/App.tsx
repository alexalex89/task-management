import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { DragAndDropTaskList } from './components/DragAndDropTaskList'
import { AddTaskForm } from './components/AddTaskForm'
import { EditTaskForm } from './components/EditTaskForm'
import { useTasks } from './hooks/useTasks'
import type { TaskCategory, Task } from './types/Task'
import './App.css'

function App() {
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('inbox')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const { 
    tasks, 
    addTask, 
    editTask,
    toggleTaskComplete, 
    deleteTask, 
    moveTask, 
    reorderTasks,
    getTasksByCategory 
  } = useTasks()

  const taskCounts = {
    inbox: getTasksByCategory('inbox').length,
    next: getTasksByCategory('next').length,
    waiting: getTasksByCategory('waiting').length,
    scheduled: getTasksByCategory('scheduled').length,
    someday: getTasksByCategory('someday').length,
  }

  const currentTasks = getTasksByCategory(activeCategory)

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (editData: any) => {
    editTask(editData)
    setIsEditModalOpen(false)
    setEditingTask(null)
  }

  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setEditingTask(null)
  }

  const handleReorder = (category: TaskCategory, taskIds: string[]) => {
    reorderTasks(category, taskIds)
  }

  const handleTaskDropOnSidebar = (taskId: string, targetCategory: TaskCategory) => {
    moveTask(taskId, targetCategory)
  }

  return (
    <div className="app">
      <Sidebar 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        taskCounts={taskCounts}
        onTaskDrop={handleTaskDropOnSidebar}
      />
      <main className="main-content">
        <div className="content-header">
          <h2>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h2>
          <p>{currentTasks.length} Aufgabe{currentTasks.length !== 1 ? 'n' : ''}</p>
        </div>
        
        <AddTaskForm 
          onAddTask={addTask}
          currentCategory={activeCategory}
        />
        
        <DragAndDropTaskList
          tasks={currentTasks}
          category={activeCategory}
          onToggleComplete={toggleTaskComplete}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={handleEditTask}
          onReorder={handleReorder}
        />

        {editingTask && (
          <EditTaskForm
            task={editingTask}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            isOpen={isEditModalOpen}
          />
        )}
      </main>
    </div>
  )
}

export default App
