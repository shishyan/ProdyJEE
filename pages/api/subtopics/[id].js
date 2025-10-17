import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query
  const subtopicId = parseInt(id)

  if (req.method === 'PUT') {
    try {
      const { name, status, time_spent_minutes, mastery_level, is_high_priority, due_date } = req.body
      const subtopic = await prisma.subTopics.update({
        where: { subtopic_id: subtopicId },
        data: {
          ...(name && { name }),
          ...(status && { status }),
          ...(time_spent_minutes !== undefined && { time_spent_minutes: parseInt(time_spent_minutes) }),
          ...(mastery_level !== undefined && { mastery_level: parseInt(mastery_level) }),
          ...(is_high_priority !== undefined && { is_high_priority: Boolean(is_high_priority) }),
          ...(due_date !== undefined && { due_date: due_date ? new Date(due_date) : null })
        }
      })
      res.status(200).json(subtopic)
    } catch (error) {
      console.error('Update subtopic error:', error)
      res.status(500).json({ error: 'Failed to update subtopic' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.subTopics.delete({
        where: { subtopic_id: subtopicId }
      })
      res.status(204).end()
    } catch (error) {
      console.error('Delete subtopic error:', error)
      res.status(500).json({ error: 'Failed to delete subtopic' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}