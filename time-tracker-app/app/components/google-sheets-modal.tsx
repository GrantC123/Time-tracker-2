"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import GoogleSheetsConfig from "./google-sheets-config"

interface GoogleSheetsModalProps {
  spreadsheetId: string
  setSpreadsheetId: (id: string) => void
  sheetName: string
  setSheetName: (name: string) => void
  isConfigured: boolean
  setIsConfigured: (configured: boolean) => void
  availableSheets: string[]
  setAvailableSheets: (sheets: string[]) => void
}

export default function GoogleSheetsModal({
  spreadsheetId,
  setSpreadsheetId,
  sheetName,
  setSheetName,
  isConfigured,
  setIsConfigured,
  availableSheets,
  setAvailableSheets,
}: GoogleSheetsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Google Sheets Settings</DialogTitle>
          <DialogDescription>
            Configure Google Sheets integration to automatically log your time entries
          </DialogDescription>
        </DialogHeader>
        <GoogleSheetsConfig
          spreadsheetId={spreadsheetId}
          setSpreadsheetId={setSpreadsheetId}
          sheetName={sheetName}
          setSheetName={setSheetName}
          isConfigured={isConfigured}
          setIsConfigured={setIsConfigured}
          availableSheets={availableSheets}
          setAvailableSheets={setAvailableSheets}
        />
      </DialogContent>
    </Dialog>
  )
} 