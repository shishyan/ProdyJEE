import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { unique_id } = req.query

  if (req.method === 'GET') {
    try {
      const studyPlan = await prisma.studyPlan.findUnique({
        where: { unique_id }
      })

      if (!studyPlan) {
        return res.status(404).json({ error: 'Study plan not found' })
      }

      res.status(200).json(studyPlan)
    } catch (error) {
      console.error('Fetch study plan error:', error)
      res.status(500).json({ error: 'Failed to fetch study plan' })
    }
  } else if (req.method === 'PUT') {
    try {
      const {
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
        notes,
        sub_topics
      } = req.body

      const studyPlan = await prisma.studyPlan.update({
        where: { unique_id },
        data: {
          ...(curriculum && { curriculum }),
          ...(grade !== undefined && { grade: parseInt(grade) }),
          ...(subject && { subject }),
          ...(chapter_id && { chapter_id }),
          ...(chapter_name && { chapter_name }),
          ...(topic_id && { topic_id }),
          ...(topic && { topic }),
          ...(target_date && { target_date: new Date(target_date) }),
          ...(learning_status && { learning_status }),
          ...(learning_stage && { learning_stage }),
          ...(learning_proficiency && { learning_proficiency }),
          ...(progress_percentage !== undefined && { progress_percentage: parseInt(progress_percentage) }),
          ...(notes !== undefined && { notes }),
          ...(sub_topics !== undefined && { sub_topics })
        }
      })

      res.status(200).json(studyPlan)
    } catch (error) {
      console.error('Update study plan error:', error)
      res.status(500).json({ error: 'Failed to update study plan' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.studyPlan.delete({
        where: { unique_id }
      })

      res.status(204).end()
    } catch (error) {
      console.error('Delete study plan error:', error)
      res.status(500).json({ error: 'Failed to delete study plan' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}