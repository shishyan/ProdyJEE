const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding with CSV data...')

  // Read CSV file
  const csvFilePath = path.join(__dirname, '..', 'ProdyJEE(JEE).csv')
  const csvData = fs.readFileSync(csvFilePath, 'utf8')

  // Parse CSV data
  const lines = csvData.trim().split('\n')
  const headers = lines[0].split(',')
  const rows = lines.slice(1).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || ''
    })
    return obj
  })

  console.log(`Parsed ${rows.length} rows from CSV`)

  // Process each row and create StudyPlan records
  for (const row of rows) {
    const studyPlanData = {
      unique_id: row['Unique ID'],
      curriculum: row['Curriculum'],
      grade: parseInt(row['Grade']),
      subject: row['Subject'],
      chapter_id: row['Chapter ID'],
      chapter_name: row['Chapter Name'].trim(),
      topic_id: row['Topic ID'],
      topic: row['Topic'].trim(),
      target_date: new Date(row['Target Date']),
      learning_status: row['Learning Status'],
      learning_stage: row['Learning Stage'],
      learning_proficiency: row['Learning Proficiency'],
      progress_percentage: parseInt(row['Progress %']) || 0,
      notes: row['Notes'] || null
    }

    await prisma.studyPlan.upsert({
      where: { unique_id: studyPlanData.unique_id },
      update: studyPlanData,
      create: studyPlanData
    })
  }

  console.log('Database seeding completed successfully!')
}

main()
  .catch(e => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
