import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface LinkManagerProps {
  spreadsheetId: string
  sheetName: string
  isConfigured: boolean
}

export default function LinkManager({ spreadsheetId, sheetName, isConfigured }: LinkManagerProps) {
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/sheets/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spreadsheetId,
          sheetName,
          link: {
            url,
            description: description || "No description",
            dateAdded: new Date().toLocaleString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save link")
      }

      toast({
        title: "Link saved!",
        description: "Your link has been added to the sheet",
      })

      // Reset form
      setUrl("")
      setDescription("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save link to Google Sheets",
        variant: "destructive",
      })
    }
  }

  if (!isConfigured) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="What is this link for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit">Save Link</Button>
        </form>
      </CardContent>
    </Card>
  )
} 