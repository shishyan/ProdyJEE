import { useState, useEffect } from 'react'
import packageJson from '../package.json'
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
    await fetch(`/api/tasks/${task.task_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: newProgress })
    })
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
        totalTopics: 0,
        completedTopics: 0,
        inProgressTopics: 0,
        averageProgress: 0
      }
    }

    chapterGroups[chapterKey].studyPlans.push(plan)
    chapterGroups[chapterKey].totalTopics++
  })

  // Calculate aggregated status and progress for each chapter
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
  })

  return Object.values(chapterGroups)
}

// Chapter Card Component
function ChapterCard({ chapter, bucketColor, onEdit, onUpdateProgress, getStatusColor, getProficiencyColor }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({ id: `chapter-${chapter.chapter_id}` })

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
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
      className={`chapter-card ${isDragging ? 'dragging' : ''} ${chapter.aggregatedStatus === 'In Queue' ? 'backlog-card' : ''}`}
      onClick={(e) => onEdit(chapter, e)}
    >
      {/* ID and Subject above header */}
      <div className="chapter-meta-top">
        <span className="meta-id">{chapter.chapter_id}</span>
        <span className="meta-subject">{chapter.subject}</span>
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
              {earliestTargetDate && (
                <span className={`target-date-display ${daysLeft !== null && daysLeft < 0 ? 'overdue' : daysLeft !== null && daysLeft <= 7 ? 'urgent' : ''}`}>
                  {daysLeft !== null ? (
                    daysLeft < 0 ? `⏰ ${Math.abs(daysLeft)} days overdue` : `📅 ${daysLeft} days left`
                  ) : (
                    `📅 ${new Date(earliestTargetDate).toLocaleDateString()}`
                  )}
                </span>
              )}
            </div>
          ) : (
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
function Bucket({ bucket, chapters, onEditChapter, onUpdateProgress, getStatusColor, getProficiencyColor }) {
  const { setNodeRef, isOver } = useDroppable({
    id: bucket.id,
  })

  const filteredChapters = chapters.filter(chapter => chapter.aggregatedStatus === bucket.status)

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

  return (
    <div
      ref={setNodeRef}
      className={`bucket bg-gray-50 rounded-lg p-4 min-h-[500px] flex flex-col ${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${getStatusClass(bucket.status)}`}
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
      const response = await fetch('/api/study-plan')
      const data = await response.json()
      // Filter by subject if specified
      const filteredData = subject
        ? data.filter(plan => plan.subject.toLowerCase() === subject.name.toLowerCase())
        : data
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

      await fetch(`/api/study-plan/${editingCell.uniqueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      // Update local state
      setStudyPlans(prev => prev.map(plan =>
        plan.unique_id === editingCell.uniqueId
          ? { ...plan, [editingCell.columnKey]: processedValue }
          : plan
      ))

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

      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow)
      })

      if (response.ok) {
        const addedRow = await response.json()
        setStudyPlans(prev => [...prev, addedRow])
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Failed to add row:', error)
    }
  }

  const handleDeleteRow = async (uniqueId) => {
    if (!confirm('Are you sure you want to delete this row?')) return

    try {
      await fetch(`/api/study-plan/${uniqueId}`, {
        method: 'DELETE'
      })

      setStudyPlans(prev => prev.filter(plan => plan.unique_id !== uniqueId))
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to delete row:', error)
    }
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

      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow)
      })

      if (response.ok) {
        const addedRow = await response.json()
        setStudyPlans(prev => {
          const newPlans = [...prev]
          newPlans.splice(index, 0, addedRow)
          return newPlans
        })
        if (onUpdate) onUpdate()
      }
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
}export default function Home() {
  const [plans, setPlans] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingChapter, setEditingChapter] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [addingTaskToBucket, setAddingTaskToBucket] = useState(null)
  const [comments, setComments] = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterLabel, setFilterLabel] = useState('All')
  const [selectedDueDate, setSelectedDueDate] = useState(null)
  const [backgroundTheme, setBackgroundTheme] = useState('ocean')
  const [navbarBackground, setNavbarBackground] = useState('default')
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'study-plan'
  const [studyPlans, setStudyPlans] = useState([])
  const [weatherEffect, setWeatherEffect] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

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

  // Bucket configuration
  const buckets = [
    { id: 'backlog', name: 'Backlog', status: 'In Queue' },
    { id: 'todo', name: 'To Do', status: 'To Do' },
    { id: 'inprogress', name: 'In Progress', status: 'In Progress' },
    { id: 'done', name: 'Done', status: 'Done' }
  ]

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

  const fetchData = async () => {
    try {
      const studyPlansRes = await fetch('/api/study-plan')
      const studyPlansData = await studyPlansRes.json()

      // Check if we have data, if not, use demo data
      const finalStudyPlansData = studyPlansData && studyPlansData.length > 0 ? studyPlansData : [
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
    } catch (error) {
      console.error('Failed to fetch data:', error)
      // Fallback to demo data for static deployment
      const demoStudyPlans = [
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
        }
      ]

      const demoSubjects = [
        { subject_id: 1, name: "Physics", Chapters: [] },
        { subject_id: 2, name: "Chemistry", Chapters: [] }
      ]

      setPlans([])
      setSubjects(demoSubjects)
      setStudyPlans(demoStudyPlans)
      setSelectedSubject(demoSubjects[0])
      setLoading(false)
    }
  }

  const deleteAllCards = async () => {
    if (!confirm('Are you sure you want to delete ALL study plan cards? This action cannot be undone.')) {
      return
    }

    try {
      // Get all study plans
      const response = await fetch('/api/study-plan')
      const allStudyPlans = await response.json()

      // Delete each study plan
      const deletePromises = allStudyPlans.map(plan =>
        fetch(`/api/study-plan/${plan.unique_id}`, {
          method: 'DELETE'
        })
      )

      await Promise.all(deletePromises)

      // Clear local state
      setStudyPlans([])
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
          // Update all study plans in this chapter to the new status
          const chapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))
          const draggedChapter = chapters.find(ch => ch.chapter_id === chapterId)

          if (draggedChapter) {
            const updatePromises = draggedChapter.studyPlans.map(plan =>
              fetch(`/api/study-plan/${plan.unique_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ learning_status: targetBucket.status })
              })
            )

            await Promise.all(updatePromises)
            fetchData() // Refresh data
          }
        } catch (error) {
          console.error('Failed to update chapter:', error)
        }
      }
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
    // Load subtopics for this chapter
    try {
      const response = await fetch(`/api/subtopics?chapter_id=${studyPlan.chapter_id}`)
      const chapterSubtopics = await response.json()
      // Convert database subtopics to the format expected by the modal
      const formattedSubtopics = Array.isArray(chapterSubtopics) ? chapterSubtopics.map(subtopic => ({
        id: subtopic.subtopic_id,
        text: subtopic.name,
        completed: subtopic.status === 'Completed'
      })) : []
      setSubTopics(formattedSubtopics)
    } catch (error) {
      console.error('Error fetching chapter subtopics:', error)
      setSubTopics([])
    }
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
    const [commentsRes, subtasksRes] = await Promise.all([
      fetch(`/api/comments?task_id=${task.task_id}`),
      fetch(`/api/subtasks?task_id=${task.task_id}`)
    ])
    const commentsData = await commentsRes.json()
    const subtasksData = await subtasksRes.json()
    setComments(commentsData)
    setSubtasks(subtasksData)
  }

  const onAddTask = (bucketId) => {
    setAddingTaskToBucket(bucketId)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="planner">
      {/* Professional Top Header */}
      <nav className={`top-navbar navbar-${navbarBackground || 'default'}`}>
        <div className="navbar-content">
          {/* Left Side - App Logo, Title, Subtitle */}
          <div className="navbar-brand">
            <div className="brand-logo">
              <span className="brand-main">Prody</span>
              <span className="brand-jee">JEE</span>
              <span className="brand-accent">™</span>
            </div>
            <div className="brand-subtitle">
              <span>Peepal Prodigy School</span>
              <span className="version-tag">v{packageJson.version}</span>
            </div>
          </div>

          {/* Center - Dynamic Title */}
          {selectedSubject && viewMode === 'kanban' && (
            <div className="navbar-center">
              <h3 className="navbar-title">
                Kanban Board - {selectedSubject.name} ({groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name)).length} chapters)
              </h3>
            </div>
          )}
          <div className="navbar-actions">
            <button
              className="nav-action-btn"
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              <CogIcon />
            </button>
            <button
              className="nav-action-btn"
              onClick={() => {/* Theme toggle logic */}}
              title="Themes"
            >
              <PaletteIcon />
            </button>
            <a
              href="/login"
              className="nav-action-btn user-profile"
              title="User Profile"
            >
              <UserIcon />
            </a>
          </div>
        </div>
      </nav>

      {/* Horizontal Navigation Bar - Breadcrumb + Filters */}
      <div className="horizontal-navbar">
        <div className="nav-content">
          {/* Breadcrumb Section */}
          <div className="breadcrumb-section">
            <div className="breadcrumb-path">
              <span className="breadcrumb-item">Home</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Study Plans</span>
              {selectedSubject && (
                <>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item active">{selectedSubject.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Filter Tabs Section */}
          <div className="filter-tabs-section">
            {/* Subjects Filter Tabs */}
            <div className="filter-group">
              <div className="filter-tabs">
                {subjects.slice(0, 4).map(subject => (
                  <button
                    key={subject.subject_id}
                    className={`filter-tab ${selectedSubject?.subject_id === subject.subject_id ? 'active' : ''}`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <BookOpenIcon />
                    <span>{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="filter-group">
              <div className="view-toggle-tabs">
                <button
                  className={`view-tab ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                  title="Kanban View"
                >
                  <BookOpenIcon />
                  <span>Kanban</span>
                </button>
                <button
                  className={`view-tab ${viewMode === 'study-plan' ? 'active' : ''}`}
                  onClick={() => setViewMode('study-plan')}
                  title="Study Plan View"
                >
                  <GridIcon />
                  <span>Study Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-item" title="Dashboard">
            <HomeIcon />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </div>
          <div className="sidebar-item" title="Charts">
            <BarChartIcon />
            {!sidebarCollapsed && <span>Charts</span>}
          </div>
          <div className="sidebar-item" title="Schedule">
            <CalendarIcon />
            {!sidebarCollapsed && <span>Schedule</span>}
          </div>
          <div className="sidebar-item" title="Timer">
            <TimerIcon />
            {!sidebarCollapsed && <span>Timer</span>}
          </div>
          <div className="sidebar-item" title="Relax">
            <MeditationIcon />
            {!sidebarCollapsed && <span>Relax</span>}
          </div>
        </div>
        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="sidebar-attribution">
              by Sasha Nagarajan, 11th Grade, Peepal Prodigy School, Madukkarai, Coimbatore
            </div>
          )}
        </div>
      </div>

      <main className="board">
        {selectedSubject && viewMode === 'kanban' && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleChapterDragEnd}
          >
            <div className="kanban-board">
              <div className="buckets-container">
                {buckets.map(bucket => (
                  <Bucket
                    key={bucket.id}
                    bucket={bucket}
                    chapters={groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject.name))}
                    onEditChapter={onEditChapter}
                    onUpdateProgress={fetchData}
                    getStatusColor={getStatusColor}
                    getProficiencyColor={getProficiencyColor}
                  />
                ))}
              </div>
            </div>
          </DndContext>
        )}

        {selectedSubject && viewMode === 'study-plan' && (
          <StudyPlanGrid 
            subject={selectedSubject} 
            onUpdate={fetchData}
            getStatusColor={getStatusColor}
            getProficiencyColor={getProficiencyColor}
          />
        )}
      </main>
      <>
        {editingTask && (
        <div className="modal-overlay">
          <div className="task-modal">
            <div className="modal-header">
              <h2>{editingTask.title}</h2>
              <button className="close-btn" onClick={() => setEditingTask(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="task-details">
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  await fetch(`/api/tasks/${editingTask.task_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: formData.get('title'),
                      description: formData.get('description'),
                      priority: formData.get('priority'),
                      progress: parseInt(formData.get('progress')),
                      due_date: selectedDueDate
                    })
                  })
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
              <button className="close-btn" onClick={() => setEditingChapter(null)}>×</button>
            </div>
            <div className="modal-body">
              {/* Topics Section - Scrollable */}
              <div className="topics-scrollable-container">
                <div className="topics-section">
                  <h3>Topics in this Chapter</h3>
                  <div className="topics-list">
                  {editingChapter.studyPlans.map(studyPlan => (
                    <div key={studyPlan.unique_id} className="topic-item-detailed">
                      <div className="topic-header">
                        <div className="topic-info">
                          <div className="topic-completion">
                            <div className="progress-stages">
                              <label className="stage-option">
                                <input
                                  type="radio"
                                  name={`progress-${studyPlan.unique_id}`}
                                  value="Started"
                                  checked={studyPlan.learning_status === 'Started' || studyPlan.learning_status === 'Studied' || studyPlan.learning_status === 'Done'}
                                  onChange={async (e) => {
                                    const newStatus = 'Started'
                                    const newProgress = 33

                                    try {
                                      await fetch('/api/study-plan', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          unique_id: studyPlan.unique_id,
                                          learning_status: newStatus,
                                          progress_percentage: newProgress
                                        })
                                      })

                                      // Refresh the data
                                      await fetchData()
                                      
                                      // Update editingChapter with refreshed data
                                      const updatedChapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject?.name))
                                      const updatedChapter = updatedChapters.find(ch => ch.chapter_id === editingChapter.chapter_id)
                                      if (updatedChapter) {
                                        setEditingChapter(updatedChapter)
                                      }
                                    } catch (error) {
                                      console.error('Failed to update topic status:', error)
                                    }
                                  }}
                                />
                                <span className="stage-label">Started</span>
                              </label>
                              <label className="stage-option">
                                <input
                                  type="radio"
                                  name={`progress-${studyPlan.unique_id}`}
                                  value="Studied"
                                  checked={studyPlan.learning_status === 'Studied' || studyPlan.learning_status === 'Done'}
                                  onChange={async (e) => {
                                    const newStatus = 'Studied'
                                    const newProgress = 66

                                    try {
                                      await fetch('/api/study-plan', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          unique_id: studyPlan.unique_id,
                                          learning_status: newStatus,
                                          progress_percentage: newProgress
                                        })
                                      })

                                      // Refresh the data
                                      await fetchData()
                                      
                                      // Update editingChapter with refreshed data
                                      const updatedChapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject?.name))
                                      const updatedChapter = updatedChapters.find(ch => ch.chapter_id === editingChapter.chapter_id)
                                      if (updatedChapter) {
                                        setEditingChapter(updatedChapter)
                                      }
                                    } catch (error) {
                                      console.error('Failed to update topic status:', error)
                                    }
                                  }}
                                />
                                <span className="stage-label">Studied</span>
                              </label>
                              <label className="stage-option">
                                <input
                                  type="radio"
                                  name={`progress-${studyPlan.unique_id}`}
                                  value="Practiced"
                                  checked={studyPlan.learning_status === 'Done'}
                                  onChange={async (e) => {
                                    const newStatus = 'Done'
                                    const newProgress = 100

                                    try {
                                      await fetch('/api/study-plan', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          unique_id: studyPlan.unique_id,
                                          learning_status: newStatus,
                                          progress_percentage: newProgress
                                        })
                                      })

                                      // Refresh the data
                                      await fetchData()
                                      
                                      // Update editingChapter with refreshed data
                                      const updatedChapters = groupStudyPlansByChapter(studyPlans.filter(plan => plan.subject === selectedSubject?.name))
                                      const updatedChapter = updatedChapters.find(ch => ch.chapter_id === editingChapter.chapter_id)
                                      if (updatedChapter) {
                                        setEditingChapter(updatedChapter)
                                      }
                                    } catch (error) {
                                      console.error('Failed to update topic status:', error)
                                    }
                                  }}
                                />
                                <span className="stage-label">Practiced</span>
                              </label>
                            </div>
                            <h4 className={`topic-title ${studyPlan.learning_status === 'Done' ? 'completed' : ''}`}>
                              {studyPlan.topic}
                            </h4>
                          </div>
                          <div className="topic-meta">
                            <span className="topic-id">ID: {studyPlan.topic_id}</span>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: `${getStatusColor(studyPlan.learning_status)}30`,
                                color: getStatusColor(studyPlan.learning_status),
                                border: `1px solid ${getStatusColor(studyPlan.learning_status)}`
                              }}
                            >
                              {studyPlan.learning_status}
                            </span>
                          </div>
                        </div>
                        <div className="topic-progress">
                          <span className="progress-value">{studyPlan.progress_percentage}%</span>
                          <div className="mini-progress-bar">
                            <div
                              className="mini-progress-fill"
                              style={{
                                width: `${studyPlan.progress_percentage}%`,
                                backgroundColor: studyPlan.progress_percentage === 100 ? '#10b981' : studyPlan.progress_percentage > 0 ? '#f59e0b' : '#6b7280'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>

              {/* Notes and Voice Sections - Always Visible Below */}
              <div className="modal-bottom-sections">
                <h3>Notes</h3>
                <textarea
                  placeholder="Add notes for this chapter..."
                  rows="6"
                  className="notes-textarea"
                  value={editingChapter.notes || ''}
                  onChange={(e) => {
                    // Update notes
                    setEditingChapter({...editingChapter, notes: e.target.value})
                  }}
                />
              </div>

              <div className="voice-section">
                <h3>Voice Recording</h3>
                <div className="voice-controls">
                  <button className="voice-btn" title="Start Recording">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="4" fill="currentColor"/>
                    </svg>
                  </button>
                  <button className="voice-btn" title="Stop Recording">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button className="voice-btn" title="Play Recording">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="8,5 19,12 8,19" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
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
              await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bucket_id: addingTaskToBucket,
                  title: formData.get('title'),
                  description: formData.get('description'),
                  priority: formData.get('priority'),
                  progress: 0
                })
              })
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
      </>
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
                  <label className="form-label-icon">📊 Overall Status & Date</label>
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

      {showSettings && (
        <div className="modal-overlay">
          <div className="settings-modal glass-card">
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <h3>Background Theme</h3>
                <div className="setting-item">
                  <PaletteIcon />
                  <select value={backgroundTheme} onChange={(e) => setBackgroundTheme(e.target.value)}>
                    <option value="forest-mountain">Forest Mountain</option>
                    <option value="green-forest">Green Forest</option>
                    <option value="bamboo">Bamboo Grove</option>
                    <option value="jungle">Tropical Jungle</option>
                    <option value="meadow">Spring Meadow</option>
                    <option value="gradient">Ocean Gradient</option>
                    <option value="nature">Wild Nature</option>
                    <option value="flowers">Flower Garden</option>
                    <option value="animals">Safari Animals</option>
                    <option value="mountains">Snow Mountains</option>
                    <option value="ocean">Deep Ocean</option>
                    <option value="desert">Golden Desert</option>
                    <option value="sunset">Tropical Sunset</option>
                    <option value="aurora">Northern Aurora</option>
                    <option value="galaxy">Starry Galaxy</option>
                    <option value="sakura">Cherry Blossom</option>
                    <option value="autumn">Autumn Leaves</option>
                    <option value="winter">Winter Wonderland</option>
                    <option value="rainbow">Rainbow Sky</option>
                    <option value="zen-garden">Zen Garden</option>
                    <option value="crystal">Crystal Cave</option>
                    <option value="lava">Volcanic Lava</option>
                    <option value="ice">Arctic Ice</option>
                    <option value="cosmic">Cosmic Nebula</option>
                    <option value="ethereal">Ethereal Mist</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Navigation Bar Background</h3>
                <div className="setting-item">
                  <PaletteIcon />
                  <select value={navbarBackground || 'default'} onChange={(e) => setNavbarBackground(e.target.value)}>
                    <option value="default">Default (Semi-transparent)</option>
                    <option value="glass">Glass Effect</option>
                    <option value="solid">Solid White</option>
                    <option value="gradient">Gradient</option>
                    <option value="blur">Heavy Blur</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Weather Effects</h3>
                <div className="setting-item">
                  <CloudIcon />
                  <button
                    className={`nav-btn ${weatherEffect ? 'active' : ''}`}
                    onClick={() => setWeatherEffect(!weatherEffect)}
                  >
                    {weatherEffect ? 'Disable' : 'Enable'} Weather Effects
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>Background Music</h3>
                <div className="setting-item">
                  <MusicIcon />
                  <select value={backgroundMusic} onChange={(e) => setBackgroundMusic(e.target.value)}>
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
                <div className="setting-item">
                  <button
                    className={`nav-btn ${musicPlaying ? 'active' : ''}`}
                    onClick={() => setMusicPlaying(!musicPlaying)}
                  >
                    {musicPlaying ? 'Pause' : 'Play'} Music
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>Filters</h3>
                <div className="setting-item">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="setting-item">
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Important">Important</option>
                  </select>
                </div>
                <div className="setting-item">
                  <select value={filterLabel} onChange={(e) => setFilterLabel(e.target.value)}>
                    <option value="All">All Labels</option>
                    <option value="Math">Math</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="High Priority">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Data Management</h3>
                <div className="setting-item">
                  <button
                    className="nav-btn delete-all-btn"
                    onClick={deleteAllCards}
                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                    title="Delete all study plan cards from the Kanban board"
                  >
                    🗑️ Delete All Cards
                  </button>
                  <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                    Permanently delete all study plan cards
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Assistant - Bottom Right Corner */}
      <div className="voice-assistant-container">
        <button
          className="voice-assistant-btn"
          onClick={() => {/* Voice assistant logic */}}
          title="Voice Assistant"
        >
          <div className="voice-assistant-icon">🎙️</div>
          <div className="voice-assistant-pulse"></div>
        </button>
      </div>
    </div>
  )
}