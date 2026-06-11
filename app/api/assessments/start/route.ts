import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StartAssessmentSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    // Validate input with Zod
    const { chapterId } = StartAssessmentSchema.parse(body)

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { mcqs: true },
    })

    if (!chapter) {
      return NextResponse.json(
        { success: false, message: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Delete any existing unsubmitted sessions for this chapter (allow fresh start)
    const existingSession = await prisma.assessmentSession.findFirst({
      where: {
        userId: payload.userId,
        chapterId,
        submittedAt: null, // Only unsubmitted sessions
      },
    })

    if (existingSession) {
      // Delete the old session and its answers to allow a fresh start
      await prisma.studentAnswer.deleteMany({
        where: {
          assessmentSessionId: existingSession.id,
        },
      })
      await prisma.assessmentSession.delete({
        where: {
          id: existingSession.id,
        },
      })
    }

    const assessmentSession = await prisma.assessmentSession.create({
      data: {
        userId: payload.userId,
        chapterId,
        totalQuestions: chapter.mcqs.length,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Assessment session started',
      data: assessmentSession,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error starting assessment:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while starting assessment' },
      { status: 500 }
    )
  } finally {
    // Prisma singleton - don't disconnect on every request
  }
}
