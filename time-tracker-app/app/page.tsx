"use client"

import dynamic from 'next/dynamic'
import LinkManager from "./components/link-manager"

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
      <LinkManager 
        spreadsheetId={process.env.NEXT_PUBLIC_SPREADSHEET_ID || ""}
        sheetName="Links"
        isConfigured={!!process.env.NEXT_PUBLIC_SPREADSHEET_ID}
      />
    </main>
  )
}
