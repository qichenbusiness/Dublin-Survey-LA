'use client'

import SurveyLayout from '@/components/SurveyLayout'
import { CheckCircle } from 'lucide-react'

export default function Success() {
  return (
    <SurveyLayout>
      <div className="space-y-8 text-center">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={2} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-navy">
          Thank you for your help.
        </h2>
        <p className="text-lg md:text-xl text-gray-700">
          I will email the full report to you next week!
        </p>
      </div>
    </SurveyLayout>
  )
}