"use client"

import dynamic from 'next/dynamic'

const TimeTracker = dynamic(() => import('../time-tracker'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Loading...</div>
    </div>
  )
})

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <TimeTracker />
    </main>
  )
}
