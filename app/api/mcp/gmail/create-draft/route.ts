import { NextRequest, NextResponse } from "next/server";
import { callMCP } from "@/lib/mcp";

type ActionItem = { title: string; owner?: string; dueDate?: string; priority?: string };
type Tone = "internal" | "client" | "executive";

function buildBody(params: {
  tone: Tone;
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  openQuestions: string[];
}): string {
  const { tone, summary, decisions, actionItems, openQuestions } = params;

  const decisionsBlock =
    decisions.length > 0
      ? `Decisions Made:\n${decisions.map((d) => `• ${d}`).join("\n")}`
      : "";

  const actionsBlock =
    actionItems.length > 0
      ? `Action Items:\n${actionItems
          .map((a) => {
            const owner = a.owner ? `@${a.owner}` : "Unassigned";
            const due = a.dueDate ? ` — Due ${a.dueDate}` : "";
            return `• ${owner} — ${a.title}${due}`;
          })
          .join("\n")}`
      : "";

  const questionsBlock =
    openQuestions.length > 0
      ? `Open Questions:\n${openQuestions.map((q) => `• ${q}`).join("\n")}`
      : "";

  if (tone === "internal") {
    return [
      summary,
      "",
      decisionsBlock,
      actionsBlock,
      questionsBlock,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (tone === "client") {
    return [
      "Hi,",
      "",
      "Thank you for your time today. Here is a summary of what we covered.",
      "",
      summary,
      "",
      decisionsBlock,
      actionsBlock,
      questionsBlock.length > 0
        ? `Items Requiring Follow-up:\n${openQuestions.map((q) => `• ${q}`).join("\n")}`
        : "",
      "",
      "Please let me know if you have any questions.",
      "",
      "Best regards",
    ]
      .filter((l) => l !== undefined)
      .join("\n");
  }

  // executive — brevity first
  const actionsSummary =
    actionItems.length > 0
      ? `Next Steps (${actionItems.length}):\n${actionItems
          .slice(0, 5)
          .map((a) => `• ${a.owner ? `${a.owner}: ` : ""}${a.title}`)
          .join("\n")}`
      : "";

  return [
    summary,
    "",
    decisionsBlock,
    actionsSummary,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildReminderBody(incompleteTasks: unknown[]): string {
  const tasks = incompleteTasks as ActionItem[];
  return [
    `48-hour follow-up: ${tasks.length} action item${tasks.length !== 1 ? "s" : ""} from this meeting ${tasks.length !== 1 ? "are" : "is"} still open.`,
    "",
    tasks.map((t) => `• ${t.owner ? `@${t.owner} — ` : ""}${t.title}`).join("\n"),
    "",
    "Please update the status in Notion when complete.",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const {
    to,
    subject,
    summary,
    decisions,
    actionItems,
    openQuestions,
    tone,
    isReminder,
    incompleteTasks,
  } = await req.json();

  const token = process.env.GOOGLE_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GOOGLE_ACCESS_TOKEN not configured" }, { status: 503 });
  }

  const body = isReminder
    ? buildReminderBody(incompleteTasks ?? [])
    : buildBody({
        tone: (tone as Tone) ?? "internal",
        summary: summary ?? "",
        decisions: decisions ?? [],
        actionItems: actionItems ?? [],
        openQuestions: openQuestions ?? [],
      });

  const result = await callMCP(
    "https://gmailmcp.googleapis.com/mcp/v1",
    "create_draft",
    { to, subject, body },
    token
  );

  return NextResponse.json(result);
}
