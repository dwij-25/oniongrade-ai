import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Scan } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import GradingWorkflow from "./GradingWorkflow";

export default function GradingModal() {
  const { isScannerOpen, closeScanner, showToast } = useAuth();
  const { tr } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isScannerOpen) closeScanner();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScannerOpen, closeScanner]);

  if (!isScannerOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeScanner();
      }}
    >
      <div
        className="relative w-full sm:max-w-5xl card-3d rounded-t-[28px] sm:rounded-[32px] p-4 sm:p-6 text-[#F8D5C2] h-[95dvh] sm:max-h-[95vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — sticky on mobile */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 flex-shrink-0 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center text-[#F18B49] shadow-inner">
              <Scan size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-sans font-black text-base sm:text-2xl text-[#F8D5C2] truncate">
                  {tr("AI Grading Terminal", "एआई ग्रेडिंग टर्मिनल", "एआय प्रतवारी टर्मिनल", "AI ગ્રેડિંગ ટર્મિનલ")}
                </h2>
                <span className="capsule-tag hidden sm:inline-flex">
                  {tr("DoCA CALIBRATED", "DoCA कैलिब्रेटेड", "DoCA कॅलिब्रेटेड", "DoCA કેલિબ્રેટેડ")}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#C4A494] font-mono mt-0.5 hidden sm:block">
                {tr(
                  "Rapid on-device analysis: equatorial diameter, rot %, skin gloss, and apical sprouting.",
                  "व्यास, सड़न/काला धब्बा अनुपात, छिलके की चमक व अंकुरण की त्वरित जांच।",
                  "जलद डिव्हाइसवरील विश्लेषण: व्यास, सड %, सालीची चमक आणि कोंब तपासणी.",
                  "ઝડપી ઓન-ડિવાઇસ વિશ્લેષણ: વ્યાસ, સડો %, ફોતરાંની ચમક અને અંકુરણ તપાસ."
                )}
              </p>
            </div>
          </div>

          <button
            onClick={closeScanner}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <GradingWorkflow
            onGradingComplete={(newLot) => {
              showToast(
                tr(
                  `Lot ${newLot.id} successfully graded & certified!`,
                  `लॉट ${newLot.id} सफलतापूर्वक ग्रेड किया गया!`,
                  `लॉट ${newLot.id} यशस्वीरित्या प्रतवारी व प्रमाणित केला!`,
                  `લોટ ${newLot.id} સફળતાપૂર્વક ગ્રેડ અને પ્રમાણિત થયો!`
                ),
                "success"
              );
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
