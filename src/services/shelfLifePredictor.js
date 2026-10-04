// Spoilage & Shelf-Life Prediction Engine for OnionGrade AI
// Calibrated against ICAR-DOGR (Directorate of Onion and Garlic Research)
// and DoCA / NAFED buffer-stock post-harvest preservation studies.

/**
 * Predicts safe shelf-life and Priority Dispatch Index (PDI)
 * to combat NAFED's historical ~25% buffer stock spoilage loss.
 *
 * @param {Object} lot - Lot object containing stats and bulbs
 * @returns {Object} Comprehensive shelf-life prediction & storage advisory
 */
export function predictShelfLife(lot) {
  if (!lot) return null;

  const stats = lot.stats || {};
  const avgDamagePct = Number(stats.avgDamagePct ?? (lot.bulbs ? calculateAvgDamage(lot.bulbs) : 2.5));
  const sproutCount = Number(stats.sproutCount ?? (lot.bulbs ? calculateSproutCount(lot.bulbs) : 0));
  const totalBulbs = Number(stats.totalBulbs ?? (lot.bulbs?.length || 9));
  const sproutPct = totalBulbs > 0 ? (sproutCount / totalBulbs) * 100 : 0;
  const gradeAPct = Number(stats.gradeAPct ?? 60);
  const rejectPct = Number(stats.rejectPct ?? 10);

  // Variety storage coefficient
  // Garwa (Rabi storage onion): High dry matter (>13%), dormancy lasts 4-6 months
  // Rangda / Pol (Kharif): High moisture, short storage (30-45 days)
  // White: Processing variety, medium storage (60-90 days)
  const variety = (lot.variety || "").toLowerCase();
  let varietyBaseDays = 90; // Default rabi baseline
  let varietyName = "Nashik Red Garwa";
  if (variety.includes("rangda") || variety.includes("pol") || variety.includes("kharif")) {
    varietyBaseDays = 40;
    varietyName = "Kharif / Rangda";
  } else if (variety.includes("white")) {
    varietyBaseDays = 75;
    varietyName = "Mahuva White";
  } else if (variety.includes("bellary")) {
    varietyBaseDays = 50;
    varietyName = "Bellary Red";
  }

  // Degradation factors:
  // 1. Surface Rot / Fungal Pathogen Decay (Aspergillus niger & Erwinia soft rot)
  // Each 1% damage reduces shelf-life progressively
  const rotPenaltyDays = avgDamagePct * 3.8;

  // 2. Apical Sprout Elongation
  // Active sprouting breaks dormancy; bulbs respire rapidly and turn spongy
  const sproutPenaltyDays = sproutPct * 1.5;

  // 3. Reject percentage penalty (cross-contamination in storage pile)
  const contaminationPenalty = (rejectPct / 100) * 20;

  // Calculate estimated safe shelf life (days until 10% batch spoilage)
  const rawSafeDays = varietyBaseDays - rotPenaltyDays - sproutPenaltyDays - contaminationPenalty;
  const safeDays = Math.max(3, Math.round(rawSafeDays));

  // Priority Dispatch Index (PDI): 0 (Safe) to 100 (Urgent immediate dispatch)
  // High PDI means buffer managers must dispatch immediately to avoid total write-off
  let pdi = Math.round(100 - (safeDays / varietyBaseDays) * 100);
  pdi = Math.min(99, Math.max(8, pdi));

  // Risk Classification
  let riskLevel = "low"; // low, medium, high, critical
  let pdiCategory = "PDI-1 (Safe for Buffer Storage)";
  let pdiAction = "Retain in ventilated kanda chawl or cold chain buffer (0-2°C).";
  let badgeColor = "#F18B49"; // Brand warm orange/amber

  if (safeDays <= 12 || rejectPct >= 35 || sproutCount >= 2) {
    riskLevel = "critical";
    pdiCategory = "PDI-3 (CRITICAL: Liquidate in 72h)";
    pdiAction = "Immediate evacuation to urban APMC mandis or local onion dehydration units to prevent zero-recovery rotting.";
    badgeColor = "#FF4D4D";
  } else if (safeDays <= 28 || rejectPct >= 12 || avgDamagePct > 4) {
    riskLevel = "medium";
    pdiCategory = "PDI-2 (Regional Transit Priority)";
    pdiAction = "Dispatch within 14 days to consuming metro centers (Delhi, Kolkata, Bengaluru).";
    badgeColor = "#EB87A9";
  } else {
    riskLevel = "low";
    pdiCategory = "PDI-1 (Safe for 3-5 Month Buffer)";
    pdiAction = "Eligible for NAFED / NCCF Central Price Stabilization Buffer Stock procurement.";
    badgeColor = "#F18B49";
  }

  // Estimated spoilage loss avoided by following PDI protocol
  // Based on 40 quintals standard lot value @ ₹2,600/qtl = ₹1,04,000
  const lotQuintals = Number(lot.quantityQuintals || 40);
  const pricePerQtl = Number(lot.estimatedPricePerQuintal || 2600);
  const lotTotalValue = lotQuintals * pricePerQtl;
  const expectedSpoilageWithoutIntervention = (pdi / 100) * lotTotalValue;
  const estimatedSavings = Math.round(expectedSpoilageWithoutIntervention * 0.75);

  // Micro-climate Storage Guidance
  const storageGuidance = {
    targetTemp: safeDays > 30 ? "0°C – 2°C (Cold Chain) or 22°C – 28°C (Ambient Chawl)" : "20°C – 24°C with active forced draft",
    targetHumidity: "65% – 70% RH (Higher humidity triggers root fungal emergence)",
    airCirculation: safeDays <= 15 ? "Continuous high-flow forced aeration (120 CFM/tonne)" : "Passive ridge & bottom ventilated kanda chawl",
    curingStatus: avgDamagePct < 2 ? "Well Cured (Firm papery scale neck seal)" : "Partial Curing (Moisture in neck tissue detected)"
  };

  // 60-day decay trajectory points for mini-chart
  const decayTrajectory = [
    { day: "Day 0", rotPct: Number(avgDamagePct.toFixed(1)), status: "Current" },
    { day: "Day 15", rotPct: Number(Math.min(100, avgDamagePct + (pdi > 50 ? 6.5 : 1.8)).toFixed(1)) },
    { day: "Day 30", rotPct: Number(Math.min(100, avgDamagePct + (pdi > 50 ? 16.0 : 4.2)).toFixed(1)) },
    { day: "Day 45", rotPct: Number(Math.min(100, avgDamagePct + (pdi > 50 ? 32.5 : 8.5)).toFixed(1)) },
    { day: "Day 60", rotPct: Number(Math.min(100, avgDamagePct + (pdi > 50 ? 58.0 : 14.2)).toFixed(1)) }
  ];

  return {
    safeDays,
    varietyBaseDays,
    varietyName,
    pdi,
    riskLevel,
    pdiCategory,
    pdiAction,
    badgeColor,
    lotTotalValue,
    estimatedSavings,
    storageGuidance,
    decayTrajectory
  };
}

function calculateAvgDamage(bulbs) {
  if (!bulbs || bulbs.length === 0) return 2.0;
  const sum = bulbs.reduce((acc, b) => acc + (b.damagePct || 0), 0);
  return sum / bulbs.length;
}

function calculateSproutCount(bulbs) {
  if (!bulbs) return 0;
  return bulbs.filter(b => (b.sproutScore || 0) > 0.1 || (b.reason || "").toLowerCase().includes("sprout")).length;
}
