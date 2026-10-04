export type Role = "farmer" | "retailer" | "officer" | "government";
export type Grade = "Grade A" | "URS" | "Reject";
export type Lot = {
  id: string;
  farmerName: string;
  mandiName: string;
  variety: string;
  quantityQuintals: number;
  lotGrade: Grade;
  gradeAPct: number;
  ursPct: number;
  rejectPct: number;
  mspPrice: number;
  status?: "Queued" | "Issued";
};
export const rolePeople: Record<Role, { name: string; org: string }> = {
  farmer: { name: "Rameshwar Patil", org: "Lasalgaon APMC, Maharashtra" },
  retailer: { name: "Mehul Shah", org: "Mumbai Wholesale Market" },
  officer: { name: "Priya Menon", org: "Nashik APMC Procurement Division" },
  government: { name: "Kavita Iyer", org: "DoCA Ministry, New Delhi" },
};
export const seedLots: Lot[] = [
  {
    id: "LOT-MH-001",
    farmerName: "Rameshwar Patil",
    mandiName: "Lasalgaon APMC",
    variety: "Garwa (Rabi)",
    quantityQuintals: 45,
    lotGrade: "Grade A",
    gradeAPct: 78,
    ursPct: 15,
    rejectPct: 7,
    mspPrice: 2850,
    status: "Queued",
  },
  {
    id: "LOT-MH-002",
    farmerName: "Suresh Jadhav",
    mandiName: "Pimpalgaon",
    variety: "Rangda (Kharif)",
    quantityQuintals: 30,
    lotGrade: "URS",
    gradeAPct: 42,
    ursPct: 45,
    rejectPct: 13,
    mspPrice: 2850,
    status: "Queued",
  },
  {
    id: "LOT-GJ-003",
    farmerName: "Dev Patel",
    mandiName: "Mahuva",
    variety: "Mahuva White",
    quantityQuintals: 60,
    lotGrade: "Grade A",
    gradeAPct: 89,
    ursPct: 8,
    rejectPct: 3,
    mspPrice: 2850,
    status: "Issued",
  },
  {
    id: "LOT-AP-004",
    farmerName: "Anil Reddy",
    mandiName: "Kurnool",
    variety: "Pol (Kharif)",
    quantityQuintals: 25,
    lotGrade: "Grade A",
    gradeAPct: 71,
    ursPct: 22,
    rejectPct: 7,
    mspPrice: 2850,
    status: "Queued",
  },
];
export const getLots = (): Lot[] => {
  if (typeof window === "undefined") return seedLots;
  const raw = localStorage.getItem("apmc_lots_v2");
  if (!raw) {
    localStorage.setItem("apmc_lots_v2", JSON.stringify(seedLots));
    return seedLots;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return seedLots;
  }
};
export const saveLots = (lots: Lot[]) => localStorage.setItem("apmc_lots_v2", JSON.stringify(lots));
