import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { generateToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RegisterSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input with Zod
    const { email, password, fullName } = RegisterSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: {
          userId: user.id,
          email: user.email,
          fullName: user.fullName,
          token,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration', error: String(error) },
      { status: 500 }
    )
  } finally {
    // Prisma singleton - don't disconnect on every request
  }
}
