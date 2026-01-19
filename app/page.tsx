'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const range = searchParams.get('range')
    const email = searchParams.get('email')

    const handleRedirect = async () => {
      if (range && email) {
        // Magic link: Save initial_range and agent_email, then skip to Step 2
        try {
          const { error } = await supabase
            .from('responses')
            .insert({
              initial_range: range,
              agent_email: email,
            })

          if (error) {
            console.error('Error saving response:', error)
            // Still redirect even if save fails
          }

          // Redirect to Step 2 with email preserved
          router.push(`/survey/step2?email=${encodeURIComponent(email)}`)
        } catch (error) {
          console.error('Error:', error)
          // Still redirect even if save fails
          router.push(`/survey/step2?email=${encodeURIComponent(email)}`)
        }
      } else {
        // No magic link params: Start at Step 1
        router.push('/survey/step1')
      }
    }

    handleRedirect()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}