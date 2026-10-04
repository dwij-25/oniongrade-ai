import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { saveLot } from "../services/storage";
import { X, Scale, CheckCircle, Printer } from "lucide-react";
import confetti from "canvas-confetti";

export default function ProcurementModal({ lot, isOpen, onClose, onProcurementLogged }) {
  const { user, showToast } = useAuth();
  const { language, tr } = useLanguage();

  const [farmerName, setFarmerName] = useState(lot?.farmerName || "Rameshwar Patil");
  const [farmerId, setFarmerId] = useState("FARM-MH-9812");
  const [vehicleNo, setVehicleNo] = useState("MH-15-EG-4419 (Tractor)");
  const [quintals, setQuintals] = useState(lot?.quantityQuintals || 45.0);
  const [moisturePct, setMoisturePct] = useState(11.4);
  const [ratePerQtl, setRatePerQtl] = useState(
    lot?.lotGrade === "Grade A" ? 2850 : lot?.lotGrade === "URS" ? 2150 : 1200
  );

  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lot) return null;

  const totalPayout = Math.round(quintals * ratePerQtl);

  const handleConfirm = (e) => {
    e.preventDefault();

    const updatedLot = {
      ...lot,
      farmerName,
      farmerId,
      vehicleNo,
      quantityQuintals: Number(quintals),
      moisturePct: Number(moisturePct),
      estimatedPricePerQuintal: Number(ratePerQtl),
      procuredBy: user?.name || "APMC Officer",
      procuredAt: new Date().toISOString(),
      centreName: user?.mandi || "Lasalgaon APMC Intake Yard",
      status: "procured_in_stock"
    };

    saveLot(updatedLot);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F18B49", "#FAAC78", "#FFFFFF"]
      });
    } catch (e) {}

    const receipt = {
      receiptNo: `APMC-REC-${Date.now().toString().slice(-6)}`,
      lotId: lot.id,
      timestamp: new Date().toLocaleString(),
      farmerName,
      farmerId,
      vehicleNo,
      mandi: user?.mandi || "Lasalgaon APMC",
      officer: user?.name || "Vinayak Shinde",
      lotGrade: lot.lotGrade,
      quintals,
      ratePerQtl,
      totalPayout,
      gradeAPct: lot.stats?.gradeAPct || 0,
      ursPct: lot.stats?.ursPct || 0,
      rejectPct: lot.stats?.rejectPct || 0
    };

    setReceiptData(receipt);
    setReceiptGenerated(true);
    showToast(
      tr(
        `Lot ${lot.id} logged into APMC electronic ledger!`,
        `लॉट ${lot.id} एपीएमसी इलेक्ट्रॉनिक लेजर में दर्ज!`,
        `लॉट ${lot.id} बाजार समिती इलेक्ट्रॉनिक नोंदवहीत नोंदवला!`,
        `લોટ ${lot.id} એપીએમસી ઇલેક્ટ્રોનિક લેજરમાં નોંધાયો!`
      ),
      "success"
    );

    if (onProcurementLogged) {
      onProcurementLogged(updatedLot);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl bg-[#000000] border border-[#36112C] rounded-[32px] shadow-2xl p-6 text-[#F8D5C2] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {receiptGenerated && receiptData ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F18B49]/20 border border-[#F18B49] mx-auto flex items-center justify-center text-[#F18B49] mb-2">
                <CheckCircle size={26} />
              </div>
              <h3 className="font-sans font-black text-xl text-[#F8D5C2]">
                {tr("Official e-Lot Weighbridge Slip", "आधिकारिक ई-लॉट वजनपुल पर्ची", "अधिकृत ई-लॉट वजनकाटा पावती", "સત્તાવાર ઇ-લોટ વજનકાંટા પાવતી")}
              </h3>
              <p className="text-xs text-[#C4A494]">
                {tr("Recorded to National APMC Electronic Buffer", "राष्ट्रीय एपीएमसी इलेक्ट्रॉनिक बफर में दर्ज", "राष्ट्रीय बाजार समिती इलेक्ट्रॉनिक बफरमध्ये नोंदवले", "રાષ્ટ્રીય એપીએમસી ઇલેક્ટ્રોનિક બફરમાં નોંધાયેલ")}
              </p>
            </div>

            {/* Printable Receipt Paper layout */}
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-weighbridge-slip, #printable-weighbridge-slip * {
                  visibility: visible !important;
                }
                #printable-weighbridge-slip {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 24px !important;
                  background: white !important;
                  color: black !important;
                }
              }
            `}</style>
            <div id="printable-weighbridge-slip" className="p-5 bg-[#F8D5C2] text-[#000000] rounded-[24px] font-mono text-xs shadow-inner space-y-3 border border-[#E6DDC8]">
              <div className="flex items-center justify-between border-b border-[#D0C3A8] pb-2">
                <div>
                  <div className="font-black text-sm">
                    {tr("KRISHI UPAJ MANDI SAMITI (APMC)", "कृषि उपज मंडी समिति (एपीएमसी)", "कृषी उत्पन्न बाजार समिती (APMC)", "ખેતીવાડી ઉત્પન્ન બજાર સમિતિ (APMC)")}
                  </div>
                  <div className="text-[10px] text-[#555]">{receiptData.mandi}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#888]">{tr("SLIP NO.", "पर्ची सं.", "पावती क्र.", "પાવતી નં.")}</div>
                  <div className="font-bold text-xs">{receiptData.receiptNo}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-[#666]">{tr("Farmer:", "किसान:", "शेतकरी:", "ખેડૂત:")}</span> <strong>{receiptData.farmerName}</strong></div>
                <div><span className="text-[#666]">{tr("Farmer ID:", "किसान आईडी:", "शेतकरी आयडी:", "ખેડૂત આઈડી:")}</span> <strong>{receiptData.farmerId}</strong></div>
                <div><span className="text-[#666]">{tr("Vehicle:", "वाहन:", "वाहन:", "વાહન:")}</span> <strong>{receiptData.vehicleNo}</strong></div>
                <div><span className="text-[#666]">{tr("Date/Time:", "दिनांक/समय:", "दिनांक/वेळ:", "તારીખ/સમય:")}</span> <strong>{receiptData.timestamp}</strong></div>
              </div>

              <div className="border-t border-b border-[#D0C3A8] py-2">
                <div className="flex justify-between items-center text-xs">
                  <span>{tr("LOT ID:", "लॉट आईडी:", "लॉट आयडी:", "લોટ આઈડી:")} <strong>{receiptData.lotId}</strong></span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#000000] text-[#F18B49] font-bold text-[10px]">
                    {receiptData.lotGrade === "Grade A" ? tr("GRADE A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'") : receiptData.lotGrade.toUpperCase()}
                  </span>
                </div>
                <div className="text-[10px] text-[#555] mt-1">
                  {tr(
                    `Quality: ${receiptData.gradeAPct}% Grade A • ${receiptData.ursPct}% URS • ${receiptData.rejectPct}% Reject`,
                    `गुणवत्ता: ${receiptData.gradeAPct}% ग्रेड 'अ' • ${receiptData.ursPct}% URS • ${receiptData.rejectPct}% अस्वीकृत`,
                    `गुणवत्ता: ${receiptData.gradeAPct}% ग्रेड 'अ' • ${receiptData.ursPct}% URS • ${receiptData.rejectPct}% नाकारलेले`,
                    `ગુણવત્તા: ${receiptData.gradeAPct}% ગ્રેડ 'અ' • ${receiptData.ursPct}% URS • ${receiptData.rejectPct}% અસ્વીકાર`
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-1">
                <div>
                  <div className="text-[10px] text-[#666]">{tr("GROSS WEIGHT & MSP", "कुल वजन व दर", "एकूण वजन आणि हमीभाव/दर", "કુલ વજન અને ભાવ")}</div>
                  <div className="font-bold">
                    {receiptData.quintals} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")} @ ₹{receiptData.ratePerQtl}/{tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#666]">{tr("NET DISBURSAL DUE", "देय शुद्ध भुगतान", "देय निव्वळ रक्कम", "ચૂકવવાપાત્ર ચોખ્ખી રકમ")}</div>
                  <div className="font-black text-base text-[#1F0B1B]">₹{receiptData.totalPayout.toLocaleString("en-IN")}</div>
                </div>
              </div>

              <div className="border-t border-[#D0C3A8] pt-2 flex justify-between text-[9px] text-[#777]">
                <span>{tr("Officer: ", "अधिकारी: ", "अधिकारी: ", "અધિકારી: ")}{receiptData.officer}</span>
                <span>{tr("DoCA Certified AI Vision", "DoCA प्रमाणित एआई विज़न", "DoCA प्रमाणित एआय व्हिजन", "DoCA પ્રમાણિત એઆઈ વિઝન")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-[#F8D5C2] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer size={14} />
                <span>{tr("Print Slip", "पर्ची प्रिंट करें", "पावती प्रिंट करा", "પાવતી પ્રિન્ટ કરો")}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#F18B49] hover:bg-[#FAAC78] text-[#000000] font-bold text-xs transition-colors cursor-pointer"
              >
                {tr("Done & Return to Queue", "पूर्ण व कतार पर लौटें", "पूर्ण आणि रांगेत परत जा", "પૂર્ણ અને કતાર પર પાછા જાઓ")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="flex items-center gap-2 text-[#F18B49]">
              <Scale size={22} />
              <h3 className="font-sans font-black text-xl text-[#F8D5C2]">
                {tr("Log APMC Intake Procurement", "एपीएमसी आवक खरीद दर्ज करें", "बाजार समिती आवक खरेदी नोंदवा", "એપીએમસી આવક ખરીદી નોંધો")}
              </h3>
            </div>

            <p className="text-xs text-[#C4A494]">
              {tr(
                `Record physical weighbridge arrival for lot ${lot.id} into APMC electronic register.`,
                `एपीएमसी इलेक्ट्रॉनिक रजिस्टर में लॉट ${lot.id} की भौतिक वजनपुल आवक दर्ज करें।`,
                `लॉट ${lot.id} ची प्रत्यक्ष वजनकाटा आवक बाजार समिती इलेक्ट्रॉनिक नोंदवहीत नोंदवा.`,
                `એપીએમસી ઇલેક્ટ્રોનિક રજિસ્ટરમાં લોટ ${lot.id} ની ભૌતિક વજનકાંટા આવક નોંધો.`
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#C4A494] mb-1 font-medium">
                  {tr("Farmer Full Name", "किसान का पूरा नाम", "शेतकऱ्याचे पूर्ण नाव", "ખેડૂતનું પૂરું નામ")}
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl px-3 py-2 text-xs text-[#F8D5C2] focus:outline-none focus:border-[#F18B49]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#C4A494] mb-1 font-medium">
                  {tr("Farmer ID / Khasra No.", "किसान आईडी / खसरा नं.", "शेतकरी आयडी / गट क्र.", "ખેડૂત આઈડી / સર્વે નં.")}
                </label>
                <input
                  type="text"
                  required
                  value={farmerId}
                  onChange={(e) => setFarmerId(e.target.value)}
                  className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl px-3 py-2 text-xs text-[#F8D5C2] focus:outline-none focus:border-[#F18B49]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#C4A494] mb-1 font-medium">
                  {tr("Vehicle / Trolley No.", "वाहन / ट्रॉली नं.", "वाहन / ट्रॉली क्र.", "વાહન / ટ્રોલી નં.")}
                </label>
                <input
                  type="text"
                  required
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl px-3 py-2 text-xs text-[#F8D5C2] focus:outline-none focus:border-[#F18B49]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#C4A494] mb-1 font-medium">
                  {tr("Gross Weight (Quintals)", "कुल वजन (क्विंटल)", "एकूण वजन (क्विंटल)", "કુલ વજન (ક્વિન્ટલ)")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={quintals}
                  onChange={(e) => setQuintals(e.target.value)}
                  className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl px-3 py-2 text-xs text-[#F8D5C2] font-mono focus:outline-none focus:border-[#F18B49]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#C4A494] mb-1 font-medium">
                  {tr("Moisture Content (%)", "नमी की मात्रा (%)", "ओलाव्याचे प्रमाण (%)", "ભેજનું પ્રમાણ (%)")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moisturePct}
                  onChange={(e) => setMoisturePct(e.target.value)}
                  className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl px-3 py-2 text-xs text-[#F8D5C2] font-mono focus:outline-none focus:border-[#F18B49]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#C4A494] mb-1 font-medium">
                  {tr("Mandi Rate (₹ per Quintal)", "मंडी दर (₹ प्रति क्विंटल)", "बाजार समिती दर (₹ प्रति क्विंटल)", "બજાર ભાવ (₹ પ્રતિ ક્વિન્ટલ)")}
                </label>
                <input
                  type="number"
                  required
                  value={ratePerQtl}
                  onChange={(e) => setRatePerQtl(e.target.value)}
                  className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl px-3 py-2 text-xs text-[#F8D5C2] font-mono focus:outline-none focus:border-[#F18B49]"
                />
              </div>
            </div>

            <div className="card-3d-lime p-4 flex items-center justify-between shadow-lg border border-[#F18B49]/35">
              <div>
                <div className="text-[10px] text-[#F18B49] font-mono font-black uppercase tracking-wider">
                  {tr("FARMER TOTAL PAYOUT", "किसान को कुल देय राशि", "शेतकऱ्याला एकूण देय रक्कम", "ખેડૂતને કુલ ચૂકવવાપાત્ર રકમ")}
                </div>
                <div className="text-xs text-[#F8D5C2] font-semibold mt-0.5">
                  {quintals} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")} × ₹{ratePerQtl}/{tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")} ({tr("Grade:", "ग्रेड:", "ग्रेड:", "ગ્રેડ:")} <strong className="text-[#F18B49]">{lot.lotGrade === "Grade A" ? tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'") : lot.lotGrade}</strong>)
                </div>
              </div>
              <div className="text-right">
                <span className="font-sans font-black text-2xl text-[#FFF5ED] font-tabular">
                  ₹{totalPayout.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-mono font-medium text-[#C4A494] hover:bg-white/5 cursor-pointer"
              >
                {tr("Cancel", "रद्द करें", "रद्द करा", "રદ કરો")}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#F18B49] hover:bg-[#FAAC78] text-[#000000] font-black text-xs shadow-lg shadow-[#F18B49]/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Scale size={14} />
                <span>{tr("Issue Weighbridge Slip & Log", "वजनपुल पर्ची जारी करें व दर्ज करें", "वजनकाटा पावती जारी करा व नोंदवा", "વજનકાંટા પાવતી જારી કરો અને નોંધો")}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>,
    document.body
  );
}
