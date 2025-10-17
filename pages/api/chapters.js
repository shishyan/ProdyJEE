import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { subject_id, name, unit, cbse_weightage, jee_weightage } = req.body

      const chapter = await prisma.chapters.create({
        data: {
          subject_id: parseInt(subject_id),
          name,
          unit: unit || '',
          cbse_weightage: parseInt(cbse_weightage) || 5,
          jee_weightage: parseInt(jee_weightage) || 5
        }
      })

      res.status(201).json(chapter)
    } catch (error) {
      console.error('Create chapter error:', error)
      res.status(500).json({ error: 'Failed to create chapter' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}