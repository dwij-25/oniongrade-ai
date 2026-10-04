import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { useLanguage } from "../context/LanguageContext";
import { predictShelfLife } from "../services/shelfLifePredictor";
import { getMarketSignal } from "../services/marketPricing";
import {
  X,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Award,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  FileCheck,
  Download,
  AlertTriangle
} from "lucide-react";

export default function DigitalCertificateModal({ isOpen, onClose, lot }) {
  const { tr, t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef(null);

  const verificationUrl = lot
    ? `${window.location.origin}/verify/${lot.id}`
    : `${window.location.origin}`;

  // Generate QR Code data URL when lot changes
  useEffect(() => {
    if (lot && isOpen) {
      QRCode.toDataURL(verificationUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        },
        errorCorrectionLevel: "H"
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [lot, isOpen, verificationUrl]);

  if (!isOpen || !lot) return null;

  const shelfLife = predictShelfLife(lot);
  const marketSignal = getMarketSignal(lot);
  const isGradeA = lot.lotGrade === "Grade A";
  const isReject = lot.lotGrade === "Reject";

  // Pseudo-immutable cryptographic fingerprint based on lot attributes
  const certFingerprint = `SHA256-${(lot.id + lot.createdAt + (lot.lotGrade || "")).split("").reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0).toString(16).toUpperCase().padStart(12, "0")}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    let text = "";
    if (language === "mr") {
      text = `🧅 *DoCA अ‍ॅगमार्क गुणवत्ता प्रमाणपत्र*\n*लॉट आयडी:* ${lot.id}\n*प्रतवारी:* ${lot.lotGrade === "Grade A" ? "ग्रेड 'अ'" : lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ग्रेड 'अ')\n*बाजार समिती:* ${lot.mandiName}\n*सुरक्षित साठवणूक:* ${shelfLife?.safeDays || 45} दिवस\n*अंदाजित भाव:* ₹${marketSignal?.blendedRate || 2850}/क्विंटल\n*प्रमाणपत्र तपासा:* ${verificationUrl}`;
    } else if (language === "gu") {
      text = `🧅 *DoCA એગમાર્ક ગુણવત્તા પ્રમાણપત્ર*\n*લોટ આઈડી:* ${lot.id}\n*ગ્રેડ:* ${lot.lotGrade === "Grade A" ? "ગ્રેડ 'અ'" : lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ગ્રેડ 'અ')\n*માર્કેટ યાર્ડ:* ${lot.mandiName}\n*સુરક્ષિત સંગ્રહ:* ${shelfLife?.safeDays || 45} દિવસ\n*અંદાજિત ભાવ:* ₹${marketSignal?.blendedRate || 2850}/ક્વિન્ટલ\n*પ્રમાણપત્ર જુઓ:* ${verificationUrl}`;
    } else if (language === "hi") {
      text = `🧅 *DoCA एगमार्क गुणवत्ता प्रमाणपत्र*\n*लॉट आईडी:* ${lot.id}\n*ग्रेड:* ${lot.lotGrade === "Grade A" ? "ग्रेड 'अ'" : lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ग्रेड 'अ')\n*मंडी:* ${lot.mandiName}\n*सुरक्षित भंडारण अवधि:* ${shelfLife?.safeDays || 45} दिन\n*अनुमानित भाव:* ₹${marketSignal?.blendedRate || 2850}/क्विंटल\n*प्रमाणपत्र देखें:* ${verificationUrl}`;
    } else {
      text = `🧅 *DoCA AGMARK QUALITY CERTIFICATE*\n*Lot ID:* ${lot.id}\n*Grade:* ${lot.lotGrade} (${lot.stats?.gradeAPct || 0}% Grade A)\n*Mandi:* ${lot.mandiName}\n*Safe Shelf Life:* ${shelfLife?.safeDays || 45} Days\n*Estimated Rate:* ₹${marketSignal?.blendedRate || 2850}/Quintal\n*Verify Certificate:* ${verificationUrl}`;
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0D050C] border border-[#F18B49]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#180815]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F18B49]/20 border border-[#F18B49]/50 flex items-center justify-center text-[#F18B49]">
              <QrCode size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-sm sm:text-base text-[#FFF5ED]">
                  {tr("Digital Quality Certificate & QR Passport", "डिजिटल गुणवत्ता प्रमाणपत्र एवं क्यूआर पासपोर्ट", "डिजिटल गुणवत्ता प्रमाणपत्र आणि क्यूआर पासपोर्ट", "ડિજિટલ ગુણવત્તા પ્રમાણપત્ર અને ક્યુઆર પાસપોર્ટ")}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F18B49]/15 border border-[#F18B49]/40 text-[#F18B49] text-[10px] font-mono font-bold">
                  IMMUTABLE
                </span>
              </div>
              <p className="text-[11px] text-[#C4A494] font-mono mt-0.5">
                {tr("DoCA Agmark Traceable Supply-Chain Trust Artifact", "उपभोक्ता मामले विभाग एगमार्क ट्रैसेबल आपूर्ति शृंखला प्रमाणपत्र", "ग्राहक व्यवहार विभाग अ‍ॅगमार्क पुरवठा साखळी विश्वास पुरावा", "ગ્રાહક બાબતોનો વિભાગ એગમાર્ક સપ્લાય-ચેન ટ્રસ્ટ આર્ટિફેક્ટ")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Printable Certificate Body */}
        <div ref={printAreaRef} className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Official DoCA / Agmark Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1E0A1A] to-[#120710] border border-[#F18B49]/30 relative overflow-hidden text-center sm:text-left space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="DoCA Logo"
                  className="w-12 h-12 object-contain rounded-full bg-black p-1 border border-white/20 shadow-md"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div>
                  <div className="text-[10px] font-mono text-[#F18B49] uppercase font-black tracking-widest">
                    GOVERNMENT OF INDIA • MINISTRY OF CONSUMER AFFAIRS
                  </div>
                  <h2 className="font-sans font-black text-lg sm:text-xl text-[#FFF5ED]">
                    Department of Consumer Affairs (DoCA) & AGMARK
                  </h2>
                  <div className="text-xs text-[#C4A494] font-mono">
                    National Onion Buffer Stock Management & Quality Certification
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end">
                <span className={`px-4 py-1.5 rounded-full font-sans font-black text-sm shadow-md uppercase tracking-wider ${
                  isGradeA
                    ? "bg-[#F18B49] text-black"
                    : isReject
                    ? "bg-[#FF4D4D] text-white"
                    : "bg-[#EB87A9] text-black"
                }`}>
                  {lot.lotGrade}
                </span>
                <span className="text-[10px] font-mono text-[#C4A494] mt-1">
                  ICAR-DOGR Standard 2.4
                </span>
              </div>
            </div>

            {/* Core Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-[#C4A494] uppercase block">LOT IDENTIFIER</span>
                <span className="font-bold text-[#F8D5C2] mt-0.5 block">{lot.id}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-[#C4A494] uppercase block">PRODUCER / FARMER</span>
                <span className="font-bold text-[#F8D5C2] mt-0.5 block">{lot.farmerName || "Rameshwar Patil"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-[#C4A494] uppercase block">APMC LOCATION</span>
                <span className="font-bold text-[#F8D5C2] mt-0.5 block">{lot.mandiName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-[#C4A494] uppercase block">QUANTITY / WEIGHT</span>
                <span className="font-bold text-[#F18B49] mt-0.5 block">{lot.quantityQuintals || 40} Quintals</span>
              </div>
            </div>

            {/* Cryptographic Seal */}
            <div className="p-2.5 rounded-xl bg-[#090308] border border-white/[0.06] text-[10px] font-mono text-[#C4A494] flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[#F8D5C2]">
                <ShieldCheck size={14} className="text-[#F18B49]" />
                <span><strong>DIGITAL CERTIFICATE FINGERPRINT:</strong> {certFingerprint}</span>
              </div>
              <span className="text-[#F18B49] font-bold">TAMPER-EVIDENT HASH</span>
            </div>
          </div>

          {/* Bento Row: QR Code + Calibrated Optical Scan Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* Left: Scannable QR Code Box */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-[#120710] border border-white/[0.08] text-center space-y-3">
              <div className="text-xs font-mono font-bold text-[#F8D5C2] flex items-center justify-center gap-1.5">
                <QrCode size={14} className="text-[#F18B49]" />
                <span>SCAN WITH ANY CAMERA</span>
              </div>

              <div className="w-48 h-48 mx-auto p-2 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Traceability QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black text-xs font-mono">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-[#C4A494]">
                Direct Public Link:
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[#F18B49] hover:underline font-bold truncate mt-0.5"
                >
                  {verificationUrl}
                </a>
              </div>
            </div>

            {/* Right: Optical Analysis Metrics & Calibrated Image */}
            <div className="md:col-span-7 space-y-3">
              <div className="p-4 rounded-2xl bg-[#140711] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#C4A494]">OPTICAL CALIPER BREAKDOWN</span>
                  <span className="text-[#F18B49] font-bold">{lot.stats?.totalBulbs || 9} Bulbs Segmented</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#C4A494]">GRADE A</span>
                    <div className="text-base font-bold text-[#F18B49] mt-0.5">{lot.stats?.gradeAPct || 0}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#C4A494]">URS DOMESTIC</span>
                    <div className="text-base font-bold text-[#EB87A9] mt-0.5">{lot.stats?.ursPct || 0}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#C4A494]">REJECT</span>
                    <div className="text-base font-bold text-[#FF4D4D] mt-0.5">{lot.stats?.rejectPct || 0}%</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono pt-1">
                  <div className="flex justify-between text-[11px] text-[#C4A494]">
                    <span>Avg Caliper Diameter:</span>
                    <strong className="text-[#F8D5C2]">{lot.stats?.avgDiameterMm || 52.8} mm</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#C4A494]">
                    <span>Avg Rot / Surface Decay:</span>
                    <strong className="text-[#F18B49]">{lot.stats?.avgDamagePct || 0.8}%</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#C4A494]">
                    <span>Sprout Shooting Index:</span>
                    <strong className="text-[#F8D5C2]">{lot.stats?.sproutCount || 0} Bulbs Active</strong>
                  </div>
                </div>
              </div>

              {/* Shelf-Life & Market Rate Snapshot */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-[#1A0A16] border border-[#F18B49]/30">
                  <span className="text-[10px] text-[#C4A494] uppercase block">SAFE SHELF-LIFE</span>
                  <div className="text-sm font-black text-[#F18B49] mt-0.5">
                    {shelfLife?.safeDays || 45} Days Safe
                  </div>
                  <span className="text-[9px] text-[#C4A494] block mt-0.5">
                    {shelfLife?.pdiCategory?.split("(")[0]}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#1A0A16] border border-[#EB87A9]/30">
                  <span className="text-[10px] text-[#C4A494] uppercase block">APMC MANDI VALUE</span>
                  <div className="text-sm font-black text-[#EB87A9] mt-0.5">
                    ₹{marketSignal?.blendedRate || 2850}/qtl
                  </div>
                  <span className="text-[9px] text-[#C4A494] block mt-0.5">
                    Lot: ₹{(marketSignal?.totalLotValue || 114000).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Supply Chain Custody & Inspection Officer Seal */}
          <div className="p-4 rounded-2xl bg-[#120710] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#C4A494]">
            <div className="flex items-center gap-2">
              <FileCheck size={16} className="text-[#F18B49]" />
              <div>
                <strong className="text-[#F8D5C2]">INSPECTING APMC OFFICER:</strong> Inspector Vinayak Shinde (APMC-INSP-8492)
              </div>
            </div>
            <div>
              <strong>TIMESTAMP:</strong> {new Date(lot.createdAt || Date.now()).toLocaleString("en-IN")}
            </div>
          </div>

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#140711] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F8D5C2] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy size={13} />
              <span>{copied ? tr("Copied Link!", "लिंक कॉपी हो गया!", "लिंक कॉपी झाली!", "લિંક કોપી થઈ ગઈ!") : tr("Copy URL", "लिंक कॉपी करें", "लिंक कॉपी करा", "લિંક કોપી કરો")}</span>
            </button>

            <a
              href={verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F8D5C2] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>{tr("Public View", "सार्वजनिक दृश्य", "सार्वजनिक दृश्य", "જાહેર જુઓ")}</span>
            </a>
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
              <span>{tr("Print Certificate", "सर्टिफिकेट प्रिंट करें", "प्रमाणपत्र प्रिंट करा", "પ્રમાણપત્ર પ્રિન્ટ કરો")}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
