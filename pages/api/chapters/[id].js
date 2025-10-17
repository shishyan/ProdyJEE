import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query
  const chapterId = parseInt(id)

  if (req.method === 'PUT') {
    try {
      const { name, unit, cbse_weightage, jee_weightage } = req.body
      const chapter = await prisma.chapters.update({
        where: { chapter_id: chapterId },
        data: {
          ...(name && { name }),
          ...(unit !== undefined && { unit }),
          ...(cbse_weightage !== undefined && { cbse_weightage: parseInt(cbse_weightage) }),
          ...(jee_weightage !== undefined && { jee_weightage: parseInt(jee_weightage) })
        }
      })
      res.status(200).json(chapter)
    } catch (error) {
      console.error('Update chapter error:', error)
      res.status(500).json({ error: 'Failed to update chapter' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // First delete all subtopics in this chapter
      await prisma.subTopics.deleteMany({
        where: { chapter_id: chapterId }
      })

      // Then delete the chapter
      await prisma.chapters.delete({
        where: { chapter_id: chapterId }
      })

      res.status(200).json({ message: 'Chapter and its subtopics deleted successfully' })
    } catch (error) {
      console.error('Delete chapter error:', error)
      res.status(500).json({ error: 'Failed to delete chapter' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}