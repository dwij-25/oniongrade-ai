# OnionGrade AI: Assisted Onion Quality Grading for Mandi Transparency

## 1. Project Overview
**Project Name:** OnionGrade AI
**Hackathon:** Smart India Hackathon (SIH) 2025
**Theme:** Agriculture, FoodTech & Rural Development

**Problem Statement Context:**
Onion pricing in India is uniquely volatile and largely determined by manual, subjective visual grading at APMC mandis, which leaves farmers exposed to inconsistent quality assessments and distress sales during price crashes. Unlike cereals, pulses, and oilseeds, **onion does not carry a formal government Minimum Support Price (MSP)** — instead it is covered under the perishables component of the PM-AASHA umbrella scheme, where the government can trigger direct compensation or transport/storage support to farmers when open-market prices fall sharply, and NAFED/NCCF run buffer-stock market intervention to stabilize retail prices. This project targets the layer *before* any government scheme kicks in: giving farmers an objective, timestamped quality record at the point of sale so they aren't at the mercy of a trader's or officer's subjective call.

**Core Objective:**
To replace manual, subjective assessment of onions with a rapid, transparent optical grading platform that evaluates equatorial diameter, shape uniformity, and visible pathology (e.g., *Aspergillus niger* black mold, soft rot, sprouting) and produces a size/quality report farmers, traders, and procurement officers can all reference from the same data.

**Important framing correction:** This is a *quality assessment and transparency tool*, not a government-certified grading authority. Its outputs are decision-support signals for negotiation and dispute resolution at the mandi — they are not a substitute for, or an extension of, any official AGMARK/DMI certification process unless formally integrated with the relevant government body.

---

## 2. Technical Architecture & Stack

### Frontend Application
* **Framework:** React.js (bootstrapped with Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Context API (`AuthContext`, `LanguageContext`)
* **Routing:** React Router v6

### AI & Vision Pipeline
1. **On-device pre-processing (Edge CV):** Contour segmentation and dimensional estimation (pixel-to-mm conversion using a reference object or manual calibration) to give an instant, offline size estimate before any network call. *Latency figures for this stage should be benchmarked against the actual model/device used before being quoted publicly — do not state a number until it's measured.*
2. **Cloud vision model:** A multimodal vision API call (e.g., a current Gemini Pro Vision model, or an alternative like a fine-tuned vision-language model) processes the tray image for pathology cues — visible mold, soft rot, sprouting — and returns structured JSON. **Name the exact model version once integration is finalized; do not invent a version number.**

### Data Storage & Persistence
* **Current implementation (prototype):** Browser LocalStorage, standing in for a real backend — explicitly a placeholder, not a design decision to keep.
* **Proposed production backend:** Node.js/Express with PostgreSQL for transactional records (weighbridge slips, lot IDs) and a document store (MongoDB or similar) for AI inference logs and image metadata. Farmer identity data should be encrypted at rest and access-scoped per the RBAC roles below — this needs an explicit data protection design, not just a mention.

---

## 3. The 4 Operational Roles (RBAC)

1. **Farmer / Seller — Grade**
   Uploads or captures live photos of onion trays to generate a quality report. Retains full access to their own lot history; personal identity is not exposed to traders browsing lots. Can file a grievance against a disputed grading result.

2. **Retailer / Trader — Browse**
   Views anonymized lot data (grade distribution, size, region) to make procurement decisions, without seeing farmer identity.

3. **Procurement Officer — Process Queue**
   Manages mandi intake queue, generates e-lot weighbridge receipts, and maintains an auditable queue log.

4. **Government / Oversight body — Oversee**
   National-level dashboards on quality trends, post-harvest spoilage patterns by region, and a dispute-resolution terminal. *Note: which specific government body (state APMC board, DMI, Department of Consumer Affairs, or Ministry of Agriculture) would actually consume this dashboard should be decided explicitly — "Government / DoCA" as currently written conflates several distinct agencies with different mandates.*

---

## 4. Grading Reference Standards

There is no single unified, digitally-enforced national standard for fresh onion size/quality grading at the mandi level today — grading in India is still mostly manual. This project should be explicit about which reference it uses and label anything custom as such.

### Real, citable reference points
* **ICAR-Directorate of Onion and Garlic Research (DOGR)** classifies onion bulbs into three size grades: **Grade A (>80mm)**, **Grade B (50-80mm)**, **Grade C (30-50mm)** diameter.
* **Legal basis for grading/marking generally:** the Agricultural Produce (Grading & Marking) Act, 1937, and — for export-oriented grading specifically — the Fruits and Vegetables Grading and Marking Rules, 2004, administered by the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare. AGMARK certification for onions is currently used mainly for **export consignments**, not routine domestic mandi trade.
* **Domestic market size preferences vary by destination** and are demand-driven rather than regulatory: roughly 50-60mm for general domestic demand, 60mm+ preferred in large cities, sub-50mm accepted in parts of Bihar/West Bengal, and export sizing that varies by country (e.g., 30-35mm for Bangladesh, 40-60mm for Gulf markets, 60mm+ for parts of Europe).

### This project's grading bands (clearly labeled as project-defined, not government-mandated)
Until/unless this is formally adopted or validated by an agricultural marketing authority, treat the following as **OnionGrade AI's own working thresholds**, adapted from ICAR-DOGR's size bands with added pathology criteria for this use case:

* **Grade A (Prototype threshold):** >50mm diameter, intact dry outer skin, no visible sprouting, no visible mold, <5% surface defect.
* **Grade B / Standard (Prototype threshold):** 35-50mm diameter, minor skin peeling, no active soft rot.
* **Reject (Prototype threshold):** visible black mold or watery soft decay, active green shoots >10mm, severe deformation.

*(These numeric cutoffs should be validated against a real, labelled onion image dataset and ideally reviewed with an agricultural extension officer or ICAR-DOGR before being presented as authoritative to judges or any real mandi.)*

### AI Output Schema (illustrative — pending real model integration)
```json
{
  "isOnion": true,
  "detectedClass": "onion",
  "confidence": 98.5,
  "rejectionReason": "",
  "lotGrade": "Grade A",
  "stats": {
    "gradeAPct": 85,
    "standardPct": 12,
    "rejectPct": 3
  },
  "estimatedBulbCount": 15,
  "averageDiameterMm": 52.4,
  "skinQualityScore": 9.2,
  "pathologyNotes": "Minimal signs of spoilage.",
  "farmerAdvice": "Excellent curing process."
}
```
**Note:** the percentages and scores above are placeholder/simulated outputs for UI development. They have not been validated against ground-truth graded onion samples. This should be flagged clearly in any demo so judges don't mistake mockup data for a validated model.

---

## 5. Key Features & Workflows

### The Grading Workflow (`GradingWorkflow.jsx`)
1. **Input Stage:** Live camera capture or photo upload of an onion tray.
2. **Analysis Stage:** Local contour segmentation for sizing, followed by a cloud vision-model call for pathology detection.
3. **Report Stage:**
   * Interactive chart showing lot distribution (Grade A / Standard / Reject).
   * Visual annotations over detected onions.
   * **Manual calibration:** users can override the estimated average diameter and total lot volume; the UI recalculates individual bulb estimates from the override.
4. **Localization:** Hindi and English toggle throughout.

### Failsafes & Input Validation
* Non-onion images (keyboards, faces, unrelated objects) are flagged as `isOnion: false` by the vision model.
* A diagnostics panel explains rejection reasons in plain language and gives recovery guidance (e.g., "no onions detected — retake photo with the tray fully in frame").

---

## 6. Language & Accessibility
* Global English/Hindi toggle via `LanguageContext`, backed by a `translations.js` dictionary plus inline conditional rendering for dynamic UI text.
* Applies across the landing page, grading workflow, and all role dashboards.

---

## 7. Limitations & Honest Assumptions
This section exists so judges, collaborators, and future contributors know exactly what's real versus simulated in the current build:

* **No validated dataset yet.** The vision model's pathology/grading outputs are not yet benchmarked against a labelled set of real onion photos with ground-truth grades.
* **No live government integration.** This tool does not currently connect to any APMC, AGMARK/DMI, or state mandi board system. All "grading" is internal to this app.
* **LocalStorage is not a real backend** and won't survive multi-device or multi-user real-world use — treat it strictly as a UI prototyping shortcut.
* **Diameter accuracy depends on calibration.** Without a fixed reference object or a calibrated camera setup, mm-level size estimates from a phone photo carry meaningful error margins that haven't been quantified yet.
* **The specific vision model/version to be used should be confirmed and named explicitly** once integration work begins, rather than left as a placeholder.

---

## 8. Future Scope: Low-Cost Add-On Imaging (Realistic Framing)

An earlier draft of this document proposed a "hyperspectral imaging processor" add-on at a ₹1000 price point. Based on current research, **true hyperspectral imaging at that price point is not realistic**:
* The most-cited low-cost academic build (University of Cambridge) converts a smartphone into a visible-spectrum (400–700nm) hyperspectral sensor for roughly £100 (~₹10,000-11,000) using a 3D-printed housing and diffraction grating — and that's a research prototype, not a consumer product.
* Commercial hyperspectral camera systems for produce sorting range from several lakhs to tens of lakhs of rupees.

**A more realistic future-scope pitch:** a low-cost **multispectral** (not hyperspectral) clip-on lens attachment using a diffraction-grating film or a small set of narrow-bandpass filters (e.g., red/near-infrared), which can plausibly be prototyped in the ₹500-2000 range. This wouldn't give full spectral resolution, but could support a few extra discrete wavelength bands beyond RGB — potentially useful for catching early internal spoilage or moisture stress before it's visible to the naked eye. This should be pitched as "multispectral, hyperspectral-inspired" future work, with an explicit note that it requires its own calibration and validation study, not as an already-solved ₹1000 add-on.

---

## 9. Setup & Run Instructions
```bash
npm install
npm run dev
```
Production build:
```bash
npm run build
```

---

## References
1. ICAR – Directorate of Onion and Garlic Research, "Grading," https://dogr.icar.gov.in
2. Agricultural Produce (Grading & Marking) Act, 1937 — parent legislation for AGMARK.
3. Fruits and Vegetables Grading and Marking Rules, 2004 — administered by the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare.
4. PM-AASHA scheme documentation — Ministry of Agriculture & Farmers Welfare (covers perishables price support for tomato, onion, potato via price-deficiency/market-intervention mechanisms, not MSP).
5. Vogt et al., "Low-Cost Hyperspectral Imaging with a Smartphone," J. Imaging 2021, 7(8), 136 — smartphone hyperspectral prototype cost benchmark.

*All figures above should be re-verified against the current, dated source before final submission, since government schemes and thresholds are periodically revised.*
