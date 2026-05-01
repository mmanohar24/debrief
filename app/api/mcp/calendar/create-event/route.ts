import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, date, attendees, description } = await req.json();

  const token = process.env.GOOGLE_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GOOGLE_ACCESS_TOKEN not configured" }, { status: 503 });
  }

  // Use all-day event format when only a date (no time) is supplied.
  const dateValue = (date as string | undefined)?.split("T")[0] ?? "";

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: title,
        description: description ?? "",
        start: { date: dateValue },
        end: { date: dateValue },
        attendees: Array.isArray(attendees)
          ? (attendees as string[]).map((email) => ({ email }))
          : [],
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const errorText = JSON.stringify(data);
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  return NextResponse.json({ eventId: data.id });
}
