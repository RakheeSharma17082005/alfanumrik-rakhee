'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface MCQ {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  explanation: string
}

export default function AssessmentPage() {
  const router = useRouter()
  const params = useParams()
  const assessmentSessionId = params.id as string

  const [questions, setQuestions] = useState<MCQ[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, string | null>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Load assessment data
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/auth/login')
          return
        }

        const response = await fetch(`/api/assessments/${assessmentSessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load assessment')
        }

        const data = await response.json()
        setQuestions(data.questions || [])
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment')
        setLoading(false)
      }
    }

    loadAssessment()
  }, [assessmentSessionId, router])

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-save answer
  const saveAnswer = useCallback(
    async (mcqId: string, selectedOption: string | null) => {
      try {
        setSaving(true)
        const token = localStorage.getItem('token')

        const response = await fetch('/api/assessments/save-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assessmentSessionId,
            mcqId,
            selectedOption,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          console.error('Failed to save answer:', data.message)
        }
      } catch (err) {
        console.error('Error saving answer:', err)
      } finally {
        setSaving(false)
      }
    },
    [assessmentSessionId]
  )

  const handleSelectOption = (option: string) => {
    const mcqId = questions[currentQuestionIndex]?.id
    if (mcqId) {
      const newAnswers = new Map(answers)
      newAnswers.set(mcqId, option)
      setAnswers(newAnswers)
      saveAnswer(mcqId, option)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const token = localStorage.getItem('token')

      const response = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assessmentSessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to submit assessment')
        return
      }

      router.push(`/results/${assessmentSessionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto card">
          <p className="text-gray-600 mb-4">Loading assessment questions...</p>
          <p className="text-sm text-gray-500">Assessment ID: {assessmentSessionId}</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = answers.get(currentQuestion?.id) || null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer and Header */}
      <div className="bg-blue-600 text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Online Assessment</h1>
          <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-300' : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question List Sidebar */}
          <div className="card h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Questions ({questions.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-full p-2 rounded text-left text-sm font-medium transition-colors ${
                    idx === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers.has(q.id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Q{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Main Assessment Area */}
          <div className="lg:col-span-3">
            <div className="card mb-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex-1">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {answers.has(currentQuestion.id) ? '✓ Answered' : 'Not answered'}
                </span>
              </div>

              <p className="text-lg text-gray-900 mb-8">{currentQuestion.question}</p>

              <div className="space-y-3 mb-8">
                {[
                  { label: 'A', value: currentQuestion.optionA },
                  { label: 'B', value: currentQuestion.optionB },
                  { label: 'C', value: currentQuestion.optionC },
                  { label: 'D', value: currentQuestion.optionD },
                ].map(option => (
                  <label
                    key={option.label}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAnswer === option.label
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option.label}
                      checked={selectedAnswer === option.label}
                      onChange={() => handleSelectOption(option.label)}
                      className="mr-3"
                    />
                    <span className="font-medium text-gray-900 mr-3">({option.label})</span>
                    <span className="text-gray-700">{option.value}</span>
                  </label>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                  >
                    Next →
                  </button>
                )}
              </div>

              {saving && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Saving answer...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
