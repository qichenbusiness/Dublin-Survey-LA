import React from 'react'

interface SurveyLayoutProps {
  children: React.ReactNode
}

export default function SurveyLayout({ children }: SurveyLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">
            3561 W Dublin St
          </h1>
        </div>
        <div className="bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}