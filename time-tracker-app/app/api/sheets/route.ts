import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

const credentials = {
  type: "service_account",
  project_id: "one-moon-462119-f9",
  private_key_id: "cefd6ad39752c87d547dfbb25587bfbd939b1c37",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCpzWBfmtCMViO\nohFgvqCIrVsgMgQd+ykx6H+YtJAvGlKt9d9phJb2yzJ0fD70M4RBsBdqIQlOU5i6\nS4mwFyCCVhXAs9E0nClqxVmVmQ5my+kObeHowh/7euv8S9Nszc7p1SiPVyq9xUvC\nXm1skyt+LXq0d/pjEpatpnwbnfjEBwXiFqvm49OtQaVvoWoZg5NtOCwvHuLD3YPH\ngjgq0lqNW+3MVr8YCLNS1Rj6U+BM71m0MsTiqIxuSyvB2MVRRDr+1Kw+op0wLdvY\niSQjNrY9VSgt4/cNAJOMuam57zilDhvU4sI4jGun0BSl7ZHcj/0vkxTNzHtkRx4Y\nYm+y1p/fAgMBAAECggEABpbXclc/tUFrYISu9untEENiCtB2oDcw2U4oB5jRKq8G\n7nmcwvsoixksz5GnJegaiYi2+jI9GOguitvkwM+/m3njiZ7srY29vy4IDs7cFHHB\npWnl1FXB9GbgVy2P7iZ3YyYClfua6Eql+mHs7Vh8B+ztMu++y5zE+gLhP6QU2Dnf\na0/uA5M+KAN4HnwgYfdfBcz7AD5xchpfPj2XDjFj2VKeI3ififPI+/HqBCIzm67n\n+JK8XvEK6TOfFu1xSJXHfFJ8KqLWm5b1sJq8u/BX4tzHUDFZho4eIwFHR+4jfI2g\nLFRc2crKPp1fMSqSmH0/AB6YyRqJP0hFuE8aHIykXQKBgQD6z5a/6PY8uRJBTiMf\n0U/CoehKPPwTYT3FlX/dozOID8kZJLdsijUDCp2SwUAEOWs+YDRiuWUDUT+YX6Vq\n8dJIFRVF9xibMFAbcNS8/Uhfvuu/fhB5J2GLTGOzSr+oVSB1C3+vi5NXrrRRKJWd\nKz0+OIOt7UJyVL9PZo80IHnJCwKBgQDGri7DQew8ZfLLWv0QoeQyDQc1LRu/zUS3\nJLNVMGOtp8+0geqOx9UUpdAFYX9vnq2+9UolRVB6BsVEgbMC5stQFNm14wfuctkL\nv9+i5s1MQfv+7qOUED4UaUCjux+07W1doesZz+u+8HDF6JIy/3Z2HBcWIukxwfvk\njWGjHqbQ/QKBgQDn1DOyhcH9FNAj3vamdVG1RPSykjYqL6rqVCqRkkWSkYy/GeoV\ngJZJjmlh+hCTFwPi7wfc7SLKczJGRLpg5M8K47n7Js/uujSBeMSbP77DCXVdVkgh\nxF3sZRqO4hvPm4fZyFwoxenWlVyE2++XDB2awqAshu7xQRZobRMXCqGnSwKBgBLO\n0mZxiyd8jytpBaPZb3y9dv01s/bIO8UKmF9sIUODK0pvMgEqMaWuvK6FuEacwt3c\n4pP8p82lbm85x/RyXLTMBIAPaeTMwnc2RrlpF+4sIOrVNG8DypysCg513F6IS14d\nwd/DqxF8OXDCv3RMcq5jolvaGjE3p9zO9Xs3n5sRAoGAbRu5XSQxTZLpFoq4XyY3\nDWQ1VE8CW9bpI0O4+zfEbKIi2tWN+82xP09pJr/J06Z45KJvHZZo8fL7taef6XIO\n6csEBZSMFXyXS+6FICFHOetrldnHfaAl8c+HAXCDU8ik8mMoBTX+2K4p65psjYIk\n+sP9poDv0ZjGKc9Cot4WHGE=\n-----END PRIVATE KEY-----\n",
  client_email: "grant-time-sheet@one-moon-462119-f9.iam.gserviceaccount.com",
  client_id: "112381850306590070845",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/grant-time-sheet%40one-moon-462119-f9.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, sheetName, entry } = await request.json()

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // Add total headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!I1:K1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["Total Hours", "Total Minutes", "Total Seconds"]]
      }
    })

    // Add formulas for hours, minutes, and seconds
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!I2:K2`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          // Hours formula - properly wrapped in ARRAYFORMULA
          '=ARRAYFORMULA(SUM(IF(REGEXMATCH(C2:C, "[0-9]+h"), VALUE(REGEXEXTRACT(C2:C, "[0-9]+")), 0)) + QUOTIENT(SUM(ARRAYFORMULA(IF(REGEXMATCH(C2:C, "[0-9]+m"), VALUE(REGEXEXTRACT(C2:C, "[0-9]+")), 0))), 60))',
          // Minutes formula - properly wrapped in ARRAYFORMULA
          '=ARRAYFORMULA(MOD(SUM(IF(REGEXMATCH(C2:C, "[0-9]+m"), VALUE(REGEXEXTRACT(C2:C, "[0-9]+")), 0)), 60))',
          // Seconds formula - always 0 for now since we don't track seconds
          '0'
        ]]
      }
    })

    // Add formatting to make totals stand out
    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
      const sheetId = spreadsheet.data.sheets?.find(s => s.properties?.title === sheetName)?.properties?.sheetId

      if (sheetId) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId,
                    startRowIndex: 0,
                    endRowIndex: 2,
                    startColumnIndex: 8,  // Column I
                    endColumnIndex: 11,   // Column K
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                      textFormat: { bold: true },
                      horizontalAlignment: "CENTER",
                    },
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                },
              },
            ],
          },
        })
      }
    } catch (error) {
      console.error("Error applying formatting:", error)
      // Continue even if formatting fails
    }

    // Prepare the data to append
    const formatDateForSheets = (dateString: string) => {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      return adjustedDate.toLocaleString();
    };

    const values = [
      [
        formatDateForSheets(entry.startTime),
        formatDateForSheets(entry.endTime),
        entry.duration,
        entry.description,
        entry.project || "",
        new Date().toLocaleDateString(),
        new Date().toLocaleTimeString(),
      ],
    ]

    // Append data to the sheet
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:G`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Entry logged to Google Sheets successfully",
      updatedRows: appendResponse.data.updates?.updatedRows,
    })
  } catch (error) {
    console.error("Error logging to Google Sheets:", error)
    return NextResponse.json({ success: false, message: "Failed to log entry to Google Sheets" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spreadsheetId = searchParams.get("spreadsheetId")

    if (!spreadsheetId) {
      return NextResponse.json({ success: false, message: "Spreadsheet ID is required" }, { status: 400 })
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // Get spreadsheet info including all sheets
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    // Extract sheet names
    const sheetNames = response.data.sheets?.map(sheet => sheet.properties?.title).filter(Boolean) || []

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Google Sheets",
      sheetTitle: response.data.properties?.title,
      sheets: sheetNames,
    })
  } catch (error) {
    console.error("Error connecting to Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to connect to Google Sheets. Please check your Spreadsheet ID." },
      { status: 500 },
    )
  }
}
