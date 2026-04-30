import { NextRequest, NextResponse } from "next/server";

const SUBSTACK_PUB_ID = process.env.SUBSTACK_PUBLICATION_ID;
const RESEND_API_KEY  = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  const { firstName, email, mode } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  /* ── 1. Substack subscription / verification (skipped if not configured) ── */
  if (SUBSTACK_PUB_ID) {
    if (mode === "subscribe") {
      const substackRes = await fetch(
        `https://api.substack.com/api/v1/subscriber/${SUBSTACK_PUB_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            first_name: firstName || undefined,
            tags: ["calculator"],
          }),
        }
      );
      if (!substackRes.ok && substackRes.status !== 409) {
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 502 });
      }
    } else {
      const checkRes = await fetch(
        `https://api.substack.com/api/v1/subscriber/${SUBSTACK_PUB_ID}/find?email=${encodeURIComponent(email)}`
      );
      if (!checkRes.ok) {
        return NextResponse.json(
          { error: "Email not found in subscriber list. Please subscribe first." },
          { status: 404 }
        );
      }
    }
  }

  /* ── 2. Send confirmation email via Resend (skipped if not configured) ── */
  if (RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Event Matters <news@eventmatters.co>",
        to: email,
        subject: "Your conference ticket pricing summary",
        html: buildEmailHtml(firstName),
      }),
    });
  }

  return NextResponse.json({ ok: true });
}

function buildEmailHtml(firstName: string) {
  const name = firstName ? `Hi ${firstName},` : "Hi there,";
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2C2C2A;">
      <div style="background:#2D1B4E;padding:24px 32px;border-radius:8px 8px 0 0;">
        <p style="color:#FAF9F7;font-size:20px;font-weight:600;margin:0;">
          Event <span style="color:#00D4AA;">Matters</span>
        </p>
      </div>
      <div style="padding:32px;background:#FAF9F7;border-radius:0 0 8px 8px;">
        <p>${name}</p>
        <p>Thanks for using the Event Matters ticket pricing calculator.</p>
        <p>Your export is attached — you'll find PDF, Excel, and Google Sheets versions of your results.</p>
        <p style="margin-top:24px;">
          <a href="https://eventmatters.co/#calculator"
             style="background:#00D4AA;color:#2D1B4E;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:600;">
            Back to the calculator
          </a>
        </p>
        <p style="margin-top:32px;font-size:13px;color:#888;">
          You're receiving this because you used the Event Matters ticket pricing calculator.
          <br>
          <a href="https://blog.eventmatters.co" style="color:#00D4AA;">Manage your subscription</a>
        </p>
      </div>
    </div>
  `;
}
