const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const prisma = new PrismaClient()

async function importGrade6() {
  try {
    console.log('🚀 Starting Grade 6 CBSE import...\n')

    // Import Grade 6 CBSE from CSV
    console.log('📥 Importing Grade 6 CBSE from Grade6-CBSE.csv...')
    const csvPath = path.join(__dirname, 'Grade6-CBSE.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    let grade6Count = 0
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
        target_date: new Date('2026-06-30'), // Default target date for Grade 6
        learning_status: columns[9].trim() || 'In Queue',
        learning_stage: columns[10].trim() || 'Initiated',
        learning_proficiency: columns[11].trim() || 'Novice',
        progress_percentage: parseInt(columns[12].trim()) || 0,
        notes: columns[13]?.trim() || ''
      }

      try {
        await prisma.studyPlan.create({ data: record })
        grade6Count++
        
        if (grade6Count % 10 === 0) {
          process.stdout.write(`\rImported ${grade6Count} records...`)
        }
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`\n⚠️  Skipping duplicate: ${record.unique_id}`)
          continue
        }
        throw error
      }
    }
    console.log(`\n✅ Imported ${grade6Count} Grade 6 CBSE records\n`)

    // Verify import
    console.log('🔍 Verifying complete database...')
    const totalRecords = await prisma.studyPlan.count()
    
    const grade6CBSE = await prisma.studyPlan.count({
      where: { curriculum: 'CBSE', grade: 6 }
    })
    
    const grade11CBSE = await prisma.studyPlan.count({
      where: { curriculum: 'CBSE', grade: 11 }
    })
    
    const grade11JEE = await prisma.studyPlan.count({
      where: { curriculum: 'JEE', grade: 11 }
    })

    // Get subjects for Grade 6
    const grade6Subjects = await prisma.studyPlan.findMany({
      where: { grade: 6 },
      select: { subject: true },
      distinct: ['subject']
    })

    console.log('\n📊 Complete Database Summary:')
    console.log('═══════════════════════════════════════')
    console.log(`Total records: ${totalRecords}`)
    console.log(`\nGrade 6 CBSE: ${grade6CBSE} records`)
    console.log(`  Subjects: ${grade6Subjects.map(s => s.subject).join(', ')}`)
    console.log(`\nGrade 11 CBSE: ${grade11CBSE} records`)
    console.log(`Grade 11 JEE:  ${grade11JEE} records`)
    console.log('═══════════════════════════════════════')
    console.log('\n✅ Grade 6 import completed successfully!')

  } catch (error) {
    console.error('❌ Error during import:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importGrade6()
