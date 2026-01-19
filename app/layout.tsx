import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3561 W Dublin St - Real Estate Survey',
  description: 'Share your professional opinion about this home',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}