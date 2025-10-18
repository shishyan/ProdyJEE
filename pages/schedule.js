import { useState, useEffect } from 'react'
import packageJson from '../package.json'
import Head from 'next/head'

// Sample CBSE Weekly Class Schedule
const cbseSchedule = {
  Monday: [
    { time: '8:00-8:45', subject: 'Mathematics', type: 'class', color: '#FF6B6B' },
    { time: '8:45-9:30', subject: 'Physics', type: 'class', color: '#4ECDC4' },
    { time: '9:30-9:45', subject: 'Break', type: 'break', color: '#95E1D3' },
    { time: '9:45-10:30', subject: 'Chemistry', type: 'class', color: '#F38181' },
    { time: '10:30-11:15', subject: 'English', type: 'class', color: '#AA96DA' },
    { time: '11:15-12:00', subject: 'Physical Education', type: 'class', color: '#FCBAD3' }
  ],
  Tuesday: [
    { time: '8:00-8:45', subject: 'Chemistry', type: 'class', color: '#F38181' },
    { time: '8:45-9:30', subject: 'Mathematics', type: 'class', color: '#FF6B6B' },
    { time: '9:30-9:45', subject: 'Break', type: 'break', color: '#95E1D3' },
    { time: '9:45-10:30', subject: 'Physics', type: 'class', color: '#4ECDC4' },
    { time: '10:30-11:15', subject: 'Computer Science', type: 'class', color: '#A8E6CF' },
    { time: '11:15-12:00', subject: 'English', type: 'class', color: '#AA96DA' }
  ],
  Wednesday: [
    { time: '8:00-8:45', subject: 'Physics', type: 'class', color: '#4ECDC4' },
    { time: '8:45-9:30', subject: 'Chemistry', type: 'class', color: '#F38181' },
    { time: '9:30-9:45', subject: 'Break', type: 'break', color: '#95E1D3' },
    { time: '9:45-10:30', subject: 'Mathematics', type: 'class', color: '#FF6B6B' },
    { time: '10:30-11:15', subject: 'English', type: 'class', color: '#AA96DA' },
    { time: '11:15-12:00', subject: 'Library', type: 'class', color: '#FFD3B6' }
  ],
  Thursday: [
    { time: '8:00-8:45', subject: 'Mathematics', type: 'class', color: '#FF6B6B' },
    { time: '8:45-9:30', subject: 'Physics', type: 'class', color: '#4ECDC4' },
    { time: '9:30-9:45', subject: 'Break', type: 'break', color: '#95E1D3' },
    { time: '9:45-10:30', subject: 'Computer Science', type: 'class', color: '#A8E6CF' },
    { time: '10:30-11:15', subject: 'Chemistry', type: 'class', color: '#F38181' },
    { time: '11:15-12:00', subject: 'English', type: 'class', color: '#AA96DA' }
  ],
  Friday: [
    { time: '8:00-8:45', subject: 'Chemistry', type: 'class', color: '#F38181' },
    { time: '8:45-9:30', subject: 'Mathematics', type: 'class', color: '#FF6B6B' },
    { time: '9:30-9:45', subject: 'Break', type: 'break', color: '#95E1D3' },
    { time: '9:45-10:30', subject: 'Physics', type: 'class', color: '#4ECDC4' },
    { time: '10:30-11:15', subject: 'English', type: 'class', color: '#AA96DA' },
    { time: '11:15-12:00', subject: 'Arts/Music', type: 'class', color: '#FFAAA5' }
  ],
  Saturday: [
    { time: '8:00-8:45', subject: 'Lab - Physics', type: 'lab', color: '#4ECDC4' },
    { time: '8:45-9:30', subject: 'Lab - Chemistry', type: 'lab', color: '#F38181' },
    { time: '9:30-9:45', subject: 'Break', type: 'break', color: '#95E1D3' },
    { time: '9:45-10:30', subject: 'Lab - Computer', type: 'lab', color: '#A8E6CF' },
    { time: '10:30-11:15', subject: 'Sports', type: 'class', color: '#FCBAD3' },
    { time: '11:15-12:00', subject: 'Club Activities', type: 'class', color: '#C7CEEA' }
  ],
  Sunday: []
}

// School Holidays (Indian festivals + school breaks)
const schoolHolidays = [
  { date: '2025-01-26', name: 'Republic Day', color: '#FF9933' },
  { date: '2025-03-08', name: 'Holi', color: '#FF69B4' },
  { date: '2025-04-10', name: 'Ugadi/Gudi Padwa', color: '#FFD700' },
  { date: '2025-04-14', name: 'Ambedkar Jayanti', color: '#4169E1' },
  { date: '2025-05-01', name: 'May Day', color: '#DC143C' },
  { date: '2025-08-15', name: 'Independence Day', color: '#FF9933' },
  { date: '2025-08-27', name: 'Janmashtami', color: '#9370DB' },
  { date: '2025-10-02', name: 'Gandhi Jayanti', color: '#228B22' },
  { date: '2025-10-24', name: 'Dussehra', color: '#FF4500' },
  { date: '2025-11-12', name: 'Diwali', color: '#FFD700' },
  { date: '2025-12-25', name: 'Christmas', color: '#DC143C' }
]

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [studyPlans, setStudyPlans] = useState([])
  const [menstrualCycle, setMenstrualCycle] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [view, setView] = useState('week') // month, week, day - default to weekly
  const [newEventForm, setNewEventForm] = useState({ title: '', type: 'personal', date: new Date(), time: '', description: '' })

  useEffect(() => {
    loadEvents()
    loadStudyPlans()
    loadMenstrualData()
  }, [])

  const loadEvents = () => {
    const saved = localStorage.getItem('schedule-events')
    if (saved) {
      setEvents(JSON.parse(saved).map(e => ({ ...e, date: new Date(e.date) })))
    }
  }

  const loadStudyPlans = async () => {
    try {
      const response = await fetch('/ProdyJEE/database-export.json')
      const data = await response.json()
      setStudyPlans(data)
    } catch (error) {
      console.error('Failed to load study plans:', error)
    }
  }

  const loadMenstrualData = () => {
    const saved = localStorage.getItem('menstrual-cycle')
    if (saved) {
      setMenstrualCycle(JSON.parse(saved).map(d => new Date(d)))
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    if (!date) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const getHoliday = (date) => {
    if (!date) return null
    const dateStr = date.toISOString().split('T')[0]
    return schoolHolidays.find(h => h.date === dateStr)
  }

  const isMenstrualDay = (date) => {
    if (!date) return false
    return menstrualCycle.some(d => d.toDateString() === date.toDateString())
  }

  const getEventsForDate = (date) => {
    if (!date) return []
    return events.filter(e => e.date.toDateString() === date.toDateString())
  }

  const getDaySchedule = (date) => {
    if (!date) return []
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    return cbseSchedule[dayName] || []
  }

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1))
  }

  return (
    <>
      <Head>
        <title>Schedule & Calendar - ProdyJEE</title>
        <link rel="stylesheet" href="/ProdyJEE/styles/globals.css" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        backgroundImage: 'url(/ProdyJEE/images/nature-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Glassmorphism Navbar */}
        <nav style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.5) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          color: '#1a1a1a', 
          padding: '12px 24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <a href="/ProdyJEE/" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '16px', fontWeight: '600' }}>
                ← Back
              </a>
              <div style={{ borderLeft: '1px solid rgba(26,26,26,0.2)', height: '24px' }}></div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>📅 Master Calendar</h1>
            </div>
            <span style={{ fontSize: '13px', opacity: 0.7 }}>v{packageJson.version}</span>
          </div>
        </nav>

        {/* Main Calendar Container */}
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '24px' }}>
          
          {/* Calendar Header with Navigation */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button 
                  onClick={() => changeMonth(-1)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  ←
                </button>
                
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#1a1a1a',
                  margin: 0,
                  textShadow: '0 2px 8px rgba(255, 255, 255, 0.8)'
                }}>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                
                <button 
                  onClick={() => changeMonth(1)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  →
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* View Switcher */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '10px', padding: '4px' }}>
                  <button
                    onClick={() => setView('day')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: view === 'day' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      color: view === 'day' ? 'white' : '#1a1a1a',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setView('week')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: view === 'week' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      color: view === 'week' ? 'white' : '#1a1a1a',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setView('month')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: view === 'month' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      color: view === 'month' ? 'white' : '#1a1a1a',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Month
                  </button>
                </div>

                <button
                  onClick={() => setCurrentDate(new Date())}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Today
                </button>

                <button
                  onClick={() => setShowAddEvent(true)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  + Add Event
                </button>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#FFD3B6' }}></div>
                <span>Study Plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#FF6B6B' }}></div>
                <span>Class Schedule</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#FF69B4' }}></div>
                <span>Menstrual Period</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#FFD700' }}></div>
                <span>Holiday</span>
              </div>
            </div>
          </div>

          {/* Huge Calendar Grid */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            {/* Weekday Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} style={{ 
                  textAlign: 'center', 
                  fontWeight: '700', 
                  fontSize: '16px',
                  color: '#1a1a1a',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {getDaysInMonth(currentDate).map((date, index) => {
                const holiday = getHoliday(date)
                const isMenstrual = isMenstrualDay(date)
                const dayEvents = getEventsForDate(date)
                const daySchedule = getDaySchedule(date)
                
                return (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    style={{
                      minHeight: '140px',
                      padding: '12px',
                      borderRadius: '12px',
                      background: !date ? 'transparent' : 
                                  holiday ? 'rgba(255, 215, 0, 0.3)' :
                                  isMenstrual ? 'rgba(255, 105, 180, 0.2)' :
                                  isToday(date) ? 'rgba(102, 126, 234, 0.3)' :
                                  'rgba(255, 255, 255, 0.2)',
                      border: isSelected(date) ? '3px solid #667eea' : '1px solid rgba(255, 255, 255, 0.3)',
                      cursor: date ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                      backdropFilter: date ? 'blur(10px)' : 'none',
                      boxShadow: isToday(date) ? '0 4px 16px rgba(102, 126, 234, 0.4)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (date) {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (date) {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = isToday(date) ? '0 4px 16px rgba(102, 126, 234, 0.4)' : 'none'
                      }
                    }}
                  >
                    {date && (
                      <>
                        <div style={{ 
                          fontSize: '20px', 
                          fontWeight: '700', 
                          color: isToday(date) ? '#667eea' : '#1a1a1a',
                          marginBottom: '8px'
                        }}>
                          {date.getDate()}
                        </div>
                        
                        {holiday && (
                          <div style={{ 
                            fontSize: '11px', 
                            fontWeight: '600',
                            color: '#8B4513',
                            background: 'rgba(255, 215, 0, 0.5)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            marginBottom: '4px',
                            backdropFilter: 'blur(5px)'
                          }}>
                            🎉 {holiday.name}
                          </div>
                        )}
                        
                        {isMenstrual && (
                          <div style={{ 
                            fontSize: '10px', 
                            color: '#C71585',
                            background: 'rgba(255, 105, 180, 0.3)',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            marginBottom: '4px'
                          }}>
                            💗 Period
                          </div>
                        )}
                        
                        {daySchedule.length > 0 && (
                          <div style={{ fontSize: '10px', marginTop: '4px' }}>
                            {daySchedule.slice(0, 2).map((cls, i) => (
                              <div key={i} style={{ 
                                background: cls.color + '40',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                marginBottom: '2px',
                                color: '#1a1a1a',
                                fontWeight: '600'
                              }}>
                                {cls.subject}
                              </div>
                            ))}
                            {daySchedule.length > 2 && (
                              <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
                                +{daySchedule.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Day Detail Panel */}
          {selectedDate && (
            <div style={{ 
              marginTop: '24px',
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#1a1a1a',
                marginBottom: '24px'
              }}>
                📋 {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>

              {/* Class Schedule for Selected Day */}
              {getDaySchedule(selectedDate).length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1a1a1a' }}>
                    🏫 Class Schedule
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {getDaySchedule(selectedDate).map((cls, i) => (
                      <div key={i} style={{
                        background: cls.color + '30',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid ' + cls.color + '60',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                            {cls.subject}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            {cls.time}
                          </div>
                        </div>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: cls.color + '50',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>
                          {cls.type.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
