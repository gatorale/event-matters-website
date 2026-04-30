import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(req: NextRequest) {
  const { email, format, preConEnabled } = await req.json();

  if (!email || !format) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Gracefully skip if Supabase is not configured
  if (SUPABASE_URL && SUPABASE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    await supabase.from("calculator_submissions").insert({
      email,
      format_requested: format,
      pre_conference_enabled: preConEnabled ?? false,
    });
  }

  return NextResponse.json({ ok: true });
}
