import { useState, useEffect } from 'react'
import packageJson from '../package.json'
import Head from 'next/head'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()))
  const [tasks, setTasks] = useState([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null) // For viewing task details
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    subject: 'Physics',
    mood: '😐',
    energy: 'High Focus',
    tags: [],
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00'
  })

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('weekly-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Generate sample tasks
      const sampleTasks = generateSampleTasks()
      setTasks(sampleTasks)
      localStorage.setItem('weekly-tasks', JSON.stringify(sampleTasks))
    }
  }, [])

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('weekly-tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  function getWeekStart(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  function getWeekDays(weekStart) {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date
    })
  }

  const weekDays = getWeekDays(currentWeek)

  // Generate 24 hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Group tasks by date and time
  const getTasksForSlot = (date, hour) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date)
      const taskHour = parseInt(task.startTime.split(':')[0])
      return (
        taskDate.toDateString() === date.toDateString() &&
        taskHour === hour
      )
    })
  }

  const addTask = () => {
    const task = {
      id: `task-${Date.now()}`,
      ...newTask,
      completed: false
    }
    setTasks([...tasks, task])
    setShowAddTask(false)
    setNewTask({
      title: '',
      description: '',
      subject: 'Physics',
      mood: '😐',
      energy: 'High Focus',
      tags: [],
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00'
    })
  }

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const changeWeek = (direction) => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction * 7))
    setCurrentWeek(newWeek)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    // Extract date and hour from drop zone id
    const [_, dateStr, hourStr] = over.id.split('_')
    const targetDate = new Date(dateStr)
    const targetHour = parseInt(hourStr)

    // Validate date before converting to ISO
    if (isNaN(targetDate.getTime()) || isNaN(targetHour)) {
      console.error('Invalid date or hour:', dateStr, hourStr)
      return
    }

    setTasks(tasks.map(task => {
      if (task.id === active.id) {
        return {
          ...task,
          date: targetDate.toISOString(),
          startTime: `${targetHour.toString().padStart(2, '0')}:00`,
          endTime: `${(targetHour + 1).toString().padStart(2, '0')}:00`
        }
      }
      return task
    }))
  }

  // Handle double-click on time slot to add task
  const handleSlotDoubleClick = (date, hour) => {
    setNewTask({
      ...newTask,
      date: date,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
    })
    setShowAddTask(true)
  }

  // Handle clicking on a task to view details
  const handleTaskClick = (task, event) => {
    // Prevent drag from interfering
    if (event.detail === 1) { // Single click
      event.stopPropagation()
      setSelectedTask(task)
    }
  }

  return (
    <>
      <Head>
        <title>Tasks Schedule | ProdyJEE</title>
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Navigation */}
        <nav style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '16px 32px'
        }}>
          <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a href="/dashboard" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                opacity: 0.9,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'opacity 0.2s'
              }}>
                ← Back
              </a>
              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.3)', height: '24px' }}></div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'white' }}>📋 Weekly Tasks Schedule</h1>
            </div>
            <span style={{ fontSize: '13px', color: 'white', opacity: 0.7 }}>v{packageJson.version}</span>
          </div>
        </nav>

        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '24px' }}>
          {/* Header Controls */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => changeWeek(-1)} style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                ←
              </button>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'white' }}>
                {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <button onClick={() => changeWeek(1)} style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                →
              </button>
            </div>

            <button onClick={() => setShowAddTask(true)} style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)'
            }}>
              + Add Task
            </button>
          </div>

          {/* Weekly Calendar Grid with 24-hour timeline */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '16px',
              overflowX: 'auto'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '8px', minWidth: '1200px' }}>
                {/* Header Row */}
                <div style={{ fontWeight: '700', color: 'white', padding: '12px', textAlign: 'center' }}>Time</div>
                {weekDays.map((day, i) => (
                  <div key={i} style={{
                    fontWeight: '700',
                    color: 'white',
                    padding: '12px',
                    textAlign: 'center',
                    background: day.toDateString() === new Date().toDateString() ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}>
                    <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div style={{ fontSize: '20px', marginTop: '4px' }}>{day.getDate()}</div>
                  </div>
                ))}

                {/* Time Slots (24 hours) */}
                {hours.map(hour => (
                  <>
                    {/* Hour Label */}
                    <div key={`hour-${hour}`} style={{
                      padding: '8px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {hour.toString().padStart(2, '0')}:00
                    </div>

                    {/* Day Columns */}
                    {weekDays.map((day, dayIndex) => {
                      const slotTasks = getTasksForSlot(day, hour)
                      const dropZoneId = `slot_${day.toISOString()}_${hour}`
                      const hasContent = slotTasks.length > 0

                      return (
                        <SortableContext key={dropZoneId} id={dropZoneId} items={slotTasks.map(t => t.id)}>
                          <div
                            id={dropZoneId}
                            onDoubleClick={() => handleSlotDoubleClick(day, hour)}
                            style={{
                              minHeight: hasContent ? '80px' : '40px', // Compressed height for empty slots
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '6px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              cursor: hasContent ? 'default' : 'pointer',
                              transition: 'all 0.2s ease',
                              border: '1px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                              if (!hasContent) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!hasContent) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                                e.currentTarget.style.borderColor = 'transparent'
                              }
                            }}
                          >
                            {slotTasks.map(task => (
                              <TaskCard
                                key={task.id}
                                task={task}
                                onToggleComplete={toggleTaskComplete}
                                onDelete={deleteTask}
                                onClick={handleTaskClick}
                              />
                            ))}
                            {!hasContent && (
                              <div style={{
                                fontSize: '10px',
                                color: 'rgba(255, 255, 255, 0.3)',
                                textAlign: 'center',
                                fontStyle: 'italic',
                                userSelect: 'none'
                              }}>
                                Double-click to add
                              </div>
                            )}
                          </div>
                        </SortableContext>
                      )
                    })}
                  </>
                ))}
              </div>
            </div>
          </DndContext>
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700' }}>Add New Task</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px'
                    }}
                    placeholder="Task title..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px',
                      minHeight: '80px'
                    }}
                    placeholder="Task description..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Subject</label>
                    <select
                      value={newTask.subject}
                      onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    >
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                      <option>Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Mood</label>
                    <select
                      value={newTask.mood}
                      onChange={(e) => setNewTask({ ...newTask, mood: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    >
                      <option>😐</option>
                      <option>😓</option>
                      <option>💪</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Energy Level</label>
                  <select
                    value={newTask.energy}
                    onChange={(e) => setNewTask({ ...newTask, energy: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px'
                    }}
                  >
                    <option>High Focus</option>
                    <option>Light Review</option>
                    <option>Creative</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Date</label>
                    <input
                      type="date"
                      value={newTask.date.toISOString().split('T')[0]}
                      onChange={(e) => setNewTask({ ...newTask, date: new Date(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Start Time</label>
                    <input
                      type="time"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>End Time</label>
                    <input
                      type="time"
                      value={newTask.endTime}
                      onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    onClick={addTask}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddTask(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: 'white',
                      color: '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {selectedTask && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setSelectedTask(null)}
          >
            <div 
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '32px' }}>{selectedTask.mood}</span>
                    <input
                      type="checkbox"
                      checked={selectedTask.completed}
                      onChange={() => {
                        toggleTaskComplete(selectedTask.id)
                        setSelectedTask({ ...selectedTask, completed: !selectedTask.completed })
                      }}
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        cursor: 'pointer',
                        accentColor: selectedTask.subject === 'Physics' ? '#3b82f6' : 
                                    selectedTask.subject === 'Chemistry' ? '#10b981' : 
                                    selectedTask.subject === 'Mathematics' ? '#8b5cf6' : '#6b7280'
                      }}
                    />
                  </div>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: '28px', 
                    fontWeight: '700',
                    color: selectedTask.completed ? '#9ca3af' : '#1f2937',
                    textDecoration: selectedTask.completed ? 'line-through' : 'none'
                  }}>
                    {selectedTask.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px',
                    lineHeight: 1
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Task Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Description */}
                {selectedTask.description && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Description
                    </label>
                    <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
                      {selectedTask.description}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Subject
                    </label>
                    <div style={{
                      display: 'inline-block',
                      background: selectedTask.subject === 'Physics' ? '#3b82f6' : 
                                 selectedTask.subject === 'Chemistry' ? '#10b981' : 
                                 selectedTask.subject === 'Mathematics' ? '#8b5cf6' : '#6b7280',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {selectedTask.subject}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Energy Level
                    </label>
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500',
                      padding: '8px 0'
                    }}>
                      {selectedTask.energy}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Date
                    </label>
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500',
                      padding: '8px 0'
                    }}>
                      {new Date(selectedTask.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Time Slot
                    </label>
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500',
                      padding: '8px 0'
                    }}>
                      {selectedTask.startTime} - {selectedTask.endTime}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '16px', 
                  paddingTop: '20px', 
                  borderTop: '1px solid #e5e7eb' 
                }}>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this task?')) {
                        deleteTask(selectedTask.id)
                        setSelectedTask(null)
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #ef4444',
                      background: 'white',
                      color: '#ef4444',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ef4444'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.color = '#ef4444'
                    }}
                  >
                    🗑️ Delete Task
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Task Card Component (Kanban style, no dashed border)
function TaskCard({ task, onToggleComplete, onDelete, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const getSubjectColor = (subject) => {
    if (subject === 'Physics') return '#3b82f6'
    if (subject === 'Chemistry') return '#10b981'
    if (subject === 'Mathematics') return '#8b5cf6'
    return '#6b7280'
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'white',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        borderLeft: `4px solid ${getSubjectColor(task.subject)}`,
        cursor: 'grab'
      }}
      {...attributes}
      {...listeners}
      onClick={(e) => onClick && onClick(task, e)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation()
            onToggleComplete(task.id)
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: getSubjectColor(task.subject) }}
        />
        <span style={{ fontSize: '14px' }}>{task.mood}</span>
      </div>

      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: task.completed ? '#9ca3af' : '#1f2937',
        textDecoration: task.completed ? 'line-through' : 'none',
        marginBottom: '4px',
        lineHeight: '1.3'
      }}>
        {task.title}
      </div>

      {task.description && (
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', lineHeight: '1.3' }}>
          {task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{
          fontSize: '9px',
          background: getSubjectColor(task.subject),
          color: 'white',
          padding: '3px 6px',
          borderRadius: '4px',
          fontWeight: '600'
        }}>
          {task.subject}
        </span>
        <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
          {task.startTime} - {task.endTime}
        </span>
      </div>
    </div>
  )
}

// Generate sample tasks
function generateSampleTasks() {
  const tasks = []
  const today = new Date()

  // Get current week dates
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)

    // Morning task
    tasks.push({
      id: `task-${Date.now()}-${i}-1`,
      title: 'Physics: NCERT Reading',
      description: 'Ch. 3 - Motion in a Straight Line',
      subject: 'Physics',
      mood: '💪',
      energy: 'High Focus',
      date: date.toISOString(),
      startTime: '09:00',
      endTime: '10:00',
      completed: false
    })

    // Afternoon task
    if (i < 5) { // Weekdays only
      tasks.push({
        id: `task-${Date.now()}-${i}-2`,
        title: 'Chemistry: Solve MCQs',
        description: '15 questions on Chemical Bonding',
        subject: 'Chemistry',
        mood: '😐',
        energy: 'High Focus',
        date: date.toISOString(),
        startTime: '14:00',
        endTime: '15:00',
        completed: false
      })
    }
  }

  return tasks
}
