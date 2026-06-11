'use client'

import { useState } from 'react'

interface ChapterContentItem {
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

export default function ChapterDetailContent({
  content,
}: {
  content: ChapterContentItem[]
}) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

  const toggleTopic = (id: string) => {
    const newSet = new Set(expandedTopics)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedTopics(newSet)
  }

  return (
    <div className="space-y-6">
      {content.map((section) => (
        <div
          key={section.id}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          {/* Topic Header */}
          <button
            onClick={() => toggleTopic(section.id)}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-left">
                {section.topic}
              </h3>
            </div>
            <span
              className={`transform transition-transform text-xl ${
                expandedTopics.has(section.id) ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {/* Topic Content */}
          {expandedTopics.has(section.id) && (
            <div className="px-6 pb-6 space-y-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              {/* Main Content */}
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                  {section.content}
                </p>
              </div>

              {/* YouTube Video */}
              {section.youtubeUrl && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🎥</span> Recorded Lecture
                  </h4>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={section.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                      title={section.videoTitle || 'Lecture Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Diagram */}
              {section.diagramUrl && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📊</span> {section.diagramTitle || 'Diagram'}
                  </h4>
                  <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 p-4">
                    <img
                      src={section.diagramUrl}
                      alt={section.diagramTitle || 'Diagram'}
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Chart */}
              {section.chartUrl && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📈</span> {section.chartTitle || 'Chart'}
                  </h4>
                  <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 p-4">
                    <img
                      src={section.chartUrl}
                      alt={section.chartTitle || 'Chart'}
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Key Points */}
              {section.keyPoints && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>✓</span> Key Points
                  </h4>
                  <ul className="space-y-2 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
                    {JSON.parse(section.keyPoints).map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {section.resources && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📚</span> Resources
                  </h4>
                  <div className="space-y-2 bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500">
                    {JSON.parse(section.resources).map(
                      (resource: { title: string; url: string }, idx: number) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-green-600 dark:text-green-400 hover:underline flex items-center gap-2"
                        >
                          <span>🔗</span>
                          {resource.title}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
