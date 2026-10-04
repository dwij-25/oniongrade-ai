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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeScanner();
      }}
    >
      <div
        className="relative w-full max-w-5xl card-3d rounded-[32px] p-6 text-[#F8D5C2] max-h-[95vh] overflow-y-auto my-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center text-[#F18B49] shadow-inner">
              <Scan size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-xl sm:text-2xl text-[#F8D5C2]">
                  {tr("Optical AI Onion Grading Terminal", "ऑप्टिकल एआई प्याज ग्रेडिंग टर्मिनल", "ऑप्टिकल एआय कांदा प्रतवारी टर्मिनल", "ઓપ્ટિકલ AI ડુંગળી ગ્રેડિંગ ટર્મિનલ")}
                </h2>
                <span className="capsule-tag">
                  {tr("DoCA CALIBRATED", "DoCA कैलिब्रेटेड", "DoCA कॅलिब्रेटेड", "DoCA કેલિબ્રેટેડ")}
                </span>
              </div>
              <p className="text-xs text-[#C4A494] font-mono mt-0.5">
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
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

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
    </div>,
    document.body
  );
}
