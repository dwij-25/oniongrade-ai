import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLots, getDisputes, resolveDispute, getRulesConfig, saveRulesConfig } from "../services/storage";
import DonutChart from "../components/DonutChart";
import {
  Landmark,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Sliders,
  CheckCircle2,
  MapPin,
  Scale,
  X
} from "lucide-react";

export default function GovernmentDashboard() {
  const { user, showToast } = useAuth();
  const { language, tr, isHindi, isMarathi, isGujarati } = useLanguage();
  const [lots, setLots] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [activeTab, setActiveTab] = useState("analytics");
  
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adjudicationNote, setAdjudicationNote] = useState("");
  const [rulesConfig, setRulesConfig] = useState(getRulesConfig());

  useEffect(() => {
    loadData();
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (["analytics", "disputes", "rules"].includes(hash)) {
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
  };

  const loadData = () => {
    setLots(getLots());
    setDisputes(getDisputes());
  };

  const totalLots = lots.length;
  const totalQuintals = lots.reduce((acc, l) => acc + (Number(l.quantityQuintals) || 0), 0);

  const avgGradeAPct = totalLots > 0
    ? Math.round(lots.reduce((acc, l) => acc + (l.stats?.gradeAPct || 0), 0) / totalLots)
    : 0;

  const avgUrsPct = totalLots > 0
    ? Math.round(lots.reduce((acc, l) => acc + (l.stats?.ursPct || 0), 0) / totalLots)
    : 0;

  const avgRejectPct = totalLots > 0
    ? Math.round(lots.reduce((acc, l) => acc + (l.stats?.rejectPct || 0), 0) / totalLots)
    : 0;

  const openDisputes = disputes.filter(d => d.status === "open");

  const regions = [
    { name: "Lasalgaon (Nashik)", id: "MH-LAS" },
    { name: "Pimpalgaon (Nashik)", id: "MH-PIM" },
    { name: "Mahuva (Gujarat)", id: "GJ-MAH" },
    { name: "Kurnool (Andhra)", id: "AP-KUR" }
  ];

  const regionalData = regions.map(r => {
    const regionLots = lots.filter(l => (l.mandiName || "").includes(r.name.split(" ")[0]));
    const count = regionLots.length;
    const avgA = count > 0 ? Math.round(regionLots.reduce((acc, l) => acc + (l.stats?.gradeAPct || 0), 0) / count) : 75;
    const avgRej = count > 0 ? Math.round(regionLots.reduce((acc, l) => acc + (l.stats?.rejectPct || 0), 0) / count) : 8;
    return { ...r, lotCount: count, avgA, avgRej };
  });

  const handleResolveDispute = (decision, newGrade = null) => {
    if (!selectedDispute) return;

    resolveDispute(selectedDispute.id, {
      status: decision === "uphold" ? "upheld" : "overridden",
      overriddenGrade: newGrade,
      resolutionOfficer: user?.name || "Dr. Ananya Roy (DoCA)",
      resolutionOfficerNote: adjudicationNote || (decision === "uphold" ? "Grade upheld per DoCA standard criteria." : `Grade overridden to ${newGrade} based on physical re-inspection.`)
    });

    showToast(
      decision === "uphold"
        ? tr(
            `Dispute #${selectedDispute.id} UPHELD. Original grade confirmed.`,
            `विवाद #${selectedDispute.id} बरकरार रखा गया। मूल ग्रेड की पुष्टि की गई।`,
            `तक्रार #${selectedDispute.id} कायम ठेवली. मूळ प्रतवारी निश्चित केली.`,
            `વિવાદ #${selectedDispute.id} માન્ય રાખેલ છે. મૂળ ગ્રેડ યથાવત.`
          )
        : tr(
            `Dispute #${selectedDispute.id} OVERRIDDEN to ${newGrade}! Synced to farmer record.`,
            `विवाद #${selectedDispute.id} संशोधित कर ${newGrade} किया गया! किसान रिकॉर्ड में अपडेट।`,
            `तक्रार #${selectedDispute.id} बदलून ${newGrade} केली! शेतकरी नोंदीत अद्यतनित.`,
            `વિવાદ #${selectedDispute.id} સુધારીને ${newGrade} કરેલ છે! ખેડૂત રેકોર્ડમાં અપડેટ.`
          ),
      decision === "uphold" ? "info" : "success"
    );

    setSelectedDispute(null);
    setAdjudicationNote("");
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-[#F8D5C2]">
      
      {/* DoCA Banner (3D Tactile Grid Header) */}
      <div id="overview" className="card-3d p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 scroll-mt-24">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 flex items-center justify-center shadow-lg shadow-[#FF4D4D]/15">
            <Landmark size={28} className="text-[#FF4D4D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-black text-xl sm:text-3xl text-[#F8D5C2]">
                {tr(
                  "National Quality & Buffer Oversight",
                  "राष्ट्रीय गुणवत्ता व बफर स्टॉक निगरानी",
                  "राष्ट्रीय गुणवत्ता आणि बफर साठा देखरेख",
                  "રાષ્ટ્રીય ગુણવત્તા અને બફર સ્ટોક દેખરેખ"
                )}
              </h1>
              <span className="capsule-tag-red">
                {tr(
                  "DoCA CENTRAL DESK",
                  "DoCA केंद्रीय डेस्क",
                  "DoCA केंद्रीय डेस्क",
                  "DoCA સેન્ટ્રલ ડેસ્ક"
                )}
              </span>
            </div>
            <p className="text-xs text-[#C4A494] mt-1 font-mono">
              {tr(
                "Department of Consumer Affairs • Price Stabilization Fund Management (PSFM) Cell",
                "उपभोक्ता मामले विभाग • मूल्य स्थिरीकरण कोष प्रबंधन (PSFM) प्रकोष्ठ",
                "ग्राहक व्यवहार विभाग • भाव स्थिरीकरण निधी व्यवस्थापन (PSFM) कक्ष",
                "ગ્રાહક બાબતોનો વિભાગ • ભાવ સ્થિરતા ફંડ મેનેજમેન્ટ (PSFM) સેલ"
              )}
            </p>
          </div>
        </div>

        {/* Macro KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-3 bg-[#120710] rounded-2xl border border-white/5 text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494]">{tr("BUFFER INTAKE", "बफर स्टॉक आवक", "बफर साठा आवक", "બફર સ્ટોક આવક")}</div>
            <div className="text-base font-black text-[#F8D5C2] font-tabular mt-0.5">{totalQuintals.toFixed(0)} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}</div>
          </div>
          <div className="p-3 bg-[#120710] rounded-2xl border border-white/5 text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494]">{tr("AVG GRADE A", "औसत ग्रेड 'अ'", "सरासरी ग्रेड 'अ'", "સરેરાશ ગ્રેડ 'અ'")}</div>
            <div className="text-base font-black text-[#F18B49] font-tabular mt-0.5">{avgGradeAPct}%</div>
          </div>
          <div className="p-3 bg-[#120710] rounded-2xl border border-white/5 text-center shadow-inner">
            <div className="text-[10px] text-[#C4A494]">{tr("SPOILAGE RATE", "सड़न / खराबी दर", "नासाडी / खराबी प्रमाण", "બગાડ / સડો દર")}</div>
            <div className="text-base font-black text-[#FF4D4D] font-tabular mt-0.5">{avgRejectPct}%</div>
          </div>
          <div className={`p-3 rounded-2xl border text-center shadow-inner ${
            openDisputes.length > 0 ? "bg-[#FF4D4D]/15 border-[#FF4D4D]/50 text-[#F8D5C2]" : "bg-[#120710] border-white/5"
          }`}>
            <div className="text-[10px] text-[#C4A494]">{tr("ACTIVE DISPUTES", "सक्रिय विवाद", "सक्रिय तक्रारी", "સક્રિય વિવાદો")}</div>
            <div className="text-base font-black text-[#FF4D4D] font-tabular mt-0.5">
              {openDisputes.length} {tr("Pending", "लंबित", "प्रलंबित", "બાકી")}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs (3D Tactile switcher) */}
      <div className="flex items-center gap-2 border-b border-[#36112C] pb-3 text-xs font-mono font-bold">
        <button
          onClick={() => switchTab("analytics")}
          className={`px-4 py-2.5 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "analytics"
              ? "btn-3d-lime"
              : "btn-3d-dark text-[#C4A494]"
          }`}
        >
          <BarChart3 size={14} />
          <span>{tr("National Analytics", "राष्ट्रीय विश्लेषिकी", "राष्ट्रीय विश्लेषण", "રાષ્ટ્રીય વિશ્લેષણ")}</span>
        </button>

        <button
          onClick={() => switchTab("disputes")}
          className={`px-4 py-2.5 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "disputes"
              ? "btn-3d-lime"
              : "btn-3d-dark text-[#C4A494]"
          }`}
        >
          <AlertTriangle size={14} />
          <span>{tr(`Disputes Queue (${openDisputes.length})`, `विवाद निपटान सूची (${openDisputes.length})`, `तक्रार निवारण यादी (${openDisputes.length})`, `વિવાદ નિવારણ યાદી (${openDisputes.length})`)}</span>
          {openDisputes.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-ping" />
          )}
        </button>

        <button
          onClick={() => switchTab("rules")}
          className={`px-4 py-2.5 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "rules"
              ? "btn-3d-lime"
              : "btn-3d-dark text-[#C4A494]"
          }`}
        >
          <Sliders size={14} />
          <span>{tr("Model Rules & Grading Config", "मॉडल नियम व ग्रेडिंग मानक", "मॉडेल नियम आणि प्रतवारी निकष", "મોડેલ નિયમો અને ગ્રેડિંગ રૂપરેખા")}</span>
        </button>
      </div>

      {/* TAB 1: AGGREGATE 3D ANALYTICS */}
      {activeTab === "analytics" && (
        <div id="analytics" className="space-y-6 animate-in fade-in duration-150 scroll-mt-24">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 3D Block A: National Donut Split (4 cols) */}
            <div className="lg:col-span-4 card-3d p-6 text-center space-y-4">
              <div className="text-left border-b border-[#36112C] pb-2">
                <span className="capsule-tag-dark">{tr("CUMULATIVE RATIO", "संचयी अनुपात", "एकत्रित प्रमाण", "સંચિત ગુણોત્તર")}</span>
                <h3 className="font-sans font-black text-lg text-[#F8D5C2] mt-1">
                  {tr("National Quality Split", "राष्ट्रीय गुणवत्ता विभाजन", "राष्ट्रीय गुणवत्ता वर्गीकरण", "રાષ્ટ્રીય ગુણવત્તા વિભાજન")}
                </h3>
              </div>

              <DonutChart
                gradeAPct={avgGradeAPct}
                ursPct={avgUrsPct}
                rejectPct={avgRejectPct}
                size={180}
                strokeWidth={22}
                centerLabel={`${avgGradeAPct}%`}
                centerSub={tr("AVG GRADE A", "औसत ग्रेड 'अ'", "सरासरी ग्रेड 'अ'", "સરેરાશ ગ્રેડ 'અ'")}
              />

              <div className="text-xs text-[#C4A494] text-left pt-2 border-t border-[#36112C]">
                {tr(
                  "Real-time multi-mandi quality intelligence aggregating arrivals from Lasalgaon, Pimpalgaon, and Kurnool.",
                  "लासलगांव, पिंपलगांव और कर्नूल से आवक को एकत्रित करने वाली वास्तविक समय की बहु-मंडी गुणवत्ता आसूचना।",
                  "लासलगाव, पिंपळगाव आणि कर्नूल येथील आवक एकत्रित करणारी रिअल-टाइम बहु-बाजार समिती गुणवत्ता माहिती.",
                  "લાસલગાવ, પિંપળગાવ અને કુર્નૂલની આવકને એકત્રિત કરતી રિયલ-ટાઇમ માર્કેટ યાર્ડ ગુણવત્તા માહિતી."
                )}
              </div>
            </div>

            {/* 3D Block B: Regional Breakdown (8 cols) */}
            <div className="lg:col-span-8 card-3d p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#36112C] pb-2">
                <div>
                  <span className="capsule-tag-dark">{tr("REGIONAL APMC METRICS", "क्षेत्रीय एपीएमसी मेट्रिक्स", "प्रादेशिक बाजार समिती मेट्रिक्स", "પ્રાદેશિક એપીએમસી મેટ્રિક્સ")}</span>
                  <h3 className="font-sans font-black text-lg text-[#F8D5C2] mt-1">
                    {tr("Mandi-Wise Grade A & Spoilage", "मंडी-वार ग्रेड 'अ' और अस्वीकृति अनुपात", "बाजार समितीनिहाय ग्रेड 'अ' व नासाडी प्रमाण", "માર્કેટ યાર્ડ મુજબ ગ્રેડ 'અ' અને બગાડ")}
                  </h3>
                </div>
                <span className="capsule-tag text-[10px]">{tr("DoCA TARGET: 70%", "DoCA लक्ष्य: 70%", "DoCA उद्दिष्ट: 70%", "DoCA લક્ષ્ય: 70%")}</span>
              </div>

              <div className="space-y-4 pt-1">
                {regionalData.map((reg) => (
                  <div key={reg.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F8D5C2] font-bold flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#F18B49]" />
                        {reg.name}
                      </span>
                      <div className="space-x-3 text-[11px]">
                        <span className="text-[#F18B49] font-bold">{reg.avgA}% {tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")}</span>
                        <span className="text-[#FF4D4D] font-bold">{reg.avgRej}% {tr("Rejection", "अस्वीकृत", "नाकारलेले", "અસ્વીકાર")}</span>
                      </div>
                    </div>

                    <div className="w-full h-3 rounded-full bg-[#000000] overflow-hidden flex border border-[#36112C]">
                      <div style={{ width: `${reg.avgA}%` }} className="bg-[#F18B49]" title="Grade A" />
                      <div style={{ width: `${100 - reg.avgA - reg.avgRej}%` }} className="bg-[#EB87A9]" title="URS" />
                      <div style={{ width: `${reg.avgRej}%` }} className="bg-[#FF4D4D]" title="Reject" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3D Block C: Post-Harvest Loss & Sprouting Trendline */}
          <div className="card-3d p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#36112C] pb-3">
              <div>
                <span className="capsule-tag-dark">{tr("BUFFER HEALTH MONITORING", "बफर स्वास्थ्य ट्रैकिंग", "बफर साठा आरोग्य देखरेख", "બફર આરોગ્ય મોનિટરિંગ")}</span>
                <h3 className="font-sans font-black text-lg text-[#F8D5C2] mt-1">
                  {tr("Spoilage, Rot & Apical Sprouting Timeline", "सड़न, काला फफूंद व अंकुरण समयरेखा", "नासाडी, काळी बुरशी आणि कोंब फुटण्याची कालमर्यादा", "સડો, કાળી ફૂગ અને અંકુરણ સમયરેખા")}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#FF4D4D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D4D]" />
                  {tr("Black Mold / Rot %", "काला फफूंद / सड़न %", "काळी बुरशी / नासाडी %", "કાળી ફૂગ / સડો %")}
                </span>
                <span className="flex items-center gap-1.5 text-[#F18B49]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F18B49]" />
                  {tr("Sprouting Score", "अंकुरण स्कोर", "कोंब फुटणे स्कोअर", "અંકુરણ સ્કોર")}
                </span>
              </div>
            </div>

            <div className="relative h-48 w-full bg-[#000000] rounded-2xl p-4 border border-[#36112C] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                {/* Rot Trend Line (Red) */}
                <path
                  d="M 0 95 Q 60 85 120 75 T 240 82 T 360 45 T 500 55"
                  fill="none"
                  stroke="#FF4D4D"
                  strokeWidth="3.5"
                />

                {/* Sprout Trend Line (Electric Lime) */}
                <path
                  d="M 0 105 Q 80 100 160 90 T 300 70 T 420 50 T 500 40"
                  fill="none"
                  stroke="#F18B49"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                />
              </svg>

              <div className="absolute bottom-2 inset-x-4 flex justify-between text-[10px] font-mono text-[#C4A494]">
                <span>{tr("Arrival Day 1", "आवक दिवस 1", "आवक दिवस 1", "આવક દિવસ 1")}</span>
                <span>{tr("Day 3", "दिवस 3", "दिवस 3", "દિવસ 3")}</span>
                <span>{tr("Day 7 (Buffer Storage)", "दिवस 7 (बफर भंडारण)", "दिवस 7 (बफर साठवणूक)", "દિવસ 7 (બફર સંગ્રહ)")}</span>
                <span>{tr("Day 14", "दिवस 14", "दिवस 14", "દિવસ 14")}</span>
                <span>{tr("Day 21 (Peak Sprout Alert)", "दिवस 21 (अंकुरण चेतावनी)", "दिवस 21 (कोंब फुटणे इशारा)", "દિવસ 21 (અંકુરણ ચેતવણી)")}</span>
              </div>
            </div>

            <p className="text-xs text-[#C4A494]">
              {tr(
                "*Automated optical inspection flags lots exhibiting active sprouting for immediate release to consumer retail outlets, avoiding storage rot.",
                "*स्वचालित ऑप्टिकल निरीक्षण भंडारण में सड़न से बचने के लिए सक्रिय अंकुरण वाले लॉट को खुदरा बाज़ार में तत्काल भेजने हेतु चिह्नित करता है।",
                "*स्वयंचलित ऑप्टिकल तपासणी साठवणुकीतील नासाडी टाळण्यासाठी सक्रिय कोंब फुटलेले लॉट्स किरकोळ बाजारात तातडीने पाठवण्यासाठी सूचित करते.",
                "*સ્વચાલિત ઓપ્ટિકલ નિરીક્ષણ સંગ્રહમાં સડો અટકાવવા માટે સક્રિય અંકુરણવાળા લોટ્સને તાત્કાલિક છૂટક બજારમાં મોકલવા માટે ફ્લેગ કરે છે."
              )}
            </p>
          </div>

        </div>
      )}

      {/* TAB 2: DISPUTES QUEUE & ADJUDICATION */}
      {activeTab === "disputes" && (
        <div id="disputes" className="space-y-4 animate-in fade-in duration-150 scroll-mt-24">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans font-black text-xl text-[#F8D5C2]">
                {tr("Farmer Grievance & Grade Dispute Terminal", "किसान शिकायत व ग्रेड विवाद निपटान टर्मिनल", "शेतकरी तक्रार व प्रतवारी वाद निवारण टर्मिनल", "ખેડૂત ફરિયાદ અને ગ્રેડ વિવાદ નિવારણ ટર્મિનલ")}
              </h2>
              <p className="text-xs text-[#C4A494]">
                {tr(
                  "Adjudicate complaints regarding optical classification and moisture penalties.",
                  "ऑप्टिकल वर्गीकरण और नमी कटौती संबंधी शिकायतों का आधिकारिक निपटारा।",
                  "ऑप्टिकल वर्गीकरण आणि ओलावा कपात याविषयीच्या तक्रारींचा अधिकृत निकाल.",
                  "ઓપ્ટિકલ વર્ગીકરણ અને ભેજ કપાત સંબંધિત ફરિયાદોનો સત્તાવાર નિકાલ."
                )}
              </p>
            </div>
            <span className="capsule-tag-red">
              {openDisputes.length} {tr("PENDING REVIEW", "समीक्षा हेतु लंबित", "पुनरावलोकन प्रलंबित", "સમીક્ષા બાકી")}
            </span>
          </div>

          <div className="space-y-3">
            {disputes.map((dispute) => {
              const isOpen = dispute.status === "open";

              return (
                <div
                  key={dispute.id}
                  className={`card-3d p-5 transition-all ${
                    isOpen ? "border-[#FF4D4D]/60 shadow-lg shadow-[#FF4D4D]/10" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={dispute.annotatedImage}
                        alt="Disputed lot scan"
                        className="w-14 h-14 rounded-2xl object-cover border border-[#36112C] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#F8D5C2]">{dispute.id}</span>
                          <span className="text-xs text-[#C4A494] font-mono">{tr("Lot:", "लॉट:", "लॉट:", "લોટ:")} {dispute.lotId}</span>
                          <span className={`capsule-tag text-[9px] py-0.5 ${
                            isOpen
                              ? "capsule-tag-red"
                              : dispute.status === "overridden"
                              ? "border-[#F18B49]/50 text-[#F18B49]"
                              : "capsule-tag-yellow"
                          }`}>
                            {isOpen 
                              ? tr("PENDING", "लंबित", "प्रलंबित", "બાકી")
                              : dispute.status === "overridden" 
                              ? tr("OVERRIDDEN", "संशोधित", "बदलले", "સુધારેલ") 
                              : tr("UPHELD", "बरकरार", "कायम", "યથાવત")}
                          </span>
                        </div>

                        <div className="text-xs text-[#F8D5C2] font-bold mt-1">
                          {tr("Farmer: ", "किसान: ", "शेतकरी: ", "ખેડૂત: ")}{dispute.farmerName} • {dispute.mandiName}
                        </div>

                        <div className="text-xs text-[#EB87A9] mt-0.5 font-mono">
                          <strong>{tr("Grievance:", "शिकायत:", "तक्रार:", "ફરિયાદ:")}</strong> {dispute.reason}
                        </div>

                        <p className="text-xs text-[#C4A494] mt-1 italic max-w-xl">
                          "{dispute.farmerNote}"
                        </p>
                      </div>
                    </div>

                    <div className="sm:self-center shrink-0">
                      {isOpen ? (
                        <button
                          onClick={() => setSelectedDispute(dispute)}
                          className="px-5 py-2.5 btn-3d-dark border-[#FF4D4D]/40 text-[#FF4D4D] hover:border-[#FF4D4D] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Scale size={14} />
                          <span>{tr("Adjudicate Grievance", "विवाद का निपटारा करें", "तक्रारीचा निकाल द्या", "ફરિયાદનો નિકાલ કરો")}</span>
                        </button>
                      ) : (
                        <div className="text-right text-xs font-mono">
                          <span className="text-[#F18B49] font-bold flex items-center gap-1 justify-end">
                            <CheckCircle2 size={13} />
                            {tr("Resolved", "निपटारा पूर्ण", "निवारण पूर्ण", "નિકાલ પૂર્ણ")}
                          </span>
                          <span className="text-[10px] text-[#C4A494]">
                            {tr("by ", "द्वारा: ", "द्वारे: ", "દ્વારા: ")}{dispute.resolutionOfficer || "DoCA Officer"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MODEL RULES SPECIFICATION */}
      {activeTab === "rules" && (
        <div id="rules" className="space-y-6 animate-in fade-in duration-150 scroll-mt-24">
          <div className="card-3d p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#36112C] pb-3">
              <div>
                <span className="capsule-tag-dark">{tr("GOVERNMENT SPECIFICATION CONFIG", "सरकारी विनिर्देश विन्यास", "सरकारी निकष संरचना", "સરકારી વિશિષ્ટતા રૂપરેખા")}</span>
                <h3 className="font-sans font-black text-2xl text-[#F8D5C2] mt-1">
                  {tr("DoCA Onion Grading Standard Parameters", "DoCA प्याज ग्रेडिंग मानक पैरामीटर", "DoCA कांदा प्रतवारी निकष मापदंड", "DoCA ડુંગળી ગ્રેડિંગ પ્રમાણભૂત પરિમાણો")}
                </h3>
                <p className="text-xs text-[#C4A494] font-mono mt-0.5">
                  {tr("Version: ", "मानक संस्करण: ", "आवृत्ती: ", "આવૃત્તિ: ")}<strong className="text-[#F18B49]">{rulesConfig.version}</strong> • {tr("Governs all client-side computer vision edge classifications.", "सभी कंप्यूटर विज़न एज वर्गीकरण को नियंत्रित करता है।", "सर्व क्लायंट-साइड कॉम्प्युटर व्हिजन एज वर्गीकरणाचे नियमन करते.", "તમામ ક્લાયન્ટ-સાઇડ કમ્પ્યુટર વિઝન એજ વર્ગીકરણનું સંચાલન કરે છે.")}
                </p>
              </div>

              <button
                onClick={() => {
                  saveRulesConfig(rulesConfig);
                  showToast(
                    tr(
                      "Grading thresholds saved & applied to local classification model!",
                      "ग्रेडिंग सीमाएं सहेजी गईं और स्थानीय मॉडल पर लागू की गईं!",
                      "प्रतवारी मर्यादा जतन केल्या आणि स्थानिक मॉडेलवर लागू केल्या!",
                      "ગ્રેડિંગ મર્યાદાઓ સાચવી અને સ્થાનિક મોડેલ પર લાગુ કરી!"
                    ),
                    "success"
                  );
                }}
                className="px-5 py-2.5 btn-3d-lime text-xs transition-all self-start sm:self-auto cursor-pointer"
              >
                {tr("Apply Model Thresholds", "मॉडल सीमाएं लागू करें", "मॉडेल मर्यादा लागू करा", "મોડેલ મર્યાદાઓ લાગુ કરો")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Grade A Rule */}
              <div className="p-5 rounded-[24px] bg-[#120710] border border-[#F18B49]/40 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="capsule-tag">
                    {tr("GRADE A (EXPORT)", "ग्रेड 'अ' (निर्यात)", "ग्रेड 'अ' (निर्यात)", "ગ્રેડ 'અ' (નિકાસ)")}
                  </span>
                  <span className="text-xs text-[#F18B49] font-mono font-bold">
                    {tr("Fair Value: 100%", "उचित मूल्य: 100%", "रास्त भाव: 100%", "વાજબી ભાવ: 100%")}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Diameter Range (mm):", "व्यास सीमा (मिमी):", "व्यास मर्यादा (मिमी):", "વ્યાસ શ્રેણી (મીમી):")}</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <input
                        type="number"
                        value={rulesConfig.rules.gradeA.minDiameterMm}
                        onChange={(e) => {
                          const updated = { ...rulesConfig };
                          updated.rules.gradeA.minDiameterMm = Number(e.target.value);
                          setRulesConfig(updated);
                          saveRulesConfig(updated);
                        }}
                        className="w-16 input-3d px-2 py-1 text-xs text-[#F8D5C2]"
                      />
                      <span>{tr("to", "से", "ते", "થી")}</span>
                      <input
                        type="number"
                        value={rulesConfig.rules.gradeA.maxDiameterMm}
                        onChange={(e) => {
                          const updated = { ...rulesConfig };
                          updated.rules.gradeA.maxDiameterMm = Number(e.target.value);
                          setRulesConfig(updated);
                          saveRulesConfig(updated);
                        }}
                        className="w-16 input-3d px-2 py-1 text-xs text-[#F8D5C2]"
                      />
                      <span>mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Max Dark Rot Patch (%):", "अधिकतम काला धब्बा / सड़न (%):", "कमाल काळा डाग / नासाडी (%):", "મહત્તમ કાળો ડાઘ / સડો (%):")}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={rulesConfig.rules.gradeA.maxDamagePct}
                      onChange={(e) => {
                        const updated = { ...rulesConfig };
                        updated.rules.gradeA.maxDamagePct = Number(e.target.value);
                        setRulesConfig(updated);
                        saveRulesConfig(updated);
                      }}
                      className="w-full input-3d px-2 py-1 text-xs text-[#F8D5C2] mt-0.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Sprouting Limit:", "अंकुरण सीमा:", "कोंब फुटणे मर्यादा:", "અંકુરણ મર્યાદા:")}</label>
                    <input
                      type="text"
                      disabled
                      value={tr("Strict Zero (Score <= 0.04)", "शून्य अंकुरण (स्कोर <= 0.04)", "शून्य कोंब (स्कोअर <= 0.04)", "શૂન્ય અંકુરણ (સ્કોર <= 0.04)")}
                      className="w-full input-3d px-2 py-1 text-xs text-[#C4A494] mt-0.5 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* URS Rule */}
              <div className="p-5 rounded-[24px] bg-[#120710] border border-[#EB87A9]/40 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="capsule-tag-yellow">
                    {tr("URS (DOMESTIC)", "यूआरएस (घरेलू मानक)", "यूआरएस (घरगुती मानक)", "યુઆરએસ (સ્થાનિક)")}
                  </span>
                  <span className="text-xs text-[#EB87A9] font-mono font-bold">
                    {tr("Fair Value: ~75%", "उचित मूल्य: ~75%", "रास्त भाव: ~75%", "વાજબી ભાવ: ~75%")}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Diameter Range (mm):", "व्यास सीमा (मिमी):", "व्यास मर्यादा (मिमी):", "વ્યાસ શ્રેણી (મીમી):")}</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <input
                        type="number"
                        value={rulesConfig.rules.urs.minDiameterMm}
                        onChange={(e) => {
                          const updated = { ...rulesConfig };
                          updated.rules.urs.minDiameterMm = Number(e.target.value);
                          setRulesConfig(updated);
                          saveRulesConfig(updated);
                        }}
                        className="w-16 input-3d px-2 py-1 text-xs text-[#F8D5C2]"
                      />
                      <span>{tr("to", "से", "ते", "થી")}</span>
                      <input
                        type="number"
                        value={rulesConfig.rules.urs.maxDiameterMm}
                        onChange={(e) => {
                          const updated = { ...rulesConfig };
                          updated.rules.urs.maxDiameterMm = Number(e.target.value);
                          setRulesConfig(updated);
                          saveRulesConfig(updated);
                        }}
                        className="w-16 input-3d px-2 py-1 text-xs text-[#F8D5C2]"
                      />
                      <span>mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Max Dark Rot Patch (%):", "अधिकतम काला धब्बा / सड़न (%):", "कमाल काळा डाग / नासाडी (%):", "મહત્તમ કાળો ડાઘ / સડો (%):")}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={rulesConfig.rules.urs.maxDamagePct}
                      onChange={(e) => {
                        const updated = { ...rulesConfig };
                        updated.rules.urs.maxDamagePct = Number(e.target.value);
                        setRulesConfig(updated);
                        saveRulesConfig(updated);
                      }}
                      className="w-full input-3d px-2 py-1 text-xs text-[#F8D5C2] mt-0.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Sprouting Limit:", "अंकुरण सीमा:", "कोंब फुटणे मर्यादा:", "અંકુરણ મર્યાદા:")}</label>
                    <input
                      type="text"
                      disabled
                      value={tr("Minor Button (Score <= 0.20)", "छोटा अंकुर (स्कोर <= 0.20)", "लहान कोंब (स्कोअर <= 0.20)", "નાનું અંકુર (સ્કોર <= 0.20)")}
                      className="w-full input-3d px-2 py-1 text-xs text-[#C4A494] mt-0.5 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Reject Rule */}
              <div className="p-5 rounded-[24px] bg-[#120710] border border-[#FF4D4D]/40 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="capsule-tag-red">
                    {tr("REJECT (DISQUALIFIED)", "अस्वीकृत (खराब / अमान्य)", "नाकारलेले (अपात्र)", "અસ્વીકાર (અમાન્ય)")}
                  </span>
                  <span className="text-xs text-[#FF4D4D] font-mono font-bold">
                    {tr("Disqualified", "अमान्य", "अपात्र", "અમાન્ય")}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Undersized Pinhead Below:", "छोटा कंद (मिमी से कम):", "अतिलहान कांदा (मिमी पेक्षा कमी):", "અતિનાની ડુંગળી (મીમીથી ઓછી):")}</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <input
                        type="number"
                        value={rulesConfig.rules.reject.maxDiameterMm}
                        onChange={(e) => {
                          const updated = { ...rulesConfig };
                          updated.rules.reject.maxDiameterMm = Number(e.target.value);
                          setRulesConfig(updated);
                          saveRulesConfig(updated);
                        }}
                        className="w-20 input-3d px-2 py-1 text-xs text-[#F8D5C2]"
                      />
                      <span>mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Rot Exceeds (%):", "सड़न अधिक (%):", "नासाडी जास्त (%):", "સડો વધુ (%):")}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={rulesConfig.rules.reject.minDamagePct}
                      onChange={(e) => {
                        const updated = { ...rulesConfig };
                        updated.rules.reject.minDamagePct = Number(e.target.value);
                        setRulesConfig(updated);
                        saveRulesConfig(updated);
                      }}
                      className="w-full input-3d px-2 py-1 text-xs text-[#F8D5C2] mt-0.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#C4A494]">{tr("Apical Sprouting:", "अंकुरण सीमा:", "कोंब फुटणे मर्यादा:", "અંકુરણ મર્યાદા:")}</label>
                    <input
                      type="text"
                      disabled
                      value={tr("Active Shoot (Score > 0.20)", "सक्रिय अंकुर (स्कोर > 0.20)", "सक्रिय कोंब (स्कोअर > 0.20)", "સક્રિય અંકુર (સ્કોર > 0.20)")}
                      className="w-full input-3d px-2 py-1 text-xs text-[#C4A494] mt-0.5 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Adjudication Modal */}
      {selectedDispute && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDispute(null);
          }}
        >
          <div 
            className="relative w-full max-w-3xl card-3d p-6 sm:p-8 bg-[#120710] text-[#F8D5C2] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between border-b border-[#36112C] pb-3 mb-4">
              <div className="flex items-center gap-2 text-[#FF4D4D]">
                <Scale size={22} />
                <h3 className="font-sans font-black text-xl text-[#F8D5C2]">
                  {tr(`Adjudicate Dispute #${selectedDispute.id}`, `विवाद #${selectedDispute.id} का निपटारा`, `तक्रार #${selectedDispute.id} चा निकाल`, `વિવાદ #${selectedDispute.id} નો નિકાલ`)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white cursor-pointer transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="capsule-tag-dark mb-1">
                    {tr("ORIGINAL COMPUTER VISION SCAN", "मूल कंप्यूटर विज़न स्कैन", "मूळ कॉम्प्युटर व्हिजन स्कॅन", "મૂળ કમ્પ્યુટર વિઝન સ્કેન")}
                  </div>
                  <img
                    src={selectedDispute.annotatedImage}
                    alt="Scan"
                    className="w-full aspect-[4/3] rounded-2xl object-cover border border-[#36112C]"
                  />
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3.5 bg-[#120710] rounded-2xl border border-white/5 space-y-1 shadow-inner">
                    <div>{tr("Lot ID:", "लॉट आईडी:", "लॉट आयडी:", "લોટ આઈડી:")} <strong className="text-[#F8D5C2]">{selectedDispute.lotId}</strong></div>
                    <div>{tr("Farmer:", "किसान:", "शेतकरी:", "ખેડૂત:")} <strong className="text-[#F8D5C2]">{selectedDispute.farmerName}</strong></div>
                    <div>{tr("Mandi:", "मंडी:", "बाजार समिती:", "માર્કેટ યાર્ડ:")} <span className="text-[#F18B49]">{selectedDispute.mandiName}</span></div>
                    <div>{tr("Original AI Grade:", "मूल एआई ग्रेड:", "मूळ एआय ग्रेड:", "મૂળ એઆઈ ગ્રેડ:")} <strong className="text-[#EB87A9]">{selectedDispute.originalLotGrade}</strong></div>
                  </div>

                  <div className="p-3.5 bg-[#FF4D4D]/15 rounded-2xl border border-[#FF4D4D]/30 space-y-1 shadow-inner">
                    <div className="font-bold text-[#FF4D4D]">{tr("Farmer Grievance:", "किसान की शिकायत:", "शेतकरी तक्रार:", "ખેડૂત ફરિયાદ:")}</div>
                    <div className="text-[#F8D5C2]">{selectedDispute.reason}</div>
                    <p className="text-[#C4A494] italic mt-1 font-sans">"{selectedDispute.farmerNote}"</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#C4A494] mb-1">
                  {tr("Adjudication Finding & Official Remarks", "निर्णय का निष्कर्ष और आधिकारिक टिप्पणी", "निकालाचा निष्कर्ष आणि अधिकृत शेरा", "નિર્ણયનો નિષ્કર્ષ અને સત્તાવાર નોંધ")}
                </label>
                <textarea
                  value={adjudicationNote}
                  onChange={(e) => setAdjudicationNote(e.target.value)}
                  rows={2}
                  placeholder={tr(
                    "Enter magistrate finding (e.g. Surface discoloration verified as dirt; reclassified to Grade A)...",
                    "अधिकारी निष्कर्ष दर्ज करें (उदा. सतह का रंग केवल मिट्टी के कारण था; ग्रेड 'अ' में पुनर्वर्गीकृत किया गया)...",
                    "अधिकाऱ्याचा निष्कर्ष नोंदवा (उदा. पृष्ठभागाचा रंग केवळ मातीमुळे होता; ग्रेड 'अ' मध्ये पुनर्वर्गीकृत केले)...",
                    "અધિકારીનો નિષ્કર્ષ દાખલ કરો (દા.ત. સપાટીનો રંગ માત્ર માટીને કારણે હતો; ગ્રેડ 'અ' માં પુનઃવર્ગીકૃત કરેલ)..."
                  )}
                  className="w-full input-3d p-3 text-xs text-[#F8D5C2] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#36112C]">
                <button
                  type="button"
                  onClick={() => handleResolveDispute("uphold")}
                  className="px-5 py-2.5 btn-3d-dark text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={14} className="text-[#C4A494]" />
                  <span>{tr("Uphold AI Grade", "एआई ग्रेड बरकरार रखें", "एआय प्रतवारी कायम ठेवा", "એઆઈ ગ્રેડ યથાવત રાખો")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveDispute("override", "URS")}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-b from-[#F59B5E] to-[#F76B1C] text-[#000000] font-extrabold text-xs shadow-md transition-all cursor-pointer hover:brightness-105 active:translate-y-0.5"
                >
                  <span>{tr("Override to URS", "यूआरएस में संशोधित करें", "यूआरएस मध्ये बदला", "યુઆરએસમાં સુધારો")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveDispute("override", "Grade A")}
                  className="px-5 py-2.5 btn-3d-lime text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  <span>{tr("Override to Grade A (Premium Market Rate)", "ग्रेड 'अ' में संशोधित करें (प्रीमियम दर)", "ग्रेड 'अ' मध्ये बदला (प्रीमियम दर)", "ગ્રેડ 'અ' માં સુધારો (પ્રીમિયમ દર)")}</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
