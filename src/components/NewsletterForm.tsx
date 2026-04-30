"use client";

import { useState } from "react";

const C = {
  plum:     "#2D1B4E",
  teal:     "#00D4AA",
  tealTint: "#E8FAF6",
  tealDark: "#005C47",
  ivory:    "#FAF9F7",
  charcoal: "#2C2C2A",
};

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className="rounded-sm px-6 py-4 text-center"
        style={{ background: C.teal, color: C.plum, fontFamily: "var(--font-inter)" }}
      >
        <p className="font-semibold text-base">You&apos;re subscribed ✓</p>
        <p className="text-sm mt-1" style={{ color: "rgba(45,27,78,0.75)" }}>
          Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 4,
          border: "1px solid rgba(45,27,78,0.2)",
          fontSize: 14,
          fontFamily: "var(--font-inter)",
          color: C.charcoal,
          background: "#ffffff",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          background: C.plum,
          color: C.ivory,
          border: "none",
          borderRadius: 4,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "var(--font-inter)",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {status === "loading" ? "Subscribing…" : "Subscribe →"}
      </button>
      {status === "error" && (
        <p
          className="text-xs text-center w-full"
          style={{ color: "#cc0000", fontFamily: "var(--font-inter)" }}
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
}
