import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { predictShelfLife } from "../services/shelfLifePredictor";
import { getMarketSignal } from "../services/marketPricing";
import {
  X,
  Send,
  Camera,
  Paperclip,
  Mic,
  Play,
  Pause,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  ExternalLink,
  Sparkles,
  Share2,
  ShieldCheck,
  Volume2
} from "lucide-react";

export default function WhatsAppBotModal({ isOpen, onClose, currentLot = null }) {
  const { tr, language } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const lot = currentLot || {
    id: "LOT-MH-LAS-2601",
    lotGrade: "Grade A",
    mandiName: "Lasalgaon APMC",
    farmerName: "Rameshwar Patil",
    quantityQuintals: 42.5,
    variety: "Nashik Red Garwa",
    stats: { gradeAPct: 88.9, ursPct: 11.1, rejectPct: 0, avgDiameterMm: 52.8, avgDamagePct: 0.9, sproutCount: 0 }
  };

  const shelfLife = predictShelfLife(lot);
  const marketSignal = getMarketSignal(lot);
  const verificationUrl = `${window.location.origin}/verify/${lot.id}`;

  // Voice note speech synthesis in selected regional language
  const speakReportSummary = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const rate = marketSignal?.blendedRate || 2850;
    const days = shelfLife?.safeDays || 45;
    const mandi = lot.mandiName || "Lasalgaon";

    let speechText = "";
    let speechLang = "hi-IN";

    if (language === "mr") {
      speechText = `नमस्ते शेतकरी बंधू. आपला कांदा लॉट ${lot.lotGrade === "Grade A" ? "ग्रेड अ" : lot.lotGrade} प्रमाणित झाला आहे. ${mandi} बाजार समितीत आजचा भाव ${rate} रुपये प्रति क्विंटल आहे. सुरक्षित साठवणूक कालावधी ${days} दिवस आहे.`;
      speechLang = "mr-IN";
    } else if (language === "gu") {
      speechText = `નમસ્તે ખેડૂત મિત્ર. તમારી ડુંગળી લોટ ${lot.lotGrade === "Grade A" ? "ગ્રેડ એ" : lot.lotGrade} પ્રમાણિત થઈ છે. ${mandi} માર્કેટ યાર્ડનો ભાવ ${rate} રૂપિયા પ્રતિ ક્વિન્ટલ છે. સુરક્ષિત સંગ્રહ સમય ${days} દિવસ છે.`;
      speechLang = "gu-IN";
    } else if (language === "hi") {
      speechText = `नमस्ते किसान भाई. आपका प्याज लॉट ${lot.lotGrade === "Grade A" ? "ग्रेड ए" : lot.lotGrade} प्रमाणित हुआ है. ${mandi} मंडी में आज का भाव ₹${rate} प्रति क्विंटल है. सुरक्षित भंडारण अवधि ${days} दिन है.`;
      speechLang = "hi-IN";
    } else {
      speechText = `Hello Farmer. Your onion lot has been certified ${lot.lotGrade}. Today's ${mandi} rate is ₹${rate} per quintal. Safe shelf life is ${days} days.`;
      speechLang = "en-IN";
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = speechLang;
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Text generators based on current language
  const getGreetingText = () => {
    if (language === "mr") {
      return `🙏 *नमस्ते! भारत सरकार OnionGrade AI सहाय्यक (+91 98224-ONION) मध्ये आपले स्वागत आहे*\n\nकोणतेही अ‍ॅप डाउनलोड करण्याची आवश्यकता नाही. आपल्या शेतातून किंवा बाजार समितीतून कांद्याचा फोटो पाठवा आणि त्वरित अ‍ॅगमार्क प्रतवारी, आजचा बाजारभाव आणि सुरक्षित साठवणूक कालावधी मिळवा.`;
    }
    if (language === "gu") {
      return `🙏 *નમસ્તે! ભારત સરકાર OnionGrade AI સહાયક (+91 98224-ONION) માં આપનું સ્વાગત છે*\n\nકોઈ એપ ડાઉનલોડ કરવાની જરૂર નથી. તમારા ખેતરેથી અથવા માર્કેટ યાર્ડમાંથી ડુંગળીનો ફોટો મોકલો અને તાત્કાલિક એગમાર્ક ગુણવત્તા ગ્રેડિંગ, આજનો બજાર ભાવ અને સુરક્ષિત સંગ્રહ સમય મેળવો.`;
    }
    if (language === "hi") {
      return `🙏 *नमस्ते! भारत सरकार OnionGrade AI सहायक (+91 98224-ONION) में आपका स्वागत है*\n\nकोई ऐप डाउनलोड करने की आवश्यकता नहीं है। अपने खेत या मंडी यार्ड से प्याज की कोई भी फोटो भेजें और तुरंत एगमार्क गुणवत्ता ग्रेडिंग, आज का मंडी भाव और सुरक्षित भंडारण अवधि प्राप्त करें।`;
    }
    return `🙏 *Namaste! Welcome to Government of India OnionGrade AI Sahayak (+91 98224-ONION)*\n\nNo app download needed. Send any onion photo from your farm gate or mandi yard to get instant AGMARK quality grading, today's APMC mandi price, and safe storage life.`;
  };

  const getUserCaption = () => {
    const qtl = lot.quantityQuintals || 42.5;
    const variety = lot.variety || tr("Nashik Red", "नासिक लाल", "नाशिक लाल", "નાસિક લાલ");
    const mandi = lot.mandiName || "Lasalgaon APMC";

    if (language === "mr") {
      return `कृपया ${mandi} येथे माझ्या ${qtl} क्विंटल ${variety} कांदा लॉटची एआय प्रतवारी सांगा.`;
    }
    if (language === "gu") {
      return `કૃપા કરીને ${mandi} ખાતે મારા ${qtl} ક્વિન્ટલ ${variety} ડુંગળી લોટનું એઆઈ ગ્રેડિંગ જણાવો.`;
    }
    if (language === "hi") {
      return `कृपया ${mandi} पर मेरे ${qtl} क्विंटल ${variety} प्याज लॉट की एआई ग्रेडिंग बताएं।`;
    }
    return `Please grade my ${qtl} quintals ${variety} onion lot at ${mandi}.`;
  };

  const getBotReply = (query) => {
    const q = (query || "").toLowerCase();
    const mandi = lot.mandiName || "Lasalgaon APMC";
    const rate = marketSignal?.blendedRate || 2850;
    const totalVal = (marketSignal?.totalLotValue || (rate * (lot.quantityQuintals || 42.5))).toLocaleString("en-IN");
    const safeDays = shelfLife?.safeDays || 45;
    const risk = shelfLife?.riskLevel === "low"
      ? tr("Low", "कम", "कमी", "ઓછું")
      : shelfLife?.riskLevel === "critical"
      ? tr("Critical", "गंभीर", "गंभीर", "ગંભીર")
      : tr("Moderate", "मध्यम", "मध्यम", "મધ્યમ");

    if (q.includes("rate") || q.includes("price") || q.includes("भाव") || q.includes("दर")) {
      if (language === "mr") {
        return `🧅 *DoCA कृषी सहाय्यक:* *${mandi}* मध्ये आज ग्रेड 'अ' चा सरासरी भाव *₹${rate}/क्विंटल* आहे. आपल्या ${lot.quantityQuintals || 42.5} क्विंटल लॉटचे एकूण मूल्य *₹${totalVal}* आहे.`;
      }
      if (language === "gu") {
        return `🧅 *DoCA કૃષિ સહાયક:* *${mandi}* માં આજે ગ્રેડ 'અ' નો સરેરાશ ભાવ *₹${rate}/ક્વિન્ટલ* છે. તમારા ${lot.quantityQuintals || 42.5} ક્વિન્ટલ લોટનું કુલ મૂલ્ય *₹${totalVal}* છે.`;
      }
      if (language === "hi") {
        return `🧅 *DoCA कृषि सहायक:* *${mandi}* में आज ग्रेड 'अ' का मॉडल भाव *₹${rate}/क्विंटल* है। आपके ${lot.quantityQuintals || 42.5} क्विंटल लॉट का कुल अनुमानित मूल्य *₹${totalVal}* है।`;
      }
      return `🧅 *DoCA Krishi Sahayak:* Today's Grade A modal rate at *${mandi}* is *₹${rate}/qtl*. Total estimated valuation is *₹${totalVal}*.`;
    }

    if (q.includes("store") || q.includes("storage") || q.includes("chawl") || q.includes("भंडारण") || q.includes("साठवण") || q.includes("સંગ્રહ") || q.includes("चाळ") || q.includes("ચાણ")) {
      if (language === "mr") {
        return `🧅 *DoCA कृषी सहाय्यक:* लॉट *${lot.id}* साठी हवेशीर कांदा चाळीत सुरक्षित साठवणूक कालावधी *${safeDays} दिवस* आहे. नासाडी जोखीम: *${risk}*.`;
      }
      if (language === "gu") {
        return `🧅 *DoCA કૃષિ સહાયક:* લોટ *${lot.id}* માટે કાંદા ચાળમાં સુરક્ષિત સંગ્રહ સમય *${safeDays} દિવસ* છે. બગાડ જોખમ: *${risk}*.`;
      }
      if (language === "hi") {
        return `🧅 *DoCA कृषि सहायक:* लॉट *${lot.id}* के लिए मानक हवादार कांदा चाळ में सुरक्षित भंडारण अवधि *${safeDays} दिन* है। सड़न जोखिम: *${risk}*।`;
      }
      return `🧅 *DoCA Krishi Sahayak:* Safe storage window for Lot *${lot.id}* is *${safeDays} days* in a standard ventilated Kanda Chawl. Decay risk: *${risk}*.`;
    }

    if (q.includes("dispute") || q.includes("penalty") || q.includes("विवाद") || q.includes("तक्रार") || q.includes("કપાત") || q.includes("वाद")) {
      if (language === "mr") {
        return `🧅 *DoCA कृषी सहाय्यक:* लॉट *${lot.id}* साठी तक्रार नोंदणी कक्ष सुरू केला आहे. DoCA अ‍ॅगमार्क नियम ४.२ नुसार आपण २४ तासांत बाजार समिती वजनकाट्यावर फेरतपासणी मागू शकता.`;
      }
      if (language === "gu") {
        return `🧅 *DoCA કૃષિ સહાયક:* લોટ *${lot.id}* માટે ફરિયાદ પ્રક્રિયા શરૂ થઈ છે. DoCA એગમાર્ક નિયમ 4.2 મુજબ તમે 24 કલાકમાં માર્કેટ યાર્ડ વજનકાંટા પર પુનઃ તપાસ માંગી શકો છો.`;
      }
      if (language === "hi") {
        return `🧅 *DoCA कृषि सहायक:* लॉट *${lot.id}* के लिए शिकायत दर्ज की गई है। DoCA एगमार्क मानक नियम 4.2 के अनुसार आप 24 घंटे में मंडी वजनपुल पर पुनः जांच की मांग कर सकते हैं।`;
      }
      return `🧅 *DoCA Krishi Sahayak:* Grievance channel initialized for Lot *${lot.id}*. Under DoCA Agmark SOP Rule 4.2, you can request an officer re-inspection at the mandi weighbridge within 24 hours.`;
    }

    if (language === "mr") {
      return `🧅 *DoCA कृषी सहाय्यक:* लॉट *${lot.id}* ची विचारणा नोंदवली आहे. *${mandi}* मध्ये ग्रेड 'अ' भाव *₹${rate}/क्विंटल* आहे. सुरक्षित साठवणूक: *${safeDays} दिवस*.`;
    }
    if (language === "gu") {
      return `🧅 *DoCA કૃષિ સહાયક:* લોટ *${lot.id}* ની પૂછપરછ નોંધાઈ છે. *${mandi}* માં ગ્રેડ 'અ' ભાવ *₹${rate}/ક્વિન્ટલ* છે. સુરક્ષિત સંગ્રહ: *${safeDays} દિવસ*.`;
    }
    if (language === "hi") {
      return `🧅 *DoCA कृषि सहायक:* लॉट *${lot.id}* की पूछताछ दर्ज की गई है। *${mandi}* में ग्रेड 'अ' भाव *₹${rate}/क्विंटल* है। सुरक्षित भंडारण: *${safeDays} दिन*।`;
    }
    return `🧅 *DoCA Krishi Sahayak:* Your inquiry for Lot *${lot.id}* has been logged. Today's Grade A rate at *${mandi}* is *₹${rate}/qtl*. Safe buffer storage: *${safeDays} days*.`;
  };

  // Initialize or re-translate thread when open or language changes
  useEffect(() => {
    if (isOpen) {
      const initialThread = [
        {
          id: 1,
          sender: "bot",
          time: "10:14 AM",
          text: getGreetingText()
        },
        {
          id: 2,
          sender: "user",
          time: "10:15 AM",
          image: lot.thumbnail || lot.annotatedImage || "/sample_onion_tray.png",
          caption: getUserCaption()
        },
        {
          id: 3,
          sender: "bot",
          time: "10:15 AM",
          isAnalysis: true,
          lotId: lot.id,
          grade: lot.lotGrade,
          gradeAPct: lot.stats?.gradeAPct || 88.9,
          rate: marketSignal?.blendedRate || 2850,
          shelfDays: shelfLife?.safeDays || 45,
          totalVal: marketSignal?.totalLotValue || 121125,
          certUrl: verificationUrl
        }
      ];
      setMessages(initialThread);
    }
  }, [isOpen, lot.id, language]);

  const handleSendTextMessage = () => {
    if (!inputText.trim()) return;
    const sentText = inputText;
    const newMsg = {
      id: Date.now(),
      sender: "user",
      time: tr("Just now", "अभी", "आत्ताच", "હમણાં જ"),
      text: sentText
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate smart bot reply in current language
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        time: tr("Just now", "अभी", "आत्ताच", "હમણાં જ"),
        text: getBotReply(sentText)
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  const openRealWhatsApp = () => {
    let text = "";
    if (language === "mr") {
      text = `🧅 *DoCA ONIONGRADE AI प्रमाणित अहवाल*\n*लॉट आयडी:* ${lot.id}\n*प्रतवारी:* ${lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ग्रेड 'अ')\n*बाजार समिती भाव:* ₹${marketSignal?.blendedRate || 2850}/क्विंटल (${lot.mandiName})\n*सुरक्षित साठवणूक:* ${shelfLife?.safeDays || 45} दिवस\n*डिजिटल प्रमाणपत्र तपासा:* ${verificationUrl}`;
    } else if (language === "gu") {
      text = `🧅 *DoCA ONIONGRADE AI પ્રમાણિત અહેવાલ*\n*લોટ આઈડી:* ${lot.id}\n*ગ્રેડ:* ${lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ગ્રેડ 'અ')\n*માર્કેટ યાર્ડ ભાવ:* ₹${marketSignal?.blendedRate || 2850}/ક્વિન્ટલ (${lot.mandiName})\n*સુરક્ષિત સંગ્રહ સમય:* ${shelfLife?.safeDays || 45} દિવસ\n*ડિજિટલ પ્રમાણપત્ર જુઓ:* ${verificationUrl}`;
    } else if (language === "hi") {
      text = `🧅 *DoCA ONIONGRADE AI सत्यापित रिपोर्ट*\n*लॉट आईडी:* ${lot.id}\n*ग्रेड:* ${lot.lotGrade} (${lot.stats?.gradeAPct || 0}% ग्रेड 'अ')\n*मंडी भाव:* ₹${marketSignal?.blendedRate || 2850}/क्विंटल (${lot.mandiName})\n*सुरक्षित भंडारण अवधि:* ${shelfLife?.safeDays || 45} दिन\n*डिजिटल प्रमाणपत्र देखें:* ${verificationUrl}`;
    } else {
      text = `🧅 *DoCA ONIONGRADE AI VERIFIED REPORT*\n*Lot ID:* ${lot.id}\n*Grade:* ${lot.lotGrade} (${lot.stats?.gradeAPct || 0}% Grade A)\n*Mandi Rate:* ₹${marketSignal?.blendedRate || 2850}/Qtl at ${lot.mandiName}\n*Safe Shelf Life:* ${shelfLife?.safeDays || 45} Days\n*View Live Digital Certificate:* ${verificationUrl}`;
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const quickReplies = [
    {
      label: tr("💰 APMC Mandi Rate", "💰 मंडी भाव", "💰 बाजार समिती भाव", "💰 માર્કેટ યાર્ડ ભાવ"),
      query: tr(
        `What is today's Grade A price at ${lot.mandiName}?`,
        `${lot.mandiName} में आज का ग्रेड 'अ' भाव क्या है?`,
        `${lot.mandiName} मध्ये आजचा ग्रेड 'अ' भाव काय आहे?`,
        `${lot.mandiName} માં આજનો ગ્રેડ 'અ' ભાવ શું છે?`
      )
    },
    {
      label: tr("⏳ Storage Advice", "⏳ भंडारण सलाह", "⏳ साठवणूक सल्ला", "⏳ સંગ્રહ સલાહ"),
      query: tr(
        "How long can I store this lot in my Kanda Chawl?",
        "इस लॉट को कांदा चाळ में कितने दिन सुरक्षित रखा जा सकता है?",
        "हा लॉट कांदा चाळीत किती दिवस सुरक्षित साठवता येईल?",
        "આ લોટને કાંદા ચાળમાં કેટલા દિવસ સુરક્ષિત રાખી શકાય?"
      )
    },
    {
      label: tr("⚖️ Raise Dispute", "⚖️ विवाद दर्ज करें", "⚖️ तक्रार नोंदवा", "⚖️ વિવાદ નોંધાવો"),
      query: tr(
        "I want to raise a dispute regarding rot penalty.",
        "मैं सड़न कटौती के संबंध में विवाद दर्ज कराना चाहता हूं।",
        "मला सड कपातीबाबत तक्रार नोंदवायची आहे.",
        "હું સડો કપાત અંગે વિવાદ નોંધાવવા માંગુ છું."
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Mobile Device Frame Container */}
      <div className="relative w-full max-w-md rounded-[36px] bg-[#0B141A] border-4 border-[#222E35] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col h-[85vh] max-h-[720px]">
        
        {/* WhatsApp Mobile Top App Bar */}
        <div className="bg-[#1F2C34] px-4 py-3 border-b border-[#2A3942] flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black border border-white/20 flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="DoCA Bot" className="w-8 h-8 object-contain" />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00A884] border-2 border-[#1F2C34]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-sans font-bold text-sm text-[#E9EDEF]">
                  {tr("OnionGrade AI Sahayak", "OnionGrade AI सहायक", "OnionGrade AI सहाय्यक", "OnionGrade AI સહાયક")}
                </span>
                <ShieldCheck size={14} className="text-[#00A884]" />
              </div>
              <span className="text-[11px] font-mono text-[#00A884] mt-0.5 block">
                {tr("Official Business Account • Online", "आधिकारिक व्यवसाय खाता • ऑनलाइन", "अधिकृत व्यवसाय खाते • ऑनलाइन", "સત્તાવાર બિઝનેસ ખાતું • ઓનલાઇન")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#AEBAC1]">
            <button
              onClick={speakReportSummary}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isPlayingAudio ? "bg-[#00A884] text-white" : "hover:bg-white/10"
              }`}
              title={tr("Voice Note Reader for Non-Literate Farmers", "किसानों के लिए वॉइस नोट वाचक", "शेतकऱ्यांसाठी व्हॉइस नोट वाचक", "ખેડૂતો માટે વોઈસ નોટ રીડર")}
            >
              <Volume2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#AEBAC1] hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Conversation Canvas */}
        <div
          className="flex-1 p-4 space-y-3.5 overflow-y-auto"
          style={{
            backgroundColor: "#0B141A",
            backgroundImage: "radial-gradient(#182229 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        >
          {/* Encryption Notice */}
          <div className="text-center my-1">
            <span className="inline-block px-3 py-1 rounded-lg bg-[#182229] border border-[#222E35] text-[10px] font-mono text-[#8696A0]">
              {tr(
                "🔒 End-to-end encrypted with Department of Consumer Affairs",
                "🔒 उपभोक्ता मामले विभाग के साथ एंड-टू-एंड एन्क्रिप्टेड",
                "🔒 ग्राहक व्यवहार विभागासोबत एंड-टू-एंड एन्क्रिप्टेड",
                "🔒 ગ્રાહક બાબતોના વિભાગ સાથે એન્ડ-ટુ-એન્ડ એન્ક્રિપ્ટેડ"
              )}
            </span>
          </div>

          {/* Message Thread */}
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 shadow-md text-xs relative ${
                    isBot
                      ? "bg-[#202C33] text-[#E9EDEF] rounded-tl-sm border border-[#2A3942]"
                      : "bg-[#005C4B] text-[#E9EDEF] rounded-tr-sm"
                  }`}
                >
                  {/* Photo attachment if present */}
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden bg-black border border-black/20">
                      <img src={msg.image} alt="Lot upload" className="w-full h-36 object-cover" />
                    </div>
                  )}

                  {/* Standard Text Message */}
                  {msg.text && (
                    <p className="whitespace-pre-line leading-relaxed font-sans text-xs">
                      {msg.text}
                    </p>
                  )}

                  {/* Caption */}
                  {msg.caption && (
                    <p className="mt-1.5 text-xs text-[#E9EDEF] leading-relaxed">
                      {msg.caption}
                    </p>
                  )}

                  {/* High-Impact AI Grading Report Bubble */}
                  {msg.isAnalysis && (
                    <div className="space-y-2.5 font-sans">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="font-bold text-[11px] text-[#00A884]">
                          {tr(
                            "🧅 DoCA AGMARK INSPECTION SLIP",
                            "🧅 DoCA एगमार्क निरीक्षण पर्ची",
                            "🧅 DoCA अ‍ॅगमार्क तपासणी पावती",
                            "🧅 DoCA એગમાર્ક નિરીક્ષણ પહોંચ"
                          )}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#00A884]/20 text-[#00A884] font-mono text-[10px] font-black">
                          {msg.grade === "Grade A"
                            ? tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")
                            : msg.grade === "Reject"
                            ? tr("Reject", "रद्द", "नाकारलेले", "નકારેલ")
                            : "URS"}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div>
                          <strong>{tr("Lot ID:", "लॉट आईडी:", "लॉट आयडी:", "લોટ આઈડી:")}</strong> {msg.lotId}
                        </div>
                        <div>
                          <strong>{tr("Quality Score:", "गुणवत्ता स्कोर:", "गुणवत्ता स्कोअर:", "ગુણવત્તા સ્કોર:")}</strong>{" "}
                          {msg.gradeAPct}% {tr("Grade A Export Calibre", "ग्रेड 'अ' निर्यात मानक", "ग्रेड 'अ' निर्यात दर्जा", "ગ્રેડ 'અ' નિકાસ ધોરણ")}
                        </div>
                        <div>
                          <strong>{lot.mandiName} {tr("Rate:", "भाव:", "दर:", "ભાવ:")}</strong>{" "}
                          <span className="text-[#00A884] font-bold">
                            ₹{msg.rate}/{tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                          </span>{" "}
                          ({tr("Total", "कुल", "एकूण", "કુલ")}: ₹{msg.totalVal?.toLocaleString("en-IN")})
                        </div>
                        <div>
                          <strong>{tr("Safe Shelf-Life:", "सुरक्षित भंडारण:", "सुरक्षित साठवणूक:", "સુરક્ષિત સંગ્રહ:")}</strong>{" "}
                          <span className="text-[#F18B49] font-bold">
                            {msg.shelfDays} {tr("Days", "दिन", "दिवस", "દિવસ")}
                          </span>{" "}
                          ({tr("Safe for buffer storage", "बफर भंडारण हेतु सुरक्षित", "बफर साठ्यासाठी सुरक्षित", "બફર સંગ્રહ માટે સુરક્ષિત")})
                        </div>
                      </div>

                      {/* Interactive Voice Note Player for Non-Literate Farmers */}
                      <div className="p-2.5 rounded-xl bg-[#111B21] border border-white/10 flex items-center justify-between gap-2.5">
                        <button
                          onClick={speakReportSummary}
                          className="w-8 h-8 rounded-full bg-[#00A884] hover:bg-[#008f70] text-black flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0"
                        >
                          {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                        </button>
                        <div className="flex-1">
                          <div className="text-[10px] font-mono text-[#8696A0] flex justify-between">
                            <span>
                              {tr(
                                "🎙️ Audio Summary (Voice Note)",
                                "🎙️ ऑडियो सारांश (वॉइस नोट)",
                                "🎙️ ऑडिओ सारांश (व्हॉइस नोट)",
                                "🎙️ ઓડિયો સારાંશ (વોઇસ નોટ)"
                              )}
                            </span>
                            <span>0:18</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-1 h-3 bg-[#00A884] rounded-full animate-pulse" />
                            <span className="w-1 h-5 bg-[#00A884] rounded-full" />
                            <span className="w-1 h-2 bg-[#00A884] rounded-full" />
                            <span className="w-1 h-4 bg-[#00A884] rounded-full animate-pulse" />
                            <span className="w-1 h-6 bg-[#00A884] rounded-full" />
                            <span className="w-1 h-3 bg-[#00A884] rounded-full" />
                            <span className="w-1 h-4 bg-[#00A884] rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-white/10 text-[11px]">
                        <span className="text-[#8696A0]">
                          {tr(
                            "Verify Tamper-proof Certificate:",
                            "सत्यापित डिजिटल प्रमाणपत्र देखें:",
                            "प्रमाणित डिजिटल प्रमाणपत्र तपासा:",
                            "ચકાસાયેલ ડિજિટલ પ્રમાણપત્ર જુઓ:"
                          )}
                        </span>
                        <a
                          href={msg.certUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[#00A884] hover:underline font-bold truncate mt-0.5"
                        >
                          {msg.certUrl}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Read Receipts */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#8696A0]">
                    <span>{msg.time}</span>
                    <CheckCheck size={12} className="text-[#53BDEB]" />
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Mobile Quick Reply Chips */}
        <div className="px-3 py-2 bg-[#182229] border-t border-[#222E35] flex items-center gap-2 overflow-x-auto text-[11px] font-sans">
          {quickReplies.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(chip.query)}
              className="px-2.5 py-1 rounded-full bg-[#202C33] text-[#E9EDEF] hover:bg-[#2A3942] border border-[#2A3942] shrink-0 cursor-pointer whitespace-nowrap"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* WhatsApp Message Input Bar */}
        <div className="bg-[#202C33] px-3 py-2 flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendTextMessage()}
            placeholder={tr(
              "Type a message or question...",
              "संदेश या प्रश्न लिखें...",
              "मेसेज किंवा प्रश्न लिहा...",
              "સંદેશ અથવા પ્રશ્ન લખો..."
            )}
            className="flex-1 bg-[#2A3942] text-[#E9EDEF] text-xs px-3.5 py-2.5 rounded-full outline-none placeholder-[#8696A0]"
          />

          <button
            onClick={handleSendTextMessage}
            className="w-9 h-9 rounded-full bg-[#00A884] hover:bg-[#008f70] text-black flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Send size={15} />
          </button>
        </div>

        {/* Bottom Real WhatsApp CTA Bar */}
        <div className="bg-[#111B21] px-4 py-2.5 border-t border-[#222E35] flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#8696A0]">
            {tr(
              "Digital Divide Solution • SMS / WhatsApp",
              "डिजिटल डिवाइड समाधान • एसएमएस / व्हाट्सएप",
              "डिजिटल दरी उपाय • एसएमएस / व्हॉट्सअ‍ॅप",
              "ડિજિટલ ડિવાઈડ સોલ્યુશન • એસએમએસ / વોટ્સએપ"
            )}
          </div>

          <button
            onClick={openRealWhatsApp}
            className="px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Share2 size={13} />
            <span>{tr("Open Real WhatsApp", "व्हाट्सएप पर खोलें", "व्हॉट्सअ‍ॅपवर उघडा", "વોટ્સએપ પર ખોલો")}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
