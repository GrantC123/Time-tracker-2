import { google } from "googleapis"
import { NextResponse } from "next/server"
import { getGoogleAuth } from "@/lib/google"

export async function POST(request: Request) {
  try {
    const { spreadsheetId, sheetName, link } = await request.json()

    if (!spreadsheetId || !sheetName || !link?.url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // First, check if the "Links" sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    let linksSheetExists = spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === "Links"
    )

    // If the Links sheet doesn't exist, create it with headers
    if (!linksSheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: "Links",
                },
              },
            },
          ],
        },
      })

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Links!A1:C1",
        valueInputOption: "RAW",
        requestBody: {
          values: [["URL", "Description", "Date Added"]],
        },
      })
    }

    // Append the new link
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Links!A:C",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[link.url, link.description, link.dateAdded]],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving link:", error)
    return NextResponse.json(
      { error: "Failed to save link" },
      { status: 500 }
    )
  }
} 