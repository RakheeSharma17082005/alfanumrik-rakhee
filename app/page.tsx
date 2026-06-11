'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './components/ThemeToggle'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always clear session on home page load - fresh start every time
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ===== NAVBAR ===== */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Alfanumrik</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/chapters" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                  Learn
                </Link>
                <Link href="/dashboard" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    setIsAuthenticated(false)
                    router.push('/')
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors text-sm">
                  Get Started
                </Link>
              </>
            )}
            <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isAuthenticated ? (
          <div className="py-12">
            {/* ===== AUTHENTICATED - WELCOME ===== */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back!
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                Continue your learning journey with interactive lessons and assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Card 1: Browse Chapters */}
              <div
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group"
                onClick={() => router.push('/chapters')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Browse Chapters</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Explore curated learning materials</p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium group-hover:gap-3 transition-all">
                  <span>Start Learning</span>
                  <span className="text-lg">→</span>
                </div>
              </div>

              {/* Card 2: Dashboard */}
              <div
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500 transition-all cursor-pointer group"
                onClick={() => router.push('/dashboard')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Your Progress</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Track your performance and achievements</p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium group-hover:gap-3 transition-all">
                  <span>View Dashboard</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Learning Highlights</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10+</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">Chapters Available</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">200+</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">Practice Questions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Track</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">Your Progress</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 md:py-16">
            {/* ===== UNAUTHENTICATED - HERO ===== */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Master Your Studies
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-2">
                Alfanumrik is a comprehensive learning platform designed for Class 10 students.
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Learn from structured chapters, practice with interactive quizzes, and track your progress.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Comprehensive Curriculum</h3>
                <p className="text-slate-600 dark:text-slate-400">Well-structured chapters covering all Class 10 subjects with clear explanations.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Interactive Assessments</h3>
                <p className="text-slate-600 dark:text-slate-400">Test your knowledge with carefully curated multiple-choice questions and instant feedback.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Progress Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400">Track your performance with detailed analytics and identify areas for improvement.</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/auth/register" className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors text-lg">
                Get Started
              </Link>
              <Link href="/auth/login" className="px-8 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium transition-colors text-lg">
                Already a member? Sign in
              </Link>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 text-center">Why Alfanumrik</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10+</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">Chapters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">200+</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Real-time</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">Feedback</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">Expert</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">Content</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © 2026 Alfanumrik Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
