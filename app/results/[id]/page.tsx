'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

interface AssessmentSession {
  id: string
  score: number
  percentage: number
  accuracy: number
  correctAnswers: number
  totalQuestions: number
  startedAt: string
  submittedAt: string
  chapter: {
    title: string
  }
}

interface DetailedResult {
  questionNumber: number
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  userAnswer: string | null
  correctAnswer: string
  isCorrect: boolean | null
  explanation: string
  difficulty: string
}

interface ResultData {
  assessmentSession: AssessmentSession
  detailedResults: DetailedResult[]
}

export default function ResultsPage() {
  const router = useRouter()
  const params = useParams()
  const assessmentSessionId = params.id as string

  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResults = async () => {
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

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to load results')
          return
        }

        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [assessmentSessionId, router])

  const calculateDuration = () => {
    if (!result?.assessmentSession) return '--'
    const start = new Date(result.assessmentSession.startedAt).getTime()
    const end = new Date(result.assessmentSession.submittedAt || new Date().getTime()).getTime()
    const minutes = Math.floor((end - start) / 60000)
    return minutes > 0 ? `${minutes} min` : '<1 min'
  }

  const getIncorrectAnswers = () => {
    if (!result?.assessmentSession) return '--'
    return result.assessmentSession.totalQuestions - result.assessmentSession.correctAnswers
  }

  const getSkippedQuestions = () => {
    if (!result?.assessmentSession) return '--'
    // This would need to be calculated from student answers
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* ===== NAVBAR ===== */}
      <nav className="backdrop-blur-sm bg-white/80 sticky top-0 z-50 shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-3xl">✨</div>
            <span className="text-2xl font-bold gradient-indigo-purple">Alfanumrik</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/chapters" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Learn
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/')
              }}
              className="btn-danger text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* ===== SUCCESS MESSAGE ===== */}
        <div className="card text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6 animate-pulse-glow">
              <span className="text-6xl">🎉</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Assessment Submitted! 🏆</h1>
            <p className="text-lg text-gray-600">Your responses have been saved and evaluated</p>
          </div>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl shadow-soft">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
            </div>
          </div>
        )}

        {/* ===== RESULTS CARDS ===== */}
        {result && result.assessmentSession && (
          <>
            <div className="card mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Results</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {/* Percentage */}
                <div className="card-gradient-indigo text-center">
                  <p className="text-sm opacity-90 mb-2">Percentage</p>
                  <p className="text-5xl font-bold mb-2">{result.assessmentSession.percentage.toFixed(0)}%</p>
                  <p className="text-xs opacity-75">Score</p>
                </div>

                {/* Accuracy */}
                <div className="card-gradient-green text-center">
                  <p className="text-sm opacity-90 mb-2">Accuracy</p>
                  <p className="text-5xl font-bold mb-2">{result.assessmentSession.accuracy.toFixed(0)}%</p>
                  <p className="text-xs opacity-75">Correct Rate</p>
                </div>

                {/* Correct Answers */}
                <div className="card-gradient-purple text-center">
                  <p className="text-sm opacity-90 mb-2">Correct Answers</p>
                  <p className="text-5xl font-bold mb-2">{result.assessmentSession.correctAnswers}</p>
                  <p className="text-xs opacity-75">out of {result.assessmentSession.totalQuestions}</p>
                </div>

                {/* Time Taken */}
                <div className="card-gradient-orange text-center">
                  <p className="text-sm opacity-90 mb-2">Time Taken</p>
                  <p className="text-4xl font-bold mb-2">{calculateDuration()}</p>
                  <p className="text-xs opacity-75">Duration</p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Detailed Breakdown
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                    <span className="text-gray-700 font-semibold">✓ Correct Answers</span>
                    <span className="text-2xl font-bold text-green-600">{result.assessmentSession.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                    <span className="text-gray-700 font-semibold">✗ Incorrect Answers</span>
                    <span className="text-2xl font-bold text-red-600">{getIncorrectAnswers()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                    <span className="text-gray-700 font-semibold">⏭️ Skipped Questions</span>
                    <span className="text-2xl font-bold text-yellow-600">{getSkippedQuestions()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="card mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Performance Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Score Distribution</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                      style={{ width: `${result.assessmentSession.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {result.assessmentSession.percentage >= 80 && (
                    <span className="text-green-600 font-semibold">🌟 Excellent performance! Keep it up!</span>
                  )}
                  {result.assessmentSession.percentage >= 60 && result.assessmentSession.percentage < 80 && (
                    <span className="text-blue-600 font-semibold">👍 Good job! Review weaker areas.</span>
                  )}
                  {result.assessmentSession.percentage < 60 && (
                    <span className="text-yellow-600 font-semibold">📚 Keep practicing to improve!</span>
                  )}
                </p>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="card mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                Question Review (All 20 Questions)
              </h2>
              <div className="space-y-6">
                {result.detailedResults && result.detailedResults.map((item, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${
                      item.isCorrect
                        ? 'border-green-300 bg-green-50'
                        : item.userAnswer === null
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Q{item.questionNumber}. {item.question}
                        </h3>
                        <div className="flex gap-3 items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
                            item.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {item.difficulty === 'easy' ? '⭐ Easy' :
                             item.difficulty === 'medium' ? '⭐⭐ Medium' :
                             '⭐⭐⭐ Hard'}
                          </span>
                          <span className={`text-lg font-bold ${
                            item.isCorrect
                              ? 'text-green-600'
                              : item.userAnswer === null
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {item.isCorrect ? '✓ Correct' : item.userAnswer === null ? '⊘ Skipped' : '✗ Incorrect'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Your Answer:</p>
                      <div className="space-y-2">
                        {Object.entries(item.options).map(([optionKey, optionText]) => {
                          const isUserAnswer = item.userAnswer === optionKey
                          const isCorrectAnswer = item.correctAnswer === optionKey
                          const isWrongAnswer = isUserAnswer && !isCorrectAnswer && item.userAnswer !== null
                          
                          return (
                            <div
                              key={optionKey}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                isCorrectAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : isWrongAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`font-bold min-w-fit ${
                                  isCorrectAnswer
                                    ? 'text-green-600'
                                    : isWrongAnswer
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }`}>
                                  {optionKey}){' '}
                                  {isCorrectAnswer && '✓'}
                                  {isWrongAnswer && '✗'}
                                </span>
                                <span className={`${
                                  isCorrectAnswer || isWrongAnswer ? 'font-semibold' : 'font-normal'
                                } text-gray-800`}>
                                  {optionText}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      {item.userAnswer === null && (
                        <p className="mt-3 text-sm font-semibold text-yellow-700">⊘ You skipped this question</p>
                      )}
                    </div>

                    {/* Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">💡 Explanation:</p>
                      <p className="text-gray-800 leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== ACTION BUTTONS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/chapters"
            className="btn-primary text-center py-4 text-lg font-semibold"
          >
            📚 Continue Learning
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary text-center py-4 text-lg font-semibold"
          >
            📊 View Dashboard
          </Link>
        </div>

        {/* ===== SESSION ID ===== */}
        <p className="text-center text-gray-500 text-sm">
          Session ID: <span className="font-mono text-gray-700">{assessmentSessionId}</span>
        </p>
      </div>
    </div>
  )
}
