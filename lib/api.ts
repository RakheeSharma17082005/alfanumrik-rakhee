export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse(message: string, error?: string): ApiResponse {
  return {
    success: false,
    message,
    error,
  }
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchApi<T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred')
  }

  return data
}
