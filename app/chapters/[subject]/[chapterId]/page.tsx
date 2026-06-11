'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ThemeToggle } from '@/app/components/ThemeToggle'

interface ChapterContent {
  id: string
  topic: string
  content: string
  order: number
  diagramUrl?: string
  diagramTitle?: string
  chartUrl?: string
  chartTitle?: string
  youtubeUrl?: string
  videoTitle?: string
  keyPoints?: string
  resources?: string
}

interface MCQ {
  id: string
  question: string
  order: number
}

interface Chapter {
  id: string
  title: string
  description: string
  subject: string
  classLevel: string
  content: ChapterContent[]
  mcqs: MCQ[]
}

export default function ChapterDetailPage() {
  const router = useRouter()
  const params = useParams()
  const chapterId = params.chapterId as string
  const subject = params.subject as string

  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [startingAssessment, setStartingAssessment] = useState(false)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/auth/login')
          return
        }

        const response = await fetch(`/api/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to load chapter')
          return
        }

        setChapter(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchChapter()
  }, [chapterId, router])

  const handleStartAssessment = async () => {
    try {
      setStartingAssessment(true)
      const token = localStorage.getItem('token')

      const response = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chapterId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to start assessment')
        return
      }

      router.push(`/assessment/${data.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setStartingAssessment(false)
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Chapter Not Found</p>
          <Link href={`/chapters/${subject}`} className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
            Back to Chapters
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/chapters/${subject}`} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
              <span className="text-xl">←</span>
              <span>Back to {subject}</span>
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-600/10 border border-red-500/30 text-red-300">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="mb-12">
          <div className="mb-4 inline-block px-4 py-2 rounded-lg bg-indigo-600/20 dark:bg-indigo-600/30 border border-indigo-500/30 dark:border-indigo-500/40">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {chapter.subject} • Class {chapter.classLevel}
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            {chapter.title}
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {chapter.description}
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {chapter.content && chapter.content.length > 0 ? (
            chapter.content.map((section) => (
              <div key={section.id} className="group">
                <button
                  onClick={() => setExpandedTopic(expandedTopic === section.id ? null : section.id)}
                  className="w-full text-left p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {section.topic}
                    </h2>
                    <span className={`text-2xl text-indigo-600 dark:text-indigo-400 transition-transform duration-300 ${expandedTopic === section.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {expandedTopic === section.id && (
                  <div className="mt-2 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
                    {section.youtubeUrl && (
                      <div className="rounded-lg overflow-hidden">
                        <div className="aspect-video bg-black">
                          <iframe
                            className="w-full h-full"
                            src={section.youtubeUrl.includes('youtube.com/embed/') 
                              ? section.youtubeUrl 
                              : section.youtubeUrl.replace('watch?v=', 'embed/')}
                            title={section.videoTitle || 'Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        {section.videoTitle && (
                          <p className="text-center text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-800 font-medium">
                            📹 {section.videoTitle}
                          </p>
                        )}
                      </div>
                    )}

                    {section.content && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    )}

                    {section.keyPoints && (
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">📌 Key Points:</h4>
                        <ul className="space-y-2">
                          {(() => {
                            try {
                              const keyPointsList = JSON.parse(section.keyPoints)
                              if (Array.isArray(keyPointsList)) {
                                return keyPointsList.map((point, idx) => (
                                  <li key={idx} className="text-blue-800 dark:text-blue-200 text-sm flex gap-2">
                                    <span className="text-blue-600 dark:text-blue-300 font-bold">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))
                              } else {
                                return <p className="text-blue-800 dark:text-blue-200 text-sm">{section.keyPoints}</p>
                              }
                            } catch {
                              return <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap text-sm">{section.keyPoints}</p>
                            }
                          })()}
                        </ul>
                      </div>
                    )}

                    {section.diagramUrl && (
                      <div className="border border-indigo-300 dark:border-indigo-600 rounded-lg overflow-hidden bg-indigo-50 dark:bg-indigo-950/20">
                        <img 
                          src={section.diagramUrl} 
                          alt={section.diagramTitle || 'Diagram'} 
                          className="w-full h-auto"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              const placeholder = document.createElement('div')
                              placeholder.className = 'w-full h-48 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900'
                              placeholder.innerHTML = '<div class="text-center"><div class="text-3xl mb-2">📊</div><div class="text-indigo-700 dark:text-indigo-200 font-medium">Diagram</div></div>'
                              parent.insertBefore(placeholder, e.currentTarget.nextSibling)
                            }
                          }}
                        />
                        {section.diagramTitle && (
                          <p className="text-center text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-800">
                            📊 {section.diagramTitle}
                          </p>
                        )}
                      </div>
                    )}

                    {section.chartUrl && (
                      <div className="border border-purple-300 dark:border-purple-600 rounded-lg overflow-hidden bg-purple-50 dark:bg-purple-950/20">
                        <img 
                          src={section.chartUrl} 
                          alt={section.chartTitle || 'Chart'} 
                          className="w-full h-auto"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              const placeholder = document.createElement('div')
                              placeholder.className = 'w-full h-48 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900'
                              placeholder.innerHTML = '<div class="text-center"><div class="text-3xl mb-2">📈</div><div class="text-purple-700 dark:text-purple-200 font-medium">Chart</div></div>'
                              parent.insertBefore(placeholder, e.currentTarget.nextSibling)
                            }
                          }}
                        />
                        {section.chartTitle && (
                          <p className="text-center text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-800">
                            📈 {section.chartTitle}
                          </p>
                        )}
                      </div>
                    )}

                    {section.resources && (
                      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <h4 className="font-bold text-green-900 dark:text-green-100 mb-3">📚 Resources:</h4>
                        <div className="space-y-2">
                          {(() => {
                            try {
                              const resourcesList = JSON.parse(section.resources)
                              if (Array.isArray(resourcesList)) {
                                return resourcesList.map((resource, idx) => (
                                  <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:underline text-sm py-1"
                                  >
                                    🔗 {resource.title}
                                  </a>
                                ))
                              } else {
                                return <p className="text-green-800 dark:text-green-200 whitespace-pre-wrap text-sm">{section.resources}</p>
                              }
                            } catch {
                              return <p className="text-green-800 dark:text-green-200 whitespace-pre-wrap text-sm">{section.resources}</p>
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p className="text-lg">No content available for this chapter</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-xl p-8 text-white">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Ready to Test Your Knowledge?</h2>
            <p className="text-indigo-100">
              {chapter.mcqs.length > 0
                ? `This chapter has ${chapter.mcqs.length} multiple choice questions to help you assess your understanding.`
                : 'No assessments available yet for this chapter.'}
            </p>
          </div>

          {chapter.mcqs.length > 0 && (
            <button
              onClick={handleStartAssessment}
              disabled={startingAssessment}
              className="px-8 py-4 rounded-lg bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {startingAssessment ? '⏳ Starting Assessment...' : `▶️ Start Assessment (${chapter.mcqs.length} Questions)`}
            </button>
          )}
        </div>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2026 Alfanumrik. Premium learning for Class 10 excellence.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
