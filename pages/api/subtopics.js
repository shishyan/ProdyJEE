import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const subtopics = await prisma.subTopics.findMany({
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
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}