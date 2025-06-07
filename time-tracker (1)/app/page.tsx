"use client"

import dynamic from 'next/dynamic'

const TimeTracker = dynamic(() => import('../time-tracker'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <TimeTracker />
    </main>
  )
}
