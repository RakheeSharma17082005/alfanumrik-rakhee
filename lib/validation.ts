import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const CreateChapterSchema = z.object({
  title: z.string().min(1, 'Chapter title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  subject: z.string().min(1, 'Subject is required'),
  classLevel: z.string().min(1, 'Class level is required'),
})

export const StartAssessmentSchema = z.object({
  chapterId: z.string().min(1, 'Chapter ID is required'),
})

export const SubmitAnswerSchema = z.object({
  assessmentSessionId: z.string(),
  mcqId: z.string(),
  selectedOption: z.string().nullable().optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type CreateChapterInput = z.infer<typeof CreateChapterSchema>
