/**
 * Export database to JSON for static export
 * Run with: node export-db-to-json.js
 * This generates a JSON file with all study plan data from the database
 * which will be used in static builds
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportDatabase() {
  try {
    console.log('📊 Exporting data from database...')

    // Fetch all study plans from database
    const studyPlans = await prisma.studyPlan.findMany({
      orderBy: [
        { subject: 'asc' },
        { chapter_id: 'asc' },
        { topic_id: 'asc' }
      ]
    })

    console.log(`✅ Found ${studyPlans.length} study plan records`)

    // Group by unique chapters
    const chapters = {}
    studyPlans.forEach(plan => {
      const chapterKey = `${plan.chapter_id}-${plan.chapter_name}`
      if (!chapters[chapterKey]) {
        chapters[chapterKey] = {
          chapter_id: plan.chapter_id,
          chapter_name: plan.chapter_name,
          subject: plan.subject,
          curriculum: plan.curriculum,
          grade: plan.grade,
          topics: []
        }
      }
      chapters[chapterKey].topics.push({
        topic_id: plan.topic_id,
        topic: plan.topic,
        unique_id: plan.unique_id,
        learning_status: plan.learning_status,
        learning_stage: plan.learning_stage,
        learning_proficiency: plan.learning_proficiency,
        progress_percentage: plan.progress_percentage,
        notes: plan.notes,
        target_date: plan.target_date
      })
    })

    console.log(`📚 Found ${Object.keys(chapters).length} unique chapters`)

    // Extract unique subjects
    const subjects = [...new Set(studyPlans.map(p => p.subject))]
    console.log(`📖 Found ${subjects.length} subjects: ${subjects.join(', ')}`)

    // Create export object
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalRecords: studyPlans.length,
      totalChapters: Object.keys(chapters).length,
      subjects,
      studyPlans,
      chapters: Object.values(chapters)
    }

    // Write to public directory so it can be accessed at runtime
    const outputPath = path.join(__dirname, 'public', 'database-export.json')
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2))

    console.log(`\n✨ Database exported to: ${outputPath}`)
    console.log(`📦 Export size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`)
    console.log('\n📋 Export Summary:')
    console.log(`   - Total Records: ${exportData.totalRecords}`)
    console.log(`   - Total Chapters: ${exportData.totalChapters}`)
    console.log(`   - Subjects: ${exportData.subjects.join(', ')}`)

    // Also save to TypeScript data file format
    const tsPath = path.join(__dirname, 'public', 'study-plans-data.js')
    fs.writeFileSync(tsPath, `module.exports = ${JSON.stringify(studyPlans, null, 2)};`)
    console.log(`\n✨ Also saved to: ${tsPath}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error exporting database:', error)
    process.exit(1)
  }
}

exportDatabase()
