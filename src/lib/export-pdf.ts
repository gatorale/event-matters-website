import type { CalcForm } from "@/types/calculator";
import type { CalculateResponse } from "@/app/api/calculate/route";

/* ─── helpers ──────────────────────────────────────────────────────────────── */
function makeCur(symbol: string) {
  return (n: number) => symbol + n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function pct(n: number) { return n + "%"; }
function num(n: number) { return n.toLocaleString("en-CA"); }
function dateStr() {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });
}
function fileName() {
  const d = new Date().toISOString().slice(0, 10);
  return `event-matters-ticket-pricing-${d}.pdf`;
}

/* ─── brand colours as jsPDF rgb arrays ────────────────────────────────────── */
const PLUM:      [number,number,number] = [45,  27,  78 ];
const TEAL:      [number,number,number] = [0,   212, 170];
const IVORY:     [number,number,number] = [250, 249, 247];
const CHARCOAL:  [number,number,number] = [44,  44,  42 ];
const TEAL_TINT: [number,number,number] = [232, 250, 246];
const VIOLET:    [number,number,number] = [92,  61,  138];
const GREY:      [number,number,number] = [120, 120, 118];

const W     = 215.9;
const M     = 20;
const PAGE_H = 279.4;
const FOOTER_H = 14;
/* Space we reserve for the charcoal footer bar at the bottom of each page */
const SAFE_BOTTOM = PAGE_H - FOOTER_H - 6;

/* ─── page helpers ──────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawFooter(doc: any) {
  doc.setFillColor(...CHARCOAL);
  doc.rect(0, PAGE_H - FOOTER_H, W, FOOTER_H, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...IVORY);
  doc.text("eventmatters.co", M, PAGE_H - 5.5);
  doc.setTextColor(...TEAL);
  doc.text("info@eventmatters.co", W / 2, PAGE_H - 5.5, { align: "center" });
  doc.setTextColor(...GREY);
  doc.text(`© ${new Date().getFullYear()} Event Matters`, W - M, PAGE_H - 5.5, { align: "right" });
}

// Returns a new y at the top of a fresh page if we're too close to the bottom,
// otherwise returns y unchanged.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkPage(doc: any, y: number, needed = 30): number {
  if (y + needed > SAFE_BOTTOM) {
    drawFooter(doc);
    doc.addPage();
    // Thin plum rule at top of continuation page
    doc.setFillColor(...PLUM);
    doc.rect(0, 0, W, 6, "F");
    return 16;
  }
  return y;
}

/* ─── main export function ─────────────────────────────────────────────────── */
export async function downloadPDF(
  results: CalculateResponse,
  form: CalcForm,
  currencySymbol = "$"
): Promise<void> {
  const cur = makeCur(currencySymbol);
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

  /* ── Header bar ─────────────────────────────────────────────────────────── */
  doc.setFillColor(...PLUM);
  doc.rect(0, 0, W, 28, "F");

  doc.setTextColor(...IVORY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Event ", M, 17);

  const eventW = doc.getTextWidth("Event ");
  doc.setTextColor(...TEAL);
  doc.text("Matters", M + eventW, 17);

  doc.setTextColor(...IVORY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("eventmatters.co", W - M, 12, { align: "right" });
  doc.setTextColor(...TEAL);
  doc.text("Built for the other 362 days.", W - M, 19, { align: "right" });

  /* ── Title block ────────────────────────────────────────────────────────── */
  let y = 38;
  doc.setTextColor(...CHARCOAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Conference Ticket Pricing Summary", M, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text(`Generated ${dateStr()}`, M, y);

  /* ── Section: Inputs ────────────────────────────────────────────────────── */
  y += 10;
  y = checkPage(doc, y, 40);
  sectionHead(doc, "YOUR INPUTS", M, y, W, TEAL_TINT, CHARCOAL);
  y += 7;

  const inputRows: [string, string][] = [
    ["Target net profit",           cur(form.netProfit)],
    ["Total operating expenses",    cur(form.expenses)],
    ["Gross sponsorship revenue",   cur(form.sponsorship)],
    ["Sponsorship commission rate", pct(form.commissionRate)],
    ["Total projected registrants", num(form.totalRegistrations)],
    ["Tier price increase rate",    pct(form.priceIncreaseRate)],
    ["Registration purchase split (EB / Std / Full)",
      `${pct(form.earlyBirdPct)} / ${pct(form.standardPct)} / ${pct(form.fullPricePct)}`],
  ];

  if (form.preConEnabled) {
    inputRows.push(
      ["Pre-conference net profit target",     cur(form.preConNetProfit)],
      ["Honorarium per pre-conference attendee", cur(form.honorariumPerAttendee)],
      ["Pre-conference attendance rate",        pct(form.preConAttendancePct)],
    );
  }

  autoTable(doc, {
    startY: y,
    body: inputRows,
    styles: { font: "helvetica", fontSize: 9, textColor: CHARCOAL, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: "bold" },
      1: { cellWidth: 85, halign: "right" },
    },
    alternateRowStyles: { fillColor: TEAL_TINT },
    theme: "plain",
    margin: { left: M, right: M },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  /* ── Section: Main con prices ───────────────────────────────────────────── */
  y = checkPage(doc, y, 40);
  sectionHead(doc, "MAIN CONFERENCE TICKET PRICES", M, y, W, TEAL_TINT, CHARCOAL);
  y += 7;

  autoTable(doc, {
    startY: y,
    head: [["Early Bird", "Standard", "Full Price"]],
    body: [[
      cur(results.mainCon.earlyBird),
      cur(results.mainCon.standard),
      cur(results.mainCon.fullPrice),
    ]],
    headStyles: {
      fillColor: PLUM, textColor: IVORY,
      fontStyle: "bold", fontSize: 9, halign: "center",
    },
    bodyStyles: {
      fontSize: 14, fontStyle: "bold",
      textColor: PLUM, halign: "center",
      fillColor: TEAL_TINT, cellPadding: 5,
    },
    theme: "plain",
    margin: { left: M, right: M },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  /* ── Section: Pre-con prices ────────────────────────────────────────────── */
  if (results.preCon) {
    y = checkPage(doc, y, 45);
    sectionHead(doc, "PRE-CONFERENCE WORKSHOP PRICES", M, y, W, [240, 232, 250], CHARCOAL);
    y += 7;

    autoTable(doc, {
      startY: y,
      head: [["Early Bird", "Standard", "Full Price"]],
      body: [[
        cur(results.preCon.earlyBird),
        cur(results.preCon.standard),
        cur(results.preCon.fullPrice),
      ]],
      headStyles: {
        fillColor: VIOLET, textColor: IVORY,
        fontStyle: "bold", fontSize: 9, halign: "center",
      },
      bodyStyles: {
        fontSize: 13, fontStyle: "bold",
        textColor: VIOLET, halign: "center",
        fillColor: [240, 232, 250] as [number,number,number], cellPadding: 5,
      },
      theme: "plain",
      margin: { left: M, right: M },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  /* ── Section: Revenue summary ───────────────────────────────────────────── */
  y = checkPage(doc, y, 50);
  sectionHead(doc, "REVENUE SUMMARY", M, y, W, TEAL_TINT, CHARCOAL);
  y += 7;

  const { summary } = results;
  const summaryRows: [string, string][] = [
    ["Net sponsorship income",   cur(summary.netSponsorshipIncome)],
    ["Registration revenue",     cur(summary.registrationRevenue)],
    ...(results.preCon ? [["Pre-conference revenue", cur(summary.preConRevenue)] as [string,string]] : []),
    ["Total revenue",            cur(summary.totalRevenue)],
    ["Total expenses",           cur(summary.expenses)],
    ["Net profit",               cur(summary.netProfit)],
    [
      summary.variance >= 0 ? "Surplus vs. target" : "Shortfall vs. target",
      (summary.variance >= 0 ? "+" : "") + cur(Math.abs(summary.variance)),
    ],
  ];

  autoTable(doc, {
    startY: y,
    body: summaryRows,
    styles: { font: "helvetica", fontSize: 9, textColor: CHARCOAL, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: "normal" },
      1: { cellWidth: 85, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      const bold = ["Total revenue", "Net profit"];
      if (bold.some((l) => summaryRows[data.row.index]?.[0] === l)) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = PLUM;
      }
    },
    alternateRowStyles: { fillColor: TEAL_TINT },
    theme: "plain",
    margin: { left: M, right: M },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  /* ── Disclaimer ─────────────────────────────────────────────────────────── */
  y = checkPage(doc, y, 28);
  doc.setDrawColor(...VIOLET);
  doc.setLineWidth(0.5);
  doc.line(M, y, M, y + 14);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  const disclaimer =
    "This calculator is a planning tool based on the information you enter. Results are estimates only " +
    "and should not be treated as financial advice. Event Matters accepts no liability for decisions made " +
    "based on calculator outputs. Always verify your figures with your accountant or financial adviser " +
    "before setting ticket prices.";
  doc.text(disclaimer, M + 4, y + 4, { maxWidth: W - M - M - 4 });

  /* ── Footer ─────────────────────────────────────────────────────────────── */
  drawFooter(doc);

  doc.save(fileName());
}

/* ─── utility: draw a tinted section header ────────────────────────────────── */
function sectionHead(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  title: string,
  x: number,
  y: number,
  pageW: number,
  fillRgb: [number, number, number],
  textRgb: [number, number, number]
) {
  doc.setFillColor(...fillRgb);
  doc.rect(x, y - 2, pageW - 2 * M, 6.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...textRgb);
  doc.text(title, x + 2, y + 2.5);
}
