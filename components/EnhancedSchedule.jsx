import React, { useState, useEffect } from 'react'

export default function EnhancedScheduleView() {
  const [events, setEvents] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('daily')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'school',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    endTime: '10:00',
    description: '',
    recurring: false,
    recurringType: 'none'
  })

  const classSchedule = [
    { title: 'Morning Assembly', time: '08:00', endTime: '08:15', type: 'school' },
    { title: 'Period 1', time: '08:15', endTime: '09:00', type: 'class' },
    { title: 'Period 2', time: '09:00', endTime: '09:45', type: 'class' },
    { title: 'Short Break', time: '09:45', endTime: '10:00', type: 'break' },
    { title: 'Period 3', time: '10:00', endTime: '10:45', type: 'class' },
    { title: 'Period 4', time: '10:45', endTime: '11:30', type: 'class' },
    { title: 'Lunch Break', time: '11:30', endTime: '12:15', type: 'break' },
    { title: 'Period 5', time: '12:15', endTime: '13:00', type: 'class' },
    { title: 'Period 6', time: '13:00', endTime: '13:45', type: 'class' },
    { title: 'Period 7', time: '13:45', endTime: '14:30', type: 'class' }
  ]

  const holidays2025 = [
    { date: '2025-01-26', title: 'Republic Day', type: 'holiday' },
    { date: '2025-03-14', title: 'Holi', type: 'festival' },
    { date: '2025-04-06', title: 'Ram Navami', type: 'festival' },
    { date: '2025-04-18', title: 'Good Friday', type: 'holiday' },
    { date: '2025-04-30', title: 'Eid ul-Fitr', type: 'festival' },
    { date: '2025-08-15', title: 'Independence Day', type: 'holiday' },
    { date: '2025-08-27', title: 'Janmashtami', type: 'festival' },
    { date: '2025-09-27', title: 'Ganesh Chaturthi', type: 'festival' },
    { date: '2025-10-02', title: 'Gandhi Jayanti', type: 'holiday' },
    { date: '2025-10-22', title: 'Dussehra', type: 'festival' },
    { date: '2025-11-12', title: 'Diwali', type: 'festival' },
    { date: '2025-11-15', title: 'Guru Nanak Jayanti', type: 'festival' },
    { date: '2025-12-25', title: 'Christmas', type: 'holiday' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('schedule-events')
    if (saved) {
      try {
        setEvents(JSON.parse(saved).map(e => ({ ...e, date: new Date(e.date) })))
      } catch (e) { console.error('Failed to load', e) }
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('schedule-events', JSON.stringify(events))
  }, [events])

  const populateClassTimetable = () => {
    const newEvents = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (date.getDay() === 0 || date.getDay() === 6) continue
      classSchedule.forEach(period => {
        const eventDate = new Date(date)
        const [hours, minutes] = period.time.split(':')
        eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        newEvents.push({
          id: Date.now() + '-' + period.time + '-' + i,
          title: period.title,
          date: eventDate,
          time: period.time,
          endTime: period.endTime,
          type: period.type,
          description: 'Class schedule',
          isClassSchedule: true
        })
      })
    }
    setEvents(prev => [...prev.filter(e => !e.isClassSchedule), ...newEvents])
    alert('Class timetable populated!')
  }

  const populateHolidays = () => {
    const newHolidays = holidays2025.map(h => ({
      id: 'holiday-' + h.date,
      title: h.title,
      date: new Date(h.date + 'T00:00:00'),
      time: '00:00',
      endTime: '23:59',
      type: h.type,
      description: 'Public Holiday',
      isHoliday: true,
      allDay: true
    }))
    setEvents(prev => [...prev.filter(e => !e.isHoliday), ...newHolidays])
    alert(newHolidays.length + ' holidays added!')
  }

  const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6

  const addEvent = () => {
    if (!newEvent.title.trim()) return
    const eventDate = new Date(newEvent.date + 'T' + newEvent.time)
    setEvents(prev => [...prev, { id: Date.now(), ...newEvent, date: eventDate }])
    setNewEvent({
      title: '', type: 'school', date: new Date().toISOString().split('T')[0],
      time: '09:00', endTime: '10:00', description: '', recurring: false, recurringType: 'none'
    })
    setShowAddForm(false)
  }

  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id))

  const getEventsForDay = (date) => {
    return events.filter(event => new Date(event.date).toDateString() === date.toDateString())
      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'))
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    return (h % 12 || 12) + ':' + minutes + ' ' + (h >= 12 ? 'PM' : 'AM')
  }

  const getEventColor = (type) => {
    const colors = {
      school: 'bg-blue-500 text-white', class: 'bg-blue-400 text-white',
      break: 'bg-green-500 text-white', menstrual: 'bg-pink-500 text-white',
      festival: 'bg-purple-500 text-white', birthday: 'bg-green-500 text-white',
      holiday: 'bg-orange-500 text-white'
    }
    return colors[type] || 'bg-gray-500 text-white'
  }

  const getTimeSlots = () => {
    const slots = []
    for (let i = 5; i < 24; i++) {
      slots.push(i.toString().padStart(2, '0') + ':00')
      slots.push(i.toString().padStart(2, '0') + ':30')
    }
    return slots
  }

  const renderDailyView = () => {
    const dayEvents = getEventsForDay(selectedDate)
    const timeSlots = getTimeSlots()
    const weekend = isWeekend(selectedDate)
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }

    return React.createElement('div', { className: 'bg-pink-50 rounded-xl shadow p-6', style: { maxHeight: '70vh', overflow: 'auto' } },
      React.createElement('div', { className: 'flex justify-between items-center mb-4' },
        React.createElement('h2', { className: 'text-2xl font-bold' },
          selectedDate.toLocaleDateString('en-US', dateOptions),
          weekend && React.createElement('span', { className: 'ml-2 text-sm bg-orange-500 text-white px-2 py-1 rounded' }, 'WEEKEND')
        ),
        React.createElement('div', { className: 'flex gap-2' },
          React.createElement('button', {
            onClick: () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d) },
            className: 'px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
          }, 'Prev'),
          React.createElement('button', {
            onClick: () => setSelectedDate(new Date()),
            className: 'px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Today'),
          React.createElement('button', {
            onClick: () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d) },
            className: 'px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
          }, 'Next')
        )
      ),
      React.createElement('div', { className: 'space-y-1' },
        React.createElement('div', { className: 'flex items-center gap-4 p-2 bg-gray-100 rounded' },
          React.createElement('div', { className: 'w-24 text-xs text-gray-500 font-mono' }, '00:00-05:00'),
          React.createElement('div', { className: 'flex-1 text-sm text-gray-400 italic' }, 'Night time (collapsed)')
        ),
        timeSlots.map(timeSlot => {
          const slotEvents = dayEvents.filter(e => e.time === timeSlot)
          return React.createElement('div', {
            key: timeSlot,
            className: 'flex items-start gap-4 p-2 hover:bg-gray-50 rounded border-l-2 border-gray-200'
          },
            React.createElement('div', { className: 'w-24 text-sm font-mono text-gray-600' }, formatTime(timeSlot)),
            React.createElement('div', { className: 'flex-1 min-h-[40px]' },
              slotEvents.length > 0 ?
                React.createElement('div', { className: 'space-y-2' },
                  slotEvents.map(event =>
                    React.createElement('div', {
                      key: event.id,
                      className: 'p-3 rounded-lg ' + getEventColor(event.type) + ' flex justify-between items-start cursor-move hover:opacity-90',
                      draggable: true
                    },
                      React.createElement('div', { className: 'flex-1' },
                        React.createElement('div', { className: 'font-bold' }, event.title),
                        React.createElement('div', { className: 'text-xs opacity-90' }, formatTime(event.time) + ' - ' + formatTime(event.endTime)),
                        event.description && React.createElement('div', { className: 'text-xs mt-1 opacity-80' }, event.description)
                      ),
                      !event.isClassSchedule && !event.isHoliday &&
                      React.createElement('button', {
                        onClick: () => deleteEvent(event.id),
                        className: 'text-white hover:opacity-70 text-xl ml-2'
                      }, '×')
                    )
                  )
                ) :
                React.createElement('div', { className: 'text-gray-300 text-sm' }, 'No events')
            )
          )
        })
      )
    )
  }

  const renderMonthlyView = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i))
    const monthOptions = { month: 'long', year: 'numeric' }

    return React.createElement('div', { className: 'bg-pink-50 rounded-xl shadow p-6' },
      React.createElement('div', { className: 'flex justify-between items-center mb-4' },
        React.createElement('h2', { className: 'text-2xl font-bold' }, currentMonth.toLocaleDateString('en-US', monthOptions)),
        React.createElement('div', { className: 'flex gap-2' },
          React.createElement('button', {
            onClick: () => { const d = new Date(currentMonth); d.setMonth(d.getMonth() - 1); setCurrentMonth(d) },
            className: 'px-3 py-1 bg-gray-200 rounded'
          }, 'Prev'),
          React.createElement('button', {
            onClick: () => setCurrentMonth(new Date()),
            className: 'px-3 py-1 bg-blue-500 text-white rounded'
          }, 'Today'),
          React.createElement('button', {
            onClick: () => { const d = new Date(currentMonth); d.setMonth(d.getMonth() + 1); setCurrentMonth(d) },
            className: 'px-3 py-1 bg-gray-200 rounded'
          }, 'Next')
        )
      ),
      React.createElement('div', { className: 'grid grid-cols-7 gap-2' },
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day =>
          React.createElement('div', { key: day, className: 'text-center font-bold text-gray-600 py-2' }, day)
        ),
        days.map((day, i) => {
          if (!day) return React.createElement('div', { key: 'empty-' + i, className: 'min-h-24 bg-gray-50 rounded' })
          const dayEvents = getEventsForDay(day)
          const isToday = day.toDateString() === new Date().toDateString()
          const weekend = isWeekend(day)
          return React.createElement('div', {
            key: day.toISOString(),
            onClick: () => { setSelectedDate(day); setViewMode('daily') },
            className: 'min-h-24 p-2 border rounded cursor-pointer hover:bg-blue-50 ' +
              (isToday ? 'border-blue-500 border-2' : '') + ' ' +
              (weekend ? 'bg-orange-50' : 'bg-pink-50')
          },
            React.createElement('div', {
              className: 'text-sm font-bold mb-1 ' +
                (isToday ? 'text-blue-600' : weekend ? 'text-orange-600' : 'text-gray-700')
            }, day.getDate()),
            React.createElement('div', { className: 'space-y-1' },
              dayEvents.slice(0, 2).map(event =>
                React.createElement('div', {
                  key: event.id,
                  className: 'text-xs px-1 py-0.5 rounded truncate ' + getEventColor(event.type)
                }, event.title)
              ),
              dayEvents.length > 2 && React.createElement('div', { className: 'text-xs text-gray-500' }, '+' + (dayEvents.length - 2) + ' more')
            )
          )
        })
      )
    )
  }

  return React.createElement('div', { className: 'h-full p-6 bg-gradient-to-br from-blue-50 to-purple-50' },
    React.createElement('div', { className: 'bg-pink-50 rounded-xl shadow mb-4 p-4' },
      React.createElement('div', { className: 'flex justify-between items-center flex-wrap gap-4' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900' }, 'Schedule Tracker'),
        React.createElement('div', { className: 'flex gap-2 flex-wrap' },
          React.createElement('button', {
            onClick: () => setViewMode('daily'),
            className: 'px-4 py-2 rounded-lg font-medium ' + (viewMode === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200')
          }, 'Daily'),
          React.createElement('button', {
            onClick: () => setViewMode('monthly'),
            className: 'px-4 py-2 rounded-lg font-medium ' + (viewMode === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200')
          }, 'Monthly'),
          React.createElement('button', {
            onClick: populateClassTimetable,
            className: 'px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium'
          }, 'Class Schedule'),
          React.createElement('button', {
            onClick: populateHolidays,
            className: 'px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium'
          }, 'Holidays'),
          React.createElement('button', {
            onClick: () => setShowAddForm(true),
            className: 'px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium'
          }, 'Add Event')
        )
      )
    ),
    viewMode === 'daily' ? renderDailyView() : renderMonthlyView(),
    showAddForm && React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement('div', { className: 'bg-pink-50 rounded-xl p-6 w-full max-w-md' },
        React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Add Event'),
        React.createElement('div', { className: 'space-y-3' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Event Title',
            value: newEvent.title,
            onChange: (e) => setNewEvent({ ...newEvent, title: e.target.value }),
            className: 'w-full px-3 py-2 border rounded'
          }),
          React.createElement('select', {
            value: newEvent.type,
            onChange: (e) => setNewEvent({ ...newEvent, type: e.target.value }),
            className: 'w-full px-3 py-2 border rounded'
          },
            React.createElement('option', { value: 'school' }, 'School'),
            React.createElement('option', { value: 'menstrual' }, 'Menstrual Period'),
            React.createElement('option', { value: 'festival' }, 'Festival'),
            React.createElement('option', { value: 'birthday' }, 'Birthday'),
            React.createElement('option', { value: 'holiday' }, 'Holiday')
          ),
          React.createElement('input', {
            type: 'date',
            value: newEvent.date,
            onChange: (e) => setNewEvent({ ...newEvent, date: e.target.value }),
            className: 'w-full px-3 py-2 border rounded'
          }),
          React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
            React.createElement('input', {
              type: 'time',
              value: newEvent.time,
              onChange: (e) => setNewEvent({ ...newEvent, time: e.target.value }),
              className: 'w-full px-3 py-2 border rounded'
            }),
            React.createElement('input', {
              type: 'time',
              value: newEvent.endTime,
              onChange: (e) => setNewEvent({ ...newEvent, endTime: e.target.value }),
              className: 'w-full px-3 py-2 border rounded'
            })
          ),
          React.createElement('textarea', {
            placeholder: 'Description',
            value: newEvent.description,
            onChange: (e) => setNewEvent({ ...newEvent, description: e.target.value }),
            className: 'w-full px-3 py-2 border rounded',
            rows: '3'
          })
        ),
        React.createElement('div', { className: 'flex gap-2 mt-4' },
          React.createElement('button', {
            onClick: addEvent,
            className: 'flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium'
          }, 'Add Event'),
          React.createElement('button', {
            onClick: () => setShowAddForm(false),
            className: 'flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium'
          }, 'Cancel')
        )
      )
    )
  )
}
