// SVG representations of skin spots representing different views of the same skin observation
export const spots = {
  // Case 1: Low Risk (Stable Freckle Case)
  lowClose: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><circle cx="100" cy="100" r="22" fill="%238C6239"/><circle cx="98" cy="98" r="14" fill="%23704E2E"/></svg>`,
  lowWide: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23EADECF" rx="16"/><circle cx="100" cy="100" r="8" fill="%238C6239"/><circle cx="99" cy="99" r="5" fill="%23704E2E"/><path d="M40,30 Q80,10 120,40" stroke="%23FFF" stroke-width="1.5" opacity="0.3" fill="none"/></svg>`,
  lowSide: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><ellipse cx="100" cy="100" rx="22" ry="12" fill="%238C6239" transform="rotate(-15, 100, 100)"/><ellipse cx="98" cy="98" rx="14" ry="7" fill="%23704E2E" transform="rotate(-15, 98, 98)"/></svg>`,

  // Case 2: Moderate Risk (Evolving Forearm Mole Case with duplicates)
  modClose: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><path d="M75,90 C85,73 125,75 130,95 C135,115 110,133 90,128 C70,123 65,105 75,90 Z" fill="%23704E2E"/><path d="M85,85 C95,78 115,80 120,92 C125,104 105,118 95,115 C85,112 80,95 85,85 Z" fill="%234A3119"/><circle cx="115" cy="105" r="3" fill="%23A67C52"/></svg>`,
  modWide: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23E3D5C3" rx="16"/><path d="M75,90 C80,80 100,80 105,95 C110,105 95,115 85,110 Z" fill="%23704E2E"/><path d="M20,100 Q100,120 180,90" stroke="%23A67C52" stroke-width="1.5" opacity="0.3" fill="none"/></svg>`,
  modPrev: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><circle cx="100" cy="100" r="14" fill="%23A67C52"/><circle cx="100" cy="100" r="8" fill="%23704E2E"/></svg>`,
  modAngle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><path d="M80,92 C88,81 118,82 123,94 C128,108 112,122 95,120 C81,117 78,103 82,93 Z" fill="%238C6239" transform="rotate(30 100 100)"/></svg>`,

  // Case 3: Uncertain / Inconsistent (Different Spots Case)
  uncSpot1: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><path d="M58,78 C80,48 142,58 152,88 C162,118 132,148 92,138 C62,128 38,108 58,78 Z" fill="%234D1F1C"/><path d="M120,80 C130,85 135,95 125,100 C115,105 105,95 110,85 Z" fill="%23B83B30"/></svg>`,
  uncSpot2: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23DBC9B5" rx="16"/><circle cx="100" cy="100" r="25" fill="%23704E2E" opacity="0.6"/><circle cx="100" cy="100" r="25" fill="%23FFF" opacity="0.1" filter="blur(4px)"/></svg>`,
  uncSpot3: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><circle cx="80" cy="80" r="10" fill="%238C6239"/><circle cx="120" cy="120" r="8" fill="%238C6239"/></svg>`,
  uncSpot4: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><path d="M90,70 Q130,100 90,130 Q50,100 90,70" fill="%23704E2E"/></svg>`,
  uncSpot5: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16" opacity="0.8"/><circle cx="100" cy="100" r="30" fill="%238C6239" opacity="0.2" filter="blur(12px)"/></svg>`,
  highClose: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><path d="M60,60 C80,40 150,45 160,80 C170,115 130,155 85,145 C45,135 40,80 60,60 Z" fill="%233A1F1B"/><path d="M90,70 C105,55 135,60 140,85 C145,110 120,135 90,130 C65,125 75,85 90,70 Z" fill="%231E0F0D"/><circle cx="125" cy="115" r="4" fill="%23B83B30"/><circle cx="105" cy="95" r="5" fill="%238C6239"/></svg>`,
  highWide: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23EADECF" rx="16"/><path d="M90,90 C100,80 120,82 125,95 C130,110 115,125 100,120 Z" fill="%233A1F1B"/></svg>`,
  highSide: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><path d="M60,60 C80,40 150,45 160,80 C170,115 130,155 85,145 C45,135 40,80 60,60 Z" fill="%233A1F1B" transform="rotate(25, 100, 100)"/></svg>`,
  highPrev: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F4EDE3" rx="16"/><circle cx="100" cy="100" r="18" fill="%23704E2E"/></svg>`
};

// 26. MULTI-IMAGE DEMO SCENARIOS
export const demoCases = [
  {
    id: "case-01",
    name: "DEMO 01 — 3 Consistent Images (Low Indication)",
    badge: "Low Risk Indication",
    color: "forest",
    riskLevel: "LOW RISK INDICATION",
    riskDescription: "Visual characteristics suggest a stable, benign lesion layout. Multi-image views demonstrate uniform symmetry and borders across angles.",
    confidence: "94%",
    location: "Right Upper Shoulder",
    firstObserved: "December 12, 2025",
    lastObserved: "August 08, 2026",
    observationsCount: 2,
    daysTracked: 240,
    images: [
      { 
        id: "img-1", num: 1, type: "Close-up", date: "Aug 08, 2026", src: spots.lowClose, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-2", num: 2, type: "Wider surrounding view", date: "Aug 08, 2026", src: spots.lowWide, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-3", num: 3, type: "Different angle", date: "Aug 08, 2026", src: spots.lowSide, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      }
    ],
    features: [
      { id: "img-1", shape: "Symmetric", border: "Smooth border margins", color: "Tan Brown", texture: "Smooth" },
      { id: "img-2", shape: "Symmetric (scaled)", border: "Smooth border margins", color: "Tan Brown", texture: "Smooth" },
      { id: "img-3", shape: "Elliptical (side angle)", border: "Smooth border margins", color: "Tan Brown", texture: "Smooth" }
    ],
    consistency: {
      status: "HIGH",
      summary: "3 of 3 usable images produced similar classification patterns.",
      shape: "✓ Consistent",
      border: "✓ Consistent",
      color: "✓ Consistent",
      texture: "✓ Consistent",
      hasWarnings: false,
      summaryMessage: "All visual parameters are consistent across the uploaded views."
    },
    xaiHighlights: {
      shape: "High geometric circularity. Low indicator for concern.",
      border: "Even boundaries with clear edge definitions.",
      color: "Homogeneous light brown pigment pattern.",
      texture: "Consistent smooth surface layout."
    },
    explanation: "Multi-image screening confirms consistent symmetrical margins, uniform coloration, and smooth borders from all three perspectives. The features correspond to stable benign moles.",
    nextStep: "Continue tracking this spot every 3 months. Maintain standard sun protection. Consult a dermatologist if you notice any new changes in shape, color, or height.",
    timeline: [
      { date: "Dec 12, 2025", note: "First registered observation during routine self-check.", image: spots.lowClose, location: "Right Shoulder", risk: "Low Risk Indication", count: 3 },
      { date: "Aug 08, 2026", note: "Latest observation. Unchanged visual appearance.", image: spots.lowClose, location: "Right Shoulder", risk: "Low Risk Indication", count: 3 }
    ],
    visualFeatures: {
      asymmetry: "Symmetric layout observed across all angles.",
      border: "Even margins with clear edge definitions.",
      color: "Homogeneous light brown pigment pattern.",
      size: "4.0mm apparent diameter."
    },
    compare: {
      changeLevel: "LOW",
      explanation: "No discernible change in shape, borders, or color. Apparent diameter remains stable at 4mm.",
      diffDetails: {
        color: "No change",
        shape: "Stable",
        border: "Consistent margins",
        size: "4.0mm (Unchanged)"
      }
    }
  },
  {
    id: "case-02",
    name: "DEMO 02 — 4 Images with Duplicates (Moderate Indication)",
    badge: "Moderate Risk Indication",
    color: "coral",
    riskLevel: "MODERATE RISK INDICATION",
    riskDescription: "Visual characteristics show mild asymmetry and border variation across angles. A dermatologist check-up is recommended.",
    confidence: "82%",
    location: "Left Forearm",
    firstObserved: "June 04, 2026",
    lastObserved: "August 08, 2026",
    observationsCount: 3,
    daysTracked: 65,
    images: [
      { 
        id: "img-1", num: 1, type: "Close-up", date: "Aug 08, 2026", src: spots.modClose, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-2", num: 2, type: "Wider surrounding view", date: "Aug 08, 2026", src: spots.modWide, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "⚠ Low lighting", contrast: "✓ Good", visibility: "✓ Good", duplicate: "⚠ Duplicate", angle: "✓ Normal", obstruction: "✓ None" } // Duplicate & Low lighting
      },
      { 
        id: "img-3", num: 3, type: "Wider surrounding view", date: "Aug 08, 2026", src: spots.modWide, // Duplicate of img-2
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "⚠ Duplicate", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-4", num: 4, type: "Different angle", date: "Aug 08, 2026", src: spots.modAngle, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      }
    ],
    features: [
      { id: "img-1", shape: "Mild Asymmetry", border: "Scalloped borders", color: "Two shades of brown", texture: "Slight elevation" },
      { id: "img-2", shape: "Unclear structure", border: "Fuzzy margins", color: "Dark Brown", texture: "Unclear" },
      { id: "img-3", shape: "Unclear structure", border: "Fuzzy margins", color: "Dark Brown", texture: "Unclear" },
      { id: "img-4", shape: "Asymmetric Oval", border: "Scalloped borders", color: "Two shades of brown", texture: "Elevated" }
    ],
    consistency: {
      status: "HIGH",
      summary: "3 of 4 usable images produced similar classification patterns.",
      shape: "✓ Consistent",
      border: "✓ Consistent (Scalloped edges flagged)",
      color: "✓ Consistent (Pigment cluster flagged)",
      texture: "✓ Consistent",
      hasWarnings: true,
      summaryMessage: "Some visual differences were observed across the uploaded views. Note that lighting discrepancies in Image 2 affect color readings."
    },
    xaiHighlights: {
      shape: "Model highlighted mild elongation on the upper quadrant.",
      border: "Attention weights focused on the fuzzy, ill-defined top edge.",
      color: "Pigment clustering flagged in the center vs lighter periphery.",
      texture: "Slightly elevated topography highlighted."
    },
    explanation: "The algorithm flagged asymmetric tissue expansion and scalloped border structures. The differences between previous logs and current images confirm active visual evolution.",
    nextStep: "Consult a qualified dermatologist for a professional evaluation. Bring the generated Doctor Summary report to your appointment to discuss these tracked changes.",
    timeline: [
      { date: "Jun 04, 2026", note: "Initial spot detected. Small symmetric dot.", image: spots.modPrev, location: "Left Forearm", risk: "Low Risk Indication", count: 4 },
      { date: "Aug 08, 2026", note: "Latest scan. Mild border irregularity and color changes visible.", image: spots.modClose, location: "Left Forearm", risk: "Moderate Risk Indication", count: 4 }
    ],
    visualFeatures: {
      asymmetry: "Mild asymmetry in tissue expansion flagged.",
      border: "Scalloped boundaries observed on upper quadrant.",
      color: "Dual-tone brown pigment core variation.",
      size: "5.5mm apparent diameter."
    },
    compare: {
      changeLevel: "MODERATE",
      explanation: "Active evolution detected between June and August. Spot has developed asymmetric borders and a darker central pigment core.",
      diffDetails: {
        color: "Transitioned from tan to dual-tone brown",
        shape: "From circular to slightly elongated (asymmetric)",
        border: "Margins became less defined / slightly scalloped",
        size: "Grew from 4.2mm to 5.5mm"
      }
    }
  },
  {
    id: "case-03",
    name: "DEMO 03 — 5 Inconsistent Images (Uncertain Result)",
    badge: "Uncertain Result",
    color: "coral",
    riskLevel: "UNCERTAIN SCREENING RESULT",
    riskDescription: "The uploaded images do not provide a sufficiently consistent AI signal. Safe classification is unavailable.",
    confidence: "N/A",
    location: "Lower Mid-Back",
    firstObserved: "April 10, 2026",
    lastObserved: "August 08, 2026",
    observationsCount: 1,
    daysTracked: 120,
    images: [
      { 
        id: "img-1", num: 1, type: "Close-up", date: "Aug 08, 2026", src: spots.uncSpot1, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-2", num: 2, type: "Wider surrounding view", date: "Aug 08, 2026", src: spots.uncSpot2, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "⚠ Low lighting", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } // Low lighting
      },
      { 
        id: "img-3", num: 3, type: "Different angle", date: "Aug 08, 2026", src: spots.uncSpot3, // Different skin area
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "⚠ Extreme angle", obstruction: "✓ None" } 
      },
      { 
        id: "img-4", num: 4, type: "Custom", date: "Aug 08, 2026", src: spots.uncSpot4, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-5", num: 5, type: "Wider surrounding view", date: "Aug 08, 2026", src: spots.uncSpot5, // Blurry
        qCheck: { resolution: "3000x2000", blur: "✕ Blurry", brightness: "✓ Good", contrast: "✓ Good", visibility: "✕ Poor", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      }
    ],
    features: [
      { id: "img-1", shape: "Irregular Red/Black", border: "Notched borders", color: "Multi-colored", texture: "Rough" },
      { id: "img-2", shape: "Circular Tan", border: "Smooth borders", color: "Tan Brown", texture: "Unclear" },
      { id: "img-3", shape: "Multiple separate spots", border: "Clear borders", color: "Light Brown", texture: "Even" },
      { id: "img-4", shape: "Oval patch", border: "Smooth borders", color: "Tan", texture: "Even" },
      { id: "img-5", shape: "Blurry Circle", border: "Undefined borders", color: "Tan Blur", texture: "Undefined" }
    ],
    consistency: {
      status: "LOW",
      summary: "The uploaded images produced substantially different results.",
      shape: "✕ Inconsistent (Distinct spot geometries identified)",
      border: "✕ Inconsistent (Jagged vs. Smooth vs. Undefined)",
      color: "✕ Inconsistent (Red/Black vs. Tan vs. Low Light)",
      texture: "✕ Inconsistent",
      hasWarnings: true,
      summaryMessage: "The uploaded images do not provide enough consistent visual information for a reliable AI screening indication."
    },
    xaiHighlights: {
      shape: "Attention map deactivated due to high structural discrepancy.",
      border: "No consistent borders identified across views.",
      color: "Color variance values map outside normal tolerances.",
      texture: "Texture evaluations incomplete due to blurry input."
    },
    explanation: "No model prediction is generated. Visual characteristics differ too significantly across uploaded views. This can happen if photos capture different moles or if blur/lighting changes confuse the algorithm.",
    nextStep: "We recommend retaking the images. Capture the same skin spot from a similar distance under identical lighting conditions. If you are concerned about any spot, schedule an appointment with a dermatologist.",
    timeline: [
      { date: "Aug 08, 2026", note: "Failed screening attempt. Highly inconsistent multi-views.", image: spots.uncSpot1, location: "Lower Mid-Back", risk: "Uncertain Visual Result", count: 5 }
    ],
    visualFeatures: {
      asymmetry: "Highly inconsistent asymmetry profiles across views.",
      border: "Varying edge definitions (smooth vs. jagged).",
      color: "Mixed pigment types and lighting constraints.",
      size: "Multiple spots of varying dimensions."
    },
    compare: {
      changeLevel: "UNCERTAIN",
      explanation: "Images are too inconsistent to perform mathematical visual change comparison.",
      diffDetails: {
        color: "Cannot align",
        shape: "Cannot align",
        border: "Cannot align",
        size: "N/A"
      }
    }
  },
  {
    id: "case-04",
    name: "DEMO 04 — 4 Images (High Indication)",
    badge: "High Risk Indication",
    color: "coral",
    riskLevel: "HIGH RISK INDICATION",
    riskDescription: "The uploaded images contain visual patterns that produced a strong AI screening signal. This result does NOT confirm cancer.",
    confidence: "89%",
    location: "Upper Right Back",
    firstObserved: "January 15, 2026",
    lastObserved: "August 08, 2026",
    observationsCount: 4,
    daysTracked: 205,
    images: [
      { 
        id: "img-high-1", num: 1, type: "Close-up", date: "Aug 08, 2026", src: spots.highClose, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-high-2", num: 2, type: "Wider surrounding view", date: "Aug 08, 2026", src: spots.highWide, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-high-3", num: 3, type: "Different angle", date: "Aug 08, 2026", src: spots.highSide, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      },
      { 
        id: "img-high-4", num: 4, type: "Previous observation", date: "Jan 15, 2026", src: spots.highPrev, 
        qCheck: { resolution: "3000x2000", blur: "✓ Good", brightness: "✓ Good", contrast: "✓ Good", visibility: "✓ Good", duplicate: "✓ Unique", angle: "✓ Normal", obstruction: "✓ None" } 
      }
    ],
    features: [
      { id: "img-high-1", shape: "Severe Asymmetry", border: "Irregular Jagged margins", color: "Multi-colored (Dark brown, Black, Red)", texture: "Rough and scaly" },
      { id: "img-high-2", shape: "Asymmetric patch", border: "Fuzzy margins", color: "Dark brown", texture: "Unclear" },
      { id: "img-high-3", shape: "Asymmetric Oval", border: "Jagged margins", color: "Multi-colored", texture: "Rough" },
      { id: "img-high-4", shape: "Circular uniform spot", border: "Smooth borders", color: "Tan Brown", texture: "Smooth" }
    ],
    consistency: {
      status: "HIGH",
      summary: "4 of 4 usable images produced similar classification patterns.",
      shape: "✓ Consistent (Asymmetry flagged across all angles)",
      border: "✓ Consistent (Irregular borders flagged)",
      color: "✓ Consistent (Multi-colored pigment core flagged)",
      texture: "✓ Consistent",
      hasWarnings: false,
      summaryMessage: "Highly consistent visual characteristics observed across all uploaded views. All models return matching visual indications."
    },
    xaiHighlights: {
      shape: "Severe geographic elongation. Strong indication for atypical growth.",
      border: "Attentive weights focused heavily on jagged border notches.",
      color: "Significant multi-colored pigment clusters detected (Black/Red).",
      texture: "Topographical scaliness flagged in central core."
    },
    explanation: "Multi-image screening shows severe asymmetry, jagged notched margins, and multi-colored pigment patterns. These features correspond to atypical growth clusters that should be reviewed promptly.",
    nextStep: "Arrange professional medical evaluation promptly. Do not wait for the AI to confirm the result or attempt to treat the finding at home.",
    timeline: [
      { date: "Jan 15, 2026", note: "Routine log. Small tan spot with smooth margins.", image: spots.highPrev, location: "Upper Back", risk: "Low Risk Indication", count: 4 },
      { date: "Aug 08, 2026", note: "Latest scan. Significant enlargement, color darkening, and jagged borders.", image: spots.highClose, location: "Upper Back", risk: "High Risk Indication", count: 4 }
    ],
    visualFeatures: {
      asymmetry: "Severe asymmetry observed consistently across multiple views.",
      border: "Irregular, notched, and jagged margins flagged.",
      color: "Multi-colored pigment distribution (Black, Dark Brown, Red).",
      size: "6.2mm apparent diameter (Grew from 4.0mm)."
    },
    compare: {
      changeLevel: "HIGH",
      explanation: "Active, significant evolution detected between January and August. The spot has darkened and developed irregular margins.",
      diffDetails: {
        color: "Darkened significantly from tan to multi-colored black/red",
        shape: "Transitioned from circular to highly asymmetric",
        border: "Margins changed from smooth to notched/jagged",
        size: "Grew from 4.0mm to 6.2mm"
      }
    }
  }
];

// 13. RAG KNOWLEDGE BASE & SUGGESTED QUESTIONS
export const ragQA = [
  {
    question: "What does moderate risk mean?",
    answer: "A 'Moderate Risk Indication' means that the AI model detected certain atypical visual characteristics (such as border variations, color variance, or asymmetry) in the skin spot. This is not a diagnosis of skin cancer, but rather a notification that the spot has features which warrant a professional evaluation by a qualified dermatologist.",
    sources: [
      { title: "American Academy of Dermatology (AAD) guidelines on Melanoma detection", author: "AAD", year: "2024" },
      { title: "Explainable AI in Clinical Skin Screening", author: "Journal of Medical Computer Vision", year: "2023" }
    ]
  },
  {
    question: "What is melanoma?",
    answer: "Melanoma is a serious form of skin cancer that begins in the melanocytes, the cells that produce skin pigment. While less common than basal cell carcinoma (BCC) and squamous cell carcinoma (SCC), it is more dangerous because of its potential to spread (metastasize) to other parts of the body if not identified early.",
    sources: [
      { title: "National Cancer Institute (NCI) Melanoma Guide", author: "NCI", year: "2025" },
      { title: "Dermatopathology & Oncology Review", author: "Harvard Health Publishing", year: "2024" }
    ]
  },
  {
    question: "What is the difference between melanoma and BCC?",
    answer: "Melanoma develops from pigment-producing melanocytes, often appearing as dark, asymmetrical moles with irregular borders, and can spread rapidly. Basal Cell Carcinoma (BCC) begins in the basal cells of the epidermis, usually grows very slowly, rarely spreads, and typically appears as pearly, shiny bumps or pink sores that bleed and do not heal.",
    sources: [
      { title: "Skin Cancer Foundation: Melanoma vs. Non-Melanoma", author: "Skin Cancer Foundation", year: "2024" },
      { title: "Clinical Dermatology Manual", author: "Fitzpatrick et al.", year: "2023" }
    ]
  },
  {
    question: "What is asymmetry?",
    answer: "Asymmetry in dermatology means that if you draw a line through the middle of a skin lesion, the two halves do not match in shape, size, or pattern. Symmetrical moles are generally benign, whereas asymmetry is a key indicator (the 'A' in the ABCDE guidelines) that a spot should be monitored closely or evaluated by a doctor.",
    sources: [
      { title: "Dermatology Screening Toolkit", author: "World Health Organization", year: "2024" }
    ]
  },
  {
    question: "Why should I track changes?",
    answer: "Tracking skin spots over time is crucial because change (evolution) is the most significant indicator of potential skin issues. A single photo only captures a spot's status today. A visual timeline ('Skin Story') allows you to compare previous and current observations, helping you and your doctor identify changes in shape, size, border, or color that might otherwise go unnoticed.",
    sources: [
      { title: "The Value of Patient-Led Surveillance in Skin Health", author: "British Journal of Dermatology", year: "2023" }
    ]
  },
  {
    question: "When should I see a dermatologist?",
    answer: "You should consult a qualified dermatologist if: \n1. You receive a Moderate or High Risk Indication on DermaLens AI.\n2. You notice any spot that is changing in size, shape, or color (Evolution).\n3. A spot exhibits any of the ABCDE warning signs (Asymmetry, Border irregularity, Color variation, Diameter > 6mm).\n4. You have a spot that constantly bleeds, crusts, or fails to heal.\n5. You have a new spot that looks completely different from all other moles on your body (the 'ugly duckling' sign).",
    sources: [
      { title: "Clinical Referral Guidelines for Melanoma", author: "American Cancer Society", year: "2025" }
    ]
  },
  {
    question: "How do I take a clearer skin photo?",
    answer: "To capture a high-quality skin photo: \n1. Find bright, indirect natural light (avoid harsh direct sunlight or dark rooms).\n2. Hold your camera steady and place it 6-8 inches away from the spot.\n3. Make sure the camera is focused directly on the lesion (tap the screen to focus).\n4. Keep the skin flat and relaxed. \n5. Avoid blurry frames by holding still. DermaLens AI checks lighting, sharpness, and framing to help you verify these factors before scanning.",
    sources: [
      { title: "Teledermatology Imaging Standards", author: "International Society of Teledermatology", year: "2023" }
    ]
  }
];

// 18. TECHNOLOGY DEFINITIONS & ARCHITECTURE
export const techArchitecture = [
  {
    id: "user",
    title: "User Interface",
    tech: "React.js / Custom HTML5 & CSS3",
    desc: "Provides a responsive layout, a double-image comparison slider, interactive SVG body maps, and animated agent workflows."
  },
  {
    id: "fastapi",
    title: "FastAPI Backend",
    tech: "Python / FastAPI",
    desc: "Coordinates the request pipeline, handles file storage connections, and directs AI orchestration agents."
  },
  {
    id: "opencv",
    title: "Image Preprocessing",
    tech: "OpenCV / NumPy",
    desc: "Performs image resizing, noise reduction, and contrast alignment. Assesses image lighting, sharpness, and framing indicators."
  },
  {
    id: "mobilenet",
    title: "Vision Model / CNN",
    tech: "TensorFlow / MobileNetV2",
    desc: "A lightweight Convolutional Neural Network trained to identify visual pattern categories and extract shape, border, and color features."
  },
  {
    id: "rag",
    title: "RAG & Knowledge Retrieval",
    tech: "LangChain / Vector Database",
    desc: "Extracts clinical excerpts and citations from trusted medical sources based on user queries to prevent fabrication."
  },
  {
    id: "granite",
    title: "IBM Granite LLM",
    tech: "IBM Granite Series",
    desc: "Processes retrieved knowledge and classification data to output structured, user-friendly summaries and responses in clear, non-diagnostic terms."
  },
  {
    id: "agentic",
    title: "Agentic Orchestration",
    tech: "LangGraph / Python",
    desc: "A multi-agent workflow where independent specialist agents (Quality Agent, Vision Agent, RAG Agent, and Report Agent) collaborate to compile the final analysis."
  },
  {
    id: "db",
    title: "Database Layer",
    tech: "Firebase / MongoDB",
    desc: "Maintains encrypted profiles, consent preferences, and chronological skin observations to build the visual 'Skin Story'."
  }
];

// 20. RESPONSIBLE AI PILLARS
export const responsiblePillars = [
  {
    title: "TRANSPARENCY",
    desc: "We clearly explain what visual characteristics the AI detects and map out why it focused on specific shapes, borders, or colors using explainable AI overlays.",
    icon: "Eye"
  },
  {
    title: "SAFETY & NON-DIAGNOSIS",
    desc: "We never provide medical diagnoses or tell users they have cancer. We deliver risk indicators and strongly emphasize that AI is a tool, not a doctor.",
    icon: "ShieldAlert"
  },
  {
    title: "PRIVACY & SECURITY",
    desc: "Your data is yours. Images and skin logs are saved with strict encryption. Users can delete their data or toggle consent settings instantly.",
    icon: "Lock"
  },
  {
    title: "HUMAN OVERSIGHT",
    desc: "We build direct action bridges, prompting clinical visits and creating dermatologist-ready summaries to place human expertise at the center of your health care.",
    icon: "HeartPulse"
  }
];

// 23. SOLUTION IMPACT
export const solutionImpact = {
  before: [
    { title: "I noticed a changing spot.", detail: "Is it a normal freckle or something to monitor?" },
    { title: "Was it always there?", detail: "No visual record exists to remember how it looked months ago." },
    { title: "Has it changed?", detail: "Relying on subjective memory to evaluate changes in size or color." },
    { title: "What does this AI prediction mean?", detail: "Receiving scary, confusing probability scores without explanation." },
    { title: "What should I do now?", detail: "Left in limbo between unwarranted anxiety and neglecting a true risk." }
  ],
  after: [
    { title: "Photo saved.", detail: "A crisp visual record is safely stored with verified quality checks." },
    { title: "Timeline created.", detail: "Separate observations are automatically organized chronologically." },
    { title: "Change compared.", detail: "Draggable sliders visually highlight differences in size, shape, and margins." },
    { title: "AI explained.", detail: "Explainable AI attention highlights display exactly where the vision model focused." },
    { title: "Trusted information retrieved.", detail: "Questions are answered with citations from verified clinical manuals." },
    { title: "Doctor-ready guidance.", detail: "A detailed timeline report is compiled, urging appropriate dermatologist evaluation." }
  ]
};

// 28. FAQ DATA
export const faqs = [
  {
    q: "What is DermaLens AI?",
    a: "DermaLens AI is an AI-assisted skin screening, education, and monitoring platform. It combines visual tracking ('Skin Story') with explainable AI and trusted knowledge search to help users recognize visible skin changes and understand when professional evaluation is appropriate."
  },
  {
    q: "Does DermaLens diagnose skin cancer?",
    a: "No. DermaLens AI does not diagnose skin cancer or any other medical condition. It is a screening and tracking support tool. Only a qualified dermatologist can perform a physical examination, biopsy, and provide a definitive diagnosis."
  },
  {
    q: "What types of skin cancer does the platform discuss?",
    a: "The platform provides educational resources on the three most common skin cancer types: Melanoma, Basal Cell Carcinoma (BCC), and Squamous Cell Carcinoma (SCC). This information is for general awareness and education only."
  },
  {
    q: "How does the AI model (MobileNet) work?",
    a: "MobileNet is a highly optimized Convolutional Neural Network (CNN) designed for efficient image classification. It reviews the uploaded image, compares pattern features against thousands of reference skin structures, and classifies visual patterns based on characteristics like asymmetry, border irregularity, color variation, and size."
  },
  {
    q: "What is Explainable AI in DermaLens?",
    a: "Rather than giving a single prediction, our Explainable AI (XAI) overlays focus maps on the image. It visually highlights which regions (Shape, Border, Color, or Texture) influenced the model's risk indication, helping you see what the AI saw."
  },
  {
    q: "What do RAG and IBM Granite do?",
    a: "Retrieval-Augmented Generation (RAG) queries trusted dermatological databases for verified answers when you ask a question. IBM Granite (our large language model) then translates these clinical findings and the AI vision results into readable, supportive, and non-diagnostic language."
  },
  {
    q: "How is my data handled?",
    a: "Your images and observation logs are stored securely. We prioritize user control; you can export your records, toggle consent settings, or delete your entire scan history at any time. We do not share your health observations with advertisers or third parties."
  },
  {
    q: "How accurate is the AI?",
    a: "AI screening models are highly sensitive, but they can experience errors and false positives or false negatives. DermaLens AI does not claim 100% accuracy. Because low-risk results do not fully rule out disease and high-risk results do not confirm it, you should consult a dermatologist for any concerning changes."
  }
];

export const futureScope = [
  { title: "Smartphone App Integration", desc: "Native iOS/Android apps with automated focal length locks and weekly scanning notifications." },
  { title: "Dermatologist Teleconsultation", desc: "Secure portals to send your tracked timeline directly to licensed dermatologists for quick reviews." },
  { title: "Wearable Spot Pinner", desc: "Integrate with smartwatch alerts to trigger spot check reminders based on sun and UV exposure patterns." },
  { title: "Multi-Language AI Assistant", desc: "Localize LENS to support skin education queries in Spanish, French, Hindi, and Mandarin." },
  { title: "Federated Learning", desc: "Train models privately across hospitals without raw patient images ever leaving local networks." },
  { title: "Clinical Trial Validation", desc: "Register and complete long-term prospective trials to achieve official clinical efficacy benchmarks." }
];

export const voiceTranslations = {
  English: {
    low: "Your skin image screening is complete. You uploaded four images, and three images were suitable for analysis. The AI screening indication is low. This means the AI did not find a strong visual signal for the concerning categories supported by this screening system. This result does not completely rule out a skin condition. Please continue monitoring the area and take another photo if you notice changes. If the area becomes new, changes, bleeds, hurts, or concerns you, please speak with a qualified healthcare professional. This AI result is a screening result, not a medical diagnosis.",
    moderate: "Your skin image screening is complete. The AI found some visual characteristics that need closer attention. Your screening indication is moderate. This does not mean that you have skin cancer. Because the finding may need professional assessment, consider arranging an appointment with a qualified dermatologist, especially if the area is new or changing. You can now view the images, compare them with previous photos, or create a summary to share with a doctor.",
    high: "Your skin image screening is complete. The AI detected visual patterns that produced a high screening indication. This result does not confirm cancer. Because the finding may require medical assessment, please arrange a professional evaluation promptly. Do not rely on home remedies or this AI result instead of professional medical care. You can create a doctor summary from the images and screening information.",
    uncertain: "We could not produce a reliable screening indication from the uploaded images. Some images may have had poor lighting, blur, different angles, or inconsistent visual information. Please try taking clearer images using good lighting and a similar distance. If the skin finding is new, changing, bleeding, painful, or concerning, consider professional medical evaluation."
  },
  Telugu: {
    low: "మీ చర్మ పరీక్ష పూర్తయింది. అప్‌లోడ్ చేసిన చిత్రాలలో ఎఐ ఎటువంటి ప్రమాదకర సంకేతాలను గుర్తించలేదు. ఈ ఫలితం ఎటువంటి చర్మ వ్యాధి లేదని నిర్ధారించదు. దయచేసి ఈ ప్రాంతాన్ని గమనిస్తూ ఉండండి. ఏవైనా మార్పులు ఉంటే వైద్యుడిని సంప్రదించండి. ఈ ఫలితం కేవలం ఒక స్క్రీనింగ్ మాత్రమే, ఇది ఖచ్చితమైన రోగ నిర్ధారణ కాదు.",
    moderate: "మీ చర్మ పరీక్ష పూర్తయింది. ఎఐ కొన్ని ప్రత్యేక లక్షణాలను గుర్తించింది, వీటిని జాగ్రత్తగా పరిశీలించాలి. మీ ఎఐ సంకేతం మోడరేట్ లేదా మధ్యస్థంగా ఉంది. దీని అర్థం మీకు క్యాన్సర్ ఉందని కాదు. ఈ చర్మ భాగాన్ని నిపుణులు పరిశీలించాల్సి ఉంటుంది కాబట్టి, డెర్మటాలజిస్ట్ వైద్యుడిని సంప్రదించాల్సిందిగా సూచిస్తున్నాము.",
    high: "మీ చర్మ పరీక్ష పూర్తయింది. ఎఐ కొన్ని అసాధారణ మార్పులను గుర్తించింది, ఇవి అధిక సంకేతాన్ని సూచిస్తున్నాయి. ఈ ఫలితం క్యాన్సర్‌ను నిర్ధారించదు. కానీ వెంటనే వైద్య పరీక్షలు అవసరమవుతాయి కాబట్టి, ఆలస్యం చేయకుండా నిపుణులైన డెర్మటాలజిస్ట్‌ను సంప్రదించండి. ఇంటి చిట్కాలు వాడకండి.",
    uncertain: "అప్‌లోడ్ చేసిన చిత్రాల నుండి మేము స్పష్టమైన ఫలితాన్ని అందించలేకపోతున్నాము. కొన్ని చిత్రాలలో కాంతి సరిగా లేకపోవడం, మసకగా ఉండటం లేదా వేర్వేరు కోణాల వల్ల ఇలా జరగవచ్చు. దయచేసి స్పష్టమైన చిత్రాలను మళ్లీ అప్‌లోడ్ చేయండి. అవసరమైతే వైద్యుడిని సంప్రదించండి."
  },
  Hindi: {
    low: "आपके त्वचा की जांच पूरी हो गई है। आपके अपलोड किए गए चित्रों में एआई ने कोई खतरनाक संकेत नहीं पाया है। यह एक शुरुआती परिणाम है और यह किसी बीमारी के न होने की गारंटी नहीं देता है। कृपया इस क्षेत्र की निगरानी करते रहें। यदि कोई बदलाव दिखाई दे, तो डॉक्टर से संपर्क करें। यह परिणाम कोई डॉक्टर की जांच या रोग का निदान नहीं है।",
    moderate: "आपके त्वचा की जांच पूरी हो गई है। एआई ने कुछ ऐसे लक्षण पाए हैं जिन्हें करीब से देखने की आवश्यकता है। आपका एआई संकेत मध्यम है। इसका मतलब यह नहीं है कि आपको त्वचा का कैंसर है। चूंकि इस लक्षण को डॉक्टर द्वारा जांचने की आवश्यकता हो सकती है, इसलिए त्वचा विशेषज्ञ से संपर्क करने पर विचार करें।",
    high: "आपके त्वचा की जांच पूरी हो गई है। एआई ने कुछ असामान्य लक्षण पाए हैं जो उच्च जोखिम का संकेत देते हैं। यह परिणाम कैंसर की पुष्टि नहीं करता है। चूंकि इस लक्षण की तुरंत डॉक्टर द्वारा जांच की आवश्यकता है, कृपया जल्द से जल्द त्वचा विशेषज्ञ से संपर्क करें। घर पर इलाज करने की कोशिश न करें।",
    uncertain: "हम अपलोड किए गए चित्रों से स्पष्ट परिणाम नहीं निकाल पाए हैं। कुछ चित्रों में खराब रोशनी, धुंधलापन या अलग कोण हो सकते हैं। कृपया बेहतर रोशनी में और एक ही दूरी से स्पष्ट चित्र लेने का प्रयास करें। यदि आपको चिंता है, तो डॉक्टर से सलाह लें।"
  },
  Kannada: {
    low: "ನಿಮ್ಮ ಚರ್ಮದ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಅಪ್ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರಗಳಲ್ಲಿ ಎಐ ಯಾವುದೇ ತೀವ್ರ ಲಕ್ಷಣಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿಲ್ಲ. ಈ ಫಲಿತಾಂಶವು ಚರ್ಮದ ಕಾಯಿಲೆ ಇಲ್ಲ ಎಂದು ಖಚಿತಪಡಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಗಮನಿಸುತ್ತಿರಿ ಮತ್ತು ಏನಾದರೂ ಬದಲಾವಣೆಗಳಿದ್ದಲ್ಲಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. ಇದು ಕೇವಲ ಪ್ರಾಥಮಿಕ ತಪಾಸಣೆ.",
    moderate: "ನಿಮ್ಮ ಚರ್ಮದ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಎಐ ಕೆಲವು ವಿಶೇಷ ಲಕ್ಷಣಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿದೆ, ಇವುಗಳನ್ನು ಸೂಕ್ಷ್मವಾಗಿ ಗಮನಿಸಬೇಕು. ನಿಮ್ಮ ತಪಾಸಣಾ ಸಂಕೇತವು ಮಧ್ಯಮವಾಗಿದೆ. ಇದರರ್ಥ ನಿಮಗೆ ಕ್ಯಾನ್ಸರ್ ಇದೆ ಎಂದಲ್ಲ. ಚರ್ಮ ರೋಗ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಲಹೆ ನೀಡುತ್ತೇವೆ.",
    high: "ನಿಮ್ಮ ಚರ್ಮದ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಎಐ ಗಂಭೀರವಾದ ಅಸಹಜ ಲಕ್ಷಣಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿದೆ. ಈ ಫಲಿತಾಂಶವು ಕ್ಯಾನ್ಸರ್ ಅನ್ನು ಖಚಿತಪಡಿಸುವುದಿಲ್ಲ. ಆದರೂ ತಕ್ಷಣವೇ ಚರ್ಮ ರೋಗ ತಜ್ಞರಿಂದ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ. ಮನೆಮದ್ದು ಬಳಸಬೇಡಿ.",
    uncertain: "ಅಪ್ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರಗಳಲ್ಲಿ ಸ್ಪಷ್ಟತೆ ಇಲ್ಲದ ಕಾರಣ ನಿಖರವಾದ ಫಲಿತಾಂಶ ನೀಡಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ. ಮಂಜು ಮುಸುಕಿದ ಚಿತ್ರಗಳು ಅಥವಾ ಬೆಳಕಿನ ಕೊರತೆ ಕಾರಣವಿರಬಹುದು. ದಯವಿಟ್ಟು ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಸ್ಪಷ್ಟ ಚಿತ್ರಗಳನ್ನು ಮತ್ತೆ ತೆಗೆದುಕೊಳ್ಳಿ."
  },
  Tamil: {
    low: "உங்கள் தோல் பரிசோதனை முடிந்தது. பதிவேற்றப்பட்ட படங்களில் ஆபத்தான அறிகுறிகளை ஏஐ கண்டறியவில்லை. இந்த முடிவு உங்களுக்கு நோய் இல்லை என்று அர்த்தமல்ல. தயவுசெய்து இந்த பகுதியை தொடர்ந்து கண்காணியுங்கள். ஏதேனும் மாற்றங்கள் இருந்தால் உடனடியாக மருத்துவரை அணுகவும். இது ஒரு ஆரம்பகட்ட பரிசோதனை மட்டுமே.",
    moderate: "உங்கள் தோல் பரிசோதனை முடிந்தது. ஏஐ சில குறிப்பிட்ட தன்மைகளை கண்டறிந்துள்ளது, இவற்றை மேலும் ஆராய வேண்டும். உங்களது பரிசோதனை முடிவு நடுத்தரமானது (Moderate). இதற்கு உங்களுக்கு புற்றுநோய் இருக்கிறது என்று அர்த்தமல்ல. உடனடியாக தோல் மருத்துவரை அணுகி ஆலோசனை பெறுவது நல்லது.",
    high: "உங்கள் தோல் பரிசோதனை முடிந்தது. ஏஐ சில கடுமையான அசாதாரண மாற்றங்களை கண்டறிந்துள்ளது, இவை அதிக அபாயத்தை (High) காட்டுகின்றன. இந்த முடிவு புற்றுநோயை உறுதிப்படுத்தவில்லை. இருப்பினும் உடனடியாக தோல் மருத்துவரை அணுகி பரிசோதனை செய்து கொள்ளவும். வீட்டிலேயே சிகிச்சை செய்ய வேண்டாம்.",
    uncertain: "பதிவேற்றப்பட்ட படங்களில் இருந்து தெளிவான முடிவை வழங்க முடியவில்லை. சில படங்களில் போதிய வெளிச்சமின்மை, മங்கல் அல்லது வெவ்வேறு கோணங்கள் காரணங்களாக இருக்கலாம். தயவுசெய்து தெளிவான படங்களை மீண்டும் பதிவேற்றவும்."
  },
  Malayalam: {
    low: "നിങ്ങളുടെ ചർമ്മ പരിശോധന പൂർത്തിയായി. അപ്‌ലോഡ് ചെയ്ത ചിത്രങ്ങളിൽ എഐ ഗുരുതരമായ ലക്ഷണങ്ങൾ കണ്ടെത്തിയിട്ടില്ല. ഇത് നിങ്ങൾക്ക് രോഗമില്ല എന്നതിന്റെ പൂർണ്ണ ഉറപ്പല്ല. ദയവായി ഈ ഭാഗം നിരീക്ഷിക്കുന്നത് തുടരുക. എന്തെങ്കിലും മാറ്റം കണ്ടാൽ ഡോക്ടറെ കാണുക. ഇത് കേവലം പ്രാഥമിക പരിശോധന മാത്രമാണ്.",
    moderate: "നിങ്ങളുടെ ചർമ്മ പരിശോധന പൂർത്തിയായി. എഐ ചില പ്രത്യേക ലക്ഷണങ്ങൾ കണ്ടെത്തിയിട്ടുണ്ട്, ഇവ കൂടുതൽ ശ്രദ്ധിക്കേണ്ടതുണ്ട്. നിങ്ങളുടെ പരിശോധനാ ഫലം മിതമായതാണ്. ഇതിനർത്ഥം നിങ്ങൾക്ക് ക്യാൻസർ ഉണ്ടെന്നല്ല. ചർമ്മരോഗ വിദഗ്ധനെ കണ്ട് പരിശോധിക്കുന്നത് ഉചിതമായിരിക്കും.",
    high: "നിങ്ങളുടെ ചർമ്മ പരിശോധന പൂർത്തിയായി. എഐ ചില ഗുരുതരമായ ലക്ഷണങ്ങൾ കണ്ടെത്തിയിട്ടുണ്ട്. ഇത് ക്യാൻസർ സ്ഥിരീകരിക്കുന്നില്ല. എങ്കിലും ഒട്ടും വൈകാതെ ഒരു ചർമ്മരോഗ വിദഗ്ധന്റെ സേവനം തേടുക. സ്വയം ചികിത്സ ഒഴിവാക്കുക.",
    uncertain: "ചിത്രങ്ങളുടെ വ്യക്തതക്കുറവ് കാരണം കൃത്യമായ ഫലം നൽകാൻ സാധിച്ചിട്ടില്ല. വെളിച്ചക്കുറവ്, മങ്ങൽ എന്നിവയായിരിക്കാം കാരണം. ദയവായി കൂടുതൽ വ്യക്തതയുള്ള ചിത്രങ്ങൾ വീണ്ടും എടുക്കുക."
  }
};
