'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ThemeToggle } from '@/app/components/ThemeToggle'

interface Chapter {
  id: string
  title: string
  description: string
  subject: string
  classLevel: string
  mcqCount: number
}

const subjectDetails: { [key: string]: { icon: string; color: string } } = {
  Mathematics: { icon: '∑', color: 'indigo' },
  Science: { icon: '⚗️', color: 'purple' },
  English: { icon: '📚', color: 'blue' },
  History: { icon: '📖', color: 'amber' },
  Geography: { icon: '🌍', color: 'green' },
  Civics: { icon: '⚖️', color: 'orange' },
}

export default function SubjectChaptersPage() {
  const router = useRouter()
  const params = useParams()
  const subject = params.subject as string
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/auth/login')
          return
        }

        const response = await fetch('/api/chapters', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to load chapters')
          return
        }

        const allChapters = data.data || []
        const subjectChapters = allChapters.filter((ch: Chapter) => ch.subject === subject)
        setChapters(subjectChapters)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [router, subject])

  const details = subjectDetails[subject] || { icon: '📖', color: 'indigo' }
  const colorMap: { [key: string]: string } = {
    indigo: 'from-indigo-600 to-indigo-400 border-indigo-500/30',
    purple: 'from-purple-600 to-purple-400 border-purple-500/30',
    blue: 'from-blue-600 to-blue-400 border-blue-500/30',
    amber: 'from-amber-600 to-amber-400 border-amber-500/30',
    green: 'from-green-600 to-green-400 border-green-500/30',
    orange: 'from-orange-600 to-orange-400 border-orange-500/30',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative">
          <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{
            animation: 'blob 7s infinite',
          }}></div>
          <div className="relative w-16 h-16 animate-spin">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* NAVBAR */}
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
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Dashboard
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

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* BACK LINK */}
        <Link href="/chapters" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-8 transition-colors">
          <span>←</span>
          <span>Back to Subjects</span>
        </Link>

        {/* HERO SECTION */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{details.icon}</div>
            <div>
              <h1 className={`text-5xl font-bold mb-2 bg-gradient-to-r ${colorMap[details.color]} bg-clip-text text-transparent`}>
                {subject}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-8 p-5 rounded-xl backdrop-blur-xl bg-red-600/10 border border-red-500/30 text-red-300">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* CHAPTERS GRID */}
        {chapters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-50">📚</div>
            <p className="text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              No chapters available
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Check back soon for more content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => (
              <Link key={chapter.id} href={`/chapters/${subject}/${chapter.id}`}>
                <div
                  className={`group cursor-pointer min-h-72 p-6 rounded-xl border ${colorMap[details.color].split(' ').pop()} bg-gradient-to-br ${colorMap[details.color].split(' ').slice(0, -1).join(' ')}/10 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* CONTENT */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {chapter.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
                      {chapter.description}
                    </p>
                  </div>

                  {/* METADATA */}
                  <div className="relative z-10 space-y-3">
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      ⭐ {chapter.mcqCount} Questions
                    </div>

                    <div className="flex items-center gap-2 font-medium group-hover:translate-x-2 transition-transform duration-300 text-indigo-600 dark:text-indigo-400">
                      <span>View Chapter</span>
                      <span className="text-xl">→</span>
                    </div>
                  </div>

                  {/* DECORATIVE ELEMENTS */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* FOOTER INFO */}
        {chapters.length > 0 && (
          <div className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Total: <span className="font-semibold text-slate-700 dark:text-slate-200">{chapters.length}</span> chapter{chapters.length !== 1 ? 's' : ''} in {subject}</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
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
