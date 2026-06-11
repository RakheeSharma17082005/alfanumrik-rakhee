import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = _req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id },
      include: { chapter: true },
    })

    if (!assessmentSession) {
      return NextResponse.json(
        { message: 'Assessment not found' },
        { status: 404 }
      )
    }

    if (assessmentSession.userId !== payload.userId) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      )
    }

    // Fetch MCQs with student answers for this assessment
    const studentAnswers = await prisma.studentAnswer.findMany({
      where: { assessmentSessionId: id },
      include: {
        mcq: true,
      },
      orderBy: {
        mcq: {
          order: 'asc',
        },
      },
    })

    // Get all MCQs for this chapter (for exam view)
    const allMCQs = await prisma.mCQ.findMany({
      where: { chapterId: assessmentSession.chapterId },
      orderBy: { order: 'asc' },
    })

    // Format response with detailed question-answer breakdown
    const detailedResults = studentAnswers.map((answer) => ({
      questionNumber: answer.mcq.order,
      question: answer.mcq.question,
      options: {
        A: answer.mcq.optionA,
        B: answer.mcq.optionB,
        C: answer.mcq.optionC,
        D: answer.mcq.optionD,
      },
      userAnswer: answer.selectedOption,
      correctAnswer: answer.mcq.correctOption,
      isCorrect: answer.isCorrect,
      explanation: answer.mcq.explanation,
      difficulty: answer.mcq.difficulty,
    }))

    return NextResponse.json({
      assessmentSession,
      questions: allMCQs,
      detailedResults,
    })
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
  // Prisma singleton - don't disconnect on every request
}
