const db = require('../../../lib/db')

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Get all goals
    db.all(`
      SELECT g.*, 
             GROUP_CONCAT(t.star_count || ':' || t.range_description, '|') as thresholds
      FROM goals g
      LEFT JOIN goal_thresholds t ON g.goal_key = t.goal_key
      GROUP BY g.id
      ORDER BY g.category, g.created_at
    `, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      
      // Parse thresholds
      const goals = rows.map(row => ({
        ...row,
        stars: row.thresholds ? row.thresholds.split('|').map(t => {
          const [count, range] = t.split(':')
          return { count: parseInt(count), range }
        }) : []
      }))
      
      res.status(200).json(goals)
    })
  } else if (req.method === 'POST') {
    // Add a new goal
    const { subject, phrase, metric, category, stars } = req.body
    const goalKey = `user-${Date.now()}`
    
    db.run(`
      INSERT INTO goals (goal_key, subject, phrase, metric, category, is_template)
      VALUES (?, ?, ?, ?, ?, 0)
    `, [goalKey, subject, phrase, metric, category], function(err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      
      // Insert thresholds
      if (stars && stars.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO goal_thresholds (goal_key, star_count, range_description)
          VALUES (?, ?, ?)
        `)
        
        stars.forEach(star => {
          stmt.run(goalKey, star.count, star.range)
        })
        
        stmt.finalize()
      }
      
      res.status(201).json({ goalKey, id: this.lastID })
    })
  } else if (req.method === 'PUT') {
    // Update goal progress
    const { goalKey, currentValue, currentStars, completed } = req.body
    
    db.run(`
      UPDATE goals
      SET current_value = ?,
          current_stars = ?,
          completed = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE goal_key = ?
    `, [currentValue, currentStars, completed ? 1 : 0, goalKey], (err) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      
      // Log progress
      db.run(`
        INSERT INTO goal_progress (goal_key, value, stars_earned)
        VALUES (?, ?, ?)
      `, [goalKey, currentValue, currentStars])
      
      res.status(200).json({ success: true })
    })
  } else if (req.method === 'DELETE') {
    // Delete a goal
    const { goalKey } = req.query
    
    db.run(`DELETE FROM goals WHERE goal_key = ?`, [goalKey], (err) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      
      // Delete associated data
      db.run(`DELETE FROM goal_thresholds WHERE goal_key = ?`, [goalKey])
      db.run(`DELETE FROM goal_progress WHERE goal_key = ?`, [goalKey])
      
      res.status(200).json({ success: true })
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
