// Test script to initialize the goals database
const db = require('./lib/db')

console.log('🔄 Initializing database...')
console.log('⏳ Please wait for tables to be created...\n')

// Wait for database initialization
setTimeout(() => {
  console.log('📊 Checking goals...')
  
  db.all('SELECT COUNT(*) as count FROM goals', [], (err, rows) => {
  if (err) {
    console.error('❌ Error:', err)
  } else {
    console.log(`✅ Total goals in database: ${rows[0].count}`)
  }
  
  // Get breakdown by category
  db.all(`
    SELECT category, COUNT(*) as count 
    FROM goals 
    GROUP BY category
  `, [], (err, rows) => {
    if (err) {
      console.error('❌ Error:', err)
    } else {
      console.log('\n📋 Goals by category:')
      rows.forEach(row => {
        console.log(`   ${row.category}: ${row.count} goals`)
      })
    }
    
    // Sample goal
    db.get(`
      SELECT g.phrase, g.metric, g.category,
             GROUP_CONCAT(t.star_count || ' star: ' || t.range_description, ', ') as thresholds
      FROM goals g
      LEFT JOIN goal_thresholds t ON g.goal_key = t.goal_key
      WHERE g.category = 'academic'
      GROUP BY g.id
      LIMIT 1
    `, [], (err, row) => {
      if (err) {
        console.error('❌ Error:', err)
      } else {
        console.log('\n🎯 Sample goal:')
        console.log(`   Phrase: ${row.phrase}`)
        console.log(`   Metric: ${row.metric}`)
        console.log(`   Category: ${row.category}`)
        console.log(`   Star Thresholds: ${row.thresholds}`)
      }
      
      db.close()
      console.log('\n✅ Database test complete!')
    })
  })
})
}, 2000) // Wait 2 seconds for database initialization
