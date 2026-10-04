import { useEffect, useRef, useState } from "react";
import { Camera, Check, RotateCcw, Upload, X } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "../components/ui/button";
import { getLots, saveLots, type Lot } from "../lib/onion-data";
const fallbackBulb = { d: 54, damage: 1.2, s: 0.02, g: "Grade A" } as const;
const bulbData = [
  fallbackBulb,
  { d: 48, damage: 2.1, s: 0.05, g: "Grade A" },
  { d: 38, damage: 7.4, s: 0.12, g: "URS" },
  { d: 57, damage: 1.8, s: 0.03, g: "Grade A" },
  { d: 52, damage: 3.2, s: 0.07, g: "Grade A" },
  { d: 44, damage: 4.1, s: 0.08, g: "Grade A" },
  { d: 31, damage: 9.8, s: 0.18, g: "URS" },
  { d: 59, damage: 0.9, s: 0.01, g: "Grade A" },
  { d: 51, damage: 2.4, s: 0.04, g: "Grade A" },
] as const;
export function GradingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"capture" | "processing" | "results">("capture");
  const [image, setImage] = useState<string>();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(45);
  const [saved, setSaved] = useState(false);
  const selectedBulb = bulbData.at(active) ?? fallbackBulb;
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  const start = (file?: File) => {
    if (file) setImage(URL.createObjectURL(file));
    setStep("processing");
    setTimeout(() => setStep("results"), 2200);
  };
  const register = () => {
    const lot: Lot = {
      id: `LOT-MH-${String(getLots().length + 1).padStart(3, "0")}`,
      farmerName: "Rameshwar Patil",
      mandiName: "Lasalgaon APMC",
      variety: "Garwa (Rabi)",
      quantityQuintals: qty,
      lotGrade: "Grade A",
      gradeAPct: 78,
      ursPct: 22,
      rejectPct: 0,
      mspPrice: 2850,
      status: "Queued",
    };
    saveLots([lot, ...getLots()]);
    setSaved(true);
    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#D4874B", "#4A7C59", "#E8A020"],
    });
  };
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-overlay p-3"
      role="dialog"
      aria-modal="true"
      aria-label="Grade a new lot"
    >
      <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="eyebrow">AI grading workflow</p>
            <h2 className="font-display text-2xl">Grade a new onion lot</h2>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        {step === "capture" && (
          <div className="grid gap-6 p-5 md:grid-cols-2">
            <div className="grid min-h-80 place-items-center overflow-hidden rounded-xl border border-dashed border-primary bg-muted">
              {image ? (
                <img src={image} className="h-full w-full object-cover" alt="Uploaded onion lot" />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto mb-4 text-primary" size={48} />
                  <p className="font-display text-2xl">Frame the full sample</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Spread 9 bulbs on a plain surface.
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-display text-3xl">A fair verdict starts with one clear photo.</h3>
              <p className="mt-4 text-muted-foreground">
                Images are analyzed on-device against DoCA grading rules. Your raw photo stays
                private.
              </p>
              <input
                ref={inputRef}
                className="hidden"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) start(f);
                }}
              />
              <Button className="mt-8" onClick={() => inputRef.current?.click()}>
                <Upload size={18} />
                Upload or take photo
              </Button>
              <Button className="mt-3" variant="outline" onClick={() => start()}>
                Use demo sample
              </Button>
            </div>
          </div>
        )}
        {step === "processing" && (
          <div className="grid min-h-[480px] place-items-center p-8 text-center">
            <div>
              <div className="scanner-rings mx-auto mb-8 grid size-32 place-items-center rounded-full border border-primary">
                <ScanMark />
              </div>
              <h3 className="font-display text-4xl">Reading the harvest</h3>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <p>Detecting bulbs...</p>
                <p className="delay-one">Measuring diameter...</p>
                <p className="delay-two">Checking rot and sprouting...</p>
                <p className="delay-three">Applying DoCA grade rules...</p>
              </div>
            </div>
          </div>
        )}
        {step === "results" && (
          <div className="p-5">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 rounded-xl bg-success-soft p-5">
              <div>
                <span className="eyebrow text-success">Verified result</span>
                <h3 className="font-display text-5xl text-success">Grade A</h3>
                <p className="text-sm text-muted-foreground">
                  98.4% model confidence · 7 of 9 bulbs passed
                </p>
              </div>
              <Check className="text-success" size={44} />
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Tap a bulb to inspect
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {bulbData.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`aspect-square rounded-lg border p-3 text-left transition ${active === i ? "border-primary bg-primary/10 ring-2 ring-primary" : "border-border bg-card"}`}
                    >
                      <span
                        className={`grade-dot ${b.g === "Grade A" ? "bg-success" : b.g === "URS" ? "bg-warning" : "bg-destructive"}`}
                      />
                      <strong className="mt-6 block font-display text-lg">Bulb {i + 1}</strong>
                      <span className="text-xs text-muted-foreground">{b.d} mm</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <h4 className="font-display text-2xl">Bulb {active + 1} diagnostics</h4>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["Diameter", `${selectedBulb.d} mm`],
                      ["Damage", `${selectedBulb.damage}%`],
                      ["Sprout", String(selectedBulb.s)],
                      ["Class", selectedBulb.g],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-muted p-3">
                        <span className="text-xs text-muted-foreground">{k}</span>
                        <strong className="block font-mono text-sm">{v}</strong>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Diameter and visible damage fall within the published DoCA Grade A thresholds.
                  </p>
                </div>
                <label className="mt-4 block text-sm font-medium">
                  Quantity (quintals)
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3"
                  />
                </label>
                <div className="mt-2 flex justify-between text-sm">
                  <span>Estimated value</span>
                  <strong>₹{(qty * 2850).toLocaleString("en-IN")}</strong>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button onClick={register} disabled={saved}>
                    {saved ? (
                      <>
                        <Check />
                        e-Lot registered
                      </>
                    ) : (
                      "Register e-Lot"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("capture");
                      setSaved(false);
                    }}
                  >
                    <RotateCcw size={16} />
                    Re-scan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function ScanMark() {
  return (
    <div className="relative size-20 rounded-full bg-primary/10">
      <span className="scan-line absolute left-1 right-1 top-1/2" />
    </div>
  );
}

export default GradingModal;

