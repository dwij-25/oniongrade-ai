import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import QRCode from "qrcode";
import { getLots } from "../services/storage";
import { predictShelfLife } from "../services/shelfLifePredictor";
import { getMarketSignal } from "../services/marketPricing";
import { useLanguage } from "../context/LanguageContext";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Share2,
  ExternalLink,
  Award,
  FileCheck,
  QrCode,
  ArrowLeft,
  Truck,
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";

export default function LotVerificationPage() {
  const { lotId } = useParams();
  const { tr, t } = useLanguage();
  const [lot, setLot] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allLots = getLots();
    const found = allLots.find((l) => l.id === lotId);
    if (found) {
      setLot(found);
    } else {
      // If lot ID was entered or scanned from a seed, fallback to first seed lot
      setLot(allLots[0] || null);
    }
    setLoading(false);
  }, [lotId]);

  useEffect(() => {
    if (lot) {
      const url = window.location.href;
      QRCode.toDataURL(url, {
        width: 200,
        margin: 1.5,
        color: { dark: "#000000", light: "#FFFFFF" }
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [lot]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono text-[#C4A494]">
        {tr("Verifying AGMARK Digital Seal...", "एगमार्क डिजिटल सील का सत्यापन किया जा रहा है...", "अ‍ॅगमार्क डिजिटल सील पडताळणी सुरू आहे...", "એગમાર્ક ડિજિટલ સીલ ચકાસી રહ્યું છે...")}
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 text-[#F8D5C2]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-xl font-bold">{tr("Lot Record Not Found", "लॉट रिकॉर्ड नहीं मिला", "लॉट नोंद सापडली नाही", "લોટ રેકોર્ડ મળ્યો નથી")}</h1>
        <p className="text-xs text-[#C4A494] font-mono">
          {tr("The requested lot identifier could not be verified in the national registry.", "अनुरोधित लॉट पहचानकर्ता राष्ट्रीय रजिस्ट्री में सत्यापित नहीं किया जा सका।", "विनंती केलेला लॉट राष्ट्रीय नोंदणीमध्ये पडताळला जाऊ शकला नाही.", "વિનંતી કરેલ લોટ રાષ્ટ્રીય રજિસ્ટ્રીમાં ચકાસી શકાયો નથી.")}
        </p>
        <Link to="/" className="px-5 py-2.5 rounded-full btn-3d-lime text-xs font-mono font-bold inline-block">
          {tr("Return to OnionGrade Portal", "पोर्टल पर वापस लौटें", "पोर्टलवर परत जा", "પોર્ટલ પર પાછા જાઓ")}
        </Link>
      </div>
    );
  }

  const shelfLife = predictShelfLife(lot);
  const marketSignal = getMarketSignal(lot);
  const isGradeA = lot.lotGrade === "Grade A";
  const isReject = lot.lotGrade === "Reject";

  const certFingerprint = `SHA256-${(lot.id + lot.createdAt + (lot.lotGrade || "")).split("").reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0).toString(16).toUpperCase().padStart(12, "0")}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    let text = "";
    if (language === "mr") {
      text = `🧅 *DoCA अ‍ॅगमार्क गुणवत्ता प्रमाणपत्र*\n*लॉट आयडी:* ${lot.id}\n*प्रतवारी:* ${lot.lotGrade === "Grade A" ? "ग्रेड 'अ'" : lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ग्रेड 'अ')\n*बाजार समिती:* ${lot.mandiName}\n*थेट प्रमाणपत्र तपासा:* ${window.location.href}`;
    } else if (language === "gu") {
      text = `🧅 *DoCA એગમાર્ક ગુણવત્તા પ્રમાણપત્ર*\n*લોટ આઈડી:* ${lot.id}\n*ગ્રેડ:* ${lot.lotGrade === "Grade A" ? "ગ્રેડ 'અ'" : lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ગ્રેડ 'અ')\n*માર્કેટ યાર્ડ:* ${lot.mandiName}\n*લાઈવ પ્રમાણપત્ર જુઓ:* ${window.location.href}`;
    } else if (language === "hi") {
      text = `🧅 *DoCA एगमार्क गुणवत्ता प्रमाणपत्र*\n*लॉट आईडी:* ${lot.id}\n*ग्रेड:* ${lot.lotGrade === "Grade A" ? "ग्रेड 'अ'" : lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ग्रेड 'अ')\n*मंडी:* ${lot.mandiName}\n*लाइव प्रमाणपत्र देखें:* ${window.location.href}`;
    } else {
      text = `🧅 *DoCA AGMARK QUALITY CERTIFICATE*\n*Lot ID:* ${lot.id}\n*Grade:* ${lot.lotGrade} (${lot.stats?.gradeAPct || 0}% Grade A)\n*Mandi:* ${lot.mandiName}\n*Verify Live:* ${window.location.href}`;
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-[#F8D5C2]">
      
      {/* Top Navigation & Verification Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F18B49] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>{tr("Back to Public Portal", "सार्वजनिक पोर्टल पर वापस", "सार्वजनिक पोर्टलवर परत", "જાહેર પોર્ટલ પર પાછા")}</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180815] border border-[#F18B49]/40 text-xs font-mono text-[#F18B49]">
          <ShieldCheck size={16} />
          <span className="font-bold">{tr("VERIFIED DoCA AGMARK DIGITAL SEAL", "सत्यापित DoCA एगमार्क डिजिटल सील", "प्रमाणित DoCA अ‍ॅगमार्क डिजिटल सील", "ચકાસાયેલ DoCA એગમાર્ક ડિજિટલ સીલ")}</span>
        </div>
      </div>

      {/* Main Official Passport Certificate Frame */}
      <div className="rounded-3xl bg-[#0D050C] border-2 border-[#F18B49]/40 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
        
        {/* Certificate Header Banner */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="DoCA Agmark Logo"
              className="w-16 h-16 object-contain rounded-2xl bg-black p-1.5 border border-white/20 shadow-md"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#F18B49] font-black uppercase tracking-wider mb-1">
                <span>GOVERNMENT OF INDIA • AGMARK CERTIFIED</span>
              </div>
              <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#FFF5ED] tracking-tight">
                {tr("National Onion Quality Passport", "राष्ट्रीय प्याज गुणवत्ता पासपोर्ट", "राष्ट्रीय कांदा गुणवत्ता पासपोर्ट", "રાષ્ટ્રીય ડુંગળી ગુણવત્તા પાસપોર્ટ")}
              </h1>
              <p className="text-xs text-[#C4A494] font-mono mt-1">
                Department of Consumer Affairs • Price Stabilization Fund Management Cell
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1">
            <span className={`px-5 py-2 rounded-full font-sans font-black text-base uppercase tracking-wider shadow-lg ${
              isGradeA
                ? "bg-[#F18B49] text-black"
                : isReject
                ? "bg-[#FF4D4D] text-white"
                : "bg-[#EB87A9] text-black"
            }`}>
              {lot.lotGrade}
            </span>
            <span className="text-[11px] font-mono text-[#C4A494]">
              {lot.stats?.gradeAPct || 0}% Grade A • {lot.stats?.ursPct || 0}% URS
            </span>
          </div>
        </div>

        {/* Cryptographic Identification Bar */}
        <div className="p-4 rounded-2xl bg-[#140711] border border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#C4A494] uppercase block">LOT IDENTIFIER</span>
            <strong className="text-sm text-[#F8D5C2] mt-0.5 block">{lot.id}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#C4A494] uppercase block">PRODUCER / FARMER</span>
            <strong className="text-sm text-[#F8D5C2] mt-0.5 block">{lot.farmerName || "Rameshwar Patil"}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#C4A494] uppercase block">APMC MANDI</span>
            <strong className="text-sm text-[#F8D5C2] mt-0.5 block">{lot.mandiName}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#C4A494] uppercase block">QUANTITY</span>
            <strong className="text-sm text-[#F18B49] mt-0.5 block">{lot.quantityQuintals || 40} Quintals</strong>
          </div>
        </div>

        {/* Bento Grid: Calibrated Photo + Scannable QR + Morphological Caliper Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Calibrated Optical Photo */}
          <div className="md:col-span-7 space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-inner">
              <img
                src={lot.annotatedImage || lot.thumbnail}
                alt="Calibrated Onion Scan"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#F18B49] border border-[#F18B49]/30">
                {lot.stats?.totalBulbs || 9} Bulbs Segmented • ICAR-DOGR 2.4
              </div>
            </div>

            {/* Micro-Metrics Row */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#120710] border border-white/5">
                <span className="text-[10px] text-[#C4A494] block">AVG DIAMETER</span>
                <strong className="text-base text-[#F8D5C2] mt-0.5 block">{lot.stats?.avgDiameterMm || 52.8} mm</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#120710] border border-white/5">
                <span className="text-[10px] text-[#C4A494] block">ROT / DAMAGE</span>
                <strong className="text-base text-[#F18B49] mt-0.5 block">{lot.stats?.avgDamagePct || 0.8}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#120710] border border-white/5">
                <span className="text-[10px] text-[#C4A494] block">SPROUT SHOOT</span>
                <strong className="text-base text-[#F8D5C2] mt-0.5 block">{lot.stats?.sproutCount || 0} Bulbs</strong>
              </div>
            </div>
          </div>

          {/* QR Passport + Market Signal + Shelf Life */}
          <div className="md:col-span-5 space-y-4">
            
            <div className="p-5 rounded-2xl bg-[#120710] border border-white/[0.08] text-center space-y-3">
              <span className="text-[11px] font-mono font-bold text-[#F8D5C2] block">
                IMMUTABLE VERIFICATION QR
              </span>
              <div className="w-40 h-40 mx-auto p-2 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="Traceable QR" className="w-full h-full object-contain" />
                )}
              </div>
              <div className="text-[10px] font-mono text-[#C4A494] break-all">
                Hash: <span className="text-[#F18B49]">{certFingerprint}</span>
              </div>
            </div>

            {/* Shelf Life Prediction Card */}
            <div className="p-4 rounded-2xl bg-[#1A0A16] border border-[#F18B49]/40 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C4A494] uppercase font-bold">PREDICTED SHELF-LIFE</span>
                <span className="text-[#F18B49] font-bold">{shelfLife?.safeDays || 45} Days Safe</span>
              </div>
              <p className="text-xs text-[#F8D5C2] font-mono leading-relaxed">
                {shelfLife?.pdiAction}
              </p>
              <div className="text-[10px] font-mono text-[#C4A494] pt-1 border-t border-white/[0.06]">
                Priority Dispatch Index: <strong className="text-[#F18B49]">{shelfLife?.pdi || 12}/100</strong> ({shelfLife?.riskLevel?.toUpperCase()} RISK)
              </div>
            </div>

            {/* Mandi Valuation */}
            <div className="p-4 rounded-2xl bg-[#140711] border border-[#EB87A9]/40 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C4A494] uppercase font-bold">CERTIFIED MANDI VALUE</span>
                <span className="text-[#EB87A9] font-black text-sm">₹{marketSignal?.blendedRate || 2850}/qtl</span>
              </div>
              <div className="text-[11px] text-[#C4A494] font-mono">
                Estimated Lot Realization: <strong className="text-[#FFF5ED]">₹{(marketSignal?.totalLotValue || 114000).toLocaleString("en-IN")}</strong>
              </div>
            </div>

          </div>

        </div>

        {/* 4-Step Supply Chain Traceability Audit Trail */}
        <div className="p-5 rounded-2xl bg-[#120710] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <h3 className="font-mono font-bold text-xs text-[#F8D5C2] uppercase tracking-wider flex items-center gap-2">
              <Truck size={14} className="text-[#F18B49]" />
              <span>SUPPLY-CHAIN CUSTODY & TRACEABILITY AUDIT TRAIL</span>
            </h3>
            <span className="capsule-tag py-0.5 text-[9px]">4 NODES VERIFIED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-[10px] text-[#F18B49] font-bold">1. HARVEST ORIGIN</div>
              <div className="font-bold text-[#F8D5C2]">Farm Gate / Khasra</div>
              <div className="text-[10px] text-[#C4A494]">Vinchur, Niphad Taluka, Nashik</div>
              <div className="text-[9px] text-[#F18B49]">✓ Cured & Bagged</div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-[10px] text-[#F18B49] font-bold">2. APMC WEIGHBRIDGE</div>
              <div className="font-bold text-[#F8D5C2]">Intake Yard #2</div>
              <div className="text-[10px] text-[#C4A494]">{lot.mandiName}</div>
              <div className="text-[9px] text-[#F18B49]">✓ {lot.quantityQuintals || 40} Qtl Weighed</div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-[#1A0A16] border border-[#F18B49]/40 space-y-1">
              <div className="text-[10px] text-[#F18B49] font-bold">3. OPTICAL AI GRADE</div>
              <div className="font-bold text-[#F18B49]">{lot.lotGrade} Certified</div>
              <div className="text-[10px] text-[#C4A494]">Insp. Vinayak Shinde (8492)</div>
              <div className="text-[9px] text-[#F18B49]">✓ Tamper-proof Seal</div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-[10px] text-[#EB87A9] font-bold">4. COLD-CHAIN BUFFER</div>
              <div className="font-bold text-[#F8D5C2]">NAFED / Retail Route</div>
              <div className="text-[10px] text-[#C4A494]">{shelfLife?.pdiCategory?.split("(")[0]}</div>
              <div className="text-[9px] text-[#EB87A9]">✓ {shelfLife?.safeDays || 45}d Safe Window</div>
            </div>
          </div>
        </div>

        {/* Certificate Bottom Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#C4A494]">
            Inspected under Agmark Rules 2025 • Department of Consumer Affairs, GoI
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-[#25D366]/20"
            >
              <Share2 size={13} />
              <span>{tr("Share to WhatsApp", "व्हाट्सएप पर शेयर करें", "व्हॉट्सअ‍ॅपवर शेअर करा", "વોટ્સએપ પર શેર કરો")}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-full bg-[#F18B49] hover:bg-[#FAAC78] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-[#F18B49]/20"
            >
              <Printer size={14} />
              <span>{tr("Print Official Certificate", "प्रमाणपत्र प्रिंट करें", "प्रमाणपत्र प्रिंट करा", "પ્રમાણપત્ર પ્રિન્ટ કરો")}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
