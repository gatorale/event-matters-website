import { NextRequest, NextResponse } from "next/server";

const SUBSTACK_PUB_ID = process.env.SUBSTACK_PUBLICATION_ID;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  if (SUBSTACK_PUB_ID) {
    const res = await fetch(
      `https://api.substack.com/api/v1/subscriber/${SUBSTACK_PUB_ID}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    // 409 = already subscribed — treat as success
    if (!res.ok && res.status !== 409) {
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
