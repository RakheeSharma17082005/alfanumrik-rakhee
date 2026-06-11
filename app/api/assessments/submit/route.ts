import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const SubmitAssessmentSchema = z.object({
  assessmentSessionId: z.string().min(1, 'Assessment session ID is required'),
})

const MAX_ASSESSMENT_DURATION = 30 * 60 // 30 minutes in seconds

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
    const { assessmentSessionId } = SubmitAssessmentSchema.parse(body)

    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: assessmentSessionId },
      include: {
        studentAnswers: true,
      },
    })

    if (!assessmentSession) {
      return NextResponse.json(
        { success: false, message: 'Assessment session not found' },
        { status: 404 }
      )
    }

    if (assessmentSession.userId !== payload.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access to this assessment' },
        { status: 403 }
      )
    }

    // Prevent re-submission
    if (assessmentSession.submittedAt !== null) {
      return NextResponse.json(
        { success: false, message: 'Assessment already submitted' },
        { status: 409 }
      )
    }

    // Validate server-side time (check if exceeded 30 minutes)
    const duration = Math.floor((new Date().getTime() - assessmentSession.startedAt.getTime()) / 1000)
    if (duration > MAX_ASSESSMENT_DURATION) {
      return NextResponse.json(
        { success: false, message: 'Assessment time limit exceeded' },
        { status: 410 }
      )
    }

    const correctAnswers = assessmentSession.studentAnswers.filter(
      answer => answer.isCorrect === true
    ).length

    const skippedQuestions = assessmentSession.studentAnswers.filter(
      answer => answer.selectedOption === null
    ).length

    const answeredQuestions = assessmentSession.studentAnswers.length - skippedQuestions
    const totalQuestions = assessmentSession.totalQuestions || 20
    const score = correctAnswers
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0

    const endTime = new Date()

    const updatedSession = await prisma.assessmentSession.update({
      where: { id: assessmentSessionId },
      data: {
        submittedAt: endTime,
        duration,
        correctAnswers,
        score: percentage,
        percentage,
        accuracy,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        ...updatedSession,
        summary: {
          correctAnswers,
          skippedQuestions,
          answeredQuestions,
          totalQuestions,
          score,
          percentage,
          accuracy,
          duration,
          serverDuration: duration, // Server-validated duration
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error submitting assessment:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while submitting assessment' },
      { status: 500 }
    )
  } finally {
    // Prisma singleton - don't disconnect on every request
  }
}
