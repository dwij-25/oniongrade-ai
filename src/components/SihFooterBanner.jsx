import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Award, GitBranch, ExternalLink, ShieldCheck, Sparkles, Cpu, CheckCircle2 } from "lucide-react";

export default function SihFooterBanner() {
  const { tr } = useLanguage();

  return (
    <div className="w-full bg-[#0a0308] border-t border-[#F18B49]/30 relative overflow-hidden text-[#F8D5C2]">
      {/* Subtle tricolor gradient accent along the top edge */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] opacity-80" />

      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#5F1C47]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-[#F18B49]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        
        {/* Main Grid Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Official SIH Badging & PS Details (7 cols) */}
          <div className="lg:col-span-8 space-y-3">
            
            <div className="flex flex-wrap items-center gap-2">
              {/* SIH Official Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/40 text-[#FF9933] text-[11px] font-mono font-bold tracking-tight shadow-sm">
                <Award size={13} className="text-[#FF9933]" />
                <span>SMART INDIA HACKATHON 2026</span>
              </div>

              {/* Problem Statement ID */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5F1C47]/40 border border-[#EB87A9]/40 text-[#EB87A9] text-[11px] font-mono font-bold">
                <span>PS ID:</span>
                <span className="text-[#F8D5C2] tracking-wider font-mono">SIH26031</span>
              </div>

              {/* Theme & Category */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-[#C4A494]">
                <Cpu size={11} className="text-[#F18B49]" />
                <span>{tr("Theme: Smart Automation", "थीम: स्मार्ट ऑटोमेशन", "थीम: स्मार्ट ऑटोमेशन", "થીમ: સ્માર્ટ ઓટોમેશન")}</span>
                <span>•</span>
                <span>{tr("Software Edition", "सॉफ्टवेयर संस्करण", "सॉफ्टवेअर आवृत्ती", "સોફ્ટવેર આવૃત્તિ")}</span>
              </div>

              {/* Team Name */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F18B49]/15 border border-[#F18B49]/30 text-[#F18B49] text-[11px] font-mono font-bold">
                <span>{tr("Team:", "टीम:", "संघ:", "ટીમ:")}</span>
                <span className="text-[#F8D5C2]">Unskilled coderzzz</span>
              </div>
            </div>

            {/* Official Problem Statement Title */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#C4A494] font-semibold">
                {tr("OFFICIAL PROBLEM STATEMENT", "आधिकारिक समस्या विवरण", "अधिकृत समस्या विधान", "સત્તાવાર સમસ્યા નિવેદન")}
              </div>
              <p className="text-xs sm:text-sm font-sans font-medium text-[#F8D5C2] mt-0.5 leading-relaxed">
                &ldquo;{tr(
                  "Quality assessment and grading of onions are often subjective and vary across procurement centers, resulting in disputes and inconsistencies.",
                  "प्याज़ का गुणवत्ता मूल्यांकन और ग्रेडिंग अक्सर व्यक्तिपरक होता है और विभिन्न खरीद केंद्रों पर भिन्न होता है, जिसके परिणामस्वरूप विवाद और विसंगतियां पैदा होती हैं।",
                  "कांद्याचे गुणवत्ता मूल्यांकन आणि प्रतवारी अनेकदा व्यक्तिनिष्ठ असते आणि विविध खरेदी केंद्रांवर वेगवेगळी असते, ज्यामुळे वाद आणि विसंगती निर्माण होतात.",
                  "ડુંગળીની ગુણવત્તાનું મૂલ્યાંકન અને ગ્રેડિંગ ઘણીવાર વ્યક્તિલક્ષી હોય છે અને ખરીદ કેન્દ્રો વચ્ચે બદલાય છે, જેના પરિણામે વિવાદો અને અસંગતતાઓ સર્જાય છે."
                )}&rdquo;
              </p>
            </div>

            {/* Sub-line: Stakeholder Ministry & Mandate */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#C4A494]">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-[#138808]" />
                <span>{tr("Dept. of Consumer Affairs (DoCA)", "उपभोक्ता मामले विभाग (DoCA)", "ग्राहक व्यवहार विभाग (DoCA)", "ગ્રાહક બાબતોનો વિભાગ (DoCA)")}</span>
              </span>
              <span>•</span>
              <span>{tr("Price Stabilization Fund (PSF)", "मूल्य स्थिरीकरण कोष (PSF)", "किंमत स्थिरीकरण निधी (PSF)", "કિંમત સ્થિરીકરણ ભંડોળ (PSF)")}</span>
              <span>•</span>
              <span>{tr("National Mandi e-NAM Plug-in", "राष्ट्रीय मंडी e-NAM प्लग-इन", "राष्ट्रीय बाजार समिती e-NAM प्लग-इन", "રાષ્ટ્રીય મંડી e-NAM પ્લગ-ઇન")}</span>
            </div>

          </div>

          {/* Right Column: Direct Artifact Quick-Links for Evaluators (4 cols) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
            
            {/* GitHub Repository Link */}
            <a
              href="https://github.com/dwij-25/oniongrade-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-[#140711] border border-white/10 hover:border-[#F18B49]/50 transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F8D5C2] group-hover:text-[#F18B49] transition-colors">
                  <GitBranch size={16} />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#F8D5C2] group-hover:text-[#F18B49] transition-colors">
                    GitHub Repository
                  </div>
                  <div className="text-[10px] font-mono text-[#C4A494]">
                    dwij-25/oniongrade-ai • SIH 2026
                  </div>
                </div>
              </div>
              <ExternalLink size={14} className="text-[#C4A494] group-hover:text-[#F18B49] group-hover:translate-x-0.5 transition-all" />
            </a>

            {/* Live Prototype Production Link */}
            <a
              href="https://oniongrade-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-gradient-to-r from-[#5F1C47]/40 to-[#140711] border border-[#EB87A9]/30 hover:border-[#EB87A9] transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EB87A9]/15 border border-[#EB87A9]/30 flex items-center justify-center text-[#EB87A9]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#F8D5C2] group-hover:text-[#EB87A9] transition-colors">
                    {tr("Live Vercel Production", "लाइव वर्सेल प्रोडक्शन", "थेट व्हर्सेल प्रोडक्शन", "લાઈવ વર્સેલ પ્રોડક્શન")}
                  </div>
                  <div className="text-[10px] font-mono text-[#EB87A9]">
                    oniongrade-ai.vercel.app
                  </div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" title="Production Online" />
            </a>

          </div>

        </div>

      </div>
    </div>
  );
}
