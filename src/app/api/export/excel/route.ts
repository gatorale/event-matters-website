import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type { CalcForm } from "@/types/calculator";
import type { CalculateResponse } from "@/app/api/calculate/route";

/* ─── colours (ARGB for ExcelJS) ──────────────────────────────────────────── */
const PLUM      = "FF2D1B4E";
const TEAL      = "FF00D4AA";
const TEAL_DARK = "FF005C47";
const TEAL_TINT = "FFE8FAF6";
const VIOLET    = "FF5C3D8A";
const IVORY     = "FFFAF9F7";
const CHARCOAL  = "FF2C2C2A";
const WHITE     = "FFFFFFFF";
const GREY_LIGHT = "FFF5F5F5";

/* ─── helpers ──────────────────────────────────────────────────────────────── */
function cur(n: number) {
  return "$" + n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function pct(n: number) { return n + "%"; }
function num(n: number) { return n.toLocaleString("en-CA"); }

function fill(color: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: color } };
}
function font(color: string, size = 10, bold = false, italic = false): Partial<ExcelJS.Font> {
  return { color: { argb: color }, size, bold, italic };
}
function border(color = "FFD0D0D0"): Partial<ExcelJS.Borders> {
  const s: ExcelJS.BorderStyle = "thin";
  const c = { style: s, color: { argb: color } };
  return { top: c, bottom: c, left: c, right: c };
}
function fileName() {
  const d = new Date().toISOString().slice(0, 10);
  return `event-matters-ticket-pricing-${d}.xlsx`;
}

export async function POST(req: NextRequest) {
  const { results, form }: { results: CalculateResponse; form: CalcForm } = await req.json();

  const wb = new ExcelJS.Workbook();
  wb.creator = "Event Matters";
  wb.created = new Date();

  buildSummarySheet(wb, results, form);
  if (results.preCon) buildPreConSheet(wb, results, form);
  buildMethodologySheet(wb, form);

  const buffer = await wb.xlsx.writeBuffer();

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName()}"`,
    },
  });
}

/* ─── Sheet 1: Summary ─────────────────────────────────────────────────────── */
function buildSummarySheet(
  wb: ExcelJS.Workbook,
  results: CalculateResponse,
  form: CalcForm
) {
  const ws = wb.addWorksheet("Ticket Pricing Summary");
  ws.columns = [
    { key: "a", width: 36 },
    { key: "b", width: 22 },
    { key: "c", width: 22 },
    { key: "d", width: 22 },
  ];

  /* ── Branding header ───────────────────────────────────────────────── */
  addMergedRow(ws, "A1:D1", "Event Matters — Conference Ticket Pricing", {
    fill: fill(PLUM),
    font: font(IVORY, 16, true),
    alignment: { vertical: "middle", horizontal: "left", indent: 1 },
    height: 36,
  });
  addMergedRow(ws, "A2:D2", "Built for the other 362 days.  ·  eventmatters.co", {
    fill: fill(PLUM),
    font: font(TEAL, 9, false, true),
    alignment: { vertical: "middle", horizontal: "left", indent: 1 },
    height: 18,
  });
  addMergedRow(ws, "A3:D3",
    `Generated: ${new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}`, {
    fill: fill(GREY_LIGHT),
    font: font(CHARCOAL, 9),
    alignment: { vertical: "middle", horizontal: "right" },
    height: 16,
  });
  blankRow(ws, "A4:D4", GREY_LIGHT);

  /* ── Your inputs ───────────────────────────────────────────────────── */
  sectionHead(ws, "A5:D5", "YOUR INPUTS", TEAL_TINT, TEAL_DARK);

  const inputs: [string, string][] = [
    ["Desired net profit",           cur(form.netProfit)],
    ["Total operating expenses",     cur(form.expenses)],
    ["Gross sponsorship income",     cur(form.sponsorship)],
    ["Platform commission rate",     pct(form.commissionRate)],
    ["Total registrations",          num(form.totalRegistrations)],
    ["Tier price increase rate",     pct(form.priceIncreaseRate)],
    ["Early Bird registration split", pct(form.earlyBirdPct)],
    ["Standard registration split",  pct(form.standardPct)],
    ["Full Price registration split", pct(form.fullPricePct)],
  ];
  if (form.preConEnabled) {
    inputs.push(
      ["Pre-con net profit target",    cur(form.preConNetProfit)],
      ["Honorarium per attendee",      cur(form.honorariumPerAttendee)],
      ["Pre-con attendance rate",      pct(form.preConAttendancePct)],
    );
  }
  inputs.forEach(([label, value], i) => {
    const r = ws.addRow([label, value]);
    r.height = 18;
    styleDataRow(r, i, "A", "B");
  });

  blankRow(ws, "A:D", WHITE);

  /* ── Main con prices ───────────────────────────────────────────────── */
  sectionHead(ws, "A:D", "MAIN CONFERENCE TICKET PRICES", TEAL_TINT, TEAL_DARK);

  const priceHeader = ws.addRow(["Tier", "Price", "", ""]);
  priceHeader.height = 20;
  priceHeader.eachCell({ includeEmpty: false }, (cell) => {
    cell.fill = fill(PLUM);
    cell.font = font(IVORY, 10, true);
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  const tierRows: [string, number][] = [
    ["Early Bird",  results.mainCon.earlyBird],
    ["Standard",    results.mainCon.standard],
    ["Full Price",  results.mainCon.fullPrice],
  ];
  tierRows.forEach(([label, price], i) => {
    const r = ws.addRow([label, cur(price)]);
    r.height = 22;
    const bg = i % 2 === 0 ? TEAL_TINT : WHITE;
    r.getCell(1).fill = fill(bg);
    r.getCell(1).font = font(CHARCOAL, 10, true);
    r.getCell(1).alignment = { horizontal: "left", indent: 1, vertical: "middle" };
    r.getCell(2).fill = fill(bg);
    r.getCell(2).font = font(PLUM, 13, true);
    r.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
  });

  blankRow(ws, "A:D", WHITE);

  /* ── Revenue summary ───────────────────────────────────────────────── */
  sectionHead(ws, "A:D", "REVENUE SUMMARY", TEAL_TINT, TEAL_DARK);

  const { summary } = results;
  const summaryRows: [string, string, boolean][] = [
    ["Net sponsorship income",    cur(summary.netSponsorshipIncome), false],
    ["Registration revenue",      cur(summary.registrationRevenue),  false],
    ...(results.preCon
      ? [["Pre-conference revenue", cur(summary.preConRevenue), false] as [string, string, boolean]]
      : []),
    ["Total revenue",             cur(summary.totalRevenue),         true],
    ["Total expenses",            cur(summary.expenses),             false],
    ["Net profit",                cur(summary.netProfit),            true],
    [
      summary.variance >= 0 ? "Surplus vs. target" : "Shortfall vs. target",
      (summary.variance >= 0 ? "+" : "") + cur(Math.abs(summary.variance)),
      false,
    ],
  ];

  summaryRows.forEach(([label, value, highlight], i) => {
    const r = ws.addRow([label, value]);
    r.height = 20;
    const bg = highlight ? TEAL_TINT : i % 2 === 0 ? GREY_LIGHT : WHITE;
    r.getCell(1).fill = fill(bg);
    r.getCell(1).font = font(highlight ? PLUM : CHARCOAL, 10, highlight);
    r.getCell(1).alignment = { horizontal: "left", indent: 1, vertical: "middle" };
    r.getCell(2).fill = fill(bg);
    r.getCell(2).font = font(highlight ? PLUM : CHARCOAL, 10, highlight);
    r.getCell(2).alignment = { horizontal: "right", vertical: "middle" };
  });

  blankRow(ws, "A:D", WHITE);

  /* ── Disclaimer ─────────────────────────────────────────────────────── */
  const dRow = ws.addRow([
    "Important: This calculator is a planning tool based on the information you enter. " +
    "Results are estimates only and should not be treated as financial advice. " +
    "Always verify your figures with your accountant or financial adviser.",
  ]);
  ws.mergeCells(`A${dRow.number}:D${dRow.number}`);
  dRow.height = 40;
  dRow.getCell(1).fill = fill(GREY_LIGHT);
  dRow.getCell(1).font = { color: { argb: "FF888888" }, size: 8, italic: true };
  dRow.getCell(1).alignment = { wrapText: true, vertical: "middle", indent: 1 };

  blankRow(ws, "A:D", WHITE);

  /* ── Footer row ─────────────────────────────────────────────────────── */
  const fRow = ws.addRow(["eventmatters.co  ·  info@eventmatters.co"]);
  ws.mergeCells(`A${fRow.number}:D${fRow.number}`);
  fRow.height = 18;
  fRow.getCell(1).fill = fill(CHARCOAL);
  fRow.getCell(1).font = font(TEAL, 8);
  fRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
}

/* ─── Sheet 2: Pre-Con detail (if applicable) ──────────────────────────────── */
function buildPreConSheet(
  wb: ExcelJS.Workbook,
  results: CalculateResponse,
  form: CalcForm
) {
  if (!results.preCon) return;
  const ws = wb.addWorksheet("Pre-Con Workshop");
  ws.columns = [{ key: "a", width: 36 }, { key: "b", width: 22 }, { key: "c", width: 22 }, { key: "d", width: 22 }];

  addMergedRow(ws, "A1:D1", "Pre-Conference Workshop Pricing", {
    fill: fill(VIOLET), font: font(IVORY, 14, true),
    alignment: { vertical: "middle", horizontal: "left", indent: 1 }, height: 30,
  });
  blankRow(ws, "A2:D2", WHITE);

  sectionHead(ws, "A3:D3", "PRE-CON TICKET PRICES", "FFE8E0F0", VIOLET);

  const preConAttendees = Math.round(form.totalRegistrations * form.preConAttendancePct / 100);
  [
    ["Early Bird",  results.preCon.earlyBird],
    ["Standard",    results.preCon.standard],
    ["Full Price",  results.preCon.fullPrice],
  ].forEach(([label, price], i) => {
    const r = ws.addRow([label, cur(price as number)]);
    r.height = 22;
    const bg = i % 2 === 0 ? "FFE8E0F0" : WHITE;
    r.getCell(1).fill = fill(bg); r.getCell(1).font = font(CHARCOAL, 10, true); r.getCell(1).alignment = { horizontal: "left", indent: 1, vertical: "middle" };
    r.getCell(2).fill = fill(bg); r.getCell(2).font = font(VIOLET, 13, true); r.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
  });

  blankRow(ws, "A:D", WHITE);
  sectionHead(ws, "A:D", "PRE-CON ASSUMPTIONS", TEAL_TINT, TEAL_DARK);

  [
    ["Estimated pre-con attendees", num(preConAttendees)],
    ["Honorarium per attendee",     cur(form.honorariumPerAttendee)],
    ["Total honorarium cost",       cur(preConAttendees * form.honorariumPerAttendee)],
    ["Pre-con net profit target",   cur(form.preConNetProfit)],
    ["Total pre-con revenue",       cur(results.summary.preConRevenue)],
  ].forEach(([label, value], i) => {
    const r = ws.addRow([label, value]);
    r.height = 18;
    styleDataRow(r, i, "A", "B");
  });
}

/* ─── Sheet 3: Methodology ─────────────────────────────────────────────────── */
function buildMethodologySheet(wb: ExcelJS.Workbook, form: CalcForm) {
  const ws = wb.addWorksheet("How It Works");
  ws.columns = [{ key: "a", width: 60 }, { key: "b", width: 20 }];

  addMergedRow(ws, "A1:B1", "How the Calculator Works", {
    fill: fill(PLUM), font: font(IVORY, 14, true),
    alignment: { vertical: "middle", horizontal: "left", indent: 1 }, height: 30,
  });
  blankRow(ws, "A2:B2", WHITE);

  const steps: [string, string][] = [
    ["Step 1: Net sponsorship income",
     `Gross sponsorship × (1 − commission rate) = ${cur(form.sponsorship)} × ${1 - form.commissionRate / 100}`],
    ["Step 2: Total revenue needed from tickets",
     "Expenses + Desired net profit − Net sponsorship income"],
    ["Step 3: Weighted ticket factor (wf)",
     `EB% + Std% × (1 + increase rate) + Full% × (1 + increase rate)²`],
    ["Step 4: Early Bird base price",
     "Revenue needed ÷ (Registrations × wf) → rounded to nearest $5"],
    ["Step 5: Standard price",
     "Early Bird × (1 + price increase rate) → rounded to nearest $5"],
    ["Step 6: Full Price",
     "Standard × (1 + price increase rate) → rounded to nearest $5"],
    ["Pre-con (if enabled)",
     "Solved independently: Pre-con revenue needed = Pre-con profit target + Honorarium costs"],
  ];

  steps.forEach(([step, explanation], i) => {
    const r = ws.addRow([step, ""]);
    r.height = 18;
    const bg = i % 2 === 0 ? TEAL_TINT : WHITE;
    r.getCell(1).fill = fill(bg);
    r.getCell(1).font = font(PLUM, 10, true);
    r.getCell(1).alignment = { horizontal: "left", indent: 1, vertical: "middle" };

    const r2 = ws.addRow([explanation]);
    ws.mergeCells(`A${r2.number}:B${r2.number}`);
    r2.height = 30;
    r2.getCell(1).fill = fill(bg);
    r2.getCell(1).font = font(CHARCOAL, 9);
    r2.getCell(1).alignment = { wrapText: true, horizontal: "left", indent: 2, vertical: "middle" };
  });

  blankRow(ws, "A:B", WHITE);
  const dRow = ws.addRow([
    "Disclaimer: This calculator is a planning tool. Results are estimates only and should not " +
    "be treated as financial advice. Always verify with your accountant before setting ticket prices.",
  ]);
  ws.mergeCells(`A${dRow.number}:B${dRow.number}`);
  dRow.height = 36;
  dRow.getCell(1).fill = fill(GREY_LIGHT);
  dRow.getCell(1).font = { color: { argb: "FF888888" }, size: 8, italic: true };
  dRow.getCell(1).alignment = { wrapText: true, vertical: "middle", indent: 1 };
}

/* ─── helpers ──────────────────────────────────────────────────────────────── */
function addMergedRow(
  ws: ExcelJS.Worksheet,
  range: string,
  value: string,
  style: {
    fill: ExcelJS.Fill;
    font: Partial<ExcelJS.Font>;
    alignment: Partial<ExcelJS.Alignment>;
    height: number;
  }
) {
  const row = ws.addRow([value]);
  ws.mergeCells(`${range.split(":")[0]}${row.number}:${range.split(":")[1]}${row.number}`);
  row.height = style.height;
  const cell = row.getCell(1);
  cell.fill = style.fill;
  cell.font = style.font;
  cell.alignment = style.alignment;
}

function sectionHead(
  ws: ExcelJS.Worksheet,
  range: string,
  title: string,
  bgArgb: string,
  textArgb: string
) {
  const row = ws.addRow([title]);
  const [start, end] = range.split(":");
  ws.mergeCells(`${start}${row.number}:${end}${row.number}`);
  row.height = 20;
  const cell = row.getCell(1);
  cell.fill = fill(bgArgb);
  cell.font = font(textArgb, 9, true);
  cell.alignment = { horizontal: "left", indent: 1, vertical: "middle" };
}

function blankRow(ws: ExcelJS.Worksheet, _range: string, bgArgb: string) {
  const row = ws.addRow([""]);
  row.height = 8;
  row.getCell(1).fill = fill(bgArgb);
}

function styleDataRow(
  row: ExcelJS.Row,
  index: number,
  labelCol: string,
  valueCol: string
) {
  const bg = index % 2 === 0 ? GREY_LIGHT : WHITE;
  const lCell = row.getCell(labelCol);
  lCell.fill = fill(bg);
  lCell.font = font(CHARCOAL, 10);
  lCell.alignment = { horizontal: "left", indent: 1, vertical: "middle" };

  const vCell = row.getCell(valueCol);
  vCell.fill = fill(bg);
  vCell.font = font(CHARCOAL, 10, true);
  vCell.alignment = { horizontal: "right", vertical: "middle" };
  vCell.border = border();
}
