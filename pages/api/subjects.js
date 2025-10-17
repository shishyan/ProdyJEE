import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const subjects = await prisma.subjects.findMany({
        include: {
          Chapters: {
            include: {
              SubTopics: true
            },
            orderBy: {
              chapter_id: 'asc'
            }
          }
        },
        orderBy: {
          subject_id: 'asc'
        }
      })
      res.status(200).json(subjects)
    } catch (error) {
      console.error('Error fetching subjects:', error)
      res.status(500).json({ error: 'Failed to fetch subjects' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}