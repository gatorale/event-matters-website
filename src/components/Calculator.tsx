"use client";

import React, { useState, useCallback } from "react";
import type { CalculateResponse } from "@/app/api/calculate/route";
import type { CalcForm } from "@/types/calculator";
import { downloadPDF } from "@/lib/export-pdf";

/* ─── colours ──────────────────────────────────────────────────────────────── */
const C = {
  plum:     "#2D1B4E",
  teal:     "#00D4AA",
  tealDark: "#005C47",
  tealTint: "#E8FAF6",
  violet:   "#5C3D8A",
  ivory:    "#FAF9F7",
  charcoal: "#2C2C2A",
};

const CURRENCIES = [
  { label: "USD", symbol: "$" },
  { label: "CAD", symbol: "CA$" },
  { label: "GBP", symbol: "£" },
  { label: "EUR", symbol: "€" },
  { label: "AUD", symbol: "A$" },
];

/* ─── form states ───────────────────────────────────────────────────────────── */
const DEFAULTS: CalcForm = {
  netProfit: 50000,
  expenses: 200000,
  sponsorship: 50000,
  commissionRate: 10,
  totalRegistrations: 300,
  priceIncreaseRate: 20,
  earlyBirdPct: 30,
  standardPct: 60,
  fullPricePct: 10,
  preConEnabled: false,
  preConNetProfit: 20000,
  honorariumPerAttendee: 200,
  preConAttendancePct: 30,
};

const EMPTY: CalcForm = {
  netProfit: 0,
  expenses: 0,
  sponsorship: 0,
  commissionRate: 0,
  totalRegistrations: 0,
  priceIncreaseRate: 0,
  earlyBirdPct: 0,
  standardPct: 0,
  fullPricePct: 0,
  preConEnabled: false,
  preConNetProfit: 0,
  honorariumPerAttendee: 0,
  preConAttendancePct: 0,
};

type FormState = CalcForm;

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-CA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ─── Tooltip ──────────────────────────────────────────────────────────────── */
function Tip({ text }: { text: string }) {
  return (
    <span className="tip-wrap" style={{ position: "relative", display: "inline-block", marginLeft: 4 }}>
      <span
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 15, height: 15, borderRadius: "50%",
          border: `1px solid ${C.teal}`, color: C.teal,
          fontSize: 10, fontWeight: 600, cursor: "default",
          lineHeight: 1, fontFamily: "var(--font-inter)",
        }}
        aria-label={text}
      >?</span>
      <span className="tip-box" style={{
        display: "none", position: "absolute",
        bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
        background: C.charcoal, color: C.ivory,
        fontSize: 12, padding: "8px 10px", borderRadius: 4,
        width: 220, lineHeight: 1.4, zIndex: 10,
        fontFamily: "var(--font-inter)", pointerEvents: "none", whiteSpace: "normal",
      }}>
        {text}
      </span>
    </span>
  );
}

/* ─── Input field ───────────────────────────────────────────────────────────── */
function Field({
  label, prefix, suffix, value, onChange, tip,
  min = 0, step = 1, max, bg,
}: {
  label: string; prefix?: string; suffix?: string;
  value: number; onChange: (v: number) => void;
  tip?: string; min?: number; step?: number; max?: number;
  bg?: string;
}) {
  const inputBg = bg ?? C.tealTint;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium flex items-center" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
        {label}
        {tip && <Tip text={tip} />}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: C.tealDark, fontFamily: "var(--font-inter)", fontSize: 14,
            fontWeight: 500, pointerEvents: "none", zIndex: 1,
          }}>{prefix}</span>
        )}
        <input
          type="number" value={value === 0 ? "" : value} placeholder="0" min={min} max={max} step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{
            width: "100%", background: inputBg,
            border: "1px solid rgba(0,212,170,0.3)", borderRadius: 4,
            padding: prefix ? "6px 10px 6px 28px" : suffix ? "6px 36px 6px 10px" : "6px 10px",
            fontSize: 14, color: C.charcoal, fontFamily: "var(--font-inter)", outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = C.teal)}
          onBlur={(e) => (e.target.style.borderColor = "rgba(0,212,170,0.3)")}
        />
        {suffix && (
          <span style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            color: C.tealDark, fontFamily: "var(--font-inter)", fontSize: 14,
            fontWeight: 500, pointerEvents: "none",
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Section header ────────────────────────────────────────────────────────── */
function SectionHead({ title }: { title: string }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-widest pt-2 pb-1"
      style={{ color: C.plum, fontFamily: "var(--font-inter)", borderBottom: `1px solid ${C.tealTint}` }}
    >
      {title}
    </p>
  );
}

/* ─── Price badge ───────────────────────────────────────────────────────────── */
function PriceBadge({ label, price, small, currencySymbol = "$" }: { label: string; price: number; small?: boolean; currencySymbol?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg p-3 gap-1"
      style={{ background: C.tealTint, minWidth: 0, overflow: "hidden" }}
    >
      <span style={{
        fontSize: small ? "clamp(13px,1.8vw,18px)" : "clamp(14px,2.2vw,22px)",
        fontWeight: 700, color: C.plum, fontFamily: "var(--font-outfit)",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
      }}>
        {currencySymbol}{fmt(price)}
      </span>
      <span style={{ fontSize: 11, color: C.tealDark, fontFamily: "var(--font-inter)", whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Summary row ───────────────────────────────────────────────────────────── */
function SummaryRow({ label, value, highlight, indent }: {
  label: string; value: string; highlight?: boolean; indent?: boolean;
}) {
  return (
    <div
      className="flex justify-between items-baseline py-1.5"
      style={{ borderBottom: "1px solid rgba(45,27,78,0.07)", paddingLeft: indent ? 12 : 0 }}
    >
      <span style={{
        fontSize: highlight ? 14 : 13, fontWeight: highlight ? 600 : 400,
        color: highlight ? C.plum : C.charcoal, fontFamily: "var(--font-inter)",
      }}>{label}</span>
      <span style={{
        fontSize: highlight ? 14 : 13, fontWeight: highlight ? 700 : 500,
        color: highlight ? C.plum : C.charcoal, fontFamily: "var(--font-inter)", marginLeft: 12,
      }}>{value}</span>
    </div>
  );
}

/* ─── Disclaimer ────────────────────────────────────────────────────────────── */
function Disclaimer() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-medium flex items-center gap-2"
        style={{ color: C.charcoal, fontFamily: "var(--font-inter)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span style={{ fontSize: 12, transform: open ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.15s" }}>▶</span>
        Important note about this calculator
      </button>
      {open && (
        <div style={{ marginTop: 10, borderLeft: `3px solid ${C.violet}`, paddingLeft: 14, paddingTop: 10, paddingBottom: 10 }}>
          <p className="text-sm leading-relaxed" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
            This calculator is a planning tool based on the information you enter.
            Results are estimates only and should not be treated as financial advice.
            Event Matters accepts no liability for decisions made based on calculator
            outputs. Always verify your figures with your accountant or financial
            adviser before setting ticket prices.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main calculator ───────────────────────────────────────────────────────── */
export default function Calculator() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [results, setResults] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [splitTouched, setSplitTouched] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [copied, setCopied] = useState(false);

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((f) => ({ ...f, [key]: value })),
    []
  );

  const calculateWith = useCallback(async (formData: FormState) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) return; // leave previous results in place, no error shown
      const data: CalculateResponse = await res.json();
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const calculate = useCallback(() => calculateWith(form), [calculateWith, form]);

  const maybeRecalc = useCallback((next: FormState) => {
    if (!results) return;
    const splitOk = Math.abs(next.earlyBirdPct + next.standardPct + next.fullPricePct - 100) < 0.01;
    if (!splitOk) return;
    if (next.totalRegistrations <= 0) return;
    if (next.expenses <= 0) return;
    if (next.priceIncreaseRate <= 0) return;
    if (next.preConEnabled && next.preConAttendancePct <= 0) return;
    calculateWith(next);
  }, [results, calculateWith]);

  const reset = useCallback(() => {
    setForm(EMPTY);
    setResults(null);
    setError(null);
    setSplitTouched(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!results) return;
    const c = currencySymbol;
    let text = `Main Conference: Early Bird ${c}${fmt(results.mainCon.earlyBird)} | Standard ${c}${fmt(results.mainCon.standard)} | Full Price ${c}${fmt(results.mainCon.fullPrice)}`;
    if (results.preCon) {
      text += `\nPre-Conference: Early Bird ${c}${fmt(results.preCon.earlyBird)} | Standard ${c}${fmt(results.preCon.standard)} | Full Price ${c}${fmt(results.preCon.fullPrice)}`;
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [results, currencySymbol]);

  const splitValid =
    Math.abs(form.earlyBirdPct + form.standardPct + form.fullPricePct - 100) < 0.01;

  return (
    <div style={{ background: "#ffffff" }} className="px-6 py-12 lg:px-10">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>

        {/* Two-column grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "flex-start" }}
          className="calc-grid"
        >
          {/* ─── LEFT: Inputs ─────────────────────────────────────────────── */}
          <div style={{ minWidth: 0 }} className="flex flex-col gap-3">

            {/* Currency selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>Currency:</span>
              <div className="flex gap-1 flex-wrap">
                {CURRENCIES.map(({ label, symbol }) => (
                  <button
                    key={label}
                    onClick={() => setCurrencySymbol(symbol)}
                    style={{
                      padding: "3px 8px", fontSize: 12,
                      border: `1px solid ${currencySymbol === symbol ? C.teal : "rgba(0,212,170,0.3)"}`,
                      borderRadius: 4,
                      background: currencySymbol === symbol ? C.tealTint : "transparent",
                      color: currencySymbol === symbol ? C.tealDark : C.charcoal,
                      fontFamily: "var(--font-inter)",
                      fontWeight: currencySymbol === symbol ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <SectionHead title="Conference financials" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Target net profit" prefix={currencySymbol}
                value={form.netProfit}
                onChange={(v) => { const n = { ...form, netProfit: v }; setForm(n); maybeRecalc(n); }}
                tip="The amount of expected profit after all expenses are paid." />

              <Field label="Total operating expenses" prefix={currencySymbol}
                value={form.expenses}
                onChange={(v) => { const n = { ...form, expenses: v }; setForm(n); maybeRecalc(n); }}
                tip="Total event costs, including venue, AV, catering, speakers, F&B, etc. Pre-conference honorarium excluded if using the pre-conference add-on." />

              <Field label="Gross sponsorship revenue" prefix={currencySymbol}
                value={form.sponsorship}
                onChange={(v) => { const n = { ...form, sponsorship: v }; setForm(n); maybeRecalc(n); }}
                tip="Total sponsorship revenue before deducting sponsorship commission rate." />

              <Field label="Sponsorship commission rate" suffix="%"
                value={form.commissionRate}
                onChange={(v) => { const n = { ...form, commissionRate: v }; setForm(n); maybeRecalc(n); }}
                tip="Commission rate to be deducted from gross sponsorship revenue. Enter 0 if none applies."
                min={0} max={100} step={0.5} />
            </div>

            <SectionHead title="Registration" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Total projected registrants" prefix="#"
                value={form.totalRegistrations}
                onChange={(v) => { const n = { ...form, totalRegistrations: Math.max(1, Math.round(v)) }; setForm(n); maybeRecalc(n); }}
                tip="Expected number of paid conference registrants." min={1} />

              <Field label="Tier price increase rate" suffix="%"
                value={form.priceIncreaseRate}
                onChange={(v) => { const n = { ...form, priceIncreaseRate: v }; setForm(n); maybeRecalc(n); }}
                tip="The rate of increase between tier prices." min={0} max={100} step={1} />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
                Registration purchase split
                <Tip text="The rate at which you expect attendees to register per tier price across early bird, standard, and full price. Must add up to 100%." />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {(["earlyBirdPct", "standardPct", "fullPricePct"] as const).map((key, i) => (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
                      {["Early Bird", "Standard", "Full Price"][i]}
                    </span>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number" min={0} max={100} step={1}
                        value={form[key] === 0 ? "" : form[key]}
                        placeholder="0"
                        onChange={(e) => { setSplitTouched(true); const v = parseFloat(e.target.value) || 0; const n = { ...form, [key]: v }; setForm(n); maybeRecalc(n); }}
                        style={{
                          width: "100%", background: C.tealTint,
                          border: `1px solid ${splitTouched && !splitValid ? "#ff4444" : "rgba(0,212,170,0.3)"}`,
                          borderRadius: 4, padding: "6px 28px 6px 10px",
                          fontSize: 14, color: C.charcoal, fontFamily: "var(--font-inter)", outline: "none",
                        }}
                      />
                      <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: C.tealDark, fontSize: 14, pointerEvents: "none" }}>%</span>
                    </div>
                  </div>
                ))}
              </div>
              {splitTouched && !splitValid && (
                <p className="text-xs mt-1" style={{ color: "#cc0000" }}>
                  Must sum to 100% (currently {form.earlyBirdPct + form.standardPct + form.fullPricePct}%)
                </p>
              )}
            </div>

            {/* ─── Pre-conference toggle ─────────────────────────────────── */}
            <div
              className="rounded-lg p-4"
              style={{ border: "1px solid rgba(0,212,170,0.25)", background: form.preConEnabled ? C.tealTint : "#fafafa" }}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.preConEnabled}
                  onChange={(e) => {
                    const n = { ...form, preConEnabled: e.target.checked };
                    setForm(n);
                    maybeRecalc(n);
                  }}
                  style={{ accentColor: C.teal, width: 16, height: 16 }}
                />
                <span className="text-sm font-semibold" style={{ color: C.plum, fontFamily: "var(--font-inter)" }}>
                  Include pre-conference workshop pricing
                </span>
              </label>

              {form.preConEnabled && (
                <div className="flex flex-col gap-4 mt-4">
                  <Field label="Pre-conference net profit target" prefix={currencySymbol}
                    value={form.preConNetProfit}
                    onChange={(v) => { const n = { ...form, preConNetProfit: v }; setForm(n); maybeRecalc(n); }}
                    tip="The profit you want the pre-conference workshop to generate, above its own costs."
                    bg={C.ivory} />

                  <Field label="Honorarium per pre-conference attendee" prefix={currencySymbol}
                    value={form.honorariumPerAttendee}
                    onChange={(v) => { const n = { ...form, honorariumPerAttendee: v }; setForm(n); maybeRecalc(n); }}
                    tip="Speaker or facilitator honorarium cost per pre-conference attendee. This is the main variable cost for the workshop."
                    bg={C.ivory} />

                  <Field label="Pre-conference attendance" suffix="%"
                    value={form.preConAttendancePct}
                    onChange={(v) => { const n = { ...form, preConAttendancePct: v }; setForm(n); maybeRecalc(n); }}
                    tip="Percentage of main conference registrants expected to attend a pre-conference workshop."
                    min={1} max={100} bg={C.ivory} />
                </div>
              )}
            </div>

            {/* Calculate button */}
            <button
              onClick={calculate}
              disabled={loading || !splitValid}
              className="w-full rounded-sm py-3 text-base transition-opacity"
              style={{
                backgroundColor: "#2D1B4E",
                color: "#FAF9F7",
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                cursor: loading || !splitValid ? "not-allowed" : "pointer",
                opacity: loading || !splitValid ? 0.6 : 1,
                border: "none",
              }}
            >
              {loading ? "Calculating…" : "Calculate ticket prices →"}
            </button>

            {error && (
              <p className="text-sm" style={{ color: "#cc0000", fontFamily: "var(--font-inter)" }}>{error}</p>
            )}
          </div>

          {/* ─── RIGHT: Results ──────────────────────────────────────────────── */}
          <div style={{ minWidth: 0, position: "sticky", top: 80 }}>
            {!results ? (
              <div
                className="rounded-lg flex items-center justify-center py-20 text-center"
                style={{ background: C.tealTint }}
              >
                <p className="text-sm" style={{ color: C.tealDark, fontFamily: "var(--font-inter)" }}>
                  Enter your figures and click{" "}
                  <strong>Calculate ticket prices</strong> to see results.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Main conference prices */}
                <div className="rounded-lg p-5" style={{ border: "1px solid rgba(45,27,78,0.12)", background: C.ivory }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                    style={{ color: "#2D1B4E", fontFamily: "var(--font-inter)" }}>
                    Main conference prices
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    <PriceBadge label="Early Bird" price={results.mainCon.earlyBird} currencySymbol={currencySymbol} />
                    <PriceBadge label="Standard" price={results.mainCon.standard} currencySymbol={currencySymbol} />
                    <PriceBadge label="Full Price" price={results.mainCon.fullPrice} currencySymbol={currencySymbol} />
                  </div>
                </div>

                {/* Pre-conference prices */}
                {results.preCon && (
                  <div className="rounded-lg p-5" style={{ border: "1px solid rgba(45,27,78,0.12)", background: C.ivory }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                      style={{ color: C.violet, fontFamily: "var(--font-inter)" }}>
                      Pre-conference workshop prices
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      <PriceBadge label="Early Bird" price={results.preCon.earlyBird} small currencySymbol={currencySymbol} />
                      <PriceBadge label="Standard" price={results.preCon.standard} small currencySymbol={currencySymbol} />
                      <PriceBadge label="Full Price" price={results.preCon.fullPrice} small currencySymbol={currencySymbol} />
                    </div>
                  </div>
                )}

                {/* Copy prices button */}
                <button
                  onClick={handleCopy}
                  style={{
                    alignSelf: "flex-start",
                    padding: "5px 14px", fontSize: 13,
                    border: `1px solid ${C.teal}`,
                    borderRadius: 4,
                    background: "transparent",
                    color: copied ? C.tealDark : C.teal,
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "opacity 0.15s",
                  }}
                >
                  {copied ? "Copied ✓" : "Copy prices →"}
                </button>

                {/* Revenue Summary */}
                <div className="rounded-lg p-5" style={{ border: "1px solid rgba(45,27,78,0.12)", background: "#ffffff" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
                    Revenue summary
                  </p>
                  <SummaryRow label="Net sponsorship income" value={`${currencySymbol}${fmt(results.summary.netSponsorshipIncome)}`} />
                  <SummaryRow label="Registration revenue" value={`${currencySymbol}${fmt(results.summary.registrationRevenue)}`} />
                  {results.preCon && (
                    <SummaryRow label="Pre-conference revenue" value={`${currencySymbol}${fmt(results.summary.preConRevenue)}`} indent />
                  )}
                  <SummaryRow label="Total revenue" value={`${currencySymbol}${fmt(results.summary.totalRevenue)}`} highlight />
                  <SummaryRow label="Total expenses" value={`${currencySymbol}${fmt(results.summary.expenses)}`} />
                  <SummaryRow label="Net profit" value={`${currencySymbol}${fmt(results.summary.netProfit)}`} highlight />
                  <SummaryRow
                    label={results.summary.variance >= 0 ? "Surplus vs. target" : "Shortfall vs. target"}
                    value={`${results.summary.variance >= 0 ? "+" : ""}${currencySymbol}${fmt(Math.abs(results.summary.variance))}`}
                  />
                </div>

                <Disclaimer />

                {/* Download */}
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full rounded-sm py-3 text-base transition-opacity hover:opacity-90"
                    disabled={showGate}
                    style={{
                      background: C.plum, color: C.ivory,
                      fontFamily: "var(--font-inter)", fontWeight: 600,
                      border: "none",
                      cursor: showGate ? "not-allowed" : "pointer",
                      opacity: showGate ? 0.7 : 1,
                    }}
                    onClick={() => setShowGate(true)}
                  >
                    {showGate ? "Sending…" : "Download summary →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Marcella line */}
        <p className="text-center text-sm mt-12" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
          Built by{" "}
          <a href="/about" style={{ color: C.violet, borderBottom: `1px solid ${C.violet}`, paddingBottom: 1 }}>
            Marcella McKeown
          </a>
        </p>
      </div>

      {/* Email gate modal */}
      {showGate && results && (
        <EmailGate onClose={() => setShowGate(false)} results={results} form={form} currencySymbol={currencySymbol} />
      )}

      {/* Tooltip CSS */}
      <style>{`
        .tip-wrap:hover .tip-box { display: block !important; }
        @media (max-width: 768px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Email gate modal ──────────────────────────────────────────────────────── */
function EmailGate({
  onClose, results, form, currencySymbol,
}: {
  onClose: () => void;
  results: CalculateResponse;
  form: FormState;
  currencySymbol: string;
}) {
  const [mode, setMode] = useState<"subscribe" | "existing">("subscribe");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, mode, results }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePDF() {
    setDownloading("pdf");
    try {
      await downloadPDF(results, form, currencySymbol);
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, format: "pdf", preConEnabled: form.preConEnabled }),
      }).catch(() => {});
    } finally {
      setDownloading(null);
    }
  }

  async function handleExcel() {
    setDownloading("excel");
    try {
      const res = await fetch("/api/export/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results, form, currencySymbol }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const d = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `event-matters-ticket-pricing-${d}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, format: "excel", preConEnabled: form.preConEnabled }),
      }).catch(() => {});
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(45,27,78,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#ffffff", borderRadius: 8, padding: 32, maxWidth: 440, width: "100%", position: "relative" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: C.charcoal, fontSize: 20, lineHeight: 1 }}
          aria-label="Close"
        >×</button>

        {done ? (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xl font-bold mb-1" style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}>
                You&apos;re all set ✓
              </p>
              <p className="text-sm" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
                Download your results below. A confirmation has been sent to <strong>{email}</strong>.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <DownloadButton
                label="Download PDF"
                sublabel="Branded report — print or share"
                icon="📄"
                loading={downloading === "pdf"}
                onClick={handlePDF}
                bg={C.plum}
                color={C.ivory}
              />
              <DownloadButton
                label="Download Excel"
                sublabel="2 sheets: summary + pre-conference"
                icon="📊"
                loading={downloading === "excel"}
                onClick={handleExcel}
                bg={C.teal}
                color={C.plum}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-xl font-bold mb-1" style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}>
              Download your summary
            </p>
            <p className="text-sm mb-6" style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}>
              Enter your email to get PDF and Excel versions of your results — free.
            </p>

            <div className="flex gap-2 mb-5">
              {(["subscribe", "existing"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: "6px 0", fontSize: 13,
                    background: mode === m ? C.tealTint : "transparent",
                    border: `1px solid ${mode === m ? C.teal : "rgba(45,27,78,0.2)"}`,
                    borderRadius: 4, cursor: "pointer",
                    color: mode === m ? C.tealDark : C.charcoal,
                    fontFamily: "var(--font-inter)", fontWeight: mode === m ? 600 : 400,
                  }}
                >
                  {m === "subscribe" ? "New subscriber" : "Already subscribed?"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3">
              {mode === "subscribe" && (
                <input
                  type="text" placeholder="First name" value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: "100%", padding: "9px 12px",
                    border: "1px solid rgba(45,27,78,0.2)", borderRadius: 4,
                    fontSize: 14, color: C.charcoal, fontFamily: "var(--font-inter)",
                    outline: "none", background: C.tealTint,
                  }}
                />
              )}
              <input
                type="email" placeholder="Email address" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid rgba(45,27,78,0.2)", borderRadius: 4,
                  fontSize: 14, color: C.charcoal, fontFamily: "var(--font-inter)",
                  outline: "none", background: C.tealTint,
                }}
              />
              {error && <p className="text-xs" style={{ color: "#cc0000" }}>{error}</p>}
              <button
                type="submit" disabled={submitting}
                style={{
                  background: C.plum, color: C.ivory,
                  border: "none", borderRadius: 4,
                  padding: "10px 0", fontSize: 14, fontWeight: 600,
                  fontFamily: "var(--font-inter)",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting
                  ? "Confirming…"
                  : mode === "subscribe"
                  ? "Subscribe & get downloads →"
                  : "Verify & get downloads →"}
              </button>
              <p className="text-xs text-center" style={{ color: "rgba(44,44,42,0.5)", fontFamily: "var(--font-inter)" }}>
                {mode === "subscribe"
                  ? "You'll be added to the Event Matters newsletter. Unsubscribe any time."
                  : "We'll verify your subscription and unlock your downloads."}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Download button ───────────────────────────────────────────────────────── */
function DownloadButton({
  label, sublabel, icon, loading, onClick, bg, color,
}: {
  label: string; sublabel: string; icon: string;
  loading: boolean; onClick: () => void;
  bg: string; color: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: bg, color, border: "none",
        borderRadius: 6, padding: "12px 16px",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1,
        textAlign: "left", width: "100%",
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>{loading ? "⏳" : icon}</span>
      <span className="flex flex-col gap-0.5">
        <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-inter)" }}>
          {loading ? "Generating…" : label}
        </span>
        <span style={{ fontSize: 11, opacity: 0.75, fontFamily: "var(--font-inter)" }}>
          {sublabel}
        </span>
      </span>
    </button>
  );
}
