import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
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

    // Get pagination parameters from query string
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const pageSize = 50 // Limit per page
    const skip = (page - 1) * pageSize

    const assessmentSessions = await prisma.assessmentSession.findMany({
      where: { userId: payload.userId },
      include: {
        studentAnswers: true,
      },
      orderBy: { submittedAt: 'desc' },
      take: pageSize,
      skip,
    })

    // Calculate overall statistics
    const totalAttempts = assessmentSessions.length
    const submittedAttempts = assessmentSessions.filter(s => s.submittedAt).length

    let totalCorrectAnswers = 0
    let totalScore = 0
    let bestScore = 0
    let totalAnsweredQuestions = 0
    let totalSkippedQuestions = 0

    assessmentSessions.forEach(session => {
      if (session.submittedAt) {
        totalCorrectAnswers += session.correctAnswers || 0
        totalScore += session.score || 0
        bestScore = Math.max(bestScore, session.score || 0)

        const skipped = session.studentAnswers.filter(a => a.selectedOption === null).length
        totalSkippedQuestions += skipped
        totalAnsweredQuestions += session.studentAnswers.length - skipped
      }
    })

    const averageScore = submittedAttempts > 0 ? totalScore / submittedAttempts : 0
    const totalIncorrect = totalAnsweredQuestions - totalCorrectAnswers

    // Get performance by chapter
    const chapters = await prisma.chapter.findMany()

    const performanceByChapter = chapters.map(chapter => {
      const chapterSessions = assessmentSessions.filter(
        s => s.chapterId === chapter.id && s.submittedAt
      )

      const chapterCorrect = chapterSessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0)
      const chapterAnswered = chapterSessions.reduce((sum, s) => sum + (s.studentAnswers.length - s.studentAnswers.filter(a => a.selectedOption === null).length), 0)
      const chapterAccuracy = chapterAnswered > 0 ? (chapterCorrect / chapterAnswered) * 100 : 0

      return {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        attempts: chapterSessions.length,
        correctAnswers: chapterCorrect,
        totalQuestions: 5,
        accuracy: chapterAccuracy,
        bestScore: Math.max(...chapterSessions.map(s => s.score || 0), 0),
      }
    })

    const overallAccuracy = totalAnsweredQuestions > 0 ? (totalCorrectAnswers / totalAnsweredQuestions) * 100 : 0

    return NextResponse.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        totalAttempts,
        submittedAttempts,
        totalCorrectAnswers,
        totalIncorrectAnswers: totalIncorrect,
        totalSkippedQuestions,
        overallAccuracy,
        averageScore,
        bestScore,
        chapters: performanceByChapter,
        recentAttempts: assessmentSessions
          .filter(s => s.submittedAt)
          .slice(0, 5),
        pagination: {
          page,
          pageSize,
          skip,
          hasMore: assessmentSessions.length === pageSize,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching dashboard data' },
      { status: 500 }
    )
  }
}
