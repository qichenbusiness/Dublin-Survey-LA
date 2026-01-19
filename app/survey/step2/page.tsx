'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SurveyLayout from '@/components/SurveyLayout'

function Step2Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const range = searchParams.get('range')
  const email = searchParams.get('email')

  const handleContinue = () => {
    // Redirect to Step 3 with preserved params
    const params = new URLSearchParams()
    if (range) params.set('range', range)
    if (email) params.set('email', email)
    router.push(`/survey/step3?${params.toString()}`)
  }

  const handleFinish = () => {
    // Redirect to Success page
    router.push('/survey/success')
  }

  return (
    <SurveyLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy">
            Thank you! Your vote is saved.
          </h2>
          <p className="text-lg text-gray-700">
            If you have 60 seconds, I have 3 quick questions to help me understand your choice. Would you be open to sharing more?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleContinue}
            className="
              w-full min-h-[48px] px-6 py-4
              bg-navy text-white
              text-xl font-semibold
              rounded-lg
              transition-all duration-200
              hover:bg-blue-900
              active:bg-blue-950
              focus:outline-none focus:ring-4 focus:ring-blue-300
              shadow-md hover:shadow-lg
            "
          >
            Yes, I can help
          </button>
          <button
            onClick={handleFinish}
            className="
              w-full min-h-[48px] px-6 py-4
              bg-gray-200 text-gray-800
              text-xl font-semibold
              rounded-lg
              transition-all duration-200
              hover:bg-gray-300
              active:bg-gray-400
              focus:outline-none focus:ring-4 focus:ring-gray-400
              shadow-md hover:shadow-lg
            "
          >
            No, I am finished
          </button>
        </div>
      </div>
    </SurveyLayout>
  )
}

export default function Step2() {
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
      <Step2Content />
    </Suspense>
  )
}