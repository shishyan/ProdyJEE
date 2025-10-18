const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Create database file in project root
const dbPath = path.join(process.cwd(), 'goals.db')

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err)
  } else {
    console.log('Connected to SQLite database')
    initializeTables()
  }
})

function initializeTables() {
  // Goals table
  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_key TEXT UNIQUE NOT NULL,
      subject TEXT NOT NULL,
      phrase TEXT NOT NULL,
      metric TEXT NOT NULL,
      category TEXT NOT NULL,
      current_value REAL DEFAULT 0,
      current_stars INTEGER DEFAULT 0,
      is_template BOOLEAN DEFAULT 1,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating goals table:', err)
    } else {
      console.log('Goals table ready')
      seedSampleGoals()
    }
  })

  // Goal star thresholds table
  db.run(`
    CREATE TABLE IF NOT EXISTS goal_thresholds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_key TEXT NOT NULL,
      star_count INTEGER NOT NULL,
      range_description TEXT NOT NULL,
      FOREIGN KEY (goal_key) REFERENCES goals(goal_key)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating thresholds table:', err)
    } else {
      console.log('Thresholds table ready')
    }
  })

  // Goal progress log
  db.run(`
    CREATE TABLE IF NOT EXISTS goal_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_key TEXT NOT NULL,
      value REAL NOT NULL,
      stars_earned INTEGER DEFAULT 0,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (goal_key) REFERENCES goals(goal_key)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating progress table:', err)
    } else {
      console.log('Progress table ready')
    }
  })
}

function seedSampleGoals() {
  const sampleGoals = [
    // Academic Goals
    { category: 'academic', phrase: 'Achieve mastery across all subjects in mock tests.', metric: 'Average score across PCM', stars: [{ range: '50–59%', count: 1 }, { range: '60–74%', count: 2 }, { range: '75–84%', count: 3 }, { range: '85–89%', count: 4 }, { range: '≥90%', count: 5 }] },
    { category: 'academic', phrase: 'Excel in Mathematics with precision.', metric: 'Best Math score in any test', stars: [{ range: '60–69%', count: 1 }, { range: '70–79%', count: 2 }, { range: '80–89%', count: 3 }, { range: '90–94%', count: 4 }, { range: '≥95%', count: 5 }] },
    { category: 'academic', phrase: 'Complete the entire syllabus before January.', metric: '% topics marked Grasped or higher', stars: [{ range: '≥50%', count: 1 }, { range: '≥60%', count: 2 }, { range: '≥75%', count: 3 }, { range: '≥90%', count: 4 }, { range: '100%', count: 5 }] },
    { category: 'academic', phrase: 'Solve past year questions to understand exam rhythm.', metric: 'Years of PYQs completed', stars: [{ range: '3 years', count: 1 }, { range: '5 years', count: 2 }, { range: '7 years', count: 3 }, { range: '8–9 years', count: 4 }, { range: 'All 10 years', count: 5 }] },
    { category: 'academic', phrase: 'Refine memory through full syllabus revisions.', metric: 'Number of full revisions', stars: [{ range: '1×', count: 1 }, { range: '2×', count: 2 }, { range: '3×', count: 5 }] },
    { category: 'academic', phrase: 'Finish Physics topic today.', metric: 'Topics completed this week', stars: [{ range: '1 topic', count: 1 }, { range: '3 topics', count: 2 }, { range: '5 topics', count: 3 }] },
    { category: 'academic', phrase: 'Solve 10 Math problems daily.', metric: 'Problems solved per week', stars: [{ range: '50 problems', count: 1 }, { range: '100 problems', count: 2 }, { range: '150+ problems', count: 3 }] },
    { category: 'academic', phrase: 'Revise Chemistry notes weekly.', metric: 'Revision sessions per month', stars: [{ range: '2 sessions', count: 1 }, { range: '4 sessions', count: 2 }, { range: '8+ sessions', count: 3 }] },
    { category: 'academic', phrase: 'Score 75% in mock tests.', metric: 'Tests ≥75% this month', stars: [{ range: '1 test', count: 1 }, { range: '2 tests', count: 2 }, { range: '4+ tests', count: 3 }] },
    { category: 'academic', phrase: 'Understand one tough concept daily.', metric: 'Concepts mastered per week', stars: [{ range: '3 concepts', count: 1 }, { range: '5 concepts', count: 2 }, { range: '7+ concepts', count: 3 }] },
    { category: 'academic', phrase: 'Complete NCERT exercises on time.', metric: 'Exercises done per week', stars: [{ range: '3 exercises', count: 1 }, { range: '6 exercises', count: 2 }, { range: '10+ exercises', count: 3 }] },
    
    // Behavioral Goals
    { category: 'behavioral', phrase: 'Show up for every test without fail.', metric: 'Missed tests count', stars: [{ range: 'Missed 2', count: 1 }, { range: 'Missed 1', count: 2 }, { range: '100% attendance', count: 5 }] },
    { category: 'behavioral', phrase: 'Build a streak of homework discipline.', metric: 'Days since last missed submission', stars: [{ range: '≥15 days', count: 1 }, { range: '≥30 days', count: 2 }, { range: '≥50 days', count: 5 }] },
    { category: 'behavioral', phrase: 'Maintain a leave-free study streak.', metric: 'Days without skipping study', stars: [{ range: '≥15 days', count: 1 }, { range: '≥30 days', count: 2 }, { range: '≥50 days', count: 5 }] },
    { category: 'behavioral', phrase: 'Resolve doubts consistently each week.', metric: 'Doubts asked per week', stars: [{ range: '1/week', count: 1 }, { range: '3/week', count: 2 }, { range: '5+/week', count: 5 }] },
    { category: 'behavioral', phrase: 'Log your study hours with commitment.', metric: 'Avg daily study time', stars: [{ range: '≥4 hrs', count: 1 }, { range: '≥5 hrs', count: 2 }, { range: '≥6 hrs', count: 5 }] },
    { category: 'behavioral', phrase: 'Maintain full test attendance this week.', metric: 'Weeks with 100% attendance', stars: [{ range: '1 week', count: 1 }, { range: '2 weeks', count: 2 }, { range: '4+ weeks', count: 3 }] },
    { category: 'behavioral', phrase: 'Build a 7-day study streak.', metric: 'Days studied consecutively', stars: [{ range: '7 days', count: 1 }, { range: '14 days', count: 2 }, { range: '21+ days', count: 3 }] },
    { category: 'behavioral', phrase: 'Submit all homework on time.', metric: 'On-time submissions per week', stars: [{ range: '3 submissions', count: 1 }, { range: '5 submissions', count: 2 }, { range: '7+ submissions', count: 3 }] },
    { category: 'behavioral', phrase: 'Ask doubts without hesitation.', metric: 'Doubts asked per session', stars: [{ range: '1 doubt', count: 1 }, { range: '3 doubts', count: 2 }, { range: '5+ doubts', count: 3 }] },
    { category: 'behavioral', phrase: 'Take guilt-free study breaks.', metric: 'Proper breaks per day', stars: [{ range: '2 breaks', count: 1 }, { range: '4 breaks', count: 2 }, { range: '6+ breaks', count: 3 }] },
    { category: 'behavioral', phrase: 'Avoid phone distractions during study.', metric: 'Distraction-free hours per week', stars: [{ range: '5 hours', count: 1 }, { range: '10 hours', count: 2 }, { range: '20+ hours', count: 3 }] },
    
    // Emotional Goals
    { category: 'emotional', phrase: 'Reflect weekly to stay emotionally aligned.', metric: 'Journal entries per month', stars: [{ range: '3 entries', count: 1 }, { range: '6 entries', count: 2 }, { range: '10+ entries', count: 5 }] },
    { category: 'emotional', phrase: 'Celebrate your small wins with pride.', metric: 'Wins logged per month', stars: [{ range: '3 wins', count: 1 }, { range: '6 wins', count: 2 }, { range: '10+ wins', count: 5 }] },
    { category: 'emotional', phrase: 'Rate your confidence and grow it weekly.', metric: 'Weekly self-rating', stars: [{ range: '≥6/10', count: 1 }, { range: '≥7/10', count: 2 }, { range: '≥8/10', count: 5 }] },
    { category: 'emotional', phrase: 'Write daily reflection for 5 minutes.', metric: 'Reflections written per week', stars: [{ range: '3 reflections', count: 1 }, { range: '5 reflections', count: 2 }, { range: '7+ reflections', count: 3 }] },
    { category: 'emotional', phrase: 'Celebrate small wins every day.', metric: 'Wins celebrated per week', stars: [{ range: '3 wins', count: 1 }, { range: '5 wins', count: 2 }, { range: '7+ wins', count: 3 }] },
    { category: 'emotional', phrase: 'Rate your confidence 7 or higher.', metric: 'Days with confidence ≥7', stars: [{ range: '3 days', count: 1 }, { range: '5 days', count: 2 }, { range: '7+ days', count: 3 }] },
    { category: 'emotional', phrase: 'Encourage a friend with kind words.', metric: 'Encouragements given per week', stars: [{ range: '2 encouragements', count: 1 }, { range: '4 encouragements', count: 2 }, { range: '7+ encouragements', count: 3 }] }
  ]

  const insertGoal = db.prepare(`
    INSERT OR IGNORE INTO goals (goal_key, subject, phrase, metric, category, is_template)
    VALUES (?, 'Chemistry', ?, ?, ?, 1)
  `)

  const insertThreshold = db.prepare(`
    INSERT INTO goal_thresholds (goal_key, star_count, range_description)
    VALUES (?, ?, ?)
  `)

  sampleGoals.forEach((goal, index) => {
    const goalKey = `template-${goal.category}-${index + 1}`
    
    // Insert goal
    insertGoal.run(goalKey, goal.phrase, goal.metric, goal.category, (err) => {
      if (err && !err.message.includes('UNIQUE constraint')) {
        console.error('Error inserting goal:', err)
      }
    })

    // Insert thresholds
    goal.stars.forEach(star => {
      insertThreshold.run(goalKey, star.count, star.range)
    })
  })

  insertGoal.finalize()
  insertThreshold.finalize()
  console.log('Sample goals seeded!')
}

module.exports = db
