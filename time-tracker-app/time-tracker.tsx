"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"
import TimeTracking from "@/app/components/time-tracking"
import GoogleSheetsModal from "@/app/components/google-sheets-modal"
import { useToast } from "@/hooks/use-toast"

export default function TimeTracker() {
  const [spreadsheetId, setSpreadsheetId] = useState("1afy41WHWyGhFivyxFLF8Lxb9qmIFBHm7l2Q4yCZUiRM")
  const [sheetName, setSheetName] = useState("")
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [isConfigured, setIsConfigured] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const testConnection = async () => {
    if (!spreadsheetId) {
      toast({
        title: "Missing Spreadsheet ID",
        description: "Please enter your Google Sheets ID",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      const response = await fetch(`/api/sheets?spreadsheetId=${spreadsheetId}`)

      if (!response.ok) {
        throw new Error("Failed to connect to spreadsheet")
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || "Failed to connect to spreadsheet")
      }

      // Set available sheets and default to the first one
      setAvailableSheets(data.sheets || [])
      if (data.sheets?.length > 0) {
        setSheetName(data.sheets[0])
      }

      setIsConfigured(true)
      toast({
        title: "Connection successful!",
        description: `Connected to "${data.sheetTitle || "your spreadsheet"}"`,
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please check your Spreadsheet ID and make sure you've shared it with the service account",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 relative">
        <h1 className="text-3xl font-bold">Time Tracker</h1>
        <p className="text-muted-foreground">Track your time and log entries to Google Sheets</p>
        <GoogleSheetsModal
          spreadsheetId={spreadsheetId}
          setSpreadsheetId={setSpreadsheetId}
          sheetName={sheetName}
          setSheetName={setSheetName}
          isConfigured={isConfigured}
          setIsConfigured={setIsConfigured}
          availableSheets={availableSheets}
          setAvailableSheets={setAvailableSheets}
        />
      </div>

      {!isConfigured && (
        <div className="flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-lg">
          <FileSpreadsheet className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <h2 className="text-lg font-semibold">Connect to Google Sheets</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Google Sheet to start logging time entries automatically
            </p>
            <Button onClick={testConnection} disabled={isConnecting} size="lg">
              {isConnecting ? "Connecting..." : "Connect to Google Sheets"}
            </Button>
          </div>
        </div>
      )}

      <TimeTracking
        isConfigured={isConfigured}
        spreadsheetId={spreadsheetId}
        sheetName={sheetName}
      />
    </div>
  )
}
