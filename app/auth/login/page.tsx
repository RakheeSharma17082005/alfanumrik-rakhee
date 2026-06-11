'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      // Store token and user data
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('userId', data.data.userId)
      localStorage.setItem('user', JSON.stringify({
        userId: data.data.userId,
        email: data.data.email,
        fullName: data.data.fullName,
      }))

      router.push('/chapters')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-5xl">✨</span>
            <span className="text-4xl font-bold gradient-indigo-purple">Alfanumrik</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back! 👋</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Let's continue your learning journey</p>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950 dark:to-rose-950 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl shadow-soft animate-slide-in-up">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">⚠️</span>
              <div>
                <p className="font-bold mb-1">Login Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        <div className="card backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-2 border-indigo-100 dark:border-indigo-900 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="animate-slide-in-up">
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3 text-lg">📧 Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="input-field bg-slate-100 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:border-slate-600 text-slate-900 text-lg"
                required
              />
            </div>

            {/* Password Field */}
            <div className="animate-slide-in-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3 text-lg">🔐 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field bg-slate-100 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:border-slate-600 text-slate-900 text-lg"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-up dark:bg-indigo-600 dark:hover:bg-indigo-700"
              style={{ animationDelay: '100ms' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⏳</span>
                  Logging in...
                </span>
              ) : (
                '🚀 Login'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center border-t border-gray-200 dark:border-slate-700 pt-6">
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Don&apos;t have an account yet?
            </p>
            <Link
              href="/auth/register"
              className="inline-block btn-secondary font-bold px-8 py-3 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Create Account 🎓
            </Link>
          </div>

          {/* Demo Hint */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold text-center">
              🎯 <span className="text-purple-700">Demo Tip:</span> Use any email & password to continue
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
