import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const plans = await prisma.plans.findMany({
        include: {
          Buckets: {
            include: {
              Tasks: {
                include: {
                  TaskLabels: { include: { Labels: true } },
                  Comments: true
                }
              }
            }
          }
        }
      })
      res.status(200).json(plans)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plans' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description } = req.body
      const plan = await prisma.plans.create({
        data: { name, description }
      })
      res.status(201).json(plan)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create plan' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}