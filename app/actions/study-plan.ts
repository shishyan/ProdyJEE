import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Server Action for updating study plan
export async function updateStudyPlan(formData: FormData) {
  'use server'

  try {
    const unique_id = formData.get('unique_id') as string
    const learning_status = formData.get('learning_status') as string
    const learning_stage = formData.get('learning_stage') as string
    const learning_proficiency = formData.get('learning_proficiency') as string
    const progress_percentage = parseInt(formData.get('progress_percentage') as string) || 0
    const target_date = formData.get('target_date') as string
    const notes = formData.get('notes') as string
    const sub_topics = formData.get('sub_topics') as string

    const updateData: any = {
      learning_status,
      learning_stage,
      learning_proficiency,
      progress_percentage,
      notes,
      sub_topics,
    }

    if (target_date) {
      updateData.target_date = new Date(target_date)
    }

    await prisma.studyPlan.update({
      where: { unique_id },
      data: updateData,
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Update study plan error:', error)
    return { success: false, error: 'Failed to update study plan' }
  }
}

// Server Action for creating study plan
export async function createStudyPlan(formData: FormData) {
  'use server'

  try {
    const unique_id = formData.get('unique_id') as string
    const curriculum = formData.get('curriculum') as string
    const grade = parseInt(formData.get('grade') as string)
    const subject = formData.get('subject') as string
    const chapter_id = formData.get('chapter_id') as string
    const chapter_name = formData.get('chapter_name') as string
    const topic_id = formData.get('topic_id') as string
    const topic = formData.get('topic') as string
    const target_date = formData.get('target_date') as string
    const learning_status = formData.get('learning_status') as string || 'In Queue'
    const learning_stage = formData.get('learning_stage') as string || 'Initiated'
    const learning_proficiency = formData.get('learning_proficiency') as string || 'Novice'
    const progress_percentage = parseInt(formData.get('progress_percentage') as string) || 0
    const notes = formData.get('notes') as string

    const studyPlan = await prisma.studyPlan.create({
      data: {
        unique_id,
        curriculum,
        grade,
        subject,
        chapter_id,
        chapter_name,
        topic_id,
        topic,
        target_date: new Date(target_date || new Date().toISOString().split('T')[0]),
        learning_status,
        learning_stage,
        learning_proficiency,
        progress_percentage,
        notes,
      },
    })

    revalidatePath('/')
    return { success: true, data: studyPlan }
  } catch (error) {
    console.error('Create study plan error:', error)
    return { success: false, error: 'Failed to create study plan' }
  }
}

// Server Action for fetching study plans
export async function getStudyPlans() {
  'use server'

  try {
    const studyPlans = await prisma.studyPlan.findMany({
      orderBy: [
        { subject: 'asc' },
        { chapter_id: 'asc' },
        { topic_id: 'asc' }
      ]
    })
    return { success: true, data: studyPlans }
  } catch (error) {
    console.error('Fetch study plans error:', error)
    return { success: false, error: 'Failed to fetch study plans' }
  }
}