import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { chapter_id } = req.query
      const whereClause = chapter_id ? { chapter_id: parseInt(chapter_id) } : {}
      const subtopics = await prisma.subTopics.findMany({
        where: whereClause,
        include: { Chapters: { include: { Subjects: true } } }
      })
      res.status(200).json(subtopics)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subtopics' })
    }
  } else if (req.method === 'POST') {
    try {
      const { chapter_id, name, status, time_spent_minutes, mastery_level, is_high_priority } = req.body
      const subtopic = await prisma.subTopics.create({
        data: { chapter_id, name, status, time_spent_minutes, mastery_level, is_high_priority }
      })
      res.status(201).json(subtopic)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create subtopic' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { subtopic_id } = req.query
      const { status, time_spent_minutes, mastery_level, is_high_priority } = req.body
      const subtopic = await prisma.subTopics.update({
        where: { subtopic_id: parseInt(subtopic_id) },
        data: { status, time_spent_minutes, mastery_level, is_high_priority }
      })
      res.status(200).json(subtopic)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update subtopic' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}