import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query
  const taskId = parseInt(id)

  if (req.method === 'PUT') {
    try {
      const { bucket_id, title, description, due_date, priority, progress, assigned_to } = req.body
      const task = await prisma.tasks.update({
        where: { task_id: taskId },
        data: { bucket_id, title, description, due_date, priority, progress, assigned_to }
      })
      res.status(200).json(task)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.tasks.delete({
        where: { task_id: taskId }
      })
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}