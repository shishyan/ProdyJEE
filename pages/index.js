import { useState, useEffect } from 'react'
import packageJson from '../package.json'
import BackgroundSettings from '../components/BackgroundSettings'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  rectIntersection,
  pointerWithin,
  useDraggable,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Modern Icons as SVG components
const BookOpenIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const StarIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const PaletteIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
  </svg>
)

const GridIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const CloudIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.24 7.76a5.52 5.52 0 00-8.48-3.36A4.5 4.5 0 006 7.5c0 .39-.03.77-.08 1.14A5.5 5.5 0 005.5 12a5.5 5.5 0 0010.41 2.66A4.5 4.5 0 0019.5 12a4.5 4.5 0 00-1.76-3.74z" />
  </svg>
)

const CogIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const MusicIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
)

const UserIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

// Sidebar Icons
const HomeIcon = () => (
  <svg className="sidebar-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const BarChartIcon = () => (
  <svg className="sidebar-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const ChartBarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const TargetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const PartyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const CakeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 010 3.592 2.704 2.704 0 003 0 2.704 2.704 0 013 0 2.704 2.704 0 003 0 2.704 2.704 0 013 0 2.704 2.704 0 003 0 .986.986 0 00.5-.146A2.693 2.693 0 0021 15.546zM12 3v6m-6-3h12" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="sidebar-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const TimerIcon = () => (
  <svg className="sidebar-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const getProficiencyIcons = (proficiency) => {
  const starIcon = (
    <svg className="proficiency-star" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const awardIcon = (
    <svg className="proficiency-award" fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  switch (proficiency) {
    case 'Novice':
      return <div className="proficiency-icons">{starIcon}</div>;
    case 'Competent':
      return <div className="proficiency-icons">{starIcon}{starIcon}{starIcon}</div>;
    case 'Expert':
      return <div className="proficiency-icons">{starIcon}{starIcon}{starIcon}{starIcon}{starIcon}</div>;
    case 'Master':
      return <div className="proficiency-icons">{awardIcon}</div>;
    default:
      return <div className="proficiency-icons">{starIcon}</div>;
  }
};

const MeditationIcon = () => (
  <svg className="sidebar-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const MicrophoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)

const LoaderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const LayoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
  </svg>
)

const NavigationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)



function SortableTask({ task, onEdit, onUpdateProgress }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.task_id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()
  const isDueSoon = task.due_date && new Date(task.due_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const handleProgressChange = async (newProgress) => {
    // For static deployment, update study plan progress directly
    const updatedPlans = studyPlans.map(plan =>
      plan.unique_id === task.unique_id
        ? { ...plan, progress_percentage: newProgress }
        : plan
    )
    setStudyPlans(updatedPlans)
    localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
    if (onUpdateProgress) onUpdateProgress()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
      onClick={(e) => {
        // Don't open edit modal if clicking on progress slider
        if (e.target.type === 'range') return
        onEdit(task)
      }}
    >
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className={`priority-icon ${task.priority.toLowerCase()}`}>!</span>
      </div>
      <p>{task.description}</p>
      <div className="task-meta">
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={task.progress}
            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
            className="progress-slider"
            title={`Progress: ${task.progress}%`}
          />
        </div>
        <span className="progress-text">{task.progress}%</span>
        {task.due_date && (
          <span className={`due-date ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
            Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
        <div className="labels">
          {task.TaskLabels.map(tl => (
            <span key={tl.label_id} className="label" style={{ backgroundColor: tl.Labels.color }}>
              {tl.Labels.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SubTopicCard({ subtopic, chapterName, onEdit, onUpdateProgress }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `subtopic-${subtopic.subtopic_id}` })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const isCompleted = subtopic.status === 'Completed'
  const isHighPriority = subtopic.is_high_priority

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="subtopic-card glass-card"
      onClick={() => onEdit && onEdit(subtopic)}
    >
      <div className="subtopic-header">
        <div className="subtopic-info">
          <h4 className={`subtopic-title ${isCompleted ? 'completed' : ''}`}>
            {subtopic.name}
          </h4>
          <div className="subtopic-meta">
            <span className="chapter-tag">{chapterName}</span>
            {isHighPriority && (
              <span className="priority-indicator">
                <StarIcon />
                High Priority
              </span>
            )}
          </div>
        </div>
        <div className="subtopic-status">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={async (e) => {
              e.stopPropagation()
              const newStatus = e.target.checked ? 'Completed' : 'Not Started'
              await fetch(`/api/subtopics/${subtopic.subtopic_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
              })
              if (onUpdateProgress) onUpdateProgress()
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      {subtopic.due_date && (
        <div className="subtopic-due-date">
          <ClockIcon />
          <span>Due: {new Date(subtopic.due_date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  )
}

function StudyPlanCard({ studyPlan, bucketColor, onEdit, onUpdateProgress, getStatusColor, getProficiencyColor }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({ id: `studyplan-${studyPlan.unique_id}` })

  // Bring back drag animation but make dropping more prominent
  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isDragging ? 1000 : 'auto'
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
      className={`study-plan-card ${isDragging ? 'dragging' : ''}`}
      onClick={(e) => onEdit(studyPlan, e)}
    >
      <div className="study-plan-header" style={{ backgroundColor: `${bucketColor}20` }}>
        <div className="study-plan-info">
          <h4
            className={`study-plan-title ${studyPlan.learning_status?.toLowerCase().replace(/\s+/g, '-') || ''}`}
            {...attributes}
            {...listeners}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onClick={(e) => {
              e.stopPropagation() // Prevent card click when dragging
            }}
          >
            {studyPlan.topic}
          </h4>
        </div>
      </div>

      <div className="study-plan-status">
        <span
          className="status-badge"
          style={{
            backgroundColor: `${getStatusColor(studyPlan.learning_status)}30`,
            color: getStatusColor(studyPlan.learning_status),
            border: 'none'
          }}
        >
          {studyPlan.learning_status}
        </span>
      </div>

      <div className="study-plan-details">
        <div className="detail-row highlight-row">
          <span className="detail-label highlight-label">Stage:</span>
          <span className="detail-value highlight-value stage-value">{studyPlan.learning_stage}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Proficiency:</span>
          {getProficiencyIcons(studyPlan.learning_proficiency)}
        </div>
        <div className="detail-row highlight-row">
          <span className="detail-label highlight-label">Progress:</span>
          <span className="detail-value highlight-value progress-value">{studyPlan.progress_percentage}%</span>
        </div>
      </div>

      {studyPlan.target_date && (
        <div className="study-plan-due-date">
          <ClockIcon />
          <span>Target: {new Date(studyPlan.target_date).toLocaleDateString()}</span>
        </div>
      )}

      {studyPlan.notes && (
        <div className="study-plan-notes">
          <span>{studyPlan.notes}</span>
        </div>
      )}
    </div>
  )
}

// Function to group study plans by chapter
const groupStudyPlansByChapter = (studyPlans) => {
  const chapterGroups = {}

  studyPlans.forEach(plan => {
    const chapterKey = `${plan.chapter_id}-${plan.chapter_name}`
    if (!chapterGroups[chapterKey]) {
      chapterGroups[chapterKey] = {
        chapter_id: plan.chapter_id,
        chapter_name: plan.chapter_name,
        subject: plan.subject,
        curriculum: plan.curriculum,
        grade: plan.grade,
        studyPlans: [],
        // Aggregate status based on all topics in the chapter
        aggregatedStatus: 'In Queue',
        aggregatedStage: 'Initiated',
        aggregatedProficiency: 0,
        totalTopics: 0,
        completedTopics: 0,
        inProgressTopics: 0,
        averageProgress: 0
      }
    }

    chapterGroups[chapterKey].studyPlans.push(plan)
    chapterGroups[chapterKey].totalTopics++
  })

  // Calculate aggregated status, stage, and proficiency for each chapter
  Object.values(chapterGroups).forEach(chapter => {
    const plans = chapter.studyPlans
    const statusCounts = {
      'Done': plans.filter(p => p.learning_status === 'Done').length,
      'In Progress': plans.filter(p => p.learning_status === 'In Progress').length,
      'To Do': plans.filter(p => p.learning_status === 'To Do').length,
      'In Queue': plans.filter(p => p.learning_status === 'In Queue').length
    }

    chapter.completedTopics = statusCounts['Done']
    chapter.inProgressTopics = statusCounts['In Progress']

    // Calculate average progress
    const totalProgress = plans.reduce((sum, plan) => sum + (plan.progress_percentage || 0), 0)
    chapter.averageProgress = Math.round(totalProgress / plans.length)

    // Determine aggregated status based on priority
    if (statusCounts['In Progress'] > 0) {
      chapter.aggregatedStatus = 'In Progress'
    } else if (statusCounts['To Do'] > 0) {
      chapter.aggregatedStatus = 'To Do'
    } else if (statusCounts['Done'] === chapter.totalTopics) {
      chapter.aggregatedStatus = 'Done'
    } else {
      chapter.aggregatedStatus = 'In Queue'
    }

    // Determine aggregated stage (most advanced stage that at least one topic has reached)
    const stageHierarchy = ['Initiated', 'Skimmed', 'Grasped', 'Practiced', 'Revised', 'Mastered']
    let maxStage = 'Initiated'
    plans.forEach(plan => {
      if (plan.learning_stage) {
        const currentIndex = stageHierarchy.indexOf(plan.learning_stage)
        const maxIndex = stageHierarchy.indexOf(maxStage)
        if (currentIndex > maxIndex) {
          maxStage = plan.learning_stage
        }
      }
    })
    chapter.aggregatedStage = maxStage

    // Calculate aggregated proficiency (average of all topic proficiencies)
    const totalProficiency = plans.reduce((sum, plan) => sum + (plan.learning_proficiency || 0), 0)
    chapter.aggregatedProficiency = Math.round(totalProficiency / plans.length)
  })

  return Object.values(chapterGroups)
}

// Chapter Card Component
function ChapterCard({ chapter, bucketColor, onEdit, onUpdateProgress, getStatusColor, getProficiencyColor, isSelected, onToggleSelect }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({ id: `chapter-${chapter.chapter_id}` })

  // Calculate highest proficiency in chapter
  const getChapterProficiency = () => {
    if (!chapter.studyPlans || chapter.studyPlans.length === 0) return 'Novice'
    
    const proficiencies = { 'Master': 4, 'Expert': 3, 'Competent': 2, 'Novice': 1 }
    const maxProficiency = chapter.studyPlans.reduce((max, plan) => {
      const level = proficiencies[plan.learning_proficiency] || 1
      return Math.max(max, level)
    }, 1)
    
    const profLevel = Object.entries(proficiencies).find(([_, val]) => val === maxProficiency)
    return profLevel ? profLevel[0] : 'Novice'
  }

  const chapterProficiency = getChapterProficiency()

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isDragging ? 1000 : 'auto'
  }

  const progressPercentage = Math.round((chapter.completedTopics / chapter.totalTopics) * 100)

  // Calculate earliest target date and days left
  const targetDates = chapter.studyPlans
    .map(plan => plan.target_date)
    .filter(date => date)
    .map(date => new Date(date))
    .sort((a, b) => a - b)

  const earliestTargetDate = targetDates.length > 0 ? targetDates[0] : null
  const daysLeft = earliestTargetDate
    ? Math.ceil((earliestTargetDate - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        border: isSelected ? '2px solid #8b5cf6' : 'none',
        backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.3)',
        boxShadow: isSelected ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(139, 92, 246, 0.3)' : 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
      className={`chapter-card ${isDragging ? 'dragging' : ''} ${chapter.aggregatedStatus === 'In Queue' ? 'backlog-card' : ''}`}
      onClick={(e) => onEdit(chapter, e)}
    >
      {/* ID and Subject above header */}
      <div className="chapter-meta-top">
        <span className="meta-id">{chapter.chapter_id}</span>
        <span className="meta-subject">{chapter.subject}</span>
        {/* Proficiency Badge */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: 'auto' }}>
          {getProficiencyIcons(chapterProficiency)}
        </div>
      </div>

      <div className="chapter-header" {...attributes} {...listeners} style={{ cursor: isDragging ? 'grabbing' : 'grab', background: chapter.aggregatedStatus === 'In Queue' ? '#f3f4f6' : `linear-gradient(135deg, ${getStatusColor(chapter.aggregatedStatus)}20, ${getStatusColor(chapter.aggregatedStatus)}60)` }}>
        <div className="chapter-info">
          <h4
            className="chapter-title"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {chapter.chapter_name}
          </h4>
        </div>
      </div>

      <div className="chapter-content">
        <div className={`chapter-details-grid ${chapter.aggregatedStatus === 'In Queue' ? 'backlog-grid' : ''}`}>
          {chapter.aggregatedStatus === 'In Queue' ? (
            <>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span
                  className="status-badge"
                  style={{
                    color: getStatusColor(chapter.aggregatedStatus)
                  }}
                >
                  {chapter.aggregatedStatus}
                </span>
              </div>
              {earliestTargetDate && (
                <div className="detail-row">
                  <span className={`target-date-display ${daysLeft !== null && daysLeft < 0 ? 'overdue' : daysLeft !== null && daysLeft <= 7 ? 'urgent' : ''}`}>
                    {daysLeft !== null ? (
                      daysLeft < 0 ? `⏰ ${Math.abs(daysLeft)} days overdue` : `📅 ${daysLeft} days left`
                    ) : (
                      `📅 ${new Date(earliestTargetDate).toLocaleDateString()}`
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span
                  className="status-badge"
                  style={{
                    color: getStatusColor(chapter.aggregatedStatus),
                    fontSize: '11px'
                  }}
                >
                  {chapter.aggregatedStatus}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stage:</span>
                <span
                  className="status-badge"
                  style={{
                    color: '#8b5cf6',
                    fontSize: '11px'
                  }}
                >
                  {chapter.aggregatedStage}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Proficiency:</span>
                <span
                  className="status-badge"
                  style={{
                    color: getProficiencyColor(chapter.aggregatedProficiency),
                    fontSize: '11px'
                  }}
                >
                  {chapter.aggregatedProficiency}%
                </span>
              </div>
            </>
          )}
        </div>

        {chapter.aggregatedStatus !== 'In Queue' && (
          <>
            <div className="chapter-stats-grid">
              <div className="stat-item">
                <span className="stat-label">Topics:</span>
                <span className="stat-value">{chapter.totalTopics}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed:</span>
                <span className="stat-value">{chapter.completedTopics}</span>
              </div>
            </div>

            <div className="chapter-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: progressPercentage === 100 ? '#10b981' : progressPercentage > 0 ? '#f59e0b' : '#6b7280'
                  }}
                ></div>
              </div>
              <div className="progress-info">
                <span className="progress-label">Progress</span>
                <span className="progress-text">{progressPercentage}% Complete</span>
              </div>
            </div>
          </>
        )}

        {earliestTargetDate && chapter.aggregatedStatus !== 'In Queue' && (
          <div className="chapter-target-date">
            <span className={`target-date-display ${daysLeft !== null && daysLeft < 0 ? 'overdue' : daysLeft !== null && daysLeft <= 7 ? 'urgent' : ''}`}>
              {daysLeft !== null ? (
                daysLeft < 0 ? `⏰ ${Math.abs(daysLeft)} days overdue` : `📅 ${daysLeft} days left`
              ) : (
                `📅 ${new Date(earliestTargetDate).toLocaleDateString()}`
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Bucket Component
function Bucket({ bucket, chapters, onEditChapter, onUpdateProgress, onUpdateChapterStatus, getStatusColor, getProficiencyColor, selectedChapters, onToggleChapterSelect }) {
  const { setNodeRef, isOver } = useDroppable({
    id: bucket.id,
  })
  const [isDragOver, setIsDragOver] = useState(false)

  // Filter chapters: show those matching the bucket status, or "In Queue" if status is undefined/null
  const filteredChapters = chapters.filter(chapter => {
    const chapterStatus = chapter.aggregatedStatus || 'In Queue'
    return chapterStatus === bucket.status
  })

  // Get status-based class for glass effect
  const getStatusClass = (status) => {
    switch(status) {
      case 'Done': return 'bucket-done';
      case 'In Progress': return 'bucket-in-progress';
      case 'To Do': return 'bucket-todo';
      case 'In Queue': return 'bucket-backlog';
      default: return '';
    }
  }

  // Handle native drag and drop from footer backlog
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const chapterId = e.dataTransfer.getData('chapterId')
    if (chapterId && onUpdateChapterStatus) {
      // Update chapter status to bucket status
      await onUpdateChapterStatus(chapterId, bucket.status)
    }
  }

  return (
    <div
      ref={setNodeRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bucket bg-gray-50 rounded-lg p-4 min-h-[500px] flex flex-col ${isOver || isDragOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${getStatusClass(bucket.status)}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{bucket.name} ({filteredChapters.length})</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {filteredChapters.map(chapter => (
            <ChapterCard
              key={chapter.chapter_id}
              chapter={chapter}
              bucketColor={getStatusColor(bucket.status)}
              onEdit={onEditChapter}
              onUpdateProgress={onUpdateProgress}
              getStatusColor={getStatusColor}
              getProficiencyColor={getProficiencyColor}
              isSelected={selectedChapters.has(chapter.chapter_id)}
              onToggleSelect={onToggleChapterSelect}
            />
          ))}
          {filteredChapters.length === 0 && (
            <div className="flex items-center justify-center h-32 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-lg">
              No chapters in {bucket.name.toLowerCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StudyPlanGrid({ subject, onUpdate, getStatusColor, getProficiencyColor }) {
  const [studyPlans, setStudyPlans] = useState([])
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [loading, setLoading] = useState(true)

  const columns = [
    { key: 'actions', label: 'Actions', width: '120px', type: 'actions', readonly: true },
    { key: 'unique_id', label: 'Unique ID', width: '140px', type: 'text', readonly: true },
    { key: 'curriculum', label: 'Curriculum', width: '100px', type: 'text' },
    { key: 'grade', label: 'Grade', width: '70px', type: 'number' },
    { key: 'subject', label: 'Subject', width: '100px', type: 'text' },
    { key: 'chapter_id', label: 'Chapter ID', width: '100px', type: 'text' },
    { key: 'chapter_name', label: 'Chapter Name', width: '180px', type: 'text' },
    { key: 'topic_id', label: 'Topic ID', width: '100px', type: 'text' },
    { key: 'topic', label: 'Topic', width: '250px', type: 'text' },
    { key: 'target_date', label: 'Target Date', width: '120px', type: 'date' },
    { key: 'learning_status', label: 'Learning Status', width: '130px', type: 'select', options: ['In Queue', 'To Do', 'In Progress', 'Done', 'Closed'] },
    { key: 'learning_stage', label: 'Learning Stage', width: '130px', type: 'select', options: ['Initiated', 'Skimmed', 'Grasped', 'Practiced', 'Revised'] },
    { key: 'learning_proficiency', label: 'Proficiency', width: '110px', type: 'select', options: ['Novice', 'Competent', 'Expert', 'Master'] },
    { key: 'progress_percentage', label: 'Progress %', width: '100px', type: 'number', min: 0, max: 100 },
    { key: 'notes', label: 'Notes', width: '200px', type: 'text' }
  ]

  useEffect(() => {
    fetchStudyPlans()
  }, [subject])

  const fetchStudyPlans = async () => {
    try {
      setLoading(true)
      // For static deployment, filter from existing study plans data
      const filteredData = subject
        ? studyPlans.filter(plan => plan.subject.toLowerCase() === subject.name.toLowerCase())
        : studyPlans
      setStudyPlans(filteredData)
    } catch (error) {
      console.error('Failed to fetch study plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCellEdit = (uniqueId, columnKey, value) => {
    setEditingCell({ uniqueId, columnKey })
    setEditValue(value || '')
  }

  const handleCellSave = async () => {
    if (!editingCell) return

    try {
      const column = columns.find(col => col.key === editingCell.columnKey)
      let processedValue = editValue

      // Process value based on column type
      if (column.type === 'number') {
        processedValue = parseInt(editValue) || 0
      } else if (column.type === 'date') {
        processedValue = editValue ? new Date(editValue).toISOString() : null
      }

      const data = { [editingCell.columnKey]: processedValue }

      // For static deployment, update localStorage and state directly
      const updatedPlans = studyPlans.map(plan =>
        plan.unique_id === editingCell.uniqueId
          ? { ...plan, [editingCell.columnKey]: processedValue }
          : plan
      )
      setStudyPlans(updatedPlans)
      localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))

      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to update study plan:', error)
    }

    setEditingCell(null)
    setEditValue('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCellSave()
    } else if (e.key === 'Escape') {
      setEditingCell(null)
      setEditValue('')
    }
  }

  const handleAddRow = async () => {
    try {
      const newRow = {
        curriculum: subject?.name || 'JEE',
        grade: 11,
        subject: subject?.name || 'Mathematics',
        chapter_name: 'New Chapter',
        topic: 'New Topic',
        target_date: null,
        learning_status: 'In Queue',
        learning_stage: 'Initiated',
        learning_proficiency: 'Novice',
        progress_percentage: 0,
        notes: ''
      }

      // For static deployment, add to localStorage and state directly
      const updatedPlans = [...studyPlans, { ...newRow, unique_id: `NEW-${Date.now()}` }]
      setStudyPlans(updatedPlans)
      localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to add row:', error)
    }
  }

  const handleDeleteRow = async (uniqueId) => {
    if (!confirm('Are you sure you want to delete this row?')) return

    // For static deployment, remove from localStorage and state directly
    const updatedPlans = studyPlans.filter(plan => plan.unique_id !== uniqueId)
    setStudyPlans(updatedPlans)
    localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
    if (onUpdate) onUpdate()
  }

  const handleInsertRow = async (index) => {
    try {
      const newRow = {
        curriculum: subject?.name || 'JEE',
        grade: 11,
        subject: subject?.name || 'Mathematics',
        chapter_id: `CH-${Date.now()}`,
        chapter_name: 'New Chapter',
        topic: 'New Topic',
        target_date: null,
        learning_status: 'In Queue',
        learning_stage: 'Initiated',
        learning_proficiency: 'Novice',
        progress_percentage: 0,
        notes: ''
      }

      // For static deployment, insert into localStorage and state directly
      const newPlan = { ...newRow, unique_id: `INSERT-${Date.now()}` }
      const updatedPlans = [...studyPlans]
      updatedPlans.splice(index, 0, newPlan)
      setStudyPlans(updatedPlans)
      localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to insert row:', error)
    }
  }

  if (loading) {
    return (
      <div className="study-plan-container">
        <div className="study-plan-header">
          <div className="header-info">
            <h1>{subject ? `${subject.name} Study Plan` : 'Complete Study Plan'}</h1>
            <p>Master curriculum management with comprehensive tracking</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="study-plan-container">
      <div className="excel-grid-container">
        <div className="excel-grid">
          {/* Header Row */}
          <div className="grid-row header-row">
            {columns.map(column => (
              <div
                key={column.key}
                className="grid-cell header-cell"
                style={{ width: column.width, minWidth: column.width }}
              >
                {column.label}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {studyPlans.map(plan => (
            <div key={plan.unique_id} className="grid-row data-row">
              {columns.map(column => (
                <div
                  key={`${plan.unique_id}-${column.key}`}
                  className="grid-cell"
                  style={{ width: column.width, minWidth: column.width }}
                >
                  {column.key === 'actions' && (
                    <div className="action-buttons">
                      <button
                        className="action-btn add-btn"
                        onClick={() => handleInsertRow(studyPlans.indexOf(plan))}
                        title="Insert row above"
                      >
                        +
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteRow(plan.unique_id)}
                        title="Delete row"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {column.key === 'unique_id' && (
                    <span className="readonly-cell">{plan.unique_id}</span>
                  )}
                  {column.key === 'curriculum' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'curriculum' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-input"
                      />
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'curriculum', plan.curriculum)}
                      >
                        {plan.curriculum}
                      </span>
                    )
                  )}
                  {column.key === 'grade' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'grade' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-input"
                        min="9"
                        max="12"
                      />
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'grade', plan.grade.toString())}
                      >
                        {plan.grade}
                      </span>
                    )
                  )}
                  {column.key === 'subject' && (
                    <span className="readonly-cell">{plan.subject}</span>
                  )}
                  {column.key === 'chapter_id' && (
                    <span className="readonly-cell">{plan.chapter_id}</span>
                  )}
                  {column.key === 'chapter_name' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'chapter_name' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-input"
                      />
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'chapter_name', plan.chapter_name)}
                      >
                        {plan.chapter_name}
                      </span>
                    )
                  )}
                  {column.key === 'topic_id' && (
                    <span className="readonly-cell">{plan.topic_id}</span>
                  )}
                  {column.key === 'topic' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'topic' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-input"
                      />
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'topic', plan.topic)}
                      >
                        {plan.topic}
                      </span>
                    )
                  )}
                  {column.key === 'target_date' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'target_date' ? (
                      <input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-input"
                      />
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'target_date', plan.target_date ? new Date(plan.target_date).toISOString().split('T')[0] : '')}
                      >
                        {plan.target_date ? new Date(plan.target_date).toLocaleDateString() : ''}
                      </span>
                    )
                  )}
                  {column.key === 'learning_status' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'learning_status' ? (
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-select"
                      >
                        {column.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className="status-badge"
                        style={{ backgroundColor: `${getStatusColor(plan.learning_status)}20`, color: getStatusColor(plan.learning_status), borderColor: getStatusColor(plan.learning_status) }}
                        onClick={() => handleCellEdit(plan.unique_id, 'learning_status', plan.learning_status)}
                      >
                        {plan.learning_status}
                      </span>
                    )
                  )}
                  {column.key === 'learning_stage' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'learning_stage' ? (
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-select"
                      >
                        {column.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'learning_stage', plan.learning_stage)}
                      >
                        {plan.learning_stage}
                      </span>
                    )
                  )}
                  {column.key === 'learning_proficiency' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'learning_proficiency' ? (
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-select"
                      >
                        {column.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className="proficiency-display"
                        onClick={() => handleCellEdit(plan.unique_id, 'learning_proficiency', plan.learning_proficiency)}
                      >
                        {getProficiencyIcons(plan.learning_proficiency)}
                      </span>
                    )
                  )}
                  {column.key === 'progress_percentage' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'progress_percentage' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-input"
                        min="0"
                        max="100"
                      />
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'progress_percentage', plan.progress_percentage.toString())}
                      >
                        {plan.progress_percentage}%
                      </span>
                    )
                  )}
                  {column.key === 'notes' && (
                    editingCell?.uniqueId === plan.unique_id && editingCell.columnKey === 'notes' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="grid-input"
                      />
                    ) : (
                      <span
                        className="editable-cell"
                        onClick={() => handleCellEdit(plan.unique_id, 'notes', plan.notes || '')}
                      >
                        {plan.notes || ''}
                      </span>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Add Row */}
          <div className="grid-row add-row">
            {columns.map(column => (
              <div
                key={`add-${column.key}`}
                className="grid-cell"
                style={{ width: column.width, minWidth: column.width }}
              >
                {column.key === 'actions' && (
                  <button
                    className="action-btn add-btn primary"
                    onClick={handleAddRow}
                    title="Add new row"
                  >
                    +
                  </button>
                )}
                {column.key !== 'actions' && (
                  <span className="add-placeholder">Click + to add</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Schedule View Component
function ScheduleView() {
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

// Timer View Component
function TimerView() {
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
            <div key={timer.id} className={`rounded-xl border-2 p-6 transition-all duration-300 ${timer.isRunning ? 'border-green-500 bg-green-50' : timer.timeLeft === 0 ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}>
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
                    {(() => {
                      const hours = Math.floor(timer.timeLeft / 3600)
                      const minutes = Math.floor((timer.timeLeft % 3600) / 60)
                      const secs = timer.timeLeft % 60

                      if (hours > 0) {
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                      }
                      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">
                    of {(() => {
                      const hours = Math.floor(timer.duration / 3600)
                      const minutes = Math.floor((timer.duration % 3600) / 60)
                      const secs = timer.duration % 60

                      if (hours > 0) {
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                      }
                      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                    })()}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    timer.isRunning ? 'bg-green-500' : timer.timeLeft === 0 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${((timer.duration - timer.timeLeft) / timer.duration) * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {!timer.isRunning && timer.timeLeft === timer.duration && (
                    <button
                      onClick={() => handleStart(timer.id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <PlayIcon />
                    </button>
                  )}

                  {timer.isRunning && (
                    <button
                      onClick={() => handlePause(timer.id)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <PauseIcon />
                    </button>
                  )}

                  {timer.isRunning || timer.timeLeft < timer.duration && (
                    <button
                      onClick={() => handleStop(timer.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <StopIcon />
                    </button>
                  )}

                  <button
                    onClick={() => handleReset(timer.id)}
                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <ResetIcon />
                  </button>
                </div>

                <div className="flex gap-2">
                  {timer.presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handleUpdateDuration(timer.id, preset * 60)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      {preset}m
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      const customDuration = prompt('Enter duration in minutes:')
                      if (customDuration && parseInt(customDuration) > 0) {
                        handleUpdateDuration(timer.id, parseInt(customDuration) * 60)
                      }
                    }}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                  >
                    Custom
                  </button>
                </div>
              </div>

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

// Dashboard View Component
function DashboardView() {
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
          <div className="p-6 rounded-xl border bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Study Progress</p>
                <p className="text-3xl font-bold text-blue-700">{studyData.averageProgress}%</p>
                <p className="text-sm text-blue-600 mt-1">{studyData.completedTopics}/{studyData.totalTopics} topics</p>
                <div className="flex items-center mt-2">
                  <TrendingUpIcon />
                  <span className="text-sm ml-1 text-blue-600">+5% this week</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpenIcon />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Timers</p>
                <p className="text-3xl font-bold text-green-700">{timerData?.activeTimers || 0}</p>
                <p className="text-sm text-green-600 mt-1">Currently running</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Upcoming Events</p>
                <p className="text-3xl font-bold text-yellow-700">{scheduleData?.upcomingEvents || 0}</p>
                <p className="text-sm text-yellow-600 mt-1">This month</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CalendarIcon />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Study Streak</p>
                <p className="text-3xl font-bold text-purple-700">7</p>
                <p className="text-sm text-purple-600 mt-1">Days in a row</p>
                <p className="text-sm text-purple-600 mt-2">Keep it up!</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrophyIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Weekly Study Progress</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyProgressData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300"
                    style={{ height: `${(item.value / 100) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {subjectProgressData.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Subject-wise Progress</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {subjectProgressData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t transition-all duration-300"
                      style={{ height: `${item.value}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-2 text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bars Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Study Topics Progress</h3>
            <div className="space-y-4">
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Completed Topics</span>
                  <span className="text-sm text-gray-500">{studyData.completedTopics}/{studyData.totalTopics}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-green-500"
                    style={{ width: `${(studyData.completedTopics / studyData.totalTopics) * 100}%` }}
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">In Progress Topics</span>
                  <span className="text-sm text-gray-500">{studyData.inProgressTopics}/{studyData.totalTopics}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-blue-500"
                    style={{ width: `${(studyData.inProgressTopics / studyData.totalTopics) * 100}%` }}
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Remaining Topics</span>
                  <span className="text-sm text-gray-500">{studyData.totalTopics - studyData.completedTopics - studyData.inProgressTopics}/{studyData.totalTopics}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-yellow-500"
                    style={{ width: `${((studyData.totalTopics - studyData.completedTopics - studyData.inProgressTopics) / studyData.totalTopics) * 100}%` }}
                  />
                </div>
              </div>
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

export default function Home() {
  const [plans, setPlans] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingChapter, setEditingChapter] = useState(null)
  const [editingTopicId, setEditingTopicId] = useState(null) // Track which topic is being edited
  const [editingTask, setEditingTask] = useState(null)
  const [addingTaskToBucket, setAddingTaskToBucket] = useState(null)
  const [comments, setComments] = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterLabel, setFilterLabel] = useState('All')
  const [selectedDueDate, setSelectedDueDate] = useState(null)
  const [backgroundTheme, setBackgroundTheme] = useState('mountains')
  const [navbarBackground, setNavbarBackground] = useState('default')
  const [viewMode, setViewMode] = useState('kanban') // Only Kanban view - simplified
  const [groupBy, setGroupBy] = useState('status') // status, stage, proficiency
  const [studyPlans, setStudyPlans] = useState([])
  const [weatherEffect, setWeatherEffect] = useState(false)
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState('zen-mixed')
  const [musicVolume, setMusicVolume] = useState(0.2)
  const [musicPlaying, setMusicPlaying] = useState(true) // Auto-play zen rhythms
  const [zenRhythmsEnabled, setZenRhythmsEnabled] = useState(true)
  const [editingStudyPlan, setEditingStudyPlan] = useState(null)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [subTopics, setSubTopics] = useState([])
  const [newSubTopic, setNewSubTopic] = useState('')
  const [voiceRecordings, setVoiceRecordings] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Changed to false - expanded by default for desktop
  const [currentPage, setCurrentPage] = useState('kanban') // 'kanban', 'schedule', 'timer', 'dashboard'
  
  // Container visibility states for responsive layout
  const [showTopHeader, setShowTopHeader] = useState(true)
  const [showNavBar, setShowNavBar] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [showNavigationHint, setShowNavigationHint] = useState(false)
  
  // New MS Planner features
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default') // 'default', 'progress', 'duedate', 'proficiency'
  const [selectedChapters, setSelectedChapters] = useState(new Set())
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'Done', 'In Progress', 'To Do', 'In Queue'
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Utility functions for colors
  const getStatusColor = (status) => {
    const colors = {
      'In Queue': '#6b7280',
      'To Do': '#3b82f6',
      'In Progress': '#f59e0b',
      'Done': '#10b981',
      'Closed': '#8b5cf6'
    }
    return colors[status] || '#6b7280'
  }

  const getProficiencyColor = (proficiency) => {
    const colors = {
      'Novice': '#ef4444',
      'Competent': '#f59e0b',
      'Expert': '#3b82f6',
      'Master': '#10b981'
    }
    return colors[proficiency] || '#6b7280'
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Dynamic Bucket configuration based on Group By
  const getBuckets = () => {
    if (groupBy === 'status') {
      return [
        { id: 'backlog', name: 'Backlog', status: 'In Queue', field: 'aggregatedStatus' },
        { id: 'todo', name: 'To Do', status: 'To Do', field: 'aggregatedStatus' },
        { id: 'inprogress', name: 'In Progress', status: 'In Progress', field: 'aggregatedStatus' },
        { id: 'done', name: 'Done', status: 'Done', field: 'aggregatedStatus' }
      ]
    } else if (groupBy === 'stage') {
      return [
        { id: 'initiated', name: 'Initiated', status: 'Initiated', field: 'aggregatedStage' },
        { id: 'skimmed', name: 'Skimmed', status: 'Skimmed', field: 'aggregatedStage' },
        { id: 'grasped', name: 'Grasped', status: 'Grasped', field: 'aggregatedStage' },
        { id: 'revised', name: 'Revised', status: 'Revised', field: 'aggregatedStage' },
        { id: 'mastered', name: 'Mastered', status: 'Mastered', field: 'aggregatedStage' }
      ]
    } else if (groupBy === 'proficiency') {
      return [
        { id: 'novice', name: 'Novice', status: 'Novice', field: 'aggregatedProficiency' },
        { id: 'competent', name: 'Competent', status: 'Competent', field: 'aggregatedProficiency' },
        { id: 'expert', name: 'Expert', status: 'Expert', field: 'aggregatedProficiency' },
        { id: 'master', name: 'Master', status: 'Master', field: 'aggregatedProficiency' }
      ]
    }
  }
  
  const buckets = getBuckets()

  // Debug: Log chapter distribution
  useEffect(() => {
    if (studyPlans && studyPlans.length > 0 && selectedSubject) {
      const filteredPlans = studyPlans.filter(plan => plan.subject === selectedSubject.name)
      const chapters = groupStudyPlansByChapter(filteredPlans)
      const statusDistribution = {}
      chapters.forEach(chapter => {
        const status = chapter.aggregatedStatus || 'Unknown'
        statusDistribution[status] = (statusDistribution[status] || 0) + 1
      })
      console.log(`[CHART] Chapters for ${selectedSubject.name}:`, {
        totalChapters: chapters.length,
        totalTopics: filteredPlans.length,
        statusDistribution,
        chapters: chapters.map(c => ({ name: c.chapter_name, status: c.aggregatedStatus, topics: c.totalTopics }))
      })
    }
  }, [studyPlans, selectedSubject])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Apply background theme to body
    document.body.className = `bg-${backgroundTheme}`
  }, [backgroundTheme])

  // Zen Rhythms Auto-Play Effect
  useEffect(() => {
    if (zenRhythmsEnabled && musicPlaying) {
      // Auto-cycle through zen rhythms every 30 minutes for variety
      const rhythmInterval = setInterval(() => {
        const zenTracks = ['zen-mixed', 'zen-forest', 'zen-rain', 'zen-wind', 'zen-birds', 'zen-water']
        const currentIndex = zenTracks.indexOf(backgroundMusic)
        const nextIndex = (currentIndex + 1) % zenTracks.length
        setBackgroundMusic(zenTracks[nextIndex])
      }, 30 * 60 * 1000) // 30 minutes

      return () => clearInterval(rhythmInterval)
    }
  }, [zenRhythmsEnabled, musicPlaying, backgroundMusic])

  // Scrollbar-free keyboard navigation
  useEffect(() => {
    const handleKeyboardNav = (e) => {
      const bucketsContainer = document.querySelector('.buckets-container')
      if (!bucketsContainer) return

      const scrollAmount = 350 // Width of one bucket approximately

      switch(e.key) {
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            bucketsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
          }
          break
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            bucketsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' })
          }
          break
        case 'Home':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            bucketsContainer.scrollTo({ left: 0, behavior: 'smooth' })
          }
          break
        case 'End':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            bucketsContainer.scrollTo({ left: bucketsContainer.scrollWidth, behavior: 'smooth' })
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyboardNav)
    return () => window.removeEventListener('keydown', handleKeyboardNav)
  }, [])

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const bucketsContainer = document.querySelector('.buckets-container')
      if (!bucketsContainer) return

      const scrollPercentage = (bucketsContainer.scrollLeft / (bucketsContainer.scrollWidth - bucketsContainer.clientWidth)) * 100
      
      let progressBar = document.querySelector('.kanban-scroll-progress')
      if (!progressBar) {
        progressBar = document.createElement('div')
        progressBar.className = 'kanban-scroll-progress'
        progressBar.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
          transition: width 0.1s ease;
          z-index: 10;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        `
        bucketsContainer.parentElement?.appendChild(progressBar)
      }
      progressBar.style.width = `${scrollPercentage}%`
    }

    const bucketsContainer = document.querySelector('.buckets-container')
    if (bucketsContainer) {
      bucketsContainer.addEventListener('scroll', handleScroll)
      return () => bucketsContainer.removeEventListener('scroll', handleScroll)
    }
  }, [currentPage])

  // Touch gesture support for mobile scrollbar-free navigation
  useEffect(() => {
    const bucketsContainer = document.querySelector('.buckets-container')
    if (!bucketsContainer) return

    let touchStartX = 0
    let touchStartY = 0
    let scrollStartX = 0
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      scrollStartX = bucketsContainer.scrollLeft
    }
    
    const handleTouchMove = (e) => {
      const touchCurrentX = e.touches[0].clientX
      const touchCurrentY = e.touches[0].clientY
      const deltaX = touchStartX - touchCurrentX
      const deltaY = Math.abs(touchStartY - touchCurrentY)
      
      // If horizontal swipe is more significant than vertical, scroll horizontally
      if (Math.abs(deltaX) > deltaY) {
        e.preventDefault() // Prevent vertical scroll
        bucketsContainer.scrollLeft = scrollStartX + deltaX
      }
    }
    
    const handleTouchEnd = () => {
      // Optional: snap to nearest column after swipe
      const bucketWidth = 340 // Approximate width of one bucket
      const currentScroll = bucketsContainer.scrollLeft
      const nearestColumn = Math.round(currentScroll / bucketWidth)
      bucketsContainer.scrollTo({
        left: nearestColumn * bucketWidth,
        behavior: 'smooth'
      })
    }

    bucketsContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
    bucketsContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
    bucketsContainer.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      bucketsContainer.removeEventListener('touchstart', handleTouchStart)
      bucketsContainer.removeEventListener('touchmove', handleTouchMove)
      bucketsContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentPage])

  const fetchData = async () => {
    // Try to load from database export first, then localStorage, then fallback
    let finalStudyPlansData = []

    try {
      // Try to fetch the database export from public folder
      const response = await fetch('/ProdyJEE/database-export.json')
      if (response.ok) {
        const data = await response.json()
        finalStudyPlansData = data.studyPlans || data
        console.log(`✅ Loaded ${finalStudyPlansData.length} records from database export`)
      } else {
        throw new Error('Database export not found')
      }
    } catch (dbError) {
      console.warn('⚠️ Database export not available, trying localStorage...', dbError.message)
      
      // Fallback to localStorage
      const existingData = localStorage.getItem('study-plans-data')
      if (existingData) {
        try {
          finalStudyPlansData = JSON.parse(existingData)
          console.log(`✅ Loaded ${finalStudyPlansData.length} records from localStorage`)
        } catch (parseError) {
          console.error('❌ Failed to parse localStorage data:', parseError)
          finalStudyPlansData = []
        }
      }

      // If still no data, use fallback demo data
      if (finalStudyPlansData.length === 0) {
        console.warn('⚠️ Using fallback demo data')
        finalStudyPlansData = [
        {
          unique_id: "PHY-1.1",
          curriculum: "CBSE",
          grade: 12,
          subject: "Physics",
          chapter_id: "PHY-1",
          chapter_name: "Physical World",
          topic_id: "PHY-1.1",
          topic: "Scope and excitement of physics",
          target_date: "2025-12-31T00:00:00.000Z",
          learning_status: "Done",
          learning_stage: "Practiced",
          learning_proficiency: "Expert",
          progress_percentage: 100,
          notes: "Completed all practice problems and revision."
        },
        {
          unique_id: "PHY-1.2",
          curriculum: "CBSE",
          grade: 12,
          subject: "Physics",
          chapter_id: "PHY-1",
          chapter_name: "Physical World",
          topic_id: "PHY-1.2",
          topic: "Physics technology and society",
          target_date: "2025-12-31T00:00:00.000Z",
          learning_status: "In Progress",
          learning_stage: "Studied",
          learning_proficiency: "Competent",
          progress_percentage: 66,
          notes: "Working on applications in daily life."
        },
        {
          unique_id: "PHY-1.3",
          curriculum: "CBSE",
          grade: 12,
          subject: "Physics",
          chapter_id: "PHY-1",
          chapter_name: "Physical World",
          topic_id: "PHY-1.3",
          topic: "Nature of physical laws",
          target_date: "2025-12-31T00:00:00.000Z",
          learning_status: "To Do",
          learning_stage: "Initiated",
          learning_proficiency: "Novice",
          progress_percentage: 0,
          notes: "Need to start studying fundamental laws."
        },
        {
          unique_id: "CHM-1.1",
          curriculum: "CBSE",
          grade: 12,
          subject: "Chemistry",
          chapter_id: "CHM-1",
          chapter_name: "The Solid State",
          topic_id: "CHM-1.1",
          topic: "General characteristics of solid state",
          target_date: "2025-12-31T00:00:00.000Z",
          learning_status: "To Do",
          learning_stage: "Initiated",
          learning_proficiency: "Novice",
          progress_percentage: 0,
          notes: "Need to start studying crystal structures."
        },
        {
          unique_id: "CHM-1.2",
          curriculum: "CBSE",
          grade: 12,
          subject: "Chemistry",
          chapter_id: "CHM-1",
          chapter_name: "The Solid State",
          topic_id: "CHM-1.2",
          topic: "Classification of solids",
          target_date: "2025-12-31T00:00:00.000Z",
          learning_status: "In Queue",
          learning_stage: "Initiated",
          learning_proficiency: "Novice",
          progress_percentage: 0,
          notes: "Study crystalline and amorphous solids."
        },
        {
          unique_id: "MTH-1.1",
          curriculum: "CBSE",
          grade: 12,
          subject: "Mathematics",
          chapter_id: "MTH-1",
          chapter_name: "Relations and Functions",
          topic_id: "MTH-1.1",
          topic: "Introduction to relations and functions",
          target_date: "2025-12-31T00:00:00.000Z",
          learning_status: "In Queue",
          learning_stage: "Initiated",
          learning_proficiency: "Novice",
          progress_percentage: 0,
          notes: "Basic concepts of sets and relations."
        }
      ]
      }
    }

    // Extract unique subjects from study plans
    const uniqueSubjects = [...new Set(finalStudyPlansData.map(plan => plan.subject))]
    const subjectsData = uniqueSubjects.map((subject, index) => ({
      subject_id: index + 1,
      name: subject,
      Chapters: [] // Empty chapters array since we're not using the old structure
    }))

    setPlans([]) // Clear plans since we're not using them
    setSubjects(subjectsData)
    setStudyPlans(finalStudyPlansData)
    if (subjectsData.length > 0) setSelectedSubject(subjectsData[0])
    setLoading(false)
  }

  const deleteAllCards = async () => {
    if (!confirm('Are you sure you want to delete ALL study plan cards? This action cannot be undone.')) {
      return
    }

    try {
      // For static deployment, just clear local state and localStorage
      setStudyPlans([])
      localStorage.removeItem('study-plans-data')
      alert('All study plan cards have been deleted successfully.')
    } catch (error) {
      console.error('Failed to delete all cards:', error)
      alert('Failed to delete all cards. Please try again.')
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId.startsWith('studyplan-')) {
      const studyPlanId = activeId.replace('studyplan-', '')
      const targetBucket = buckets.find(b => b.id === overId)

      if (targetBucket) {
        // Add dropping animation effect
        const draggedElement = document.querySelector(`[data-id="${activeId}"]`)
        if (draggedElement) {
          draggedElement.classList.add('dropping')
          setTimeout(() => {
            draggedElement.classList.remove('dropping')
          }, 600)
        }

        try {
          await fetch(`/api/study-plan/${studyPlanId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ learning_status: targetBucket.status })
          })
          fetchData() // Refresh data
        } catch (error) {
          console.error('Failed to update study plan:', error)
        }
      }
    }
  }

  const handleChapterDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId.startsWith('chapter-')) {
      const chapterId = activeId.replace('chapter-', '')
      const targetBucket = buckets.find(b => b.id === overId)

      if (targetBucket) {
        // Add dropping animation effect
        const draggedElement = document.querySelector(`[data-id="${activeId}"]`)
        if (draggedElement) {
          draggedElement.classList.add('dropping')
          setTimeout(() => {
            draggedElement.classList.remove('dropping')
          }, 600)
        }

        try {
          // Update all study plans in this chapter to the new status (local state for static deployment)
          const chapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
          const draggedChapter = chapters.find(ch => ch.chapter_id === chapterId)

          if (draggedChapter) {
            // Update local state directly
            setStudyPlans(prev => prev.map(plan =>
              draggedChapter.studyPlans.some(chapterPlan => chapterPlan.unique_id === plan.unique_id)
                ? { ...plan, learning_status: targetBucket.status }
                : plan
            ))
          }
        } catch (error) {
          console.error('Failed to update chapter:', error)
        }
      }
    }
  }

  // Function to update chapter status from footer backlog
  const updateChapterStatus = async (chapterId, newStatus) => {
    try {
      const chapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
      const chapter = chapters.find(ch => ch.chapter_id === chapterId)

      if (chapter) {
        // Update local state
        const updatedPlans = studyPlans.map(plan =>
          chapter.studyPlans.some(chapterPlan => chapterPlan.unique_id === plan.unique_id)
            ? { ...plan, learning_status: newStatus }
            : plan
        )
        setStudyPlans(updatedPlans)
        localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
      }
    } catch (error) {
      console.error('Failed to update chapter status:', error)
    }
  }

  const onEditChapter = async (chapter, event) => {
    setEditingChapter(chapter)
  }

  const onEditSubTopic = async (subtopic) => {
    // For now, we'll open the chapter modal with the specific subtopic highlighted
    // Later we can create a dedicated subtopic modal
    const chapter = selectedSubject.Chapters.find(ch => 
      ch.SubTopics.some(st => st.subtopic_id === subtopic.subtopic_id)
    )
    if (chapter) {
      setEditingChapter(chapter)
    }
  }

  const onEditStudyPlan = async (studyPlan, event) => {
    setEditingStudyPlan(studyPlan)
    // For static deployment, subtopics are not implemented
    setSubTopics([])
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        const newRecording = {
          id: Date.now(),
          url: url,
          blob: blob,
          timestamp: new Date().toLocaleString()
        }
        setVoiceRecordings([...voiceRecordings, newRecording])
        stream.getTracks().forEach(track => track.stop())
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const playRecording = (url) => {
    const audio = new Audio(url)
    audio.play()
  }

  const deleteRecording = (id) => {
    setVoiceRecordings(voiceRecordings.filter(recording => recording.id !== id))
  }

  const onEditTask = async (task) => {
    setEditingTask(task)
    setSelectedDueDate(task.due_date ? new Date(task.due_date) : null)
    // For static deployment, comments and subtasks are not implemented
    setComments([])
    setSubtasks([])
  }

  // MS Planner Features: Sorting and Filtering
  const sortChapters = (chapters) => {
    const sorted = [...chapters]
    
    switch (sortBy) {
      case 'progress':
        return sorted.sort((a, b) => b.averageProgress - a.averageProgress)
      
      case 'duedate':
        return sorted.sort((a, b) => {
          const dateA = a.studyPlans
            .map(p => new Date(p.target_date))
            .filter(d => !isNaN(d))[0] || new Date(9999, 0, 1)
          const dateB = b.studyPlans
            .map(p => new Date(p.target_date))
            .filter(d => !isNaN(d))[0] || new Date(9999, 0, 1)
          return dateA - dateB
        })
      
      case 'proficiency':
        const proficiencyOrder = { 'Master': 0, 'Expert': 1, 'Competent': 2, 'Novice': 3 }
        return sorted.sort((a, b) => {
          const aProf = Math.max(...a.studyPlans.map(p => proficiencyOrder[p.learning_proficiency] || 999))
          const bProf = Math.max(...b.studyPlans.map(p => proficiencyOrder[p.learning_proficiency] || 999))
          return aProf - bProf
        })
      
      default:
        return sorted
    }
  }

  const filterChapters = (chapters) => {
    return chapters.filter(chapter => {
      // Status filter
      if (filterStatus !== 'all' && chapter.aggregatedStatus !== filterStatus) {
        return false
      }
      
      // Search filter - search in chapter name and topics
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesChapter = chapter.chapter_name.toLowerCase().includes(query)
        const matchesTopic = chapter.studyPlans.some(plan => 
          plan.topic.toLowerCase().includes(query)
        )
        return matchesChapter || matchesTopic
      }
      
      return true
    })
  }

  const handleBulkStatusChange = (newStatus) => {
    if (selectedChapters.size === 0) {
      alert('Please select chapters first')
      return
    }

    if (!confirm(`Update status of ${selectedChapters.size} chapter(s) to "${newStatus}"?`)) {
      return
    }

    const updatedPlans = studyPlans.map(plan => {
      if (selectedChapters.has(plan.chapter_id)) {
        return { ...plan, learning_status: newStatus }
      }
      return plan
    })

    setStudyPlans(updatedPlans)
    localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
    setSelectedChapters(new Set())
    setShowBulkActions(false)
  }

  const toggleChapterSelect = (chapterId) => {
    const newSelected = new Set(selectedChapters)
    if (newSelected.has(chapterId)) {
      newSelected.delete(chapterId)
    } else {
      newSelected.add(chapterId)
    }
    setSelectedChapters(newSelected)
  }

  const selectAllChapters = () => {
    const allChapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
    const filtered = filterChapters(allChapters)
    const newSelected = new Set()
    filtered.forEach(chapter => {
      newSelected.add(chapter.chapter_id)
    })
    setSelectedChapters(newSelected)
  }

  const deselectAllChapters = () => {
    setSelectedChapters(new Set())
  }

  const onAddTask = (bucketId) => {
    setAddingTaskToBucket(bucketId)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app-container">
      {/* 1. TOP HEADER CONTAINER - Fixed at top */}
      {showTopHeader && (
        <header className="top-header-container">
          {/* Left Section - Brand & Actions (Max 16% width) */}
          <div className="header-content">
            {/* App Logo, Title */}
            <div className="header-brand">
              <div className="brand-logo">
                <span className="brand-main">Prody</span>
                <span className="brand-jee">JEE</span>
                <span className="brand-accent">™</span>
              </div>
              <div className="brand-subtitle">
                <span>Peepal Prodigy School</span>
              </div>
            </div>

            {/* Settings Actions */}
            <div className="header-actions">
              <button
                className={`header-action-btn ${showSettingsPanel ? 'active' : ''}`}
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                title="Settings"
              >
                <SettingsIcon />
              </button>
              <a
                href="/login"
                className="header-action-btn user-profile"
                title="User Profile"
              >
                <UserIcon />
              </a>
            </div>
          </div>

          {/* Right Section - Navigation (Takes remaining space) */}
          <div className="header-nav-section">
            {/* Search Bar */}
            <div className="header-search">
              <input
                type="text"
                placeholder="Search chapters, subjects, goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </header>
      )}

      {/* 2. TOP NAVIGATION BAR CONTAINER - Filters and Controls Only */}
      {showNavBar && (
        <nav className="top-navbar-container">
          <div className="navbar-wrapper">
            {/* Breadcrumb Navigation */}
            <div className="navbar-breadcrumb">
              <button 
                className="breadcrumb-item clickable"
                onClick={() => setCurrentPage('kanban')}
              >
                <HomeIcon />
                <span>Home</span>
              </button>
              <span className="breadcrumb-separator">/</span>
              <button 
                className={`breadcrumb-item ${!selectedSubject ? 'active' : 'clickable'}`}
                onClick={() => {
                  setSelectedSubject(null)
                  setCurrentPage('kanban')
                }}
              >
                Study Plans
              </button>
              {selectedSubject && (
                <>
                  <span className="breadcrumb-separator">/</span>
                  <button 
                    className="breadcrumb-item active clickable"
                    onClick={() => {
                      // Keep subject selected, just reset to top of page
                      setCurrentPage('kanban')
                    }}
                  >
                    {selectedSubject.name}
                  </button>
                </>
              )}
            </div>

            {/* Subject Filter Tabs */}
            <div className="navbar-filters">
              {subjects.slice(0, 4).map(subject => (
                <button
                  key={subject.subject_id}
                  className={`navbar-filter-tab ${selectedSubject?.subject_id === subject.subject_id ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <BookOpenIcon />
                  <span>{subject.name}</span>
                </button>
              ))}
            </div>

            {/* Group By Controls */}
            {selectedSubject && viewMode === 'kanban' && (
              <div className="navbar-controls">
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="navbar-select"
                >
                  <option value="status">Group by Status</option>
                  <option value="stage">Group by Stage</option>
                  <option value="proficiency">Group by Proficiency</option>
                </select>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Content Wrapper - Contains Sidebar + Main Content */}
      <div className="content-wrapper">
        {/* 3. LEFT SIDEBAR CONTAINER */}
        {showSidebar && (
          <aside 
            className={`left-sidebar-container ${sidebarCollapsed ? 'collapsed' : 'expanded'}`}
            onClick={(e) => {
              // Only toggle if clicking on the sidebar background, not on navigation items
              if (e.target === e.currentTarget || e.target.closest('.sidebar-header') || e.target.closest('.sidebar-footer')) {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
          >
            <div className="sidebar-header">
              <button
                className="sidebar-toggle-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarCollapsed(!sidebarCollapsed);
                }}
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? <MenuIcon /> : <XIcon />}
              </button>
            </div>            <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
              {/* Main Navigation Menu */}
              {!sidebarCollapsed && (
                <div className="sidebar-section">
                  <h4 className="sidebar-section-title">Navigation</h4>
                  <button
                    className={`sidebar-nav-item ${currentPage === 'kanban' ? 'active' : ''}`}
                    onClick={() => setCurrentPage('kanban')}
                  >
                    <HomeIcon />
                    <span>Dashboard</span>
                  </button>
                  <a
                    href="/ProdyJEE/dashboard"
                    className="sidebar-nav-item"
                  >
                    <BarChartIcon />
                    <span>Analytics</span>
                  </a>
                  <a
                    href="/ProdyJEE/schedule"
                    className="sidebar-nav-item"
                  >
                    <CalendarIcon />
                    <span>Schedule</span>
                  </a>
                  <a
                    href="/ProdyJEE/timer"
                    className="sidebar-nav-item"
                  >
                    <TimerIcon />
                    <span>Timer</span>
                  </a>
                  <a
                    href="/ProdyJEE/goals"
                    className="sidebar-nav-item"
                  >
                    <MeditationIcon />
                    <span>Goals</span>
                  </a>
                </div>
              )}
            </div>
            
            <div className="sidebar-footer">
              {!sidebarCollapsed && (
                <div className="sidebar-attribution">
                  by Sasha Nagarajan, 11th Grade, Peepal Prodigy School, Madukkarai, Coimbatore
                </div>
              )}
            </div>
          </aside>
        )}

        {/* 4. MAIN CONTENT CONTAINER */}
        <main className="main-content-container">
          {currentPage === 'kanban' && (
          <>
            {selectedSubject && viewMode === 'kanban' && (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCorners}
                  onDragEnd={handleChapterDragEnd}
                >
                  <div className="kanban-board">
                    <div className="buckets-container">
                      {buckets.map(bucket => {
                        const allChapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
                        const filtered = filterChapters(allChapters)
                        const sorted = sortChapters(filtered)
                        const bucketChapters = sorted.filter(chapter => chapter[bucket.field] === bucket.status)
                        
                        return (
                          <Bucket
                            key={bucket.id}
                            bucket={bucket}
                            chapters={bucketChapters}
                            onEditChapter={onEditChapter}
                            onUpdateProgress={fetchData}
                            onUpdateChapterStatus={updateChapterStatus}
                            getStatusColor={getStatusColor}
                            getProficiencyColor={getProficiencyColor}
                            selectedChapters={selectedChapters}
                            onToggleChapterSelect={toggleChapterSelect}
                          />
                        )
                      })}
                    </div>
                    
                    {/* Keyboard Navigation Hint */}
                    {showNavigationHint && (
                      <div className="keyboard-hint">
                        <div style={{ marginBottom: '4px', fontWeight: 600, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <NavigationIcon />
                          <span>Scrollbar-Free Navigation</span>
                        </div>
                        <div>
                          <kbd>Ctrl</kbd> + <kbd>←</kbd> / <kbd>→</kbd> Navigate columns
                        </div>
                        <div>
                          <kbd>Ctrl</kbd> + <kbd>Home</kbd> / <kbd>End</kbd> Jump to start/end
                        </div>
                        <div style={{ marginTop: '4px', fontSize: '10px', color: '#9ca3af' }}>
                          Mouse wheel also scrolls horizontally
                        </div>
                      </div>
                    )}
                  </div>
                </DndContext>
              </>
            )}

            {selectedSubject && viewMode === 'study-plan' && (
              <StudyPlanGrid
                subject={selectedSubject}
                onUpdate={fetchData}
                getStatusColor={getStatusColor}
                getProficiencyColor={getProficiencyColor}
              />
            )}
          </>
        )}

        {currentPage === 'schedule' && (
          <ScheduleView />
        )}

        {currentPage === 'timer' && (
          <TimerView />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView />
        )}
        </main>
        {/* End of MAIN CONTENT CONTAINER */}
      </div>
      {/* End of Content Wrapper */}

      {/* 5. FOOTER CONTAINER - Overview Summary & Voice Assistant AI */}
      {showFooter && (
        <footer className="footer-container">
          <div className="footer-content">
            {/* Left - Overview Summary */}
            <div className="footer-overview">
              {selectedSubject && (
                <>
                  <div className="footer-stat">
                    <span className="footer-stat-icon"><BookOpenIcon /></span>
                    <span className="footer-stat-value">
                      {groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name)).length}
                    </span>
                    <span className="footer-stat-label">Chapters</span>
                  </div>
                  {groupBy === 'status' && (
                    <>
                      <div className="footer-stat backlog">
                        <span className="footer-stat-icon"><ClockIcon /></span>
                        <span className="footer-stat-value">
                          {groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
                            .filter(chapter => chapter.aggregatedStatus === 'In Queue').length}
                        </span>
                        <span className="footer-stat-label">Backlog</span>
                      </div>
                      <div className="footer-stat progress">
                        <span className="footer-stat-icon"><LoaderIcon /></span>
                        <span className="footer-stat-value">
                          {groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
                            .filter(chapter => chapter.aggregatedStatus === 'In Progress').length}
                        </span>
                        <span className="footer-stat-label">In Progress</span>
                      </div>
                      <div className="footer-stat done">
                        <span className="footer-stat-icon"><CheckCircleIcon /></span>
                        <span className="footer-stat-value">
                          {groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
                            .filter(chapter => chapter.aggregatedStatus === 'Done').length}
                        </span>
                        <span className="footer-stat-label">Completed</span>
                      </div>
                    </>
                  )}
                </>
              )}
              <span className="footer-text">© 2024 ProdyJEE - Peepal Prodigy School</span>
            </div>

            {/* Right - Voice Assistant */}
            <div className="footer-assistant">
              <button
                className="voice-assistant-btn"
                onClick={() => {
                  // Voice assistant logic - future implementation
                  alert('Voice Assistant AI - Coming Soon!\nCapture notes, to-dos, and voice commands.')
                }}
                title="Voice Assistant - Click to activate"
              >
                <div className="voice-icon"><MicrophoneIcon /></div>
                <div className="voice-pulse"></div>
                <span className="voice-label">AI Assistant</span>
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Modern Settings Panel */}
      {showSettingsPanel && (
        <div className="settings-panel-overlay" onClick={() => setShowSettingsPanel(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-panel-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutIcon />
                <span>Settings</span>
              </h3>
              <button 
                className="settings-close-btn"
                onClick={() => setShowSettingsPanel(false)}
              >
                <XIcon />
              </button>
            </div>
            
            <div className="settings-panel-content">
              {/* Container Visibility Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">Container Visibility</h4>
                <p className="settings-section-description">
                  Toggle visibility of different layout containers
                </p>
                
                <div className="settings-toggle-group">
                  <div className="settings-toggle-item">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-icon"><GridIcon /></span>
                      <div className="settings-toggle-text">
                        <span className="settings-toggle-label">Top Header</span>
                        <span className="settings-toggle-desc">Brand, search, and actions</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showTopHeader}
                        onChange={() => setShowTopHeader(!showTopHeader)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-icon"><NavigationIcon /></span>
                      <div className="settings-toggle-text">
                        <span className="settings-toggle-label">Navigation Bar</span>
                        <span className="settings-toggle-desc">Subject filters and controls</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showNavBar}
                        onChange={() => setShowNavBar(!showNavBar)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-icon"><MenuIcon /></span>
                      <div className="settings-toggle-text">
                        <span className="settings-toggle-label">Left Sidebar</span>
                        <span className="settings-toggle-desc">Navigation and breadcrumbs</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showSidebar}
                        onChange={() => setShowSidebar(!showSidebar)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-icon"><BarChartIcon /></span>
                      <div className="settings-toggle-text">
                        <span className="settings-toggle-label">Footer</span>
                        <span className="settings-toggle-desc">Overview and AI assistant</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showFooter}
                        onChange={() => setShowFooter(!showFooter)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-icon"><NavigationIcon /></span>
                      <div className="settings-toggle-text">
                        <span className="settings-toggle-label">Navigation Hint</span>
                        <span className="settings-toggle-desc">Scrollbar-free keyboard shortcuts</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showNavigationHint}
                        onChange={() => setShowNavigationHint(!showNavigationHint)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Zen Music Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">Zen Music</h4>
                <p className="settings-section-description">
                  Background music for focus and relaxation
                </p>
                
                <div className="settings-toggle-group">
                  <div className="settings-toggle-item">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-icon"><MusicIcon /></span>
                      <div className="settings-toggle-text">
                        <span className="settings-toggle-label">Play Music</span>
                        <span className="settings-toggle-desc">{musicPlaying ? 'Music is playing' : 'Music is paused'}</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={musicPlaying}
                        onChange={() => setMusicPlaying(!musicPlaying)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <MusicIcon />
                      <span>Music Track</span>
                    </label>
                    <select 
                      className="settings-form-select"
                      value={backgroundMusic} 
                      onChange={(e) => setBackgroundMusic(e.target.value)}
                    >
                      <option value="zen-mixed">Zen Mixed (Waves + Campfire + Rain + Crickets)</option>
                      <option value="zen-forest">Zen Forest</option>
                      <option value="zen-rain">Zen Rain</option>
                      <option value="zen-wind">Zen Wind</option>
                      <option value="zen-birds">Zen Birds</option>
                      <option value="zen-water">Zen Water</option>
                      <option value="meditation">Meditation</option>
                      <option value="flute">Flute</option>
                      <option value="nature">Nature</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="settings-panel-footer">
                <button 
                  className="settings-reset-btn"
                  onClick={() => {
                    setShowTopHeader(true)
                    setShowNavBar(true)
                    setShowSidebar(true)
                    setShowFooter(true)
                    setShowNavigationHint(true)
                  }}
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals and Overlays */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="task-modal glass-card">
            <div className="modal-header">
              <h2>{editingTask.title}</h2>
              <button className="close-btn" onClick={() => setEditingTask(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="task-details">
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  // For static deployment, update study plan directly
                  const updatedPlans = studyPlans.map(plan =>
                    plan.unique_id === editingTask.unique_id
                      ? {
                          ...plan,
                          topic: formData.get('title'),
                          notes: formData.get('description'),
                          progress_percentage: parseInt(formData.get('progress'))
                        }
                      : plan
                  )
                  setStudyPlans(updatedPlans)
                  localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
                  setEditingTask(null)
                  fetchPlans()
                }}>
                  <div className="form-group">
                    <label>Title</label>
                    <input name="title" defaultValue={editingTask.title} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" defaultValue={editingTask.description} rows="3" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Priority</label>
                      <select name="priority" defaultValue={editingTask.priority}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Important</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Progress (%)</label>
                      <input name="progress" type="number" min="0" max="100" defaultValue={editingTask.progress} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <DatePicker
                      selected={selectedDueDate}
                      onChange={setSelectedDueDate}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select due date"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button type="button" onClick={() => setEditingTask(null)} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              </div>

              <div className="task-sections">
                <div className="section">
                  <h4>Subtasks</h4>
                  <div className="subtasks-list">
                    {subtasks.map(subtask => (
                      <div key={subtask.subtask_id} className="subtask-item">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={async (e) => {
                            await fetch('/api/subtasks', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                subtask_id: subtask.subtask_id,
                                completed: e.target.checked
                              })
                            })
                            const res = await fetch(`/api/subtasks?task_id=${editingTask.task_id}`)
                            const data = await res.json()
                            setSubtasks(data)
                          }}
                        />
                        <span className={subtask.completed ? 'completed' : ''}>{subtask.title}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    await fetch('/api/subtasks', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        task_id: editingTask.task_id,
                        title: formData.get('subtask')
                      })
                    })
                    e.target.reset()
                    const res = await fetch(`/api/subtasks?task_id=${editingTask.task_id}`)
                    const data = await res.json()
                    setSubtasks(data)
                  }}>
                    <div className="add-item">
                      <input name="subtask" placeholder="Add a subtask..." required />
                      <button type="submit">+</button>
                    </div>
                  </form>
                </div>

                <div className="section">
                  <h4>Comments</h4>
                  <div className="comments-list">
                    {comments.map(comment => (
                      <div key={comment.comment_id} className="comment-item">
                        <p>{comment.content}</p>
                        <small>{new Date(comment.created_at).toLocaleString()}</small>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    await fetch('/api/comments', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        task_id: editingTask.task_id,
                        content: formData.get('comment')
                      })
                    })
                    e.target.reset()
                    const res = await fetch(`/api/comments?task_id=${editingTask.task_id}`)
                    const data = await res.json()
                    setComments(data)
                  }}>
                    <div className="add-item">
                      <textarea name="comment" placeholder="Add a comment..." required rows="2" />
                      <button type="submit">Comment</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editingChapter && (
        <div className="modal-overlay">
          <div className="chapter-modal glass-card">
            <div className="modal-header">
              <h2>Chapter: {editingChapter.chapter_name}</h2>
              <button className="close-btn" onClick={() => {
                setEditingChapter(null)
                setEditingTopicId(null)
              }}>×</button>
            </div>
            <div className="modal-body">
              {/* Chapter-Level Information */}
              <div className="chapter-info-section">
                <h3>Chapter Information</h3>
                <div className="chapter-fields-grid">
                  <div className="field-group">
                    <label>Chapter ID</label>
                    <input 
                      type="text" 
                      value={editingChapter.chapter_id} 
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Subject</label>
                    <input 
                      type="text" 
                      value={editingChapter.subject} 
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Curriculum</label>
                    <input 
                      type="text" 
                      value={editingChapter.curriculum} 
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Grade</label>
                    <input 
                      type="text" 
                      value={editingChapter.grade} 
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Total Topics</label>
                    <input 
                      type="text" 
                      value={editingChapter.totalTopics} 
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Completed</label>
                    <input 
                      type="text" 
                      value={editingChapter.completedTopics} 
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Status</label>
                    <input 
                      type="text" 
                      value={editingChapter.aggregatedStatus} 
                      readOnly
                      className="readonly-field"
                      style={{ color: getStatusColor(editingChapter.aggregatedStatus) }}
                    />
                  </div>
                  <div className="field-group">
                    <label>Stage</label>
                    <input 
                      type="text" 
                      value={editingChapter.aggregatedStage} 
                      readOnly
                      className="readonly-field"
                      style={{ color: '#8b5cf6' }}
                    />
                  </div>
                  <div className="field-group">
                    <label>Proficiency</label>
                    <input 
                      type="text" 
                      value={`${editingChapter.aggregatedProficiency}%`} 
                      readOnly
                      className="readonly-field"
                      style={{ color: getProficiencyColor(editingChapter.aggregatedProficiency) }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics Section - Editable */}
              <div className="topics-scrollable-container">
                <div className="topics-section">
                  <h3>Topics in this Chapter (Click to Edit)</h3>
                  <div className="topics-list">
                  {editingChapter.studyPlans.map(studyPlan => (
                    <div 
                      key={studyPlan.unique_id} 
                      className={`topic-item-editable ${editingTopicId === studyPlan.unique_id ? 'editing' : ''}`}
                      onClick={() => setEditingTopicId(studyPlan.unique_id)}
                    >
                      {editingTopicId === studyPlan.unique_id ? (
                        /* EDIT MODE - Full form */
                        <div className="topic-edit-form">
                          <div className="topic-edit-header">
                            <h4>Editing Topic</h4>
                            <div className="topic-edit-actions">
                              <button 
                                className="save-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingTopicId(null)
                                  // Save is automatic via state updates
                                }}
                              >
                                ✓ Save
                              </button>
                              <button 
                                className="cancel-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingTopicId(null)
                                }}
                              >
                                × Cancel
                              </button>
                            </div>
                          </div>

                          <div className="topic-edit-grid">
                            {/* Row 1: IDs */}
                            <div className="field-group">
                              <label>Unique ID</label>
                              <input 
                                type="text" 
                                value={studyPlan.unique_id}
                                readOnly
                                className="readonly-field-small"
                              />
                            </div>
                            <div className="field-group">
                              <label>Topic ID</label>
                              <input 
                                type="text" 
                                value={studyPlan.topic_id}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, topic_id: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  // Update main state
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, topic_id: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>
                            <div className="field-group">
                              <label>Chapter ID</label>
                              <input 
                                type="text" 
                                value={studyPlan.chapter_id}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, chapter_id: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, chapter_id: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>

                            {/* Row 2: Topic Name */}
                            <div className="field-group full-width">
                              <label>Topic Name</label>
                              <input 
                                type="text" 
                                value={studyPlan.topic}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, topic: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, topic: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field"
                              />
                            </div>

                            {/* Row 3: Chapter Name */}
                            <div className="field-group full-width">
                              <label>Chapter Name</label>
                              <input 
                                type="text" 
                                value={studyPlan.chapter_name}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, chapter_name: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, chapter_name: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field"
                              />
                            </div>

                            {/* Row 4: Subject, Curriculum, Grade */}
                            <div className="field-group">
                              <label>Subject</label>
                              <select 
                                value={studyPlan.subject}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, subject: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, subject: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              >
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Biology">Biology</option>
                              </select>
                            </div>
                            <div className="field-group">
                              <label>Curriculum</label>
                              <input 
                                type="text" 
                                value={studyPlan.curriculum}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, curriculum: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, curriculum: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>
                            <div className="field-group">
                              <label>Grade</label>
                              <input 
                                type="number" 
                                value={studyPlan.grade}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, grade: parseInt(e.target.value)} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, grade: parseInt(e.target.value)} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>

                            {/* Row 5: Status, Stage, Proficiency */}
                            <div className="field-group">
                              <label>Status</label>
                              <select 
                                value={studyPlan.learning_status}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, learning_status: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, learning_status: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              >
                                <option value="In Queue">In Queue</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                              </select>
                            </div>
                            <div className="field-group">
                              <label>Stage</label>
                              <select 
                                value={studyPlan.learning_stage}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, learning_stage: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, learning_stage: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              >
                                <option value="Initiated">Initiated</option>
                                <option value="Skimmed">Skimmed</option>
                                <option value="Grasped">Grasped</option>
                                <option value="Practiced">Practiced</option>
                                <option value="Revised">Revised</option>
                                <option value="Mastered">Mastered</option>
                              </select>
                            </div>
                            <div className="field-group">
                              <label>Proficiency %</label>
                              <input 
                                type="number" 
                                min="0"
                                max="100"
                                value={studyPlan.learning_proficiency}
                                onChange={(e) => {
                                  const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, learning_proficiency: value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, learning_proficiency: value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>

                            {/* Row 6: Progress Percentage */}
                            <div className="field-group">
                              <label>Progress %</label>
                              <input 
                                type="number" 
                                min="0"
                                max="100"
                                value={studyPlan.progress_percentage}
                                onChange={(e) => {
                                  const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, progress_percentage: value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, progress_percentage: value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>
                            <div className="field-group">
                              <label>Target Date</label>
                              <input 
                                type="date" 
                                value={studyPlan.target_date || ''}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, target_date: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, target_date: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>
                            <div className="field-group">
                              <label>Completion Date</label>
                              <input 
                                type="date" 
                                value={studyPlan.actual_completion_date || ''}
                                onChange={(e) => {
                                  const updated = editingChapter.studyPlans.map(p =>
                                    p.unique_id === studyPlan.unique_id ? {...p, actual_completion_date: e.target.value} : p
                                  )
                                  setEditingChapter({...editingChapter, studyPlans: updated})
                                  setStudyPlans(prev => {
                                    const newPlans = prev.map(p =>
                                      p.unique_id === studyPlan.unique_id ? {...p, actual_completion_date: e.target.value} : p
                                    )
                                    localStorage.setItem('study-plans-data', JSON.stringify(newPlans))
                                    return newPlans
                                  })
                                }}
                                className="editable-field-small"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* VIEW MODE - Compact display */
                        <div className="topic-view-mode">
                          <div className="topic-header">
                            <h4 className={studyPlan.learning_status === 'Done' ? 'done' : ''}>
                              {studyPlan.topic}
                            </h4>
                            <span className="topic-id">ID: {studyPlan.topic_id}</span>
                          </div>
                          <div className="topic-meta">
                            <span className="status-badge" style={{
                              backgroundColor: `${getStatusColor(studyPlan.learning_status)}20`,
                              color: getStatusColor(studyPlan.learning_status)
                            }}>
                              {studyPlan.learning_status}
                            </span>
                            <span className="stage-badge">
                              Stage: {studyPlan.learning_stage}
                            </span>
                            <span className="proficiency-badge">
                              Proficiency: {studyPlan.learning_proficiency}%
                            </span>
                          </div>
                          <div className="topic-progress">
                            <div className="progress-bar-small">
                              <div 
                                className="progress-fill-small"
                                style={{
                                  width: `${studyPlan.progress_percentage}%`,
                                  backgroundColor: studyPlan.progress_percentage === 100 ? '#10b981' : '#f59e0b'
                                }}
                              />
                            </div>
                            <span className="progress-text-small">{studyPlan.progress_percentage}%</span>
                          </div>
                          <div className="topic-hint">Click to edit all fields</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              </div>

              {/* Notes Section - Always Visible Below */}
              <div className="modal-bottom-sections">
                <h3>Chapter Notes</h3>
                <textarea
                  placeholder="Add notes for this chapter..."
                  rows="4"
                  className="notes-textarea"
                  value={editingChapter.notes || ''}
                  onChange={(e) => {
                    setEditingChapter({...editingChapter, notes: e.target.value})
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {addingTaskToBucket && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Task</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              // For static deployment, create new study plan directly
              const bucket = buckets.find(b => b.id === addingTaskToBucket)
              const newPlan = {
                unique_id: `TASK-${Date.now()}`,
                curriculum: selectedSubject?.name || 'JEE',
                grade: 12,
                subject: selectedSubject?.name || 'General',
                chapter_id: `CH-${Date.now()}`,
                chapter_name: 'New Chapter',
                topic_id: `T-${Date.now()}`,
                topic: formData.get('title'),
                target_date: null,
                learning_status: bucket.status,
                learning_stage: 'Initiated',
                learning_proficiency: 'Novice',
                progress_percentage: 0,
                notes: formData.get('description')
              }
              const updatedPlans = [...studyPlans, newPlan]
              setStudyPlans(updatedPlans)
              localStorage.setItem('study-plans-data', JSON.stringify(updatedPlans))
              setAddingTaskToBucket(null)
              fetchPlans()
            }}>
              <input name="title" placeholder="Task title" required />
              <textarea name="description" placeholder="Description" />
              <select name="priority">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Important</option>
              </select>
              <button type="submit">Add Task</button>
              <button type="button" onClick={() => setAddingTaskToBucket(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Weather Effect Overlay */}
      {weatherEffect && (
        <div className="weather-overlay">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
      {/* Background Music */}
      {backgroundMusic !== 'none' && (
        <audio
          key={backgroundMusic} // Force re-render when music changes
          ref={(audio) => {
            if (audio) {
              audio.volume = musicVolume
              if (musicPlaying) {
                audio.play().catch(e => {
                  console.log('Audio play failed:', e)
                  // Fallback: try to play on user interaction
                  const playOnInteraction = () => {
                    audio.play().catch(() => {})
                    document.removeEventListener('click', playOnInteraction)
                  }
                  document.addEventListener('click', playOnInteraction)
                })
              } else {
                audio.pause()
              }
            }
          }}
          loop
          autoPlay
          preload="auto"
        >
          <source
            src={
              backgroundMusic === 'zen-mixed'
                ? 'https://www.soundjay.com/misc/sounds/ambient-nature.wav'
                : backgroundMusic === 'zen-forest'
                ? 'https://www.soundjay.com/misc/sounds/forest-sounds.wav'
                : backgroundMusic === 'zen-rain'
                ? 'https://www.soundjay.com/misc/sounds/rain-03.wav'
                : backgroundMusic === 'zen-wind'
                ? 'https://www.soundjay.com/misc/sounds/wind.wav'
                : backgroundMusic === 'zen-birds'
                ? 'https://www.soundjay.com/misc/sounds/birds-01.wav'
                : backgroundMusic === 'zen-water'
                ? 'https://www.soundjay.com/misc/sounds/water-stream.wav'
                : backgroundMusic === 'meditation'
                ? 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                : backgroundMusic === 'flute'
                ? 'https://www.soundjay.com/misc/sounds/flute.wav'
                : backgroundMusic === 'nature'
                ? 'https://www.soundjay.com/misc/sounds/nature-sounds.wav'
                : 'https://www.soundjay.com/misc/sounds/nature-sounds.wav'
            }
            type="audio/wav"
          />
          <source
            src={
              backgroundMusic === 'zen-mixed'
                ? 'https://www.soundjay.com/misc/sounds/ambient-nature.mp3'
                : backgroundMusic === 'zen-forest'
                ? 'https://www.soundjay.com/misc/sounds/forest-sounds.mp3'
                : backgroundMusic === 'zen-rain'
                ? 'https://www.soundjay.com/misc/sounds/rain-03.mp3'
                : backgroundMusic === 'zen-wind'
                ? 'https://www.soundjay.com/misc/sounds/wind.mp3'
                : backgroundMusic === 'zen-birds'
                ? 'https://www.soundjay.com/misc/sounds/birds-01.mp3'
                : backgroundMusic === 'zen-water'
                ? 'https://www.soundjay.com/misc/sounds/water-stream.mp3'
                : backgroundMusic === 'meditation'
                ? 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
                : backgroundMusic === 'flute'
                ? 'https://www.soundjay.com/misc/sounds/flute.mp3'
                : backgroundMusic === 'nature'
                ? 'https://www.soundjay.com/misc/sounds/nature-sounds.mp3'
                : 'https://www.soundjay.com/misc/sounds/nature-sounds.mp3'
            }
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>
      )}
      {/* Study Plan Edit Modal */}
      {editingStudyPlan && (
        <div className="modal-overlay">
          <div className="study-plan-modal glass-card">
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>{editingStudyPlan.topic}</h2>
                <div className="study-plan-details-popup">
                  <div className="detail-item">
                    <span className="detail-label">Chapter:</span>
                    <span className="detail-value">{editingStudyPlan.chapter_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subject:</span>
                    <span className="detail-value">{editingStudyPlan.subject}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Grade:</span>
                    <span className="detail-value">{editingStudyPlan.grade}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Curriculum:</span>
                    <span className="detail-value">{editingStudyPlan.curriculum}</span>
                  </div>
                </div>
                <span
                  className="modal-status-badge"
                  style={{
                    backgroundColor: `${getStatusColor(editingStudyPlan.learning_status)}20`,
                    color: getStatusColor(editingStudyPlan.learning_status),
                    borderColor: getStatusColor(editingStudyPlan.learning_status)
                  }}
                >
                  {editingStudyPlan.learning_status}
                </span>
              </div>
              <button className="close-btn" onClick={() => setEditingStudyPlan(null)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target)

                // Update subtopic statuses in database
                for (const subTopic of subTopics) {
                  await fetch(`/api/subtopics/${subTopic.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      status: subTopic.completed ? 'Completed' : 'Not Started'
                    })
                  })
                }

                // Calculate progress based on completed sub-topics
                const completedCount = subTopics.filter(st => st.completed).length
                const totalCount = subTopics.length
                const calculatedProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

                await fetch(`/api/study-plan/${editingStudyPlan.unique_id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    progress_percentage: calculatedProgress,
                    notes: formData.get('notes')
                  })
                })
                setEditingStudyPlan(null)
                setSubTopics([])
                setNewSubTopic('')
                setVoiceRecordings([])
                fetchStudyPlans()
              }}>
                
                {/* Chapter Sub-Topics Tracking - Main Purpose */}
                <div className="form-group primary-section">
                  <label className="form-label-icon">� Chapter Sub-Topics</label>
                  <div className="progress-tracker">
                    <div className="progress-header">
                      <span className="progress-title">Overall Progress</span>
                      <span className="progress-percentage">
                        {subTopics.length > 0 ? Math.round((subTopics.filter(st => st.completed).length / subTopics.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{
                          width: `${subTopics.length > 0 ? Math.round((subTopics.filter(st => st.completed).length / subTopics.length) * 100) : 0}%`
                        }}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      {subTopics.filter(st => st.completed).length} of {subTopics.length} topics completed
                    </div>
                  </div>

                  <div className="subtopics-modern">
                    {subTopics.map((subTopic, index) => (
                      <div key={subTopic.id} className={`subtopic-item ${subTopic.completed ? 'completed' : 'pending'}`}>
                        <div className="subtopic-content">
                          <div className="subtopic-icon">
                            {subTopic.completed ? '✓' : '○'}
                          </div>
                          <span className="subtopic-text">{subTopic.text}</span>
                        </div>
                        <div className="subtopic-actions">
                          <button
                            type="button"
                            className={`status-btn ${subTopic.completed ? 'completed' : 'pending'}`}
                            onClick={() => {
                              const updatedSubTopics = [...subTopics]
                              updatedSubTopics[index].completed = !updatedSubTopics[index].completed
                              setSubTopics(updatedSubTopics)
                            }}
                          >
                            {subTopic.completed ? 'Mark Incomplete' : 'Mark Complete'}
                          </button>
                          <button
                            type="button"
                            className="remove-subtopic-btn"
                            onClick={() => {
                              setSubTopics(subTopics.filter((_, i) => i !== index))
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="add-subtopic-modern">
                      <input
                        type="text"
                        value={newSubTopic}
                        onChange={(e) => setNewSubTopic(e.target.value)}
                        placeholder="Add new learning topic..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (newSubTopic.trim()) {
                              setSubTopics([...subTopics, {
                                id: Date.now(),
                                text: newSubTopic.trim(),
                                completed: false
                              }])
                              setNewSubTopic('')
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="add-subtopic-btn-modern"
                        onClick={() => {
                          if (newSubTopic.trim()) {
                            setSubTopics([...subTopics, {
                              id: Date.now(),
                              text: newSubTopic.trim(),
                              completed: false
                            }])
                            setNewSubTopic('')
                          }
                        }}
                      >
                        + Add Topic
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="form-group">
                  <label className="form-label-icon">📝 Notes</label>
                  <textarea 
                    name="notes" 
                    defaultValue={editingStudyPlan.notes} 
                    rows="4" 
                    placeholder="Add your study notes, insights, or reminders here..." 
                  />
                </div>

                {/* Voice Logging Section */}
                <div className="form-group">
                  <label className="form-label-icon">�️ Voice Notes</label>
                  <div className="voice-logging">
                    <div className="voice-controls">
                      {!isRecording ? (
                        <button
                          type="button"
                          className="record-btn recording"
                          onClick={startRecording}
                        >
                          �️ Start Recording
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="record-btn stop"
                          onClick={stopRecording}
                        >
                          ⏹️ Stop Recording
                        </button>
                      )}
                    </div>
                    <div className="voice-recordings">
                      {voiceRecordings.length === 0 ? (
                        <p>No voice recordings yet</p>
                      ) : (
                        voiceRecordings.map(recording => (
                          <div key={recording.id} className="voice-recording-item">
                            <span>Recording {new Date(recording.timestamp).toLocaleTimeString()}</span>
                            <div className="recording-controls">
                              <button
                                type="button"
                                onClick={() => playRecording(recording.url)}
                              >
                                ▶️
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteRecording(recording.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Overall Status and Date Tracking */}
                <div className="form-group">
                  <label className="form-label-icon">[CHART] Overall Status & Date</label>
                  <div className="status-date-section">
                    <div className="status-info">
                      <span className="status-label">Current Status:</span>
                      <span className="status-value">{editingStudyPlan.learning_status}</span>
                    </div>
                    <div className="date-info">
                      <span className="date-label">Target Date:</span>
                      <span className="date-value">
                        {editingStudyPlan.target_date ? new Date(editingStudyPlan.target_date).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">💾 Save Progress</button>
                    <button type="button" onClick={() => {
                      setEditingStudyPlan(null)
                      setSubTopics([])
                      setNewSubTopic('')
                      setVoiceRecordings([])
                    }} className="cancel-btn">❌ Close</button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Background Settings Modal */}
      <BackgroundSettings 
        show={showBackgroundSettings} 
        onClose={() => setShowBackgroundSettings(false)} 
      />
    </div>
  )
}