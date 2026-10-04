import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShieldCheck, Lock, Eye, CheckCircle2, Sprout, ShoppingBag, Scale, Landmark } from "lucide-react";
import { ROLES } from "../constants/rules";
import { useLanguage } from "../context/LanguageContext";

export default function DataPrivacyModal({ isOpen, onClose }) {
  const { language, tr } = useLanguage();
  const [activeRoleFilter, setActiveRoleFilter] = useState("all");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rows = [
    {
      field: tr(
        "Own lot's photo + grading",
        "स्वयं के लॉट की फोटो और ग्रेडिंग",
        "स्वतःच्या लॉटचा फोटो आणि प्रतवारी",
        "પોતાના લોટનો ફોટો અને ગ્રેડિંગ"
      ),
      farmer: tr("Full detail", "पूर्ण विवरण", "पूर्ण तपशील", "સંપૂર્ણ વિગત"),
      officer: tr("Full detail (they captured it)", "पूर्ण विवरण (उन्होंने ही कैप्चर किया)", "पूर्ण तपशील (त्यांनीच नोंदवला)", "સંપૂર્ણ વિગત (તેમણે જ નોંધ્યું)"),
      retailer: tr(
        "Not shown — only the grade summary, no farmer identity",
        "नहीं दिखाया गया — केवल ग्रेड सारांश, कोई किसान पहचान नहीं",
        "दाखवले जात नाही — फक्त प्रतवारी सारांश, शेतकरी ओळख नाही",
        "દર્શાવવામાં આવતું નથી — માત્ર ગ્રેડ સારાંશ, ખેડૂત ઓળખ નહીં"
      ),
      gov: tr("Only if opened via a dispute", "केवल तभी यदि विवाद के माध्यम से खोला जाए", "केवळ जर तक्रारीद्वारे उघडले असेल तरच", "માત્ર ત્યારે જ જો વિવાદ દ્વારા ખોલવામાં આવે")
    },
    {
      field: tr("Farmer's name / contact", "किसान का नाम / संपर्क नंबर", "शेतकऱ्याचे नाव / संपर्क क्रमांक", "ખેડૂતનું નામ / સંપર્ક નંબર"),
      farmer: tr("Own identity", "स्वयं की पहचान", "स्वतःची ओळख", "પોતાની ઓળખ"),
      officer: tr("Yes (they're logging it at intake)", "हाँ (आवक पर दर्ज करते समय)", "होय (आवक नोंदवताना)", "હા (આવક સમયે નોંધણી કરતી વખતે)"),
      retailer: tr(
        "NEVER — anonymized as 'Lot #1234, Nashik region'",
        "कभी नहीं — 'लॉट #1234, नासिक क्षेत्र' के रूप में अज्ञात",
        "कधीच नाही — 'लॉट #१२३४, नाशिक परिसर' म्हणून निनावी",
        "ક્યારેય નહીં — 'લોટ #૧૨૩૪, નાસિક પ્રદેશ' તરીકે ગુપ્ત"
      ),
      gov: tr("Yes, only inside a dispute record", "हाँ, केवल विवाद रिकॉर्ड के भीतर", "होय, केवळ वाद नोंदीमध्ये", "હા, માત્ર વિવાદ નોંધણીમાં")
    },
    {
      field: tr("% Grade A / URS / Reject", "% ग्रेड 'अ' / यूआरएस / अस्वीकृत", "% ग्रेड 'अ' / यूआरएस / नाकारलेले", "% ગ્રેડ 'અ' / યુઆઆરએસ / નકારેલ"),
      farmer: tr("Yes, their own lots only", "हाँ, केवल अपने लॉट", "होय, फक्त स्वतःचे लॉट्स", "હા, માત્ર પોતાના લોટ્સ"),
      officer: tr("Yes, all lots at their centre", "हाँ, अपने केंद्र के सभी लॉट", "होय, केंद्रावरील सर्व लॉट्स", "હા, પોતાના કેન્દ્રના તમામ લોટ્સ"),
      retailer: tr("Yes, for any lot listed in the marketplace", "हाँ, बाज़ार में सूचीबद्ध किसी भी लॉट के लिए", "होय, बाजारातील कोणत्याही लॉटसाठी", "હા, બજારમાં સૂચિબદ્ધ કોઈપણ લોટ માટે"),
      gov: tr("Yes, aggregated across all centres", "हाँ, सभी केंद्रों में एकत्रित", "होय, सर्व केंद्रांमधील एकत्रित माहिती", "હા, તમામ કેન્દ્રોની એકંદર માહિતી")
    },
    {
      field: tr("Price paid", "भुगतान किया गया मूल्य", "दिलेली रक्कम / भाव", "ચૂકવેલ ભાવ"),
      farmer: tr("Yes, their own", "हाँ, अपना स्वयं का", "होय, स्वतःचे", "હા, પોતાનું"),
      officer: tr("Yes, entered by them", "हाँ, उनके द्वारा दर्ज किया गया", "होय, त्यांनी नोंदवलेले", "હા, તેમણે નોંધેલ"),
      retailer: tr("Not applicable (they're buying, not viewing procurement price)", "लागू नहीं (वे खरीद रहे हैं, खरीद मूल्य नहीं देख रहे)", "लागू नाही (ते खरेदी करत आहेत)", "લાગુ નથી (તેઓ ખરીદી રહ્યા છે)"),
      gov: tr("Yes, aggregated for policy analysis", "हाँ, नीति विश्लेषण हेतु एकत्रित", "होय, धोरणात्मक विश्लेषणासाठी", "હા, નીતિગત વિશ્લેષણ માટે")
    },
    {
      field: tr("Other farmers' individual lots", "अन्य किसानों के व्यक्तिगत लॉट", "इतर शेतकऱ्यांचे वैयक्तिक लॉट्स", "અન્ય ખેડૂતોના વ્યક્તિગત લોટ્સ"),
      farmer: tr("NEVER", "कभी नहीं", "कधीच नाही", "ક્યારેય નહીં"),
      officer: tr("Only at their own centre", "केवल अपने केंद्र पर", "फक्त स्वतःच्या केंद्रावर", "માત્ર પોતાના કેન્દ્ર પર"),
      retailer: tr("Never individually — only in aggregate marketplace listings", "व्यक्तिगत रूप से कभी नहीं — केवल समग्र बाज़ार सूची में", "वैयक्तिक नाही — फक्त बाजारातील समग्र यादीत", "વ્યક્તિગત રીતે નહીં — માત્ર બજારની સૂચિમાં"),
      gov: tr("Only via aggregate dashboards or a specific dispute", "केवल समग्र डैशबोर्ड या विशिष्ट विवाद के माध्यम से", "फक्त डॅशबोर्ड किंवा विशिष्ट वादात", "માત્ર એકંદર ડેશબોર્ડ કે વિવાદમાં")
    },
    {
      field: tr("Cross-centre / state-wide trends", "अंतर-केंद्र / राज्यव्यापी रुझान", "केंद्रांमधील / राज्यव्यापी कल", "કેન્દ્રો વચ્ચેના / રાજ્યવ્યાપી પ્રવાહ"),
      farmer: tr("NEVER", "कभी नहीं", "कधीच नाही", "ક્યારેય નહીં"),
      officer: tr("NEVER — only their centre", "कभी नहीं — केवल उनका केंद्र", "कधीच नाही — फक्त त्यांचे केंद्र", "ક્યારેય નહીં — માત્ર તેમનું કેન્દ્ર"),
      retailer: tr("NEVER", "कभी नहीं", "कधीच नाही", "ક્યારેય નહીં"),
      gov: tr("YES — this is their entire reason to use the app", "हाँ — ऐप का उपयोग करने का मुख्य कारण", "होय — प्रशासकीय देखरेखीचा मुख्य हेतू", "હા — પ્રશાસનિક દેખરેખનો મુખ્ય હેતુ")
    },
    {
      field: tr("Dispute detail (photo + rule breakdown)", "विवाद विवरण (फोटो + नियम विभाजन)", "वाद तपशील (फोटो + नियमांचे विश्लेषण)", "વિવાદ વિગત (ફોટો + નિયમ વિશ્લેષણ)"),
      farmer: tr("Their own disputes only", "केवल अपने स्वयं के विवाद", "फक्त स्वतःच्या तक्रारी", "માત્ર પોતાની ફરિયાદો"),
      officer: tr("Disputes raised at their centre", "उनके केंद्र पर उठाए गए विवाद", "त्यांच्या केंद्रावरील वाद", "તેમના કેન્દ્ર પર નોંધાયેલ વિવાદ"),
      retailer: tr("NEVER", "कभी नहीं", "कधीच नाही", "ક્યારેય નહીં"),
      gov: tr("All disputes, any centre", "सभी विवाद, किसी भी केंद्र के", "सर्व वाद, कोणत्याही केंद्राचे", "તમામ વિવાદો, કોઈપણ કેન્દ્રના")
    },
    {
      field: tr("Editable grading rule thresholds", "संपादन योग्य ग्रेडिंग नियम सीमाएं", "बदलण्याजोगे प्रतवारी नियम निकष", "સુધારી શકાય તેવા ગ્રેડિંગ નિયમ માપદંડ"),
      farmer: tr("NEVER", "कभी नहीं", "कधीच नाही", "ક્યારેય નહીં"),
      officer: tr("NEVER (read-only reference)", "कभी नहीं (केवल संदर्भ हेतु पठन)", "कधीच नाही (फक्त वाचनासाठी)", "ક્યારેય નહીં (માત્ર સંદર્ભ વાંચન)"),
      retailer: tr("NEVER", "कभी नहीं", "कधीच नाही", "ક્યારેય નહીં"),
      gov: tr("YES — the only role that can propose rule changes", "हाँ — एकमात्र भूमिका जो नियम परिवर्तन प्रस्तावित कर सकती है", "होय — नियम बदल करण्याचा अधिकार असलेले एकमेव पद", "હા — નિયમ ફેરફાર પ્રસ્તાવિત કરી શકે તેવી એકમાત્ર ભૂમિકા")
    }
  ];

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-5xl card-3d rounded-[32px] p-6 sm:p-8 text-[#F8D5C2] max-h-[92vh] overflow-y-auto my-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center shadow-inner">
              <ShieldCheck size={24} className="text-[#F18B49]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-xl sm:text-2xl text-[#F8D5C2]">
                  {tr(
                    "Data Abstraction & Zero-Leakage Privacy Architecture",
                    "डेटा पृथक्करण व शून्य-रिसाव गोपनीयता वास्तुकला",
                    "माहिती गोपनीयता व शून्य-गळती सुरक्षितता रचना",
                    "ડેટા ગોપનીયતા અને શૂન્ય-લીકેજ સુરક્ષા માળખું"
                  )}
                </h2>
                <span className="capsule-tag">
                  {tr("DoCA PROTOCOL", "DoCA प्रोटोकॉल", "DoCA प्रोटोकॉल", "DoCA પ્રોટોકોલ")}
                </span>
              </div>
              <p className="text-xs text-[#C4A494] mt-0.5">
                {tr(
                  "The core principle: Farmer = own data only. Officer = their centre only. Retailer = anonymized market data only. Government = aggregated by default, drill-down only on dispute.",
                  "मूल सिद्धांत: किसान = केवल अपना डेटा। अधिकारी = केवल अपना केंद्र। व्यापारी = केवल अज्ञात बाज़ार डेटा। सरकार = डिफ़ॉल्ट रूप से समग्र, केवल विवाद पर विस्तृत जांच।",
                  "मूळ तत्त्व: शेतकरी = फक्त स्वतःचा डेटा. अधिकारी = फक्त स्वतःचे केंद्र. व्यापारी = फक्त निनावी बाजार माहिती. शासन = एकत्रित सांख्यिकी, फक्त वादात सखोल तपास.",
                  "મૂળ સિદ્ધાંત: ખેડૂત = માત્ર પોતાનો ડેટા. અધિકારી = માત્ર પોતાનું કેન્દ્ર. વેપારી = માત્ર ગુપ્ત બજાર ડેટા. સરકાર = એકંદર ડેટા, માત્ર વિવાદમાં ઊંડી તપાસ."
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Highlight Selector */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <span className="text-xs font-mono text-[#C4A494] whitespace-nowrap">
            {tr("Filter view:", "फ़िल्टर दृश्य:", "दृश्य निवडा:", "ફિલ્ટર દ્રશ્ય:")}
          </span>
          <button
            onClick={() => setActiveRoleFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeRoleFilter === "all" ? "btn-3d-lime" : "btn-3d-dark"
            }`}
          >
            {tr("All Roles Matrix", "सभी भूमिकाएं मैट्रिक्स", "सर्व भूमिका मॅट्रिक्स", "તમામ ભૂમિકાઓ મેટ્રિક્સ")}
          </button>
          <button
            onClick={() => setActiveRoleFilter("farmer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeRoleFilter === "farmer" ? "btn-3d-lime" : "btn-3d-dark"
            }`}
          >
            <Sprout size={13} />
            <span>{tr("Farmer Protection", "किसान सुरक्षा", "शेतकरी संरक्षण", "ખેડૂત સુરક્ષા")}</span>
          </button>
          <button
            onClick={() => setActiveRoleFilter("officer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeRoleFilter === "officer" ? "btn-3d-lime" : "btn-3d-dark"
            }`}
          >
            <Scale size={13} />
            <span>{tr("Officer Centre Scope", "अधिकारी केंद्र दायरा", "अधिकारी केंद्र व्याप्ती", "અધિકારી કેન્દ્ર વિસ્તાર")}</span>
          </button>
          <button
            onClick={() => setActiveRoleFilter("retailer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeRoleFilter === "retailer" ? "btn-3d-lime" : "btn-3d-dark"
            }`}
          >
            <ShoppingBag size={13} />
            <span>{tr("Retailer Anonymization", "व्यापारी अनामिकता", "व्यापारी निनावीपणा", "વેપારી ગોપનીયતા")}</span>
          </button>
          <button
            onClick={() => setActiveRoleFilter("gov")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeRoleFilter === "gov" ? "btn-3d-lime" : "btn-3d-dark"
            }`}
          >
            <Landmark size={13} />
            <span>{tr("Government Macro Scope", "सरकारी व्यापक दायरा", "शासकीय व्यापक व्याप्ती", "સરકારી વ્યાપક વિસ્તાર")}</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-white/[0.08] rounded-2xl bg-[#000000]/90 shadow-inner">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#180915] text-[#C4A494]">
                <th className="py-3 px-4">{tr("Data Dimension", "डेटा आयाम", "माहिती निकष", "ડેટા પરિમાણ")}</th>
                <th className={`py-3 px-4 transition-colors ${activeRoleFilter === "farmer" || activeRoleFilter === "all" ? "text-[#F18B49]" : "text-[#C4A494]/50"}`}>
                  {tr("Farmer Sees", "किसान देखता है", "शेतकरी पाहतो", "ખેડૂત જુએ છે")}
                </th>
                <th className={`py-3 px-4 transition-colors ${activeRoleFilter === "officer" || activeRoleFilter === "all" ? "text-[#F18B49]" : "text-[#C4A494]/50"}`}>
                  {tr("Officer Sees", "अधिकारी देखता है", "अधिकारी पाहतो", "અધિકારી જુએ છે")}
                </th>
                <th className={`py-3 px-4 transition-colors ${activeRoleFilter === "retailer" || activeRoleFilter === "all" ? "text-[#EB87A9]" : "text-[#C4A494]/50"}`}>
                  {tr("Retailer Sees", "व्यापारी देखता है", "व्यापारी पाहतो", "વેપારી જુએ છે")}
                </th>
                <th className={`py-3 px-4 transition-colors ${activeRoleFilter === "gov" || activeRoleFilter === "all" ? "text-[#FF4D4D]" : "text-[#C4A494]/50"}`}>
                  {tr("Government Sees", "सरकार देखती है", "शासन पाहते", "સરકાર જુએ છે")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#F8D5C2] font-sans">
                    {row.field}
                  </td>
                  <td className={`py-3 px-4 ${row.farmer === "NEVER" || row.farmer === "कभी नहीं" || row.farmer === "कधीच नाही" || row.farmer === "ક્યારેય નહીં" ? "text-[#FF4D4D] font-bold" : "text-[#F18B49]"} ${activeRoleFilter === "farmer" ? "bg-[#F18B49]/10 font-bold" : ""}`}>
                    {row.farmer}
                  </td>
                  <td className={`py-3 px-4 ${row.officer.includes("NEVER") || row.officer.includes("कभी नहीं") || row.officer.includes("कधीच नाही") || row.officer.includes("ક્યારેય નહીં") ? "text-[#FF4D4D] font-bold" : "text-[#F8D5C2]"} ${activeRoleFilter === "officer" ? "bg-[#F18B49]/10 font-bold" : ""}`}>
                    {row.officer}
                  </td>
                  <td className={`py-3 px-4 ${row.retailer.includes("NEVER") || row.retailer.includes("कभी नहीं") || row.retailer.includes("कधीच नाही") || row.retailer.includes("ક્યારેય નહીં") ? "text-[#FF4D4D] font-bold" : "text-[#EB87A9]"} ${activeRoleFilter === "retailer" ? "bg-[#EB87A9]/10 font-bold" : ""}`}>
                    {row.retailer}
                  </td>
                  <td className={`py-3 px-4 ${row.gov.includes("YES") || row.gov.includes("हाँ") || row.gov.includes("होय") || row.gov.includes("હા") ? "text-[#FF4D4D] font-bold" : "text-[#C4A494]"} ${activeRoleFilter === "gov" ? "bg-[#FF4D4D]/10 font-bold" : ""}`}>
                    {row.gov}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote rationale */}
        <div className="mt-4 p-4 rounded-2xl bg-[#120710] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#C4A494]">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-[#F18B49]" />
            <span>
              {tr(
                "Zero farmer phone numbers or private payouts leaked to buyers. Complete mandi trust guarantee.",
                "खरीदारों को कोई भी किसान का फोन नंबर या व्यक्तिगत भुगतान लीक नहीं होता। पूर्ण मंडी विश्वास की गारंटी।",
                "खरेदीदारांना कोणताही शेतकरी फोन नंबर किंवा वैयक्तिक रक्कम उघड होत नाही. पूर्ण विश्वासाची हमी.",
                "ખરીદદારોને કોઈ પણ ખેડૂતનો ફોન નંબર કે અંગત ચુકવણી લીક થતી નથી. સંપૂર્ણ વિશ્વાસની ખાતરી."
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 btn-3d-lime text-xs cursor-pointer self-end sm:self-auto"
          >
            {tr("Understood", "समझ गया", "समजले", "સમજાયું")}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
