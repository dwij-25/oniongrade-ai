import collections 
import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

prs = Presentation()

# Slide 1: Title Page
slide_layout = prs.slide_layouts[0] 
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
subtitle = slide.placeholders[1]

title.text = "SMART INDIA HACKATHON 2025"
subtitle.text = (
    "TITLE PAGE\n\n"
    "• Problem Statement ID: [Enter your PS ID, e.g., 1643]\n"
    "• Problem Statement Title: Autonomous Onion Quality Grading for Mandi Transparency\n"
    "• Theme: Agriculture, FoodTech & Rural Development\n"
    "• PS Category: Software\n"
    "• Team ID: [Enter your Team ID]\n"
    "• Team Name: [Enter your Team Name]"
)

# Slide 2: Idea / Approach
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
title.text = "OnionGrade AI: Digital Mandi Grading System"

content = slide.placeholders[1]
tf = content.text_frame
tf.text = "How it addresses the Problem"
p = tf.add_paragraph()
p.text = "Provides a rapid, objective, and transparent optical grading platform for onions at APMC mandis. It eliminates manual assessment, ensures fair MSP payouts based on DoCA standards, and prevents spoilage by detecting early rot."
p.level = 1

p2 = tf.add_paragraph()
p2.text = "Innovation & Uniqueness"
p2.level = 0
p3 = tf.add_paragraph()
p3.text = "Dual-engine architecture: a lightweight Edge CV model for instant contour sizing without cloud latency, and Gemini Multimodal Vision AI for deep pathology and rot detection. Integrates a role-based privacy model to protect farmer data."
p3.level = 1

p4 = tf.add_paragraph()
p4.text = "Prototype Overview"
p4.level = 0
p5 = tf.add_paragraph()
p5.text = "A responsive web and mobile application with dedicated workspaces for Farmers, Traders, Procurement Officers, and DoCA officials. Features 120ms edge inference, Hindi/English support, and automated e-weighbridge receipts."
p5.level = 1


# Slide 3: Technical Approach
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
title.text = "TECHNICAL APPROACH"

content = slide.placeholders[1]
tf = content.text_frame
tf.text = "User Flow & Dashboards"
p = tf.add_paragraph()
p.text = "Farmer/Retailer: Login with OTP -> View own lots / browse anonymized market data."
p.level = 1
p = tf.add_paragraph()
p.text = "APMC Officer/DoCA: Login with ID -> Process queue, macro analytics, dispute resolution."
p.level = 1

p = tf.add_paragraph()
p.text = "Tech Stack"
p.level = 0
p = tf.add_paragraph()
p.text = "Frontend: React.js, Tailwind CSS"
p.level = 1
p = tf.add_paragraph()
p.text = "AI/Vision: TensorFlow.js (Edge Sizing), Google Gemini 3.6 Multimodal Vision (Cloud Pathology)"
p.level = 1
p = tf.add_paragraph()
p.text = "Backend/Database: Node.js, Express, PostgreSQL/MongoDB"
p.level = 1
p = tf.add_paragraph()
p.text = "Deployment & Security: Vercel/AWS, End-to-end encryption, Role-Based Access Control (RBAC)"
p.level = 1

# Slide 4: Feasibility and Viability
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
title.text = "FEASIBILITY AND VIABILITY"

content = slide.placeholders[1]
tf = content.text_frame
tf.text = "Market and Economic Viability"
p = tf.add_paragraph()
p.text = "High demand for fair agricultural pricing. Open-source edge AI and cloud-light architecture keeps infrastructure costs low."
p.level = 1

p = tf.add_paragraph()
p.text = "Technical Feasibility"
p.level = 0
p = tf.add_paragraph()
p.text = "Core technologies are robust. Hybrid edge-cloud approach ensures it works even in low-bandwidth rural mandis by doing basic sizing locally."
p.level = 1

p = tf.add_paragraph()
p.text = "Operational Feasibility"
p.level = 0
p = tf.add_paragraph()
p.text = "Role-specific minimal UIs (e.g., 'One big button' for farmers) ensure high adoption. Multi-lingual support breaks down language barriers."
p.level = 1

p = tf.add_paragraph()
p.text = "Positive Impact & Risk Mitigation"
p.level = 0
p = tf.add_paragraph()
p.text = "Ensures fair compensation and reduces the ₹480 Cr annual buffer spoilage. Risks (AI errors) mitigated via manual calibration overrides."
p.level = 1


# Slide 5: Impact and Benefits
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
title.text = "IMPACT AND BENEFITS"

content = slide.placeholders[1]
tf = content.text_frame
tf.text = "Fair Pricing (MSP): Objective grading removes intermediary exploitation."
p = tf.add_paragraph()
p.text = "Spoilage Reduction: Early detection of black mold prevents stock contamination."
p = tf.add_paragraph()
p.text = "Traceability: Immutable digital e-lots replace paper slips, ensuring full audit trails."
p = tf.add_paragraph()
p.text = "Data Privacy: Role-based access ensures farmers' personal data isn't leaked to traders."
p = tf.add_paragraph()
p.text = "Multilinguality: Hindi support ensures accessibility for local farmers."
p = tf.add_paragraph()
p.text = "Zero Latency Edge AI: 120ms inference time keeps mandi queues moving fast."
p = tf.add_paragraph()
p.text = "Macro Analytics: DoCA gets real-time dashboards on national quality trends."
p = tf.add_paragraph()
p.text = "Dispute Resolution: Built-in mechanism to challenge grades with visual evidence."


# Slide 6: Research and References
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
title.text = "RESEARCH AND REFERENCES"

content = slide.placeholders[1]
tf = content.text_frame
tf.text = "Department of Consumer Affairs (DoCA) - Onion Quality Standards (2024)"
p = tf.add_paragraph()
p.text = "Google Gemini Multimodal AI Documentation - Vision API (2024)"
p = tf.add_paragraph()
p.text = "React & Tailwind CSS - Frontend Architecture Patterns"
p = tf.add_paragraph()
p.text = "Computer Vision in Agriculture: Grading and Sorting - Academic Review"

prs.save("SIH2025_OnionGrade_Presentation.pptx")
print("Presentation saved as SIH2025_OnionGrade_Presentation.pptx")
