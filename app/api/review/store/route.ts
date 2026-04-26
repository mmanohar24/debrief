import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo. Use Redis/KV in production.
const reviewStore = new Map<string, unknown>();

export async function POST(req: NextRequest) {
  const { runId, extraction } = await req.json();
  reviewStore.set(runId, extraction);
  return NextResponse.json({ stored: true });
}

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId");
  const extraction = reviewStore.get(runId!) ?? null;
  return NextResponse.json({ extraction });
}
