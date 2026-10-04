# OnionGrade AI: Assisted Onion Quality Grading for Mandi Transparency

## 1. Project Overview
**Project Name:** OnionGrade AI
**Hackathon:** Smart India Hackathon (SIH) 2025
**Theme:** Agriculture, FoodTech & Rural Development

**Problem Statement Context:**
Onion pricing in India is uniquely volatile and largely determined by manual, subjective visual grading at APMC mandis. Unlike cereals and pulses, **onions do not carry a formal government Minimum Support Price (MSP)**. They are covered under the perishables component of the PM-AASHA scheme. Our system targets the layer *before* government intervention: giving farmers an objective, timestamped quality record at the point of sale.

**Core Objective & e-NAM Integration:**
To replace manual assessment with a rapid optical grading platform. This is designed not as a standalone competing marketplace, but as a **modular quality-assaying plug-in feeding into the existing e-NAM portal**.

---

## 2. Server-Side Architecture & Microservices

To support a production-grade, transparent audit trail, the backend architecture relies on the following decoupled microservices (Demo hosted on Vercel/Supabase; Production on AWS):

1. **Auth & Identity Service (DPDP Act Compliant):**
   * **Farmer Login:** OTP-based phone authentication via Firebase Auth / Msg91, due to shared devices and literacy barriers.
   * **Identity:** Linked to APMC/Aadhaar-based e-KYC. Farmer PII is tokenized and strictly access-scoped. Traders see only anonymized Lot UUIDs.
2. **Image Ingestion & Storage Service:**
   * Raw tray photos are ingested via signed URLs and stored in AWS S3 / GCP Cloud Storage at 1080p resolution.
   * **Retention:** Kept in hot storage for 90 days (active dispute window) before cold-tier archiving.
3. **AI Inference Orchestration:**
   * A Node.js/Python message queue (e.g., BullMQ) that calls the **Google Gemini 1.5 Pro Multimodal Vision API**.
   * Logs every inference with a strict timestamp, model version, and raw JSON output into an append-only, immutable database table (PostgreSQL) to guarantee the core transparency claim: *"The AI said Grade A on this exact date with this exact image."*
4. **Dispute & Audit Service:**
   * State-machine backed grievance backend (Filed → Under Review → Resolved). 
   * **Authority:** Escalations are transitioned only by verified APMC Mandi Inspectors or DoCA Magistrates.
5. **IoT Weighbridge Integration Layer:**
   * MQTT/REST endpoints that directly ingest digital weighbridge telemetry. This replaces manual "typed" weight inputs with tamper-resistant hardware data.
6. **Notification Service:**
   * SMS/WhatsApp webhook triggers to notify farmers of grading results or dispute resolutions asynchronously.
7. **Admin/Analytics Aggregation:**
   * Uses materialized views and Redis caching to serve the DoCA/Government dashboards without impacting the main transactional DB.

---

## 3. The 4 Operational Roles (RBAC)

1. **Farmer / Seller (Verb: GRADE)**
   * Uploads photos. Retains full access to lot history. Can file grievances.
2. **Retailer / Trader (Verb: BROWSE)**
   * Views anonymized lot data (grade distribution, size, region) without seeing farmer identity.
3. **Procurement Officer (Verb: PROCESS QUEUE)**
   * Manages mandi intake queue, generates e-lot weighbridge receipts.
4. **Government / Oversight (Verb: OVERSEE)**
   * State APMC boards or DMI monitoring national quality trends and dispute resolutions.

---

## 4. Grading Standards & AI Prompts

The system references the **ICAR-Directorate of Onion and Garlic Research (DOGR)** size bands. Pathology criteria are simulated project-defined thresholds.

* **Grade A:** >80mm diameter, intact skin, zero mold, <5% surface defect.
* **Grade B:** 50-80mm diameter, minor peeling, zero active soft rot.
* **Grade C / Reject:** 30-50mm diameter or smaller, visible black mold, active green shoots (>10mm).

---

## 5. Offline-First Connectivity & UI Workflows

**Connectivity Assumption:** Mandis frequently suffer from poor network coverage. 
* **Edge Sizing:** The initial contour segmentation (sizing) runs locally on-device.
* **Service Workers:** The high-res image payload and cloud pathology request are queued via IndexedDB/Service Workers and auto-sync to the orchestrator when 4G connectivity is restored.

---

## 6. Language & Accessibility
* **Demo Scope:** English and **Hindi** via a dynamic translation dictionary (`LanguageContext`).
* **Production Scope:** Architecture is ready to scale to Marathi and Kannada (to cover the massive Maharashtra/Karnataka onion belts).

---

## 7. Limitations, Assumptions & Future Scope
* **Unvalidated Dataset:** Current grading outputs are a proof-of-concept. The system requires benchmarking against a rigorously labeled ICAR-DOGR ground-truth dataset. (Current demo uses Kaggle 'Onion-Classification' data + custom captures).
* **Latency Targets:** Edge inference latency figures are targets for finalized deployment.
* **Future Hardware Scope - Low-Cost Multispectral Add-On:** Instead of expensive hyperspectral cameras, we propose a low-cost **multispectral camera clip-on** (using narrow-bandpass filters in the ₹500–₹2000 range) for deep internal rot detection.

---

## 8. References
1. **ICAR – Directorate of Onion and Garlic Research**, "Grading," https://dogr.icar.gov.in
2. **DPDP Act, 2023** — Digital Personal Data Protection Act compliance frameworks.
3. **Fruits and Vegetables Grading and Marking Rules, 2004** — DMI, Ministry of Agriculture.
4. **PM-AASHA Scheme** — Ministry of Agriculture & Farmers Welfare.
