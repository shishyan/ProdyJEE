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
  const [starPoints, setStarPoints] = useState(0) // [STAR] Star Points from goals
  const [badgePoints, setBadgePoints] = useState(0) // [STAR] Badge Points from goals

  // Load data from localStorage and simulate API data
  useEffect(() => {
    // Load star points from localStorage
    const savedStarPoints = parseInt(localStorage.getItem('starPoints') || '0', 10)
    const savedBadgePoints = parseInt(localStorage.getItem('badgePoints') || '0', 10)
    setStarPoints(savedStarPoints)
    setBadgePoints(savedBadgePoints)
    
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* MS Planner Style Top Navbar with Glassmorphism */}
      <nav style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.5) 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        color: '#1a1a1a', 
        padding: '12px 24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="/ProdyJEE/" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '16px', fontWeight: '600' }}>
            ← Back to Planner
          </a>
          <div style={{ borderLeft: '1px solid rgba(26,26,26,0.2)', height: '24px' }}></div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>Analytics Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', opacity: 0.7, color: '#1a1a1a' }}>v1.0.3-361bf16</span>
        </div>
      </nav>

      {/* Breadcrumb & Page Header */}
      <div style={{ background: 'rgba(255, 255, 255, 0.25)', borderBottom: '1px solid #edebe9', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', color: '#605e5c', marginBottom: '8px' }}>
            <span>Home</span> / <span style={{ fontWeight: '600' }}>Analytics</span>
          </div>
          <h2 style={{ color: '#323130', fontSize: '24px', fontWeight: '600', margin: '0' }}>Performance & Progress Insights</h2>
          <p style={{ color: '#605e5c', fontSize: '14px', margin: '4px 0 0 0' }}>Monitor your study patterns, achievements, and productivity metrics</p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* KPI Cards - MS Planner Style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '13px', color: '#605e5c', marginBottom: '8px', fontWeight: '600' }}>📚 STUDY PROGRESS</div>
            <div style={{ fontSize: '32px', color: '#0078d4', fontWeight: '600', marginBottom: '4px' }}>{studyData.averageProgress}%</div>
            <div style={{ fontSize: '12px', color: '#8a8886' }}>{studyData.completedTopics}/{studyData.totalTopics} topics completed</div>
            <div style={{ fontSize: '11px', color: '#107c10', marginTop: '4px', fontWeight: '600' }}>↗ +5% this week</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '13px', color: '#605e5c', marginBottom: '8px', fontWeight: '600' }}>⏱️ ACTIVE TIMERS</div>
            <div style={{ fontSize: '32px', color: '#107c10', fontWeight: '600', marginBottom: '4px' }}>{timerData?.activeTimers || 0}</div>
            <div style={{ fontSize: '12px', color: '#8a8886' }}>Currently running</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '13px', color: '#605e5c', marginBottom: '8px', fontWeight: '600' }}>📅 UPCOMING EVENTS</div>
            <div style={{ fontSize: '32px', color: '#ffaa44', fontWeight: '600', marginBottom: '4px' }}>{scheduleData?.upcomingEvents || 0}</div>
            <div style={{ fontSize: '12px', color: '#8a8886' }}>This month</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '13px', color: '#605e5c', marginBottom: '8px', fontWeight: '600' }}>🔥 STUDY STREAK</div>
            <div style={{ fontSize: '32px', color: '#8764b8', fontWeight: '600', marginBottom: '4px' }}>7</div>
            <div style={{ fontSize: '12px', color: '#8a8886' }}>Days in a row</div>
            <div style={{ fontSize: '11px', color: '#8764b8', marginTop: '4px', fontWeight: '600' }}>✨ Keep it up!</div>
          </div>
        </div>

        {/* Achievement Points - MS Planner Style */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.25)', 
          border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
          borderRadius: '12px', 
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>🏆 Achievement Points</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fff4ce', 
              borderLeft: '4px solid #ffaa44',
              borderRadius: '2px'
            }}>
              <div style={{ fontSize: '12px', color: '#8a6200', fontWeight: '600', marginBottom: '4px' }}>⭐ STAR POINTS</div>
              <div style={{ fontSize: '28px', color: '#323130', fontWeight: '600', marginBottom: '2px' }}>{starPoints}</div>
              <div style={{ fontSize: '11px', color: '#605e5c' }}>10 points per star</div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f3e5f5', 
              borderLeft: '4px solid #8764b8',
              borderRadius: '2px'
            }}>
              <div style={{ fontSize: '12px', color: '#553285', fontWeight: '600', marginBottom: '4px' }}>🏆 BADGE POINTS</div>
              <div style={{ fontSize: '28px', color: '#323130', fontWeight: '600', marginBottom: '2px' }}>{badgePoints}</div>
              <div style={{ fontSize: '11px', color: '#605e5c' }}>100 points per badge (5 stars)</div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#dff6dd', 
              borderLeft: '4px solid #107c10',
              borderRadius: '2px'
            }}>
              <div style={{ fontSize: '12px', color: '#0b6a0b', fontWeight: '600', marginBottom: '4px' }}>✨ TOTAL POINTS</div>
              <div style={{ fontSize: '28px', color: '#323130', fontWeight: '600', marginBottom: '2px' }}>{starPoints + badgePoints}</div>
              <div style={{ fontSize: '11px', color: '#605e5c' }}>Combined achievement score</div>
            </div>
          </div>
        </div>

        {/* Charts Section - MS Planner Style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>📊 Weekly Study Progress</h3>
            <SimpleChart
              data={weeklyProgressData}
              title=""
              color="blue"
            />
          </div>
          {subjectProgressData.length > 0 && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.25)', 
              border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
              borderRadius: '12px', 
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>📈 Subject-wise Progress</h3>
              <SimpleChart
                data={subjectProgressData}
                title=""
                color="green"
              />
            </div>
          )}
        </div>

        {/* Progress Section - MS Planner Style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>📚 Study Topics Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>🎯 Subject Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(studyData.subjectStats).map(([subject, stats]) => (
                <div key={subject} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#323130' }}>{subject}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#605e5c' }}>
                      {stats.completed}/{stats.total}
                    </span>
                    <div style={{ width: '80px', height: '6px', backgroundColor: '#edebe9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{ 
                          width: `${(stats.completed / stats.total) * 100}%`, 
                          height: '100%', 
                          backgroundColor: '#0078d4',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity - MS Planner Style */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.25)', 
          border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>⏱️ Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px', 
              backgroundColor: '#f3f2f1', 
              borderRadius: '2px' 
            }}>
              <div style={{ 
                padding: '8px', 
                backgroundColor: '#dff6dd', 
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TargetIcon />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#323130' }}>Completed Physics Chapter 1</p>
                <p style={{ fontSize: '12px', color: '#605e5c' }}>2 hours ago</p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px', 
              backgroundColor: '#f3f2f1', 
              borderRadius: '2px' 
            }}>
              <div style={{ 
                padding: '8px', 
                backgroundColor: '#deecf9', 
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ClockIcon />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#323130' }}>Started 25-minute study timer</p>
                <p style={{ fontSize: '12px', color: '#605e5c' }}>4 hours ago</p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px', 
              backgroundColor: '#f3f2f1', 
              borderRadius: '2px' 
            }}>
              <div style={{ 
                padding: '8px', 
                backgroundColor: '#fff4ce', 
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarIcon />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#323130' }}>Added Diwali festival to schedule</p>
                <p style={{ fontSize: '12px', color: '#605e5c' }}>1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}