import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get all plans with their buckets and tasks
      const plans = await prisma.plans.findMany({
        include: {
          Buckets: {
            include: {
              Tasks: {
                include: {
                  Comments: true,
                  TaskLabels: {
                    include: {
                      Labels: true
                    }
                  },
                  SubTasks: true
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      // Get subjects with chapters and subtopics
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

      // Create a plan for each subject if it doesn't exist
      for (const subject of subjects) {
        const existingPlan = plans.find(p => p.name === subject.name)
        if (!existingPlan) {
          const newPlan = await prisma.plans.create({
            data: {
              name: subject.name,
              description: `${subject.name} Study Plan`
            }
          })

          // Create default buckets for the new plan
          await prisma.buckets.createMany({
            data: [
              { plan_id: newPlan.plan_id, name: 'Backlog', order: 0 },
              { plan_id: newPlan.plan_id, name: 'To Do', order: 1 },
              { plan_id: newPlan.plan_id, name: 'In Progress', order: 2 },
              { plan_id: newPlan.plan_id, name: 'Done', order: 3 },
              { plan_id: newPlan.plan_id, name: 'Revision', order: 4 }
            ]
          })
        }
      }

      // Get updated plans
      const updatedPlans = await prisma.plans.findMany({
        include: {
          Buckets: {
            include: {
              Tasks: {
                include: {
                  Comments: true,
                  TaskLabels: {
                    include: {
                      Labels: true
                    }
                  },
                  SubTasks: true
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      res.status(200).json({
        plans: updatedPlans,
        subjects: subjects
      })
    } catch (error) {
      console.error('Error fetching plans and subjects:', error)
      res.status(500).json({ error: 'Failed to fetch data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}