import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        content: {
          orderBy: { order: 'asc' },
        },
        mcqs: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!chapter) {
      return NextResponse.json(
        { success: false, message: 'Chapter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Chapter retrieved successfully',
      data: chapter,
    })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching chapter' },
      { status: 500 }
    )
  } finally {
    // Prisma singleton - don't disconnect on every request
  }
}
