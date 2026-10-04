import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLots, getPurchaseRequests, updatePurchaseRequestStatus } from "../services/storage";
import GradingWorkflow from "../components/GradingWorkflow";
import ProcurementModal from "../components/ProcurementModal";
import {
  Scale,
  Camera,
  Layers,
  FileText,
  Truck,
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function OfficerDashboard() {
  const { user, showToast } = useAuth();
  const { language, tr, isHindi, isMarathi, isGujarati } = useLanguage();
  const [lots, setLots] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("camera");
  const [selectedLotForProcurement, setSelectedLotForProcurement] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    loadData();
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (["camera", "queue", "purchases"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `#${tab}`);
    window.dispatchEvent(new Event("hashchange"));
    if (tab === "purchases") loadData();
  };

  const loadData = () => {
    const allLots = getLots();
    const officerMandiId = user?.mandiId || "MH-LAS";
    const centreLots = allLots.filter(l => 
      (l.mandiId && l.mandiId === officerMandiId) ||
      (!l.mandiId && (l.mandiName || "").toLowerCase().includes((user?.mandi || "lasalgaon").split(" ")[0].toLowerCase()))
    );
    setLots(centreLots);
    setPurchaseRequests(getPurchaseRequests());
  };

  // Alias for backward compat
  const loadLots = loadData;

  const handleGradingComplete = (newLot) => {
    loadData();
    setSelectedLotForProcurement(newLot);
  };

  // Filter to today's lots for tally (use all if none from today)
  const todayStr = new Date().toDateString();
  const todayLots = lots.filter(l => l.createdAt && new Date(l.createdAt).toDateString() === todayStr);
  const displayLots = todayLots.length > 0 ? todayLots : lots;

  const totalQuintalsGraded = displayLots.reduce((acc, l) => acc + (Number(l.quantityQuintals) || 0), 0);
  const totalGradeABulbs = displayLots.reduce((acc, l) => acc + (l.stats?.gradeACount || 0), 0);
  const totalUrsBulbs = displayLots.reduce((acc, l) => acc + (l.stats?.ursCount || 0), 0);
  const totalRejectBulbs = displayLots.reduce((acc, l) => acc + (l.stats?.rejectCount || 0), 0);
  const totalAllBulbs = totalGradeABulbs + totalUrsBulbs + totalRejectBulbs;

  const dayGradeAPct = totalAllBulbs > 0 ? Math.round((totalGradeABulbs / totalAllBulbs) * 100) : 0;
  const dayUrsPct = totalAllBulbs > 0 ? Math.round((totalUrsBulbs / totalAllBulbs) * 100) : 0;

  const filteredQueue = lots.filter(l => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      l.id.toLowerCase().includes(q) ||
      (l.farmerName || "").toLowerCase().includes(q) ||
      (l.vehicleNo || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-[#F8D5C2]">
      
      {/* Officer Terminal Header Bento */}
      <div id="overview" className="card-3d p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 scroll-mt-24">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center shadow-lg shadow-[#F18B49]/15">
            <Scale size={28} className="text-[#F18B49]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-black text-xl sm:text-3xl text-[#F8D5C2]">
                {tr("Weighbridge Intake Terminal", "वजनपुल आवक टर्मिनल", "वजनकाटा आवक टर्मिनल", "વજનકાંટો આવક ટર્મિનલ")}
              </h1>
              <span className="capsule-tag">
                {tr("STATION #02", "स्टेशन #02", "स्टेशन #०२", "સ્ટેશન #૦૨")}
              </span>
            </div>
            <div className="text-xs text-[#C4A494] flex items-center gap-2 mt-1 font-mono">
              <span>{user?.name || "Inspector Vinayak Shinde"}</span>
              <span>•</span>
              <span className="text-[#F18B49] font-bold">{user?.mandi || "Lasalgaon APMC Yard"}</span>
            </div>
          </div>
        </div>

        {/* Running Tally Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494] uppercase">
              {tr("QUINTALS TODAY", "आज का कुल वजन", "आजचे एकूण वजन", "આજનો કુલ જથ્થો")}
            </div>
            <div className="text-base font-black text-[#F8D5C2] font-tabular mt-0.5">
              {totalQuintalsGraded.toFixed(1)} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
            </div>
          </div>

          <div className="p-3 bg-[#120710] rounded-2xl border border-white/[0.06] text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494] uppercase">
              {tr("A / URS SPLIT", "अ / यूआरएस अनुपात", "अ / यूआरएस प्रमाण", "અ / યુઆરએસ ગુણોત્તર")}
            </div>
            <div className="text-xs font-black text-[#F18B49] font-tabular mt-0.5">
              {dayGradeAPct}% {tr("A", "अ", "अ", "અ")} <span className="text-[#EB87A9]">/ {dayUrsPct}% URS</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-[#120710] rounded-2xl border border-white/[0.06] text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494] uppercase">
              {tr("TODAY'S ARRIVALS", "आज की आवक", "आजची आवक", "આજની આવક")}
            </div>
            <div className="text-base font-black text-[#F18B49] font-tabular mt-0.5">
              {todayLots.length} {tr("Batches", "बैच", "बॅचेस", "બેચ")}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap border-b border-white/[0.06] pb-2 text-xs font-mono font-bold">
        <button
          onClick={() => switchTab("camera")}
          className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "camera"
              ? "btn-3d-lime"
              : "btn-3d-dark"
          }`}
        >
          <Camera size={14} />
          <span>{tr("Intake Camera & Grading Flow", "आवक कैमरा व ग्रेडिंग प्रणाली", "आवक कॅमेरा व प्रतवारी प्रणाली", "આવક કેમેરા અને ગ્રેડિંગ પ્રણાલી")}</span>
        </button>

        <button
          onClick={() => switchTab("queue")}
          className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "queue"
              ? "btn-3d-lime"
              : "btn-3d-dark"
          }`}
        >
          <Layers size={14} />
          <span>{tr(`Today's Graded Queue (${todayLots.length})`, `आज की ग्रेडिंग सूची (${todayLots.length})`, `आजची प्रतवारी यादी (${todayLots.length})`, `આજની ગ્રેડિંગ યાદી (${todayLots.length})`)}</span>
        </button>

        <button
          onClick={() => switchTab("purchases")}
          className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 relative ${
            activeTab === "purchases"
              ? "btn-3d-lime"
              : "btn-3d-dark"
          }`}
        >
          <ShoppingBag size={14} />
          <span>{tr(`Purchase Requests (${purchaseRequests.length})`, `व्यापारी खरीद अनुरोध (${purchaseRequests.length})`, `व्यापारी खरेदी विनंत्या (${purchaseRequests.length})`, `વેપારી ખરીદ વિનંતીઓ (${purchaseRequests.length})`)}</span>
          {purchaseRequests.filter(p => p.status === "pending").length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: INTAKE CAMERA & GRADING ENGINE */}
      {activeTab === "camera" && (
        <div id="camera" className="space-y-4 scroll-mt-24">
          <div className="p-3.5 rounded-2xl bg-[#F18B49]/10 border border-[#F18B49]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-[#F18B49]" />
              <span className="text-[#F8D5C2]">
                {tr(
                  "APMC Intake Mode: Once a lot is graded, click 'Confirm & Log Procurement' to record farmer Khasra ID and generate their e-weighbridge slip.",
                  "एपीएमसी आवक मोड: जब लॉट ग्रेड हो जाए, किसान खसरा आईडी दर्ज करने और ई-वजनपुल पर्ची बनाने के लिए 'खरीद की पुष्टि व रिकॉर्ड करें' पर क्लिक करें।",
                  "बाजार समिती आवक मोड: लॉट प्रतवारी झाल्यावर, शेतकरी खसरा नोंदवण्यासाठी व पावती तयार करण्यासाठी 'खरेदी निश्चित व नोंद करा' वर क्लिक करा.",
                  "એપીએમસી આવક મોડ: લોટ ગ્રેડ થઈ જાય પછી, ખેડૂત ખસરા નોંધવા અને પહોંચ બનાવવા માટે 'ખરીદી પુષ્ટિ અને નોંધ કરો' પર ક્લિક કરો."
                )}
              </span>
            </div>
          </div>

          <GradingWorkflow onGradingComplete={handleGradingComplete} />
        </div>
      )}

      {/* TAB 2: TODAY'S GRADED LOTS QUEUE */}
      {activeTab === "queue" && (
        <div id="queue" className="space-y-4 animate-in fade-in duration-150 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans font-black text-xl text-[#F8D5C2]">
                {tr("Today's APMC Graded Lot Register", "आज का एपीएमसी ग्रेडेड लॉट रजिस्टर", "आजचे बाजार समिती प्रतवारी रजिस्टर", "આજનું એપીએમસી ગ્રેડેડ લોટ રજિસ્ટર")}
              </h2>
              <p className="text-xs text-[#C4A494]">
                {tr(
                  "Running electronic tally of all batches processed at Lasalgaon APMC Yard #2 today.",
                  "लासलगांव एपीएमसी यार्ड #2 पर आज संसाधित किए गए सभी बैचों की इलेक्ट्रॉनिक गणना।",
                  "लासलगाव बाजार समिती यार्ड #२ वर आज तपासलेल्या सर्व बॅचेसची इलेक्ट्रॉनिक नोंद.",
                  "લાસલગાવ એપીએમસી યાર્ડ #૨ પર આજે તપાસેલ તમામ બેચની ઇલેક્ટ્રોનિક ગણતરી."
                )}
              </p>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={tr("Search farmer name, vehicle...", "किसान का नाम, वाहन नंबर खोजें...", "शेतकऱ्याचे नाव, वाहन क्रमांक शोधा...", "ખેડૂતનું નામ, વાહન નંબર શોધો...")}
                className="input-3d pl-10 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Queue Table */}
          <div className="card-3d overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0C040A] text-[#C4A494] border-b border-white/[0.06] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">{tr("Lot & Timestamp", "लॉट व समय", "लॉट व वेळ", "લોટ અને સમય")}</th>
                    <th className="p-3.5">{tr("Farmer & Vehicle", "किसान व वाहन", "शेतकरी व वाहन", "ખેડૂત અને વાહન")}</th>
                    <th className="p-3.5">{tr("Grade & Quality Split", "ग्रेड व गुणवत्ता अनुपात", "प्रतवारी व दर्जा प्रमाण", "ગ્રેડ અને ગુણવત્તા ગુણોત્તર")}</th>
                    <th className="p-3.5">{tr("Gross Quintals", "कुल क्विंटल", "एकूण वजन (क्विंटल)", "કુલ ક્વિન્ટલ")}</th>
                    <th className="p-3.5">{tr("Est. MSP / Payout", "अनुमानित भुगतान", "अंदाजे रास्त भाव", "અંદાજિત ચુકવણી")}</th>
                    <th className="p-3.5 text-right">{tr("Actions", "कार्रवाई", "कृती", "ક્રિયાઓ")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredQueue.map((lot) => {
                    const isGradeA = lot.lotGrade === "Grade A";
                    const isReject = lot.lotGrade === "Reject";
                    const payout = Math.round((lot.quantityQuintals || 40) * (lot.estimatedPricePerQuintal || 2400));

                    return (
                      <tr key={lot.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#F8D5C2] flex items-center gap-2.5">
                            <img
                              src={lot.thumbnail || lot.annotatedImage}
                              alt="thumb"
                              className="w-9 h-9 rounded-xl object-cover border border-white/[0.08]"
                            />
                            <div>
                              <div>{lot.id}</div>
                              <div className="text-[10px] text-[#C4A494]">{lot.dateStr || tr("Today", "आज", "आज", "આજે")}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="text-[#F8D5C2] font-bold">{lot.farmerName}</div>
                          <div className="text-[10px] text-[#C4A494] flex items-center gap-1 mt-0.5">
                            <Truck size={11} className="text-[#F18B49]" />
                            <span>{lot.vehicleNo || "Tractor Trolley #12"}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isGradeA
                                ? "bg-[#F18B49]/20 text-[#F18B49] border border-[#F18B49]/30"
                                : isReject
                                ? "bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/30"
                                : "bg-[#EB87A9]/20 text-[#EB87A9] border border-[#EB87A9]/30"
                            }`}>
                              {lot.lotGrade === "Grade A" 
                                ? tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'") 
                                : lot.lotGrade === "Reject" 
                                ? tr("Reject", "रद्द", "नाकारलेले", "નકારેલ") 
                                : "URS"}
                            </span>
                            <span className="text-[10px] text-[#F18B49] font-tabular">
                              {lot.stats?.gradeAPct}% {tr("A", "अ", "अ", "અ")}
                            </span>
                            <span className="text-[10px] text-[#C4A494]">•</span>
                            <span className="text-[10px] text-[#EB87A9] font-tabular">
                              {lot.stats?.ursPct}% URS
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 font-black text-[#F8D5C2] font-tabular">
                          {lot.quantityQuintals || 40} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                        </td>

                        <td className="p-3.5">
                          <div className="font-black text-[#F18B49]">₹{payout.toLocaleString("en-IN")}</div>
                          <div className="text-[10px] text-[#C4A494]">@ ₹{lot.estimatedPricePerQuintal || 2400}/{tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}</div>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedLotForProcurement(lot)}
                            className="px-4 py-1.5 btn-3d-dark text-[11px] font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <FileText size={12} />
                            <span>{tr("Weighbridge Slip", "वजनपुल पर्ची", "वजनकाटा पावती", "વજનકાંટો પહોંચ")}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRADER PURCHASE REQUESTS INBOX */}
      {activeTab === "purchases" && (
        <div id="purchases" className="space-y-4 animate-in fade-in duration-150 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans font-black text-xl text-[#F8D5C2]">
                {tr("Trader Bidding & Purchase Requests", "व्यापारी बोली व खरीद अनुरोध", "व्यापारी बोली व खरेदी विनंत्या", "વેપારી બોલી અને ખરીદ વિનંતીઓ")}
              </h2>
              <p className="text-xs text-[#C4A494] font-mono mt-0.5">
                {tr(
                  "Review and approve buyer purchase transmissions across APMC mandis",
                  "एपीएमसी मंडियों में खरीदारों द्वारा भेजे गए खरीद अनुरोधों की समीक्षा व स्वीकृति",
                  "बाजार समितीमध्ये खरेदीदारांच्या विनंत्यांची पडताळणी व मान्यता",
                  "માર્કેટ યાર્ડમાં ખરીદદારોની વિનંતીઓની સમીક્ષા અને મંજૂરી"
                )}
              </p>
            </div>
            <div className="text-xs font-mono text-[#C4A494]">
              {tr("Total Inbound Requests: ", "कुल आवक अनुरोध: ", "एकूण आवक विनंत्या: ", "કુલ આવક વિનંતીઓ: ")}<strong className="text-[#F8D5C2]">{purchaseRequests.length}</strong>
            </div>
          </div>

          {purchaseRequests.length === 0 ? (
            <div className="card-3d p-12 text-center space-y-3">
              <ShoppingBag size={36} className="text-[#C4A494] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-[#F8D5C2]">
                {tr("No Purchase Requests Logged", "कोई खरीद अनुरोध दर्ज नहीं है", "कोणतीही खरेदी विनंती नोंदवलेली नाही", "કોઈ ખરીદ વિનંતી નોંધાયેલ નથી")}
              </h3>
              <p className="text-xs text-[#C4A494] max-w-sm mx-auto">
                {tr(
                  "When retailers browse the Mandi Marketplace and submit buy requests, they will appear here for officer approval.",
                  "जब व्यापारी बाज़ार से खरीद अनुरोध भेजेंगे, तो वे यहां मंडी अधिकारी अनुमोदन के लिए प्रदर्शित होंगे।",
                  "जेव्हा व्यापारी बाजारपेठेतून खरेदी विनंती पाठवतील, तेव्हा ते येथे अधिकारी मंजुरीसाठी दिसतील.",
                  "જ્યારે વેપારીઓ માર્કેટ યાર્ડમાંથી ખરીદ વિનંતી મોકલશે, ત્યારે તે અહીં અધિકારી મંજૂરી માટે દેખાશે."
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchaseRequests.map((req) => {
                const isPending = req.status === "pending";
                const isApproved = req.status === "approved";
                const isRejected = req.status === "rejected";

                return (
                  <div
                    key={req.id}
                    className={`card-3d p-5 space-y-3 border transition-all ${
                      isPending
                        ? "border-[#EB87A9]/40 bg-[#120710]"
                        : isApproved
                        ? "border-[#F18B49]/40 bg-[#000000]"
                        : "border-[#FF4D4D]/30 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#F8D5C2]">{req.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              isPending
                                ? "bg-[#EB87A9]/20 text-[#EB87A9]"
                                : isApproved
                                ? "bg-[#F18B49]/20 text-[#F18B49]"
                                : "bg-[#FF4D4D]/20 text-[#FF4D4D]"
                            }`}
                          >
                            {req.status === "pending" 
                              ? tr("pending", "लंबित", "प्रलंबित", "બાકી") 
                              : req.status === "approved" 
                              ? tr("approved", "स्वीकृत", "मंजूर", "મંજૂર") 
                              : tr("rejected", "अस्वीकृत", "नाकारलेले", "નકારેલ")}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#F8D5C2] mt-1">
                          {req.retailerCompany || req.retailerName}
                        </div>
                        <div className="text-xs text-[#C4A494] font-mono">
                          {tr("Buyer: ", "खरीदार: ", "खरेदीदार: ", "ખરીદનાર: ")}{req.retailerName} • {req.mandiName || "Mandi Yard"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-mono text-[#C4A494] uppercase">
                          {tr("Offered Bid", "प्रस्तावित बोली", "प्रस्तावित बोली", "પ્રસ્તાવિત બોલી")}
                        </div>
                        <div className="text-base font-black text-[#F18B49] font-tabular">
                          ₹{req.offeredPrice}/{tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                        </div>
                        <div className="text-xs text-[#C4A494] font-mono">
                          {req.quantityQuintals} {tr("Quintals", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#000000] rounded-xl border border-white/[0.06] text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#C4A494]">{tr("Target Lot ID:", "लक्षित लॉट आईडी:", "लक्षित लॉट आयडी:", "લક્ષિત લોટ આઈડી:")}</span>
                        <strong className="text-[#F8D5C2]">{req.lotId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#C4A494]">{tr("Estimated Total Payout:", "अनुमानित कुल भुगतान:", "अंदाजे एकूण रक्कम:", "અંદાજિત કુલ ચુકવણી:")}</span>
                        <strong className="text-[#F18B49]">
                          ₹{((req.quantityQuintals || 0) * (req.offeredPrice || 0)).toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#C4A494] pt-1 border-t border-white/[0.04]">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(req.createdAt).toLocaleString(isMarathi ? "mr-IN" : isGujarati ? "gu-IN" : isHindi ? "hi-IN" : "en-IN")}
                        </span>
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
                        <button
                          onClick={() => {
                            updatePurchaseRequestStatus(req.id, "rejected");
                            loadData();
                            showToast(
                              tr(`Request ${req.id} rejected.`, `अनुरोध ${req.id} अस्वीकृत।`, `विनंती ${req.id} नाकारली.`, `વિનંતી ${req.id} અસ્વીકાર થઈ.`),
                              "info"
                            );
                          }}
                          className="px-3 py-1.5 rounded-full btn-3d-dark text-xs text-[#FF4D4D] hover:bg-[#FF4D4D]/10 font-bold cursor-pointer"
                        >
                          {tr("Reject", "अस्वीकार करें", "नाकारा", "અસ્વીકાર કરો")}
                        </button>
                        <button
                          onClick={() => {
                            updatePurchaseRequestStatus(req.id, "approved");
                            loadData();
                            showToast(
                              tr(
                                `Purchase order ${req.id} APPROVED! Contract issued.`,
                                `खरीद आदेश ${req.id} स्वीकृत! अनुबंध जारी किया गया।`,
                                `खरेदी आदेश ${req.id} मंजूर! करार जारी.`,
                                `ખરીદ ઓર્ડર ${req.id} મંજૂર! કરાર જારી.`
                              ),
                              "success"
                            );
                          }}
                          className="px-4 py-1.5 rounded-full btn-3d-lime text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          <span>{tr("Approve & Allot", "स्वीकृत व आबंटित करें", "मंजूर व वाटप करा", "મંજૂર અને ફાળવણી કરો")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedLotForProcurement && (
        <ProcurementModal
          lot={selectedLotForProcurement}
          isOpen={Boolean(selectedLotForProcurement)}
          onClose={() => setSelectedLotForProcurement(null)}
          onProcurementLogged={() => {
            loadLots();
          }}
        />
      )}

    </div>
  );
}
