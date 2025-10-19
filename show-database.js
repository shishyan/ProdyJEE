const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function showCompleteDatabase() {
  try {
    console.log('═══════════════════════════════════════════════════')
    console.log('         PRODYJE STUDY PLAN DATABASE')
    console.log('═══════════════════════════════════════════════════\n')

    // Get all distinct grades
    const allPlans = await prisma.studyPlan.findMany({
      select: {
        grade: true,
        curriculum: true,
        subject: true
      }
    })

    // Group by grade and curriculum
    const summary = {}
    allPlans.forEach(plan => {
      const key = `Grade ${plan.grade} (${plan.curriculum})`
      if (!summary[key]) {
        summary[key] = { count: 0, subjects: new Set() }
      }
      summary[key].count++
      summary[key].subjects.add(plan.subject)
    })

    // Display summary
    console.log('📊 DATABASE SUMMARY:\n')
    Object.entries(summary).sort().forEach(([key, data]) => {
      console.log(`${key}: ${data.count} records`)
      console.log(`   Subjects: ${Array.from(data.subjects).join(', ')}\n`)
    })

    console.log('═══════════════════════════════════════════════════')
    console.log(`TOTAL RECORDS: ${allPlans.length}`)
    console.log('═══════════════════════════════════════════════════')

    // Show grade values for frontend
    const distinctGrades = await prisma.studyPlan.findMany({
      select: { grade: true },
      distinct: ['grade']
    })

    console.log('\n🎯 AVAILABLE GRADES FOR FRONTEND:')
    distinctGrades.sort((a, b) => a.grade - b.grade).forEach(g => {
      console.log(`   - Grade ${g.grade}`)
    })

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

showCompleteDatabase()
