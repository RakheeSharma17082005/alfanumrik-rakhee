'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/app/components/ThemeToggle'

interface Subject {
  name: string
  count: number
}

interface Chapter {
  id: string
  title: string
  description: string
  subject: string
  classLevel: string
  mcqCount: number
}

interface MousePosition {
  x: number
  y: number
}

const subjectDetails: { [key: string]: { color: string; icon: string; description: string } } = {
  Mathematics: { color: 'bg-indigo-600/30 border-indigo-500/30', icon: '∑', description: 'Algebra, Geometry, Trigonometry, and more' },
  Science: { color: 'bg-purple-600/30 border-purple-500/30', icon: '⚗️', description: 'Chemistry, Physics, and Biology concepts' },
  English: { color: 'bg-blue-600/30 border-blue-500/30', icon: '📚', description: 'Literature, Grammar, and Communication' },
  History: { color: 'bg-amber-600/30 border-amber-500/30', icon: '📖', description: 'Nationalism, Colonialism, and Modernization' },
  Geography: { color: 'bg-green-600/30 border-green-500/30', icon: '🌍', description: 'Maps, Resources, and Population' },
  Civics: { color: 'bg-orange-600/30 border-orange-500/30', icon: '⚖️', description: 'Constitution, Government, and Rights' },
}

export default function ChaptersPage() {
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

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

        const chaptersList = data.data || []
        setChapters(chaptersList)

        // Extract unique subjects and count chapters
        const subjectMap: { [key: string]: number } = {}
        chaptersList.forEach((chapter: Chapter) => {
          subjectMap[chapter.subject] = (subjectMap[chapter.subject] || 0) + 1
        })

        const subjectsList = Object.entries(subjectMap).map(([name, count]) => ({
          name,
          count: count as number,
        }))

        setSubjects(subjectsList)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [router])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
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
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <div className="text-white font-bold text-lg">∞</div>
            </div>
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent text-2xl font-bold">
              Alfanumrik
            </h1>
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16" onMouseMove={handleMouseMove} ref={containerRef}>
        {/* HERO SECTION */}
        <div className="mb-16 animate-fade-in">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 leading-tight text-slate-900 dark:text-white">
              Explore Learning <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Paths</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Choose a subject to explore all chapters, resources, and assessments. Each subject is carefully crafted for Class 10 excellence.
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-8 p-5 rounded-xl backdrop-blur-xl animate-slide-up bg-red-600/10 border border-red-500/30 text-red-300">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* SUBJECTS GRID */}
        {subjects.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 opacity-50">📚</div>
            <p className="text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              No subjects available
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Check back soon for more premium learning content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => {
              const details = subjectDetails[subject.name] || {
                color: 'bg-indigo-600/30 border-indigo-500/30',
                icon: '📖',
                description: 'Learn and master this subject',
              }

              return (
                <Link key={subject.name} href={`/chapters/${subject.name}`}>
                  <div
                    className={`${details.color} group cursor-pointer min-h-64 p-8 rounded-xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:bg-opacity-40 hover:shadow-lg`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* GRADIENT OVERLAY ON HOVER */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                      background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.15), transparent 50%)',
                      '--mouse-x': `${mousePosition.x}px`,
                      '--mouse-y': `${mousePosition.y}px`,
                    } as React.CSSProperties}></div>

                    {/* CONTENT */}
                    <div className="relative z-10">
                      <div className="text-6xl mb-4">{details.icon}</div>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {subject.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
                        {details.description}
                      </p>
                    </div>

                    {/* METADATA */}
                    <div className="relative z-10 space-y-3">
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        📚 {subject.count} chapters
                      </div>

                      <div className="flex items-center gap-2 font-medium group-hover:translate-x-2 transition-transform duration-300 text-indigo-600 dark:text-indigo-400">
                        <span>Explore</span>
                        <span className="text-xl">→</span>
                      </div>
                    </div>

                    {/* DECORATIVE ELEMENTS */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="mt-20 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Explore <span className="font-semibold text-slate-700 dark:text-slate-200">{subjects.length}</span> subject{subjects.length !== 1 ? 's' : ''} with <span className="font-semibold text-slate-700 dark:text-slate-200">{chapters.length}</span> chapter{chapters.length !== 1 ? 's' : ''}</p>
          <p className="mt-2">Premium learning experience for Class 10 students</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 mt-20 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-bold text-lg mb-2">
                Alfanumrik
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Premium learning platform for Class 10 excellence
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Platform</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Resources</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Company</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800">
            <div className="pt-8 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
              <p>&copy; 2026 Alfanumrik. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
