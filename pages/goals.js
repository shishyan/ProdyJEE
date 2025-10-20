import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function GoalsPage() {
  const [goals, setGoals] = useState({})
  const [selectedSubject, setSelectedSubject] = useState('Chemistry')
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [starPoints, setStarPoints] = useState(0) // [STAR] Points from stars (10 per star)
  const [badgePoints, setBadgePoints] = useState(0) // [STAR] Points from badges (100 per badge)
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

  // [STAR] Star-Based Goal Templates
  const goalTemplates = {
    academic: [
      { phrase: 'Achieve mastery across all subjects in mock tests.', metric: 'Average score across PCM', stars: [{ range: '50–59%', count: 1 }, { range: '60–74%', count: 2 }, { range: '75–84%', count: 3 }, { range: '85–89%', count: 4 }, { range: '≥90%', count: 5 }] },
      { phrase: 'Excel in Mathematics with precision.', metric: 'Best Math score in any test', stars: [{ range: '60–69%', count: 1 }, { range: '70–79%', count: 2 }, { range: '80–89%', count: 3 }, { range: '90–94%', count: 4 }, { range: '≥95%', count: 5 }] },
      { phrase: 'Complete the entire syllabus before January.', metric: '% topics marked Grasped or higher', stars: [{ range: '≥50%', count: 1 }, { range: '≥60%', count: 2 }, { range: '≥75%', count: 3 }, { range: '≥90%', count: 4 }, { range: '100%', count: 5 }] },
      { phrase: 'Solve past year questions to understand exam rhythm.', metric: 'Years of PYQs completed', stars: [{ range: '3 years', count: 1 }, { range: '5 years', count: 2 }, { range: '7 years', count: 3 }, { range: '8–9 years', count: 4 }, { range: 'All 10 years', count: 5 }] },
      { phrase: 'Refine memory through full syllabus revisions.', metric: 'Number of full revisions', stars: [{ range: '1×', count: 1 }, { range: '2×', count: 2 }, { range: '3×', count: 5 }] },
      // NEW: 6 simpler daily/weekly academic goals
      { phrase: 'Finish Physics topic today.', metric: 'Topics completed this week', stars: [{ range: '1 topic', count: 1 }, { range: '3 topics', count: 2 }, { range: '5 topics', count: 3 }] },
      { phrase: 'Solve 10 Math problems daily.', metric: 'Problems solved per week', stars: [{ range: '50 problems', count: 1 }, { range: '100 problems', count: 2 }, { range: '150+ problems', count: 3 }] },
      { phrase: 'Revise Chemistry notes weekly.', metric: 'Revision sessions per month', stars: [{ range: '2 sessions', count: 1 }, { range: '4 sessions', count: 2 }, { range: '8+ sessions', count: 3 }] },
      { phrase: 'Score 75% in mock tests.', metric: 'Tests ≥75% this month', stars: [{ range: '1 test', count: 1 }, { range: '2 tests', count: 2 }, { range: '4+ tests', count: 3 }] },
      { phrase: 'Understand one tough concept daily.', metric: 'Concepts mastered per week', stars: [{ range: '3 concepts', count: 1 }, { range: '5 concepts', count: 2 }, { range: '7+ concepts', count: 3 }] },
      { phrase: 'Complete NCERT exercises on time.', metric: 'Exercises done per week', stars: [{ range: '3 exercises', count: 1 }, { range: '6 exercises', count: 2 }, { range: '10+ exercises', count: 3 }] }
    ],
    behavioral: [
      { phrase: 'Show up for every test without fail.', metric: 'Missed tests count', stars: [{ range: 'Missed 2', count: 1 }, { range: 'Missed 1', count: 2 }, { range: '100% attendance', count: 5 }] },
      { phrase: 'Build a streak of homework discipline.', metric: 'Days since last missed submission', stars: [{ range: '≥15 days', count: 1 }, { range: '≥30 days', count: 2 }, { range: '≥50 days', count: 5 }] },
      { phrase: 'Maintain a leave-free study streak.', metric: 'Days without skipping study', stars: [{ range: '≥15 days', count: 1 }, { range: '≥30 days', count: 2 }, { range: '≥50 days', count: 5 }] },
      { phrase: 'Resolve doubts consistently each week.', metric: 'Doubts asked per week', stars: [{ range: '1/week', count: 1 }, { range: '3/week', count: 2 }, { range: '5+/week', count: 5 }] },
      { phrase: 'Log your study hours with commitment.', metric: 'Avg daily study time', stars: [{ range: '≥4 hrs', count: 1 }, { range: '≥5 hrs', count: 2 }, { range: '≥6 hrs', count: 5 }] },
      // NEW: 6 simpler daily/weekly behavioral goals
      { phrase: 'Maintain full test attendance this week.', metric: 'Weeks with 100% attendance', stars: [{ range: '1 week', count: 1 }, { range: '2 weeks', count: 2 }, { range: '4+ weeks', count: 3 }] },
      { phrase: 'Build a 7-day study streak.', metric: 'Days studied consecutively', stars: [{ range: '7 days', count: 1 }, { range: '14 days', count: 2 }, { range: '21+ days', count: 3 }] },
      { phrase: 'Submit all homework on time.', metric: 'On-time submissions per week', stars: [{ range: '3 submissions', count: 1 }, { range: '5 submissions', count: 2 }, { range: '7+ submissions', count: 3 }] },
      { phrase: 'Ask doubts without hesitation.', metric: 'Doubts asked per session', stars: [{ range: '1 doubt', count: 1 }, { range: '3 doubts', count: 2 }, { range: '5+ doubts', count: 3 }] },
      { phrase: 'Take guilt-free study breaks.', metric: 'Proper breaks per day', stars: [{ range: '2 breaks', count: 1 }, { range: '4 breaks', count: 2 }, { range: '6+ breaks', count: 3 }] },
      { phrase: 'Avoid phone distractions during study.', metric: 'Distraction-free hours per week', stars: [{ range: '5 hours', count: 1 }, { range: '10 hours', count: 2 }, { range: '20+ hours', count: 3 }] }
    ],
    emotional: [
      { phrase: 'Reflect weekly to stay emotionally aligned.', metric: 'Journal entries per month', stars: [{ range: '3 entries', count: 1 }, { range: '6 entries', count: 2 }, { range: '10+ entries', count: 5 }] },
      { phrase: 'Celebrate your small wins with pride.', metric: 'Wins logged per month', stars: [{ range: '3 wins', count: 1 }, { range: '6 wins', count: 2 }, { range: '10+ wins', count: 5 }] },
      { phrase: 'Rate your confidence and grow it weekly.', metric: 'Weekly self-rating', stars: [{ range: '≥6/10', count: 1 }, { range: '≥7/10', count: 2 }, { range: '≥8/10', count: 5 }] },
      // NEW: 4 simpler daily/weekly emotional goals
      { phrase: 'Write daily reflection for 5 minutes.', metric: 'Reflections written per week', stars: [{ range: '3 reflections', count: 1 }, { range: '5 reflections', count: 2 }, { range: '7+ reflections', count: 3 }] },
      { phrase: 'Celebrate small wins every day.', metric: 'Wins celebrated per week', stars: [{ range: '3 wins', count: 1 }, { range: '5 wins', count: 2 }, { range: '7+ wins', count: 3 }] },
      { phrase: 'Rate your confidence 7 or higher.', metric: 'Days with confidence ≥7', stars: [{ range: '3 days', count: 1 }, { range: '5 days', count: 2 }, { range: '7+ days', count: 3 }] },
      { phrase: 'Encourage a friend with kind words.', metric: 'Encouragements given per week', stars: [{ range: '2 encouragements', count: 1 }, { range: '4 encouragements', count: 2 }, { range: '7+ encouragements', count: 3 }] }
    ]
  }

  const renderStars = (count) => '[' + 'STAR'.repeat(count) + ']'

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
      // Ensure data is an array
      if (Array.isArray(data)) {
        setStudyPlans(data)
      } else if (data && typeof data === 'object') {
        // If it's an object with a studyPlans property, use that
        setStudyPlans(data.studyPlans || [])
      } else {
        setStudyPlans([])
      }
    } catch (error) {
      console.error('Failed to load study plans:', error)
      setStudyPlans([])
    }
  }

  const loadGoals = () => {
    const saved = localStorage.getItem('goals')
    const savedStarPoints = parseInt(localStorage.getItem('starPoints') || '0', 10)
    const savedBadgePoints = parseInt(localStorage.getItem('badgePoints') || '0', 10)
    if (saved) {
      setGoals(JSON.parse(saved))
    }
    setStarPoints(savedStarPoints)
    setBadgePoints(savedBadgePoints)
  }

  const saveGoals = (updatedGoals) => {
    localStorage.setItem('goals', JSON.stringify(updatedGoals))
    localStorage.setItem('starPoints', starPoints.toString())
    localStorage.setItem('badgePoints', badgePoints.toString())
    setGoals(updatedGoals)
  }

  // [STAR] Calculate points: Each star = 10 points, Each badge (5 stars) = 100 points
  const calculatePointsForGoal = (currentStars) => {
    const starPts = currentStars * 10 // 10 points per star
    const badgePts = Math.floor(currentStars / 5) * 100 // 100 points per full badge (5 stars)
    return { starPts, badgePts }
  }

  const updateGoalStars = (goalKey, newStars) => {
    const goal = goals[goalKey]
    const oldStars = goal.currentStars || 0
    
    if (newStars > oldStars) {
      // Award points for new stars
      const { starPts, badgePts } = calculatePointsForGoal(newStars - oldStars)
      setStarPoints(prev => prev + starPts)
      
      // Check if crossing badge boundary
      const oldBadges = Math.floor(oldStars / 5)
      const newBadges = Math.floor(newStars / 5)
      if (newBadges > oldBadges) {
        const newBadgePts = (newBadges - oldBadges) * 100
        setBadgePoints(prev => prev + newBadgePts)
      }
    }
    
    const updatedGoals = {
      ...goals,
      [goalKey]: { ...goal, currentStars: newStars }
    }
    saveGoals(updatedGoals)
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
    if (!Array.isArray(studyPlans)) return []
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
        <title>Goals & Targets - ProdyJEE</title>
        <link rel="stylesheet" href="/ProdyJEE/styles/globals.css" />
      </Head>

      <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Page Header */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>🎯 My Goals</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}>Track your academic progress and earn achievement points</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#fef3c7', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '18px' }}>⭐</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#92400e' }}>{starPoints + badgePoints} pts</span>
              </div>
              <button
                onClick={() => setShowAddGoal(true)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#4f46e5'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#6366f1'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                + New Goal
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: '12px', 
              padding: '16px',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
              color: 'white'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', fontWeight: '500' }}>⭐ Star Points</div>
              <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '2px' }}>{starPoints}</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>10 pts per star</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              borderRadius: '12px', 
              padding: '16px',
              boxShadow: '0 10px 25px rgba(240, 147, 251, 0.3)',
              color: 'white'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', fontWeight: '500' }}>🏆 Badge Points</div>
              <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '2px' }}>{badgePoints}</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>100 pts per badge</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
              borderRadius: '12px', 
              padding: '16px',
              boxShadow: '0 10px 25px rgba(79, 172, 254, 0.3)',
              color: 'white'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', fontWeight: '500' }}>✨ Total Score</div>
              <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '2px' }}>{starPoints + badgePoints}</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>Combined points</div>
            </div>
          </div>

          {/* Subject Filter Pills - Modern Style */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter by Subject</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {subjects.map(subject => {
                const subjectColors = {
                  'Chemistry': { bg: '#fef3c7', border: '#fbbf24', text: '#92400e' },
                  'Mathematics': { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
                  'Physics': { bg: '#fce7f3', border: '#ec4899', text: '#831843' }
                }
                const colors = subjectColors[subject] || { bg: '#f3f4f6', border: '#9ca3af', text: '#1f2937' }
                
                return (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: selectedSubject === subject ? `2px solid ${colors.border}` : '2px solid transparent',
                      backgroundColor: selectedSubject === subject ? colors.bg : '#f9fafb',
                      color: selectedSubject === subject ? colors.text : '#4b5563',
                      fontWeight: selectedSubject === subject ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '13px'
                    }}
                  >
                    {subject}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content - Responsive Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Goals List */}
            <div>
              {subjectGoals.length === 0 ? (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '64px 32px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🎯</div>
                  <p style={{ fontSize: '18px', color: '#1a202c', margin: '0 0 8px 0', fontWeight: '600' }}>No goals set for {selectedSubject}</p>
                  <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 24px 0' }}>Start by creating your first learning goal or choose from templates</p>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    style={{
                      padding: '12px 32px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#6366f1',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#4f46e5'
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#6366f1'
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    + Add First Goal
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {subjectGoals.map(([goalKey, goal]) => {
                    const daysLeft = getDaysRemaining(goal.targetDate)
                    const isOverdue = daysLeft < 0
                    const isUrgent = daysLeft <= 7 && daysLeft >= 0
                    
                    // Category-based colors
                    const categoryColors = {
                      academic: { bg: '#eff6ff', border: '#3b82f6', dot: '#2563eb' },
                      behavioral: { bg: '#fef3c7', border: '#f59e0b', dot: '#d97706' },
                      emotional: { bg: '#fce7f3', border: '#ec4899', dot: '#db2777' }
                    }
                    const category = goal.phrase ? (
                      goalTemplates.academic.some(t => t.phrase === goal.phrase) ? 'academic' :
                      goalTemplates.behavioral.some(t => t.phrase === goal.phrase) ? 'behavioral' : 'emotional'
                    ) : 'academic'
                    const colors = categoryColors[category]

                    return (
                      <div
                        key={goalKey}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '16px',
                          padding: '20px',
                          border: goal.completed ? '2px solid #10b981' : '1px solid #e2e8f0',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.2s ease',
                          opacity: goal.completed ? 0.7 : 1,
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          if (!goal.completed) {
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        {/* Category Tag */}
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          backgroundColor: colors.bg,
                          marginBottom: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: colors.dot,
                          border: `1px solid ${colors.border}`
                        }}>
                          <span style={{
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: colors.dot
                          }}></span>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              margin: '0 0 8px 0',
                              fontSize: '16px',
                              fontWeight: '600',
                              color: goal.completed ? '#10b981' : '#1a202c',
                              textDecoration: goal.completed ? 'line-through' : 'none',
                              lineHeight: '1.4'
                            }}>
                              {goal.phrase || goal.chapterName}
                            </h3>
                            {goal.metric && (
                              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#718096', lineHeight: '1.5' }}>
                                📊 {goal.metric}
                              </p>
                            )}
                            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#718096', flexWrap: 'wrap' }}>
                              {goal.targetProficiency && (
                                <div style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '4px',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#f3f4f6'
                                }}>
                                  <span style={{
                                    display: 'inline-block',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: getProficiencyColor(goal.targetProficiency)
                                  }}></span>
                                  {goal.targetProficiency}
                                </div>
                              )}
                              {goal.priority && (
                                <div style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '4px',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#f3f4f6'
                                }}>
                                  <span style={{
                                    display: 'inline-block',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: getPriorityColor(goal.priority)
                                  }}></span>
                                  {goal.priority}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleGoalCompletion(goalKey)
                              }}
                              style={{ 
                                cursor: 'pointer', 
                                width: '20px', 
                                height: '20px', 
                                accentColor: '#10b981'
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteGoal(goalKey)
                              }}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: '1px solid #ef4444',
                                backgroundColor: 'white',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#ef4444'
                                e.target.style.color = 'white'
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'white'
                                e.target.style.color = '#ef4444'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Timeline - Modern Style */}
                        {goal.targetDate && (
                          <div style={{ 
                            marginTop: '16px', 
                            padding: '12px 16px', 
                            backgroundColor: isOverdue ? '#fef2f2' : isUrgent ? '#fefce8' : '#f0fdf4', 
                            borderRadius: '10px',
                            border: `1px solid ${isOverdue ? '#fecaca' : isUrgent ? '#fde047' : '#bbf7d0'}`
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: '500', color: isOverdue ? '#991b1b' : isUrgent ? '#854d0e' : '#166534' }}>
                                📅 {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: isOverdue ? '#991b1b' : isUrgent ? '#854d0e' : '#166534' }}>
                                {isOverdue ? `⏰ ${Math.abs(daysLeft)}d overdue` : `${daysLeft}d remaining`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Achievement Progress - Modern Style */}
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '16px', 
                          backgroundColor: '#fafaf9', 
                          borderRadius: '12px',
                          border: '1px solid #e7e5e4'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>⭐ Progress Stars</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1' }}>{goal.currentStars || 0} / {goal.stars ? Math.max(...goal.stars.map(s => s.count)) : 5}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateGoalStars(goalKey, star)
                                }}
                                style={{
                                  flex: 1,
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: (goal.currentStars || 0) >= star ? '#fbbf24' : '#f3f4f6',
                                  color: (goal.currentStars || 0) >= star ? 'white' : '#9ca3af',
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                  fontSize: '16px',
                                  transition: 'all 0.2s ease',
                                  boxShadow: (goal.currentStars || 0) >= star ? '0 2px 8px rgba(251, 191, 36, 0.3)' : 'none'
                                }}
                                onMouseOver={(e) => {
                                  if ((goal.currentStars || 0) < star) {
                                    e.target.style.backgroundColor = '#e5e7eb'
                                    e.target.style.transform = 'scale(1.05)'
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if ((goal.currentStars || 0) < star) {
                                    e.target.style.backgroundColor = '#f3f4f6'
                                    e.target.style.transform = 'scale(1)'
                                  }
                                }}
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                          {goal.stars && goal.stars.length > 0 && (
                            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '8px' }}>
                              {goal.stars.map((s, i) => (
                                <div key={i} style={{ marginBottom: '2px' }}>
                                  {'⭐'.repeat(s.count)} = {s.range}
                                </div>
                              ))}
                            </div>
                          )}
                          <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', paddingTop: '8px', borderTop: '1px solid #e7e5e4' }}>
                            💰 {(goal.currentStars || 0) * 10} star pts + {Math.floor((goal.currentStars || 0) / 5) * 100} badge pts
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar - Modern Panel */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              height: 'fit-content',
              position: 'sticky',
              top: '24px'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>
                {showAddGoal ? '📝 Add New Goal' : '📊 Quick Stats'}
              </h3>

              {!showAddGoal ? (
                <>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid #f3f4f6' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#718096', fontWeight: '500' }}>Total Goals</p>
                      <p style={{ margin: '0', fontSize: '32px', fontWeight: '700', color: '#6366f1' }}>{subjectGoals.length}</p>
                    </div>
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid #f3f4f6' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#718096', fontWeight: '500' }}>Completed</p>
                      <p style={{ margin: '0', fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
                        {subjectGoals.filter(([_, g]) => g.completed).length}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#718096', fontWeight: '500' }}>Completion Rate</p>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${subjectGoals.length > 0 ? (subjectGoals.filter(([_, g]) => g.completed).length / subjectGoals.length) * 100 : 0}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                            transition: 'width 0.3s ease'
                          }}
                        ></div>
                      </div>
                      <p style={{ margin: '10px 0 0 0', fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                        {subjectGoals.length > 0 ? Math.round((subjectGoals.filter(([_, g]) => g.completed).length / subjectGoals.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddGoal(true)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#6366f1',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#4f46e5'
                      e.target.style.transform = 'translateY(-2px)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#6366f1'
                      e.target.style.transform = 'translateY(0)'
                    }}
                  >
                    + Add Goal
                  </button>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>Chapter</label>
                    <select
                      value={formData.chapterName}
                      onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        backgroundColor: '#f9fafb',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">Select Chapter</option>
                      {getChapterChaptersForSubject().map(ch => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>Target Proficiency</label>
                    <select
                      value={formData.targetProficiency}
                      onChange={(e) => setFormData({ ...formData, targetProficiency: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        backgroundColor: '#f9fafb',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      {proficiencyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        backgroundColor: '#f9fafb',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      {priorities.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>Target Date</label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        backgroundColor: '#f9fafb',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={addGoal}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#059669'
                        e.target.style.transform = 'translateY(-1px)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#10b981'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      Save Goal
                    </button>
                    <button
                      onClick={() => setShowAddGoal(false)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: 'white',
                        color: '#6b7280',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#f9fafb'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'white'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Star-Based Goal Templates */}
              <div style={{ marginTop: '24px', borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: showTemplates ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : '#f3f4f6',
                    color: showTemplates ? 'white' : '#374151',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginBottom: '16px',
                    transition: 'all 0.2s ease',
                    boxShadow: showTemplates ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                >
                  {showTemplates ? '▼' : '▶'} ⭐ Goal Templates ({goalTemplates.academic.length + goalTemplates.behavioral.length + goalTemplates.emotional.length})
                </button>

                {showTemplates && (
                  <div style={{ display: 'grid', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '8px',
                        border: '1px solid #bfdbfe'
                      }}>
                        <span style={{ fontSize: '16px' }}>📚</span>
                        <p style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>Academic Goals</p>
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {goalTemplates.academic.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => addTemplateGoal(t)}
                            title={t.metric}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white',
                              color: '#1f2937',
                              cursor: 'pointer',
                              fontSize: '12px',
                              textAlign: 'left',
                              fontWeight: '500',
                              lineHeight: '1.4',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#eff6ff'
                              e.target.style.borderColor = '#3b82f6'
                              e.target.style.transform = 'translateX(4px)'
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'white'
                              e.target.style.borderColor = '#e5e7eb'
                              e.target.style.transform = 'translateX(0)'
                            }}
                          >
                            {t.phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '8px',
                        border: '1px solid #fde047'
                      }}>
                        <span style={{ fontSize: '16px' }}>🎯</span>
                        <p style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#92400e' }}>Behavioral Goals</p>
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {goalTemplates.behavioral.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => addTemplateGoal(t)}
                            title={t.metric}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white',
                              color: '#1f2937',
                              cursor: 'pointer',
                              fontSize: '12px',
                              textAlign: 'left',
                              fontWeight: '500',
                              lineHeight: '1.4',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#fef3c7'
                              e.target.style.borderColor = '#f59e0b'
                              e.target.style.transform = 'translateX(4px)'
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'white'
                              e.target.style.borderColor = '#e5e7eb'
                              e.target.style.transform = 'translateX(0)'
                            }}
                          >
                            {t.phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#fce7f3',
                        borderRadius: '8px',
                        border: '1px solid #fbcfe8'
                      }}>
                        <span style={{ fontSize: '16px' }}>💝</span>
                        <p style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#831843' }}>Emotional Goals</p>
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {goalTemplates.emotional.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => addTemplateGoal(t)}
                            title={t.metric}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white',
                              color: '#1f2937',
                              cursor: 'pointer',
                              fontSize: '12px',
                              textAlign: 'left',
                              fontWeight: '500',
                              lineHeight: '1.4',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#fce7f3'
                              e.target.style.borderColor = '#ec4899'
                              e.target.style.transform = 'translateX(4px)'
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'white'
                              e.target.style.borderColor = '#e5e7eb'
                              e.target.style.transform = 'translateX(0)'
                            }}
                          >
                            {t.phrase}
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
