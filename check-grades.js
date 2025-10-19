const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkGrades() {
  try {
    // Get distinct grades from StudyPlan table
    const studyPlans = await prisma.studyPlan.findMany({
      select: {
        grade: true
      },
      distinct: ['grade']
    })
    
    console.log('=== DISTINCT GRADES IN STUDYPLAN TABLE ===')
    studyPlans.forEach(plan => {
      console.log(`Grade: "${plan.grade}"`)
    })
    
    // Count records per grade
    const allPlans = await prisma.studyPlan.findMany({
      select: {
        grade: true,
        curriculum: true
      }
    })
    
    const gradeCounts = {}
    allPlans.forEach(plan => {
      const key = `Grade ${plan.grade} (${plan.curriculum})`
      gradeCounts[key] = (gradeCounts[key] || 0) + 1
    })
    
    console.log('\n=== RECORD COUNTS BY GRADE & CURRICULUM ===')
    Object.entries(gradeCounts).forEach(([key, count]) => {
      console.log(`${key}: ${count} records`)
    })
    
    console.log(`\nTotal records in StudyPlan table: ${allPlans.length}`)
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkGrades()
