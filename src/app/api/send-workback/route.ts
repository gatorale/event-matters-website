import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Row types ────────────────────────────────────────────────────────────────
type PhaseRow = {
  isPhase: true;
  phase: string;
  start: string;
  end: string;
};

type MilestoneRow = {
  isPhase: false;
  phase: string;
  name: string;
  owner: string;
  stakeholders: string;
  start: string;
  end: string;
  duration: number | string;
  weeksOut: number | string;
  acknowledged: string;
  description: string;
};

type Row = PhaseRow | MilestoneRow;

// ─── CSV generation ───────────────────────────────────────────────────────────
function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function generateCSV(data: {
  email: string;
  eventName: string;
  eventStart: string;
  eventEnd: string;
  marketingDay: string;
  speakerDay: string;
  runwayMode: string;
  customDurationsCount: number;
  regions: string[];
  generatedAt: string;
  rows: Row[];
}): string {
  const lines: (string | number)[][] = [];

  lines.push(["Event Matters", "Workback Schedule"]);
  lines.push(["eventmatters.co"]);
  lines.push([]);
  lines.push(["Event name:", data.eventName]);
  lines.push(["Event start:", data.eventStart]);
  lines.push(["Event end:", data.eventEnd]);
  lines.push(["Marketing comms day:", data.marketingDay]);
  lines.push(["Speaker comms day:", data.speakerDay]);
  lines.push(["Timeline runway:", data.runwayMode]);
  if (data.customDurationsCount > 0) {
    lines.push([
      "Custom durations:",
      `${data.customDurationsCount} milestone${data.customDurationsCount === 1 ? "" : "s"} edited from defaults`,
    ]);
  }
  lines.push(["Holiday calendars:", data.regions.join("; ")]);
  lines.push(["Generated:", data.generatedAt]);
  lines.push(["Generated for:", data.email]);
  lines.push([]);
  lines.push([
    "Phase",
    "Milestone",
    "Owner",
    "Stakeholders",
    "Start Date",
    "End Date",
    "Duration (workdays)",
    "Weeks Out",
    "Acknowledged",
    "Description",
  ]);

  for (const r of data.rows) {
    if (r.isPhase) {
      lines.push([`-- ${r.phase} --`, "", "", "", r.start, r.end, "", "", "", ""]);
    } else {
      lines.push([
        r.phase,
        r.name,
        r.owner,
        r.stakeholders,
        r.start,
        r.end,
        r.duration,
        r.weeksOut,
        r.acknowledged,
        r.description,
      ]);
    }
  }

  return lines.map((row) => row.map(csvEscape).join(",")).join("\n");
}

// ─── Email HTML ───────────────────────────────────────────────────────────────
function buildEmailHtml(
  eventName: string,
  eventStart: string,
  eventEnd: string,
  runwayMode: string
): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #2C2C2A; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 32px 24px;">

  <div style="border-bottom: 2px solid #00D4AA; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 24px; color: #2D1B4E; margin: 0;">Your workback is ready.</h1>
  </div>

  <p>Your <strong>${eventName}</strong> workback schedule is attached as a CSV.</p>

  <p>Event window: <strong>${eventStart}</strong> &rarr; <strong>${eventEnd}</strong><br>
  Runway mode: <strong>${runwayMode}</strong></p>

  <p>Open it in Excel, Google Sheets, or import it into Asana, Monday, Notion — wherever you plan from. The schedule covers every milestone, owner, and dependency from the lifecycle, with start and end dates calculated on business days.</p>

  <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.1); color: rgba(0,0,0,0.6); font-size: 14px;">
    A reminder: every milestone date is a starting point, not a guarantee. Your event will not be like the events this methodology was built from. Sanity check every milestone against your specific resourcing, budget, and team before committing.
  </p>

  <p style="font-size: 14px; color: rgba(0,0,0,0.6);">
    — Event Matters<br>
    <a href="https://eventmatters.co" style="color: #2D1B4E;">eventmatters.co</a>
  </p>

</body>
</html>`;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Body size cap (~100 KB)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 100_000) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    email,
    eventName,
    eventStart,
    eventEnd,
    marketingDay,
    speakerDay,
    runwayMode,
    customDurationsCount,
    regions,
    generatedAt,
    rows,
  } = body;

  // Validation
  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No schedule data provided" }, { status: 400 });
  }

  const safeEventName = (eventName as string) || "Event";
  const safeRunwayMode = (runwayMode as string) === "min" ? "Sprint" : "Standard";

  // Generate CSV
  const csv = generateCSV({
    email,
    eventName: safeEventName,
    eventStart: (eventStart as string) || "",
    eventEnd: (eventEnd as string) || "",
    marketingDay: (marketingDay as string) || "",
    speakerDay: (speakerDay as string) || "",
    runwayMode: safeRunwayMode,
    customDurationsCount: (customDurationsCount as number) || 0,
    regions: Array.isArray(regions) ? (regions as string[]) : [],
    generatedAt:
      (generatedAt as string) || new Date().toISOString().slice(0, 10),
    rows: rows as Row[],
  });

  // Generate filename
  const slug =
    safeEventName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "event";
  const date = new Date().toISOString().slice(0, 10);
  const filename = `${slug}-workback-${date}.csv`;

  // Send email via Resend
  try {
    await resend.emails.send({
      from: "Event Matters <noreply@resend.eventmatters.co>",
      to: email,
      subject: `Your ${safeEventName} workback schedule`,
      html: buildEmailHtml(
        safeEventName,
        (eventStart as string) || "",
        (eventEnd as string) || "",
        safeRunwayMode
      ),
      attachments: [
        {
          filename,
          content: Buffer.from("﻿" + csv, "utf-8"),
        },
      ],
    });

    console.log(`[send-workback] sent to ${email} for "${safeEventName}"`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-workback] Resend error:", err);
    return NextResponse.json(
      { error: "Email delivery failed. Please try again." },
      { status: 500 }
    );
  }
}
