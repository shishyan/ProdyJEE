import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const studyPlans = await prisma.studyPlan.findMany({
        orderBy: [
          { subject: 'asc' },
          { chapter_id: 'asc' },
          { topic_id: 'asc' }
        ]
      })
      res.status(200).json(studyPlans)
    } catch (error) {
      console.error('Fetch study plans error:', error)
      res.status(500).json({ error: 'Failed to fetch study plans' })
    }
  } else if (req.method === 'POST') {
    try {
      const {
        unique_id,
        curriculum,
        grade,
        subject,
        chapter_id,
        chapter_name,
        topic_id,
        topic,
        target_date,
        learning_status,
        learning_stage,
        learning_proficiency,
        progress_percentage,
        notes
      } = req.body

      // Generate unique_id if not provided
      const finalUniqueId = unique_id || `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const studyPlan = await prisma.studyPlan.create({
        data: {
          unique_id: finalUniqueId,
          curriculum,
          grade: parseInt(grade),
          subject,
          chapter_id,
          chapter_name,
          topic_id,
          topic,
          target_date: target_date ? new Date(target_date) : new Date('2026-01-01'),
          learning_status: learning_status || 'In Queue',
          learning_stage: learning_stage || 'Initiated',
          learning_proficiency: learning_proficiency || 'Novice',
          progress_percentage: parseInt(progress_percentage) || 0,
          notes
        }
      })

      res.status(201).json(studyPlan)
    } catch (error) {
      console.error('Create study plan error:', error)
      res.status(500).json({ error: 'Failed to create study plan' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}