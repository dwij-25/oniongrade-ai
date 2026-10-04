import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLots } from "../services/storage";
import GradingWorkflow from "../components/GradingWorkflow";
import DigitalCertificateModal from "../components/DigitalCertificateModal";
import WhatsAppBotModal from "../components/WhatsAppBotModal";
import { predictShelfLife } from "../services/shelfLifePredictor";
import { getMarketSignal } from "../services/marketPricing";
import {
  Sprout,
  PlusCircle,
  History,
  AlertTriangle,
  Calendar,
  MapPin,
  FileCheck,
  ShieldCheck,
  ArrowUpRight,
  Check,
  ChevronLeft,
  Scan,
  QrCode,
  MessageSquare,
  Clock,
  TrendingUp
} from "lucide-react";

export default function FarmerDashboard() {
  const { user, openScanner } = useAuth();
  const { t, tr, isHindi, isMarathi, isGujarati } = useLanguage();
  const [lots, setLots] = useState([]);
  const [selectedHistoricalLot, setSelectedHistoricalLot] = useState(null);
  const [certLot, setCertLot] = useState(null);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  useEffect(() => {
    loadLots();
    const handleHash = () => {
      setSelectedHistoricalLot(null);
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const loadLots = () => {
    const allLots = getLots();
    // Strict Data Abstraction: Farmer sees ONLY their own lots!
    const myLots = allLots.filter(l => 
      (l.farmerId && l.farmerId === user?.id) ||
      (l.farmerName && l.farmerName === user?.name)
    );
    setLots(myLots);
  };

  const handleInspectLot = (lot) => {
    setSelectedHistoricalLot(lot);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalLots = lots.length;
  const gradeALots = lots.filter(l => l.lotGrade === "Grade A").length;
  const avgGradeA = totalLots > 0
    ? Math.round(lots.reduce((acc, l) => acc + (l.stats?.gradeAPct || 0), 0) / totalLots)
    : 0;
  const totalQuintals = lots.reduce((acc, l) => acc + (Number(l.quantityQuintals) || 0), 0);

  // If farmer is inspecting a specific historical lot slip
  if (selectedHistoricalLot) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-[#F8D5C2]">
        <div className="card-3d p-4 flex items-center justify-between">
          <button
            onClick={() => setSelectedHistoricalLot(null)}
            className="px-4 py-2 rounded-full btn-3d-dark text-xs font-mono font-bold flex items-center gap-2 cursor-pointer text-[#F18B49]"
          >
            <ChevronLeft size={16} />
            <span>{t("farmer.backToLots", "Back to My Harvest Lots")}</span>
          </button>

          <div className="text-xs text-[#C4A494] font-mono hidden sm:block">
            {t("farmer.inspectingLot", "Inspecting Certified APMC Lot Slip")}: <strong className="text-[#F8D5C2]">{selectedHistoricalLot.id}</strong>
          </div>

          <button
            onClick={openScanner}
            className="px-4 py-2 rounded-full btn-3d-lime text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>{t("farmer.gradeNewLot", "Grade New Lot")}</span>
          </button>
        </div>

        <GradingWorkflow
          initialLot={selectedHistoricalLot}
          onGradingComplete={loadLots}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8 text-[#F8D5C2]">
      
      {/* Top 3D Bento Section */}
      <div id="overview" className="grid grid-cols-1 md:grid-cols-12 gap-4 scroll-mt-24">
        
        {/* Left Hero Card: 3D Mandi Producer Hero */}
        <div className="md:col-span-8 card-3d-lime p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-[#F18B49]/15 border border-[#F18B49]/40 text-[#F18B49] font-mono text-xs font-black uppercase tracking-wider">
                {t("farmer.deskTag", "MANDI PRODUCER DESK")}
              </span>
              <span className="text-xs font-mono font-bold text-[#F8D5C2] flex items-center gap-1.5">
                <MapPin size={13} className="text-[#F18B49]" />
                {user?.mandi || "Lasalgaon APMC"}
              </span>
            </div>

            <h1 className="font-sans font-black text-2xl sm:text-4xl text-[#FFF5ED] tracking-tight leading-tight">
              {t("farmer.welcome", "Welcome back")}, {user?.name?.split(" ")[0] || "Rameshwar"}
            </h1>
            <p className="text-xs sm:text-sm text-[#F8D5C2]/90 font-medium mt-1.5 max-w-md leading-relaxed">
              {t("farmer.sub", "Grade new harvest lots with calibrated AI computer vision. Secure instant APMC certification & direct fair price discovery.")}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
            {/* Primary CTA: Grade My Onions -> Opens Scanner Modal Directly */}
            <button
              onClick={openScanner}
              className="px-7 py-3.5 rounded-full bg-[#F18B49] hover:bg-[#FAAC78] text-[#000000] font-black text-xs sm:text-sm shadow-xl shadow-[#F18B49]/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Scan size={18} />
              <span>{t("farmer.gradeButton", "Grade My Onions")}</span>
              <ArrowUpRight size={16} />
            </button>

            <button
              onClick={() => setWhatsAppOpen(true)}
              className="px-5 py-3.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
              title="WhatsApp Krishi Sahayak Bot (Works without installing app)"
            >
              <MessageSquare size={14} />
              <span>{tr("WhatsApp Sahayak (No App)", "व्हाट्सएप सहायक (बिना ऐप)", "व्हॉट्सअ‍ॅप सहाय्यक (अ‍ॅपशिवाय)", "વોટ્સએપ સહાયક (એપ વગર)")}</span>
            </button>

            <a
              href="#harvest-lots"
              className="px-5 py-3.5 rounded-full btn-3d-dark text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <History size={14} className="text-[#F18B49]" />
              <span>{t("farmer.certifiedLotsBtn", "Certified Lots")} ({lots.length})</span>
            </a>
          </div>

          <div className="absolute right-6 -bottom-6 text-[#F18B49] opacity-10 pointer-events-none select-none">
            <Sprout size={140} strokeWidth={1.5} />
          </div>
        </div>

        {/* Right 3D Card: Performance Metrics */}
        <div className="md:col-span-4 card-3d p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="capsule-tag-dark">{t("farmer.metricsTag", "(METRICS) HARVEST SUMMARY")}</span>
              <span className="text-[10px] font-mono text-[#F18B49] font-bold">{t("farmer.khasraTag", "2026 KHASRA")}</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-[#C4A494] font-mono font-medium">{t("farmer.totalVol", "TOTAL CERTIFIED VOLUME")}</div>
                <div className="font-sans font-black text-3xl text-[#FFF5ED] font-tabular mt-0.5">
                  {totalQuintals.toFixed(0)} <span className="text-base text-[#C4A494] font-normal">{t("common.quintals", "Quintals")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.08]">
                <div className="p-3 bg-[#1A0A16] rounded-2xl border border-white/[0.08] shadow-inner">
                  <div className="text-[10px] font-mono text-[#C4A494] font-medium">{t("farmer.avgGradeA", "AVG GRADE A")}</div>
                  <div className="text-lg font-black text-[#F18B49] font-tabular mt-0.5">
                    {avgGradeA}%
                  </div>
                </div>
                <div className="p-3 bg-[#1A0A16] rounded-2xl border border-white/[0.08] shadow-inner">
                  <div className="text-[10px] font-mono text-[#C4A494] font-medium">{t("farmer.passedBatches", "PASSED BATCHES")}</div>
                  <div className="text-lg font-black text-[#EB87A9] font-tabular mt-0.5">
                    {gradeALots} {tr("Lots", "लॉट्स", "लॉट्स", "લોટ્સ")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#C4A494] font-mono">
            <span>{t("farmer.khasraLabel", "Khasra")}: <strong className="text-[#F8D5C2]">{user?.khasraNo || "KH-412/A"}</strong></span>
            <span className="text-[#F18B49] flex items-center gap-1 font-bold">
              <Check size={12} />
              {t("farmer.ekycVerified", "Verified e-KYC")}
            </span>
          </div>
        </div>

      </div>

      {/* Direct List of Certified Lots (NO Clutter Tabs!) */}
      <div id="harvest-lots" className="space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-sans font-black text-xl sm:text-2xl text-[#F8D5C2] tracking-tight">
              {t("farmer.lotsSectionTitle", "Certified Harvest Lots & Mandi Slips")}
            </h2>
            <p className="text-xs text-[#C4A494] font-mono mt-0.5">
              {t("farmer.lotsSectionSub", "Instant AI optical grading slips recognized across Lasalgaon APMC & NAFED")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="capsule-tag-dark">
              {lots.length} {tr("CERTIFIED LOTS", "प्रमाणित लॉट्स", "प्रमाणित लॉट्स", "પ્રમાણિત લોટ્સ")}
            </span>
            <button
              onClick={openScanner}
              className="px-4 py-2 rounded-full btn-3d-lime text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>{t("farmer.gradeNewLot", "Grade New Lot")}</span>
            </button>
          </div>
        </div>

        {lots.length === 0 ? (
          <div className="card-3d p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F18B49]/10 border border-[#F18B49]/30 flex items-center justify-center text-[#F18B49] mx-auto">
              <Sprout size={32} />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-black text-[#F8D5C2]">{t("farmer.noLotsTitle", "No Graded Lots Yet")}</h3>
              <p className="text-xs text-[#C4A494] mt-1">
                {t("farmer.noLotsSub", "Scan your first onion tray or select a pre-calibrated APMC sample lot to generate an instant certified grading slip.")}
              </p>
            </div>
            <button
              onClick={openScanner}
              className="px-6 py-3 rounded-full btn-3d-lime text-xs font-mono font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Scan size={16} />
              <span>{t("farmer.gradeFirstLot", "Grade My First Lot")}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.map((lot) => {
              const isGradeA = lot.lotGrade === "Grade A";
              const isReject = lot.lotGrade === "Reject";

              return (
                <div
                  key={lot.id}
                  onClick={() => handleInspectLot(lot)}
                  className="card-3d p-4 cursor-pointer group flex flex-col justify-between hover:border-[#F18B49]/50 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-inner">
                      <img
                        src={lot.thumbnail || lot.annotatedImage}
                        alt="Lot scan"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #180915, #120710)';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#F8D5C2]">
                        {lot.id}
                      </div>
                      <div className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono shadow-md ${
                        isGradeA
                          ? "bg-[#F18B49] text-[#000000]"
                          : isReject
                          ? "bg-[#FF4D4D] text-white"
                          : "bg-[#EB87A9] text-[#000000]"
                      }`}>
                        {lot.lotGrade === "Grade A" 
                          ? tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'") 
                          : lot.lotGrade === "Reject" 
                          ? tr("Reject", "अस्वीकृत", "नाकारलेले", "નકારેલ") 
                          : "URS"}
                      </div>

                      {lot.dispute && (
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#FF4D4D] text-white text-[9px] font-bold font-mono flex items-center gap-1 shadow">
                          <AlertTriangle size={10} />
                          <span>
                            {tr("DISPUTE: ", "विवाद: ", "तक्रार: ", "વિવાદ: ")}
                            {lot.dispute.status === "open"
                              ? tr("OPEN", "लंबित", "प्रलंबित", "બાકી")
                              : lot.dispute.status === "overridden"
                              ? tr("OVERRIDDEN", "संशोधित", "सुधारित", "સુધારેલ")
                              : tr("UPHELD", "बरकरार", "कायम", "કાયમ")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-[#C4A494] font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {lot.dateStr || new Date(lot.createdAt).toLocaleDateString(isMarathi ? "mr-IN" : isGujarati ? "gu-IN" : isHindi ? "hi-IN" : "en-IN")}
                        </span>
                        <span className="font-bold text-[#F8D5C2]">
                          {lot.quantityQuintals || 40} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#F8D5C2] mt-1">
                        {lot.variety || tr("Nashik Red", "नासिक लाल", "नाशिक लाल", "નાસિક લાલ")} • {lot.mandiName}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#F18B49] font-bold">{lot.stats?.gradeAPct || 0}% {tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")}</span>
                      <span className="text-[#EB87A9] font-bold">{lot.stats?.ursPct || 0}% URS</span>
                      <span className="text-[#FF4D4D] font-bold">{lot.stats?.rejectPct || 0}% {tr("Rej", "अस्वीकृत", "नाकारलेले", "નકારેલ")}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-[#0C040A] flex">
                      <div style={{ width: `${lot.stats?.gradeAPct || 0}%` }} className="bg-[#F18B49]" />
                      <div style={{ width: `${lot.stats?.ursPct || 0}%` }} className="bg-[#EB87A9]" />
                      <div style={{ width: `${lot.stats?.rejectPct || 0}%` }} className="bg-[#FF4D4D]" />
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={(e) => { e.stopPropagation(); setCertLot(lot); }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F18B49]/15 border border-[#F18B49]/30 text-[#F18B49] text-[10px] font-bold hover:bg-[#F18B49]/25 transition-colors"
                      >
                        <QrCode size={11} />
                        {tr("QR Cert", "QR प्रमाण", "QR प्रमाण", "QR પ્રમાણ")}
                      </button>
                      <span className="text-[11px] text-[#F18B49] font-bold group-hover:translate-x-0.5 transition-transform">
                        {t("farmer.inspectSlip", "Inspect Certified Slip →")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Farmer Mandi Profile & Buffer Scheme Status (Clean, Non-Tab Footer) */}
      <div id="profile" className="card-3d p-6 sm:p-7 space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center text-[#F18B49]">
              <FileCheck size={20} />
            </div>
            <div>
              <h3 className="font-sans font-black text-base text-[#F8D5C2]">{t("farmer.profileTitle", "Registered Farmer APMC Profile")}</h3>
              <p className="text-[11px] text-[#C4A494] font-mono">{t("farmer.profileSub", "e-KYC verified with Department of Consumer Affairs (DoCA)")}</p>
            </div>
          </div>
          <span className="capsule-tag text-[10px]">{t("farmer.verifiedProducer", "VERIFIED PRODUCER")}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#120710] rounded-xl border border-white/[0.06]">
            <div className="text-[#C4A494] text-[10px]">{t("farmer.apmcMandi", "APMC MANDI")}</div>
            <div className="font-bold text-sm text-[#F8D5C2] mt-0.5">{user?.mandi || "Lasalgaon APMC"}</div>
          </div>

          <div className="p-3 bg-[#120710] rounded-xl border border-white/[0.06]">
            <div className="text-[#C4A494] text-[10px]">{t("farmer.khasraParcel", "KHASRA / PARCEL")}</div>
            <div className="font-bold text-sm text-[#F8D5C2] mt-0.5">{user?.khasraNo || "KH-412/A"}</div>
          </div>

          <div className="p-3 bg-[#120710] rounded-xl border border-white/[0.06]">
            <div className="text-[#C4A494] text-[10px]">{t("farmer.regPhone", "REGISTERED PHONE")}</div>
            <div className="font-bold text-sm text-[#F8D5C2] mt-0.5">{user?.phone || "+91 98224 81920"}</div>
          </div>

          <div className="p-3 bg-[#120710] rounded-xl border border-white/[0.06]">
            <div className="text-[#C4A494] text-[10px]">{t("farmer.bufferScheme", "BUFFER SCHEME")}</div>
            <div className="font-bold text-sm text-[#F18B49] mt-0.5 flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>{t("farmer.priorityMsp", "Priority Trading")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === Modals === */}
      {certLot && (
        <DigitalCertificateModal
          lot={certLot}
          isOpen={!!certLot}
          onClose={() => setCertLot(null)}
        />
      )}
      <WhatsAppBotModal
        currentLot={lots[0] || null}
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
      />

    </div>
  );
}
