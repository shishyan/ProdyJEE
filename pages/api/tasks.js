import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.tasks.findMany({
        include: {
          Buckets: { include: { Plans: true } },
          TaskLabels: { include: { Labels: true } },
          Comments: true
        }
      })
      res.status(200).json(tasks)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' })
    }
  } else if (req.method === 'POST') {
    try {
      const { bucket_id, title, description, due_date, priority, progress, assigned_to } = req.body
      const task = await prisma.tasks.create({
        data: { bucket_id, title, description, due_date, priority, progress, assigned_to }
      })
      res.status(201).json(task)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}