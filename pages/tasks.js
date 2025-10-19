import { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [reminders, setReminders] = useState([])
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [isRecording, setIsRecording] = useState(false)

  // Load tasks and reminders from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    const savedReminders = localStorage.getItem('reminders')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedReminders) setReminders(JSON.parse(savedReminders))
  }, [])

  // Kanban columns configuration
  const columns = ['To Do', 'In Progress', 'Done']

  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status)
    return acc
  }, {})

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id)
  }

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTaskId(null)

    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    const overColumn = over.id

    if (activeTask && columns.includes(overColumn)) {
      const updatedTasks = tasks.map(task =>
        task.id === active.id ? { ...task, status: overColumn } : task
      )
      setTasks(updatedTasks)
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    }
  }

  // Add new task
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: 'To Do',
      createdAt: new Date().toISOString(),
      priority: taskData.priority || 'medium'
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  // Add new reminder
  const addReminder = (reminderData) => {
    const newReminder = {
      id: Date.now().toString(),
      text: reminderData.text || 'New Reminder',
      targetDate: reminderData.targetDate || new Date().toISOString(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    const updatedReminders = [...reminders, newReminder]
    setReminders(updatedReminders)
    localStorage.setItem('reminders', JSON.stringify(updatedReminders))
  }

  // Toggle reminder completion
  const toggleReminder = (id) => {
    const updatedReminders = reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    )
    setReminders(updatedReminders)
    localStorage.setItem('reminders', JSON.stringify(updatedReminders))
  }

  // Delete reminder
  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(r => r.id !== id)
    setReminders(updatedReminders)
    localStorage.setItem('reminders', JSON.stringify(updatedReminders))
  }

  // Voice Recognition Handler
  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported. Please use Chrome.')
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    setIsRecording(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log('Voice input:', transcript)

      // Simple AI parsing: Check if it contains reminder keywords
      if (transcript.toLowerCase().includes('remind') || transcript.toLowerCase().includes('reminder')) {
        // Extract reminder text
        const reminderText = transcript.replace(/remind me to|reminder to|reminder|remind/gi, '').trim()
        addReminder({ text: reminderText })
      } else {
        // Otherwise create as task
        addTask({ title: transcript })
      }

      setIsRecording(false)
    }

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  return (
    <div className="tasks-page-container">
      {/* Header with Voice AI Assistant */}
      <div className="tasks-header">
        <h1 className="tasks-page-title">📋 Tasks & Reminders</h1>
        <button
          className={`ai-voice-button ${isRecording ? 'recording' : ''}`}
          onClick={startVoiceRecording}
          title="AI Voice Assistant - Say a task or reminder"
        >
          {isRecording ? '🔴 Listening...' : '🎙️ Voice Assistant'}
        </button>
      </div>

      {/* Main Layout: Kanban (70%) + Reminders (30%) */}
      <div className="tasks-main-layout">
        {/* Primary Container - Kanban Board */}
        <div className="kanban-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="kanban-columns">
              {columns.map(status => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                  onAddTask={addTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTaskId ? (
                <TaskCard
                  task={tasks.find(t => t.id === activeTaskId)}
                  isDragging
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Secondary Container - Reminders Checklist */}
        <div className="reminders-container">
          <div className="reminders-header">
            <h2 className="reminders-title">🔔 Reminders</h2>
            <button
              className="add-reminder-btn"
              onClick={() => {
                const text = prompt('Enter reminder:')
                if (text) addReminder({ text })
              }}
            >
              + Add
            </button>
          </div>

          <div className="reminders-list">
            {reminders.length === 0 ? (
              <p className="empty-state">No reminders yet. Use voice to add one!</p>
            ) : (
              reminders.map(reminder => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onToggle={toggleReminder}
                  onDelete={deleteReminder}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tasks-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        .tasks-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.9);
          padding: 20px 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tasks-page-title {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .ai-voice-button {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .ai-voice-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        .ai-voice-button.recording {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .tasks-main-layout {
          display: grid;
          grid-template-columns: 70% 30%;
          gap: 20px;
          height: calc(100vh - 140px);
        }

        .kanban-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .kanban-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          height: 100%;
        }

        .reminders-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        .reminders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(0, 0, 0, 0.08);
        }

        .reminders-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .add-reminder-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-reminder-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .reminders-list {
          flex: 1;
          overflow-y: auto;
        }

        .empty-state {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          margin-top: 40px;
        }

        @media (max-width: 1024px) {
          .tasks-main-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }
        }
      `}</style>
    </div>
  )
}

// Kanban Column Component
function KanbanColumn({ status, tasks, onAddTask }) {
  const getStatusColor = () => {
    if (status === 'To Do') return '#3b82f6'
    if (status === 'In Progress') return '#f59e0b'
    if (status === 'Done') return '#10b981'
    return '#9ca3af'
  }

  return (
    <div className="kanban-column" data-status={status}>
      <div className="column-header" style={{ backgroundColor: getStatusColor() }}>
        <h3 className="column-title">{status}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="column-content">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <p className="empty-column">No tasks</p>
        )}
      </div>

      <style jsx>{`
        .kanban-column {
          display: flex;
          flex-direction: column;
          background: #f9fafb;
          border-radius: 8px;
          height: 100%;
          overflow: hidden;
        }

        .column-header {
          padding: 12px 16px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .column-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .task-count {
          background: rgba(255, 255, 255, 0.3);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
        }

        .column-content {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .empty-column {
          text-align: center;
          color: #9ca3af;
          font-size: 13px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  )
}

// Task Card Component
function TaskCard({ task, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority) => {
    if (priority === 'high') return '#ef4444'
    if (priority === 'medium') return '#f59e0b'
    return '#10b981'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <span
          className="priority-badge"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {task.priority || 'medium'}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <span className="task-date">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      <style jsx>{`
        .task-card {
          background: white;
          border-radius: 8px;
          padding: 14px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          cursor: grab;
          transition: all 0.2s;
          border-left: 4px solid ${getPriorityColor(task.priority)};
        }

        .task-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .task-card.dragging {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          cursor: grabbing;
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }

        .task-title {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          flex: 1;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .task-description {
          margin: 0 0 10px 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-date {
          font-size: 11px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

// Reminder Item Component
function ReminderItem({ reminder, onToggle, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`reminder-item ${reminder.completed ? 'completed' : ''}`}>
      <label className="reminder-checkbox">
        <input
          type="checkbox"
          checked={reminder.completed}
          onChange={() => onToggle(reminder.id)}
        />
        <span className="checkmark"></span>
      </label>

      <div className="reminder-content">
        <p className="reminder-text">{reminder.text}</p>
        <span className="reminder-date">
          📅 {formatDate(reminder.targetDate)}
        </span>
      </div>

      <button
        className="delete-reminder-btn"
        onClick={() => onDelete(reminder.id)}
        title="Delete reminder"
      >
        ×
      </button>

      <style jsx>{`
        .reminder-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border-radius: 8px;
          margin-bottom: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 0.2s;
          border-left: 3px solid #6366f1;
        }

        .reminder-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .reminder-item.completed {
          opacity: 0.6;
          border-left-color: #9ca3af;
        }

        .reminder-item.completed .reminder-text {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .reminder-checkbox {
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }

        .reminder-checkbox input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #6366f1;
        }

        .reminder-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reminder-text {
          margin: 0;
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
        }

        .reminder-date {
          font-size: 12px;
          color: #6b7280;
        }

        .delete-reminder-btn {
          background: rgba(239, 68, 68, 0.1);
          border: none;
          color: #ef4444;
          font-size: 20px;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .delete-reminder-btn:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  )
}
