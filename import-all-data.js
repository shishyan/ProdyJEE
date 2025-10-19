const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const prisma = new PrismaClient()

async function importAllData() {
  try {
    console.log('🚀 Starting data import...\n')

    // Step 1: Clear existing data
    console.log('🗑️  Clearing existing StudyPlan data...')
    await prisma.studyPlan.deleteMany({})
    console.log('✅ Cleared existing data\n')

    // Step 2: Import Grade 11 CBSE from CSV
    console.log('📥 Importing Grade 11 CBSE from ProdyJEE(JEE).csv...')
    const csvPath = path.join(__dirname, 'ProdyJEE(JEE).csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    let cbseCount = 0
    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i]
      const columns = line.split(',')
      
      if (columns.length < 13) continue // Skip incomplete rows
      
      const record = {
        unique_id: columns[0].trim(),
        curriculum: columns[1].trim(),
        grade: parseInt(columns[2].trim()),
        subject: columns[3].trim(),
        chapter_id: columns[4].trim(),
        chapter_name: columns[5].trim(),
        topic_id: columns[6].trim(),
        topic: columns[7].trim(),
        target_date: columns[8].trim() ? new Date(columns[8].trim().split('/').reverse().join('-')) : new Date(),
        learning_status: columns[9].trim(),
        learning_stage: columns[10].trim(),
        learning_proficiency: columns[11].trim(),
        progress_percentage: parseInt(columns[12].trim()) || 0,
        notes: columns[13]?.trim() || ''
      }

      // Only import CBSE Grade 11
      if (record.curriculum === 'CBSE' && record.grade === 11) {
        await prisma.studyPlan.create({ data: record })
        cbseCount++
      }
    }
    console.log(`✅ Imported ${cbseCount} Grade 11 CBSE records\n`)

    // Step 3: Import Grade 11 JEE from database-export.json
    console.log('📥 Importing Grade 11 JEE from database-export.json...')
    const jsonPath = path.join(__dirname, 'public', 'database-export.json')
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    
    let jeeCount = 0
    for (const plan of jsonContent.studyPlans) {
      if (plan.curriculum === 'JEE' && plan.grade === '11') {
        await prisma.studyPlan.create({
          data: {
            unique_id: plan.unique_id,
            curriculum: plan.curriculum,
            grade: parseInt(plan.grade),
            subject: plan.subject,
            chapter_id: plan.chapter_id,
            chapter_name: plan.chapter_name,
            topic_id: plan.topic_id,
            topic: plan.topic,
            target_date: plan.target_date ? new Date(plan.target_date) : new Date(),
            learning_status: plan.learning_status,
            learning_stage: plan.learning_stage,
            learning_proficiency: plan.learning_proficiency,
            progress_percentage: plan.progress_percentage || 0,
            notes: plan.notes || ''
          }
        })
        jeeCount++
      }
    }
    console.log(`✅ Imported ${jeeCount} Grade 11 JEE records\n`)

    // Step 4: Verify import
    console.log('🔍 Verifying import...')
    const totalRecords = await prisma.studyPlan.count()
    
    const cbseGrade11 = await prisma.studyPlan.count({
      where: { curriculum: 'CBSE', grade: 11 }
    })
    
    const jeeGrade11 = await prisma.studyPlan.count({
      where: { curriculum: 'JEE', grade: 11 }
    })

    console.log('\n📊 Import Summary:')
    console.log('═══════════════════════════════════════')
    console.log(`Total records in database: ${totalRecords}`)
    console.log(`Grade 11 CBSE: ${cbseGrade11} records`)
    console.log(`Grade 11 JEE:  ${jeeGrade11} records`)
    console.log('═══════════════════════════════════════')
    console.log('\n✅ Data import completed successfully!')

  } catch (error) {
    console.error('❌ Error during import:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importAllData()
