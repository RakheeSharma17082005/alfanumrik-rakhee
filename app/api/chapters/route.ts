import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { mcqs: true },
        },
      },
    })

    const chaptersWithMCQCount = chapters.map(chapter => ({
      ...chapter,
      mcqCount: chapter._count.mcqs,
      _count: undefined,
    }))

    return NextResponse.json({
      success: true,
      message: 'Chapters retrieved successfully',
      data: chaptersWithMCQCount,
    })
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching chapters' },
      { status: 500 }
    )
  } finally {
    // Prisma singleton - don't disconnect on every request
  }
}
