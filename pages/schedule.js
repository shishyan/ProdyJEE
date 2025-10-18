import { useState, useEffect } from 'react'
import packageJson from '../package.json'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Modern Icons as SVG components
const CalendarIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const BookOpenIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const PartyIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const CakeIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export default function Schedule() {
  const [events, setEvents] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'school',
    date: new Date(),
    description: '',
    recurring: false,
    recurringType: 'monthly'
  })

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('schedule-events')
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map(event => ({
        ...event,
        date: new Date(event.date)
      }))
      setEvents(parsedEvents)
    } else {
      // Add some default events
      const defaultEvents = [
        {
          id: 1,
          title: 'School Period',
          type: 'school',
          date: new Date(2025, 9, 18), // October 18, 2025
          description: 'Regular school classes',
          recurring: true,
          recurringType: 'weekly'
        },
        {
          id: 2,
          title: 'Diwali Festival',
          type: 'festival',
          date: new Date(2025, 10, 5), // November 5, 2025
          description: 'Festival of lights',
          recurring: false
        },
        {
          id: 3,
          title: 'Birthday - Mom',
          type: 'birthday',
          date: new Date(2025, 11, 15), // December 15, 2025
          description: 'Mother\'s birthday',
          recurring: true,
          recurringType: 'yearly'
        }
      ]
      setEvents(defaultEvents)
      localStorage.setItem('schedule-events', JSON.stringify(defaultEvents))
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('schedule-events', JSON.stringify(events))
  }, [events])

  const addEvent = () => {
    if (!newEvent.title.trim()) return

    const event = {
      id: Date.now(),
      ...newEvent
    }

    setEvents(prev => [...prev, event])
    setNewEvent({
      title: '',
      type: 'school',
      date: new Date(),
      description: '',
      recurring: false,
      recurringType: 'monthly'
    })
    setShowAddForm(false)
  }

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id))
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'school': return <BookOpenIcon />
      case 'menstrual': return <HeartIcon />
      case 'festival': return <PartyIcon />
      case 'birthday': return <CakeIcon />
      case 'holiday': return <CalendarIcon />
      default: return <ClockIcon />
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'school': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'menstrual': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'festival': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'birthday': return 'bg-green-100 text-green-800 border-green-200'
      case 'holiday': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5)
  }

  const getEventsForDate = (date) => {
    return events.filter(event =>
      event.date.toDateString() === date.toDateString()
    )
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f2f1' }}>
      {/* MS Planner Navbar */}
      <div style={{ 
        backgroundColor: '#5558AF', 
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              fontSize: '20px', 
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ←
          </button>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Schedule Tracker</span>
        </div>
        <span style={{ fontSize: '12px', opacity: 0.9 }}>v{packageJson.version}</span>
      </div>

      {/* Breadcrumb and Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #edebe9', padding: '16px 24px' }}>
        <div style={{ fontSize: '12px', color: '#605e5c', marginBottom: '8px' }}>
          <a href="/" style={{ color: '#0078d4', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 4px' }}>/</span>
          <span>Schedule</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#323130', margin: 0 }}>📅 Schedule Tracker</h1>
            <p style={{ fontSize: '13px', color: '#605e5c', marginTop: '4px' }}>Track important dates, periods, and events</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: '#0078d4',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '2px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusIcon />
            Add Event
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Calendar Section */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid #edebe9', 
              borderRadius: '4px',
              padding: '20px',
              boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132)'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>📅 Calendar</h2>
              <div className="calendar-container">
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  inline
                  className="w-full"
                />
              </div>

              {/* Events for selected date */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #edebe9' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#323130', marginBottom: '12px' }}>
                  Events on {formatDate(selectedDate)}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#605e5c', textAlign: 'center', padding: '16px' }}>No events scheduled</p>
                  ) : (
                    getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px', 
                        backgroundColor: '#f3f2f1',
                        borderRadius: '2px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className={`p-2 rounded-lg ${getEventColor(event.type)}`} style={{ padding: '8px', borderRadius: '2px' }}>
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#323130', margin: 0 }}>{event.title}</h4>
                            <p style={{ fontSize: '12px', color: '#605e5c', margin: '2px 0' }}>{event.description}</p>
                            {event.recurring && (
                              <span style={{ 
                                fontSize: '11px', 
                                backgroundColor: '#edebe9', 
                                color: '#323130',
                                padding: '2px 8px',
                                borderRadius: '2px',
                                display: 'inline-block',
                                marginTop: '4px'
                              }}>
                                Recurring {event.recurringType}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          style={{
                            color: '#a4262c',
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '4px 8px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Upcoming Events */}
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid #edebe9', 
              borderRadius: '4px',
              padding: '20px',
              boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '12px' }}>📌 Upcoming Events</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {getUpcomingEvents().map(event => (
                  <div key={event.id} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f3f2f1',
                    borderRadius: '2px'
                  }}>
                    <div className={`p-2 rounded-lg ${getEventColor(event.type)}`} style={{ padding: '8px', borderRadius: '2px', flexShrink: 0 }}>
                      {getEventIcon(event.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#323130', margin: 0 }}>{event.title}</h4>
                      <p style={{ fontSize: '11px', color: '#605e5c', margin: '2px 0' }}>{formatDate(event.date)}</p>
                      <p style={{ fontSize: '11px', color: '#8a8886', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.description}</p>
                    </div>
                  </div>
                ))}
                {getUpcomingEvents().length === 0 && (
                  <p style={{ fontSize: '13px', color: '#605e5c', textAlign: 'center', padding: '16px' }}>No upcoming events</p>
                )}
              </div>
            </div>

            {/* Event Types */}
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid #edebe9', 
              borderRadius: '4px',
              padding: '20px',
              boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '12px' }}>🏷️ Event Types</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { type: 'school', label: 'School Period', icon: BookOpenIcon },
                  { type: 'menstrual', label: 'Menstrual Period', icon: HeartIcon },
                  { type: 'festival', label: 'Festival Holiday', icon: PartyIcon },
                  { type: 'birthday', label: 'Birthday', icon: CakeIcon },
                  { type: 'holiday', label: 'Public Holiday', icon: CalendarIcon }
                ].map(({ type, label, icon: Icon }) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`p-2 rounded-lg ${getEventColor(type)}`} style={{ padding: '8px', borderRadius: '2px' }}>
                      <Icon />
                    </div>
                    <span style={{ fontSize: '13px', color: '#323130' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal - MS Planner Style */}
      {showAddForm && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '4px',
            padding: '24px',
            width: '100%',
            maxWidth: '480px',
            margin: '0 16px',
            boxShadow: '0 6.4px 14.4px 0 rgba(0,0,0,0.132), 0 1.2px 3.6px 0 rgba(0,0,0,0.108)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>Add New Event</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#323130', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #8a8886',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  placeholder="Event title"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#323130', marginBottom: '4px' }}>Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #8a8886',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  <option value="school">School Period</option>
                  <option value="menstrual">Menstrual Period</option>
                  <option value="festival">Festival Holiday</option>
                  <option value="birthday">Birthday</option>
                  <option value="holiday">Public Holiday</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#323130', marginBottom: '4px' }}>Date</label>
                <DatePicker
                  selected={newEvent.date}
                  onChange={(date) => setNewEvent(prev => ({ ...prev, date }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #8a8886',
                    borderRadius: '2px',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#323130', marginBottom: '4px' }}>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #8a8886',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    resize: 'vertical'
                  }}
                  rows={3}
                  placeholder="Optional description"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newEvent.recurring}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, recurring: e.target.checked }))}
                />
                <label htmlFor="recurring" style={{ fontSize: '13px', color: '#323130' }}>Recurring event</label>
              </div>

              {newEvent.recurring && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#323130', marginBottom: '4px' }}>Recurring Type</label>
                  <select
                    value={newEvent.recurringType}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, recurringType: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #8a8886',
                      borderRadius: '2px',
                      fontSize: '13px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  border: '1px solid #8a8886',
                  borderRadius: '2px',
                  backgroundColor: 'white',
                  color: '#323130',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '2px',
                  backgroundColor: '#0078d4',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}