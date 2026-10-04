import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Camera,
  CheckCircle2,
  Expand,
  Eye,
  FileCheck2,
  Leaf,
  MessageCircle,
  Scale,
  ScanLine,
  ShieldCheck,
  Store,
  Tractor,
} from "lucide-react";
import { useRef, useState, type ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import heroImage from "../assets/oniongrade-hero.jpg";
import botanicalImage from "../assets/onion-botanical.jpg";
import sunsetImage from "../assets/mandi-sunset.jpg";
import { Button } from "../components/ui/button";
import { DonutChart } from "../components/DonutChart";
import { GradingModal } from "../components/GradingModal";
const fallbackBatch = { id: "01", a: 78, u: 15, r: 7, grade: "Grade A", d: 58.2, damage: 1.2, sprout: 0.02 };
const batches = [
  fallbackBatch,
  { id: "02", a: 42, u: 45, r: 13, grade: "URS", d: 36.8, damage: 8.4, sprout: 0.16 },
  { id: "03", a: 89, u: 8, r: 3, grade: "Grade A", d: 61.4, damage: 0.8, sprout: 0.01 },
  { id: "04", a: 71, u: 22, r: 7, grade: "Grade A", d: 52.6, damage: 2.8, sprout: 0.05 },
];
const roles = [
  {
    role: "farmer",
    icon: Tractor,
    title: "Farmer",
    tag: "GRADE",
    copy: "Know your produce before the auction starts.",
    tone: "bg-role-farmer",
  },
  {
    role: "officer",
    icon: Scale,
    title: "Procurement Officer",
    tag: "VERIFY",
    copy: "Process arrivals and issue traceable e-Lot receipts.",
    tone: "bg-role-officer",
  },
  {
    role: "retailer",
    icon: Store,
    title: "Retailer / Trader",
    tag: "SOURCE",
    copy: "Compare verified lots without exposing farmer identity.",
    tone: "bg-role-retailer",
  },
  {
    role: "government",
    icon: Building2,
    title: "Government / DoCA",
    tag: "OVERSEE",
    copy: "See regional quality, disputes and live rules.",
    tone: "bg-role-government",
  },
] as const;
const featureCards: Array<[ComponentType<LucideProps>, string, string]> = [
  [Eye, "Explainable, not opaque", "See each measured feature, confidence score and the exact reason behind a grade."],
  [FileCheck2, "Rules you can check", "Published DoCA thresholds remain visible to every participant in the market."],
  [BarChart3, "Built to improve", "Performance is tracked across varieties, seasons and mandis—not hidden behind one score."],
];
export default function PublicLanding() {
  const [scanner, setScanner] = useState(false);
  const [batch, setBatch] = useState(0);
  const [bulb, setBulb] = useState(0);
  const [modelTab, setModelTab] = useState<"matrix" | "weights" | "mandis">("matrix");
  const roleTrack = useRef<HTMLDivElement>(null);
  const currentBatch = batches.at(batch) ?? fallbackBatch;
  const scrollRoles = (d: number) =>
    roleTrack.current?.scrollBy({ left: d * 330, behavior: "smooth" });
  return (
    <main>
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              O
            </span>{" "}
            OnionGrade
          </a>
          <div className="hidden gap-8 text-sm md:flex">
            <a href="#how-it-works">How it works</a>
            <a href="#stakeholders">For every stakeholder</a>
            <a href="#evidence">Model evidence</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm sm:block">
              Sign in
            </Link>
            <Button size="sm" onClick={() => setScanner(true)}>
              Try the demo <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </nav>
      <section
        id="top"
        className="relative flex min-h-[96vh] flex-col overflow-hidden bg-background pt-28"
      >
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
          <span className="section-badge">
            <ShieldCheck size={13} /> AI-powered · Smart automation · DoCA
          </span>
          <h1 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(3.1rem,7.4vw,6.8rem)] font-black leading-[.93]">
            Grading onions shouldn't depend on who's looking.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Turn one smartphone photo into an instant, explainable grade report—before your produce
            reaches the auction floor.
          </p>
          <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => setScanner(true)}>
              <Camera size={18} />
              Try a live grading demo
            </Button>
            <Button variant="outline" asChild>
              <a href="#how-it-works">
                See how it works <ArrowRight size={17} />
              </a>
            </Button>
          </div>
        </div>
        <div className="relative mt-8 h-[38vh] min-h-72 overflow-hidden">
          <img
            src={heroImage}
            width={1920}
            height={1088}
            alt="A farmer grading onions by smartphone at an Indian mandi"
            className="absolute inset-0 size-full object-cover object-[center_60%]"
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-background to-transparent" />
          <div className="scan-line absolute left-[43%] top-[55%] z-10 w-[13%]" />
        </div>
      </section>
      <section className="bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 border-x border-border md:grid-cols-4">
          {[
            ["120ms", "Edge inference", "Zero cloud latency"],
            ["98.4%", "Caliper accuracy", "Lab correlated"],
            ["₹480 Cr", "Spoilage saved", "Annual estimate"],
            ["100%", "Traceable e-Lots", "Verifiable receipts"],
          ].map(([v, k, s]) => (
            <div className="border-b border-r border-border p-5 md:p-7" key={k}>
              <strong className="font-display text-3xl">{v}</strong>
              <span className="mt-2 block text-xs font-bold uppercase tracking-widest">{k}</span>
              <span className="text-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section bg-wash">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="eyebrow">01 · The problem</p>
            <h2 className="section-title">One onion. Two inspectors. Two different grades.</h2>
            <div className="mt-7 max-w-xl space-y-5 text-muted-foreground">
              <p>
                Across India's mandis, quality is still judged by eye. The result can change with
                the person, the hour, or the pressure of a crowded auction.
              </p>
              <p>
                For farmers, that uncertainty becomes a lower price. For buyers, it becomes
                inconsistent stock. For officers, every disagreement becomes paperwork.
              </p>
              <p>
                OnionGrade turns the standard into something everyone can see, measure and
                challenge—with the same evidence attached to every lot.
              </p>
            </div>
          </div>
          <img
            src={botanicalImage}
            loading="lazy"
            width={1200}
            height={1200}
            alt="Botanical cross-section of an onion"
            className="mx-auto w-full max-w-xl rounded-full mix-blend-multiply"
          />
        </div>
      </section>
      <section id="how-it-works" className="section bg-wash">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="eyebrow">02 · How it works</p>
            <h2 className="section-title">From photo to verdict, in one scan.</h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Photograph nine sample bulbs. The model measures diameter, visible rot, sprouting and
              shape—then checks every signal against published DoCA rules.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              The result arrives as a traceable e-Lot report, with every bulb available for
              inspection.
            </p>
            <Button variant="outline" className="mt-7" onClick={() => setScanner(true)}>
              Open live scanner <ArrowRight size={17} />
            </Button>
          </div>
          <div className="phone-shell mx-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <strong>OnionGrade AI</strong>
              <ScanLine size={18} />
            </div>
            <div className="mt-4 flex gap-1 rounded-full bg-muted p-1 text-[10px]">
              <span className="rounded-full bg-card px-3 py-1">Cumulative</span>
              <span className="px-3 py-1">Grade scheme</span>
              <span className="px-3 py-1">Finance</span>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <DonutChart a={78} u={15} r={7} size={110} />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Grade report</p>
                <h3 className="font-display text-3xl text-success">Grade A</h3>
                <p className="text-xs text-muted-foreground">9 bulbs inspected</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="relative aspect-square rounded-lg bg-onion-texture">
                  <span className="absolute inset-2 rounded-full border-2 border-success" />
                </div>
              ))}
            </div>
            <Button className="mt-5 w-full">Register e-Lot</Button>
          </div>
        </div>
      </section>
      <section className="section bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Tested AI results</p>
            <h2 className="section-title">See what the model sees.</h2>
            <p className="mt-4 text-muted-foreground">
              Four field-tested batches. Every prediction is backed by visible measurements and
              rules.
            </p>
          </div>
          <div className="mt-10 flex gap-2">
            {batches.map((b, i) => (
              <Button
                key={b.id}
                size="sm"
                variant={batch === i ? "primary" : "outline"}
                onClick={() => {
                  setBatch(i);
                  setBulb(0);
                }}
              >
                Batch {b.id}
              </Button>
            ))}
          </div>
          <div className="mt-5 grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.2fr_.8fr]">
            <div className="relative min-h-[460px] bg-onion-field p-8">
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />
              <div className="relative grid h-full grid-cols-3 gap-5">
                {Array.from({ length: 9 }, (_, i) => (
                  <button
                    key={i}
                    aria-label={`Inspect bulb ${i + 1}`}
                    onClick={() => setBulb(i)}
                    className={`relative grid min-h-28 place-items-center rounded-full border-2 bg-onion ${bulb === i ? "scale-105 border-background ring-4 ring-primary" : "border-success"}`}
                  >
                    <span className="font-mono text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    {bulb === i && (
                      <span className="absolute -bottom-5 rounded-full bg-primary px-2 py-1 text-[9px] uppercase text-primary-foreground">
                        Inspecting
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className="scan-line absolute inset-x-8 top-1/2" />
            </div>
            <div className="p-6 lg:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow">Bulb {bulb + 1} diagnostic</p>
                  <h3 className="font-display text-4xl text-success">{currentBatch.grade}</h3>
                </div>
                <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
                  98.4% confidence
                </span>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[
                    ["Equatorial diameter", `${(currentBatch.d + bulb * 0.3).toFixed(1)} mm`],
                    ["Dark rot decay", `${currentBatch.damage}%`],
                    ["Apical sprout", String(currentBatch.sprout)],
                  ["Shape uniformity", "0.96"],
                ].map(([k, v]) => (
                  <div className="rounded-lg bg-muted p-4" key={k}>
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <strong className="mt-1 block font-mono">{v}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                <div className="flex h-full">
                  <span className="bg-success" style={{ width: `${currentBatch.a}%` }} />
                  <span className="bg-warning" style={{ width: `${currentBatch.u}%` }} />
                  <span className="bg-destructive" style={{ width: `${currentBatch.r}%` }} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <DonutChart
                  a={currentBatch.a}
                  u={currentBatch.u}
                  r={currentBatch.r}
                  size={118}
                />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Classification follows DoCA size, damage and sprouting thresholds. Select any bulb
                  to review its measurements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="evidence" className="section bg-wash">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="eyebrow">Model evidence</p>
          <h2 className="section-title">Tested across harvests, not just a lab.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={modelTab === "matrix" ? "primary" : "outline"}
              onClick={() => setModelTab("matrix")}
            >
              Confusion matrix
            </Button>
            <Button
              size="sm"
              variant={modelTab === "weights" ? "primary" : "outline"}
              onClick={() => setModelTab("weights")}
            >
              Feature weights
            </Button>
            <Button
              size="sm"
              variant={modelTab === "mandis" ? "primary" : "outline"}
              onClick={() => setModelTab("mandis")}
            >
              5 mandi sample
            </Button>
          </div>
          <div className="mt-5 rounded-2xl border border-border bg-card p-5 md:p-8">
            {modelTab === "matrix" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr>
                      <th>Actual / Predicted</th>
                      <th>Grade A</th>
                      <th>URS</th>
                      <th>Reject</th>
                      <th>Recall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Grade A", "7,250", "102", "41", "98.1%"],
                      ["URS", "88", "3,480", "56", "96.0%"],
                      ["Reject", "24", "39", "1,750", "96.5%"],
                    ].map((r) => (
                      <tr key={r[0]}>
                        {r.map((c, i) => (
                          <td key={c} className={i === 0 ? "font-semibold" : "font-mono"}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {modelTab === "weights" && (
              <div className="space-y-5">
                {[
                  ["Equatorial diameter", 38.5],
                  ["Rot necrosis coverage", 34.2],
                  ["Apical sprout length", 14.8],
                  ["Shape eccentricity", 8.1],
                  ["Surface texture", 4.4],
                ].map(([n, v]) => (
                  <div key={String(n)}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{n}</span>
                      <strong className="font-mono">{v}%</strong>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {modelTab === "mandis" && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  ["Lasalgaon", "3,200"],
                  ["Pimpalgaon", "2,980"],
                  ["Mahuva", "2,400"],
                  ["Kurnool", "2,100"],
                  ["Solapur", "1,800"],
                ].map(([n, v]) => (
                  <div className="rounded-xl bg-muted p-5" key={n}>
                    <MapPinIcon />
                    <strong className="mt-8 block font-display text-xl">{n}</strong>
                    <span className="font-mono text-sm text-muted-foreground">{v} samples</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <section id="stakeholders" className="section bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">03 · Built for every stakeholder</p>
              <h2 className="section-title">One report. Four very different views.</h2>
            </div>
            <div className="hidden gap-2 sm:flex">
              <Button
                size="icon"
                variant="outline"
                aria-label="Previous"
                onClick={() => scrollRoles(-1)}
              >
                <ArrowLeft />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Next"
                onClick={() => scrollRoles(1)}
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
          <div
            ref={roleTrack}
            className="scrollbar-hide mt-10 flex snap-x gap-4 overflow-x-auto pb-4"
          >
            {roles.map(({ role, icon: Icon, title, tag, copy, tone }) => (
              <Link
                key={role}
                to={`/login?role=${role}`}
                className="group min-h-96 min-w-[290px] snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`grid h-52 place-items-center ${tone}`}>
                  <Icon size={86} strokeWidth={1.1} />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {tag}
                  </span>
                  <h3 className="mt-2 font-display text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                  <ArrowRight className="mt-5 transition group-hover:translate-x-1" size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-card">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <span className="section-badge">04 · Beneath the surface</span>
          <h2 className="section-title mx-auto max-w-3xl">
            Every grade, peeled back to its reasoning.
          </h2>
          <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
            {featureCards.map(([Icon, t, c]) => (
              <article className="feature-card" key={String(t)}>
                <span className="grid size-12 place-items-center rounded-full bg-muted">
                  <Icon size={22} />
                </span>
                <h3 className="mt-8 font-display text-2xl">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div className="soil-transition">
        <div className="mx-auto h-full max-w-4xl border-t border-dark-border">
          <div className="root-lines" />
        </div>
      </div>
      <section className="section bg-soil text-dark-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="section-badge bg-dark-muted">05 · Who we're building for</span>
          <h2 className="section-title max-w-3xl">The dispute this is built to end.</h2>
          <p className="mt-4 text-dark-muted-foreground">
            Shared evidence changes the conversation at the mandi gate.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [
                "“I can show why my crop deserves the price—not just argue for it.”",
                "Rameshwar Patil",
                "Farmer, Lasalgaon",
              ],
              [
                "“The receipt and the grade now tell the same story.”",
                "Priya Menon",
                "Procurement Officer",
              ],
              [
                "“We can see patterns early and act before losses spread.”",
                "Kavita Iyer",
                "DoCA Ministry",
              ],
            ].map(([q, n, r]) => (
              <figure className="rounded-2xl bg-background p-7 text-foreground" key={n}>
                <blockquote className="font-display text-2xl leading-snug">{q}</blockquote>
                <figcaption className="mt-8 text-sm">
                  <strong>{n}</strong>
                  <span className="block text-muted-foreground">{r}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="relative min-h-[680px] overflow-hidden text-dark-foreground">
        <img
          src={sunsetImage}
          loading="lazy"
          width={1920}
          height={1088}
          alt="Onion harvest moving through a rural landscape at sunset"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-sunset-overlay" />
        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-4xl flex-col items-center justify-center px-4 text-center">
          <span className="section-badge">Ready when you are</span>
          <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none">
            A fairer grade, in the time it takes to take a photo.
          </h2>
          <Button variant="cream" className="mt-8" onClick={() => setScanner(true)}>
            Try the live demo <ArrowRight size={18} />
          </Button>
        </div>
      </section>
      <footer className="border-t border-dark-border bg-footer px-4 py-8 text-center text-xs text-dark-muted-foreground">
        OnionGrade AI — built for the Ministry of Consumer Affairs, Food & Public Distribution,
        Department of Consumer Affairs · Smart Automation
      </footer>
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2">
        <Button variant="cream" size="icon" aria-label="Expand">
          <Expand size={18} />
        </Button>
        <Button className="bg-accent text-accent-foreground" size="icon" aria-label="Get help">
          <MessageCircle size={19} />
        </Button>
      </div>
      <GradingModal open={scanner} onClose={() => setScanner(false)} />
    </main>
  );
}
function MapPinIcon() {
  return <Leaf className="text-success" />;
}


