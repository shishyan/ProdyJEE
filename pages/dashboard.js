import { useState, useEffect } from 'react'
import packageJson from '../package.json'

// Modern Icons as SVG components
const ChartBarIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const TargetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ProgressBar = ({ value, max, color = 'blue', label }) => {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            color === 'blue' ? 'bg-blue-500' :
            color === 'green' ? 'bg-green-500' :
            color === 'yellow' ? 'bg-yellow-500' :
            color === 'red' ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

const KPICard = ({ title, value, subtitle, icon, color = 'blue', trend }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'green': return 'bg-green-50 border-green-200 text-green-700'
      case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case 'red': return 'bg-red-50 border-red-200 text-red-700'
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-700'
      default: return 'bg-blue-50 border-blue-200 text-blue-700'
    }
  }

  return (
    <div className={`p-6 rounded-xl border ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUpIcon />
              <span className="text-sm ml-1">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  )
}

const SimpleChart = ({ data, title, color = 'blue' }) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full rounded-t transition-all duration-300 ${
                color === 'blue' ? 'bg-blue-500' :
                color === 'green' ? 'bg-green-500' :
                color === 'yellow' ? 'bg-yellow-500' :
                color === 'red' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
            <span className="text-xs text-gray-600 mt-2 text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [studyData, setStudyData] = useState(null)
  const [timerData, setTimerData] = useState(null)
  const [scheduleData, setScheduleData] = useState(null)

  // Load data from localStorage and simulate API data
  useEffect(() => {
    // Simulate study plan data
    const studyPlans = JSON.parse(localStorage.getItem('study-plans-data') || '[]')

    // Calculate study statistics
    const totalTopics = studyPlans.length
    const completedTopics = studyPlans.filter(p => p.learning_status === 'Done').length
    const inProgressTopics = studyPlans.filter(p => p.learning_status === 'In Progress').length
    const totalProgress = studyPlans.reduce((sum, plan) => sum + (plan.progress_percentage || 0), 0)
    const averageProgress = totalTopics > 0 ? Math.round(totalProgress / totalTopics) : 0

    // Group by subject
    const subjectStats = {}
    studyPlans.forEach(plan => {
      if (!subjectStats[plan.subject]) {
        subjectStats[plan.subject] = { total: 0, completed: 0, inProgress: 0 }
      }
      subjectStats[plan.subject].total++
      if (plan.learning_status === 'Done') subjectStats[plan.subject].completed++
      if (plan.learning_status === 'In Progress') subjectStats[plan.subject].inProgress++
    })

    setStudyData({
      totalTopics,
      completedTopics,
      inProgressTopics,
      averageProgress,
      subjectStats
    })

    // Load timer data
    const timers = JSON.parse(localStorage.getItem('timer-states') || '[]')
    const totalTimerSessions = timers.length
    const activeTimers = timers.filter(t => t.isRunning).length

    setTimerData({
      totalTimerSessions,
      activeTimers,
      timers
    })

    // Load schedule data
    const events = JSON.parse(localStorage.getItem('schedule-events') || '[]')
    const upcomingEvents = events.filter(event => new Date(event.date) >= new Date()).length

    setScheduleData({
      totalEvents: events.length,
      upcomingEvents,
      events
    })
  }, [])

  // Mock data for charts
  const weeklyProgressData = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 82 },
    { label: 'Thu', value: 71 },
    { label: 'Fri', value: 89 },
    { label: 'Sat', value: 94 },
    { label: 'Sun', value: 76 }
  ]

  const subjectProgressData = studyData ? Object.entries(studyData.subjectStats).map(([subject, stats]) => ({
    label: subject.substring(0, 3),
    value: Math.round((stats.completed / stats.total) * 100)
  })) : []

  if (!studyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ChartBarIcon />
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track your progress and productivity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Study Progress"
            value={`${studyData.averageProgress}%`}
            subtitle={`${studyData.completedTopics}/${studyData.totalTopics} topics`}
            icon={<BookOpenIcon />}
            color="blue"
            trend="+5% this week"
          />
          <KPICard
            title="Active Timers"
            value={timerData?.activeTimers || 0}
            subtitle="Currently running"
            icon={<ClockIcon />}
            color="green"
          />
          <KPICard
            title="Upcoming Events"
            value={scheduleData?.upcomingEvents || 0}
            subtitle="This month"
            icon={<CalendarIcon />}
            color="yellow"
          />
          <KPICard
            title="Study Streak"
            value="7"
            subtitle="Days in a row"
            icon={<TrophyIcon />}
            color="purple"
            trend="Keep it up!"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleChart
            data={weeklyProgressData}
            title="Weekly Study Progress"
            color="blue"
          />
          {subjectProgressData.length > 0 && (
            <SimpleChart
              data={subjectProgressData}
              title="Subject-wise Progress"
              color="green"
            />
          )}
        </div>

        {/* Progress Bars Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Study Topics Progress</h3>
            <div className="space-y-4">
              <ProgressBar
                value={studyData.completedTopics}
                max={studyData.totalTopics}
                color="green"
                label="Completed Topics"
              />
              <ProgressBar
                value={studyData.inProgressTopics}
                max={studyData.totalTopics}
                color="blue"
                label="In Progress Topics"
              />
              <ProgressBar
                value={studyData.totalTopics - studyData.completedTopics - studyData.inProgressTopics}
                max={studyData.totalTopics}
                color="yellow"
                label="Remaining Topics"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Subject Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(studyData.subjectStats).map(([subject, stats]) => (
                <div key={subject} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {stats.completed}/{stats.total}
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <TargetIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">Completed Physics Chapter 1</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClockIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">Started 25-minute study timer</p>
                <p className="text-sm text-gray-600">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CalendarIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">Added Diwali festival to schedule</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}