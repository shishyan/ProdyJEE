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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CalendarIcon />
                Schedule Tracker
              </h1>
              <p className="text-gray-600 mt-1">Track important dates, periods, and events</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon />
              Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Calendar</h2>
              <div className="calendar-container">
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  inline
                  className="w-full"
                />
              </div>

              {/* Events for selected date */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">
                  Events on {formatDate(selectedDate)}
                </h3>
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No events scheduled</p>
                  ) : (
                    getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            {event.recurring && (
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                Recurring {event.recurringType}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700 p-1"
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
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {getUpcomingEvents().map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${getEventColor(event.type)} flex-shrink-0`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600">{formatDate(event.date)}</p>
                      <p className="text-xs text-gray-500 truncate">{event.description}</p>
                    </div>
                  </div>
                ))}
                {getUpcomingEvents().length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming events</p>
                )}
              </div>
            </div>

            {/* Event Types */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Event Types</h3>
              <div className="space-y-2">
                {[
                  { type: 'school', label: 'School Period', icon: BookOpenIcon },
                  { type: 'menstrual', label: 'Menstrual Period', icon: HeartIcon },
                  { type: 'festival', label: 'Festival Holiday', icon: PartyIcon },
                  { type: 'birthday', label: 'Birthday', icon: CakeIcon },
                  { type: 'holiday', label: 'Public Holiday', icon: CalendarIcon }
                ].map(({ type, label, icon: Icon }) => (
                  <div key={type} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getEventColor(type)}`}>
                      <Icon />
                    </div>
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="school">School Period</option>
                  <option value="menstrual">Menstrual Period</option>
                  <option value="festival">Festival Holiday</option>
                  <option value="birthday">Birthday</option>
                  <option value="holiday">Public Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <DatePicker
                  selected={newEvent.date}
                  onChange={(date) => setNewEvent(prev => ({ ...prev, date }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newEvent.recurring}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, recurring: e.target.checked }))}
                />
                <label htmlFor="recurring" className="text-sm">Recurring event</label>
              </div>

              {newEvent.recurring && (
                <div>
                  <label className="block text-sm font-medium mb-1">Recurring Type</label>
                  <select
                    value={newEvent.recurringType}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, recurringType: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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