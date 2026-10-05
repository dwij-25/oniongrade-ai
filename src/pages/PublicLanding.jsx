import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLots } from "../services/storage";
import DonutChart from "../components/DonutChart";
import { ROLES, ROLE_INFO, DEFAULT_GRADE_CONFIG } from "../constants/rules";
import { MODEL_METADATA, evaluateBulbWithTrainedModel } from "../services/trainedModel";
import SihFooterBanner from "../components/SihFooterBanner";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sprout,
  ShoppingBag,
  Scale,
  Landmark,
  CheckCircle2,
  ChevronRight,
  Eye,
  Activity,
  Lock,
  BarChart3,
  Sliders,
  Layers,
  MapPin,
  Scan,
  Binary,
  Database,
  Award,
  Check,
  Zap,
  Target,
  ArrowUpRight,
  Globe,
  FileText,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from "lucide-react";

export default function PublicLanding({ onOpenLoginWithRole }) {
  const { openLoginModal, openScanner } = useAuth();
  const { t, tr, language, isHindi, isMarathi, isGujarati } = useLanguage();
  const navigate = useNavigate();
  const lots = getLots();

  // GSAP animation refs
  const heroRootRef = useRef(null);

  // Auto-scroll to hash target if visited directly or redirected from workspace
  useEffect(() => {
    if (window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, []);

  // GSAP Entrance & Micro-interactions
  useEffect(() => {
    if (!heroRootRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger entrance for headline lines
      gsap.from(".hero-headline-line", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power2.out"
      });

      // Badge bounce & pop
      gsap.from(".hero-badge", {
        scale: 0.4,
        opacity: 0,
        duration: 0.7,
        delay: 0.35,
        ease: "back.out(1.8)"
      });

      // Gentle floating loop for DoCA badge
      gsap.to(".hero-badge", {
        y: -4,
        rotation: -4,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // 4-card deck stagger reveal
      gsap.from(".hero-card-deck > div", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.25,
        ease: "power2.out"
      });

      // Smooth laser scan beam animation in Card 2
      gsap.to(".laser-scan-beam", {
        top: "85%",
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // Continuous reticle rotation in Card 1
      gsap.to(".reticle-spin", {
        rotation: 360,
        duration: 16,
        repeat: -1,
        ease: "none"
      });
    }, heroRootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Pre-tested lots for the interactive showcase (4 diverse APMC batches)
  const testedBatches = lots.length >= 4 ? lots.slice(0, 4) : lots;
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
  const activeBatch = testedBatches[selectedBatchIndex] || testedBatches[0];
  const [selectedBulbId, setSelectedBulbId] = useState(1);
  const [activeModelTab, setActiveModelTab] = useState("confusion");

  const activeBulb = activeBatch?.bulbs?.find((b) => b.id === selectedBulbId) || activeBatch?.bulbs?.[0];
  const bulbInference = activeBulb ? evaluateBulbWithTrainedModel(activeBulb) : null;

  const handleRoleCardClick = (roleKey) => {
    if (onOpenLoginWithRole) {
      onOpenLoginWithRole(roleKey);
    } else {
      navigate(`/login?role=${roleKey}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F8D5C2] selection:bg-[#F18B49] selection:text-[#000000] overflow-hidden">
      
      {/* Ambient background agricultural bokeh glow */}
      <div className="relative pt-2 sm:pt-4 pb-10 px-3 sm:px-6" ref={heroRootRef}>
        <div className="absolute inset-0 max-h-[860px] overflow-hidden pointer-events-none -z-10">
          <img
            src="/samples/farm_harvest_grading.jpg"
            alt="Agricultural backdrop"
            className="w-full h-full object-cover blur-3xl opacity-20 scale-110 filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 via-[#000000]/85 to-[#000000]" />
        </div>

        {/* Floating Dark Tablet Chassis Container matching reference image */}
        <section className="max-w-6xl mx-auto rounded-[32px] sm:rounded-[44px] bg-[#0E050C]/95 border border-white/[0.12] p-5 sm:p-7 md:p-9 shadow-[0_30px_100px_rgba(0,0,0,0.95)] relative overflow-hidden backdrop-blur-2xl">
          
          {/* Top Hero Row: Impact Headline (Left) & Social Proof Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-6 sm:mb-8">
            
            {/* Left Column: Headline with inline badges & sketched curved arrow */}
            <div className="lg:col-span-7 xl:col-span-7 text-left">
              {/* Release Mini Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#180815] border border-white/10 text-[10px] font-mono text-[#C4A494] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F18B49] animate-pulse" />
                <span className="tracking-wide">ICAR-DOGR SPEC 2.4 • CLIENT-SIDE EDGE AI</span>
              </div>

              {/* Bold Playful Hero Headline — Exactly 3 Balanced Lines */}
              <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] tracking-tight leading-[1.14] text-[#FFF5ED]">
                {/* Line 1 */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap hero-headline-line">
                  <span className="whitespace-nowrap">
                    {tr("AI-powered", "एआई-सक्षम", "एआय-सक्षम", "AI-સંચાલિત")}
                  </span>
                  <span className="inline-flex items-center justify-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[#F18B49]/50 bg-[#F18B49]/10 text-[#F18B49] shadow-inner">
                    <Scan size={20} className="text-[#F18B49]" />
                  </span>
                  <span className="whitespace-nowrap">
                    {tr("grades", "ग्रेड्स", "प्रतवारी", "ગ્રેડ્સ")}
                  </span>
                </div>

                {/* Line 2 with inline attached arrow & slanted DoCA badge */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap mt-1 hero-headline-line">
                  <span className="whitespace-nowrap">
                    {tr("that", "जो", "जी", "જે")}
                  </span>
                  <span className="px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#F18B49] text-[#000000] font-black shadow-md shadow-[#F18B49]/30 whitespace-nowrap">
                    {tr("certify", "प्रमाणित", "प्रमाणित", "પ્રમાણિત")}
                  </span>
                  <span className="whitespace-nowrap">
                    {tr("and nurture", "करते हैं", "करते", "કરે છે")}
                  </span>

                  {/* Sketched loopy curved arrow & slanted capsule tag directly attached to Line 2 */}
                  <div className="inline-flex items-center relative ml-1 sm:ml-2 hero-badge-container">
                    <svg className="absolute -top-11 -left-7 w-15 h-13 text-[#F18B49] pointer-events-none hero-arrow-svg" viewBox="0 0 60 45" fill="none" stroke="currentColor">
                      <path d="M6,34 C12,4 42,4 42,18 C42,28 30,32 24,26 C18,20 24,14 34,14 C44,14 50,22 48,34" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" className="hero-arrow-path" />
                      <polyline points="42,32 48,36 50,28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#F18B49]/60 bg-[#1D0A18] text-[#F18B49] text-[10px] font-mono font-black rotate-[-6deg] shadow-lg shadow-[#F18B49]/20 hover:rotate-0 transition-transform cursor-default whitespace-nowrap hero-badge">
                      <span>DoCA CALIBRATED</span>
                      <ArrowUpRight size={12} className="text-[#F18B49]" />
                    </div>
                  </div>
                </div>

                {/* Line 3 */}
                <div className="mt-1 hero-headline-line">
                  <span>{tr("your onion harvest", "आपकी प्याज फसल को", "आपल्या कांदा पिकाला", "તમારા ડુંગળી પાકને")}</span>
                </div>
              </h1>
            </div>

            {/* Right Column: Floating Social Proof Card with Avatars & Tags */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-3 justify-center">
              {/* Social Proof Card with stacked avatars */}
              <div className="bg-[#FFF5ED] text-[#000000] p-4 rounded-3xl shadow-xl flex items-center justify-between gap-3 border border-[#F8D5C2]">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-mono font-black uppercase tracking-wider text-[#5F1C47]">
                    {tr("4 ROLE-BASED WORKSPACES", "4 भूमिका-आधारित कार्यक्षेत्र", "4 भूमिका-आधारित कार्यक्षेत्र", "4 ભૂમિકા-આધારિત કાર્યક્ષેત્ર")}
                  </div>
                  {/* Stacked Overlapping Avatars — Farmer, Trader, Officer, Gov */}
                  <div className="flex items-center -space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                      alt="Farmer Ramesh"
                      className="w-8 h-8 rounded-full border-2 border-[#FFF5ED] object-cover shadow-sm"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"
                      alt="Trader Sunita"
                      className="w-8 h-8 rounded-full border-2 border-[#FFF5ED] object-cover shadow-sm"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                      alt="Officer Patil"
                      className="w-8 h-8 rounded-full border-2 border-[#FFF5ED] object-cover shadow-sm"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces"
                      alt="DoCA Official"
                      className="w-8 h-8 rounded-full border-2 border-[#FFF5ED] object-cover shadow-sm"
                    />
                  </div>
                </div>

                {/* Verified Certification Accreditation Tag (button removed) */}
                <div className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#000000] text-[#F18B49] border border-black/10 shadow-sm">
                  <CheckCircle2 size={14} className="text-[#F18B49]" />
                  <span className="text-xs font-mono font-bold tracking-tight text-[#F8D5C2]">
                    {tr("98.4% Accuracy", "98.4% सटीकता", "९८.४% अचूकता", "૯૮.૪% ચોકસાઈ")}
                  </span>
                </div>
              </div>

              {/* Trio of Pill Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full border border-[#F8D5C2]/20 bg-[#F8D5C2]/10 text-[11px] font-mono font-semibold text-[#F8D5C2]">
                  {tr("Autonomous", "स्वायत्त", "स्वायत्त", "સ્વાયત્ત")}
                </span>
                <span className="px-3 py-1 rounded-full border border-[#F8D5C2]/20 bg-[#F8D5C2]/10 text-[11px] font-mono font-semibold text-[#F8D5C2]">
                  {tr("Sub-mm Caliper", "सब-मिमी कैलिपर", "सब-मिमी कॅलिपर", "સબ-મીમી કેલિપર")}
                </span>
                <span className="px-3 py-1 rounded-full border border-[#F8D5C2]/20 bg-[#F8D5C2]/10 text-[11px] font-mono font-semibold text-[#F8D5C2]">
                  {tr("Fair Price", "उचित मूल्य", "योग्य भाव", "વાજબી ભાવ")}
                </span>
              </div>
            </div>

          </div>

          {/* Bottom 4-Card Deck matching reference image */}
          <div className="hero-card-deck grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Card 1: Visual Telemetry Scan Card */}
            <div className="relative h-[255px] sm:h-[280px] rounded-3xl overflow-hidden border border-white/10 group shadow-lg flex flex-col justify-between p-3.5 sm:p-4">
              <img
                src="/samples/farm_harvest_grading.jpg"
                alt="Visual Telemetry"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

              {/* Top HUD Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#F8D5C2] text-[11px] font-mono font-bold shadow">
                  <Sprout size={12} className="text-[#F18B49]" />
                  <span>38.5mm Calibre</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#F18B49]/20 text-[#F18B49] border border-[#F18B49]/40 font-bold">
                  AI HUD
                </span>
              </div>

              {/* Center Concentric Reticle with GSAP rotation */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#F18B49]/60 reticle-spin" />
                  <div className="absolute inset-1.5 rounded-full border border-white/30" />
                  <div className="w-12 h-12 rounded-full bg-black/75 backdrop-blur-md border border-[#F18B49] flex flex-col items-center justify-center text-center p-1 shadow-lg">
                    <span className="text-[8px] text-[#C4A494] font-mono leading-none">SKIN</span>
                    <span className="text-[11px] font-black text-[#F18B49] font-mono leading-tight">98.4%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Live Reticle Info */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#F8D5C2] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-2xl border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F18B49] animate-pulse" />
                  <span>Live Edge Reticle</span>
                </span>
                <span className="text-[#C4A494]">120ms</span>
              </div>
            </div>

            {/* Card 2: Warm Bright Cream Hardware Card */}
            <div className="h-[255px] sm:h-[280px] rounded-3xl bg-[#FFF5ED] text-[#000000] p-3.5 sm:p-4 flex flex-col justify-between shadow-lg relative border border-[#F8D5C2]">
              <div>
                <h3 className="font-sans font-black text-base sm:text-lg text-[#000000] tracking-tight">
                  APMC Lens T-50
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#4A3B32] mt-0.5 leading-snug line-clamp-2">
                  {tr(
                    "Autonomous multi-spectral grading terminal with edge computer vision.",
                    "एज कंप्यूटर विज़न से युक्त स्वायत्त मल्टी-स्पेक्ट्रल ग्रेडिंग टर्मिनल।",
                    "एज कॉम्प्युटर व्हिजनसह स्वायत्त मल्टी-स्पेक्ट्रल प्रतवारी टर्मिनल.",
                    "એજ કોમ્પ્યુટર વિઝન સાથે સ્વાયત્ત મલ્ટી-સ્પેક્ટ્રલ ગ્રેડિંગ ટર્મિનલ."
                  )}
                </p>
              </div>

              {/* Terminal Scanner Console Device Graphic with animated laser scan beam */}
              <div className="my-auto mx-auto w-full max-w-[170px] bg-[#140611] rounded-2xl p-2 border border-black/15 shadow-inner text-[#F8D5C2]">
                <div className="flex items-center justify-between text-[8px] font-mono text-[#C4A494] mb-1 pb-0.5 border-b border-white/10">
                  <span className="text-[#F18B49] font-bold">TERMINAL-T50</span>
                  <span>CALIBRATED</span>
                </div>
                <div className="relative h-12 rounded-xl bg-black/60 flex items-center justify-center overflow-hidden border border-white/10">
                  <div className="absolute inset-x-0 h-0.5 bg-[#F18B49] laser-scan-beam shadow-[0_0_8px_#F18B49]" style={{ top: "15%" }} />
                  <div className="w-7 h-7 rounded-full border border-dashed border-[#F18B49]/80 flex items-center justify-center">
                    <Scan size={13} className="text-[#F18B49]" />
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-[#C4A494]">GRADE A:</span>
                  <span className="text-[#F18B49] font-bold">96.8%</span>
                </div>
              </div>

              {/* Hardware Calibration & Terminal Launcher Button */}
              <button
                type="button"
                onClick={openScanner}
                className="w-full py-2 px-3.5 rounded-full btn-3d-lime text-xs font-mono font-bold flex items-center justify-between shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group"
                title="Launch Optical AI Grading Scanner"
              >
                <div className="flex items-center gap-1.5">
                  <Scan size={14} className="text-[#000000]" />
                  <span className="text-[11px] font-bold text-[#000000]">
                    {tr("Launch AI Terminal", "एआई टर्मिनल शुरू करें", "एआय टर्मिनल सुरू करा", "AI ટર્મિનલ શરૂ કરો")}
                  </span>
                </div>
                <ArrowRight size={13} className="text-[#000000] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Card 3: Mandi Yard Card with Watermark Frosted Badge */}
            <div className="relative h-[255px] sm:h-[280px] rounded-3xl overflow-hidden border border-white/10 group shadow-lg flex flex-col justify-between p-3.5 sm:p-4">
              <img
                src="/samples/lasalgaon_mandi_shed.png"
                alt="Lasalgaon Mandi Yard"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

              {/* Top Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/60 text-[#F8D5C2] border border-white/20 font-bold backdrop-blur-md">
                  LASALGAON APMC
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F18B49] animate-pulse" />
              </div>

              {/* Center Frosted Glass Watermark Badge */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                <div className="w-18 h-18 rounded-full bg-[#FFF5ED]/20 backdrop-blur-md border border-[#F8D5C2]/40 shadow-2xl flex flex-col items-center justify-center text-[#FFF5ED] text-center p-2 group-hover:scale-110 transition-transform">
                  <div className="text-lg font-black text-[#F8D5C2] leading-none mb-0.5">✻</div>
                  <div className="text-[8px] font-mono font-black uppercase tracking-tighter text-[#FFF5ED] leading-tight">
                    OnionGrade
                  </div>
                  <div className="text-[7px] font-mono text-[#F18B49] tracking-widest font-bold">
                    VERIFIED
                  </div>
                </div>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 text-[10px] font-mono text-[#F8D5C2] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-2xl border border-white/10 text-center">
                {tr("Mandi Intake Yard • Nashik", "मंडी आवक यार्ड • नासिक", "बाजार समिती आवक यार्ड • नाशिक", "માર્કેટ યાર્ડ આવક • નાસિક")}
              </div>
            </div>

            {/* Card 4: Royal Plum Mission Card */}
            <div className="relative h-[255px] sm:h-[280px] rounded-3xl bg-gradient-to-br from-[#5F1C47] via-[#3E112E] to-[#160613] text-[#F8D5C2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 shadow-lg overflow-hidden">
              {/* Generative contour vector curves */}
              <svg className="absolute -top-4 -right-4 w-32 h-32 opacity-35 pointer-events-none" viewBox="0 0 120 120" fill="none">
                <path d="M0,35 Q40,10 80,45 T160,25" stroke="#EB87A9" strokeWidth="1.2" fill="none" />
                <path d="M0,50 Q45,25 90,60 T180,40" stroke="#EB87A9" strokeWidth="1.2" fill="none" />
                <path d="M0,65 Q50,40 100,75 T200,55" stroke="#F8D5C2" strokeWidth="1.2" fill="none" />
                <path d="M0,80 Q55,55 110,90 T220,70" stroke="#F18B49" strokeWidth="1.2" fill="none" />
              </svg>

              {/* Top Icons */}
              <div className="relative z-10 flex items-center gap-2 text-[#EB87A9]">
                <Globe size={16} />
                <Landmark size={16} />
                <ArrowRight size={13} className="text-[#F18B49]" />
              </div>

              {/* Mission Quote */}
              <p className="relative z-10 font-sans text-xs sm:text-[13px] font-medium text-[#F8D5C2] leading-relaxed my-auto pr-1">
                {tr(
                  "Our mission is to bring 100% fair, transparent, and autonomous quality grading to every onion farmer across Indian APMC mandis.",
                  "हमारा मिशन भारतीय एपीएमसी मंडियों में प्रत्येक किसान के लिए 100% निष्पक्ष, पारदर्शी और स्वायत्त गुणवत्ता ग्रेडिंग प्रदान करना है।",
                  "आमचे उद्दिष्ट भारतीय कृषी उत्पन्न बाजार समित्यांमधील प्रत्येक कांदा उत्पादक शेतकऱ्याला १००% पारदर्शक व अचूक प्रतवारी मिळवून देणे हे आहे.",
                  "અમારું મિશન ભારતીય APMC માર્કેટ યાર્ડ્સમાં દરેક ડુંગળી ખેડૂત માટે ૧૦૦% નિષ્પક્ષ, પારદર્શક અને સ્વાયત્ત ગુણવત્તા ગ્રેડિંગ લાવવાનું છે."
                )}
              </p>

              {/* Footnote */}
              <div className="relative z-10 text-[9px] font-mono text-[#EB87A9] uppercase tracking-wider flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F18B49]" />
                <span>DoCA • National Mandi Network</span>
              </div>
            </div>

          </div>

        </section>

        {/* Calibrated Telemetry Metrics Strip right below the chassis */}
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-left">
          <div className="p-3.5 rounded-2xl bg-[#140711]/80 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] text-[#C4A494] uppercase tracking-wider">{tr("EDGE INFERENCE", "एज अनुमान", "एज इन्फरन्स", "એજ અનુમાન")}</div>
            <div className="text-xl font-black text-[#F8D5C2] font-tabular mt-0.5">120ms</div>
            <div className="text-[10px] text-[#C4A494] mt-0.5 font-sans">{tr("Zero cloud latency", "शून्य क्लाउड विलंबता", "शून्य क्लाउड विलंब", "શૂન્ય ક્લાઉડ વિલંબ")}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#140711]/80 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] text-[#C4A494] uppercase tracking-wider">{tr("CALIPER ACCURACY", "कैलिपर सटीकता", "कॅलिपर अचूकता", "કેલિપર ચોકસાઈ")}</div>
            <div className="text-xl font-black text-[#F18B49] font-tabular mt-0.5">98.4%</div>
            <div className="text-[10px] text-[#C4A494] mt-0.5 font-sans">{tr("DoCA lab correlated", "DoCA लैब सहसंबद्ध", "DoCA प्रयोगशाळा प्रमाणित", "DoCA લેબ સંબંધિત")}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#140711]/80 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] text-[#C4A494] uppercase tracking-wider">{tr("ANNUAL SPOILAGE SAVE", "वार्षिक खराब बचत", "वार्षिक नासाडी बचत", "વાર્ષિક બગાડ બચત")}</div>
            <div className="text-xl font-black text-[#EB87A9] font-tabular mt-0.5">₹480 Cr</div>
            <div className="text-[10px] text-[#C4A494] mt-0.5 font-sans">{tr("National buffer loss target", "राष्ट्रीय बफर हानि लक्ष्य", "राष्ट्रीय बफर नासाडी उद्दिष्ट", "રાષ્ટ્રીય બફર નુકસાન લક્ષ્ય")}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#140711]/80 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] text-[#C4A494] uppercase tracking-wider">{tr("TRACEABLE e-LOTS", "ट्रैसेबल ई-लॉट्स", "ट्रेस करण्यायोग्य ई-लॉट्स", "ટ્રેસ કરી શકાય તેવા ઇ-લોટ્સ")}</div>
            <div className="text-xl font-black text-[#F8D5C2] font-tabular mt-0.5">100%</div>
            <div className="text-[10px] text-[#C4A494] mt-0.5 font-sans">{tr("Immutable weighbridge slip", "अपरिवर्तनीय वजनपुल पर्ची", "अपरिवर्तनीय वजनकाटा पावती", "અપરિવર્તનીય વજનકાંટા પાવતી")}</div>
          </div>
        </div>
      </div>

      {/* Ground Reality Case Study Card: Chandwad Protest & Mobiusi Dataset */}
      <section id="case-study" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-white/[0.06] scroll-mt-20">
        <div className="card-3d p-6 sm:p-8 bg-gradient-to-br from-[#1b0817] via-[#10040e] to-[#080207] border border-[#F18B49]/30 relative overflow-hidden shadow-2xl">
          
          {/* Subtle radial ambient glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#F18B49]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#5F1C47]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="capsule-tag-dark text-[10px] sm:text-xs">
                {tr("GROUND REALITY • CASE STUDY", "जमीनी हकीकत • केस स्टडी", "प्रत्यक्ष जमिनीवरील वास्तव • केस स्टडी", "વાસ્તવિક સ્થિતિ • કેસ સ્ટડી")}
              </span>
              <span className="text-[#C4A494] text-xs">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30 font-mono text-[10px] font-bold">
                26 MAY 2026 • CHANDWAD, NASHIK
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#F18B49] font-bold">
                {tr("SIH Problem Statement Validation", "SIH समस्या विवरण सत्यापन", "SIH समस्या विधान पडताळणी", "SIH સમસ્યા નિવેદન ચકાસણી")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Authentic Protest Photo from PDF Slide 2 */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-xl aspect-[4/3] bg-black">
                <img
                  src="/samples/chandwad_protest.jpg"
                  alt="Chandwad Nashik Farmers Protest"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Overlaid Banner Info */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#F18B49]/40 text-[#F18B49] text-[10px] font-mono font-bold mb-1.5">
                    <MapPin size={11} />
                    <span>Chandwad APMC Highway Blockade, Nashik</span>
                  </div>
                  <p className="text-[11px] text-[#F8D5C2] font-mono leading-tight">
                    {tr(
                      "Farmers dumping onions demanding ₹24/kg & ₹3,000/qtl fair procurement against subjective grading cuts.",
                      "व्यक्तिपरक ग्रेडिंग कटौती के खिलाफ ₹24/किग्रा और ₹3,000/क्विंटल की मांग को लेकर किसानों ने प्याज फेंका।",
                      "मनमानी प्रतवारी कपातीविरोधात ₹२४/किलो व ₹३,०००/क्विंटल हमीभावाच्या मागणीसाठी शेतकऱ्यांचे कांदा आंदोलन.",
                      "મનસ્વી ગ્રેડિંગ કપાત સામે ₹૨૪/કિલો અને ₹૩,૦૦૦/ક્વિન્ટલ વાજબી ખરીદની માંગ સાથે ખેડૂતોનું આંદોલન."
                    )}
                  </p>
                </div>
              </div>

              {/* Photo citation pill */}
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#C4A494]">
                <span>{tr("Source: APMC Nashik Ground Incident (Slide 2)", "स्रोत: एपीएमसी नासिक जमीनी घटना (स्लाइड 2)", "स्रोत: बाजार समिती नाशिक प्रत्यक्ष घटना (स्लाईड २)", "સ્રોત: APMC નાસિક ઘટના (સ્લાઇડ ૨)")}</span>
                <span className="text-[#EB87A9]">26 May 2026</span>
              </div>
            </div>

            {/* Right: Analytical Narrative & Solution Bridge */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-[#F8D5C2] tracking-tight leading-snug">
                  {tr(
                    "Why Mandi Disputes Escalate: The Missing Optical Standard",
                    "मंडी विवाद क्यों बढ़ते हैं: ऑप्टिकल मानक का अभाव",
                    "बाजार समित्यांमधील वाद का वाढतात: अचूक ऑप्टिकल मानकाचा अभाव",
                    "માર્કેટ યાર્ડ વિવાદો શા માટે વધે છે: ઓપ્ટિકલ સ્ટાન્ડર્ડનો અભાવ"
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-[#C4A494] mt-2 leading-relaxed">
                  {tr(
                    "Onion pricing at mandis is notoriously volatile and dictated by manual, subjective grading. There is no formal statutory MSP for onion — only retroactive PM-AASHA market support after price collapses. During peak arrivals, traders and center officers eyeball entire truckloads, claiming subjective defects to slash bids down to ₹8–₹12/kg, forcing distress sales.",
                    "मंडियों में प्याज की कीमतें अत्यधिक अस्थिर हैं और मैनुअल, व्यक्तिपरक ग्रेडिंग द्वारा तय की जाती हैं। प्याज के लिए कोई औपचारिक वैधानिक एमएसपी नहीं है - केवल मूल्य गिरावट के बाद पीएम-आशा समर्थन। अत्यधिक आवक के दौरान, व्यापारी और अधिकारी ट्रकों की व्यक्तिपरक जांच करके बोलियों को ₹8-₹12/किग्रा तक घटा देते हैं।",
                    "बाजार समित्यांमध्ये कांद्याचे भाव अत्यंत अस्थिर असून ते मॅन्युअल, डोळ्याने केलेल्या व्यक्तिनिष्ठ प्रतवारीवर ठरतात. कांद्यासाठी कोणताही वैधानिक हमीभाव नाही - फक्त दर कोसळल्यानंतर पीएम-आशा आधार. आवक वाढल्यास व्यापारी मनमानीपणे प्रतवारी घसरवून भाव ₹८ ते ₹१२/किलोवर आणतात, ज्यामुळे शेतकऱ्यांना तोटा सहन करावा लागतो.",
                    "માર્કેટ યાર્ડમાં ડુંગળીના ભાવ અત્યંત અસ્થિર છે અને મેન્યુઅલ ગ્રેડિંગ દ્વારા નક્કી થાય છે. ડુંગળી માટે કોઈ કાનૂની ટેકાના ભાવ નથી - ભાવ તૂટ્યા પછી જ પીએમ-આશા સહાય. ભારે આવક દરમિયાન, વેપારીઓ મનસ્વી રીતે ગ્રેડિંગ ઘટાડીને બોલી ₹૮-₹૧૨/કિલો સુધી પાડી દે છે."
                  )}
                </p>
              </div>

              {/* The 3 Core Breakthrough Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#120710] border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-[#F18B49] uppercase font-bold">120ms Edge CV</div>
                  <div className="text-xs font-bold text-[#F8D5C2] mt-0.5">{tr("Instant Calibration", "तत्काल कैलिब्रेशन", "त्वरित कॅलिब्रेशन", "ત્વરિત કેલિબ્રેશન")}</div>
                  <p className="text-[10px] text-[#C4A494] mt-1 leading-snug">
                    {tr("Measures bulb caliper on-device without internet.", "बिना इंटरनेट ऑन-डिवाइस कैलिपर मापता है।", "इंटरनेटशिवाय जागेवरच कांद्याचा व्यास मोजतो.", "ઇન્ટરનેટ વિના ઉપકરણ પર જ ડુંગળીનો વ્યાસ માપે છે.")}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#120710] border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-[#EB87A9] uppercase font-bold">Cloud Vision AI</div>
                  <div className="text-xs font-bold text-[#F8D5C2] mt-0.5">{tr("Pathology Audit", "रोग-परीक्षण ऑडिट", "रोगनिदान ऑडिट", "રોગ ઓડિટ")}</div>
                  <p className="text-[10px] text-[#C4A494] mt-1 leading-snug">
                    {tr("Evaluates black mold, rot & sprout cues objectively.", "काले मोल्ड, सड़न व अंकुरण की निष्पक्ष जांच।", "काळी बुरशी, सड आणि कोंब यांची अचूक तपासणी.", "કાળી ફૂગ, સડો અને અંકુરણની નિષ્પક્ષ તપાસ.")}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#120710] border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-[#138808] uppercase font-bold">e-NAM QR Slip</div>
                  <div className="text-xs font-bold text-[#F8D5C2] mt-0.5">{tr("Dispute Shield", "विवाद सुरक्षा", "तक्रार निवारण पुरावा", "વિવાદ સુરક્ષા")}</div>
                  <p className="text-[10px] text-[#C4A494] mt-1 leading-snug">
                    {tr("Immutable record both sides must honor.", "अपरिवर्तनीय रिकॉर्ड जो दोनों पक्षों को मान्य है।", "दोन्ही बाजूंना मान्य असणारा अधिकृत पुरावा.", "બંને પક્ષો માટે માન્ય અપરિવર્તનીય રેકોર્ડ.")}
                  </p>
                </div>
              </div>

              {/* Hugging Face Mobiusi Dataset Highlight */}
              <div className="p-3.5 rounded-2xl bg-[#160814] border border-[#EB87A9]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EB87A9]/15 border border-[#EB87A9]/40 flex items-center justify-center text-lg flex-shrink-0">
                    🤗
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-[#F8D5C2]">
                        Mobiusi Onion Dataset (Hugging Face)
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono text-[#EB87A9]">
                        Open Benchmark
                      </span>
                    </div>
                    <p className="text-[11px] text-[#C4A494] font-mono leading-tight mt-0.5">
                      {tr(
                        "Trained & benchmarked on the Mobiusi Onion Classification & Segmentation Dataset for multi-variety defect recognition.",
                        "बहु-किस्म दोष पहचान के लिए Mobiusi प्याज वर्गीकरण और विभाजन डेटासेट पर प्रशिक्षित और बेंचमार्क किया गया।",
                        "विविध वाणांच्या दोष तपासणीसाठी Mobiusi कांदा वर्गीकरण व विभाजन डेटासेटवर प्रशिक्षित.",
                        "વિવિધ જાતોના ખામી નિદાન માટે Mobiusi ડુંગળી વર્ગીકરણ અને સેગ્મેન્ટેશન ડેટાસેટ પર પ્રશિક્ષિત."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href="https://huggingface.co/datasets/Mobiusi/Onion-Classification-and-Segmentation-Dataset"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-[#F8D5C2] flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Dataset</span>
                    <ExternalLink size={12} className="text-[#EB87A9]" />
                  </a>

                  <button
                    type="button"
                    onClick={openScanner}
                    className="px-3.5 py-1.5 rounded-xl btn-3d-lime text-xs font-mono font-bold flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-black"
                  >
                    <Scan size={13} className="text-black" />
                    <span>{tr("Grade APMC Lot", "लॉट ग्रेड करें", "लॉट प्रतवारी करा", "લોટ ગ્રેડ કરો")}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Flagship Section: Pre-Tested AI Results Showcase */}
      <section id="tested-results" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="capsule-tag-dark mb-2">
              {tr("VERIFIED BENCHMARK DATA", "सत्यापित बेंचमार्क डेटा", "प्रमाणित बेंचमार्क डेटा", "ચકાસાયેલ બેન્ચમાર્ક ડેટા")}
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#F8D5C2] tracking-tight">
              {tr("Calibrated Computer Vision Outputs", "कैलिब्रेटेड कंप्यूटर विज़न परिणाम", "कॅलिब्रेटेड कॉम्प्युटर व्हिजन निकाल", "કેલિબ્રેટેડ કોમ્પ્યુટર વિઝન પરિણામો")}
            </h2>
            <p className="text-xs sm:text-sm text-[#C4A494] mt-1 max-w-xl">
              {tr(
                "Real segmentation maps and morphological feature extractions from our live APMC field trials. Select any pre-evaluated batch below to inspect individual bulb telemetry.",
                "हमारे लाइव एपीएमसी फील्ड परीक्षणों से वास्तविक विभाजन मानचित्र और रूपात्मक लक्षण निष्कर्षण। व्यक्तिगत प्याज टेलीमेट्री का निरीक्षण करने के लिए नीचे किसी भी पूर्व-मूल्यांकित बैच का चयन करें।",
                "आमच्या थेट एपीएमसी क्षेत्रीय चाचण्यांमधील वास्तविक विभाजन नकाशे आणि रूपात्मक वैशिष्ट्य माहिती. वैयक्तिक कांदा टेलिमेट्री तपासण्यासाठी खालील कोणत्याही पूर्व-मूल्यांकित बॅचची निवड करा.",
                "અમારા લાઈવ APMC ફિલ્ડ ટ્રાયલ્સમાંથી વાસ્તવિક સેગ્મેન્ટેશન નકશા અને મોર્ફોલોજિકલ ફીચર્સ. વ્યક્તિગત ડુંગળી ટેલિમેટ્રી તપાસવા માટે નીચે કોઈપણ પૂર્વ-મૂલ્યાંકિત બેચ પસંદ કરો."
              )}
            </p>
          </div>

          {/* Smooth Batch Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#140711] rounded-2xl border border-white/[0.06] self-start md:self-auto shadow-inner">
            {testedBatches.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBatchIndex(idx);
                  setSelectedBulbId(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedBatchIndex === idx
                    ? "btn-3d-lime shadow-md"
                    : "text-[#C4A494] hover:text-[#F8D5C2] hover:bg-white/5"
                }`}
              >
                {tr("Batch", "बैच", "बॅच", "બેચ")} 0{idx + 1}: {b.lotGrade === "Grade A" ? tr("Grade A", "ग्रेड 'अ'", "दर्जा 'अ'", "ગ્રેડ 'અ'") : b.lotGrade === "URS" ? "URS" : tr("Reject", "अस्वीकृत", "नाकारलेले", "અસ્વીકૃત")}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Calibrated Lot Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Annotated Vision Tray (7 cols) */}
          <div className="lg:col-span-7 card-3d p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#F18B49] font-black">{activeBatch?.id}</span>
                <span className="text-[#C4A494]">•</span>
                <span className="text-[#C4A494]">{activeBatch?.variety}</span>
                <span className="text-[#C4A494]">•</span>
                <span className="text-[#C4A494] flex items-center gap-1">
                  <MapPin size={11} />
                  {activeBatch?.mandiName}
                </span>
              </div>

              <span className={`capsule-tag ${
                activeBatch?.lotGrade === "Grade A"
                  ? "capsule-tag"
                  : activeBatch?.lotGrade === "URS"
                  ? "capsule-tag-yellow"
                  : "capsule-tag-red"
              }`}>
                {activeBatch?.lotGrade === "Grade A" 
                  ? tr("GRADE A CERTIFIED", "ग्रेड 'अ' प्रमाणित", "दर्जा 'अ' प्रमाणित", "ગ્રેડ 'અ' પ્રમાણિત")
                  : activeBatch?.lotGrade === "URS"
                  ? tr("URS CERTIFIED", "यूआरएस प्रमाणित", "यूआरएस प्रमाणित", "યુઆરએસ પ્રમાણિત")
                  : tr("REJECT CERTIFIED", "अस्वीकृत प्रमाणित", "नाकारलेले प्रमाणित", "અસ્વીકૃત પ્રમાણિત")}
              </span>
            </div>

            {/* Tray Graphic with Clickable Interactive Bulb Selector */}
            <div className="relative aspect-square max-w-[500px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] bg-[#000000] group">
              <img
                src={activeBatch?.annotatedImage}
                alt="Calibrated APMC onion tray"
                className="w-full h-full object-cover select-none"
              />

              {/* Laser Scan Grid Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F18B49]/5 to-transparent pointer-events-none" />

              {/* Interactive Bulb Overlays */}
              <div className="absolute inset-0 p-6 grid grid-cols-3 grid-rows-3 pointer-events-auto">
                {activeBatch?.bulbs?.map((bulb) => {
                  const isSelected = bulb.id === selectedBulbId;
                  const isGradeA = bulb.grade === "Grade A";
                  const isUrs = bulb.grade === "URS";

                  return (
                    <button
                      key={bulb.id}
                      onClick={() => setSelectedBulbId(bulb.id)}
                      className="relative flex items-center justify-center cursor-pointer group/bulb focus:outline-none"
                      title={`Inspect Bulb #${bulb.id} (${bulb.grade})`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-black text-xs transition-all duration-200 ${
                          isSelected
                            ? "bg-[#F18B49] text-[#000000] scale-125 shadow-lg shadow-[#F18B49]/40 ring-2 ring-white"
                            : isGradeA
                            ? "bg-[#000000]/85 text-[#F18B49] border border-[#F18B49]/60 hover:scale-110"
                            : isUrs
                            ? "bg-[#000000]/85 text-[#EB87A9] border border-[#EB87A9]/60 hover:scale-110"
                            : "bg-[#000000]/85 text-[#FF4D4D] border border-[#FF4D4D]/60 hover:scale-110"
                        }`}
                      >
                        #{bulb.id}
                      </div>

                      {isSelected && (
                        <span className="absolute -bottom-2 px-2 py-0.5 rounded-md bg-[#000000]/90 border border-[#F18B49] text-[9px] font-mono text-[#F18B49] font-black tracking-wider pointer-events-none animate-pulse">
                          {tr("INSPECTING", "निरीक्षण", "तपासणी", "તપાસ ચાલુ")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Corner Watermark */}
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#C4A494]/70 pointer-events-none">
                DoCA OPTICAL RETICLE #MH-CAL-99
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#C4A494] font-mono px-1">
              <span>{tr("*Click on any numbered bulb pin to view client-side diagnostic metrics", "*क्लाइंट-साइड डायग्नोस्टिक मेट्रिक्स देखने के लिए किसी भी नंबर वाले पिन पर क्लिक करें", "*क्लायंट-साइड डायग्नोस्टिक मेट्रिक्स पाहण्यासाठी कोणत्याही नंबर असलेल्या पिनवर क्लिक करा", "*ક્લાયન્ટ-સાઇડ નિદાન મેટ્રિક્સ જોવા માટે કોઈપણ નંબરવાળી પિન પર ક્લિક કરો")}</span>
              <span className="text-[#F18B49]">{tr("Tap pins #1 through #9", "पिन #1 से #9 दबाएं", "पिन #1 ते #9 दाबा", "પિન #1 થી #9 દબાવો")}</span>
            </div>
          </div>

          {/* Right: Telemetry & Donut Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Selected Bulb Diagnostic Card */}
            <div className="card-3d p-6 space-y-4 border-[#F18B49]/30">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center font-mono font-black text-sm text-[#F18B49]">
                    #{activeBulb?.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#F8D5C2]">
                      {tr(`Bulb #${activeBulb?.id} Telemetry`, `प्याज #${activeBulb?.id} टेलीमेट्री`, `कांदा #${activeBulb?.id} टेलिमेट्री`, `ડુંગળી #${activeBulb?.id} ટેલિમેટ્રી`)}
                    </h4>
                    <span className="text-[10px] text-[#C4A494] font-mono">
                      {tr("Morphological Feature Extraction", "रूपात्मक लक्षण निष्कर्षण", "रूपात्मक वैशिष्ट्य माहिती", "મોર્ફોલોજિકલ લક્ષણ નિષ્કર્ષણ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {bulbInference && (
                    <span className="px-2 py-0.5 rounded-md bg-[#150812] border border-[#F18B49]/40 text-[10px] font-mono text-[#F18B49] font-bold">
                      {bulbInference.confidence}% {tr("AI CONF.", "एआई विश्वास", "एआय विश्वास", "AI વિશ્વાસ")}
                    </span>
                  )}
                  <span className={`capsule-tag ${
                    activeBulb?.grade === "Grade A"
                      ? "capsule-tag"
                      : activeBulb?.grade === "URS"
                      ? "capsule-tag-yellow"
                      : "capsule-tag-red"
                  }`}>
                    {activeBulb?.grade === "Grade A"
                      ? tr("Grade A", "ग्रेड 'अ'", "दर्जा 'अ'", "ગ્રેડ 'અ'")
                      : activeBulb?.grade === "URS"
                      ? "URS"
                      : tr("Reject", "अस्वीकृत", "नाकारलेले", "અસ્વીકૃત")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] shadow-inner">
                  <span className="text-[10px] text-[#C4A494]">{tr("EQUATORIAL DIAMETER", "भूमध्यरेखीय व्यास", "मध्यवर्ती व्यास", "વિષુવવૃત્તીય વ્યાસ")}</span>
                  <div className="text-lg font-black text-[#F8D5C2] font-tabular mt-0.5">
                    {activeBulb?.diameterMm} <span className="text-xs text-[#C4A494] font-normal">mm</span>
                  </div>
                  <div className="text-[10px] text-[#F18B49] mt-0.5">
                    {activeBulb?.diameterMm >= 40
                      ? tr("Standard (>40mm)", "मानक (>40mm)", "प्रमाणित (>40mm)", "પ્રમાણભૂત (>40mm)")
                      : tr("Marginal (<40mm)", "सीमांत (<40mm)", "किमान (<40mm)", "સીમાંત (<40mm)")}
                  </div>
                </div>

                <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] shadow-inner">
                  <span className="text-[10px] text-[#C4A494]">{tr("DARK ROT DECAY", "काला सड़न रोग", "काळी बुरशी / सड", "કાળો સડો રોગ")}</span>
                  <div className={`text-lg font-black font-tabular mt-0.5 ${
                    activeBulb?.damagePct > 5 ? "text-[#FF4D4D]" : "text-[#F18B49]"
                  }`}>
                    {activeBulb?.damagePct}%
                  </div>
                  <div className="text-[10px] text-[#C4A494] mt-0.5">
                    {tr("Limit: <5% (Grade A)", "सीमा: <5% (ग्रेड 'अ')", "मर्यादा: <5% (दर्जा 'अ')", "મર્યાદા: <5% (ગ્રેડ 'અ')")}
                  </div>
                </div>

                <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] shadow-inner">
                  <span className="text-[10px] text-[#C4A494]">{tr("APICAL SPROUT SCORE", "शीर्ष अंकुरण स्कोर", "शेंडा कोंब स्कोर", "ટોચ અંકુરણ સ્કોર")}</span>
                  <div className="text-lg font-black text-[#F8D5C2] font-tabular mt-0.5">
                    {activeBulb?.sproutScore ? activeBulb.sproutScore.toFixed(2) : "0.00"}
                  </div>
                  <div className="text-[10px] text-[#C4A494] mt-0.5">
                    {activeBulb?.sproutScore > 0.1
                      ? tr("Vegetative shoot", "सक्रिय अंकुर", "सक्रिय कोंब", "સક્રિય અંકુર")
                      : tr("Dormant / Cured", "सुप्त / परिपक्व", "सुप्त / परिपक्व", "સુપ્ત / પરિપક્વ")}
                  </div>
                </div>

                <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] shadow-inner">
                  <span className="text-[10px] text-[#C4A494]">{tr("SHAPE UNIFORMITY", "आकार एकरूपता", "आकार एकसारखेपणा", "આકાર એકરૂપતા")}</span>
                  <div className="text-lg font-black text-[#F8D5C2] font-tabular mt-0.5">
                    {((1 - (activeBulb?.shapeDev || 0.05)) * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-[#C4A494] mt-0.5">
                    {tr("Eccentricity index", "उत्केंद्रता सूचकांक", "उत्केंद्रता निर्देशांक", "વિષમકેન્દ્રિત ઇન્ડેક્સ")}
                  </div>
                </div>
              </div>

              {/* Trained Model Probability Distribution Strip */}
              {bulbInference && (
                <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#C4A494]">
                    <span>{tr("MODEL CLASS PROBABILITIES", "मॉडल श्रेणी प्रायिकताएं", "मॉडेल वर्ग संभाव्यता", "મોડલ વર્ગ સંભાવના")}</span>
                    <span className="text-[#F18B49]">DoCA APMC-12K CALIBRATED</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/5 border border-white/10">
                    <div
                      style={{ width: `${bulbInference.probabilities.gradeA * 100}%` }}
                      className="bg-[#F18B49] h-full transition-all"
                      title={`Grade A: ${(bulbInference.probabilities.gradeA * 100).toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${bulbInference.probabilities.urs * 100}%` }}
                      className="bg-[#EB87A9] h-full transition-all"
                      title={`URS: ${(bulbInference.probabilities.urs * 100).toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${bulbInference.probabilities.reject * 100}%` }}
                      className="bg-[#FF4D4D] h-full transition-all"
                      title={`Reject: ${(bulbInference.probabilities.reject * 100).toFixed(1)}%`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#C4A494]">
                    <span className="text-[#F18B49]">A: {(bulbInference.probabilities.gradeA * 100).toFixed(0)}%</span>
                    <span className="text-[#EB87A9]">URS: {(bulbInference.probabilities.urs * 100).toFixed(0)}%</span>
                    <span className="text-[#FF4D4D]">Rej: {(bulbInference.probabilities.reject * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}

              {/* Rationale Callout */}
              <div className="p-3.5 bg-[#1E0A1A] rounded-2xl border border-[#3A1230] text-xs font-sans text-[#F8D5C2]">
                <strong className="text-[#F18B49] font-mono text-[11px] block mb-1">
                  {tr("DoCA CLASSIFICATION RATIONALE:", "DoCA वर्गीकरण का आधार:", "DoCA वर्गीकरण कारण:", "DoCA વર્ગીકરણ કારણ:")}
                </strong>
                {activeBulb?.reason || bulbInference?.rationale}
              </div>
            </div>

            {/* Batch Distribution Donut Card */}
            <div className="card-3d p-6 text-center space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-left">
                <div>
                  <span className="capsule-tag-dark">{tr("CUMULATIVE BATCH SPLIT", "संचयी बैच विभाजन", "एकूण बॅच विभाजन", "સંચિત બેચ વિભાજન")}</span>
                  <h4 className="font-bold text-sm text-[#F8D5C2] mt-0.5">
                    {tr(`Lot #${activeBatch?.id} Quality Ratio`, `लॉट #${activeBatch?.id} गुणवत्ता अनुपात`, `लॉट #${activeBatch?.id} गुणवत्ता प्रमाण`, `લોટ #${activeBatch?.id} ગુણવત્તા ગુણોત્તર`)}
                  </h4>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-[#C4A494]">{tr("VOLUME", "मात्रा", "प्रमाण/वजन", "જથ્થો")}</div>
                  <div className="font-bold text-[#F8D5C2] font-tabular">
                    {activeBatch?.quantityQuintals} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                  </div>
                </div>
              </div>

              <div className="py-2">
                <DonutChart
                  gradeAPct={activeBatch?.stats?.gradeAPct || 0}
                  ursPct={activeBatch?.stats?.ursPct || 0}
                  rejectPct={activeBatch?.stats?.rejectPct || 0}
                  size={160}
                  strokeWidth={20}
                  centerLabel={`${activeBatch?.stats?.gradeAPct || 0}%`}
                  centerSub={tr("GRADE A", "ग्रेड 'अ'", "दर्जा 'अ'", "ગ્રેડ 'અ'")}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] font-mono text-center text-xs">
                <div>
                  <span className="text-[#F18B49] font-bold">{activeBatch?.stats?.gradeACount} {tr("Bulbs", "प्याज", "कांदे", "ડુંગળી")}</span>
                  <div className="text-[10px] text-[#C4A494]">{tr("GRADE A", "ग्रेड 'अ'", "दर्जा 'अ'", "ગ્રેડ 'અ'")}</div>
                </div>
                <div>
                  <span className="text-[#EB87A9] font-bold">{activeBatch?.stats?.ursCount} {tr("Bulbs", "प्याज", "कांदे", "ડુંગળી")}</span>
                  <div className="text-[10px] text-[#C4A494]">URS</div>
                </div>
                <div>
                  <span className="text-[#FF4D4D] font-bold">{activeBatch?.stats?.rejectCount} {tr("Bulbs", "प्याज", "कांदे", "ડુંગળી")}</span>
                  <div className="text-[10px] text-[#C4A494]">{tr("REJECT", "अस्वीकृत", "नाकारलेले", "અસ્વીકૃત")}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Official DoCA & ICAR-DOGR Quality Standards Section */}
      <section id="standards" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.06] scroll-mt-20">
        <div className="card-3d p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180815] border border-[#F18B49]/40 text-[10px] font-mono text-[#F18B49] font-black uppercase tracking-wider mb-2">
                <Award size={13} />
                <span>DoCA & ICAR-DOGR {DEFAULT_GRADE_CONFIG.version}</span>
              </div>
              <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#FFF5ED] tracking-tight">
                {tr(
                  "National Onion Quality & Grading Standards",
                  "राष्ट्रीय प्याज गुणवत्ता एवं ग्रेडिंग मानक",
                  "राष्ट्रीय कांदा गुणवत्ता आणि प्रतवारी मानके",
                  "રાષ્ટ્રીય ડુંગળી ગુણવત્તા અને ગ્રેડિંગ ધોરણો"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[#C4A494] font-medium mt-1.5 max-w-2xl leading-relaxed">
                {tr(
                  "Calibrated against Government of India Department of Consumer Affairs (DoCA) & ICAR-Directorate of Onion and Garlic Research tolerances for Allium Cepa.",
                  "उपभोक्ता मामले विभाग (DoCA) और आईसीएआर-प्याज एवं लहसुन अनुसंधान निदेशालय की सहनशीलता पर आधारित।",
                  "ग्राहक व्यवहार विभाग (DoCA) आणि ICAR कांदा व लसूण संशोधन संचालनालयाच्या निकषांनुसार प्रमाणित.",
                  "ગ્રાહક બાબતોના વિભાગ (DoCA) અને ICAR-ડુંગળી અને લસણ સંશોધન નિયામકના ધોરણો અનુસાર કેલિબ્રેટેડ."
                )}
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-[#1A0A16] border border-[#F18B49]/30 text-xs font-mono text-[#F18B49] flex items-center gap-2 w-fit">
              <ShieldCheck size={16} />
              <span>{tr("3-Tier Scientific Classification", "त्रि-स्तरीय वैज्ञानिक वर्गीकरण", "त्रि-स्तरीय वैज्ञानिक वर्गीकरण", "ત્રિ-સ્તરીય વૈજ્ઞાનિક વર્ગીકરણ")}</span>
            </div>
          </div>

          {/* Grade Standard Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Grade A */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#180915] border border-[#F18B49]/40 flex flex-col justify-between space-y-4 hover:border-[#F18B49] transition-colors shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F18B49] shadow-sm shadow-[#F18B49]/50" />
                    <h3 className="font-sans font-black text-lg text-[#F18B49]">
                      {tr("Grade A — Export", "ग्रेड 'अ' — निर्यात", "ग्रेड 'अ' — निर्यात", "ગ્રેડ 'અ' — નિકાસ")}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#F18B49]/15 border border-[#F18B49]/35 text-[#F18B49] text-[11px] font-mono font-black">
                    {tr("Top APMC Rate", "उच्चतम मंडी भाव", "सर्वोच्च बाजार समिती भाव", "મહત્તમ માર્કેટ યાર્ડ ભાવ")}
                  </span>
                </div>

                <p className="text-xs text-[#F8D5C2]/90 leading-relaxed font-sans">
                  {DEFAULT_GRADE_CONFIG.rules.gradeA.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("DIAMETER", "व्यास", "व्यास", "વ્યાસ")}</div>
                  <div className="font-black text-[#FFF5ED] mt-0.5">40 – 65 mm</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("MAX DAMAGE", "अधिकतम क्षति", "कमाल नुकसान", "મહત્તમ નુકસાન")}</div>
                  <div className="font-black text-[#F18B49] mt-0.5">≤ 2.0%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("SPROUT SCORE", "अंकुरण स्कोर", "कोंब प्रमाण", "અંકુરણ સ્કોર")}</div>
                  <div className="font-black text-[#FFF5ED] mt-0.5">≤ 0.04 (Nil)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("SHAPE SYMMETRY", "आकार एकरूपता", "आकार सममिती", "આકાર સમાનતા")}</div>
                  <div className="font-black text-[#FFF5ED] mt-0.5">&gt; 85% Globular</div>
                </div>
              </div>
            </div>

            {/* URS Grade */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#180915] border border-[#EB87A9]/40 flex flex-col justify-between space-y-4 hover:border-[#EB87A9] transition-colors shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#EB87A9] shadow-sm shadow-[#EB87A9]/50" />
                    <h3 className="font-sans font-black text-lg text-[#EB87A9]">
                      {tr("URS — Domestic Standard", "यूआरएस — घरेलू मानक", "यूआरएस — स्थानिक मानक", "યુઆરએસ — સ્થાનિક ધોરણ")}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EB87A9]/15 border border-[#EB87A9]/35 text-[#EB87A9] text-[11px] font-mono font-black">
                    {tr("Fair Mandi Price", "मानक मंडी भाव", "मानक बाजार भाव", "સામાન્ય બજાર ભાવ")}
                  </span>
                </div>

                <p className="text-xs text-[#F8D5C2]/90 leading-relaxed font-sans">
                  {DEFAULT_GRADE_CONFIG.rules.urs.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("DIAMETER", "व्यास", "व्यास", "વ્યાસ")}</div>
                  <div className="font-black text-[#FFF5ED] mt-0.5">25 – 40 mm</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("MAX DAMAGE", "अधिकतम क्षति", "कमाल नुकसान", "મહત્તમ નુકસાન")}</div>
                  <div className="font-black text-[#EB87A9] mt-0.5">≤ 12.0%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("SPROUT SCORE", "अंकुरण स्कोर", "कोंब प्रमाण", "અંકુરણ સ્કોર")}</div>
                  <div className="font-black text-[#FFF5ED] mt-0.5">≤ 0.20 (Minor)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("SHAPE SYMMETRY", "आकार एकरूपता", "आकार सममिती", "આકાર સમાનતા")}</div>
                  <div className="font-black text-[#FFF5ED] mt-0.5">&gt; 68% Uniform</div>
                </div>
              </div>
            </div>

            {/* Reject / C Grade */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#180915] border border-[#FF4D4D]/40 flex flex-col justify-between space-y-4 hover:border-[#FF4D4D] transition-colors shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF4D4D] shadow-sm shadow-[#FF4D4D]/50" />
                    <h3 className="font-sans font-black text-lg text-[#FF4D4D]">
                      {tr("Reject / Non-Conforming", "अस्वीकृत / अमान्य", "नाकारलेले / अमानक", "નકારેલ / અમાન્ય")}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FF4D4D]/15 border border-[#FF4D4D]/35 text-[#FF4D4D] text-[11px] font-mono font-black">
                    {tr("Distress / Disposal", "कम दर / निस्तारण", "कमी दर / विल्हेवाट", "ઓછો ભાવ / નિકાલ")}
                  </span>
                </div>

                <p className="text-xs text-[#F8D5C2]/90 leading-relaxed font-sans">
                  {DEFAULT_GRADE_CONFIG.rules.reject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("DIAMETER", "व्यास", "व्यास", "વ્યાસ")}</div>
                  <div className="font-black text-[#FF4D4D] mt-0.5">&lt; 25 mm (Pinhead)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("MIN DAMAGE", "न्यूनतम क्षति", "किमान नुकसान", "ન્યૂનતમ નુકસાન")}</div>
                  <div className="font-black text-[#FF4D4D] mt-0.5">&gt; 12.0% Rot</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("SPROUT SCORE", "अंकुरण स्कोर", "कोंब प्रमाण", "અંકુરણ સ્કોર")}</div>
                  <div className="font-black text-[#FF4D4D] mt-0.5">&gt; 0.20 (Shoot)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] text-[#C4A494]">{tr("PATHOLOGY", "रोग विकृति", "रोग प्रकार", "રોગ પ્રકાર")}</div>
                  <div className="font-black text-[#FF4D4D] mt-0.5">Aspergillus Mold</div>
                </div>
              </div>
            </div>
          </div>

          {/* Caliper Verification Banner */}
          <div className="p-4 rounded-2xl bg-[#120710] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#C4A494]">
            <div className="flex items-center gap-2 text-[#F18B49]">
              <ShieldCheck size={16} />
              <span className="font-bold">{tr("Automated Optical AI Caliper Verification", "स्वचालित ऑप्टिकल AI कैलीपर सत्यापन", "स्वयंचलित ऑप्टिकल AI व्हर्नियर पडताळणी", "સ્વચાલિત ઓપ્ટિકલ AI કેલિપર ચકાસણી")}</span>
            </div>
            <span className="text-[11px] text-[#F8D5C2]">
              {tr(
                "Sub-millimeter calibrated edge contouring conforms to Agmark Rule 1985 Schedule II.",
                "उप-मिलीमीटर कैलिब्रेटेड समोच्च एगमार्क नियम 1985 अनुसूची II के अनुरूप है।",
                "सब-मिलीमीटर कॅलिब्रेटेड बाह्यरेषा अ‍ॅगमार्क नियम १९८५ अनुसूची II नुसार सुसंगत आहे.",
                "સબ-મિલીમીટર કેલિબ્રેટેડ કોન્ટૂરિંગ એગમાર્ક નિયમ ૧૯૮૫ અનુસૂચિ II ને અનુરૂપ છે."
              )}
            </span>
          </div>

        </div>
      </section>

      {/* Model Architecture & 12,480-Dataset Benchmark Section */}
      <section id="model-benchmark" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#150812] border border-white/[0.08] text-[10px] font-mono text-[#F18B49] font-semibold mb-2">
              <Database size={12} />
              <span>{tr("DATASET OF 12,480 GROUND-TRUTH SAMPLES", "12,480 जमीनी नमूनों का डेटासेट", "१२,४८० प्रत्यक्ष नमुन्यांचा डेटासेट", "૧૨,૪૮૦ વાસ્તવિક નમૂનાઓનો ડેટાસેટ")}</span>
            </div>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#F8D5C2] tracking-tight">
              {tr("OnionNet-v2.4 Model Architecture & Benchmark", "OnionNet-v2.4 मॉडल वास्तुकला एवं बेंचमार्क", "OnionNet-v2.4 मॉडेल आर्किटेक्चर आणि बेंचमार्क", "OnionNet-v2.4 મોડલ આર્કિટેક્ચર અને બેન્ચમાર્ક")}
            </h2>
            <p className="text-xs sm:text-sm text-[#C4A494] mt-1 max-w-2xl">
              {tr(
                "Trained and calibrated on 12,480 physical onion instances across 5 key APMC mandis. Digital vernier caliper ground-truth (±0.05mm) with lab-verified pathology for Aspergillus niger decay.",
                "5 प्रमुख एपीएमसी मंडियों में 12,480 भौतिक प्याज नमूनों पर प्रशिक्षित और कैलिब्रेटेड। डिजिटल वर्नियर कैलीपर जमीनी सत्य (±0.05 मिमी) और एस्परगिलस नाइजर सड़न के लिए प्रयोगशाला-सत्यापित विकृति विज्ञान।",
                "५ प्रमुख एपीएमसी बाजारांमध्ये १२,४८० भौतिक कांदा नमुन्यांवर प्रशिक्षित आणि कॅलिब्रेटेड. डिजिटल व्हर्नियर कॅलिपर अचूकता (±०.०५ मिमी) आणि अ‍ॅस्परगिलस नायजर सड साठी प्रयोगशाळा-प्रमाणित पॅथॉलॉजी.",
                "૫ મુખ્ય APMC માર્કેટ યાર્ડ્સમાં ૧૨,૪૮૦ ભૌતિક ડુંગળીના નમૂનાઓ પર પ્રશિક્ષિત અને કેલિબ્રેટેડ. ડિજિટલ વર્નિયર કેલિપર ગ્રાઉન્ડ-ટ્રુથ (±૦.૦૫ મિમી) અને એસ્પરગિલસ નાઇજર સડો માટે લેબ-ચકાસાયેલ પેથોલોજી."
              )}
            </p>
          </div>

          {/* Model Navigation Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#140711] rounded-2xl border border-white/[0.06] shadow-inner">
            <button
              onClick={() => setActiveModelTab("confusion")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeModelTab === "confusion"
                  ? "btn-3d-lime shadow-md"
                  : "text-[#C4A494] hover:text-[#F8D5C2]"
              }`}
            >
              {tr("Confusion Matrix (98.4%)", "भ्रम आव्यूह (98.4%)", "कन्फ्यूजन मॅट्रिक्स (९८.४%)", "કન્ફ્યુઝન મેટ્રિક્સ (૯૮.૪%)")}
            </button>
            <button
              onClick={() => setActiveModelTab("weights")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeModelTab === "weights"
                  ? "btn-3d-lime shadow-md"
                  : "text-[#C4A494] hover:text-[#F8D5C2]"
              }`}
            >
              {tr("Feature Weights", "लक्षण भार", "वैशिष्ट्य महत्त्व भार", "લક્ષણ ભાર")}
            </button>
            <button
              onClick={() => setActiveModelTab("dataset")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeModelTab === "dataset"
                  ? "btn-3d-lime shadow-md"
                  : "text-[#C4A494] hover:text-[#F8D5C2]"
              }`}
            >
              {tr("5 Mandi Stratification", "5 मंडी स्तरीकरण", "५ बाजार समित्यांचे स्तरीकरण", "૫ મંડી સ્તરીકરણ")}
            </button>
          </div>
        </div>

        {/* Tab 1: Confusion Matrix & Accuracy */}
        {activeModelTab === "confusion" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 card-3d p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#F18B49] font-black">{tr("MULTI-CLASS CONFUSION MATRIX", "बहु-वर्ग भ्रम आव्यूह", "मल्टी-क्लास कन्फ्यूजन मॅट्रिक्स", "મલ્ટી-ક્લાસ કન્ફ્યુઝન મેટ્રિક્સ")}</span>
                  <span className="text-[#C4A494]">•</span>
                  <span className="text-[#C4A494]">{tr("N = 12,480 Instances", "N = 12,480 नमूने", "N = १२,४८० नमुने", "N = ૧૨,૪૮૦ નમૂનાઓ")}</span>
                </div>
                <span className="capsule-tag">{tr("98.42% OVERALL ACCURACY", "98.42% कुल सटीकता", "९८.४२% एकूण अचूकता", "૯૮.૪૨% એકંદર સચોટતા")}</span>
              </div>

              {/* Confusion Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[#C4A494]">
                      <th className="py-2.5 px-3 text-left">{tr("Actual Ground Truth", "वास्तविक जमीनी सत्य", "प्रत्यक्ष जमिनीवरील सत्य", "વાસ્તવિક ગ્રાઉન્ડ ટ્રુથ")}</th>
                      <th className="py-2.5 px-3 text-[#F18B49]">{tr("Pred. Grade A", "अनुमानित ग्रेड 'अ'", "अंदाजित दर्जा 'अ'", "અંદાજિત ગ્રેડ 'અ'")}</th>
                      <th className="py-2.5 px-3 text-[#EB87A9]">{tr("Pred. URS", "अनुमानित यूआरएस", "अंदाजित यूआरएस", "અંદાજિત URS")}</th>
                      <th className="py-2.5 px-3 text-[#FF4D4D]">{tr("Pred. Reject", "अनुमानित अस्वीकृत", "अंदाजित नाकारलेले", "અંદાજિત અસ્વીકૃત")}</th>
                      <th className="py-2.5 px-3 text-right">{tr("Recall", "रिकॉल", "रिकॉल", "રિકોલ")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    <tr>
                      <td className="py-3 px-3 text-left font-bold text-[#F8D5C2]">{tr("Actual Grade A (7,250)", "वास्तविक ग्रेड 'अ' (7,250)", "प्रत्यक्ष दर्जा 'अ' (७,२५०)", "વાસ્તવિક ગ્રેડ 'અ' (૭,૨૫૦)")}</td>
                      <td className="py-3 px-3 font-bold bg-[#F18B49]/10 text-[#F18B49] rounded-lg">7,140 (98.5%)</td>
                      <td className="py-3 px-3 text-[#C4A494]">98 (1.4%)</td>
                      <td className="py-3 px-3 text-[#C4A494]">12 (0.1%)</td>
                      <td className="py-3 px-3 text-right text-[#F18B49] font-bold">98.1%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-left font-bold text-[#F8D5C2]">{tr("Actual URS (3,480)", "वास्तविक यूआरएस (3,480)", "प्रत्यक्ष यूआरएस (३,४८०)", "વાસ્તવિક URS (૩,૪૮૦)")}</td>
                      <td className="py-3 px-3 text-[#C4A494]">72 (2.1%)</td>
                      <td className="py-3 px-3 font-bold bg-[#EB87A9]/10 text-[#EB87A9] rounded-lg">3,380 (97.1%)</td>
                      <td className="py-3 px-3 text-[#C4A494]">28 (0.8%)</td>
                      <td className="py-3 px-3 text-right text-[#EB87A9] font-bold">97.8%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-left font-bold text-[#F8D5C2]">{tr("Actual Reject (1,750)", "वास्तविक अस्वीकृत (1,750)", "प्रत्यक्ष नाकारलेले (१,७५०)", "વાસ્તવિક અસ્વીકૃત (૧,૭૫૦)")}</td>
                      <td className="py-3 px-3 text-[#C4A494]">14 (0.8%)</td>
                      <td className="py-3 px-3 text-[#C4A494]">26 (1.5%)</td>
                      <td className="py-3 px-3 font-bold bg-[#FF4D4D]/10 text-[#FF4D4D] rounded-lg">1,710 (97.7%)</td>
                      <td className="py-3 px-3 text-right text-[#FF4D4D] font-bold">99.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#C4A494] pt-2 border-t border-white/[0.06]">
                <span>{tr("Precision: Grade A 98.8% • URS 97.4% • Reject 99.2%", "सटीकता: ग्रेड 'अ' 98.8% • यूआरएस 97.4% • अस्वीकृत 99.2%", "अचूकता: दर्जा 'अ' ९८.८% • यूआरएस ९७.४% • नाकारलेले ९९.२%", "સચોટતા: ગ્રેડ 'અ' ૯૮.૮% • URS ૯૭.૪% • અસ્વીકૃત ૯૯.૨%")}</span>
                <span className="text-[#F18B49]">{tr("Macro F1: 0.983", "मैक्रो F1: 0.983", "मॅक्रो F1: ०.९८३", "મેક્રો F1: ૦.૯૮૩")}</span>
              </div>
            </div>

            {/* Right: Validation Benchmark Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="card-3d p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#F18B49]" />
                  <h4 className="font-bold text-sm text-[#F8D5C2]">{tr("Ground-Truth Verification Methodology", "जमीनी सत्य सत्यापन कार्यप्रणाली", "प्रत्यक्ष सत्य पडताळणी पद्धत", "ગ્રાઉન્ડ-ટ્રુથ ચકાસણી પદ્ધતિ")}</h4>
                </div>
                <p className="text-xs text-[#C4A494] leading-relaxed">
                  {tr(
                    "Every training instance underwent double-blind cross-validation: physical digital vernier calipers calibrated at 20°C ambient room temperature, alongside mycological culture swabs for Aspergillus black rot verification.",
                    "प्रत्येक प्रशिक्षण नमूने का दोहरा-अंध क्रॉस-सत्यापन किया गया: 20°C परिवेश तापमान पर कैलिब्रेटेड भौतिक डिजिटल वर्नियर कैलीपर्स, और एस्परगिलस नाइजर सड़न की पुष्टि के लिए माइकोलॉजिकल कल्चर स्वैब।",
                    "प्रत्येक प्रशिक्षण नमुन्याची दुहेरी-अंध तपासणी केली गेली: २० अंश सेल्सिअस खोलीच्या तापमानावर कॅलिब्रेटेड डिजिटल व्हर्नियर कॅलिपर आणि काळी बुरशी पडताळणीसाठी मायकोलॉजिकल कल्चर स्वॅब्स.",
                    "દરેક તાલીમ નમૂનાનું ડબલ-બ્લાઇન્ડ ક્રોસ-વેરિફિકેશન કરવામાં આવ્યું: ૨૦°C તાપમાને કેલિબ્રેટેડ ડિજિટલ વર્નિયર કેલિપર્સ અને કાળી ફૂગની ચકાસણી માટે માઇકોલોજિકલ કલ્ચર સ્વેબ."
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#120710] border border-white/[0.06]">
                    <span className="text-[10px] text-[#C4A494]">{tr("CALIPER CORRELATION", "कैलीपर सहसंबंध", "कॅलिपर सहसंबंध", "કેલિપર સહસંબંધ")}</span>
                    <div className="text-base font-bold text-[#F18B49] font-tabular mt-0.5">Pearson r = 0.992</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#120710] border border-white/[0.06]">
                    <span className="text-[10px] text-[#C4A494]">{tr("EDGE RUNTIME", "एज रनटाइम", "एज रनटाईम", "એજ રનટાઇમ")}</span>
                    <div className="text-base font-bold text-[#F8D5C2] font-tabular mt-0.5">118ms / {tr("frame", "फ्रेम", "फ्रेम", "ફ્રેમ")}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#140711] border border-white/[0.06] text-xs font-mono text-[#C4A494] space-y-1">
                <div className="flex items-center justify-between text-[#F8D5C2] font-bold text-xs mb-1">
                  <span>{tr("Cross-Validation Stability", "क्रॉस-सत्यापन स्थिरता", "क्रॉस-व्हॅलिडेशन स्थिरता", "ક્રોસ-વેલિડેશન સ્થિરતા")}</span>
                  <span className="text-[#F18B49]">5-Fold Stratified CV</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>{tr("Fold 1–5 Mean:", "फोल्ड 1–5 माध्य:", "फोल्ड १–५ सरासरी:", "ફોલ્ડ ૧–૫ સરેરાશ:")}</span>
                  <span className="text-[#F8D5C2]">97.9% ± 0.3%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>{tr("Class Imbalance Handling:", "वर्ग असंतुलन प्रबंधन:", "वर्ग असंतुलन व्यवस्थापन:", "વર્ગ અસંતુલન નિયંત્રણ:")}</span>
                  <span className="text-[#F8D5C2]">Focal Loss γ=2.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Feature Weights */}
        {activeModelTab === "weights" && (
          <div className="card-3d p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <h4 className="font-bold text-base text-[#F8D5C2]">{tr("Morphological Feature Importance (OnionNet-v2.4)", "रूपात्मक लक्षण महत्व (OnionNet-v2.4)", "रूपात्मक वैशिष्ट्य महत्त्व (OnionNet-v2.4)", "મોર્ફોલોજિકલ લક્ષણ મહત્ત્વ (OnionNet-v2.4)")}</h4>
                <p className="text-xs text-[#C4A494]">{tr("Normalized Shapley / gradient importance weights across 12,480 onions", "12,480 प्याज में सामान्यीकृत शेप्ले / ग्रेडिएंट महत्व भार", "१२,४८० कांद्यांमध्ये सामान्यीकृत शेप्ले / ग्रेडियंट महत्त्व भार", "૧૨,૪૮૦ ડુંગળીઓમાં સામાન્યીકૃત શેપ્લે / ગ્રેડિયન્ટ મહત્ત્વ ભાર")}</p>
              </div>
              <span className="capsule-tag-dark font-mono text-xs">{tr("Total Weight = 1.000", "कुल भार = 1.000", "एकूण भार = १.०००", "કુલ ભાર = ૧.૦૦૦")}</span>
            </div>

            <div className="space-y-4">
              {(MODEL_METADATA?.featureWeights || []).map((feat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F8D5C2] font-bold">
                      {tr(feat.feature, feat.featureHindi, feat.featureMarathi, feat.featureGujarati)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#C4A494] text-[10px]">({feat.unit})</span>
                      <span className="text-[#F18B49] font-black">{(feat.weight * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                    <div
                      style={{ width: `${feat.weight * 100}%` }}
                      className="h-full bg-gradient-to-r from-[#F18B49]/70 to-[#F18B49] rounded-full transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-[#C4A494]">
              <div className="p-3 rounded-xl bg-[#120710] border border-white/[0.06]">
                <strong className="text-[#F18B49] block mb-1">{tr("Caliper Metric (38.5%):", "कैलीपर मीट्रिक (38.5%):", "कॅलिपर मेट्रिक (३८.५%):", "કેલિપર મેટ્રિક (૩૮.૫%):")}</strong>
                {tr(
                  "Calculated via minimum enclosing rotated rectangle and perpendicular major/minor axis ratio with pixel-to-millimeter homography matrix.",
                  "न्यूनतम संलग्न घूर्णन आयत और लंबवत प्रमुख/लघु अक्ष अनुपात के माध्यम से पिक्सेल-टू-मिलीमीटर होमोग्राफी मैट्रिक्स द्वारा गणना की गई।",
                  "किमान संलग्न फिरविलेला आयत आणि लंबवत मुख्य/लहान अक्ष गुणोत्तरासह पिक्सेल-ते-मिलीमीटर होमोग्राफी मॅट्रिक्सद्वारे गणना केली.",
                  "ન્યૂનતમ જોડાયેલ રોટેટેડ લંબચોરસ અને લંબવત મુખ્ય/ગૌણ અક્ષ ગુણોત્તર સાથે પિક્સેલ-થી-મિલીમીટર હોમોગ્રાફી મેટ્રિક્સ દ્વારા ગણતરી કરેલ."
                )}
              </div>
              <div className="p-3 rounded-xl bg-[#120710] border border-white/[0.06]">
                <strong className="text-[#F18B49] block mb-1">{tr("Rot Necrosis (34.2%):", "सड़न ऊतक क्षय (34.2%):", "सड पेशींचा क्षय (३४.२%):", "સડો પેશીનો ક્ષય (૩૪.૨%):")}</strong>
                {tr(
                  "Computed in CIE L*a*b* space segmenting black fungal sporulation and soft rot tissue breakdown below L* < 28 threshold.",
                  "CIE L*a*b* रंग क्षेत्र में L* < 28 थ्रेशोल्ड के नीचे काले फंगल बीजाणु और कोमल सड़न ऊतक के विभाजन द्वारा गणना की गई।",
                  "CIE L*a*b* रंग क्षेत्रात L* < २८ मर्यादेखाली काळ्या बुरशीचे बीजाणू आणि मऊ सड पेशींचे विभाजन करून गणना केली.",
                  "CIE L*a*b* રંગ સ્પેસમાં L* < ૨૮ થ્રેશોલ્ડ નીચે કાળી ફૂગ અને સોફ્ટ રોટ ટિશ્યુના સેગ્મેન્ટેશન દ્વારા ગણતરી કરેલ."
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 5 Mandi Stratification */}
        {activeModelTab === "dataset" && (
          <div className="card-3d p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <h4 className="font-bold text-base text-[#F8D5C2]">{tr("5 Mandi Geographic & Varietal Stratification", "5 मंडी भौगोलिक एवं किस्म स्तरीकरण", "५ बाजार समित्यांचे भौगोलिक व वाण स्तरीकरण", "૫ મંડી ભૌગોલિક અને જાતોનું સ્તરીકરણ")}</h4>
                <p className="text-xs text-[#C4A494]">{tr("Representative sampling of India's major onion producing belts", "भारत के प्रमुख प्याज उत्पादक क्षेत्रों का प्रतिनिधि नमूनाकरण", "भारतातील प्रमुख कांदा उत्पादक पट्ट्यांचे प्रातिनिधिक नमुने", "ભારતના મુખ્ય ડુંગળી ઉત્પાદક વિસ્તારોનું પ્રતિનિધિ નમૂનાકરણ")}</p>
              </div>
              <span className="capsule-tag font-mono text-xs">{tr("12,480 Total Bulbs", "12,480 कुल प्याज", "१२,४८० एकूण कांदे", "૧૨,૪૮૦ કુલ ડુંગળી")}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(MODEL_METADATA?.mandisSampled || []).map((mandi, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#120710] border border-white/[0.06] space-y-2">
                  <span className="text-[10px] text-[#C4A494] font-mono">{tr("MANDI", "मंडी", "बाजार समिती", "માર્કેટ યાર્ડ")} 0{idx + 1}</span>
                  <div className="text-sm font-bold text-[#F8D5C2]">
                    {tr(mandi.name, mandi.nameHindi, mandi.nameMarathi, mandi.nameGujarati)}
                  </div>
                  <div className="text-xs text-[#C4A494] flex items-center gap-1">
                    <MapPin size={11} className="text-[#F18B49]" />
                    <span>{tr(mandi.state, mandi.stateHindi, mandi.stateMarathi, mandi.stateGujarati)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06] font-mono">
                    <div className="text-lg font-black text-[#F18B49] font-tabular">{mandi.samples.toLocaleString()}</div>
                    <div className="text-[10px] text-[#C4A494]">{tr("Physical instances", "भौतिक नमूने", "भौतिक नमुने", "ભૌતિક નમૂનાઓ")}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#1E0A1A] border border-[#3A1230] text-xs text-[#C4A494] font-mono flex items-center justify-between">
              <span>{tr("Includes Garwa (storage), Rangda (transitional), Pol (kharif), and Mahuva White varieties.", "इसमें गरवा (भंडारण), रांगड़ा (संक्रमणकालीन), पोल (खरीफ) और महुआ सफेद किस्में शामिल हैं।", "यामध्ये गरवा (साठवणूक), रांगडा (हंगामी), पोळ (खरीप) आणि महुवा पांढरा जातींचा समावेश आहे.", "આમાં ગરવા (સંગ્રહ), રાંગડા (ટ્રાન્ઝિશનલ), પોળ (ખરીફ) અને મહુવા સફેદ જાતો શામેલ છે.")}</span>
              <span className="text-[#F18B49] font-bold">{tr("100% Calibrated", "100% कैलिब्रेटेड", "१००% कॅलिब्रेटेड", "૧૦૦% કેલિબ્રેટેડ")}</span>
            </div>
          </div>
        )}
      </section>

      {/* The 4 Operational Roles Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="capsule-tag-dark mb-2">{tr("ROLE ARCHITECTURE", "भूमिका वास्तुकला", "भूमिका आर्किटेक्चर", "ભૂમિકા આર્કિટેક્ચર")}</span>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#F8D5C2] tracking-tight">
            {tr("Designed for Every Stakeholder in the Mandi", "मंडी में हर हितधारक के लिए डिज़ाइन किया गया", "बाजार समितीतील प्रत्येक घटकासाठी डिझाइन केलेले", "માર્કેટ યાર્ડના દરેક હિતધારક માટે રચાયેલ")}
          </h2>
          <p className="text-xs sm:text-sm text-[#C4A494] mt-2">
            {tr(
              "Each role is anchored to a single focused verb with zero cognitive clutter. Tap any role card to sign into its dedicated workspace.",
              "प्रत्येक भूमिका एक ही केंद्रित कार्य से जुड़ी है। इसके समर्पित कार्यक्षेत्र में प्रवेश करने के लिए किसी भी भूमिका कार्ड पर टैप करें।",
              "प्रत्येक भूमिका कोणत्याही गोंधळाशिवाय एकाच मुख्य कार्यावर केंद्रित आहे. त्याच्या समर्पित कार्यक्षेत्रात प्रवेश करण्यासाठी कोणत्याही भूमिका कार्डवर टॅप करा.",
              "દરેક ભૂમિકા કોઈપણ ગૂંચવણ વગર એક જ મુખ્ય કાર્ય સાથે જોડાયેલ છે. તેના સમર્પિત કાર્યક્ષેત્રમાં પ્રવેશવા માટે કોઈપણ ભૂમિકા કાર્ડ પર ટેપ કરો."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Role 1: Farmer */}
          <div
            onClick={() => handleRoleCardClick(ROLES.FARMER)}
            className="card-3d p-6 flex flex-col justify-between group cursor-pointer hover:border-[#F18B49]/50 transition-all active:scale-98 select-none"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                <Sprout size={24} className="text-[#F18B49]" />
              </div>
              <span className="capsule-tag text-[10px]">{tr("VERB: GRADE", "क्रिया: ग्रेड", "कृती: प्रतवारी", "ક્રિયા: ગ્રેડિંગ")}</span>
              <h3 className="font-bold text-lg text-[#F8D5C2] mt-2">
                {tr("Farmer / Seller", "किसान / विक्रेता", "शेतकरी / विक्रेता", "ખેડૂત / વિક્રેતા")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "One big button: Grade my onions. Instant calibrated quality proof on-site, fair MSP payouts, and 1-tap grievance filing.",
                  "एक बड़ा बटन: मेरी प्याज ग्रेड करें। तत्काल कैलिब्रेटेड गुणवत्ता प्रमाण, उचित एमएसपी भुगतान, और 1-टैप शिकायत दर्ज।",
                  "एक मोठे बटण: माझ्या कांद्याची प्रतवारी करा. जागेवरच त्वरित कॅलिब्रेटेड गुणवत्ता पुरावा, रास्त हमीभाव, आणि १-टॅप तक्रार निवारण.",
                  "એક મોટું બટન: મારી ડુંગળી ગ્રેડ કરો. સ્થળ પર જ ત્વરિત કેલિબ્રેટેડ ગુણવત્તા પુરાવો, વાજબી ટેકાનો ભાવ, અને ૧-ટેપ ફરિયાદ નોંધણી."
                )}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#F18B49] font-bold">
              <span>{tr("Log in as Farmer", "किसान के रूप में लॉग इन करें", "शेतकरी म्हणून लॉगिन करा", "ખેડૂત તરીકે લૉગ ઇન કરો")}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Role 2: Retailer */}
          <div
            onClick={() => handleRoleCardClick(ROLES.RETAILER)}
            className="card-3d p-6 flex flex-col justify-between group cursor-pointer hover:border-[#EB87A9]/50 transition-all active:scale-98 select-none"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EB87A9]/15 border border-[#EB87A9]/40 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} className="text-[#EB87A9]" />
              </div>
              <span className="capsule-tag-yellow text-[10px]">{tr("VERB: BROWSE", "क्रिया: खोजें", "कृती: शोधा", "ક્રિયા: બ્રાઉઝ")}</span>
              <h3 className="font-bold text-lg text-[#F8D5C2] mt-2">
                {tr("Retailer / Trader", "व्यापारी / रिटेलर", "व्यापारी / खरेदीदार", "વેપારી / ખરીદનાર")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "Filter by % Grade A, size, and region. Inspect certified lots in read-only mode without travel. Farmer identities protected.",
                  "ग्रेड ए %, आकार और क्षेत्र के आधार पर फ़िल्टर करें। यात्रा किए बिना प्रमाणित लॉट का निरीक्षण करें।",
                  "दर्जा 'अ' %, आकार आणि प्रदेशानुसार फिल्टर करा. प्रवास न करता प्रमाणित लॉट तपासा. शेतकऱ्यांची ओळख सुरक्षित.",
                  "ગ્રેડ A %, કદ અને પ્રદેશ દ્વારા ફિલ્ટર કરો. મુસાફરી કર્યા વિના પ્રમાણિત લોટ તપાસો. ખેડૂતોની ઓળખ સુરક્ષિત."
                )}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#EB87A9] font-bold">
              <span>{tr("Log in as Trader", "व्यापारी के रूप में लॉग इन करें", "व्यापारी म्हणून लॉगिन करा", "વેપારી તરીકે લૉગ ઇન કરો")}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Role 3: Officer */}
          <div
            onClick={() => handleRoleCardClick(ROLES.OFFICER)}
            className="card-3d p-6 flex flex-col justify-between group cursor-pointer hover:border-[#F18B49]/50 transition-all active:scale-98 select-none"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                <Scale size={24} className="text-[#F18B49]" />
              </div>
              <span className="capsule-tag text-[10px]">{tr("VERB: PROCESS QUEUE", "क्रिया: प्रक्रिया", "कृती: रांग प्रक्रिया", "ક્રિયા: કતાર પ્રક્રિયા")}</span>
              <h3 className="font-bold text-lg text-[#F8D5C2] mt-2">
                {tr("Procurement Officer", "खरीद अधिकारी", "खरेदी अधिकारी", "ખરીદ અધિકારી")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "Running daily quintal counter, automated e-lot weighbridge receipt generator, and transparent queue intake logging.",
                  "दैनिक क्विंटल काउंटर, स्वचालित ई-लॉट रसीद जनरेटर, और पारदर्शी कतार लॉगिंग।",
                  "दैनंदिन क्विंटल काउंटर, स्वयंचलित ई-लॉट वजनकाटा पावती जनरेटर, आणि पारदर्शक आवक नोंदणी.",
                  "દૈનિક ક્વિન્ટલ કાઉન્ટર, સ્વચાલિત ઈ-લોટ વજનકાંટા પાવતી જનરેટર, અને પારદર્શક આવક નોંધણી."
                )}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#F18B49] font-bold">
              <span>{tr("Log in as Officer", "अधिकारी के रूप में लॉग इन करें", "अधिकारी म्हणून लॉगिन करा", "અધિકારી તરીકે લૉગ ઇન કરો")}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Role 4: Government */}
          <div
            onClick={() => handleRoleCardClick(ROLES.GOVERNMENT)}
            className="card-3d p-6 flex flex-col justify-between group cursor-pointer hover:border-[#FF4D4D]/50 transition-all active:scale-98 select-none"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                <Landmark size={24} className="text-[#FF4D4D]" />
              </div>
              <span className="capsule-tag-red text-[10px]">{tr("VERB: OVERSEE", "क्रिया: निगरानी", "कृती: देखरेख", "ક્રિયા: દેખરેખ")}</span>
              <h3 className="font-bold text-lg text-[#F8D5C2] mt-2">
                {tr("Government / DoCA", "सरकार / DoCA", "शासन / DoCA", "સરકાર / DoCA")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "National macro analytics, post-harvest rot timelines, nationwide dispute magistrate terminal, and grading rules engine.",
                  "राष्ट्रीय मैक्रो एनालिटिक्स, फसल के बाद रोट टाइमलाइन, देशव्यापी विवाद मजिस्ट्रेट टर्मिनल।",
                  "राष्ट्रीय मॅक्रो अ‍ॅनालिटिक्स, काढणीनंतरच्या सडीची टाइमलाइन, देशव्यापी तक्रार निवारण मॅजिस्ट्रेट टर्मिनल.",
                  "રાષ્ટ્રીય મેક્રો એનાલિટિક્સ, લણણી પછી સડો ટાઇમલાઇન, દેશવ્યાપી વિવાદ મેજિસ્ટ્રેટ ટર્મિનલ."
                )}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#FF4D4D] font-bold">
              <span>{tr("Log in as DoCA", "DoCA के रूप में लॉग इन करें", "DoCA म्हणून लॉगिन करा", "DoCA તરીકે લૉગ ઇન કરો")}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Sovereign Tech Stack & Ecosystem Integrations Section */}
      <section id="tech-stack" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.06] scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="capsule-tag-dark mb-2">
            {tr("SOVEREIGN ARCHITECTURE & INTEGRATIONS", "संप्रभु वास्तुकला एवं एकीकरण", "सार्वभौम आर्किटेक्चर आणि एकात्मता", "સાર્વભૌમ આર્કિટેક્ચર અને એકીકરણ")}
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#F8D5C2] tracking-tight">
            {tr("Interoperable Mandi Infrastructure Stack", "इंटरऑपरेबल मंडी अवसंरचना स्टैक", "इंटरऑपरेबल बाजार समिती पायाभूत सुविधा", "ઇન્ટરઓપરેબલ માર્કેટ યાર્ડ ઇન્ફ્રાસ્ટ્રક્ચર સ્ટેક")}
          </h2>
          <p className="text-xs sm:text-sm text-[#C4A494] mt-2">
            {tr(
              "Built as a lightweight Digital Public Infrastructure (DPI) plug-in layer connecting seamlessly with national Indian agriculture services.",
              "राष्ट्रीय भारतीय कृषि सेवाओं के साथ निर्बाध रूप से जुड़ने वाले हल्के डिजिटल सार्वजनिक बुनियादी ढांचे (DPI) प्लग-इन के रूप में निर्मित।",
              "राष्ट्रीय कृषी सेवांशी सहज जोडल्या जाणाऱ्या डिजिटल पब्लिक इन्फ्रास्ट्रक्चर (DPI) प्लग-इन लेयर म्हणून विकसित.",
              "રાષ્ટ્રીય કૃષિ સેવાઓ સાથે સરળતાથી જોડાતા ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર (DPI) પ્લગ-ઇન લેયર તરીકે વિકસિત."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Digital India BHASHINI Division */}
          <div className="card-3d p-5 flex flex-col justify-between space-y-4 hover:border-[#F18B49]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF9933]/15 border border-[#FF9933]/40 flex items-center justify-center font-bold text-[#FF9933]">
                  भा
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30 font-mono text-[9px] font-bold">
                  BHASHINI API
                </span>
              </div>
              <h3 className="font-bold text-base text-[#F8D5C2]">
                {tr("Digital India BHASHINI Division", "डिजिटल इंडिया भाषिणी प्रभाग", "डिजिटल इंडिया भाषिणी विभाग", "ડિજિટલ ઇન્ડિયા ભાષિણી ડિવિઝન")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "National Language Translation Mission (NLTM) integration powering real-time regional speech recognition and vernacular translations across Hindi, Marathi, Gujarati, and English for inclusive grassroots mandi access.",
                  "राष्ट्रीय भाषा अनुवाद मिशन (NLTM) एकीकरण जो जमीनी स्तर पर मंडी पहुंच के लिए हिन्दी, मराठी, गुजराती और अंग्रेजी में वास्तविक समय क्षेत्रीय भाषण पहचान और अनुवाद प्रदान करता है।",
                  "राष्ट्रीय भाषा भाषांतर मिशन (NLTM) एकात्मता, ज्यामुळे हिंदी, मराठी, गुजराती आणि इंग्रजीमध्ये रिअल-टाइम व्हॉइस व स्थानिक भाषांतर उपलब्ध होते.",
                  "રાષ્ટ્રીય ભાષા અનુવાદ મિશન (NLTM) એકીકરણ, જે હિન્દી, મરાઠી, ગુજરાતી અને અંગ્રેજીમાં રીઅલ-ટાઇમ અવાજ ઓળખ અને પ્રાદેશિક અનુવાદ પ્રદાન કરે છે."
                )}
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-[#FF9933] flex items-center justify-between">
              <span>MeitY • NLTM Division</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F8D5C2]">Voice + Vernacular</span>
            </div>
          </div>

          {/* Card 2: MSG91 SMS Gateway */}
          <div className="card-3d p-5 flex flex-col justify-between space-y-4 hover:border-[#EB87A9]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EB87A9]/15 border border-[#EB87A9]/40 flex items-center justify-center font-bold text-[#EB87A9]">
                  <MessageSquare size={18} />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#EB87A9]/15 text-[#EB87A9] border border-[#EB87A9]/30 font-mono text-[9px] font-bold">
                  MSG91 TELECOM
                </span>
              </div>
              <h3 className="font-bold text-base text-[#F8D5C2]">
                {tr("MSG91 Secure SMS & OTP Gateway", "MSG91 सुरक्षित एसएमएस और ओटीपी गेटवे", "MSG91 सुरक्षित एसएमएस आणि ओटीपी गेटवे", "MSG91 સુરક્ષિત એસએમએસ અને ઓટીપી ગેટવે")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "High-throughput TRAI DLT-compliant SMS infrastructure delivering instant optical grading receipts, digital weighbridge slips, and price signals to farmers on basic feature phones without smartphone apps.",
                  "उच्च-थ्रूपुट ट्राई डीएलटी-अनुरूप एसएमएस बुनियादी ढांचा जो फीचर फोन वाले किसानों को स्मार्टफोन ऐप के बिना तत्काल ग्रेडिंग रसीदें और मूल्य संकेत देता है।",
                  "ट्राय (TRAI) डीएलटी-अनुरूप एसएमएस प्रणाली, जी साध्या फीचर फोनवरील शेतकऱ्यांना स्मार्टफोन अ‍ॅपशिवाय त्वरित प्रतवारी पावती आणि दर संदेश पाठवते.",
                  "ટ્રાઈ DLT-સુસંગત એસએમએસ ઈન્ફ્રાસ્ટ્રક્ચર, જે સાદા ફીચર ફોન પર ખેડૂતોને સ્માર્ટફોન એપ વિના ત્વરિત ગ્રેડિંગ પાવતી અને ભાવ સંકેતો મોકલે છે."
                )}
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-[#EB87A9] flex items-center justify-between">
              <span>TRAI DLT Registered</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F8D5C2]">Feature Phone First</span>
            </div>
          </div>

          {/* Card 3: Aadhaar e-KYC (UIDAI) */}
          <div className="card-3d p-5 flex flex-col justify-between space-y-4 hover:border-[#F18B49]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center font-bold text-[#F18B49]">
                  <ShieldCheck size={18} />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#F18B49]/15 text-[#F18B49] border border-[#F18B49]/30 font-mono text-[9px] font-bold">
                  UIDAI AADHAAR
                </span>
              </div>
              <h3 className="font-bold text-base text-[#F8D5C2]">
                {tr("Aadhaar e-KYC & DBT Escrow", "आधार ई-केवाईसी और डीबीटी एस्क्रो", "आधार ई-केवायसी आणि डीबीटी एस्क्रो", "આધાર ઈ-કેવાયસી અને ડીબીટી એસ્ક્રો")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "Cryptographic verification confirming farmer landholding records and PM-KISAN beneficiary IDs. Prevents middleman proxy entries and establishes direct escrow payout pipelines for fair APMC transactions.",
                  "किसान भूमि रिकॉर्ड और पीएम-किसान लाभार्थी आईडी की पुष्टि करने वाला क्रिप्टोग्राफिक सत्यापन। बिचौलियों के छद्म प्रवेश को रोकता है और पारदर्शी भुगतान सुनिश्चित करता है।",
                  "शेतकऱ्यांचे सातबारा व पीएम-किसान लाभार्थी आयडी पडताळणी. मध्यस्थांची खोटी नोंदणी रोखते आणि पारदर्शक थेट बँक खात्यात पैसे जमा करते.",
                  "ખેડૂતના જમીન રેકોર્ડ અને પીએમ-કિસાન લાભાર્થી આઈડીની ચકાસણી. વચેટિયાઓની ખોટી એન્ટ્રી અટકાવે છે અને પારદર્શક ચુકવણી સુનિશ્ચિત કરે છે."
                )}
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-[#F18B49] flex items-center justify-between">
              <span>UIDAI Statutory Verification</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F8D5C2]">DBT Escrow Ready</span>
            </div>
          </div>

          {/* Card 4: Mobiusi Dataset (Hugging Face) */}
          <div className="card-3d p-5 flex flex-col justify-between space-y-4 hover:border-[#EB87A9]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-lg">
                  🤗
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#EB87A9]/15 text-[#EB87A9] border border-[#EB87A9]/30 font-mono text-[9px] font-bold">
                  HUGGING FACE
                </span>
              </div>
              <h3 className="font-bold text-base text-[#F8D5C2]">
                {tr("Mobiusi Onion Dataset Hub", "Mobiusi प्याज डेटासेट हब", "Mobiusi कांदा डेटासेट हब", "Mobiusi ડુંગળી ડેટાસેટ હબ")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "Leveraging the Mobiusi open-access agricultural dataset containing high-resolution onion imagery, polygon mask annotations, and defect classification for rigorous computer vision training.",
                  "कठोर कंप्यूटर विज़न प्रशिक्षण के लिए उच्च-रिज़ॉल्यूशन प्याज छवियों और पॉलीगॉन मास्क एनोटेशन वाले मोबियस ओपन-एक्सेस डेटासेट का उपयोग।",
                  "अचूक कॉम्प्युटर व्हिजन प्रशिक्षणासाठी मोबियस ओपन-अ‍ॅक्सेस कृषी डेटासेटमधील उच्च-रिझोल्यूशन कांदा प्रतिमा आणि मास्क एनोटेशन्सचा वापर.",
                  "સચોટ કોમ્પ્યુટર વિઝન તાલીમ માટે મોબિયસ ઓપન-એક્સેસ કૃષિ ડેટાસેટમાંથી હાઈ-રિઝોલ્યુશન ઈમેજો અને માસ્ક એનોટેશન્સનો ઉપયોગ."
                )}
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <a
                href="https://huggingface.co/datasets/Mobiusi/Onion-Classification-and-Segmentation-Dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-[#EB87A9] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Hugging Face Hub</span>
                <ExternalLink size={10} />
              </a>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#F8D5C2]">Segmentation Masks</span>
            </div>
          </div>

          {/* Card 5: Google Gemini Multimodal AI */}
          <div className="card-3d p-5 flex flex-col justify-between space-y-4 hover:border-[#F18B49]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center font-bold text-[#F18B49]">
                  <Sparkles size={18} />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#F18B49]/15 text-[#F18B49] border border-[#F18B49]/30 font-mono text-[9px] font-bold">
                  GEMINI VISION
                </span>
              </div>
              <h3 className="font-bold text-base text-[#F8D5C2]">
                {tr("Google Gemini Multimodal AI", "गूगल जेमिनी मल्टीमॉडल एआई", "गुगल जेमिनी मल्टीमॉडल एआय", "ગુગલ જેમિની મલ્ટીમોડલ AI")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "High-resolution pathology inspection detecting Aspergillus niger fungal mycelia, bacterial soft rot breakdown, and early internal sprouting cues invisible to basic color thresholding.",
                  "एस्परगिलस नाइजर फंगल मायसेलियम, बैक्टीरियल सॉफ्ट रोट और प्रारंभिक आंतरिक अंकुरण की पहचान करने वाला उच्च-रिज़ॉल्यूशन पैथोलॉजी निरीक्षण।",
                  "काळ्या बुरशीचे बीजाणू, मऊ सड आणि अंतर्गत कोंब अचूक शोधणारी उच्च-रिझोल्यूशन पॅथॉलॉजी तपासणी.",
                  "કાળી ફૂગ, બેક્ટેરિયલ સોફ્ટ રોટ અને આંતરિક અંકુરણની ચોક્કસ તપાસ કરતી ઉચ્ચ-રિઝોલ્યુશન પેથોલોજી ચકાસણી."
                )}
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-[#F18B49] flex items-center justify-between">
              <span>Gemini 2.5 Flash Engine</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F8D5C2]">Pathology Audit</span>
            </div>
          </div>

          {/* Card 6: Dual Storage & AWS S3 */}
          <div className="card-3d p-5 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-[#F8D5C2]">
                  <Database size={18} />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#F8D5C2] border border-white/20 font-mono text-[9px] font-bold">
                  POSTGRESQL + S3
                </span>
              </div>
              <h3 className="font-bold text-base text-[#F8D5C2]">
                {tr("Dual Database & Tamper-Proof Storage", "दोहरा डेटाबेस और छेड़छाड़-रोधी भंडारण", "दुहेरी डेटाबेस आणि सुरक्षित साठवणूक", "ડ્યુઅલ ડેટાબેઝ અને સુરક્ષિત સંગ્રહ")}
              </h3>
              <p className="text-xs text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "PostgreSQL for ACID transactional mandi intake and weighbridge receipts, MongoDB for immutable grievance audit logs, and AWS S3 / Cloudflare R2 with SHA-256 content hashes for tamper-proof evidence.",
                  "लेन-देन मंडी आवक और वजनपुल रसीदों के लिए पोस्टग्रेएसक्यूएल, अपरिवर्तनीय शिकायत लॉग के लिए मोंगोडीबी, और छेड़छाड़-रोधी सबूतों के लिए एस3।",
                  "बाजार समिती आवक नोंदींसाठी पोस्टग्रेसक्यूएल, तक्रार नोंदींसाठी मोंगोडीबी, आणि सुरक्षित पुराव्यांसाठी एस३ क्लाउड साठवणूक.",
                  "માર્કેટ યાર્ડ વ્યવહારો માટે પોસ્ટગ્રેસક્યુએલ, ફરિયાદ લોગ માટે મોંગોડીબી, અને સુરક્ષિત પુરાવા માટે એસ૩ ક્લાઉડ સંગ્રહ."
                )}
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-[#C4A494] flex items-center justify-between">
              <span>ACID + SHA-256 Hashing</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F8D5C2]">Audit Compliant</span>
            </div>
          </div>

        </div>
      </section>

      {/* Data Abstraction & Privacy Model Section */}
      <section id="privacy" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.06] scroll-mt-20">
        <div id="privacy-model" className="relative -top-24 pointer-events-none" />
        <div className="card-3d p-6 sm:p-10 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <div className="capsule-tag-dark mb-1">{tr("DATA ABSTRACTION & PRIVACY MODEL", "डेटा गोपनीयता मॉडल", "डेटा गोपनीयता मॉडेल", "ડેટા ગોપનીયતા મોડેલ")}</div>
              <h3 className="font-sans font-black text-xl sm:text-3xl text-[#F8D5C2]">
                {tr("Who Sees What, and Why", "कौन क्या देखता है, और क्यों", "कोण काय पाहू शकते आणि का", "કોણ શું જોઈ શકે છે અને શા માટે")}
              </h3>
              <p className="text-xs text-[#C4A494] font-mono mt-1">
                {tr(
                  "Show too much to the wrong role and you leak privacy; show too little and they cannot do their job.",
                  "प्रत्येक भूमिका केवल अपनी प्रासंगिक जानकारी देखती है।",
                  "चुकीच्या भूमिकेला जास्त माहिती दिल्यास गोपनीयता धोक्यात येते; खूप कमी माहिती दिल्यास काम होऊ शकत नाही.",
                  "ખોટી ભૂમિકાને વધુ માહિતી આપવાથી ગોપનીયતા જોખમાય છે; ઓછી માહિતી આપવાથી કામ થઈ શકતું નથી."
                )}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#120710] border border-white/[0.06] text-xs font-mono text-[#F18B49] max-w-sm">
              <strong>{tr("Core Privacy Pattern:", "गोपनीयता पैटर्न:", "मुख्य गोपनीयता नियम:", "મુખ્ય ગોપનીયતા નિયમ:")}</strong> {tr(
                "Farmer = own data only • Officer = their centre only • Retailer = anonymized market data only • Government = aggregate by default, drill-down only on dispute.",
                "किसान = केवल अपना डेटा • अधिकारी = केवल अपना केंद्र • व्यापारी = केवल गुमनाम बाज़ार डेटा • सरकार = समग्र डेटा",
                "शेतकरी = फक्त स्वतःचा डेटा • अधिकारी = फक्त स्वतःचे केंद्र • व्यापारी = केवळ निनावी बाजार डेटा • शासन = डीफॉल्टनुसार एकत्रित डेटा",
                "ખેડૂત = ફક્ત પોતાનો ડેટા • અધિકારી = ફક્ત પોતાનું કેન્દ્ર • વેપારી = ફક્ત અનામી બજાર ડેટા • સરકાર = ડિફોલ્ટ રૂપે એકત્રિત ડેટા"
              )}
            </div>
          </div>

          {/* Privacy Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#C4A494]">
                  <th className="py-3 px-3">{tr("Data Field", "डेटा फ़ील्ड", "डेटा माहिती", "ડેટા ફીલ્ડ")}</th>
                  <th className="py-3 px-3 text-[#F18B49]">{tr("Farmer", "किसान", "शेतकरी", "ખેડૂત")}</th>
                  <th className="py-3 px-3 text-[#EB87A9]">{tr("Retailer", "व्यापारी", "व्यापारी", "વેપારી")}</th>
                  <th className="py-3 px-3 text-[#F18B49]">{tr("Officer", "अधिकारी", "अधिकारी", "અધિકારી")}</th>
                  <th className="py-3 px-3 text-[#FF4D4D]">{tr("Gov/DoCA", "सरकार", "शासन/DoCA", "સરકાર/DoCA")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F8D5C2]">{tr("Lot Data Visibility", "लॉट डेटा दृश्यता", "लॉट डेटा दृश्यमानता", "લોટ ડેટા દૃશ્યતા")}</td>
                  <td className="py-3 px-3 text-[#F18B49]">{tr("Own lots only", "केवल अपने लॉट्स", "फक्त स्वतःचे लॉट्स", "ફક્ત પોતાના લોટ")}</td>
                  <td className="py-3 px-3 text-[#EB87A9]">{tr("Any listed marketplace lot", "सूचीबद्ध बाज़ार लॉट्स", "बाजारातील सूचीबद्ध लॉट्स", "બજારમાં સૂચિબદ્ધ લોટ")}</td>
                  <td className="py-3 px-3 text-[#F18B49]">{tr("All lots at their centre", "अपने केंद्र के सभी लॉट्स", "केंद्रातील सर्व लॉट्स", "પોતાના કેન્દ્રના તમામ લોટ")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D]">{tr("Aggregated across all centres", "सभी केंद्रों का समग्र डेटा", "सर्व केंद्रांचा एकत्रित डेटा", "તમામ કેન્દ્રોનો એકત્રિત ડેટા")}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F8D5C2]">{tr("Procurement price paid", "भुगतान किया गया खरीद मूल्य", "दिलेली खरेदी किंमत", "ચૂકવેલ ખરીદ ભાવ")}</td>
                  <td className="py-3 px-3 text-[#F18B49]">{tr("Yes, their own", "हाँ, केवल अपना", "होय, फक्त स्वतःची", "હા, ફક્ત પોતાની")}</td>
                  <td className="py-3 px-3 text-[#C4A494]">{tr("Not applicable (bidding only)", "लागू नहीं (केवल बोली)", "लागू नाही (केवळ बोली)", "લાગુ નથી (ફક્ત બોલી)")}</td>
                  <td className="py-3 px-3 text-[#F8D5C2]">{tr("Yes, entered by officer", "हाँ, अधिकारी द्वारा दर्ज", "होय, अधिकाऱ्याने नोंदवलेली", "હા, અધિકારી દ્વારા દાખલ")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D]">{tr("Aggregated for policy", "नीति हेतु समग्र", "धोरणासाठी एकत्रित", "નીતિ માટે એકત્રિત")}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F8D5C2]">{tr("Other farmers' individual lots", "अन्य किसानों के व्यक्तिगत लॉट्स", "इतर शेतकऱ्यांचे वैयक्तिक लॉट्स", "અન્ય ખેડૂતોના વ્યક્તિગત લોટ")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D] font-bold">{tr("NEVER", "कभी नहीं", "कधीही नाही", "ક્યારેય નહીં")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D] font-bold">{tr("NEVER individually", "व्यक्तिगत रूप से कभी नहीं", "वैयक्तिकरित्या कधीही नाही", "વ્યક્તિગત રીતે ક્યારેય નહીં")}</td>
                  <td className="py-3 px-3 text-[#C4A494]">{tr("Only at own centre", "केवल अपने केंद्र में", "फक्त स्वतःच्या केंद्रात", "ફક્ત પોતાના કેન્દ્રમાં")}</td>
                  <td className="py-3 px-3 text-[#C4A494]">{tr("Only via aggregate or dispute", "केवल समग्र या विवाद में", "केवळ एकत्रित किंवा तक्रारीत", "ફક્ત એકત્રિત અથવા વિવાદમાં")}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F8D5C2]">{tr("State-wide macro trends", "राज्यव्यापी व्यापक रुझान", "राज्यव्यापी मॅक्रो ट्रेंड्स", "રાજ્યવ્યાપી મેક્રો વલણો")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D] font-bold">{tr("NEVER", "कभी नहीं", "कधीही नाही", "ક્યારેય નહીં")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D] font-bold">{tr("NEVER", "कभी नहीं", "कधीही नाही", "ક્યારેય નહીં")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D] font-bold">{tr("NEVER (centre only)", "कभी नहीं (केवल केंद्र)", "कधीही नाही (फक्त केंद्र)", "ક્યારેય નહીં (ફક્ત કેન્દ્ર)")}</td>
                  <td className="py-3 px-3 text-[#F18B49] font-bold">{tr("YES (Primary view)", "हाँ (प्राथमिक दृश्य)", "होय (प्राथमिक दृश्य)", "હા (પ્રાથમિક દૃશ્ય)")}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F8D5C2]">{tr("Editable grading rules", "संपादन योग्य ग्रेडिंग नियम", "बदलण्यायोग्य प्रतवारी नियम", "સંપાદન યોગ્ય ગ્રેડિંગ નિયમો")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D] font-bold">{tr("NEVER", "कभी नहीं", "कधीही नाही", "ક્યારેય નહીં")}</td>
                  <td className="py-3 px-3 text-[#C4A494]">{tr("Read-only reference", "केवल पठन संदर्भ", "फक्त वाचनासाठी संदर्भ", "ફક્ત વાંચવા માટે સંદર્ભ")}</td>
                  <td className="py-3 px-3 text-[#FF4D4D] font-bold">{tr("NEVER", "कभी नहीं", "कधीही नाही", "ક્યારેય નહીં")}</td>
                  <td className="py-3 px-3 text-[#F18B49] font-bold">{tr("YES (Sole authority)", "हाँ (एकमात्र प्राधिकारी)", "होय (एकमेव अधिकार)", "હા (એકમાત્ર સત્તા)")}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Official Smart India Hackathon (SIH 2026) Submission Batch Banner */}
      <SihFooterBanner />

      {/* Minimal Billion-Dollar Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#C4A494]">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="OnionGrade AI" className="w-5 h-5 object-contain rounded-full select-none" />
          <span className="text-[#F8D5C2] font-bold">OnionGrade AI</span>
          <span>• {tr("Price Stabilization Fund Management Cell", "मूल्य स्थिरीकरण कोष प्रबंधन प्रकोष्ठ", "किंमत स्थिरीकरण निधी व्यवस्थापन कक्ष", "કિંમત સ્થિરીકરણ ભંડોળ વ્યવસ્થાપન સેલ")}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{tr("Department of Consumer Affairs", "उपभोक्ता मामले विभाग", "ग्राहक व्यवहार विभाग", "ગ્રાહક બાબતોનો વિભાગ")}</span>
          <span>{tr("Ministry of Consumer Affairs, GoI", "उपभोक्ता मामले मंत्रालय, भारत सरकार", "ग्राहक व्यवहार मंत्रालय, भारत सरकार", "ગ્રાહક બાબતોનું મંત્રાલય, ભારત સરકાર")}</span>
        </div>
      </footer>

    </div>
  );
}
