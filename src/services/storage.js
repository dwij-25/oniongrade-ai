// LocalStorage Database Service for OnionGrade AI
// Manages users, graded lots, APMC intake queue, and DoCA disputes

import { SAMPLE_LOT_PRESETS, generateSampleTrayImage } from "../utils/sampleImages";
import { DEFAULT_GRADE_CONFIG, APMC_MANDIS, ROLES } from "../constants/rules";

const STORAGE_KEYS = {
  USER: "oniongrade_user",
  LOTS: "oniongrade_lots",
  DISPUTES: "oniongrade_disputes",
  PROCUREMENTS: "oniongrade_procurements",
  PURCHASES: "oniongrade_purchases",
  RULES: "oniongrade_rules",
  INITIALIZED: "oniongrade_initialized_v5"
};

export const DEFAULT_USERS = {
  [ROLES.FARMER]: {
    id: "USR-FARM-01",
    name: "Rameshwar Patil",
    role: ROLES.FARMER,
    phone: "+91 98224 81920",
    email: "ramesh.patil@mandi-farmer.in",
    mandi: "Lasalgaon APMC",
    mandiId: "MH-LAS",
    village: "Vinchur, Niphad Taluka, Nashik",
    khasraNo: "KH-412/A",
    totalLotsGraded: 14,
    totalQuintalsSold: 380
  },
  [ROLES.RETAILER]: {
    id: "USR-RET-01",
    name: "Sunil Agrawal",
    role: ROLES.RETAILER,
    phone: "+91 94250 11983",
    email: "sunil@mahalaxmi-agrotraders.com",
    company: "Mahalaxmi Agro Traders & Cold Chain",
    mandi: "Azadpur Mandi / Lasalgaon Buyer",
    mandiId: "DL-AZD",
    gstin: "27AABCM8291M1Z5"
  },
  [ROLES.OFFICER]: {
    id: "USR-OFF-01",
    name: "Inspector Vinayak Shinde",
    role: ROLES.OFFICER,
    phone: "+91 98902 44102",
    email: "v.shinde@msamb.gov.in",
    badgeNumber: "APMC-INSP-8492",
    mandi: "Lasalgaon APMC (Yard #2 Weighbridge)",
    mandiId: "MH-LAS",
    station: "Digital Intake & Weighbridge Terminal"
  },
  [ROLES.GOVERNMENT]: {
    id: "USR-GOV-01",
    name: "Dr. Ananya Roy (Joint Director)",
    role: ROLES.GOVERNMENT,
    phone: "+91 11 2338 9012",
    email: "ananya.roy@doca.nic.in",
    department: "Price Stabilization Fund Management (PSFM) Cell",
    agency: "Department of Consumer Affairs, Ministry of Consumer Affairs, GoI",
    jurisdiction: "Western & Central Mandi Buffer Division"
  }
};

/**
 * Seed initial realistic APMC lots if not already present in localStorage
 */
export function initializeStorage() {
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (isInit) return;

    // Generate seed sample images
    const sampleImgA = generateSampleTrayImage(SAMPLE_LOT_PRESETS[0]);
    const sampleImgMixed = generateSampleTrayImage(SAMPLE_LOT_PRESETS[1]);
    const sampleImgWhite = generateSampleTrayImage(SAMPLE_LOT_PRESETS[2]);
    const sampleImgReject = generateSampleTrayImage(SAMPLE_LOT_PRESETS[3]);

    const seedLots = [
      {
        id: "LOT-MH-LAS-2601",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4h ago
        dateStr: "Today, 10:45 AM",
        farmerName: "Rameshwar Patil",
        farmerId: "FARM-MH-9812",
        mandiId: "MH-LAS",
        mandiName: "Lasalgaon APMC",
        variety: "Nashik Red Garwa",
        quantityQuintals: 42.5,
        estimatedPricePerQuintal: 2850,
        lotGrade: "Grade A",
        thumbnail: sampleImgA,
        annotatedImage: sampleImgA,
        stats: {
          totalBulbs: 9,
          gradeACount: 8,
          gradeAPct: 88.9,
          ursCount: 1,
          ursPct: 11.1,
          rejectCount: 0,
          rejectPct: 0.0,
          avgDiameterMm: 52.8,
          avgDamagePct: 0.9,
          sproutCount: 0
        },
        bulbs: [
          { id: 1, grade: "Grade A", diameterMm: 52.4, damagePct: 0.4, sproutScore: 0.0, shapeDev: 0.04, reason: "Meets export diameter (52.4mm); pristine outer skin, zero decay." },
          { id: 2, grade: "Grade A", diameterMm: 55.8, damagePct: 0.8, sproutScore: 0.0, shapeDev: 0.05, reason: "Excellent firm bulb (55.8mm); intact outer scale layers." },
          { id: 3, grade: "Grade A", diameterMm: 50.7, damagePct: 0.5, sproutScore: 0.0, shapeDev: 0.03, reason: "Uniform spherical shape; dry papery tunic, no blemishes." },
          { id: 4, grade: "Grade A", diameterMm: 54.1, damagePct: 1.1, sproutScore: 0.0, shapeDev: 0.06, reason: "Grade A specification; 1.1% minor surface skin scale crack." },
          { id: 5, grade: "Grade A", diameterMm: 57.5, damagePct: 0.2, sproutScore: 0.0, shapeDev: 0.02, reason: "Premium export calibre; optimum moisture retention." },
          { id: 6, grade: "Grade A", diameterMm: 49.9, damagePct: 1.4, sproutScore: 0.0, shapeDev: 0.05, reason: "Complies with Grade A standard; firm neck seal." },
          { id: 7, grade: "Grade A", diameterMm: 49.1, damagePct: 0.9, sproutScore: 0.0, shapeDev: 0.04, reason: "Good skin color uniformity; zero rot spots." },
          { id: 8, grade: "Grade A", diameterMm: 55.0, damagePct: 0.6, sproutScore: 0.0, shapeDev: 0.04, reason: "Excellent firmness; dry tunic, no vegetative shoot." },
          { id: 9, grade: "URS", diameterMm: 38.2, damagePct: 2.4, sproutScore: 0.02, shapeDev: 0.12, reason: "Marginal diameter (38.2mm, below 40mm A-grade threshold); good internal flesh." }
        ],
        status: "available_for_trade"
      },
      {
        id: "LOT-MH-PIM-2598",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // Yesterday
        dateStr: "Yesterday, 03:20 PM",
        farmerName: "Dnyaneshwar Gaikwad",
        farmerId: "FARM-MH-7734",
        mandiId: "MH-PIM",
        mandiName: "Pimpalgaon APMC",
        variety: "Rangda Red",
        quantityQuintals: 65.0,
        estimatedPricePerQuintal: 2150,
        lotGrade: "URS",
        thumbnail: sampleImgMixed,
        annotatedImage: sampleImgMixed,
        stats: {
          totalBulbs: 9,
          gradeACount: 5,
          gradeAPct: 55.6,
          ursCount: 3,
          ursPct: 33.3,
          rejectCount: 1,
          rejectPct: 11.1,
          avgDiameterMm: 44.5,
          avgDamagePct: 4.8,
          sproutCount: 0
        },
        bulbs: [
          { id: 1, grade: "Grade A", diameterMm: 54.1, damagePct: 1.2, sproutScore: 0.0, shapeDev: 0.05, reason: "Grade A size (54.1mm) and firm flesh." },
          { id: 2, grade: "URS", diameterMm: 37.8, damagePct: 3.5, sproutScore: 0.0, shapeDev: 0.14, reason: "Under-sized (37.8mm) for Grade A; qualifies for domestic URS." },
          { id: 3, grade: "URS", diameterMm: 33.5, damagePct: 5.8, sproutScore: 0.05, shapeDev: 0.18, reason: "Small diameter (33.5mm) with minor dry skin peel." },
          { id: 4, grade: "Grade A", diameterMm: 55.0, damagePct: 0.9, sproutScore: 0.0, shapeDev: 0.04, reason: "Firm export grade." },
          { id: 5, grade: "Reject", diameterMm: 50.8, damagePct: 15.2, sproutScore: 0.0, shapeDev: 0.09, reason: "REJECT: Aspergillus niger rot patch covers 15.2% of surface (threshold 12%)." },
          { id: 6, grade: "URS", diameterMm: 39.1, damagePct: 4.1, sproutScore: 0.0, shapeDev: 0.12, reason: "URS commercial grade (39.1mm)." },
          { id: 7, grade: "Grade A", diameterMm: 53.3, damagePct: 1.4, sproutScore: 0.0, shapeDev: 0.06, reason: "Grade A quality." },
          { id: 8, grade: "Grade A", diameterMm: 56.7, damagePct: 0.8, sproutScore: 0.0, shapeDev: 0.03, reason: "Good firmness and color." },
          { id: 9, grade: "URS", diameterMm: 32.8, damagePct: 6.2, sproutScore: 0.08, shapeDev: 0.20, reason: "Sub-grade diameter with skin discoloration." }
        ],
        dispute: {
          id: "DSP-2026-001",
          lotId: "LOT-MH-PIM-2598",
          farmerName: "Dnyaneshwar Gaikwad",
          farmerPhone: "+91 97651 22910",
          reason: "Excessive Rot Penalty on Bulb #5",
          farmerNote: "Bulb #5 was only surface dirt from wet soil during morning unbagging, not black rot. If cleaned, this whole batch qualifies for Grade A base procurement rate.",
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          status: "open" // Open for DoCA review!
        },
        status: "disputed"
      },
      {
        id: "LOT-AP-KUR-2570",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
        dateStr: "2 days ago",
        farmerName: "K. Venkatesh",
        farmerId: "FARM-AP-4401",
        mandiId: "AP-KUR",
        mandiName: "Kurnool APMC",
        variety: "Bellary Red",
        quantityQuintals: 30.0,
        estimatedPricePerQuintal: 1100,
        lotGrade: "Reject",
        thumbnail: sampleImgReject,
        annotatedImage: sampleImgReject,
        stats: {
          totalBulbs: 9,
          gradeACount: 1,
          gradeAPct: 11.1,
          ursCount: 3,
          ursPct: 33.3,
          rejectCount: 5,
          rejectPct: 55.6,
          avgDiameterMm: 37.1,
          avgDamagePct: 7.2,
          sproutCount: 2
        },
        bulbs: [
          { id: 1, grade: "URS", diameterMm: 27.2, damagePct: 4.5, sproutScore: 0.05, shapeDev: 0.22, reason: "Borderline pinhead (27.2mm), high shape deviation." },
          { id: 2, grade: "Reject", diameterMm: 49.3, damagePct: 18.5, sproutScore: 0.0, shapeDev: 0.16, reason: "REJECT: Severe black fungal rot (18.5% surface damage)." },
          { id: 3, grade: "Reject", diameterMm: 52.7, damagePct: 2.1, sproutScore: 0.38, shapeDev: 0.25, reason: "REJECT: Active apical sprout shoot (length >15mm)." },
          { id: 4, grade: "Reject", diameterMm: 20.4, damagePct: 6.0, sproutScore: 0.0, shapeDev: 0.18, reason: "REJECT: Under minimum threshold size (20.4mm < 25mm limit)." },
          { id: 5, grade: "Grade A", diameterMm: 55.2, damagePct: 0.9, sproutScore: 0.0, shapeDev: 0.04, reason: "Complies with Grade A standard." },
          { id: 6, grade: "Reject", diameterMm: 50.1, damagePct: 16.8, sproutScore: 0.0, shapeDev: 0.14, reason: "REJECT: Rot decay covers 16.8% of bulb." },
          { id: 7, grade: "URS", diameterMm: 34.0, damagePct: 7.4, sproutScore: 0.12, shapeDev: 0.22, reason: "Visible sprout button and blemishes." },
          { id: 8, grade: "Reject", diameterMm: 51.8, damagePct: 3.2, sproutScore: 0.42, damageDev: 0.28, reason: "REJECT: Severe sprout elongation." },
          { id: 9, grade: "URS", diameterMm: 36.1, damagePct: 5.2, sproutScore: 0.06, shapeDev: 0.15, reason: "URS compliant." }
        ],
        status: "rejected_buffer"
      },
      {
        id: "LOT-GJ-MAH-2588",
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8h ago
        dateStr: "Today, 06:15 AM",
        farmerName: "Bhavsinh Gohil",
        farmerId: "FARM-GJ-3104",
        mandiId: "GJ-MAH",
        mandiName: "Mahuva APMC",
        variety: "Mahuva White Processing",
        quantityQuintals: 58.0,
        estimatedPricePerQuintal: 3100,
        lotGrade: "Grade A",
        thumbnail: sampleImgWhite,
        annotatedImage: sampleImgWhite,
        stats: {
          totalBulbs: 9,
          gradeACount: 8,
          gradeAPct: 88.9,
          ursCount: 1,
          ursPct: 11.1,
          rejectCount: 0,
          rejectPct: 0.0,
          avgDiameterMm: 53.4,
          avgDamagePct: 0.7,
          sproutCount: 0
        },
        bulbs: [
          { id: 1, grade: "Grade A", diameterMm: 53.2, damagePct: 0.3, sproutScore: 0.0, shapeDev: 0.03, reason: "Dehydration calibre (53.2mm); clean white dry scales, high firmness." },
          { id: 2, grade: "Grade A", diameterMm: 55.4, damagePct: 0.6, sproutScore: 0.0, shapeDev: 0.04, reason: "Prime white bulb; zero discoloration or rot." },
          { id: 3, grade: "Grade A", diameterMm: 50.1, damagePct: 0.4, sproutScore: 0.0, shapeDev: 0.03, reason: "Uniform globe; thin cured neck." },
          { id: 4, grade: "Grade A", diameterMm: 54.8, damagePct: 0.8, sproutScore: 0.0, shapeDev: 0.05, reason: "Meets Grade A processing specification." },
          { id: 5, grade: "Grade A", diameterMm: 58.0, damagePct: 0.2, sproutScore: 0.0, shapeDev: 0.02, reason: "Excellent dry matter density; pristine surface." },
          { id: 6, grade: "Grade A", diameterMm: 51.0, damagePct: 1.1, sproutScore: 0.0, shapeDev: 0.04, reason: "Complies with Grade A standard." },
          { id: 7, grade: "Grade A", diameterMm: 49.5, damagePct: 0.5, sproutScore: 0.0, shapeDev: 0.04, reason: "Clean papery tunic; dormant apical node." },
          { id: 8, grade: "Grade A", diameterMm: 56.2, damagePct: 0.4, sproutScore: 0.0, shapeDev: 0.03, reason: "Firm export grade white onion." },
          { id: 9, grade: "URS", diameterMm: 39.8, damagePct: 2.1, sproutScore: 0.02, shapeDev: 0.10, reason: "Slightly below 40mm export threshold; good for domestic processing." }
        ],
        status: "available_for_trade"
      }
    ];

    const seedDisputes = [
      {
        id: "DSP-2026-001",
        lotId: "LOT-MH-PIM-2598",
        farmerName: "Dnyaneshwar Gaikwad",
        farmerPhone: "+91 97651 22910",
        mandiName: "Pimpalgaon APMC",
        variety: "Rangda Red",
        reason: "Excessive Rot Penalty on Bulb #5",
        farmerNote: "Bulb #5 was only surface dirt from wet soil during morning unbagging, not black rot. If cleaned, this whole batch qualifies for Grade A base procurement rate.",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        originalLotGrade: "URS",
        originalStats: { gradeAPct: 55.6, ursPct: 33.3, rejectPct: 11.1 },
        status: "open",
        annotatedImage: sampleImgMixed
      }
    ];

    localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(seedLots));
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(seedDisputes));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  } catch (err) {
    console.error("Failed to initialize storage:", err);
  }
}

// Storage Access Helpers

export function getLots() {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getLotById(id) {
  const lots = getLots();
  return lots.find(l => l.id === id) || null;
}

export function saveLot(lot) {
  try {
    const lots = getLots();
    const existingIdx = lots.findIndex(l => l.id === lot.id);
    if (existingIdx >= 0) {
      lots[existingIdx] = lot;
    } else {
      lots.unshift(lot);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(lots));
    } catch (quotaErr) {
      console.warn("LocalStorage quota reached. Pruning older lot images to free space:", quotaErr);
      // Prune heavy base64 originalImage and thumbnail strings from lots beyond the top 4
      for (let i = lots.length - 1; i >= 3; i--) {
        if (lots[i].originalImage && lots[i].originalImage.length > 500) {
          lots[i].originalImage = "";
        }
        if (lots[i].annotatedImage && lots[i].annotatedImage.length > 500 && i > 5) {
          lots[i].annotatedImage = lots[i].thumbnail || "";
        }
      }
      try {
        localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(lots));
      } catch (retryErr) {
        // If still full, retain only top 8 lots
        const trimmed = lots.slice(0, 8);
        try {
          localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(trimmed));
        } catch (finalErr) {
          console.error("Critical: Could not write lots to localStorage", finalErr);
        }
      }
    }
  } catch (err) {
    console.error("saveLot encountered an error:", err);
  }
  return lot;
}

export function getDisputes() {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DISPUTES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveDispute(dispute) {
  const disputes = getDisputes();
  const newDispute = {
    id: `DSP-2026-${String(disputes.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    status: "open",
    ...dispute
  };
  disputes.unshift(newDispute);
  localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));

  // Also update corresponding lot status
  const lot = getLotById(dispute.lotId);
  if (lot) {
    lot.status = "disputed";
    lot.dispute = newDispute;
    saveLot(lot);
  }
  return newDispute;
}

export function resolveDispute(disputeId, resolution) {
  const disputes = getDisputes();
  const idx = disputes.findIndex(d => d.id === disputeId);
  if (idx < 0) return null;

  disputes[idx] = {
    ...disputes[idx],
    ...resolution,
    resolvedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));

  // Sync back to lot and update its grade/status
  const updatedDispute = disputes[idx];
  const lot = getLotById(updatedDispute.lotId);
  if (lot) {
    lot.status = updatedDispute.status === "overridden" ? "grade_overridden" : "grade_upheld";
    if (updatedDispute.status === "overridden" && updatedDispute.overriddenGrade) {
      lot.lotGrade = updatedDispute.overriddenGrade;
      // Adjust lot stats if overridden to Grade A
      if (updatedDispute.overriddenGrade === "Grade A") {
        lot.stats.gradeAPct = Math.min(100, (lot.stats.gradeAPct || 0) + (lot.stats.rejectPct || 0));
        lot.stats.rejectPct = 0;
      }
    }
    lot.dispute = updatedDispute;
    saveLot(lot);
  }

  return updatedDispute;
}

export function savePurchaseRequest(purchase) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    const purchases = raw ? JSON.parse(raw) : [];
    const newPurchase = {
      id: `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      ...purchase
    };
    purchases.unshift(newPurchase);
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    return newPurchase;
  } catch (e) {
    return null;
  }
}

export function getPurchaseRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function updatePurchaseRequestStatus(id, status) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    const purchases = raw ? JSON.parse(raw) : [];
    const idx = purchases.findIndex(p => p.id === id);
    if (idx !== -1) {
      purchases[idx] = { ...purchases[idx], status, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
      return purchases[idx];
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function getRulesConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RULES);
    return raw ? JSON.parse(raw) : DEFAULT_GRADE_CONFIG;
  } catch (e) {
    return DEFAULT_GRADE_CONFIG;
  }
}

export function saveRulesConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(config));
  } catch (e) {}
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEYS.LOTS);
  localStorage.removeItem(STORAGE_KEYS.DISPUTES);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  localStorage.removeItem(STORAGE_KEYS.PURCHASES);
  initializeStorage();
}
