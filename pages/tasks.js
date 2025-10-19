import { useState, useEffect } from 'react'
import packageJson from '../package.json'
import Head from 'next/head'

export default function RemindersPage() {
  const [reminders, setReminders] = useState([])
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    text: '',
    targetDate: new Date(),
    targetTime: '09:00',
    recurring: false,
    recurringType: 'daily'
  })

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders')
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    } else {
      // Generate sample reminders
      const sampleReminders = generateSampleReminders()
      setReminders(sampleReminders)
      localStorage.setItem('reminders', JSON.stringify(sampleReminders))
    }
  }, [])

  // Save reminders whenever they change
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem('reminders', JSON.stringify(reminders))
    }
  }, [reminders])

  const addReminder = () => {
    const targetDateTime = new Date(newReminder.targetDate)
    const [hours, minutes] = newReminder.targetTime.split(':')
    targetDateTime.setHours(parseInt(hours), parseInt(minutes))

    const reminder = {
      id: `reminder-${Date.now()}`,
      text: newReminder.text,
      targetDate: targetDateTime.toISOString(),
      completed: false,
      recurring: newReminder.recurring,
      recurringType: newReminder.recurringType
    }

    setReminders([...reminders, reminder])
    setShowAddReminder(false)
    setNewReminder({
      text: '',
      targetDate: new Date(),
      targetTime: '09:00',
      recurring: false,
      recurringType: 'daily'
    })
  }

  const toggleReminder = (id) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ))
  }

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  // Categorize reminders
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekFromNow = new Date(today)
  weekFromNow.setDate(today.getDate() + 7)
  const monthFromNow = new Date(today)
  monthFromNow.setDate(today.getDate() + 30)

  const pastReminders = reminders.filter(r => {
    const rDate = new Date(r.targetDate)
    return rDate < today && !r.completed && !r.recurring
  }).sort((a, b) => new Date(b.targetDate) - new Date(a.targetDate))

  const todayReminders = reminders.filter(r => {
    const rDate = new Date(r.targetDate)
    return rDate >= today && rDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
  }).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))

  const upcomingReminders = reminders.filter(r => {
    const rDate = new Date(r.targetDate)
    return rDate >= new Date(today.getTime() + 24 * 60 * 60 * 1000) && rDate < weekFromNow && !r.recurring
  }).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))

  const futureReminders = reminders.filter(r => {
    const rDate = new Date(r.targetDate)
    return rDate >= weekFromNow && rDate < monthFromNow && !r.recurring
  }).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))

  const recurringReminders = reminders.filter(r => r.recurring)
    .sort((a, b) => a.text.localeCompare(b.text))

  return (
    <>
      <Head>
        <title>Reminders | ProdyJEE</title>
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'white' }}>🔔 Reminders</h1>
            </div>
            <span style={{ fontSize: '13px', color: 'white', opacity: 0.7 }}>v{packageJson.version}</span>
          </div>
        </nav>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
          {/* Header with Add Button */}
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
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'white' }}>
                Manage Your Reminders
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                {reminders.length} total reminders
              </p>
            </div>

            <button onClick={() => setShowAddReminder(true)} style={{
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
              + Add Reminder
            </button>
          </div>

          {/* Reminders Container */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* 1. Past Reminders */}
              <ReminderSection
                title="⏰ Past Reminders (Overdue)"
                color="#ef4444"
                reminders={pastReminders}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
                emptyMessage="No overdue reminders"
              />

              {/* 2. Today's Reminders */}
              <ReminderSection
                title="📅 Today's Reminders"
                color="#f59e0b"
                reminders={todayReminders}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
                emptyMessage="No reminders for today"
                showTime={true}
              />

              {/* 3. Upcoming Reminders (This Week) */}
              <ReminderSection
                title="📆 Upcoming Reminders (This Week)"
                color="#3b82f6"
                reminders={upcomingReminders}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
                emptyMessage="No upcoming reminders this week"
              />

              {/* 4. Future Reminders (This Month) */}
              <ReminderSection
                title="📌 Future Reminders (This Month)"
                color="#8b5cf6"
                reminders={futureReminders}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
                emptyMessage="No future reminders this month"
              />

              {/* 5. Recurring Reminders (Annually) */}
              <ReminderSection
                title="🔄 Recurring Reminders"
                color="#10b981"
                reminders={recurringReminders}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
                emptyMessage="No recurring reminders"
                showRecurring={true}
              />
            </div>
          </div>
        </div>

        {/* Add Reminder Modal */}
        {showAddReminder && (
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
              <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700' }}>Add New Reminder</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Reminder Text</label>
                  <textarea
                    value={newReminder.text}
                    onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px',
                      minHeight: '80px'
                    }}
                    placeholder="Enter reminder text..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Date</label>
                    <input
                      type="date"
                      value={newReminder.targetDate.toISOString().split('T')[0]}
                      onChange={(e) => setNewReminder({ ...newReminder, targetDate: new Date(e.target.value) })}
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
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Time</label>
                    <input
                      type="time"
                      value={newReminder.targetTime}
                      onChange={(e) => setNewReminder({ ...newReminder, targetTime: e.target.value })}
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

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newReminder.recurring}
                      onChange={(e) => setNewReminder({ ...newReminder, recurring: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>Make this a recurring reminder</span>
                  </label>
                </div>

                {newReminder.recurring && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Recurring Type</label>
                    <select
                      value={newReminder.recurringType}
                      onChange={(e) => setNewReminder({ ...newReminder, recurringType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    onClick={addReminder}
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
                    Add Reminder
                  </button>
                  <button
                    onClick={() => setShowAddReminder(false)}
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
      </div>
    </>
  )
}

// Reminder Section Component
function ReminderSection({ title, color, reminders, onToggle, onDelete, emptyMessage, showTime, showRecurring }) {
  return (
    <div>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '4px',
          height: '24px',
          background: color,
          borderRadius: '2px'
        }}></div>
        {title}
        <span style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {reminders.length}
        </span>
      </h3>

      {reminders.length === 0 ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px'
        }}>
          {emptyMessage}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {reminders.map(reminder => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              color={color}
              onToggle={onToggle}
              onDelete={onDelete}
              showTime={showTime}
              showRecurring={showRecurring}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Reminder Item Component
function ReminderItem({ reminder, color, onToggle, onDelete, showTime, showRecurring }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(showTime && { hour: '2-digit', minute: '2-digit' })
    })
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '16px',
      borderLeft: `4px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s'
    }}>
      <input
        type="checkbox"
        checked={reminder.completed}
        onChange={() => onToggle(reminder.id)}
        style={{
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          accentColor: color,
          flexShrink: 0
        }}
      />

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: reminder.completed ? '#9ca3af' : '#1f2937',
          textDecoration: reminder.completed ? 'line-through' : 'none',
          marginBottom: '4px'
        }}>
          {reminder.text}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            📅 {formatDate(reminder.targetDate)}
          </span>

          {reminder.recurring && showRecurring && (
            <span style={{
              fontSize: '11px',
              background: color,
              color: 'white',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: '600'
            }}>
              🔄 {reminder.recurringType}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(reminder.id)}
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: 'none',
          color: '#ef4444',
          fontSize: '18px',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#ef4444'
          e.target.style.color = 'white'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(239, 68, 68, 0.1)'
          e.target.style.color = '#ef4444'
        }}
      >
        ×
      </button>
    </div>
  )
}

// Generate sample reminders
function generateSampleReminders() {
  const today = new Date()
  const reminders = []

  // Past reminders (2 days ago)
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(today.getDate() - 2)
  reminders.push({
    id: 'reminder-past-1',
    text: 'Submit Physics assignment',
    targetDate: twoDaysAgo.toISOString(),
    completed: false,
    recurring: false
  })

  // Today's reminders
  const todayMorning = new Date(today)
  todayMorning.setHours(9, 0, 0, 0)
  reminders.push({
    id: 'reminder-today-1',
    text: 'Morning study session - Physics',
    targetDate: todayMorning.toISOString(),
    completed: false,
    recurring: false
  })

  const todayAfternoon = new Date(today)
  todayAfternoon.setHours(14, 0, 0, 0)
  reminders.push({
    id: 'reminder-today-2',
    text: 'Chemistry lab work',
    targetDate: todayAfternoon.toISOString(),
    completed: false,
    recurring: false
  })

  // Upcoming (this week)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)
  reminders.push({
    id: 'reminder-upcoming-1',
    text: 'Math mock test',
    targetDate: tomorrow.toISOString(),
    completed: false,
    recurring: false
  })

  const threeDays = new Date(today)
  threeDays.setDate(today.getDate() + 3)
  threeDays.setHours(15, 0, 0, 0)
  reminders.push({
    id: 'reminder-upcoming-2',
    text: 'Review weekly progress',
    targetDate: threeDays.toISOString(),
    completed: false,
    recurring: false
  })

  // Future (this month)
  const twoWeeks = new Date(today)
  twoWeeks.setDate(today.getDate() + 14)
  twoWeeks.setHours(9, 0, 0, 0)
  reminders.push({
    id: 'reminder-future-1',
    text: 'Monthly test preparation',
    targetDate: twoWeeks.toISOString(),
    completed: false,
    recurring: false
  })

  // Recurring reminders
  const recurringMorning = new Date(today)
  recurringMorning.setHours(6, 0, 0, 0)
  reminders.push({
    id: 'reminder-recurring-1',
    text: 'Morning exercise and meditation',
    targetDate: recurringMorning.toISOString(),
    completed: false,
    recurring: true,
    recurringType: 'daily'
  })

  const recurringEvening = new Date(today)
  recurringEvening.setHours(21, 0, 0, 0)
  reminders.push({
    id: 'reminder-recurring-2',
    text: 'Review day\'s learning',
    targetDate: recurringEvening.toISOString(),
    completed: false,
    recurring: true,
    recurringType: 'daily'
  })

  const recurringWeekly = new Date(today)
  recurringWeekly.setHours(10, 0, 0, 0)
  reminders.push({
    id: 'reminder-recurring-3',
    text: 'Weekly progress review',
    targetDate: recurringWeekly.toISOString(),
    completed: false,
    recurring: true,
    recurringType: 'weekly'
  })

  return reminders
}
