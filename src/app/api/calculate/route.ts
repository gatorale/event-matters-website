import { NextRequest, NextResponse } from "next/server";

export interface CalculateRequest {
  netProfit: number;
  expenses: number;
  sponsorship: number;
  commissionRate: number;
  totalRegistrations: number;
  priceIncreaseRate: number;
  earlyBirdPct: number;
  standardPct: number;
  fullPricePct: number;
  preConEnabled: boolean;
  preConNetProfit: number;
  honorariumPerAttendee: number;
  preConAttendancePct: number;
}

export interface PriceTier {
  earlyBird: number;
  standard: number;
  fullPrice: number;
}

export interface CalculateSummary {
  registrationRevenue: number;
  preConRevenue: number;
  netSponsorshipIncome: number;
  totalRevenue: number;
  expenses: number;
  netProfit: number;
  variance: number;
}

export interface CalculateResponse {
  mainCon: PriceTier;
  preCon: PriceTier | null;
  summary: CalculateSummary;
}

function roundToNearest5(n: number): number {
  return Math.round(n / 5) * 5;
}

function tierRevenue(
  count: number,
  earlyBirdFrac: number,
  standardFrac: number,
  fullPriceFrac: number,
  prices: PriceTier
): number {
  return (
    count * earlyBirdFrac * prices.earlyBird +
    count * standardFrac * prices.standard +
    count * fullPriceFrac * prices.fullPrice
  );
}

export async function POST(req: NextRequest) {
  let body: CalculateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    netProfit,
    expenses,
    sponsorship,
    commissionRate,
    totalRegistrations,
    priceIncreaseRate,
    earlyBirdPct,
    standardPct,
    fullPricePct,
    preConEnabled,
    preConNetProfit,
    honorariumPerAttendee,
    preConAttendancePct,
  } = body;

  /* ─ validate ─────────────────────────────────────────────────── */
  if (
    [netProfit, expenses, sponsorship, commissionRate, totalRegistrations,
     priceIncreaseRate, earlyBirdPct, standardPct, fullPricePct]
      .some((v) => typeof v !== "number" || isNaN(v))
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }
  if (Math.abs(earlyBirdPct + standardPct + fullPricePct - 100) > 0.01) {
    return NextResponse.json(
      { error: "Early bird, standard, and full price percentages must sum to 100" },
      { status: 400 }
    );
  }
  if (totalRegistrations < 1) {
    return NextResponse.json({ error: "Total registrations must be at least 1" }, { status: 400 });
  }

  try {
    /* ─ derived constants ─────────────────────────────────────────── */
    const commission = commissionRate / 100;
    const r = 1 + priceIncreaseRate / 100;
    const ebFrac = earlyBirdPct / 100;
    const stdFrac = standardPct / 100;
    const fpFrac = fullPricePct / 100;

    // Weighted revenue factor: how many "EB-price-equivalents" each registrant generates
    const wf = ebFrac + stdFrac * r + fpFrac * r * r;
    if (!isFinite(wf) || wf === 0) return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });

    /* ─ sponsorship ────────────────────────────────────────────────── */
    const netSponsorshipIncome = sponsorship * (1 - commission);

    /* ─ pre-con ────────────────────────────────────────────────────── */
    let preCon: PriceTier | null = null;
    let preConRevenue = 0;

    if (preConEnabled) {
      const preConAttendees = Math.round(totalRegistrations * (preConAttendancePct / 100));
      if (preConAttendees <= 0) return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
      const preConExpenses = preConAttendees * honorariumPerAttendee;
      const preConTarget = preConNetProfit + preConExpenses;

      const preConEBExact = preConTarget / (preConAttendees * wf);
      if (!isFinite(preConEBExact)) return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
      const preConEB = roundToNearest5(preConEBExact);
      const preConStd = roundToNearest5(preConEB * r);
      const preConFull = roundToNearest5(preConStd * r);

      preCon = { earlyBird: preConEB, standard: preConStd, fullPrice: preConFull };
      preConRevenue = tierRevenue(preConAttendees, ebFrac, stdFrac, fpFrac, preCon);
    }

    /* ─ main con ───────────────────────────────────────────────────── */
    const totalNeededFromTickets = expenses + netProfit - netSponsorshipIncome;
    const mainConTarget = totalNeededFromTickets - (preConEnabled ? preConRevenue : 0);

    const mainConEBExact = mainConTarget / (totalRegistrations * wf);
    if (!isFinite(mainConEBExact)) return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
    const mainConEB = roundToNearest5(mainConEBExact);
    const mainConStd = roundToNearest5(mainConEB * r);
    const mainConFull = roundToNearest5(mainConStd * r);

    const mainCon: PriceTier = {
      earlyBird: mainConEB,
      standard: mainConStd,
      fullPrice: mainConFull,
    };

    /* ─ summary ─────────────────────────────────────────────────────── */
    const registrationRevenue = tierRevenue(
      totalRegistrations, ebFrac, stdFrac, fpFrac, mainCon
    );
    const totalRevenue = netSponsorshipIncome + registrationRevenue + preConRevenue;
    const actualNetProfit = totalRevenue - expenses;
    const variance = totalRevenue - (expenses + netProfit);

    const summary: CalculateSummary = {
      registrationRevenue,
      preConRevenue,
      netSponsorshipIncome,
      totalRevenue,
      expenses,
      netProfit: actualNetProfit,
      variance,
    };

    return NextResponse.json({ mainCon, preCon, summary } satisfies CalculateResponse);
  } catch {
    return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
  }
}
