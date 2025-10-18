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
      setStudyPlans(data)
    } catch (error) {
      console.error('Failed to load study plans:', error)
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

      <div style={{ minHeight: '100vh', backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
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
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>Goals & Targets</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', opacity: 0.7, color: '#1a1a1a' }}>v1.0.3-361bf16</span>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
          {/* Page Header with Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#605e5c', marginBottom: '8px' }}>
              <span>Home</span> / <span style={{ fontWeight: '600' }}>Goals</span>
            </div>
            <h2 style={{ color: '#323130', fontSize: '28px', fontWeight: '600', margin: '0 0 8px 0' }}>Learning Goals & Achievement Tracker</h2>
            <p style={{ color: '#605e5c', fontSize: '14px', margin: '0' }}>Track your academic progress, set proficiency targets, and earn achievement points</p>
          </div>

          {/* Achievement Points Dashboard - Glassmorphism Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.25)', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              borderRadius: '12px', 
              padding: '20px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.7)', marginBottom: '8px', fontWeight: '600' }}>⭐ STAR POINTS</div>
              <div style={{ fontSize: '32px', color: '#1a1a1a', fontWeight: '600', marginBottom: '4px' }}>{starPoints}</div>
              <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>10 points per star earned</div>
            </div>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.25)', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              borderRadius: '12px', 
              padding: '20px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.7)', marginBottom: '8px', fontWeight: '600' }}>🏆 BADGE POINTS</div>
              <div style={{ fontSize: '32px', color: '#1a1a1a', fontWeight: '600', marginBottom: '4px' }}>{badgePoints}</div>
              <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>100 points per badge (5 stars)</div>
            </div>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.25)', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              borderRadius: '12px', 
              padding: '20px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.7)', marginBottom: '8px', fontWeight: '600' }}>✨ TOTAL POINTS</div>
              <div style={{ fontSize: '32px', color: '#1a1a1a', fontWeight: '600', marginBottom: '4px' }}>{starPoints + badgePoints}</div>
              <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>Combined achievement score</div>
            </div>
          </div>

          {/* Subject Filter Pills - Glassmorphism Style */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132)'
          }}>
            <div style={{ fontSize: '13px', color: '#605e5c', marginBottom: '12px', fontWeight: '600' }}>FILTER BY SUBJECT</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '16px',
                    border: selectedSubject === subject ? '2px solid #0078d4' : '1px solid #8a8886',
                    backgroundColor: selectedSubject === subject ? '#deecf9' : 'white',
                    color: selectedSubject === subject ? '#0078d4' : '#323130',
                    fontWeight: selectedSubject === subject ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '13px'
                  }}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - MS Planner Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
            {/* Goals List */}
            <div>
              {subjectGoals.length === 0 ? (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '48px',
                  textAlign: 'center',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🎯</div>
                  <p style={{ fontSize: '16px', color: '#323130', margin: '0 0 8px 0', fontWeight: '600' }}>No goals set for {selectedSubject}</p>
                  <p style={{ fontSize: '13px', color: '#605e5c', margin: '0 0 20px 0' }}>Start by creating your first learning goal</p>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    style={{
                      padding: '8px 24px',
                      borderRadius: '2px',
                      border: 'none',
                      backgroundColor: '#0078d4',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#106ebe'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#0078d4'}
                  >
                    + Add First Goal
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {subjectGoals.map(([goalKey, goal]) => {
                    const daysLeft = getDaysRemaining(goal.targetDate)
                    const isOverdue = daysLeft < 0
                    const isUrgent = daysLeft <= 7 && daysLeft >= 0

                    return (
                      <div
                        key={goalKey}
                        style={{
                          background: 'rgba(255, 255, 255, 0.25)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: goal.completed ? '2px solid rgba(16, 124, 16, 0.6)' : '1px solid rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease',
                          opacity: goal.completed ? 0.75 : 1,
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              margin: '0 0 8px 0',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: goal.completed ? '#107c10' : '#323130',
                              textDecoration: goal.completed ? 'line-through' : 'none'
                            }}>
                              {goal.chapterName}
                            </h3>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#605e5c', flexWrap: 'wrap' }}>
                              <div style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                padding: '2px 8px',
                                borderRadius: '2px',
                                backgroundColor: '#f3f2f1'
                              }}>
                                <span style={{
                                  display: 'inline-block',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: getProficiencyColor(goal.targetProficiency)
                                }}></span>
                                {goal.targetProficiency}
                              </div>
                              <div style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                padding: '2px 8px',
                                borderRadius: '2px',
                                backgroundColor: '#f3f2f1'
                              }}>
                                <span style={{
                                  display: 'inline-block',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: getPriorityColor(goal.priority)
                                }}></span>
                                {goal.priority}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => toggleGoalCompletion(goalKey)}
                              style={{ 
                                cursor: 'pointer', 
                                width: '18px', 
                                height: '18px', 
                                accentColor: '#0078d4'
                              }}
                            />
                            <button
                              onClick={() => deleteGoal(goalKey)}
                              style={{
                                padding: '4px 12px',
                                borderRadius: '2px',
                                border: '1px solid #d13438',
                                backgroundColor: 'white',
                                color: '#d13438',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '400',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#d13438'
                                e.target.style.color = 'white'
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'white'
                                e.target.style.color = '#d13438'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Timeline - MS Planner Style */}
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '10px 12px', 
                          backgroundColor: isOverdue ? '#fde7e9' : isUrgent ? '#fff4ce' : '#dff6dd', 
                          borderLeft: `3px solid ${isOverdue ? '#d13438' : isUrgent ? '#ffaa44' : '#107c10'}`,
                          borderRadius: '2px' 
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '400', color: isOverdue ? '#a4262c' : isUrgent ? '#8a6200' : '#0b6a0b' }}>
                              📅 {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: isOverdue ? '#a4262c' : isUrgent ? '#8a6200' : '#0b6a0b' }}>
                              {isOverdue ? `⏰ ${Math.abs(daysLeft)} days overdue` : `📌 ${daysLeft} days left`}
                            </span>
                          </div>
                        </div>

                        {/* Achievement Progress - MS Planner Style */}
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '12px', 
                          backgroundColor: '#fef7da', 
                          borderLeft: '3px solid #ffaa44',
                          borderRadius: '2px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#323130' }}>⭐ Progress Stars</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#8a6200' }}>{goal.currentStars || 0} / {goal.stars ? Math.max(...goal.stars.map(s => s.count)) : 5}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => updateGoalStars(goalKey, star)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '2px',
                                  border: '1px solid #d9d9d9',
                                  backgroundColor: (goal.currentStars || 0) >= star ? '#ffaa44' : 'white',
                                  color: (goal.currentStars || 0) >= star ? 'white' : '#323130',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '12px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  if ((goal.currentStars || 0) < star) {
                                    e.target.style.backgroundColor = '#f3f2f1'
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if ((goal.currentStars || 0) < star) {
                                    e.target.style.backgroundColor = 'white'
                                  }
                                }}
                              >
                                {star}
                              </button>
                            ))}
                          </div>
                          <div style={{ fontSize: '11px', color: '#605e5c' }}>
                            💰 {(goal.currentStars || 0) * 10} star points + {Math.floor((goal.currentStars || 0) / 5) * 100} badge points
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar - Glassmorphism Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              height: 'fit-content',
              position: 'sticky',
              top: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: '#323130' }}>
                {showAddGoal ? '📝 Add New Goal' : '📊 Quick Stats'}
              </h3>

              {!showAddGoal ? (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #edebe9' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#605e5c', fontWeight: '400' }}>Total Goals</p>
                      <p style={{ margin: '0', fontSize: '28px', fontWeight: '600', color: '#0078d4' }}>{subjectGoals.length}</p>
                    </div>
                    <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #edebe9' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#605e5c', fontWeight: '400' }}>Completed</p>
                      <p style={{ margin: '0', fontSize: '28px', fontWeight: '600', color: '#107c10' }}>
                        {subjectGoals.filter(([_, g]) => g.completed).length}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#605e5c', fontWeight: '400' }}>Completion Rate</p>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#edebe9',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${subjectGoals.length > 0 ? (subjectGoals.filter(([_, g]) => g.completed).length / subjectGoals.length) * 100 : 0}%`,
                            height: '100%',
                            backgroundColor: '#107c10',
                            transition: 'width 0.3s ease'
                          }}
                        ></div>
                      </div>
                      <p style={{ margin: '6px 0 0 0', fontSize: '14px', fontWeight: '600', color: '#323130' }}>
                        {subjectGoals.length > 0 ? Math.round((subjectGoals.filter(([_, g]) => g.completed).length / subjectGoals.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddGoal(true)}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      borderRadius: '2px',
                      border: 'none',
                      backgroundColor: '#0078d4',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#106ebe'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#0078d4'}
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
                  {showTemplates ? '−' : '+'} [STAR] Goal Templates
                </button>

                {showTemplates && (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>[BOOK] Academic</p>
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
                      <p style={{ margin: '8px 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>[BRAIN] Behavioral</p>
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
                      <p style={{ margin: '8px 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>[COMMENT] Emotional</p>
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
