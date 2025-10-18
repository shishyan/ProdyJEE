import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function GoalsPage() {
  const [goals, setGoals] = useState({})
  const [selectedSubject, setSelectedSubject] = useState('Chemistry')
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [formData, setFormData] = useState({
    chapterName: '',
    targetProficiency: 'Competent',
    targetDate: '',
    priority: 'Medium'
  })
  const [studyPlans, setStudyPlans] = useState([])

  const subjects = ['Chemistry', 'Mathematics', 'Physics']
  const proficiencyLevels = ['Novice', 'Competent', 'Expert', 'Master']
  const priorities = ['Low', 'Medium', 'High', 'Critical']

  // ⭐ Star-Based Goal Templates
  const goalTemplates = {
    academic: [
      { phrase: 'Achieve mastery across all subjects in mock tests.', metric: 'Average score across PCM', stars: [{ range: '50–59%', count: 1 }, { range: '60–74%', count: 2 }, { range: '75–84%', count: 3 }, { range: '85–89%', count: 4 }, { range: '≥90%', count: 5 }] },
      { phrase: 'Excel in Mathematics with precision.', metric: 'Best Math score in any test', stars: [{ range: '60–69%', count: 1 }, { range: '70–79%', count: 2 }, { range: '80–89%', count: 3 }, { range: '90–94%', count: 4 }, { range: '≥95%', count: 5 }] },
      { phrase: 'Complete the entire syllabus before January.', metric: '% topics marked Grasped or higher', stars: [{ range: '≥50%', count: 1 }, { range: '≥60%', count: 2 }, { range: '≥75%', count: 3 }, { range: '≥90%', count: 4 }, { range: '100%', count: 5 }] },
      { phrase: 'Solve past year questions to understand exam rhythm.', metric: 'Years of PYQs completed', stars: [{ range: '3 years', count: 1 }, { range: '5 years', count: 2 }, { range: '7 years', count: 3 }, { range: '8–9 years', count: 4 }, { range: 'All 10 years', count: 5 }] },
      { phrase: 'Refine memory through full syllabus revisions.', metric: 'Number of full revisions', stars: [{ range: '1×', count: 1 }, { range: '2×', count: 2 }, { range: '3×', count: 5 }] }
    ],
    behavioral: [
      { phrase: 'Show up for every test without fail.', metric: 'Missed tests count', stars: [{ range: 'Missed 2', count: 1 }, { range: 'Missed 1', count: 2 }, { range: '100% attendance', count: 5 }] },
      { phrase: 'Build a streak of homework discipline.', metric: 'Days since last missed submission', stars: [{ range: '≥15 days', count: 1 }, { range: '≥30 days', count: 2 }, { range: '≥50 days', count: 5 }] },
      { phrase: 'Maintain a leave-free study streak.', metric: 'Days without skipping study', stars: [{ range: '≥15 days', count: 1 }, { range: '≥30 days', count: 2 }, { range: '≥50 days', count: 5 }] },
      { phrase: 'Resolve doubts consistently each week.', metric: 'Doubts asked per week', stars: [{ range: '1/week', count: 1 }, { range: '3/week', count: 2 }, { range: '5+/week', count: 5 }] },
      { phrase: 'Log your study hours with commitment.', metric: 'Avg daily study time', stars: [{ range: '≥4 hrs', count: 1 }, { range: '≥5 hrs', count: 2 }, { range: '≥6 hrs', count: 5 }] }
    ],
    emotional: [
      { phrase: 'Reflect weekly to stay emotionally aligned.', metric: 'Journal entries per month', stars: [{ range: '3 entries', count: 1 }, { range: '6 entries', count: 2 }, { range: '10+ entries', count: 5 }] },
      { phrase: 'Celebrate your small wins with pride.', metric: 'Wins logged per month', stars: [{ range: '3 wins', count: 1 }, { range: '6 wins', count: 2 }, { range: '10+ wins', count: 5 }] },
      { phrase: 'Rate your confidence and grow it weekly.', metric: 'Weekly self-rating', stars: [{ range: '≥6/10', count: 1 }, { range: '≥7/10', count: 2 }, { range: '≥8/10', count: 5 }] }
    ]
  }

  const renderStars = (count) => '⭐'.repeat(count)

  const addTemplateGoal = (template) => {
    const goalKey = `template-${Date.now()}`
    const updatedGoals = {
      ...goals,
      [goalKey]: {
        ...template,
        subject: selectedSubject,
        createdAt: new Date().toISOString(),
        completed: false,
        isTemplate: true,
        currentValue: 0,
        currentStars: 0
      }
    }
    saveGoals(updatedGoals)
  }

  useEffect(() => {
    loadGoals()
    loadStudyPlans()
  }, [])

  const loadStudyPlans = async () => {
    try {
      const response = await fetch('/ProdyJEE/database-export.json')
      const data = await response.json()
      setStudyPlans(data)
    } catch (error) {
      console.error('Failed to load study plans:', error)
    }
  }

  const loadGoals = () => {
    const saved = localStorage.getItem('goals')
    if (saved) {
      setGoals(JSON.parse(saved))
    }
  }

  const saveGoals = (updatedGoals) => {
    localStorage.setItem('goals', JSON.stringify(updatedGoals))
    setGoals(updatedGoals)
  }

  const addGoal = () => {
    if (!formData.chapterName || !formData.targetDate) {
      alert('Please fill in all fields')
      return
    }

    const goalKey = `${selectedSubject}-${formData.chapterName}`
    const updatedGoals = {
      ...goals,
      [goalKey]: {
        ...formData,
        subject: selectedSubject,
        createdAt: new Date().toISOString(),
        completed: false
      }
    }
    saveGoals(updatedGoals)
    setFormData({ chapterName: '', targetProficiency: 'Competent', targetDate: '', priority: 'Medium' })
    setShowAddGoal(false)
  }

  const deleteGoal = (goalKey) => {
    const updatedGoals = { ...goals }
    delete updatedGoals[goalKey]
    saveGoals(updatedGoals)
  }

  const toggleGoalCompletion = (goalKey) => {
    const updatedGoals = {
      ...goals,
      [goalKey]: { ...goals[goalKey], completed: !goals[goalKey].completed }
    }
    saveGoals(updatedGoals)
  }

  const getUniqueChapters = (subject) => {
    return [...new Set(studyPlans.filter(p => p.subject === subject).map(p => p.chapter_name))]
  }

  const getChapterChaptersForSubject = () => {
    return getUniqueChapters(selectedSubject)
  }

  const subjectGoals = Object.entries(goals).filter(([_, goal]) => goal.subject === selectedSubject)

  const getProficiencyColor = (level) => {
    const colors = {
      'Novice': '#ef4444',
      'Competent': '#f59e0b',
      'Expert': '#3b82f6',
      'Master': '#8b5cf6'
    }
    return colors[level] || '#6b7280'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444',
      'Critical': '#7c3aed'
    }
    return colors[priority] || '#6b7280'
  }

  const getDaysRemaining = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <>
      <Head>
        <title>Goals - ProdyJEE</title>
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '700', margin: '0 0 10px 0' }}>🎯 Goals & Targets</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0' }}>Set learning proficiency targets for each chapter</p>
          </div>

          {/* Subject Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: selectedSubject === subject ? 'white' : 'rgba(255,255,255,0.2)',
                  color: selectedSubject === subject ? '#667eea' : 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
            {/* Goals List */}
            <div>
              {subjectGoals.length === 0 ? (
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{ fontSize: '16px', margin: '0 0 15px 0' }}>No goals set for {selectedSubject}</p>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'white',
                      color: '#667eea',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    + Add First Goal
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {subjectGoals.map(([goalKey, goal]) => {
                    const daysLeft = getDaysRemaining(goal.targetDate)
                    const isOverdue = daysLeft < 0
                    const isUrgent = daysLeft <= 7 && daysLeft >= 0

                    return (
                      <div
                        key={goalKey}
                        style={{
                          background: 'rgba(255,255,255,0.95)',
                          borderRadius: '12px',
                          padding: '20px',
                          backdropFilter: 'blur(10px)',
                          border: goal.completed ? '2px solid #10b981' : '1px solid rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          opacity: goal.completed ? 0.7 : 1
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              margin: '0 0 8px 0',
                              fontSize: '16px',
                              fontWeight: '600',
                              color: goal.completed ? '#10b981' : '#1f2937',
                              textDecoration: goal.completed ? 'line-through' : 'none'
                            }}>
                              {goal.chapterName}
                            </h3>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#6b7280' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{
                                  display: 'inline-block',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '3px',
                                  backgroundColor: getProficiencyColor(goal.targetProficiency)
                                }}></span>
                                {goal.targetProficiency}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{
                                  display: 'inline-block',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '3px',
                                  backgroundColor: getPriorityColor(goal.priority)
                                }}></span>
                                {goal.priority}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => toggleGoalCompletion(goalKey)}
                              style={{ cursor: 'pointer', width: '20px', height: '20px', accentColor: '#10b981' }}
                            />
                            <button
                              onClick={() => deleteGoal(goalKey)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                backgroundColor: 'transparent',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: isOverdue ? '#fee2e2' : isUrgent ? '#fef3c7' : '#ecfdf5', borderRadius: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: isOverdue ? '#dc2626' : isUrgent ? '#d97706' : '#059669' }}>
                              📅 {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: isOverdue ? '#dc2626' : isUrgent ? '#d97706' : '#059669' }}>
                              {isOverdue ? `⏰ ${Math.abs(daysLeft)} days overdue` : `📌 ${daysLeft} days left`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar - Add Goal Form */}
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                {showAddGoal ? 'Add New Goal' : 'Quick Stats'}
              </h3>

              {!showAddGoal ? (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Total Goals</p>
                      <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#667eea' }}>{subjectGoals.length}</p>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Completed</p>
                      <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                        {subjectGoals.filter(([_, g]) => g.completed).length}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Completion Rate</p>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '8px'
                      }}>
                        <div
                          style={{
                            width: `${subjectGoals.length > 0 ? (subjectGoals.filter(([_, g]) => g.completed).length / subjectGoals.length) * 100 : 0}%`,
                            height: '100%',
                            backgroundColor: '#10b981',
                            transition: 'width 0.3s ease'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddGoal(true)}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#667eea',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    + Add Goal
                  </button>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '5px' }}>Chapter</label>
                    <select
                      value={formData.chapterName}
                      onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="">Select Chapter</option>
                      {getChapterChaptersForSubject().map(ch => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '5px' }}>Target Proficiency</label>
                    <select
                      value={formData.targetProficiency}
                      onChange={(e) => setFormData({ ...formData, targetProficiency: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                      }}
                    >
                      {proficiencyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '5px' }}>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                      }}
                    >
                      {priorities.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '5px' }}>Target Date</label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={addGoal}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Save Goal
                    </button>
                    <button
                      onClick={() => setShowAddGoal(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Star-Based Goal Templates */}
              <div style={{ marginTop: '20px', borderTop: '2px solid #e5e7eb', paddingTop: '15px' }}>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: showTemplates ? '#8b5cf6' : '#f3f4f6',
                    color: showTemplates ? 'white' : '#374151',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px',
                    marginBottom: '10px'
                  }}
                >
                  {showTemplates ? '−' : '+'} ⭐ Goal Templates
                </button>

                {showTemplates && (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>📘 Academic</p>
                      <div style={{ display: 'grid', gap: '6px' }}>
                        {goalTemplates.academic.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => addTemplateGoal(t)}
                            title={t.metric}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white',
                              color: '#374151',
                              cursor: 'pointer',
                              fontSize: '11px',
                              textAlign: 'left',
                              fontWeight: '500',
                              whiteSpace: 'normal'
                            }}
                          >
                            {t.phrase.substring(0, 35)}...
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ margin: '8px 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>🧠 Behavioral</p>
                      <div style={{ display: 'grid', gap: '6px' }}>
                        {goalTemplates.behavioral.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => addTemplateGoal(t)}
                            title={t.metric}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white',
                              color: '#374151',
                              cursor: 'pointer',
                              fontSize: '11px',
                              textAlign: 'left',
                              fontWeight: '500',
                              whiteSpace: 'normal'
                            }}
                          >
                            {t.phrase.substring(0, 35)}...
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ margin: '8px 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>💬 Emotional</p>
                      <div style={{ display: 'grid', gap: '6px' }}>
                        {goalTemplates.emotional.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => addTemplateGoal(t)}
                            title={t.metric}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white',
                              color: '#374151',
                              cursor: 'pointer',
                              fontSize: '11px',
                              textAlign: 'left',
                              fontWeight: '500',
                              whiteSpace: 'normal'
                            }}
                          >
                            {t.phrase.substring(0, 35)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
