"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface TimeEntry {
  id: string
  description: string
  startTime: Date
  endTime: Date
  duration: number
  project?: string
}

interface TimeTrackingProps {
  isConfigured: boolean
  spreadsheetId: string
  sheetName: string
}

export default function TimeTracking({ isConfigured, spreadsheetId, sheetName }: TimeTrackingProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [description, setDescription] = useState("")
  const [project, setProject] = useState("")
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(Date.now() - startTime.getTime())
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, startTime])

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const formatDuration = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const startTimer = () => {
    const now = new Date()
    setStartTime(now)
    setCurrentTime(0)
    setIsRunning(true)
    toast({
      title: "Timer started",
      description: "Time tracking has begun",
    })
  }

  const pauseTimer = () => {
    setIsRunning(false)
    toast({
      title: "Timer paused",
      description: "Time tracking paused",
    })
  }

  const stopTimer = async () => {
    if (!startTime) return

    const endTime = new Date()
    const duration = endTime.getTime() - startTime.getTime()

    const entry: TimeEntry = {
      id: Date.now().toString(),
      description: description || "Untitled task",
      startTime,
      endTime,
      duration,
      project: project || undefined,
    }

    setEntries((prev) => [entry, ...prev])

    // Log to Google Sheets if configured
    if (isConfigured) {
      await logToGoogleSheets(entry)
    }

    // Reset timer
    setIsRunning(false)
    setStartTime(null)
    setCurrentTime(0)
    setDescription("")

    toast({
      title: "Time logged",
      description: `Logged ${formatDuration(duration)} for "${entry.description}"`,
    })
  }

  const logToGoogleSheets = async (entry: TimeEntry) => {
    try {
      const formatDateForSheets = (date: Date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
      };

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spreadsheetId,
          sheetName,
          entry: {
            startTime: formatDateForSheets(entry.startTime),
            endTime: formatDateForSheets(entry.endTime),
            duration: formatDuration(entry.duration),
            description: entry.description,
            project: entry.project || "",
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${errorData.message || "Unknown error"}`)
      }

      toast({
        title: "Logged to Google Sheets",
        description: `Entry saved to sheet "${sheetName}"`,
      })
    } catch (error) {
      console.error("Google Sheets Error:", error)
      toast({
        title: "Error logging to Google Sheets",
        description: error instanceof Error ? error.message : "Failed to save entry to spreadsheet",
        variant: "destructive",
      })
    }
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    toast({
      title: "Entry deleted",
      description: "Time entry has been removed",
    })
  }

  return (
    <div className="space-y-6">
      {/* Timer Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary">{formatTime(currentTime)}</div>
            {isRunning && (
              <Badge variant="secondary" className="mt-2">
                Running since {startTime?.toLocaleTimeString()}
              </Badge>
            )}
          </div>

          {/* Task Details */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="description">Task Description</Label>
              <Textarea
                id="description"
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isRunning}
              />
            </div>
            <div>
              <Label htmlFor="project">Project (Optional)</Label>
              <Input
                id="project"
                placeholder="Project name"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center gap-2">
            {!isRunning && !startTime && (
              <Button onClick={startTimer} size="lg">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            {isRunning && (
              <Button onClick={pauseTimer} variant="outline" size="lg">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            {startTime && (
              <Button onClick={stopTimer} variant="destructive" size="lg">
                <Square className="w-4 h-4 mr-2" />
                Stop & Log
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your logged time entries {isConfigured && "(synced with Google Sheets)"}</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No time entries yet. Start tracking to see your logged time here.
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div key={entry.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{entry.description}</h3>
                        {entry.project && <Badge variant="outline">{entry.project}</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.startTime.toLocaleString()} - {entry.endTime.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{formatDuration(entry.duration)}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < entries.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{entries.length}</div>
                <div className="text-sm text-muted-foreground">Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatDuration(entries.reduce((total, entry) => total + entry.duration, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(
                    entries.reduce((total, entry) => total + entry.duration, 0) / (1000 * 60) / entries.length,
                  ) || 0}
                  m
                </div>
                <div className="text-sm text-muted-foreground">Avg Session</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{new Set(entries.map((e) => e.project).filter(Boolean)).size}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 