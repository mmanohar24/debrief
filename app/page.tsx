"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [meetingTitle, setMeetingTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/process-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingTitle, transcript, attendees: [] }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const { runId, hookId } = await res.json();
      // runId = WDK run ID for status polling; hookId = UUID for review gate
      router.push(`/run/${runId}?h=${hookId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "640px", margin: "0 auto" }}>
      <h1>Debrief</h1>
      <p>Paste a meeting transcript to extract action items, decisions, and more.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="meetingTitle">
            <strong>Meeting Title</strong>
          </label>
          <br />
          <input
            id="meetingTitle"
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="e.g. Q2 Planning Meeting"
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="transcript">
            <strong>Meeting Transcript</strong>
          </label>
          <br />
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here…"
            required
            rows={12}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", resize: "vertical" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: "0.75rem 2rem" }}>
          {loading ? "Starting…" : "Run Debrief"}
        </button>
      </form>
    </main>
  );
}
