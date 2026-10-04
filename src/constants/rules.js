// Government of India / Department of Consumer Affairs (DoCA)
// Standard Operating Quality Specification for Agri-Produce: Onions (Allium cepa)

export const DEFAULT_GRADE_CONFIG = {
  version: "ICAR-DOGR-STD-2025",
  lastUpdated: "2026-04-10",
  title: "National Onion Quality & Grading Standard",
  rules: {
    gradeA: {
      label: "Grade A (Super Premium Export)",
      minDiameterMm: 40,
      maxDiameterMm: 65,
      maxDamagePct: 2.0,      // Max rot / surface dark patch %
      maxSproutScore: 0.04,   // Vegetative shoot threshold
      maxShapeDeviation: 0.15,// Irregularity / eccentricity deviation
      description: "Well-cured, firm, globular bulbs of uniform size and color with intact dry outer scales. Free from cuts, rot, and sprouting."
    },
    urs: {
      label: "URS (Domestic Regulated Standard)",
      minDiameterMm: 25,
      maxDiameterMm: 40,
      maxDamagePct: 12.0,     // Minor surface blemishes / black spots
      maxSproutScore: 0.20,   // Minor visible sprout button
      maxShapeDeviation: 0.32,
      description: "Domestic commercial consumption grade. May include smaller bulbs (25-40mm) or minor skin blemishes not affecting internal fleshy scales."
    },
    reject: {
      label: "Reject / C-Grade (Spoilage / Industrial)",
      minDiameterMm: 0,
      maxDiameterMm: 25,      // Under 25mm is rejected as unmarketable pinheads
      minDamagePct: 12.0,     // Over 12% black mold, rot, or soft decay
      minSproutScore: 0.20,   // Advanced green vegetative shoot
      description: "Unfit for commercial transit. Includes decaying bulbs, advanced apical sprouting, mechanical crush, or severely undersized pinhead bulbs."
    }
  }
};

export const APMC_MANDIS = [
  { id: "MH-LAS", name: "Lasalgaon APMC", state: "Maharashtra", district: "Nashik" },
  { id: "MH-PIM", name: "Pimpalgaon APMC", state: "Maharashtra", district: "Nashik" },
  { id: "GJ-MAH", name: "Mahuva APMC", state: "Gujarat", district: "Bhavnagar" },
  { id: "AP-KUR", name: "Kurnool APMC", state: "Andhra Pradesh", district: "Kurnool" },
  { id: "RJ-ALW", name: "Alwar Mandi", state: "Rajasthan", district: "Alwar" },
  { id: "KA-HUB", name: "Hubli APMC", state: "Karnataka", district: "Dharwad" }
];

export const ROLES = {
  FARMER: "farmer",
  RETAILER: "retailer",
  OFFICER: "officer",
  GOVERNMENT: "government"
};

export const ROLE_INFO = {
  [ROLES.FARMER]: {
    name: "Farmer / Seller",
    nameHindi: "किसान / उत्पादक",
    nameMarathi: "शेतकरी / कांदा उत्पादक",
    nameGujarati: "ખેડૂત / ડુંગળી ઉત્પાદક",
    shortName: "Farmer",
    shortNameHindi: "किसान",
    shortNameMarathi: "शेतकरी",
    shortNameGujarati: "ખેડૂત",
    badgeBg: "bg-[#F18B49]/15",
    badgeText: "text-[#F18B49]",
    badgeBorder: "border-[#F18B49]/40",
    accentColor: "#F18B49",
    tagline: "Quality certification & fair APMC procurement prices"
  },
  [ROLES.RETAILER]: {
    name: "Retailer / Trader",
    nameHindi: "व्यापारी / थोक खरीदार",
    nameMarathi: "व्यापारी / अडतदार",
    nameGujarati: "વેપારી / જથ્થાબંધ ખરીદનાર",
    shortName: "Trader",
    shortNameHindi: "व्यापारी",
    shortNameMarathi: "व्यापारी",
    shortNameGujarati: "વેપારી",
    badgeBg: "bg-[#EB87A9]/15",
    badgeText: "text-[#EB87A9]",
    badgeBorder: "border-[#EB87A9]/40",
    accentColor: "#EB87A9",
    tagline: "Mandi marketplace for verified, graded lots"
  },
  [ROLES.OFFICER]: {
    name: "Procurement Centre Officer",
    nameHindi: "खरीद केंद्र अधिकारी",
    nameMarathi: "खरेदी केंद्र अधिकारी",
    nameGujarati: "ખરીદ કેન્દ્ર અધિકારી",
    shortName: "APMC Officer",
    shortNameHindi: "मंडी अधिकारी",
    shortNameMarathi: "बाजार समिती अधिकारी",
    shortNameGujarati: "મંડી અધિકારી",
    badgeBg: "bg-[#F8D5C2]/15",
    badgeText: "text-[#F8D5C2]",
    badgeBorder: "border-[#F8D5C2]/40",
    accentColor: "#F8D5C2",
    tagline: "Digital weighbridge, intake camera & lot logging"
  },
  [ROLES.GOVERNMENT]: {
    name: "Government / DoCA Oversight",
    nameHindi: "सरकार / DoCA निगरानी",
    nameMarathi: "शासकीय / DoCA देखरेख",
    nameGujarati: "સરકારી / DoCA દેખરેખ",
    shortName: "DoCA Official",
    shortNameHindi: "DoCA अधिकारी",
    shortNameMarathi: "DoCA अधिकारी",
    shortNameGujarati: "DoCA અધિકારી",
    badgeBg: "bg-[#5F1C47]/40",
    badgeText: "text-[#EB87A9]",
    badgeBorder: "border-[#EB87A9]/40",
    accentColor: "#EB87A9",
    tagline: "National price stabilization, quality audit & dispute resolution"
  }
};
