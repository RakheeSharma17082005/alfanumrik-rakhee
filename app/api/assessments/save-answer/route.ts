import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SubmitAnswerSchema } from '@/lib/validation'

const VALID_OPTIONS = ['A', 'B', 'C', 'D']

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
    const { assessmentSessionId, mcqId, selectedOption } = SubmitAnswerSchema.parse(body)
    
    // Validate selectedOption format if provided
    if (selectedOption && !VALID_OPTIONS.includes(selectedOption)) {
      return NextResponse.json(
        { success: false, message: `Selected option must be one of ${VALID_OPTIONS.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify assessment is not already submitted
    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: assessmentSessionId },
    })

    if (!assessmentSession) {
      return NextResponse.json(
        { success: false, message: 'Assessment session not found' },
        { status: 404 }
      )
    }

    if (assessmentSession.submittedAt !== null) {
      return NextResponse.json(
        { success: false, message: 'Cannot modify answers in a submitted assessment' },
        { status: 409 }
      )
    }

    const mcq = await prisma.mCQ.findUnique({
      where: { id: mcqId },
    })

    if (!mcq) {
      return NextResponse.json(
        { success: false, message: 'MCQ not found' },
        { status: 404 }
      )
    }

    const isCorrect = selectedOption ? selectedOption === mcq.correctOption : null

    const studentAnswer = await prisma.studentAnswer.upsert({
      where: {
        assessmentSessionId_mcqId_userId: {
          assessmentSessionId,
          mcqId,
          userId: payload.userId,
        },
      },
      update: {
        selectedOption: selectedOption ?? undefined,
        isCorrect,
        updatedAt: new Date(),
      },
      create: {
        assessmentSessionId,
        mcqId,
        userId: payload.userId,
        selectedOption,
        isCorrect,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Answer saved successfully',
      data: studentAnswer,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error saving answer:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while saving answer' },
      { status: 500 }
    )
  }
}
