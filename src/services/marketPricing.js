// Mandi Market Pricing & Fair Price Discovery Engine for OnionGrade AI
// Aggregates APMC mandi rates, Grade-A quality premiums, and transport arbitrage

export const APMC_RATES = {
  "MH-LAS": {
    mandiName: "Lasalgaon APMC",
    state: "Maharashtra",
    district: "Nashik",
    updatedToday: "Today, 08:30 AM",
    gradeA: { min: 2750, modal: 2920, max: 3150 },
    urs: { min: 1800, modal: 1980, max: 2150 },
    reject: { min: 650, modal: 780, max: 920 },
    unassortedAverage: 2150,
    dailyArrivalTonnes: 1840,
    trend: "+₹140/qtl (Firm)"
  },
  "MH-PIM": {
    mandiName: "Pimpalgaon APMC",
    state: "Maharashtra",
    district: "Nashik",
    updatedToday: "Today, 09:15 AM",
    gradeA: { min: 2680, modal: 2850, max: 3080 },
    urs: { min: 1750, modal: 1920, max: 2100 },
    reject: { min: 600, modal: 720, max: 880 },
    unassortedAverage: 2080,
    dailyArrivalTonnes: 1420,
    trend: "+₹80/qtl (Steady)"
  },
  "GJ-MAH": {
    mandiName: "Mahuva APMC",
    state: "Gujarat",
    district: "Bhavnagar",
    updatedToday: "Today, 07:45 AM",
    gradeA: { min: 2950, modal: 3180, max: 3450 }, // White onions command premium for processing
    urs: { min: 1950, modal: 2150, max: 2350 },
    reject: { min: 700, modal: 850, max: 980 },
    unassortedAverage: 2320,
    dailyArrivalTonnes: 980,
    trend: "+₹210/qtl (Bullish)"
  },
  "DL-AZD": {
    mandiName: "Azadpur Mandi",
    state: "Delhi",
    district: "North Delhi",
    updatedToday: "Today, 06:00 AM",
    gradeA: { min: 3350, modal: 3600, max: 3850 },
    urs: { min: 2300, modal: 2550, max: 2750 },
    reject: { min: 900, modal: 1100, max: 1300 },
    unassortedAverage: 2680,
    dailyArrivalTonnes: 2600,
    freightFromNashik: 340, // Freight cost per quintal
    trend: "+₹180/qtl (High Demand)"
  },
  "AP-KUR": {
    mandiName: "Kurnool APMC",
    state: "Andhra Pradesh",
    district: "Kurnool",
    updatedToday: "Today, 08:00 AM",
    gradeA: { min: 2400, modal: 2580, max: 2750 },
    urs: { min: 1550, modal: 1720, max: 1900 },
    reject: { min: 550, modal: 680, max: 800 },
    unassortedAverage: 1850,
    dailyArrivalTonnes: 720,
    trend: "-₹40/qtl (Soft)"
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
