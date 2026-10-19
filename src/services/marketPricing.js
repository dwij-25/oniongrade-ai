// Mandi Market Pricing & Fair Price Discovery Engine for OnionGrade AI
// Aggregates APMC mandi rates, Grade-A quality premiums, and transport arbitrage

export const APMC_RATES = {
  "MH-LAS": {
    mandiName: "Lasalgaon APMC",
    state: "Maharashtra",
    district: "Nashik",
    updatedToday: "Today, 08:30 AM",
    gradeA: { min: 3800, modal: 4200, max: 4600 },
    urs: { min: 2400, modal: 2800, max: 3200 },
    reject: { min: 1000, modal: 1400, max: 1800 },
    unassortedAverage: 3200,
    dailyArrivalTonnes: 1840,
    trend: "+₹320/qtl (Bullish — Oct Kharif Arrivals)"
  },
  "MH-PIM": {
    mandiName: "Pimpalgaon APMC",
    state: "Maharashtra",
    district: "Nashik",
    updatedToday: "Today, 09:15 AM",
    gradeA: { min: 3600, modal: 4050, max: 4500 },
    urs: { min: 2200, modal: 2650, max: 3050 },
    reject: { min: 900, modal: 1300, max: 1600 },
    unassortedAverage: 3100,
    dailyArrivalTonnes: 1420,
    trend: "+₹280/qtl (Firm)"
  },
  "GJ-MAH": {
    mandiName: "Mahuva APMC",
    state: "Gujarat",
    district: "Bhavnagar",
    updatedToday: "Today, 07:45 AM",
    gradeA: { min: 4100, modal: 4500, max: 4900 }, // White onions command premium for processing
    urs: { min: 2700, modal: 3100, max: 3500 },
    reject: { min: 1100, modal: 1500, max: 1900 },
    unassortedAverage: 3400,
    dailyArrivalTonnes: 980,
    trend: "+₹410/qtl (Bullish — Export Demand)"
  },
  "DL-AZD": {
    mandiName: "Azadpur Mandi",
    state: "Delhi",
    district: "North Delhi",
    updatedToday: "Today, 06:00 AM",
    gradeA: { min: 4800, modal: 5200, max: 5600 },
    urs: { min: 3200, modal: 3700, max: 4100 },
    reject: { min: 1400, modal: 1800, max: 2200 },
    unassortedAverage: 4000,
    dailyArrivalTonnes: 2600,
    freightFromNashik: 340, // Freight cost per quintal
    trend: "+₹480/qtl (High Festival Season Demand)"
  },
  "AP-KUR": {
    mandiName: "Kurnool APMC",
    state: "Andhra Pradesh",
    district: "Kurnool",
    updatedToday: "Today, 08:00 AM",
    gradeA: { min: 3100, modal: 3400, max: 3800 },
    urs: { min: 2000, modal: 2350, max: 2700 },
    reject: { min: 800, modal: 1100, max: 1400 },
    unassortedAverage: 2600,
    dailyArrivalTonnes: 720,
    trend: "+₹120/qtl (Steady)"
  }
};

/**
 * Calculates fair price discovery, lot valuation, and mandi arbitrage for a graded lot
 *
 * @param {Object} lot - Graded lot object
 * @returns {Object} Comprehensive market signal & price discovery details
 */
export function getMarketSignal(lot) {
  if (!lot) return null;

  const mandiId = lot.mandiId || "MH-LAS";
  const currentMandi = APMC_RATES[mandiId] || APMC_RATES["MH-LAS"];
  const quantityQuintals = Number(lot.quantityQuintals || 40);
  const lotGrade = lot.lotGrade || "Grade A";
  const stats = lot.stats || {};
  const gradeAPct = Number(stats.gradeAPct ?? 70);
  const ursPct = Number(stats.ursPct ?? 25);
  const rejectPct = Number(stats.rejectPct ?? 5);

  // Exact benchmark price based on grade
  let rateTier = currentMandi.gradeA;
  if (lotGrade === "Reject") {
    rateTier = currentMandi.reject;
  } else if (lotGrade === "URS") {
    rateTier = currentMandi.urs;
  }

  // Blended composite rate based on individual bulb percentages
  // (Prevents trader from down-pricing entire 40 quintals because of 10% domestic URS)
  const blendedRate = Math.round(
    (gradeAPct / 100) * currentMandi.gradeA.modal +
    (ursPct / 100) * currentMandi.urs.modal +
    (rejectPct / 100) * currentMandi.reject.modal
  );

  // Modal rate for the primary grade
  const modalRate = rateTier.modal;

  // Grade A premium over unassorted farmer lot (traders typically pay unassorted base)
  const unassortedRate = currentMandi.unassortedAverage;
  const gradeAPremium = Math.max(0, blendedRate - unassortedRate);
  const totalExtraIncome = Math.round(gradeAPremium * quantityQuintals);

  // Total Expected Lot Realization (Fair MSP Payout)
  const totalLotValue = Math.round(blendedRate * quantityQuintals);

  // Minimum Fair Price Shield (Negotiation floor for farmer)
  const minimumFairBid = Math.round(blendedRate * 0.94); // 6% margin buffer

  // Mandi Arbitrage comparison (e.g. Local vs Delhi Azadpur terminal market)
  const azadpur = APMC_RATES["DL-AZD"];
  const grossAzadpurRate = (gradeAPct / 100) * azadpur.gradeA.modal + (ursPct / 100) * azadpur.urs.modal;
  const netAzadpurRate = Math.round(grossAzadpurRate - (azadpur.freightFromNashik || 340));
  const arbitrageSpread = netAzadpurRate - blendedRate;

  return {
    mandiName: currentMandi.mandiName,
    state: currentMandi.state,
    updatedToday: currentMandi.updatedToday,
    trend: currentMandi.trend,
    dailyArrivalTonnes: currentMandi.dailyArrivalTonnes,
    lotGrade,
    rateTier,
    blendedRate,
    unassortedRate,
    gradeAPremium,
    totalExtraIncome,
    totalLotValue,
    minimumFairBid,
    quantityQuintals,
    arbitrage: {
      terminalMandi: azadpur.mandiName,
      grossRate: Math.round(grossAzadpurRate),
      freightPerQtl: azadpur.freightFromNashik,
      netRate: netAzadpurRate,
      spreadPerQtl: arbitrageSpread,
      isPositive: arbitrageSpread > 0,
      totalNetGain: Math.round(arbitrageSpread * quantityQuintals)
    }
  };
}
