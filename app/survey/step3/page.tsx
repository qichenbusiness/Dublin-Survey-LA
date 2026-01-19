'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SurveyLayout from '@/components/SurveyLayout'
import { BestFeature } from '@/types/survey'

function Step3Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [specificPrice, setSpecificPrice] = useState<string>('')
  const [bestFeature, setBestFeature] = useState<BestFeature | ''>('')
  const [improvementNote, setImprovementNote] = useState<string>('')
  const [initialRange, setInitialRange] = useState<string>('')
  const [isLoadingRange, setIsLoadingRange] = useState(true)

  const rangeFromUrl = searchParams.get('range')
  const email = searchParams.get('email')

  // Generate $20k increments based on the selected range
  const generatePriceIncrements = (selectedRange: string): string[] => {
    const increments: string[] = []
    
    // Normalize the range string to handle potential variations
    const normalizedRange = selectedRange.trim()
    
    if (normalizedRange === '$601k–$700k' || normalizedRange.includes('601') && normalizedRange.includes('700')) {
      for (let start = 601; start <= 681; start += 20) {
        const end = Math.min(start + 19, 700)
        increments.push(`$${start}k–$${end}k`)
      }
    } else if (normalizedRange === '$501k–$600k' || normalizedRange.includes('501') && normalizedRange.includes('600')) {
      for (let start = 501; start <= 581; start += 20) {
        const end = Math.min(start + 19, 600)
        increments.push(`$${start}k–$${end}k`)
      }
    } else if (normalizedRange === '$401k–$500k' || normalizedRange.includes('401') && normalizedRange.includes('500')) {
      for (let start = 401; start <= 481; start += 20) {
        const end = Math.min(start + 19, 500)
        increments.push(`$${start}k–$${end}k`)
      }
    } else {
      // Default fallback: show $501k–$600k sub-ranges
      for (let start = 501; start <= 581; start += 20) {
        const end = Math.min(start + 19, 600)
        increments.push(`$${start}k–$${end}k`)
      }
    }
    
    return increments
  }

  // Fetch initial_range from Supabase if not in URL
  useEffect(() => {
    const fetchInitialRange = async () => {
      if (rangeFromUrl) {
        setInitialRange(rangeFromUrl)
        setIsLoadingRange(false)
        return
      }

      // Try to fetch from Supabase using email
      if (email) {
        try {
          const { data, error: fetchError } = await supabase
            .from('responses')
            .select('initial_range')
            .eq('agent_email', email)
            .not('initial_range', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (!fetchError && data?.initial_range) {
            setInitialRange(data.initial_range)
            setIsLoadingRange(false)
            return
          }
        } catch (err) {
          console.error('Error fetching initial range:', err)
        }
      }

      // Fallback: try without email (get most recent response)
      try {
        const { data, error: fetchError } = await supabase
          .from('responses')
          .select('initial_range')
          .not('initial_range', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (!fetchError && data?.initial_range) {
          setInitialRange(data.initial_range)
          setIsLoadingRange(false)
          return
        }
      } catch (err) {
        console.error('Error fetching initial range:', err)
      }

      // Final fallback: use default range
      setInitialRange('$501k–$600k')
      setIsLoadingRange(false)
    }

    fetchInitialRange()
  }, [rangeFromUrl, email])

  const priceIncrements = generatePriceIncrements(initialRange)
  const bestFeatureOptions: BestFeature[] = ['Location', 'Layout', 'Condition/Updates', 'Yard/Lot', 'Price']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!specificPrice || !bestFeature) {
      setError('Please answer all required questions.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Find the most recent response with this range and email to update
      const rangeToUse = initialRange || rangeFromUrl || '$501k–$600k'
      let query = supabase
        .from('responses')
        .select('id')
        .eq('initial_range', rangeToUse)
        .order('created_at', { ascending: false })
        .limit(1)

      if (email) {
        query = query.eq('agent_email', email)
      }

      const { data: existingResponse, error: fetchError } = await query.single()

      if (existingResponse) {
        // Update existing response
        const { error: updateError } = await supabase
          .from('responses')
          .update({
            specific_price: specificPrice,
            best_feature: bestFeature,
            improvement_note: improvementNote || null,
          })
          .eq('id', existingResponse.id)

        if (updateError) throw updateError
      } else {
        // Create new response if somehow it doesn't exist
        const { error: insertError } = await supabase
          .from('responses')
          .insert({
            initial_range: rangeToUse,
            specific_price: specificPrice,
            best_feature: bestFeature,
            improvement_note: improvementNote || null,
            agent_email: email || null,
          })

        if (insertError) throw insertError
      }

      // Redirect to Success page
      router.push('/survey/success')
    } catch (err) {
      console.error('Error saving responses:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <SurveyLayout>
      <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">
          3 Quick Questions
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Q1: Smart Range */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-900">
            What is a more specific price range you would suggest?
          </label>
          {isLoadingRange ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy mx-auto"></div>
              <p className="mt-2 text-gray-600 text-sm">Loading price ranges...</p>
            </div>
          ) : priceIncrements.length > 0 ? (
            <div className="space-y-3">
              {priceIncrements.map((increment) => (
                <label
                  key={increment}
                  className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-navy transition-colors"
                >
                  <input
                    type="radio"
                    name="specificPrice"
                    value={increment}
                    checked={specificPrice === increment}
                    onChange={(e) => setSpecificPrice(e.target.value)}
                    className="w-5 h-5 text-navy focus:ring-navy focus:ring-2"
                    required
                  />
                  <span className="ml-3 text-lg text-gray-900">{increment}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
              Unable to load price ranges. Please try refreshing the page.
            </div>
          )}
        </div>

        {/* Q2: The Why */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-900">
            What is the best thing about this house?
          </label>
          <div className="space-y-3">
            {bestFeatureOptions.map((option) => (
              <label
                key={option}
                className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-navy transition-colors"
              >
                <input
                  type="radio"
                  name="bestFeature"
                  value={option}
                  checked={bestFeature === option}
                  onChange={(e) => setBestFeature(e.target.value as BestFeature)}
                  className="w-5 h-5 text-navy focus:ring-navy focus:ring-2"
                  required
                />
                <span className="ml-3 text-lg text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q3: The Advice */}
        <div className="space-y-4">
          <label htmlFor="improvementNote" className="block text-lg font-semibold text-gray-900">
            Is there one thing that could be improved to help it sell faster?
          </label>
          <textarea
            id="improvementNote"
            value={improvementNote}
            onChange={(e) => setImprovementNote(e.target.value)}
            rows={4}
            className="
              w-full px-4 py-3
              border-2 border-gray-300 rounded-lg
              text-lg text-gray-900
              focus:outline-none focus:border-navy focus:ring-2 focus:ring-blue-300
              resize-y
            "
            placeholder="Share your thoughts..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full min-h-[48px] px-6 py-4
            bg-navy text-white
            text-xl font-semibold
            rounded-lg
            transition-all duration-200
            hover:bg-blue-900
            active:bg-blue-950
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-4 focus:ring-blue-300
            shadow-md hover:shadow-lg
          "
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {loading && (
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy mx-auto"></div>
            <p className="mt-2">Saving your responses...</p>
          </div>
        )}
      </form>
    </SurveyLayout>
  )
}

export default function Step3() {
  return (
    <Suspense
      fallback={
        <SurveyLayout>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </SurveyLayout>
      }
    >
      <Step3Content />
    </Suspense>
  )
}