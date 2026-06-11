'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/app/components/ThemeToggle'

interface SubjectPerformance {
  subject: string
  chaptersAttempted: number
  totalChapters: number
  averageAccuracy: number
  totalQuestions: number
  correctAnswers: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Student')
  const [subjects, setSubjects] = useState<SubjectPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (!token) {
          router.push('/auth/login')
          return
        }

        if (storedUser) {
          const user = JSON.parse(storedUser)
          setUserName(user.fullName || 'Student')
        }

        const response = await fetch('/api/chapters', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        const chapters = data.data || []

        const subjectMap: { [key: string]: SubjectPerformance } = {}
        
        chapters.forEach((ch: any) => {
          if (!subjectMap[ch.subject]) {
            subjectMap[ch.subject] = {
              subject: ch.subject,
              chaptersAttempted: 0,
              totalChapters: 0,
              averageAccuracy: 0,
              totalQuestions: 0,
              correctAnswers: 0,
            }
          }
          subjectMap[ch.subject].totalChapters += 1
        })

        setSubjects(Object.values(subjectMap))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative w-16 h-16 animate-spin">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500"></div>
        </div>
      </div>
    )
  }

  const selectedSubjectData = subjects.find(s => s.subject === selectedSubject)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/chapters" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <div className="text-white font-bold text-lg">∞</div>
              </div>
              <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent text-2xl font-bold">
                Alfanumrik
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/chapters"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Explore Chapters
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/')
              }}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm"
            >
              Logout
            </button>
            <div className="pl-2 border-l border-slate-200 dark:border-slate-700">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2 text-slate-900 dark:text-white">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track your learning progress by subject
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-xl bg-red-600/10 border border-red-500/30 text-red-300">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {subjects.map((perf) => (
            <div
              key={perf.subject}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSubject(perf.subject)}
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {perf.subject}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Chapters</span>
                  <span className="font-bold text-slate-900 dark:text-white">{perf.chaptersAttempted}/{perf.totalChapters}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Accuracy</span>
                  <span className="font-bold text-slate-900 dark:text-white">{perf.averageAccuracy}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 dark:bg-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(perf.averageAccuracy, 100)}%` }}
                  ></div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 pt-2">
                  ✅ {perf.correctAnswers}/{perf.totalQuestions} correct
                </div>
              </div>

              <Link href={`/chapters/${perf.subject}`}>
                <div className="mt-4 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                  <span>Open {perf.subject}</span>
                  <span>→</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {selectedSubject && selectedSubjectData && (
          <div className="p-8 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                  {selectedSubject} Performance
                </h2>
                <p className="text-indigo-700 dark:text-indigo-300">
                  Detailed analytics for this subject only
                </p>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Chapters Attempted</div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedSubjectData.chaptersAttempted}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Chapters</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {selectedSubjectData.totalChapters}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Average Accuracy</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedSubjectData.averageAccuracy}%
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Correct Answers</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {selectedSubjectData.correctAnswers}/{selectedSubjectData.totalQuestions}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href={`/chapters/${selectedSubject}`}>
                <button className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
                  Explore {selectedSubject} Chapters →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 mt-20 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>&copy; 2026 Alfanumrik. Premium learning for Class 10 excellence.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
