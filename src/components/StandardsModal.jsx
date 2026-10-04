import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Award, CheckCircle2, AlertTriangle, XCircle, Info, ShieldCheck, FileText } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { DEFAULT_GRADE_CONFIG } from "../constants/rules";

export default function StandardsModal({ isOpen, onClose }) {
  const { tr } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0E050C] border-2 border-[#F18B49]/40 shadow-[0_30px_90px_rgba(0,0,0,0.98)] text-[#F8D5C2] p-5 sm:p-7 relative custom-scrollbar animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F8D5C2] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-white/[0.08] pb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-[#F18B49]/20 border border-[#F18B49]/40 flex items-center justify-center text-[#F18B49] flex-shrink-0">
            <Award size={20} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#180815] border border-white/10 text-[10px] font-mono text-[#F18B49] font-bold uppercase tracking-wider mb-1">
              <span>DoCA & ICAR-DOGR {DEFAULT_GRADE_CONFIG.version}</span>
            </div>
            <h2 className="font-sans font-black text-xl sm:text-2xl text-[#F8D5C2]">
              {tr(
                "National Onion Quality & Grading Standards",
                "राष्ट्रीय प्याज गुणवत्ता एवं ग्रेडिंग मानक",
                "राष्ट्रीय कांदा गुणवत्ता आणि प्रतवारी मानके",
                "રાષ્ટ્રીય ડુંગળી ગુણવત્તા અને ગ્રેડિંગ ધોરણો"
              )}
            </h2>
            <p className="text-xs text-[#C4A494] mt-0.5">
              {tr(
                "Calibrated against Department of Consumer Affairs (DoCA) & ICAR-Directorate of Onion and Garlic Research tolerances.",
                "उपभोक्ता मामले विभाग (DoCA) और आईसीएआर-प्याज एवं लहसुन अनुसंधान निदेशालय की सहनशीलता पर आधारित।",
                "ग्राहक व्यवहार विभाग (DoCA) आणि ICAR कांदा व लसूण संशोधन संचालनालयाच्या निकषांनुसार प्रमाणित.",
                "ગ્રાહક બાબતોના વિભાગ (DoCA) અને ICAR-ડુંગળી અને લસણ સંશોધન નિયામકના ધોરણો અનુસાર કેલિબ્રેટેડ."
              )}
            </p>
          </div>
        </div>

        {/* Grade Standard Cards Grid */}
        <div className="space-y-4">
          {/* Grade A */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#150812] border border-[#F18B49]/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F18B49]" />
                <h3 className="font-sans font-black text-base sm:text-lg text-[#F18B49]">
                  {tr("Grade A — Super Premium / Export Grade", "ग्रेड 'अ' — सुपर प्रीमियम / निर्यात ग्रेड", "ग्रेड 'अ' — सुपर प्रीमियम / निर्यात प्रत", "ગ્રેડ 'અ' — સુપર પ્રીમિયમ / નિકાસ ગ્રેડ")}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#F18B49]/15 border border-[#F18B49]/30 text-[#F18B49] text-xs font-mono font-bold w-fit">
                {tr("Top APMC Mandi Rate", "उच्चतम मंडी भाव", "सर्वोच्च बाजार समिती भाव", "મહત્તમ માર્કેટ યાર્ડ ભાવ")}
              </span>
            </div>

            <p className="text-xs text-[#F8D5C2]/90 leading-relaxed mb-3">
              {DEFAULT_GRADE_CONFIG.rules.gradeA.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("DIAMETER", "व्यास", "व्यास", "વ્યાસ")}</div>
                <div className="font-bold text-[#F8D5C2] mt-0.5">40 – 65 mm</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("MAX DAMAGE", "अधिकतम क्षति", "कमाल नुकसान", "મહત્તમ નુકસાન")}</div>
                <div className="font-bold text-[#F18B49] mt-0.5">≤ 2.0%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("SPROUT SCORE", "अंकुरण स्कोर", "कोंब प्रमाण", "અંકુરણ સ્કોર")}</div>
                <div className="font-bold text-[#F8D5C2] mt-0.5">≤ 0.04 (Nil)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("SHAPE SYMMETRY", "आकार एकरूपता", "आकार सममिती", "આકાર સમાનતા")}</div>
                <div className="font-bold text-[#F8D5C2] mt-0.5">&gt; 85% Globular</div>
              </div>
            </div>
          </div>

          {/* URS Grade */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#150812] border border-[#EB87A9]/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EB87A9]" />
                <h3 className="font-sans font-black text-base sm:text-lg text-[#EB87A9]">
                  {tr("URS — Domestic Regulated Standard", "यूआरएस — घरेलू नियमित मानक", "यूआरएस — स्थानिक बाजार मानक", "યુઆરએસ — સ્થાનિક નિયમિત ધોરણ")}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#EB87A9]/15 border border-[#EB87A9]/30 text-[#EB87A9] text-xs font-mono font-bold w-fit">
                {tr("Fair Mandi Price", "मानक मंडी भाव", "मानक बाजार भाव", "સામાન્ય બજાર ભાવ")}
              </span>
            </div>

            <p className="text-xs text-[#F8D5C2]/90 leading-relaxed mb-3">
              {DEFAULT_GRADE_CONFIG.rules.urs.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("DIAMETER", "व्यास", "व्यास", "વ્યાસ")}</div>
                <div className="font-bold text-[#F8D5C2] mt-0.5">25 – 40 mm</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("MAX DAMAGE", "अधिकतम क्षति", "कमाल नुकसान", "મહત્તમ નુકસાન")}</div>
                <div className="font-bold text-[#EB87A9] mt-0.5">≤ 12.0%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("SPROUT SCORE", "अंकुरण स्कोर", "कोंब प्रमाण", "અંકુરણ સ્કોર")}</div>
                <div className="font-bold text-[#F8D5C2] mt-0.5">≤ 0.20 (Minor)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("SHAPE SYMMETRY", "आकार एकरूपता", "आकार सममिती", "આકાર સમાનતા")}</div>
                <div className="font-bold text-[#F8D5C2] mt-0.5">&gt; 68% Uniform</div>
              </div>
            </div>
          </div>

          {/* Reject / C Grade */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#150812] border border-red-500/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <h3 className="font-sans font-black text-base sm:text-lg text-red-300">
                  {tr("Reject / C-Grade — Spoilage / Industrial Only", "अस्वीकृत / सी-ग्रेड — खराबी / केवल औद्योगिक", "नाकारलेले / सी-ग्रेड — सड / फक्त प्रक्रिया", "નકારેલ / સી-ગ્રેડ — બગાડ / માત્ર ઔદ્યોગિક")}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono font-bold w-fit">
                {tr("Distress / Disposal", "कम दर / निस्तारण", "कमी दर / विल्हेवाट", "ઓછો ભાવ / નિકાલ")}
              </span>
            </div>

            <p className="text-xs text-[#F8D5C2]/90 leading-relaxed mb-3">
              {DEFAULT_GRADE_CONFIG.rules.reject.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("DIAMETER", "व्यास", "व्यास", "વ્યાસ")}</div>
                <div className="font-bold text-red-400 mt-0.5">&lt; 25 mm (Pinhead)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("MIN DAMAGE", "न्यूनतम क्षति", "किमान नुकसान", "ન્યૂનતમ નુકસાન")}</div>
                <div className="font-bold text-red-400 mt-0.5">&gt; 12.0% Rot</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("SPROUT SCORE", "अंकुरण स्कोर", "कोंब प्रमाण", "અંકુરણ સ્કોર")}</div>
                <div className="font-bold text-red-400 mt-0.5">&gt; 0.20 (Vegetative)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-[#C4A494]">{tr("PATHOLOGY", "रोग विकृति", "रोग प्रकार", "રોગ પ્રકાર")}</div>
                <div className="font-bold text-red-400 mt-0.5">Aspergillus / Smut</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#C4A494] font-mono">
          <div className="flex items-center gap-1.5 text-[#F18B49]">
            <ShieldCheck size={14} />
            <span>{tr("Automated Optical AI Caliper Verification", "स्वचालित ऑप्टिकल AI कैलीपर सत्यापन", "स्वयंचलित ऑप्टिकल AI व्हर्नियर पडताळणी", "સ્વચાલિત ઓપ્ટિકલ AI કેલિપર ચકાસણી")}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#F18B49] text-black font-sans font-bold hover:bg-[#FAAC78] transition-all cursor-pointer"
          >
            {tr("Close", "बंद करें", "बंद करा", "બંધ કરો")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
