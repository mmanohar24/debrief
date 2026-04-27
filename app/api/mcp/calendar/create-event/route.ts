import { NextRequest, NextResponse } from "next/server";
import { callMCP } from "@/lib/mcp";

export async function POST(req: NextRequest) {
  const { title, date, attendees, description } = await req.json();

  const token = process.env.GOOGLE_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GOOGLE_ACCESS_TOKEN not configured" }, { status: 503 });
  }

  // Use all-day event format when only a date (no time) is supplied.
  const dateValue = (date as string | undefined)?.split("T")[0] ?? "";

  const result = await callMCP(
    "https://calendarmcp.googleapis.com/mcp/v1",
    "create_event",
    {
      summary: title,
      description: description ?? "",
      start: { date: dateValue },
      end: { date: dateValue },
      attendees: Array.isArray(attendees)
        ? (attendees as string[]).map((email) => ({ email }))
        : [],
    },
    token
  );

  return NextResponse.json(result);
}
