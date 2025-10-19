import { useState, useEffect, useRef } from 'react'
import packageJson from '../package.json'

// Modern Icons as SVG components
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
)

const StopIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h12v12H6z"/>
  </svg>
)

const ResetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const ClockIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const UtensilsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3zM3 15h18M3 11h18M11 3v18" />
  </svg>
)

const DumbbellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7h-3m-1 3l-4-4-4 4m8 0l-4 4-4-4m8 0H8m0 0v12a2 2 0 002 2h4a2 2 0 002-2V10z" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const TimerCard = ({ timer, onStart, onPause, onStop, onReset, onUpdateDuration }) => {
  const [customDuration, setCustomDuration] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCustomDuration = () => {
    const duration = parseInt(customDuration) * 60 // Convert minutes to seconds
    if (duration > 0) {
      onUpdateDuration(timer.id, duration)
      setCustomDuration('')
      setShowCustomInput(false)
    }
  }

  const getTimerBackgroundColor = () => {
    if (timer.isRunning) return '#dff6dd' // light green
    if (timer.timeLeft === 0) return '#fde7e9' // light red
    return 'white'
  }

  const getTimerBorderColor = () => {
    if (timer.isRunning) return '#107c10' // MS green
    if (timer.timeLeft === 0) return '#a4262c' // MS red
    return '#edebe9'
  }

  const getProgressPercentage = () => {
    return ((timer.duration - timer.timeLeft) / timer.duration) * 100
  }

  const getProgressColor = () => {
    if (timer.isRunning) return '#107c10'
    if (timer.timeLeft === 0) return '#a4262c'
    return '#0078d4'
  }

  return (
    <div style={{
      backgroundColor: getTimerBackgroundColor(),
      border: `1px solid ${getTimerBorderColor()}`,
      borderRadius: '4px',
      padding: '20px',
      boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#f3f2f1', borderRadius: '2px' }}>
            {timer.icon}
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', margin: 0 }}>{timer.name}</h3>
            <p style={{ fontSize: '12px', color: '#605e5c', margin: '2px 0' }}>{timer.description}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: '600', color: '#323130' }}>
            {formatTime(timer.timeLeft)}
          </div>
          <div style={{ fontSize: '11px', color: '#8a8886' }}>
            of {formatTime(timer.duration)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', backgroundColor: '#edebe9', borderRadius: '3px', marginBottom: '16px', overflow: 'hidden' }}>
        <div
          style={{ 
            height: '100%', 
            backgroundColor: getProgressColor(),
            width: `${getProgressPercentage()}%`,
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!timer.isRunning && timer.timeLeft === timer.duration && (
            <button
              onClick={() => onStart(timer.id)}
              style={{
                padding: '8px',
                backgroundColor: '#107c10',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <PlayIcon />
            </button>
          )}

          {timer.isRunning && (
            <button
              onClick={() => onPause(timer.id)}
              style={{
                padding: '8px',
                backgroundColor: '#ffaa44',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <PauseIcon />
            </button>
          )}

          {(timer.isRunning || timer.timeLeft < timer.duration) && (
            <button
              onClick={() => onStop(timer.id)}
              style={{
                padding: '8px',
                backgroundColor: '#a4262c',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <StopIcon />
            </button>
          )}

          <button
            onClick={() => onReset(timer.id)}
            style={{
              padding: '8px',
              backgroundColor: '#605e5c',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ResetIcon />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {timer.presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onUpdateDuration(timer.id, preset * 60)}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#deecf9',
                color: '#0078d4',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {preset}m
            </button>
          ))}

          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#f3e5f5',
              color: '#8764b8',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Custom Duration Input */}
      {showCustomInput && (
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={customDuration}
            onChange={(e) => setCustomDuration(e.target.value)}
            placeholder="Minutes"
            style={{
              flex: 1,
              padding: '6px 8px',
              border: '1px solid #8a8886',
              borderRadius: '2px',
              fontSize: '13px'
            }}
            min="1"
          />
          <button
            onClick={handleCustomDuration}
            style={{
              padding: '6px 16px',
              backgroundColor: '#8764b8',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Set
          </button>
        </div>
      )}

      {/* Status Messages */}
      {timer.timeLeft === 0 && !timer.isRunning && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#fde7e9',
          color: '#a4262c',
          borderRadius: '2px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          ⏰ Time's up! {timer.name} completed.
        </div>
      )}

      {timer.isRunning && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#dff6dd',
          color: '#107c10',
          borderRadius: '2px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          ▶️ {timer.name} is running...
        </div>
      )}
    </div>
  )
}

export default function Timer() {
  const [timers, setTimers] = useState([])
  const intervalRef = useRef(null)

  // Initialize timers
  useEffect(() => {
    const defaultTimers = [
      {
        id: 'sleep',
        name: 'Sleep Timer',
        description: 'Time to wind down and sleep',
        icon: <MoonIcon />,
        duration: 30 * 60, // 30 minutes
        timeLeft: 30 * 60,
        isRunning: false,
        presets: [15, 30, 45, 60]
      },
      {
        id: 'screen',
        name: 'Screen Timer',
        description: 'Limit screen time for eye health',
        icon: <EyeIcon />,
        duration: 60 * 60, // 1 hour
        timeLeft: 60 * 60,
        isRunning: false,
        presets: [30, 60, 90, 120]
      },
      {
        id: 'break',
        name: 'Break Timer',
        description: 'Take a break from studying',
        icon: <ClockIcon />,
        duration: 10 * 60, // 10 minutes
        timeLeft: 10 * 60,
        isRunning: false,
        presets: [5, 10, 15, 20]
      },
      {
        id: 'wakeup',
        name: 'Wakeup Alarm',
        description: 'Gentle morning wake up',
        icon: <SunIcon />,
        duration: 15 * 60, // 15 minutes
        timeLeft: 15 * 60,
        isRunning: false,
        presets: [10, 15, 20, 30]
      },
      {
        id: 'food',
        name: 'Food Timer',
        description: 'Cooking or meal preparation',
        icon: <UtensilsIcon />,
        duration: 20 * 60, // 20 minutes
        timeLeft: 20 * 60,
        isRunning: false,
        presets: [10, 15, 20, 30]
      },
      {
        id: 'fitness',
        name: 'Fitness Timer',
        description: 'Exercise and workout sessions',
        icon: <DumbbellIcon />,
        duration: 45 * 60, // 45 minutes
        timeLeft: 45 * 60,
        isRunning: false,
        presets: [15, 30, 45, 60]
      }
    ]

    // Load saved timers from localStorage
    const savedTimers = localStorage.getItem('timer-states')
    if (savedTimers) {
      const parsedTimers = JSON.parse(savedTimers)
      // Merge with default timers to ensure all timers exist
      const mergedTimers = defaultTimers.map(defaultTimer => {
        const savedTimer = parsedTimers.find(t => t.id === defaultTimer.id)
        return savedTimer ? { ...defaultTimer, ...savedTimer } : defaultTimer
      })
      setTimers(mergedTimers)
    } else {
      setTimers(defaultTimers)
    }
  }, [])

  // Save timer states to localStorage
  useEffect(() => {
    if (timers.length > 0) {
      localStorage.setItem('timer-states', JSON.stringify(timers))
    }
  }, [timers])

  // Timer countdown logic
  useEffect(() => {
    const runningTimers = timers.filter(timer => timer.isRunning)

    if (runningTimers.length > 0) {
      intervalRef.current = setInterval(() => {
        setTimers(prevTimers =>
          prevTimers.map(timer => {
            if (timer.isRunning && timer.timeLeft > 0) {
              return { ...timer, timeLeft: timer.timeLeft - 1 }
            } else if (timer.isRunning && timer.timeLeft === 0) {
              // Timer finished
              return { ...timer, isRunning: false }
            }
            return timer
          })
        )
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timers])

  // Play notification sound when timer finishes
  useEffect(() => {
    timers.forEach(timer => {
      if (timer.timeLeft === 0 && !timer.isRunning) {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)

        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification(`${timer.name} Completed!`, {
            body: `${timer.description} - Time's up!`,
            icon: '/favicon.ico'
          })
        }
      }
    })
  }, [timers])

  const handleStart = (id) => {
    setTimers(prev => prev.map(timer =>
      timer.id === id ? { ...timer, isRunning: true } : timer
    ))
  }

  const handlePause = (id) => {
    setTimers(prev => prev.map(timer =>
      timer.id === id ? { ...timer, isRunning: false } : timer
    ))
  }

  const handleStop = (id) => {
    setTimers(prev => prev.map(timer =>
      timer.id === id ? { ...timer, isRunning: false, timeLeft: timer.duration } : timer
    ))
  }

  const handleReset = (id) => {
    setTimers(prev => prev.map(timer =>
      timer.id === id ? { ...timer, isRunning: false, timeLeft: timer.duration } : timer
    ))
  }

  const handleUpdateDuration = (id, newDuration) => {
    setTimers(prev => prev.map(timer =>
      timer.id === id ? { ...timer, duration: newDuration, timeLeft: newDuration, isRunning: false } : timer
    ))
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div className="app-container">
      <div className="main-content-container" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* MS Planner Navbar */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(249, 245, 247, 0.5) 0%, rgba(249, 245, 247, 0.45) 50%, rgba(249, 245, 247, 0.5) 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)', 
        color: '#1a202c',
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
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Timer Dashboard</span>
        </div>
        <span style={{ fontSize: '12px', opacity: 0.9 }}>v{packageJson.version}</span>
      </div>

      {/* Breadcrumb and Header */}
      <div style={{ background: 'rgba(255, 255, 255, 0.25)', borderBottom: '1px solid #edebe9', padding: '16px 24px' }}>
        <div style={{ fontSize: '12px', color: '#605e5c', marginBottom: '8px' }}>
          <a href="/ProdyJEE/" style={{ color: '#0078d4', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 4px' }}>/</span>
          <span>Timer</span>
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#323130', margin: 0 }}>⏱️ Timer Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#605e5c', marginTop: '4px' }}>Track time for various activities and routines</p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {timers.map(timer => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onStart={handleStart}
              onPause={handlePause}
              onStop={handleStop}
              onReset={handleReset}
              onUpdateDuration={handleUpdateDuration}
            />
          ))}
        </div>

        {/* Instructions - MS Planner Style */}
        <div style={{ 
          marginTop: '24px',
          background: 'rgba(255, 255, 255, 0.25)', 
          border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)', 
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132)'
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#323130', marginBottom: '16px' }}>ℹ️ How to Use</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#323130', marginBottom: '8px' }}>Timer Controls</h3>
              <ul style={{ fontSize: '13px', color: '#605e5c', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '4px' }}>• <strong>Play</strong>: Start the timer</li>
                <li style={{ marginBottom: '4px' }}>• <strong>Pause</strong>: Pause the running timer</li>
                <li style={{ marginBottom: '4px' }}>• <strong>Stop</strong>: Stop and reset to full duration</li>
                <li style={{ marginBottom: '4px' }}>• <strong>Reset</strong>: Reset to original duration</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#323130', marginBottom: '8px' }}>Duration Presets</h3>
              <ul style={{ fontSize: '13px', color: '#605e5c', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '4px' }}>• Quick preset buttons for common durations</li>
                <li style={{ marginBottom: '4px' }}>• <strong>Custom</strong>: Set any duration in minutes</li>
                <li style={{ marginBottom: '4px' }}>• All changes apply immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}