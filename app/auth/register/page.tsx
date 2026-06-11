'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Calculate password strength
    if (name === 'password') {
      let strength = 0
      if (value.length >= 6) strength++
      if (/[A-Z]/.test(value)) strength++
      if (/[0-9]/.test(value)) strength++
      if (/[^A-Za-z0-9]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed')
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

  const getPasswordStrengthLabel = () => {
    const labels = ['Weak 😟', 'Fair 😐', 'Good 😊', 'Strong 💪', 'Very Strong 🔒']
    return labels[passwordStrength] || ''
  }

  const getPasswordStrengthColor = () => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-emerald-600',
    ]
    return colors[passwordStrength] || 'bg-gray-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 py-8 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-5xl">✨</span>
            <span className="text-4xl font-bold gradient-indigo-purple">Alfanumrik</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Join Us Today! 🚀</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Start your amazing learning journey</p>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950 dark:to-rose-950 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl shadow-soft animate-slide-in-up">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">⚠️</span>
              <div>
                <p className="font-bold mb-1">Signup Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        <div className="card backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-2 border-purple-100 dark:border-purple-900 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="animate-slide-in-up">
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3 text-lg">👤 Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your awesome name"
                className="input-field bg-slate-100 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:border-slate-600 text-slate-900 text-lg"
                required
              />
            </div>

            {/* Email Field */}
            <div className="animate-slide-in-up" style={{ animationDelay: '50ms' }}>
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
            <div className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3 text-lg">🔐 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="input-field bg-slate-100 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:border-slate-600 text-slate-900 text-lg"
                required
              />
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength + 1) * 20}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-20">
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="animate-slide-in-up" style={{ animationDelay: '150ms' }}>
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3 text-lg">✓ Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="input-field dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:border-slate-600 text-lg"
                required
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">✓ Passwords match!</p>
              )}
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">✗ Passwords don&apos;t match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formData.password !== formData.confirmPassword || !formData.fullName}
              className="w-full btn-primary text-lg py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-up dark:bg-indigo-600 dark:hover:bg-indigo-700"
              style={{ animationDelay: '200ms' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⏳</span>
                  Creating Account...
                </span>
              ) : (
                '🎓 Register'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center border-t border-gray-200 dark:border-slate-700 pt-6">
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Already learning with us?
            </p>
            <Link
              href="/auth/login"
              className="inline-block btn-secondary font-bold px-8 py-3 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Login Here 🎯
            </Link>
          </div>

          {/* Features */}
          <div className="mt-6 space-y-2 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-3">✨ What You Get:</p>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>✓</span>
              <span>Access to 10+ chapters</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>✓</span>
              <span>200+ interactive questions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>✓</span>
              <span>Track your progress</span>
            </div>
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
