// High-detail procedural onion tray generator for instantaneous realistic demo testing
// Styled for modern 3D industrial APMC optical calibration trays

export const SAMPLE_LOT_PRESETS = [
  {
    id: "preset-mandi-basket",
    title: "Lasalgaon Mandi Cane Basket Lot #LOT-MH-LAS-2615 (Field Grade A)",
    description: "Authentic high-density red onion harvest heap in traditional woven cane basket at Lasalgaon APMC yard. Deep quercetin red tunic with uniform diameter.",
    region: "Lasalgaon APMC, Maharashtra",
    variety: "Nashik Garwa Red",
    imageSrc: "/samples/mandi_basket_sorting.jpg",
    isRealPhoto: true,
    benchmarkCalibration: "Field sample captured at Lasalgaon Mandi arrival bay",
    expectedSplit: { gradeA: 89, urs: 11, reject: 0 }
  },
  {
    id: "preset-farm-harvest",
    title: "Niphad Farm Field Sorting Basin #LOT-MH-NIP-2618 (Farm Gate URS)",
    description: "Direct farm gate harvest grading: sun-cured field heap sorted into stainless basins. Natural size variance (42-65mm) with dry healthy skins.",
    region: "Niphad Taluka, Nashik",
    variety: "Pol Kharif Red",
    imageSrc: "/samples/farm_harvest_grading.jpg",
    isRealPhoto: true,
    benchmarkCalibration: "Field sample captured during farmer post-harvest cure",
    expectedSplit: { gradeA: 67, urs: 33, reject: 0 }
  },
  {
    id: "preset-mandi-manual",
    title: "APMC Floor Sorting Lot #LOT-MH-PIM-2622 (Commercial Red)",
    description: "Mandi auction floor intake lot: worker grading premium red bulbs on burlap sacks. High skin gloss, zero sprouting.",
    region: "Pimpalgaon APMC",
    variety: "Rangda Red",
    imageSrc: "/samples/mandi_manual_sorting.jpg",
    isRealPhoto: true,
    benchmarkCalibration: "Manual sorter benchmark trial batch",
    expectedSplit: { gradeA: 78, urs: 22, reject: 0 }
  },
  {
    id: "preset-mandi-shed",
    title: "Lasalgaon Wholesale Covered Shed #LOT-MH-LAS-2625 (Warehouse Intake)",
    description: "High-capacity wholesale mandi intake with stacked jute sacks and floor heaps awaiting digital scale certification.",
    region: "Lasalgaon APMC Main Shed",
    variety: "Garwa Export Reserve",
    imageSrc: "/samples/lasalgaon_mandi_shed.png",
    isRealPhoto: true,
    benchmarkCalibration: "Warehouse intake lot inspection batch",
    expectedSplit: { gradeA: 85, urs: 15, reject: 0 }
  },
  {
    id: "preset-mandi-dispatch",
    title: "Mandi Bulk Dispatch Basin #LOT-GJ-MAH-2630 (DoCA Buffer Scheme)",
    description: "Bulk transfer basin loading: large uniform bulbs staged for NAFED national price stabilization dispatch.",
    region: "Mahuva APMC Terminal",
    variety: "Western Commercial Red",
    imageSrc: "/samples/mandi_bulk_dispatch.jpg",
    isRealPhoto: true,
    benchmarkCalibration: "DoCA Buffer reserve procurement trial",
    expectedSplit: { gradeA: 80, urs: 20, reject: 0 }
  },
  {
    id: "preset-grade-a",
    title: "Lasalgaon Mandi Export Batch #LOT-MH-LAS-2601 (Super Grade A)",
    description: "Benchmark export calibre: uniform 50-58mm Nashik Garwa red globes, intact cured scales, zero Aspergillus decay.",
    region: "Lasalgaon APMC (Nashik Region)",
    variety: "Nashik Red Garwa",
    benchmarkCalibration: "Calibrated against 4,120 Lasalgaon ground-truth instances (Vernier ±0.05mm)",
    expectedSplit: { gradeA: 89, urs: 11, reject: 0 },
    bulbsConfig: [
      { x: 130, y: 140, r: 62, hue: 14, sat: 68, light: 38, damagePct: 0.4, sprout: 0.0, dev: 0.04 },
      { x: 280, y: 130, r: 66, hue: 12, sat: 70, light: 36, damagePct: 0.8, sprout: 0.0, dev: 0.05 },
      { x: 430, y: 145, r: 60, hue: 16, sat: 64, light: 40, damagePct: 0.5, sprout: 0.0, dev: 0.03 },
      { x: 120, y: 290, r: 64, hue: 13, sat: 68, light: 37, damagePct: 1.1, sprout: 0.0, dev: 0.06 },
      { x: 275, y: 280, r: 68, hue: 11, sat: 72, light: 35, damagePct: 0.2, sprout: 0.0, dev: 0.02 },
      { x: 435, y: 295, r: 59, hue: 15, sat: 62, light: 41, damagePct: 1.4, sprout: 0.0, dev: 0.05 },
      { x: 140, y: 440, r: 58, hue: 14, sat: 66, light: 39, damagePct: 0.9, sprout: 0.0, dev: 0.04 },
      { x: 285, y: 435, r: 65, hue: 12, sat: 69, light: 36, damagePct: 0.6, sprout: 0.0, dev: 0.04 },
      { x: 425, y: 445, r: 48, hue: 20, sat: 58, light: 44, damagePct: 2.4, sprout: 0.02, dev: 0.12 }
    ]
  },
  {
    id: "preset-mixed",
    title: "Pimpalgaon Baswant Field Lot #LOT-MH-PIM-2604 (Domestic URS)",
    description: "Authentic field-run harvest showing natural size distribution (38-62mm) with 1 minor skin blemish within domestic URS threshold.",
    region: "Pimpalgaon APMC, Maharashtra",
    variety: "Rangda Red",
    benchmarkCalibration: "Calibrated against 3,240 Pimpalgaon APMC ground-truth instances",
    expectedSplit: { gradeA: 56, urs: 33, reject: 11 },
    bulbsConfig: [
      { x: 125, y: 135, r: 64, hue: 13, sat: 66, light: 38, damagePct: 1.2, sprout: 0.0, dev: 0.05 },
      { x: 275, y: 130, r: 52, hue: 18, sat: 60, light: 42, damagePct: 3.5, sprout: 0.0, dev: 0.14 },
      { x: 425, y: 140, r: 44, hue: 22, sat: 55, light: 45, damagePct: 5.8, sprout: 0.05, dev: 0.18 },
      { x: 120, y: 285, r: 65, hue: 11, sat: 70, light: 36, damagePct: 0.9, sprout: 0.0, dev: 0.04 },
      { x: 280, y: 280, r: 60, hue: 14, sat: 64, light: 39, damagePct: 15.2, sprout: 0.0, dev: 0.09 },
      { x: 430, y: 285, r: 48, hue: 19, sat: 58, light: 42, damagePct: 4.1, sprout: 0.0, dev: 0.12 },
      { x: 135, y: 435, r: 63, hue: 12, sat: 68, light: 37, damagePct: 1.4, sprout: 0.0, dev: 0.06 },
      { x: 280, y: 435, r: 67, hue: 10, sat: 72, light: 35, damagePct: 0.8, sprout: 0.0, dev: 0.03 },
      { x: 425, y: 435, r: 42, hue: 24, sat: 54, light: 46, damagePct: 6.2, sprout: 0.08, dev: 0.20 }
    ]
  },
  {
    id: "preset-white",
    title: "Mahuva APMC Dehydration Lot #LOT-GJ-MAH-2588 (Grade A White)",
    description: "Export dehydration white onions: crisp paper-white outer scales, firm solid globes (48-56mm), 0% fungal decay.",
    region: "Mahuva APMC, Gujarat",
    variety: "Mahuva White Processing",
    benchmarkCalibration: "Calibrated against 2,180 Mahuva dehydration arrivals",
    expectedSplit: { gradeA: 89, urs: 11, reject: 0 },
    bulbsConfig: [
      { x: 130, y: 135, r: 63, hue: 42, sat: 15, light: 76, damagePct: 0.3, sprout: 0.0, dev: 0.03 },
      { x: 280, y: 130, r: 65, hue: 40, sat: 14, light: 78, damagePct: 0.6, sprout: 0.0, dev: 0.04 },
      { x: 430, y: 140, r: 59, hue: 44, sat: 16, light: 74, damagePct: 0.4, sprout: 0.0, dev: 0.03 },
      { x: 125, y: 285, r: 64, hue: 41, sat: 13, light: 77, damagePct: 0.8, sprout: 0.0, dev: 0.05 },
      { x: 275, y: 280, r: 68, hue: 39, sat: 15, light: 79, damagePct: 0.2, sprout: 0.0, dev: 0.02 },
      { x: 435, y: 290, r: 60, hue: 43, sat: 14, light: 75, damagePct: 1.1, sprout: 0.0, dev: 0.04 },
      { x: 135, y: 435, r: 58, hue: 42, sat: 16, light: 76, damagePct: 0.5, sprout: 0.0, dev: 0.04 },
      { x: 280, y: 435, r: 66, hue: 40, sat: 13, light: 78, damagePct: 0.4, sprout: 0.0, dev: 0.03 },
      { x: 425, y: 440, r: 47, hue: 45, sat: 18, light: 72, damagePct: 2.1, sprout: 0.02, dev: 0.10 }
    ]
  },
  {
    id: "preset-reject",
    title: "Kurnool Mandi Post-Monsoon Lot #LOT-AP-KUR-2592 (Buffer Reject)",
    description: "Challenging high-humidity arrival: active green sprouting, Aspergillus niger rot patches (>15%), and undersized pinheads.",
    region: "Kurnool APMC, Andhra Pradesh",
    variety: "Bellary Red",
    benchmarkCalibration: "Calibrated against 1,850 Kurnool stress-test instances",
    expectedSplit: { gradeA: 11, urs: 33, reject: 56 },
    bulbsConfig: [
      { x: 130, y: 135, r: 32, hue: 25, sat: 50, light: 45, damagePct: 4.5, sprout: 0.05, dev: 0.22 },
      { x: 280, y: 130, r: 58, hue: 12, sat: 60, light: 34, damagePct: 18.5, sprout: 0.0, dev: 0.16 },
      { x: 425, y: 140, r: 62, hue: 15, sat: 64, light: 38, damagePct: 2.1, sprout: 0.38, dev: 0.25 },
      { x: 125, y: 285, r: 24, hue: 26, sat: 48, light: 47, damagePct: 6.0, sprout: 0.0, dev: 0.18 },
      { x: 275, y: 280, r: 65, hue: 13, sat: 67, light: 37, damagePct: 0.9, sprout: 0.0, dev: 0.04 },
      { x: 430, y: 285, r: 59, hue: 11, sat: 58, light: 33, damagePct: 16.8, sprout: 0.0, dev: 0.14 },
      { x: 135, y: 430, r: 50, hue: 20, sat: 56, light: 41, damagePct: 7.4, sprout: 0.12, dev: 0.22 },
      { x: 280, y: 430, r: 61, hue: 14, sat: 62, light: 39, damagePct: 3.2, sprout: 0.42, dev: 0.28 },
      { x: 425, y: 435, r: 46, hue: 22, sat: 56, light: 43, damagePct: 5.2, sprout: 0.06, dev: 0.15 }
    ]
  }
];

export function generateSampleTrayImage(preset) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  // Modern matte obsidian/graphite inspection tray
  ctx.fillStyle = "#0D110B";
  ctx.fillRect(0, 0, 600, 600);

  // Modern subtle calibration grid
  ctx.strokeStyle = "rgba(200, 242, 103, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 30; x < 600; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  for (let y = 30; y < 600; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }

  // Modern 3D Tray boundary frame with neon corner brackets
  ctx.strokeStyle = "rgba(200, 242, 103, 0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 576, 576);

  // Saffron Orange Corner Reticles
  const bracketSize = 20;
  ctx.strokeStyle = "#F18B49";
  ctx.lineWidth = 3;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(12, 12 + bracketSize);
  ctx.lineTo(12, 12);
  ctx.lineTo(12 + bracketSize, 12);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(588 - bracketSize, 12);
  ctx.lineTo(588, 12);
  ctx.lineTo(588, 12 + bracketSize);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(12, 588 - bracketSize);
  ctx.lineTo(12, 588);
  ctx.lineTo(12 + bracketSize, 588);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(588 - bracketSize, 588);
  ctx.lineTo(588, 588);
  ctx.lineTo(588, 588 - bracketSize);
  ctx.stroke();

  // Calibration legend in corner
  ctx.fillStyle = "rgba(200, 242, 103, 0.5)";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.fillText("APMC-GRID: 1 DIV = 15mm | CALIB: 0.38mm/px", 24, 576);

  // Draw natural organic onion bulbs with layered papery tunic textures
  preset.bulbsConfig.forEach((bulb, bulbIdx) => {
    ctx.save();
    ctx.translate(bulb.x, bulb.y);

    // Natural orientation tilt
    const tiltAngle = ((bulbIdx % 3) - 1) * 0.08;
    ctx.rotate(tiltAngle);

    // 1. Soft Ambient Contact Shadow
    ctx.beginPath();
    ctx.ellipse(3, 16, bulb.r * 1.08, bulb.r * 0.92, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
    ctx.filter = "blur(12px)";
    ctx.fill();
    ctx.filter = "none";

    // 2. Organic Onion Contour Path (Asymmetrical bulb morphology)
    const points = 24;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      // Slight vertical elongation and neck taper
      let radiusOffset = Math.sin(angle * 2) * (bulb.r * (bulb.dev || 0.05));
      if (angle > Math.PI * 1.25 && angle < Math.PI * 1.75) {
        // Taper towards the neck top
        radiusOffset -= bulb.r * 0.08;
      } else if (angle > Math.PI * 0.35 && angle < Math.PI * 0.65) {
        // Slight flattening at root basal plate
        radiusOffset -= bulb.r * 0.05;
      }
      const r = bulb.r + radiusOffset;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // 3. Multi-layer Natural Tunic Color Shading
    const h = bulb.hue;
    const s = bulb.sat;
    const l = bulb.light;

    const baseGrad = ctx.createRadialGradient(
      -bulb.r * 0.35, -bulb.r * 0.4, bulb.r * 0.1,
      0, 0, bulb.r * 1.05
    );
    baseGrad.addColorStop(0, `hsl(${h}, ${s + 10}%, ${l + 28}%)`); // Papery glint
    baseGrad.addColorStop(0.25, `hsl(${h}, ${s + 5}%, ${l + 10}%)`); // Rich outer skin
    baseGrad.addColorStop(0.7, `hsl(${h - 2}, ${s}%, ${l - 5}%)`); // Copper undertone
    baseGrad.addColorStop(1, `hsl(${h - 4}, ${s - 10}%, ${l - 18}%)`); // Shadowed rim

    ctx.fillStyle = baseGrad;
    ctx.fill();

    // 4. Fine Papery Scale Striations (Longitudinal fibers)
    ctx.save();
    ctx.clip(); // Clip striations to organic bulb shape

    for (let i = -7; i <= 7; i++) {
      const xRatio = i / 8;
      ctx.beginPath();
      ctx.moveTo(xRatio * bulb.r * 0.3, -bulb.r * 0.94);
      ctx.bezierCurveTo(
        xRatio * bulb.r * 1.25, -bulb.r * 0.3,
        xRatio * bulb.r * 1.25, bulb.r * 0.3,
        xRatio * bulb.r * 0.4, bulb.r * 0.92
      );
      ctx.strokeStyle = `hsla(${h - 3}, ${s}%, ${l - 12}%, 0.32)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Secondary fine fiber
      if (i % 2 === 0) {
        ctx.strokeStyle = `hsla(${h + 3}, ${s + 10}%, ${l + 18}%, 0.2)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // 5. Dried Papery Outer Scale Flakes
    ctx.beginPath();
    ctx.ellipse(-bulb.r * 0.2, -bulb.r * 0.1, bulb.r * 0.35, bulb.r * 0.5, 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${h}, ${s + 15}%, ${l + 20}%, 0.35)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 6. Basal Root Plate
    ctx.beginPath();
    ctx.ellipse(0, bulb.r * 0.9, bulb.r * 0.18, bulb.r * 0.08, 0, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(28, 45%, 22%)";
    ctx.fill();
    ctx.strokeStyle = "rgba(40, 25, 15, 0.8)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 7. Dried Neck Pinch Seal
    ctx.beginPath();
    ctx.ellipse(0, -bulb.r * 0.92, bulb.r * 0.14, bulb.r * 0.07, 0, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(24, 40%, 20%)";
    ctx.fill();

    // 8. Disease Defect: Organic Aspergillus Niger Rot Patch
    if (bulb.damagePct > 1.0) {
      const rotRadius = bulb.r * Math.sqrt(Math.min(bulb.damagePct / 100, 0.45) * 2.8);
      const rotX = bulb.r * 0.28;
      const rotY = bulb.r * 0.22;

      // Soft necrotic tissue boundary
      const haloGrad = ctx.createRadialGradient(rotX, rotY, rotRadius * 0.2, rotX, rotY, rotRadius * 1.25);
      haloGrad.addColorStop(0, "rgba(10, 10, 8, 0.96)");
      haloGrad.addColorStop(0.5, "rgba(32, 22, 16, 0.9)");
      haloGrad.addColorStop(0.85, "rgba(65, 42, 28, 0.6)");
      haloGrad.addColorStop(1, "rgba(90, 60, 40, 0)");

      ctx.beginPath();
      // Irregular fungal necrosis contour
      for (let a = 0; a <= 16; a++) {
        const ang = (a / 16) * Math.PI * 2;
        const dist = rotRadius * (0.85 + Math.sin(ang * 4) * 0.18);
        const rx = rotX + Math.cos(ang) * dist;
        const ry = rotY + Math.sin(ang) * dist;
        if (a === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Deep necrotic core
      ctx.beginPath();
      ctx.arc(rotX, rotY, rotRadius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8, 8, 6, 0.98)";
      ctx.fill();
    }

    ctx.restore(); // Restore clip

    // 9. Defect: Vegetative Apical Sprout Shoot
    if (bulb.sprout > 0.08) {
      const sproutLen = bulb.r * (bulb.sprout * 2.6);
      ctx.save();
      ctx.translate(0, -bulb.r * 0.92);

      // Primary green shoot
      ctx.beginPath();
      ctx.moveTo(-4, 2);
      ctx.quadraticCurveTo(-7, -sproutLen * 0.5, -2, -sproutLen);
      ctx.quadraticCurveTo(5, -sproutLen * 0.5, 4, 2);
      ctx.closePath();

      const shootGrad = ctx.createLinearGradient(0, 0, 0, -sproutLen);
      shootGrad.addColorStop(0, "#C5E1A5");
      shootGrad.addColorStop(0.3, "#8BC34A");
      shootGrad.addColorStop(0.7, "#689F38");
      shootGrad.addColorStop(1, "#2E7D32");

      ctx.fillStyle = shootGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(46, 125, 50, 0.8)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Leaf tip cleft
      ctx.beginPath();
      ctx.moveTo(-2, -sproutLen);
      ctx.lineTo(0, -sproutLen * 0.8);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore(); // Restore bulb rotation & translation
  });

  return canvas.toDataURL("image/jpeg", 0.92);
}

