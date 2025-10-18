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

  const getTimerColor = () => {
    if (timer.isRunning) return 'border-green-500 bg-green-50'
    if (timer.timeLeft === 0) return 'border-red-500 bg-red-50'
    return 'border-gray-300 bg-white'
  }

  const getProgressPercentage = () => {
    return ((timer.duration - timer.timeLeft) / timer.duration) * 100
  }

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-300 ${getTimerColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {timer.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{timer.name}</h3>
            <p className="text-sm text-gray-600">{timer.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">
            {formatTime(timer.timeLeft)}
          </div>
          <div className="text-xs text-gray-500">
            of {formatTime(timer.duration)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            timer.isRunning ? 'bg-green-500' : timer.timeLeft === 0 ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {!timer.isRunning && timer.timeLeft === timer.duration && (
            <button
              onClick={() => onStart(timer.id)}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <PlayIcon />
            </button>
          )}

          {timer.isRunning && (
            <button
              onClick={() => onPause(timer.id)}
              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <PauseIcon />
            </button>
          )}

          {timer.isRunning || timer.timeLeft < timer.duration && (
            <button
              onClick={() => onStop(timer.id)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <StopIcon />
            </button>
          )}

          <button
            onClick={() => onReset(timer.id)}
            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ResetIcon />
          </button>
        </div>

        <div className="flex gap-2">
          {timer.presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onUpdateDuration(timer.id, preset * 60)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              {preset}m
            </button>
          ))}

          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
          >
            Custom
          </button>
        </div>
      </div>

      {/* Custom Duration Input */}
      {showCustomInput && (
        <div className="mt-4 flex gap-2">
          <input
            type="number"
            value={customDuration}
            onChange={(e) => setCustomDuration(e.target.value)}
            placeholder="Minutes"
            className="flex-1 p-2 border rounded-lg text-sm"
            min="1"
          />
          <button
            onClick={handleCustomDuration}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
          >
            Set
          </button>
        </div>
      )}

      {/* Status Messages */}
      {timer.timeLeft === 0 && !timer.isRunning && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-center font-medium">
          ⏰ Time's up! {timer.name} completed.
        </div>
      )}

      {timer.isRunning && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ClockIcon />
                Timer Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track time for various activities and routines</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Timer Controls</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Play</strong>: Start the timer</li>
                <li>• <strong>Pause</strong>: Pause the running timer</li>
                <li>• <strong>Stop</strong>: Stop and reset to full duration</li>
                <li>• <strong>Reset</strong>: Reset to original duration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Duration Presets</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Quick preset buttons for common durations</li>
                <li>• <strong>Custom</strong>: Set any duration in minutes</li>
                <li>• All changes apply immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}