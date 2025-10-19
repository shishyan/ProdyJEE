const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function importGrade6Data() {
  try {
    console.log('Starting to import Grade 6 CBSE data...')
    
    const csvFilePath = path.join(__dirname, 'ProdyJEE(CBSE-6).csv')
    const csvData = fs.readFileSync(csvFilePath, 'utf-8')
    
    const lines = csvData.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',')
    
    console.log(`Found ${lines.length - 1} records to import`)
    
    let imported = 0
    let skipped = 0
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      
      if (values.length < headers.length) {
        console.log(`Skipping line ${i}: incomplete data`)
        skipped++
        continue
      }
      
      const record = {
        unique_id: values[0].trim(),
        curriculum: values[1].trim(),
        grade: parseInt(values[2].trim()),
        subject: values[3].trim(),
        chapter_id: values[4].trim(),
        chapter_name: values[5].trim(),
        topic_id: values[6].trim(),
        topic: values[7].trim(),
        target_date: values[8].trim() ? new Date(values[8].trim()) : new Date(),
        learning_status: values[9].trim() || 'In Queue',
        learning_stage: values[10].trim() || 'Initiated',
        learning_proficiency: values[11].trim() || 'Novice',
        progress_percentage: parseInt(values[12].trim()) || 0,
        notes: values[13]?.trim() || null
      }
      
      try {
        await prisma.studyPlan.upsert({
          where: { unique_id: record.unique_id },
          update: record,
          create: record
        })
        imported++
        if (imported % 10 === 0) {
          console.log(`Imported ${imported} records...`)
        }
      } catch (error) {
        console.error(`Error importing ${record.unique_id}:`, error.message)
        skipped++
      }
    }
    
    console.log('\n✅ Import complete!')
    console.log(`   Imported: ${imported}`)
    console.log(`   Skipped: ${skipped}`)
    
  } catch (error) {
    console.error('Error importing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importGrade6Data()
