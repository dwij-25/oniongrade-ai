import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { saveDispute } from "../services/storage";
import { X, AlertTriangle, Send, CheckCircle2 } from "lucide-react";

export default function DisputeModal({ lot, isOpen, onClose, onDisputeRaised }) {
  const { user, showToast } = useAuth();
  const { language, tr } = useLanguage();

  const [reason, setReason] = useState("Dispute rot/dark patch classification (surface dirt vs decay)");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const newDispute = saveDispute({
        lotId: lot.id,
        farmerName: user?.name || lot.farmerName || "Farmer",
        farmerPhone: user?.phone || "+91 98224 81920",
        mandiName: lot.mandiName || "Lasalgaon APMC",
        variety: lot.variety || "Nashik Red",
        reason,
        farmerNote: note || tr(
          "Farmer requested re-inspection under DoCA standard guidelines.",
          "किसान ने DoCA दिशानिर्देशों के तहत पुनः निरीक्षण का अनुरोध किया।",
          "शेतकऱ्याने DoCA मार्गदर्शक तत्त्वांतर्गत पुनर्निरीक्षणाची विनंती केली.",
          "ખેડૂતે DoCA માર્ગદર્શિકા હેઠળ પુનઃનિરીક્ષણની વિનંતી કરી."
        ),
        originalLotGrade: lot.lotGrade,
        originalStats: {
          gradeAPct: lot.stats?.gradeAPct || 0,
          ursPct: lot.stats?.ursPct || 0,
          rejectPct: lot.stats?.rejectPct || 0
        },
        annotatedImage: lot.annotatedImage || lot.thumbnail
      });

      setSubmitting(false);
      setSubmitted(true);
      showToast(
        tr(
          `Dispute #${newDispute.id} logged with DoCA oversight!`,
          `विवाद #${newDispute.id} DoCA निगरानी में दर्ज किया गया!`,
          `तक्रार #${newDispute.id} DoCA देखरेखीखाली नोंदवली!`,
          `વિવાદ #${newDispute.id} DoCA દેખરેખ હેઠળ નોંધાયેલ છે!`
        ),
        "warning"
      );

      if (onDisputeRaised) {
        onDisputeRaised(newDispute);
      }

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }, 400);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-[#000000] border border-[#36112C] rounded-[32px] shadow-2xl p-6 text-[#F8D5C2]"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F18B49]/20 border border-[#F18B49] mx-auto flex items-center justify-center text-[#F18B49]">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-sans font-black text-xl text-[#F8D5C2]">
              {tr("Grievance Transmitted to DoCA", "शिकायत DoCA को प्रेषित की गई", "तक्रार DoCA कडे पाठवली", "ફરિયાદ DoCA ને મોકલી")}
            </h3>
            <p className="text-xs text-[#C4A494] max-w-xs mx-auto">
              {tr(
                "Your dispute has been queued in the DoCA National Oversight terminal. A procurement magistrate will review the original annotated scan.",
                "आपका विवाद DoCA राष्ट्रीय निगरानी टर्मिनल में दर्ज हो गया है। एक खरीद अधिकारी मूल स्कैन की समीक्षा करेंगे।",
                "तुमची तक्रार DoCA राष्ट्रीय देखरेख टर्मिनलमध्ये नोंदवली गेली आहे. खरेदी अधिकारी मूळ स्कॅनचे पुनरावलोकन करतील.",
                "તમારો વિવાદ DoCA રાષ્ટ્રીય દેખરેખ ટર્મિનલમાં નોંધાઈ ગયો છે. ખરીદ અધિકારી મૂળ સ્કેનની સમીક્ષા કરશે."
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-[#FF4D4D]">
              <AlertTriangle size={20} />
              <h3 className="font-sans font-black text-xl text-[#F8D5C2]">
                {tr("Raise Quality Dispute", "गुणवत्ता विवाद दर्ज करें", "गुणवत्ता तक्रार नोंदवा", "ગુણવત્તા વિવાદ નોંધાવો")}
              </h3>
            </div>

            <p className="text-xs text-[#C4A494]">
              {tr(
                `Grievance filed under National Agri-Produce Quality Dispute Redressal Mechanism. This will flag lot ${lot.id} for administrative review.`,
                `राष्ट्रीय कृषि उपज गुणवत्ता विवाद निवारण तंत्र के तहत शिकायत दर्ज। यह लॉट ${lot.id} को प्रशासनिक समीक्षा हेतु चिह्नित करेगा।`,
                `राष्ट्रीय कृषी उत्पन्न गुणवत्ता वाद निवारण यंत्रणेअंतर्गत तक्रार दाखल. हे लॉट ${lot.id} प्रशासकीय पुनरावलोकनासाठी चिन्हांकित करेल.`,
                `રાષ્ટ્રીય કૃષિ પેદાશ ગુણવત્તા વિવાદ નિવારણ પદ્ધતિ હેઠળ ફરિયાદ દાખલ. આ લોટ ${lot.id} ને વહીવટી સમીક્ષા માટે ચિહ્નિત કરશે.`
              )}
            </p>

            <div className="p-3.5 bg-[#1F0B1B] rounded-2xl border border-[#36112C] flex items-center gap-3">
              <img
                src={lot.thumbnail || lot.annotatedImage}
                alt="Lot thumbnail"
                className="w-12 h-12 rounded-xl object-cover border border-[#36112C]"
              />
              <div className="text-xs font-mono">
                <div className="text-[#F8D5C2] font-black">{lot.id}</div>
                <div className="text-[#C4A494]">
                  {tr("Current:", "वर्तमान ग्रेड:", "सद्य ग्रेड:", "હાલનો ગ્રેડ:")} <span className="text-[#EB87A9] font-bold">{lot.lotGrade}</span>
                </div>
                <div className="text-[#F18B49] font-bold">
                  {lot.stats?.gradeAPct}% {tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")} • {lot.stats?.rejectPct}% {tr("Reject", "अस्वीकृत", "नाकारलेले", "અસ્વીકાર")}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C4A494] mb-1">
                {tr("Grievance Ground", "शिकायत का आधार", "तक्रारीचे कारण", "ફરિયાદનું કારણ")}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl px-3 py-2 text-xs sm:text-sm text-[#F8D5C2] focus:outline-none focus:border-[#F18B49]"
              >
                <option value="Dispute rot/dark patch classification (surface dirt vs decay)">
                  {tr("Surface Dirt misclassified as Black Mold / Rot", "सतह की मिट्टी को काला फफूंद / सड़न माना गया", "पृष्ठभागावरील माती काळी बुरशी / नासाडी मानली गेली", "સપાટીની માટીને કાળી ફૂગ / સડો ગણવામાં આવ્યો")}
                </option>
                <option value="Dispute size/diameter measurement (calibration variance)">
                  {tr("Bulb Size / Diameter measurement variance", "कंद का आकार / व्यास माप में अंतर (कैलिब्रेशन त्रुटि)", "कांद्याचा आकार / व्यास मोजणीत तफावत", "ડુંગળીનું કદ / વ્યાસ માપમાં તફાવત")}
                </option>
                <option value="Dispute sprout classification (dry neck vs vegetative shoot)">
                  {tr("Dry Neck misclassified as Active Sprout", "सूखी गर्दन को सक्रिय अंकुर माना गया", "सुकलेली मान सक्रिय कोंब मानली गेली", "સૂકી ગરદનને સક્રિય અંકુર ગણવામાં આવી")}
                </option>
                <option value="Unfair URS downgrade on export grade bulbs">
                  {tr("Unfair URS downgrade on export grade bulbs", "निर्यात ग्रेड कंदों पर अनुचित यूआरएस डाउनग्रेड", "निर्यात दर्जाच्या कांद्यावर अन्यायकारक URS डाउनग्रेड", "નિકાસ ગ્રેડની ડુંગળી પર અન્યાયી URS ડાઉનગ્રેડ")}
                </option>
                <option value="Calibration grid shadow interference">
                  {tr("Shadow / Lighting artifact interference", "छाया / प्रकाश हस्तक्षेप के कारण त्रुटि", "सावली / प्रकाशाच्या अडथळ्यामुळे त्रुटी", "પડછાયો / પ્રકાશના દખલને કારણે ભૂલ")}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C4A494] mb-1">
                {tr("Farmer Explanation & Notes (Optional)", "किसान का स्पष्टीकरण व टिप्पणी (वैकल्पिक)", "शेतकऱ्याचे स्पष्टीकरण आणि टीप (पर्यायी)", "ખેડૂતનું સ્પષ્ટીકરણ અને નોંધ (વૈકલ્પિક)")}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder={tr(
                  "Explain why this lot qualifies for a higher grade rate...",
                  "समझाएं कि यह लॉट उच्च ग्रेड दर के योग्य क्यों है...",
                  "हा लॉट उच्च दर्जाच्या दरासाठी का पात्र आहे ते स्पष्ट करा...",
                  "આ લોટ ઉચ્ચ ગ્રેડ દર માટે કેમ લાયક છે તે સમજાવો..."
                )}
                className="w-full bg-[#1F0B1B] border border-[#36112C] rounded-2xl p-3 text-xs sm:text-sm text-[#F8D5C2] focus:outline-none focus:border-[#F18B49]"
              />
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
                disabled={submitting}
                className="px-5 py-2.5 rounded-full bg-[#FF4D4D] hover:bg-[#ff6666] text-white font-bold text-xs shadow-lg shadow-[#FF4D4D]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>
                  {submitting 
                    ? tr("Transmitting...", "भेजा जा रहा है...", "पाठवत आहे...", "મોકલી રહ્યું છે...") 
                    : tr("Submit Grievance to DoCA", "DoCA को शिकायत भेजें", "DoCA कडे तक्रार पाठवा", "DoCA ને ફરિયાદ મોકલો")}
                </span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>,
    document.body
  );
}
