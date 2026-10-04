/**
 * Gemini Multimodal Vision AI Pipeline for OnionGrade AI
 * Directly interfaces with Google AI Studio Gemini API for deep agronomic grading,
 * produce verification, individual bulb bounding-box detection, and pathology analysis.
 *
 * Calibrated to Government of India Department of Consumer Affairs (DoCA)
 * and ICAR-Directorate of Onion and Garlic Research (ICAR-DOGR) standards.
 */

export function getGeminiApiKey() {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.GEMINI_API_KEY ||
    ""
  );
}

/**
 * Analyzes an onion tray / mandi / pile image using Gemini Multimodal Vision
 * @param {string} dataUrl Base64 data URL of the image
 * @param {string} language Language code ('en', 'hi', 'mr', 'gu')
 * @returns {Promise<object>} Structured inspection result
 */
export async function analyzeWithGeminiVision(dataUrl, language = "en") {
  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey.length < 10) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  let mimeType = "image/jpeg";
  let base64Data = dataUrl;

  if (dataUrl.startsWith("data:")) {
    const commaIdx = dataUrl.indexOf(",");
    if (commaIdx !== -1) {
      const header = dataUrl.slice(0, commaIdx);
      base64Data = dataUrl.slice(commaIdx + 1);
      const mimeMatch = header.match(/data:([^;]+)/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
    } else {
      throw new Error("Invalid image base64 data format.");
    }
  } else {
    throw new Error("Expected base64 data URL.");
  }

  const langInstruction = language === "hi"
    ? "HINDI (हिन्दी — Devanagari script)"
    : language === "mr"
      ? "MARATHI (मराठी — Devanagari script)"
      : language === "gu"
        ? "GUJARATI (ગુજરાતી)"
        : "ENGLISH";

  const systemInstruction = `You are OnionGrade AI — an expert agricultural computer vision system calibrated to Government of India Department of Consumer Affairs (DoCA) and ICAR-Directorate of Onion and Garlic Research (ICAR-DOGR) quality standards for Allium Cepa (onions).

TASK: Analyze the provided photo with maximum agronomic precision and object detection accuracy.

STEP 1 — PRODUCE VERIFICATION:
Determine if this image shows real onions (Allium Cepa) in any form: individual bulbs, tray, crate, net bag, basket, pile on ground, warehouse floor, field, sack, or market counter.
- Valid scenes: onion bulbs, onion piles, onion lots in jute sack, onions in crate/net/tray, cut onions showing flesh.
- Invalid scenes: laptops, keyboards, computer screens, human faces, vehicles, documents, empty floors, non-agricultural objects, other vegetables (potatoes, tomatoes, etc.).
- If NOT an onion image → set "isOnion": false, provide a clear explanation in "rejectionReason", and return empty detectedBulbs array.

STEP 2 — PRECISE OBJECT DETECTION & LOCALIZATION:
Detect EVERY individual onion bulb clearly visible in the image.
For EACH bulb, provide its bounding box as normalized coordinates from 0 to 1000:
[ymin, xmin, ymax, xmax] where:
  - ymin: top edge (0 to 1000)
  - xmin: left edge (0 to 1000)
  - ymax: bottom edge (0 to 1000)
  - xmax: right edge (0 to 1000)
The bounding box should tightly bound the onion bulb body (and dry neck/roots).

STEP 3 — INDIVIDUAL BULB GRADING (ICAR-DOGR 3-tier classification):
- "Grade A": Equatorial diameter >45mm, intact dry tunic skin, zero visible green apical sprouting, <5% surface rot/mold. Export calibre.
- "URS" (Under-sized/Regular Standard): Diameter 35–45mm, minor papery skin peeling or slight discoloration acceptable, zero active soft rot, no active sprout >10mm. Domestic standard.
- "Reject": Active green apical sprout >10mm, Aspergillus niger black mold, watery soft rot, severe mechanical crushing, or pinhead size <35mm.

For each bulb, output:
- "bounding_box": [ymin, xmin, ymax, xmax]
- "grade": "Grade A" | "URS" | "Reject"
- "diameterMm": estimated diameter in mm (e.g. 52.0)
- "defect": specific issue (e.g. "Apical green sprout 18mm", "Black mold patch 12%", "Dry scale peeling", "Under-sized 32mm") or "None"

STEP 4 — LOT STATISTICS & AGGREGATES:
- "lotGrade": Dominant grade of the batch ("Grade A" | "URS" | "Reject")
- "stats": {
    "gradeAPct": percentage (0-100),
    "ursPct": percentage (0-100),
    "rejectPct": percentage (0-100)
  } (sum must equal 100)
- "averageDiameterMm": average diameter across detected bulbs
- "skinQualityScore": score from 0 to 100 representing tunic intactness and gloss

STEP 5 — AGRONOMIC REPORT (in ${langInstruction}):
- "pathologyNotes": Detailed diagnosis covering dormancy status, fungal risk (Aspergillus niger, Botrytis), moisture level, and skin integrity.
- "farmerAdvice": Practical advice on curing, ventilation, cold storage, immediate APMC mandi dispatch, or segregation of damaged produce.

OUTPUT FORMAT:
Return ONLY valid raw JSON conforming to the schema below. No markdown backticks, no text before or after.

JSON SCHEMA:
{
  "isOnion": boolean,
  "detectedClass": string,
  "confidence": number,
  "rejectionReason": string,
  "lotGrade": "Grade A" | "URS" | "Reject",
  "stats": {
    "gradeAPct": number,
    "ursPct": number,
    "rejectPct": number
  },
  "detectedBulbs": [
    {
      "bounding_box": [number, number, number, number],
      "grade": "Grade A" | "URS" | "Reject",
      "diameterMm": number,
      "defect": string
    }
  ],
  "averageDiameterMm": number,
  "skinQualityScore": number,
  "pathologyNotes": string,
  "farmerAdvice": string
}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: systemInstruction },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.85,
      responseMimeType: "application/json"
    }
  };

  // Modern verified Gemini models available on current Google AI Studio API
  const models = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash"
  ];

  let lastError = null;
  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        console.warn(`[OnionGrade] Request to ${model} timed out after 12s, trying next model.`);
        lastError = new Error(`Gemini Vision request timed out (${model}).`);
        continue;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[OnionGrade] Gemini ${model} HTTP ${response.status}:`, errorText.slice(0, 160));
      lastError = new Error(`Gemini API error: ${response.status}`);
      continue;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      lastError = new Error(`No response payload from ${model}.`);
      continue;
    }

    // Clean any accidental markdown wrap
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.isOnion !== "boolean") {
        throw new Error("Missing isOnion boolean field");
      }
      // Normalize detectedBulbs / bulbs
      if (!Array.isArray(parsed.detectedBulbs) && Array.isArray(parsed.bulbs)) {
        parsed.detectedBulbs = parsed.bulbs;
      }
      if (!Array.isArray(parsed.detectedBulbs)) {
        parsed.detectedBulbs = [];
      }

      console.info(
        `[OnionGrade] Gemini Vision (${model}) successful:`,
        `isOnion=${parsed.isOnion}, lotGrade=${parsed.lotGrade}, bulbsCount=${parsed.detectedBulbs.length}`
      );
      return parsed;
    } catch (parseErr) {
      console.warn(`[OnionGrade] JSON parse failed for ${model}:`, parseErr.message, "Raw:", cleaned.slice(0, 200));
      lastError = new Error(`JSON parse error from ${model}: ${parseErr.message}`);
      continue;
    }
  }

  throw lastError || new Error("All Gemini Vision models failed.");
}