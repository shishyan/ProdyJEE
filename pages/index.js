import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
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

const MusicIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
)

function ChapterCard({ chapter, onEdit, onUpdateProgress }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `chapter-${chapter.chapter_id}` })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const completedSubtopics = chapter.SubTopics.filter(st => st.status === 'Completed').length
  const totalSubtopics = chapter.SubTopics.length
  const progressPercentage = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0

  const highPriorityCount = chapter.SubTopics.filter(st => st.is_high_priority).length
  const inProgressCount = chapter.SubTopics.filter(st => st.status === 'In Progress').length

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="chapter-card glass-card"
      onClick={() => onEdit(chapter)}
    >
      <div className="chapter-header">
        <div className="chapter-info">
          <h4 className="chapter-title">{chapter.name}</h4>
          <div className="chapter-meta">
            <span className="subtopic-count">{totalSubtopics} topics</span>
            {highPriorityCount > 0 && (
              <span className="priority-count">
                <StarIcon />
                {highPriorityCount} priority
              </span>
            )}
            {inProgressCount > 0 && (
              <span className="inprogress-count">
                <ClockIcon />
                {inProgressCount} in progress
              </span>
            )}
          </div>
        </div>
        <div className="chapter-progress">
          <div className="progress-circle">
            <svg width="40" height="40">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercentage / 100)}`}
                transform="rotate(-90 20 20)"
              />
            </svg>
            <div className="progress-text">{Math.round(progressPercentage)}%</div>
          </div>
        </div>
      </div>

      <div className="chapter-checklist">
        {chapter.SubTopics.slice(0, 3).map(subtopic => (
          <div key={subtopic.subtopic_id} className="checklist-item">
            <input
              type="checkbox"
              checked={subtopic.status === 'Completed'}
              onChange={(e) => {
                e.stopPropagation()
                // Handle subtopic status update
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className={subtopic.status === 'Completed' ? 'completed' : ''}>
              {subtopic.name}
            </span>
            {subtopic.is_high_priority && <StarIcon />}
          </div>
        ))}
        {chapter.SubTopics.length > 3 && (
          <div className="more-items">
            +{chapter.SubTopics.length - 3} more topics
          </div>
        )}
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}



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

function StudyPlanCard({ studyPlan, onEdit, onUpdateProgress }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `studyplan-${studyPlan.unique_id}` })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="study-plan-card glass-card"
      onClick={(e) => {
        // Only trigger edit if not dragging
        if (!e.defaultPrevented) {
          onEdit(studyPlan)
        }
      }}
    >
      <div className="study-plan-header">
        <div className="study-plan-info">
          <h4 className="study-plan-title">{studyPlan.topic}</h4>
          <div className="study-plan-meta">
            <span className="chapter-name">{studyPlan.chapter_name}</span>
            <span className="subject-name">{studyPlan.subject}</span>
          </div>
        </div>
        <div className="study-plan-status">
          <span
            className="status-badge"
            style={{
              backgroundColor: `${getStatusColor(studyPlan.learning_status)}20`,
              color: getStatusColor(studyPlan.learning_status),
              borderColor: getStatusColor(studyPlan.learning_status)
            }}
          >
            {studyPlan.learning_status}
          </span>
        </div>
      </div>

      <div className="study-plan-details">
        <div className="detail-row">
          <span className="detail-label">Stage:</span>
          <span className="detail-value">{studyPlan.learning_stage}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Proficiency:</span>
          <span
            className="proficiency-badge"
            style={{
              backgroundColor: `${getProficiencyColor(studyPlan.learning_proficiency)}20`,
              color: getProficiencyColor(studyPlan.learning_proficiency)
            }}
          >
            {studyPlan.learning_proficiency}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Progress:</span>
          <span className="detail-value">{studyPlan.progress_percentage}%</span>
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

function Bucket({ bucket, studyPlans, onEditStudyPlan, onUpdateProgress, searchTerm, isBacklog }) {
  const { setNodeRef } = useDroppable({ id: bucket.bucket_id })

  const filteredStudyPlans = studyPlans ? studyPlans.filter(plan => {
    const matchesSearch = plan.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plan.chapter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plan.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !bucket.status || plan.learning_status === bucket.status
    return matchesSearch && matchesStatus
  }) : []

  return (
    <div ref={setNodeRef} className={`bucket ${isBacklog ? 'backlog-bucket' : ''}`}>
      <h3>{bucket.name} ({filteredStudyPlans.length})</h3>
      <SortableContext items={filteredStudyPlans.map(sp => `studyplan-${sp.unique_id}`)} strategy={verticalListSortingStrategy}>
        {filteredStudyPlans.map(studyPlan => (
          <StudyPlanCard
            key={studyPlan.unique_id}
            studyPlan={studyPlan}
            onEdit={onEditStudyPlan}
            onUpdateProgress={onUpdateProgress}
          />
        ))}
      </SortableContext>
    </div>
  )
}

function StudyPlanGrid({ subject, onUpdate }) {
  const [studyPlans, setStudyPlans] = useState([])
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [loading, setLoading] = useState(true)

  const columns = [
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

  if (loading) {
    return (
      <div className="study-plan-container">
        <div className="loading">Loading study plan data...</div>
      </div>
    )
  }

  return (
    <div className="study-plan-container">
      <div className="study-plan-header">
        <div className="header-info">
          <h1>{subject ? `${subject.name} Study Plan` : 'Complete Study Plan'}</h1>
          <p>Master curriculum management with comprehensive tracking</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Total Topics:</span>
            <span className="stat-value">{studyPlans.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">
              {studyPlans.filter(p => p.learning_status === 'Done').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">In Progress:</span>
            <span className="stat-value">
              {studyPlans.filter(p => p.learning_status === 'In Progress').length}
            </span>
          </div>
        </div>
      </div>

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
                        className="proficiency-badge"
                        style={{ backgroundColor: `${getProficiencyColor(plan.learning_proficiency)}20`, color: getProficiencyColor(plan.learning_proficiency) }}
                        onClick={() => handleCellEdit(plan.unique_id, 'learning_proficiency', plan.learning_proficiency)}
                      >
                        {plan.learning_proficiency}
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
  const [backgroundTheme, setBackgroundTheme] = useState('forest-mountain')
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'study-plan'
  const [studyPlans, setStudyPlans] = useState([])
  const [weatherEffect, setWeatherEffect] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState('zen-forest')
  const [musicVolume, setMusicVolume] = useState(0.2)
  const [musicPlaying, setMusicPlaying] = useState(true) // Auto-play zen rhythms
  const [zenRhythmsEnabled, setZenRhythmsEnabled] = useState(true)
  const [editingStudyPlan, setEditingStudyPlan] = useState(null)
  const [subTopics, setSubTopics] = useState([])
  const [newSubTopic, setNewSubTopic] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
        const zenTracks = ['zen-forest', 'zen-rain', 'zen-wind', 'zen-birds', 'zen-water']
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

      // Extract unique subjects from study plans
      const uniqueSubjects = [...new Set(studyPlansData.map(plan => plan.subject))]
      const subjectsData = uniqueSubjects.map((subject, index) => ({
        subject_id: index + 1,
        name: subject,
        Chapters: [] // Empty chapters array since we're not using the old structure
      }))

      setPlans([]) // Clear plans since we're not using them
      setSubjects(subjectsData)
      setStudyPlans(studyPlansData)
      if (subjectsData.length > 0) setSelectedSubject(subjectsData[0])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Check if dragging a study plan
    if (activeId.startsWith('studyplan-')) {
      const studyPlanId = activeId.replace('studyplan-', '')
      const targetBucket = [
        { bucket_id: 'backlog', name: 'Backlog', status: 'In Queue' },
        { bucket_id: 'todo', name: 'To Do', status: 'To Do' },
        { bucket_id: 'inprogress', name: 'In Progress', status: 'In Progress' },
        { bucket_id: 'done', name: 'Done', status: 'Done' }
      ].find(b => b.bucket_id === overId)

      if (targetBucket) {
        // Update study plan status based on bucket
        await fetch(`/api/study-plan/${studyPlanId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ learning_status: targetBucket.status })
        })
        fetchData()
        return
      }
    }

    // All other drag operations are disabled since we only use StudyPlan data now
  }

  const onEditChapter = async (chapter) => {
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

  const onEditStudyPlan = async (studyPlan) => {
    setEditingStudyPlan(studyPlan)
    // Load existing sub-topics or create default ones
    if (studyPlan.sub_topics) {
      try {
        const parsedSubTopics = JSON.parse(studyPlan.sub_topics)
        setSubTopics(parsedSubTopics)
      } catch (error) {
        console.error('Error parsing sub_topics:', error)
        setSubTopics([])
      }
    } else {
      const defaultSubTopics = [
        { id: 1, text: 'Read theory and concepts', completed: false },
        { id: 2, text: 'Solve basic problems', completed: false },
        { id: 3, text: 'Practice advanced problems', completed: false },
        { id: 4, text: 'Review and revise', completed: false }
      ]
      setSubTopics(defaultSubTopics)
    }
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
      {/* Professional Top Navigation Bar */}
      <nav className="top-navbar">
        <div className="navbar-brand">
          <h1>ProdyJEE</h1>
          <span className="brand-subtitle">JEE Preparation Tracker</span>
        </div>
        
        <div className="navbar-controls">
          {/* Subjects Selector */}
          <div className="nav-group">
            <div className="subjects-selector">
              <BookOpenIcon />
              <select 
                value={selectedSubject?.subject_id || ''} 
                onChange={(e) => {
                  const subjectId = parseInt(e.target.value)
                  const subject = subjects.find(s => s.subject_id === subjectId)
                  setSelectedSubject(subject)
                }}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="nav-group">
            <div className="view-toggle">
              <button 
                className={`nav-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                onClick={() => setViewMode('kanban')}
                title="Kanban View"
              >
                <BookOpenIcon />
                <span>Kanban</span>
              </button>
              <button 
                className={`nav-btn ${viewMode === 'study-plan' ? 'active' : ''}`}
                onClick={() => setViewMode('study-plan')}
                title="Study Plan View"
              >
                <GridIcon />
                <span>Study Plan</span>
              </button>
            </div>
          </div>

          {/* Background Selector */}
          <div className="nav-group">
            <div className="background-selector">
              <PaletteIcon />
              <select value={backgroundTheme} onChange={(e) => setBackgroundTheme(e.target.value)}>
                <option value="forest-mountain">Forest Mountain</option>
                <option value="green-forest">Green Forest</option>
                <option value="bamboo">Bamboo</option>
                <option value="jungle">Jungle</option>
                <option value="meadow">Meadow</option>
                <option value="gradient">Gradient</option>
                <option value="nature">Nature</option>
                <option value="flowers">Flowers</option>
                <option value="animals">Animals</option>
                <option value="mountains">Mountains</option>
                <option value="ocean">Ocean</option>
              </select>
            </div>
          </div>

          {/* Weather Control */}
          <div className="nav-group">
            <div className="weather-control">
              <CloudIcon />
              <button
                className={`nav-btn ${weatherEffect ? 'active' : ''}`}
                onClick={() => setWeatherEffect(!weatherEffect)}
                title="Toggle Weather Effect"
              >
                🌧️
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="nav-group">
            <div className="filters">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Important">Important</option>
              </select>
              <select value={filterLabel} onChange={(e) => setFilterLabel(e.target.value)}>
                <option value="All">All Labels</option>
                <option value="Math">Math</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="High Priority">High Priority</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <main className="board">
        {selectedSubject && viewMode === 'kanban' && (
          <>
            <div className="subject-header">
              <h1>{selectedSubject.name} Kanban Board</h1>
              <p>Drag study plan topics to organize your learning progress</p>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <div className="buckets">
                {/* Backlog bucket with study plan topics */}
                <Bucket
                  bucket={{ bucket_id: 'backlog', name: 'Backlog' }}
                  studyPlans={studyPlans.filter(plan => plan.subject === selectedSubject.name && plan.learning_status === 'In Queue')}
                  searchTerm={searchTerm}
                  isBacklog={true}
                  onEditStudyPlan={onEditStudyPlan}
                  onUpdateProgress={fetchData}
                />
                {/* Regular task buckets mapped from study plan statuses */}
                {[
                  { bucket_id: 'todo', name: 'To Do', status: 'To Do' },
                  { bucket_id: 'inprogress', name: 'In Progress', status: 'In Progress' },
                  { bucket_id: 'done', name: 'Done', status: 'Done' }
                ].map(bucket => (
                  <Bucket
                    key={bucket.bucket_id}
                    bucket={bucket}
                    studyPlans={studyPlans.filter(plan => plan.subject === selectedSubject.name && plan.learning_status === bucket.status)}
                    onEditStudyPlan={onEditStudyPlan}
                    searchTerm={searchTerm}
                    onUpdateProgress={fetchData}
                    isBacklog={false}
                  />
                ))}
              </div>
            </DndContext>
          </>
        )}

        {selectedSubject && viewMode === 'study-plan' && (
          <StudyPlanGrid 
            subject={selectedSubject} 
            onUpdate={fetchData}
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
              <h2>Edit Chapter: {editingChapter.name}</h2>
              <button className="close-btn" onClick={() => setEditingChapter(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="chapter-details">
                <div className="chapter-info-section">
                  <h3>Chapter Information</h3>
                  <div className="info-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Topics:</span>
                      <span className="stat-value">{editingChapter.SubTopics.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Completed:</span>
                      <span className="stat-value">{editingChapter.SubTopics.filter(st => st.status === 'Completed').length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Progress:</span>
                      <span className="stat-value">
                        {editingChapter.SubTopics.length > 0
                          ? Math.round((editingChapter.SubTopics.filter(st => st.status === 'Completed').length / editingChapter.SubTopics.length) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="subtopics-section">
                  <h3>Subtopics & Due Dates</h3>
                  <div className="subtopics-list">
                    {editingChapter.SubTopics.map(subtopic => (
                      <div key={subtopic.subtopic_id} className="subtopic-item">
                        <div className="subtopic-header">
                          <div className="subtopic-checkbox">
                            <input
                              type="checkbox"
                              checked={subtopic.status === 'Completed'}
                              onChange={async (e) => {
                                const newStatus = e.target.checked ? 'Completed' : 'Not Started'
                                await fetch(`/api/subtopics/${subtopic.subtopic_id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: newStatus })
                                })
                                fetchData()
                              }}
                            />
                            <span className={`subtopic-name ${subtopic.status === 'Completed' ? 'completed' : ''}`}>
                              {subtopic.name}
                            </span>
                          </div>
                          <div className="subtopic-priority">
                            <input
                              type="checkbox"
                              checked={subtopic.is_high_priority}
                              onChange={async (e) => {
                                await fetch(`/api/subtopics/${subtopic.subtopic_id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ is_high_priority: e.target.checked })
                                })
                                fetchData()
                              }}
                              title="High Priority"
                            />
                            <StarIcon />
                          </div>
                        </div>
                        <div className="subtopic-due-date">
                          <label>Due Date:</label>
                          <DatePicker
                            selected={subtopic.due_date ? new Date(subtopic.due_date) : null}
                            onChange={async (date) => {
                              await fetch(`/api/subtopics/${subtopic.subtopic_id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ due_date: date ? date.toISOString().split('T')[0] : null })
                              })
                              fetchData()
                            }}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Set due date"
                            isClearable
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
              backgroundMusic === 'zen-forest'
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
              backgroundMusic === 'zen-forest'
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
              <h2>Edit Study Plan</h2>
              <button className="close-btn" onClick={() => setEditingStudyPlan(null)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                
                // Calculate progress based on completed sub-topics
                const completedCount = subTopics.filter(st => st.completed).length
                const totalCount = subTopics.length
                const calculatedProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
                
                await fetch(`/api/study-plan/${editingStudyPlan.unique_id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    learning_status: formData.get('learning_status'),
                    learning_stage: formData.get('learning_stage'),
                    learning_proficiency: formData.get('learning_proficiency'),
                    progress_percentage: calculatedProgress,
                    target_date: formData.get('target_date'),
                    notes: formData.get('notes'),
                    sub_topics: JSON.stringify(subTopics) // Store sub-topics as JSON
                  })
                })
                setEditingStudyPlan(null)
                setSubTopics([])
                setNewSubTopic('')
                fetchStudyPlans()
              }}>
                <div className="form-group">
                  <label>Topic</label>
                  <div className="read-only-field">{editingStudyPlan.topic}</div>
                </div>
                <div className="form-group">
                  <label>Chapter</label>
                  <div className="read-only-field">{editingStudyPlan.chapter_name}</div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <div className="read-only-field">{editingStudyPlan.subject}</div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Learning Status</label>
                    <select name="learning_status" defaultValue={editingStudyPlan.learning_status}>
                      <option>In Queue</option>
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Learning Stage</label>
                    <select name="learning_stage" defaultValue={editingStudyPlan.learning_stage}>
                      <option>Initiated</option>
                      <option>Skimmed</option>
                      <option>Grasped</option>
                      <option>Practiced</option>
                      <option>Revised</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Proficiency</label>
                    <select name="learning_proficiency" defaultValue={editingStudyPlan.learning_proficiency}>
                      <option>Novice</option>
                      <option>Competent</option>
                      <option>Expert</option>
                      <option>Master</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Progress (%)</label>
                    <input 
                      name="progress_percentage" 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={subTopics.length > 0 ? Math.round((subTopics.filter(st => st.completed).length / subTopics.length) * 100) : 0}
                      readOnly 
                    />
                    <small>Calculated from completed sub-topics</small>
                  </div>
                </div>
                <div className="form-group">
                  <label>Target Date</label>
                  <input name="target_date" type="date" defaultValue={editingStudyPlan.target_date ? new Date(editingStudyPlan.target_date).toISOString().split('T')[0] : ''} />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" defaultValue={editingStudyPlan.notes} rows="3" placeholder="Add notes about this topic..." />
                </div>

                {/* Sub-Topics Checklist */}
                <div className="form-group">
                  <label>Sub-Topics Checklist</label>
                  <div className="subtopics-checklist">
                    {subTopics.map((subTopic, index) => (
                      <div key={subTopic.id} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={subTopic.completed}
                          onChange={(e) => {
                            const updatedSubTopics = [...subTopics]
                            updatedSubTopics[index].completed = e.target.checked
                            setSubTopics(updatedSubTopics)
                          }}
                        />
                        <span className={subTopic.completed ? 'completed' : ''}>
                          {subTopic.text}
                        </span>
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
                    ))}
                    <div className="add-subtopic">
                      <input
                        type="text"
                        value={newSubTopic}
                        onChange={(e) => setNewSubTopic(e.target.value)}
                        placeholder="Add new sub-topic..."
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
                        className="add-subtopic-btn"
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
                        +
                      </button>
                    </div>
                  </div>
                  <div className="checklist-progress">
                    Progress: {subTopics.filter(st => st.completed).length}/{subTopics.length} completed
                    ({subTopics.length > 0 ? Math.round((subTopics.filter(st => st.completed).length / subTopics.length) * 100) : 0}%)
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button type="button" onClick={() => setEditingStudyPlan(null)} className="cancel-btn">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}