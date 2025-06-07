"use client"

import { FileSpreadsheet, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GoogleSheetsConfigProps {
  spreadsheetId: string
  setSpreadsheetId: (id: string) => void
  sheetName: string
  setSheetName: (name: string) => void
  isConfigured: boolean
  setIsConfigured: (configured: boolean) => void
  availableSheets: string[]
  setAvailableSheets: (sheets: string[]) => void
}

export default function GoogleSheetsConfig({
  spreadsheetId,
  setSpreadsheetId,
  sheetName,
  setSheetName,
  isConfigured,
  setIsConfigured,
  availableSheets,
}: GoogleSheetsConfigProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium text-blue-600">Preview Mode: Google Sheets integration is simulated</p>
            <p>
              <strong>Step 1:</strong> Share your Google Sheet with this service account email:
            </p>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              grant-time-sheet@one-moon-462119-f9.iam.gserviceaccount.com
            </code>
            <p>
              <strong>Step 2:</strong> Give it "Editor" permissions
            </p>
            <p>
              <strong>Step 3:</strong> Add these column headers: Start Time, End Time, Duration, Description,
              Project, Date, Time
            </p>
          </div>
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <div>
          <Label htmlFor="spreadsheetId">Google Sheets ID</Label>
          <Input
            id="spreadsheetId"
            placeholder="Enter your spreadsheet ID (from the URL)"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            disabled={isConfigured}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Find this in your Google Sheets URL: docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
          </p>
        </div>
        {isConfigured && availableSheets.length > 0 && (
          <div>
            <Label htmlFor="sheetName">Select Sheet</Label>
            <select
              id="sheetName"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availableSheets.map((sheet) => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-1">
              Select which sheet to log time entries to
            </p>
          </div>
        )}
        {isConfigured && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Connected to Google Sheets</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsConfigured(false)
              }}
              className="ml-auto"
            >
              Reconfigure
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 