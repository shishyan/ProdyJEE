import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { task_id } = req.query
    try {
      const subtasks = await prisma.subTasks.findMany({
        where: { task_id: parseInt(task_id) },
        orderBy: { created_at: 'asc' }
      })
      res.status(200).json(subtasks)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subtasks' })
    }
  } else if (req.method === 'POST') {
    try {
      const { task_id, title } = req.body
      const subtask = await prisma.subTasks.create({
        data: { task_id, title }
      })
      res.status(201).json(subtask)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create subtask' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { subtask_id, completed } = req.body
      const subtask = await prisma.subTasks.update({
        where: { subtask_id },
        data: { completed }
      })
      res.status(200).json(subtask)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update subtask' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}