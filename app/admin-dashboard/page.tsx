'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminChart from '@/components/AdminChart'
import { SurveyResponse } from '@/types/survey'

export default function AdminDashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResponses()
  }, [])

  // Format UTC timestamp to Arizona/Phoenix timezone
  const formatArizonaTime = (utcTimestamp: string): string => {
    try {
      const date = new Date(utcTimestamp)
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Phoenix',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      return formatter.format(date)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  const fetchResponses = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setResponses(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching responses:', err)
      setError('Failed to load responses. Please check your Supabase connection.')
      setLoading(false)
    }
  }

  // Calculate price range distribution
  const getPriceRangeDistribution = () => {
    const distribution: Record<string, number> = {
      '$601k–$700k': 0,
      '$501k–$600k': 0,
      '$401k–$500k': 0,
    }

    responses.forEach((response) => {
      if (response.initial_range && distribution[response.initial_range] !== undefined) {
        distribution[response.initial_range]++
      }
    })

    return Object.entries(distribution).map(([label, count]) => ({
      label,
      count,
    }))
  }

  // Calculate best feature distribution
  const getBestFeatureDistribution = () => {
    const distribution: Record<string, number> = {}

    responses.forEach((response) => {
      if (response.best_feature) {
        distribution[response.best_feature] = (distribution[response.best_feature] || 0) + 1
      }
    })

    return Object.entries(distribution)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
  }

  // Extract common themes from improvement notes
  const getImprovementThemes = () => {
    const notes = responses
      .filter((r) => r.improvement_note && r.improvement_note.trim().length > 0)
      .map((r) => r.improvement_note!.toLowerCase())

    // Simple keyword extraction (basic approach)
    const keywords: Record<string, number> = {}
    const commonWords = ['kitchen', 'bathroom', 'paint', 'floor', 'roof', 'yard', 'landscape', 'update', 'renovate', 'clean', 'repair', 'modern', 'curb', 'appeal']

    notes.forEach((note) => {
      commonWords.forEach((word) => {
        if (note.includes(word)) {
          keywords[word] = (keywords[word] || 0) + 1
        }
      })
    })

    return Object.entries(keywords)
      .map(([label, count]) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const priceDistribution = getPriceRangeDistribution()
  const bestFeatureDistribution = getBestFeatureDistribution()
  const improvementThemes = getImprovementThemes()
  const allComments = responses.filter((r) => r.improvement_note && r.improvement_note.trim().length > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            3561 W Dublin St - Survey Responses ({responses.length} total)
          </p>
        </div>

        {/* Price Range Distribution Chart */}
        <AdminChart
          title="Price Range Distribution"
          data={priceDistribution}
        />

        {/* Sentiment Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-navy mb-4">Sentiment Summary</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Most Popular Best Features</h4>
            {bestFeatureDistribution.length > 0 ? (
              <div className="space-y-2">
                {bestFeatureDistribution.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 font-medium">{item.label}</span>
                    <span className="text-navy font-bold text-lg">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No feature selections yet.</p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Common Improvement Themes</h4>
            {improvementThemes.length > 0 ? (
              <div className="space-y-2">
                {improvementThemes.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 font-medium">{item.label}</span>
                    <span className="text-navy font-bold text-lg">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No improvement themes identified yet.</p>
            )}
          </div>
        </div>

        {/* All Comments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-navy mb-4">
            All Improvement Comments ({allComments.length})
          </h3>
          {allComments.length > 0 ? (
            <div className="space-y-4">
              {allComments.map((response) => (
                <div
                  key={response.id}
                  className="border-l-4 border-navy pl-4 py-2 bg-gray-50 rounded-r-lg"
                >
                  <p className="text-gray-900 mb-2">{response.improvement_note}</p>
                  <p className="text-sm text-gray-500">
                    {response.created_at
                      ? formatArizonaTime(response.created_at)
                      : 'No date available'}
                    {response.agent_email && ` • ${response.agent_email}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No improvement comments yet.</p>
          )}
        </div>

        {/* Detailed Responses Table */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-xl font-bold text-navy mb-4">
            All Survey Responses ({responses.length})
          </h3>
          {responses.length > 0 ? (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Agent Email
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Initial Range
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Specific Price
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Best Feature
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Improvement Note
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Date (Arizona)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responses.map((response, index) => (
                        <tr
                          key={response.id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.agent_email || <span className="text-gray-400 italic">Not provided</span>}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.initial_range || <span className="text-gray-400 italic">—</span>}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.specific_price || <span className="text-gray-400 italic">—</span>}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.best_feature || <span className="text-gray-400 italic">—</span>}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 max-w-xs">
                            {response.improvement_note ? (
                              <div className="max-w-xs truncate" title={response.improvement_note}>
                                {response.improvement_note}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">—</span>
                            )}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                            {response.created_at
                              ? formatArizonaTime(response.created_at)
                              : <span className="text-gray-400 italic">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No responses yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}