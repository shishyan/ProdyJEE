import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { task_id } = req.query
    try {
      const comments = await prisma.comments.findMany({
        where: { task_id: parseInt(task_id) },
        orderBy: { created_at: 'asc' }
      })
      res.status(200).json(comments)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' })
    }
  } else if (req.method === 'POST') {
    try {
      const { task_id, content } = req.body
      const comment = await prisma.comments.create({
        data: { task_id, content }
      })
      res.status(201).json(comment)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}