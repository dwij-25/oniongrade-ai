import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLots, savePurchaseRequest } from "../services/storage";
import GradingWorkflow from "../components/GradingWorkflow";
import {
  ShoppingBag,
  Search,
  X,
  MapPin,
  Box,
  FileCheck2
} from "lucide-react";

export default function RetailerDashboard() {
  const { user, showToast } = useAuth();
  const { language, tr } = useLanguage();
  const isHindi = language === "hi";
  const [lots, setLots] = useState([]);
  
  const [minGradeA, setMinGradeA] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("highest_quality");

  const [inspectingLot, setInspectingLot] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && inspectingLot) setInspectingLot(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inspectingLot]);

  useEffect(() => {
    loadLots();
  }, []);

  const loadLots = () => {
    const allLots = getLots();
    setLots(allLots);
  };

  const filteredLots = lots.filter((lot) => {
    const gradeAPct = lot.stats?.gradeAPct || 0;
    if (gradeAPct < minGradeA) return false;

    if (selectedRegion !== "all") {
      const mandiMatch = (lot.mandiName || "").toLowerCase().includes(selectedRegion.toLowerCase());
      if (!mandiMatch) return false;
    }

    const avgDia = lot.averageDiameterMm || lot.stats?.avgDiameterMm || 0;
    if (selectedSizeFilter === "medium" && (avgDia < 40 || avgDia > 65)) return false;
    if (selectedSizeFilter === "large" && avgDia <= 55) return false;
    if (selectedSizeFilter === "small" && avgDia >= 40) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const textMatch =
        lot.id.toLowerCase().includes(q) ||
        (lot.variety || "").toLowerCase().includes(q) ||
        (lot.mandiName || "").toLowerCase().includes(q);
      if (!textMatch) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "highest_quality") {
      return (b.stats?.gradeAPct || 0) - (a.stats?.gradeAPct || 0);
    }
    if (sortBy === "lowest_reject") {
      return (a.stats?.rejectPct || 0) - (b.stats?.rejectPct || 0);
    }
    if (sortBy === "quantity") {
      return (b.quantityQuintals || 0) - (a.quantityQuintals || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handlePurchaseRequest = (lot, e) => {
    if (e) e.stopPropagation();
    savePurchaseRequest({
      lotId: lot.id,
      retailerName: user?.name || "Sunil Agrawal",
      retailerCompany: user?.company || "Mahalaxmi Agro Traders",
      quantityQuintals: lot.quantityQuintals || 40,
      offeredPrice: lot.estimatedPricePerQuintal || 2800,
      mandiName: lot.mandiName
    });

    showToast(
      tr(
        `Purchase Request Transmitted! Lot ${lot.id} reserved under trader bidding protocol.`,
        `खरीद अनुरोध भेजा गया! लॉट ${lot.id} बोली प्रोटोकॉल के तहत आरक्षित।`,
        `खरेदी विनंती पाठवली! लॉट ${lot.id} व्यापारी बोली अंतर्गत आरक्षित.`,
        `ખરીદ વિનંતી મોકલાઈ! લોટ ${lot.id} વેપારી બોલી હેઠળ અનામત.`
      ),
      "success"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-[#F8D5C2]">
      
      {/* Marketplace Banner */}
      <div id="overview" className="card-3d p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 scroll-mt-24">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#EB87A9]/15 border border-[#EB87A9]/40 flex items-center justify-center shadow-lg shadow-[#EB87A9]/15">
            <ShoppingBag size={28} className="text-[#EB87A9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-black text-xl sm:text-3xl text-[#F8D5C2]">
                {tr("Certified Mandi Marketplace", "प्रमाणित मंडी बाज़ार", "प्रमाणित बाजार समिती बाजारपेठ", "પ્રમાણિત માર્કેટ યાર્ડ બજાર")}
              </h1>
              <span className="capsule-tag-yellow">
                {tr("TRADER DESK", "व्यापारी डेस्क", "व्यापारी डेस्क", "વેપારી ડેસ્ક")}
              </span>
            </div>
            <p className="text-xs text-[#C4A494] mt-1">
              {tr(
                "Browse AI-graded onion lots across Maharashtra, Gujarat & Andhra Pradesh APMCs.",
                "महाराष्ट्र, गुजरात और आंध्र प्रदेश एपीएमसी में एआई-ग्रेड किए गए प्याज लॉट्स ब्राउज़ करें।",
                "महाराष्ट्र, गुजरात आणि आंध्र प्रदेश बाजार समित्यांमधील एआय-प्रतवारी केलेले कांदा लॉट्स तपासा.",
                "મહારાષ્ટ્ર, ગુજરાત અને આંધ્ર પ્રદેશ માર્કેટ યાર્ડના એઆઈ-ગ્રેડ થયેલ ડુંગળી લોટ જુઓ."
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494]">{tr("ACTIVE LOTS", "सक्रिय लॉट्स", "सक्रिय लॉट्स", "સક્રિય લોટ્સ")}</div>
            <div className="text-base font-black text-[#F8D5C2] font-tabular">
              {lots.length} {tr("Certified", "प्रमाणित", "प्रमाणित", "પ્રમાણિત")}
            </div>
          </div>
          <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494]">{tr("DAILY BENCHMARK", "दैनिक बेंचमार्क", "दैनिक बेंचमार्क", "દૈનિક બેન્ચમાર્ક")}</div>
            <div className="text-base font-black text-[#F18B49] font-tabular">
              ₹2,450 / {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div id="filters" className="card-3d p-5 space-y-4 scroll-mt-24">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr(
                "Search by Lot ID, APMC region, or onion variety...",
                "लॉट आईडी, एपीएमसी क्षेत्र या प्याज की किस्म से खोजें...",
                "लॉट आयडी, बाजार समिती किंवा कांद्याच्या वाणानुसार शोधा...",
                "લોટ આઈડી, માર્કેટ યાર્ડ અથવા ડુંગળીની જાત મુજબ શોધો..."
              )}
              className="w-full input-3d pl-10 pr-3 py-2.5 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C4A494] hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#C4A494] whitespace-nowrap">{tr("Sort:", "क्रमबद्ध करें:", "क्रमवारी:", "ક્રમબદ્ધ:")}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-3d px-3 py-2 text-xs font-mono"
            >
              <option value="highest_quality">{tr("Highest % Grade A", "उच्चतम % ग्रेड 'अ'", "सर्वोच्च % ग्रेड 'अ'", "સૌથી વધુ % ગ્રેડ 'અ'")}</option>
              <option value="lowest_reject">{tr("Lowest Spoilage %", "न्यूनतम खराबी %", "किमान खराब %", "ઓછામાં ઓછો બગાડ %")}</option>
              <option value="quantity">{tr("Largest Quantity (Qtl)", "अधिकतम मात्रा (क्विंटल)", "जास्तीत जास्त वजन (क्विंटल)", "સૌથી વધુ જથ્થો (ક્વિન્ટલ)")}</option>
              <option value="newest">{tr("Newest Certified Arrivals", "नवीनतम प्रमाणित आवक", "नवीनतम प्रमाणित आवक", "નવીનતમ પ્રમાણિત આવક")}</option>
            </select>
          </div>
        </div>

        {/* Filter Sliders & Selectors Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-white/[0.06]">
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#C4A494]">{tr("Min Grade A Ratio:", "न्यूनतम ग्रेड 'अ' अनुपात:", "किमान ग्रेड 'अ' प्रमाण:", "લઘુત્તમ ગ્રેડ 'અ' ગુણોત્તર:")}</span>
              <span className="font-bold text-[#F18B49]">{minGradeA}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minGradeA}
              onChange={(e) => setMinGradeA(Number(e.target.value))}
              className="w-full accent-[#F18B49] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#C4A494]/60">
              <span>{tr("Any", "कोई भी", "कोणतेही", "કોઈપણ")}</span>
              <span>50%</span>
              <span>{tr("90% Super A", "90% सुपर 'अ'", "९०% सुपर 'अ'", "૯૦% સુપર 'અ'")}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#C4A494]">{tr("Origin Mandi:", "मूल मंडी:", "मूळ बाजार समिती:", "મૂળ માર્કેટ યાર્ડ:")}</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full input-3d px-3 py-2 text-xs"
            >
              <option value="all">{tr("All Mandis & Regions", "सभी मंडियां और क्षेत्र", "सर्व बाजार समित्या व परिसर", "તમામ માર્કેટ યાર્ડ અને વિસ્તારો")}</option>
              <option value="Lasalgaon">{tr("Lasalgaon APMC (Nashik)", "लासलगांव एपीएमसी (नासिक)", "लासलगाव बाजार समिती (नाशिक)", "લાસલગાવ એપીએમસી (નાસિક)")}</option>
              <option value="Pimpalgaon">{tr("Pimpalgaon APMC (Nashik)", "पिंपलगांव एपीएमसी (नासिक)", "पिंपळगाव बाजार समिती (नाशिक)", "પિંપળગાવ એપીએમસી (નાસિક)")}</option>
              <option value="Mahuva">{tr("Mahuva APMC (Gujarat)", "महुवा एपीएमसी (गुजरात)", "महुआ बाजार समिती (गुजरात)", "મહુવા એપીએમસી (ગુજરાત)")}</option>
              <option value="Kurnool">{tr("Kurnool APMC (Andhra)", "कर्नूल एपीएमसी (आंध्र)", "कर्नूल बाजार समिती (आंध्र)", "કુર્નૂલ એપીએમસી (આંધ્ર)")}</option>
              <option value="Alwar">{tr("Alwar Mandi (Rajasthan)", "अलवर मंडी (राजस्थान)", "अलवर बाजार समिती (राजस्थान)", "અલવર મંડી (રાજસ્થાન)")}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#C4A494]">{tr("Bulb Diameter:", "कंद का व्यास:", "कांद्याचा व्यास:", "ડુંગળીનો વ્યાસ:")}</label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedSizeFilter("all")}
                className={`flex-1 py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
                  selectedSizeFilter === "all"
                    ? "btn-3d-lime"
                    : "btn-3d-dark"
                }`}
              >
                {tr("All", "सभी", "सर्व", "બધા")}
              </button>
              <button
                onClick={() => setSelectedSizeFilter("medium")}
                className={`flex-1 py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
                  selectedSizeFilter === "medium"
                    ? "btn-3d-lime"
                    : "btn-3d-dark"
                }`}
              >
                40-65mm
              </button>
              <button
                onClick={() => setSelectedSizeFilter("large")}
                className={`flex-1 py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
                  selectedSizeFilter === "large"
                    ? "btn-3d-lime"
                    : "btn-3d-dark"
                }`}
              >
                &gt;55mm
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Marketplace Graded Lots Bento Grid */}
      <div id="lots" className="space-y-3 scroll-mt-24">
        <div className="flex items-center justify-between text-xs font-mono text-[#C4A494]">
          <span className="capsule-tag-dark">
            {tr(
              `SHOWING ${filteredLots.length} VERIFIED LOTS`,
              `${filteredLots.length} सत्यापित लॉट उपलब्ध`,
              `${filteredLots.length} प्रमाणित लॉट्स उपलब्ध`,
              `${filteredLots.length} પ્રમાણિત લોટ્સ ઉપલબ્ધ`
            )}
          </span>
          {minGradeA > 0 && <span className="text-[#F18B49]">&gt;={minGradeA}% {tr("GRADE A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")}</span>}
        </div>

        {filteredLots.length === 0 ? (
          <div className="card-3d p-12 text-center space-y-3">
            <ShoppingBag size={36} className="text-[#C4A494]/40 mx-auto" />
            <h3 className="font-bold text-lg text-[#F8D5C2]">
              {tr(
                "No Lots Match Your Filter Criteria",
                "आपकी खोज के अनुसार कोई लॉट नहीं मिला",
                "आपल्या निकषांनुसार कोणतेही लॉट्स आढळले नाहीत",
                "તમારા ફિલ્ટર મુજબ કોઈ લોટ મળ્યા નથી"
              )}
            </h3>
            <p className="text-xs text-[#C4A494] max-w-sm mx-auto">
              {tr(
                "Try adjusting the Minimum Grade A slider or clearing the region filter.",
                "न्यूनतम ग्रेड 'अ' स्लाइडर को समायोजित करें या क्षेत्र फ़िल्टर रीसेट करें।",
                "किमान ग्रेड 'अ' स्लाइडर बदला किंवा परिसर फिल्टर रीसेट करा.",
                "લઘુત્તમ ગ્રેડ 'અ' સ્લાઇડર બદલો અથવા વિસ્તાર ફિલ્ટર રીસેટ કરો."
              )}
            </p>
            <button
              onClick={() => {
                setMinGradeA(0);
                setSelectedRegion("all");
                setSelectedSizeFilter("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 btn-3d-lime text-xs"
            >
              {tr("Reset Filters", "फ़िल्टर रीसेट करें", "फिल्टर रीसेट करा", "ફિલ્ટર રીસેટ કરો")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLots.map((lot) => {
              const isGradeA = lot.lotGrade === "Grade A";
              const isReject = lot.lotGrade === "Reject";

              return (
                <div
                  key={lot.id}
                  onClick={() => setInspectingLot(lot)}
                  className="card-3d cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Annotated Photo */}
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={lot.thumbnail || lot.annotatedImage}
                        alt="Onion lot"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#F8D5C2] font-bold">
                          {lot.id}
                        </span>
                      </div>

                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black font-mono shadow-md ${
                        isGradeA
                          ? "bg-[#F18B49] text-[#000000]"
                          : isReject
                          ? "bg-[#FF4D4D] text-white"
                          : "bg-[#EB87A9] text-[#000000]"
                      }`}>
                        {lot.lotGrade === "Grade A" 
                          ? tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'") 
                          : lot.lotGrade === "Reject" 
                          ? tr("Reject", "रद्द", "नाकारलेले", "નકારેલ") 
                          : "URS"}
                      </div>

                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-xs font-mono font-bold text-[#F8D5C2] flex items-center gap-1.5">
                        <Box size={13} className="text-[#F18B49]" />
                        <span>{lot.quantityQuintals || 40} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}</span>
                      </div>

                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-xs font-mono font-black text-[#F18B49]">
                        ₹{lot.estimatedPricePerQuintal || 2400}/{tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <div className="text-xs text-[#C4A494] flex items-center justify-between">
                          <span className="flex items-center gap-1 font-mono">
                            <MapPin size={12} className="text-[#F18B49]" />
                            {lot.mandiName}
                          </span>
                          <span className="font-mono text-[11px]">
                            {lot.dateStr || tr("Today", "आज", "आज", "આજે")}
                          </span>
                        </div>
                        <h3 className="font-sans font-bold text-base text-[#F8D5C2] mt-1 group-hover:text-[#F18B49] transition-colors">
                          {lot.variety || tr("Nashik Red", "नासिक लाल", "नाशिक लाल", "નાસિક લાલ")} • {tr("Lot", "लॉट", "लॉट", "લોટ")} #{lot.id.split("-").slice(-1)[0]}
                        </h3>
                      </div>

                      {/* Quality Breakdown Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[#F18B49] font-bold font-tabular">
                            {lot.stats?.gradeAPct || 0}% {tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")}
                          </span>
                          <span className="text-[#EB87A9] font-bold font-tabular">
                            {lot.stats?.ursPct || 0}% URS
                          </span>
                          <span className="text-[#FF4D4D] font-bold font-tabular">
                            {lot.stats?.rejectPct || 0}% {tr("Rej", "खराब", "खराब", "ખરાબ")}
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full overflow-hidden bg-[#0C040A] flex">
                          <div style={{ width: `${lot.stats?.gradeAPct || 0}%` }} className="bg-[#F18B49]" />
                          <div style={{ width: `${lot.stats?.ursPct || 0}%` }} className="bg-[#EB87A9]" />
                          <div style={{ width: `${lot.stats?.rejectPct || 0}%` }} className="bg-[#FF4D4D]" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#C4A494] pt-1">
                        <span>{tr("Avg:", "औसत व्यास:", "सरासरी व्यास:", "સરેરાશ વ્યાસ:")} <strong>{lot.stats?.avgDiameterMm}mm</strong></span>
                        <span>{tr("Rot:", "सड़न:", "सड:", "સડો:")} <strong>{lot.stats?.avgDamagePct}%</strong></span>
                        <span>{tr("Sprout:", "अंकुरण:", "कोंब:", "અંકુરણ:")} <strong>{lot.stats?.sproutCount || 0} {tr("bulbs", "कंद", "कांदे", "ડુંગળી")}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectingLot(lot)}
                      className="flex-1 py-2.5 btn-3d-dark text-xs font-mono font-semibold text-center cursor-pointer"
                    >
                      {tr("Certificate", "प्रमाणपत्र", "प्रमाणपत्र", "પ્રમાણપત્ર")}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handlePurchaseRequest(lot, e)}
                      className="flex-1 py-2.5 btn-3d-lime text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag size={13} />
                      <span>{tr("Request", "खरीद अनुरोध", "खरेदी विनंती", "ખરીદ વિનંતી")}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Certificate Modal (Read-Only Mode) */}
      {inspectingLot && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectingLot(null);
          }}
        >
          <div 
            className="relative w-full max-w-5xl card-3d rounded-[32px] p-6 text-[#F8D5C2] max-h-[95vh] overflow-y-auto my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center">
                  <FileCheck2 size={20} className="text-[#F18B49]" />
                </div>
                <div>
                  <h2 className="font-sans font-black text-xl sm:text-2xl text-[#F8D5C2]">
                    {tr(
                      `Certificate of Quality: Lot ${inspectingLot.id}`,
                      `गुणवत्ता प्रमाणपत्र: लॉट ${inspectingLot.id}`,
                      `गुणवत्ता प्रमाणपत्र: लॉट ${inspectingLot.id}`,
                      `ગુણવત્તા પ્રમાણપત્ર: લોટ ${inspectingLot.id}`
                    )}
                  </h2>
                  <div className="text-xs text-[#C4A494] font-mono">
                    {tr(
                      `ORIGIN: ${inspectingLot.mandiName} (Nashik Region) • PRODUCER: [ANONYMIZED LOT #${inspectingLot.id.split('-').slice(-1)[0]}]`,
                      `मूल मंडी: ${inspectingLot.mandiName} (नासिक क्षेत्र) • उत्पादक: [अनाम लॉट #${inspectingLot.id.split('-').slice(-1)[0]}]`,
                      `मूळ बाजार समिती: ${inspectingLot.mandiName} (नाशिक परिसर) • उत्पादक: [निनावी लॉट #${inspectingLot.id.split('-').slice(-1)[0]}]`,
                      `મૂળ માર્કેટ યાર્ડ: ${inspectingLot.mandiName} (નાસિક પ્રદેશ) • ઉત્પાદક: [ગુપ્ત લોટ #${inspectingLot.id.split('-').slice(-1)[0]}]`
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePurchaseRequest(inspectingLot, e)}
                  className="px-5 py-2 btn-3d-lime text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>{tr("Request Purchase", "खरीद अनुरोध भेजें", "खरेदी विनंती पाठवा", "ખરીદ વિનંતી મોકલો")}</span>
                </button>

                <button
                  onClick={() => setInspectingLot(null)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <GradingWorkflow initialLot={inspectingLot} />
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
