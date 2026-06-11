import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. This is required for security.')
}
const JWT_SECRET = process.env.JWT_SECRET

export interface JWTPayload {
  userId: string
  email: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('token')?.value || null
}

export function setTokenCookie(_token: string) {
  // Note: This should be called in a server action or API route
  // Client-side code should use localStorage
}
