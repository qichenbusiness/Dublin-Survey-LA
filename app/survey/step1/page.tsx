'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SurveyLayout from '@/components/SurveyLayout'
import PriceButton from '@/components/PriceButton'

export default function Step1() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const email = searchParams.get('email')

  const handleSelection = async (range: string) => {
    setLoading(true)
    setError(null)

    try {
      // Save initial_range to Supabase
      const { error: insertError } = await supabase
        .from('responses')
        .insert({
          initial_range: range,
          agent_email: email || null,
        })

      if (insertError) {
        throw insertError
      }

      // Redirect to Step 2 with range and email preserved
      const params = new URLSearchParams()
      params.set('range', range)
      if (email) {
        params.set('email', email)
      }
      router.push(`/survey/step2?${params.toString()}`)
    } catch (err) {
      console.error('Error saving selection:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <SurveyLayout>
      <div className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">
          In your professional opinion, what price range feels right for this home?
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <PriceButton
            range="$601k–$700k"
            onClick={() => handleSelection('$601k–$700k')}
            disabled={loading}
          />
          <PriceButton
            range="$501k–$600k"
            onClick={() => handleSelection('$501k–$600k')}
            disabled={loading}
          />
          <PriceButton
            range="$401k–$500k"
            onClick={() => handleSelection('$401k–$500k')}
            disabled={loading}
          />
        </div>

        {loading && (
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy mx-auto"></div>
            <p className="mt-2">Saving your vote...</p>
          </div>
        )}
      </div>
    </SurveyLayout>
  )
}