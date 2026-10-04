# OnionGrade AI – Technical & Functional Summary

This document serves as a comprehensive guide for external reviewers and QA testers. It covers the technical stack, user roles, feature flows, routing, APIs, and known limitations of the OnionGrade AI platform.

---

## 1. Overview
* **Project Name:** OnionGrade AI
* **One-Line Purpose:** An objective, AI-driven optical grading platform for onions at APMC Mandis to ensure fair price discovery and prevent distress sales.
* **Deployment Status:** Local-only (prototype build available via `npm run build` or running on `http://localhost:5173`).
* **Tech Stack:**
  * **Frontend Framework:** React.js (Vite)
  * **Styling:** Tailwind CSS + Lucide React icons
  * **Vision API (Cloud):** Google AI Studio (Gemini 1.5 Pro Multimodal API / `gemini-3.6-flash` endpoint)
  * **Database/Storage:** Browser `localStorage` (mocking a real DB for prototype phase)
  * **Backend:** N/A (Serverless/Client-side implementation)

---

## 2. Site Map
| Path | Purpose | Access Level |
|------|---------|--------------|
| `/` | **Public Landing Page:** Explains the platform, metrics, architecture, and data privacy models. | Public |
| `/login` | **Login Page/Modal:** Entry point to authenticate into one of the 4 operational roles. | Public |
| `/farmer` | **Farmer Dashboard:** View past lots, file grievances, and initiate a new optical grading scan. | Protected (`FARMER`) |
| `/retailer` | **Trader/Retailer Dashboard:** Browse anonymized mandi stock, view aggregated lot qualities. | Protected (`RETAILER`) |
| `/officer` | **Procurement Officer Dashboard:** Intake queue management, automated weighbridge slip generation. | Protected (`OFFICER`) |
| `/government` | **DoCA/Government Dashboard:** Macro-level heatmaps, national quality trends, and dispute resolution. | Protected (`GOVERNMENT`) |

*All protected routes redirect unauthenticated users to `/login`. Users attempting to access a route belonging to another role are redirected to their designated dashboard.*

---

## 3. User Roles & Access (Test Credentials)

The application simulates authentication. You can test each role via the `/login` route or by clicking "Log In" on the landing page.

### 1. Farmer / Seller
* **Capabilities:** Can upload/capture photos of onion trays to generate grading reports. Can view their own lot history and file disputes. Cannot see other farmers' personal data or the trader marketplace backend.
* **Test Login:**
  * **Method:** Phone Number + OTP
  * **Phone Input:** `+91 98224 81920` (Validation: Must be >= 8 chars)
  * **OTP:** `4280` (Auto-fills on demo)

### 2. Retailer / Trader
* **Capabilities:** Browses all available graded lots across the APMC. Sees anonymized data (e.g., "Lot #492 - 85% Grade A") to make purchasing decisions. Cannot initiate a new grading scan.
* **Test Login:**
  * **Method:** Phone Number + OTP
  * **Phone Input:** `+91 94250 11983` 
  * **OTP:** `4280` (Auto-fills on demo)

### 3. Procurement Officer
* **Capabilities:** Manages the mandi intake queue. Sees farmer names mapped to lot IDs. Can generate e-lot weighbridge receipts.
* **Test Login:**
  * **Method:** Official ID + Password
  * **ID Input:** `APMC-INSP-8492`
  * **Password Input:** `password123` (Auto-fills on demo)

### 4. Government / DoCA
* **Capabilities:** Global oversight. Views macro analytics, heatmaps of post-harvest rot, and manages dispute resolution logs.
* **Test Login:**
  * **Method:** Official ID + Password
  * **ID Input:** `DOCA-HQ-001` (Auto-fills on demo)
  * **Password Input:** `password123` (Auto-fills on demo)

*(Note: Test credentials automatically auto-fill when you click a role card in the Login Modal).*

---

## 4. Core Features & Flows

### A. The Optical Grading Workflow (Feature Flow)
* **Access:** Via the "Grade My Onions" button on the Farmer Dashboard.
* **Step 1 (Input):** User uploads an image via file picker (`accept="image/*"`) or uses the live device camera.
* **Step 2 (Analysis):** The UI displays a simulated "Neon Laser Scan" representing Edge CV contour segmentation, while the app sends the Base64 image to the Gemini Multimodal Vision API.
* **Step 3 (Report Generation):** 
  * **Expected Output (Success):** An interactive 3D Donut Chart detailing Grade A, Grade B, and Reject percentages. Visual UI overlays neon bounding rings on the processed image.
  * **Expected Output (Failure/Non-Onion):** If a keyboard or face is uploaded, the API returns `isOnion: false`. The UI gracefully handles this by rendering a "Diagnostics Breakdown" with recovery guidance.
* **Forms & Validation (Manual Calibration):** 
  * In the report view, clicking the sliders icon opens manual calibration.
  * **Fields:** Average Diameter (mm) and Total Lot Weight (Quintals).
  * **Validation:** Numeric inputs only. Changing these recalculates the individual bulb size estimations retroactively in the UI.

### B. Language Localization
* **Flow:** Clicking the "EN/HI" globe icon in the Top Navigation translates the entire interface instantly.
* **Expected Output:** Landing page, role dashboards, and even the grading diagnostic reports should switch to Devanagari script (Hindi).

---

## 5. APIs & Backend Endpoints

There is no custom Node.js/Python backend in this prototype. The only external API call is made directly from the client to Google AI Studio.

* **Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`
* **Auth:** Passed via query parameter `?key=[VITE_GEMINI_API_KEY]`
* **Payload:** A structured prompt containing the ICAR-DOGR grading standards instruction set, plus the Base64-encoded image inline data.
* **Response:** The prompt uses `responseMimeType: "application/json"`. The API strictly returns a JSON object mapping to the grading schema (`isOnion`, `lotGrade`, `stats`, `averageDiameterMm`, `pathologyNotes`).

---

## 6. Data & Storage
* **Mechanism:** Browser `localStorage`
* **Keys Used:**
  * `oniongrade_auth_state_v1`: Stores current logged-in user object and role.
  * `oniongrade_user`: Mock user database configuration.
  * `oniongrade_lots`: Stores the generated grading reports and market data.
  * `oniongrade_disputes`: Stores grievance logs.
* **Data Mocking:** The user accounts, baseline marketplace lots, and dispute logs are seeded with mock data via `src/services/storage.js` when the app first loads. Any new grading scans are appended to this local storage.

---

## 7. Known Issues / Things to Check (Reviewer Notes)

1. **AI Output Consistency:** Because we are using an LLM Multimodal Vision API (Gemini) rather than a deterministic YOLO/CNN model, the exact percentages and pathology notes might slightly hallucinate or vary between identical images. The data is currently *illustrative* and not validated against a ground-truth dataset.
2. **Device Constraints (Mobile Responsiveness):** 
   * The app uses Tailwind `sm/md/lg` breakpoints and is generally responsive.
   * **Test explicitly:** The 3D Donut Chart layout and the AI Bounding Box overlay (`GradingWorkflow.jsx`) on narrow screens (e.g., iPhone SE). The overlay might shift slightly out of alignment with the base image on non-standard aspect ratios.
3. **Data Volatility:** Since everything relies on `localStorage`, opening the app in an Incognito window or clearing browser data will wipe all generated lots and reset the app to its default seeded state.
4. **Camera Access:** The live camera feed requires the app to be served over `https://` or `localhost`. If testing over a local network IP without SSL, the browser may block the `getUserMedia` API.
5. **Simulated Edge CV:** The "120ms Edge inference" is a UX simulation (a timeout delay). Only the cloud Gemini API call is actually executed in this build.
