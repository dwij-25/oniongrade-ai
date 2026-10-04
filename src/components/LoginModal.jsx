import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ROLES, ROLE_INFO } from "../constants/rules";
import { DEFAULT_USERS } from "../services/storage";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Lock,
  Phone,
  Building,
  KeyRound,
  Sparkles,
  UserCheck,
  Sprout,
  ShoppingBag,
  Scale,
  Landmark
} from "lucide-react";

export default function LoginModal({ initialRole = null }) {
  const { isLoginModalOpen, closeLoginModal, login, guestLogin } = useAuth();
  const { t, tr, language } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState("role"); // "role" | "credentials"
  const [selectedRole, setSelectedRole] = useState(initialRole || ROLES.FARMER);

  const getRoleDisplayName = (rInfo) => {
    if (!rInfo) return "";
    if (language === "mr") return rInfo.nameMarathi || rInfo.nameHindi || rInfo.name;
    if (language === "gu") return rInfo.nameGujarati || rInfo.nameHindi || rInfo.name;
    if (language === "hi") return rInfo.nameHindi || rInfo.name;
    return rInfo.name;
  };

  const getRoleDisplayShort = (rInfo) => {
    if (!rInfo) return "";
    if (language === "mr") return rInfo.shortNameMarathi || rInfo.shortNameHindi || rInfo.shortName;
    if (language === "gu") return rInfo.shortNameGujarati || rInfo.shortNameHindi || rInfo.shortName;
    if (language === "hi") return rInfo.shortNameHindi || rInfo.shortName;
    return rInfo.shortName;
  };

  // Phone + OTP State (Farmer & Retailer)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(30);

  // ID + Password State (Officer & Government)
  const [officialId, setOfficialId] = useState("");
  const [officialPassword, setOfficialPassword] = useState("••••••••");
  const [department, setDepartment] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isLoginModalOpen) closeLoginModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  useEffect(() => {
    if (isLoginModalOpen) {
      setStep("role");
      setErrors({});
      setOtpSent(false);
      setOtpCode(["", "", "", ""]);
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    const template = DEFAULT_USERS[roleKey];
    
    // Set appropriate initial credentials
    if (roleKey === ROLES.FARMER || roleKey === ROLES.RETAILER) {
      setPhoneNumber(template.phone || "+91 98224 81920");
      setOtpSent(false);
      setOtpCode(["", "", "", ""]);
    } else {
      setOfficialId(template.badgeNumber || template.email || "APMC-INSP-8492");
      setDepartment(template.mandi || template.department || "Lasalgaon APMC");
      setOfficialPassword("password123");
    }

    setErrors({});
    setStep("credentials");
  };

  const handleSendOtp = () => {
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setErrors({
        phone: tr(
          "Please enter a valid 10-digit mobile number",
          "कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें",
          "कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा",
          "કૃપા કરીને માન્ય ૧૦-અંકનો મોબાઈલ નંબર દાખલ કરો"
        )
      });
      return;
    }
    setErrors({});
    setOtpSent(true);
    setOtpCode(["4", "2", "8", "0"]); // Auto-fill demo OTP for convenience
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const template = DEFAULT_USERS[selectedRole];

    if (selectedRole === ROLES.FARMER || selectedRole === ROLES.RETAILER) {
      const enteredOtp = otpCode.join("");
      if (!otpSent) {
        handleSendOtp();
        return;
      }
      if (enteredOtp.length < 4) {
        setErrors({
          otp: tr(
            "Please enter the 4-digit verification code",
            "कृपया 4-अंकीय सत्यापन कोड दर्ज करें",
            "कृपया ४-अंकी पडताळणी कोड प्रविष्ट करा",
            "કૃપા કરીને ૪-અંકનો ચકાસણી કોડ દાખલ કરો"
          )
        });
        return;
      }
      // Validate OTP — demo system uses "4280"
      if (enteredOtp !== "4280") {
        setErrors({
          otp: tr(
            "Invalid OTP. Use the demo code: 4280",
            "अमान्य ओटीपी। डेमो कोड का उपयोग करें: 4280",
            "अवैध ओटीपी. डेमो कोड वापरा: ४२८०",
            "અમાન્ય ઓટીપી. ડેમો કોડ વાપરો: ૪૨૮૦"
          )
        });
        return;
      }

      login(selectedRole, {
        name: template.name,
        phone: phoneNumber,
        mandi: template.mandi
      });
    } else {
      if (!officialId.trim()) {
        setErrors({
          officialId: tr(
            "Official Employee / Department ID required",
            "आधिकारिक कर्मचारी / विभाग आईडी आवश्यक है",
            "अधिकृत कर्मचारी / विभाग आयडी आवश्यक आहे",
            "સત્તાવાર કર્મચારી / વિભાગ આઈડી જરૂરી છે"
          )
        });
        return;
      }
      if (!officialPassword.trim()) {
        setErrors({
          password: tr(
            "Password is required",
            "पासवर्ड आवश्यक है",
            "पासवर्ड आवश्यक आहे",
            "પાસવર્ડ જરૂરી છે"
          )
        });
        return;
      }
      // Validate password — demo system uses "password123"
      if (officialPassword !== "password123") {
        setErrors({
          password: tr(
            "Incorrect password. Use: password123",
            "गलत पासवर्ड। डेमो के लिए उपयोग करें: password123",
            "चुकीचा पासवर्ड. वापरा: password123",
            "ખોટો પાસવર્ડ. વાપરો: password123"
          )
        });
        return;
      }

      login(selectedRole, {
        name: template.name,
        badgeNumber: officialId,
        email: template.email,
        mandi: department
      });
    }

    // Direct redirect to role dashboard
    navigate(`/${selectedRole}`);
  };

  const handleQuickDemoLogin = (roleKey) => {
    guestLogin(roleKey);
    navigate(`/${roleKey}`);
  };

  const isRuralRole = selectedRole === ROLES.FARMER || selectedRole === ROLES.RETAILER;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLoginModal();
      }}
    >
      <div 
        className="relative w-full max-w-xl card-3d rounded-[32px] overflow-hidden my-auto text-[#F8D5C2]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/[0.08] bg-gradient-to-b from-[#180915] to-[#180915]">
          <button
            onClick={closeLoginModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#C4A494] hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="capsule-tag">
              <Sparkles size={11} />
              <span>{tr("ROLE-BASED AUTHENTICATION", "भूमिका-आधारित प्रमाणीकरण", "भूमिका-आधारित प्रमाणीकरण", "ભૂમિકા-આધારિત પ્રમાણીકરણ")}</span>
            </span>
            {step === "credentials" && (
              <button
                onClick={() => setStep("role")}
                className="text-[11px] text-[#F18B49] font-mono hover:underline flex items-center gap-1 cursor-pointer ml-auto mr-8"
              >
                <ArrowLeft size={12} />
                <span>{tr("Change role", "भूमिका बदलें", "भूमिका बदला", "ભૂમિકા બદલો")}</span>
              </button>
            )}
          </div>

          <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#F8D5C2] tracking-tight">
            {step === "role" 
              ? tr("Select Your Mandi Role", "अपनी मंडी हितधारक भूमिका चुनें", "आपली बाजार समिती भूमिका निवडा", "તમારી માર્કેટ યાર્ડ ભૂમિકા પસંદ કરો")
              : tr(
                  `Sign In as ${ROLE_INFO[selectedRole]?.name}`,
                  `${ROLE_INFO[selectedRole]?.nameHindi || ROLE_INFO[selectedRole]?.name} के रूप में साइन इन करें`,
                  `${ROLE_INFO[selectedRole]?.nameMarathi || ROLE_INFO[selectedRole]?.name} म्हणून साइन इन करा`,
                  `${ROLE_INFO[selectedRole]?.nameGujarati || ROLE_INFO[selectedRole]?.name} તરીકે સાઇન ઇન કરો`
                )}
          </h2>
          <p className="text-xs sm:text-sm text-[#C4A494] mt-1">
            {step === "role"
              ? tr(
                  "Choose your role to open your dedicated grading, trading, or oversight workspace.",
                  "अपने समर्पित ग्रेडिंग, व्यापार या सरकारी निगरानी कार्यक्षेत्र को खोलने के लिए अपनी भूमिका चुनें।",
                  "आपले समर्पित प्रतवारी, व्यापार किंवा शासकीय देखरेख कार्यक्षेत्र उघडण्यासाठी आपली भूमिका निवडा.",
                  "તમારા સમર્પિત ગ્રેડિંગ, વેપાર અથવા સરકારી દેખરેખ કાર્યક્ષેત્રને ખોલવા માટે તમારી ભૂમિકા પસંદ કરો."
                )
              : isRuralRole
              ? tr(
                  "Fast mobile login with OTP verification — zero passwords to remember.",
                  "ओटीपी सत्यापन के साथ तेज़ मोबाइल लॉगिन — कोई पासवर्ड याद रखने की आवश्यकता नहीं।",
                  "ओटीपी पडताळणीसह जलद मोबाईल लॉगिन — कोणताही पासवर्ड लक्षात ठेवण्याची गरज नाही.",
                  "ઓટીપી ચકાસણી સાથે ઝડપી મોબાઈલ લૉગિન — કોઈ પાસવર્ડ યાદ રાખવાની જરૂર નથી."
                )
              : tr(
                  "Official departmental access with verified badge and security credentials.",
                  "सत्यापित पहचान पत्र और सुरक्षा क्रेडेंशियल्स के साथ आधिकारिक विभागीय पहुंच।",
                  "सत्यापित ओळखपत्र आणि सुरक्षा क्रेडेंशियल्ससह अधिकृत विभागीय प्रवेश.",
                  "ચકાસાયેલ ઓળખપત્ર અને સુરક્ષા ઓળખ સાથે સત્તાવાર વિભાગીય પ્રવેશ."
                )}
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {step === "role" && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Card 1: Farmer */}
              <div
                onClick={() => handleSelectRole(ROLES.FARMER)}
                className="p-5 rounded-2xl bg-[#120710] border border-white/[0.08] hover:border-[#F18B49] hover:bg-[#180915] transition-all cursor-pointer select-none group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Sprout size={24} className="text-[#F18B49]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#F8D5C2]">
                    {tr("Farmer / Seller", "किसान / उत्पादक", "शेतकरी / कांदा उत्पादक", "ખેડૂત / ડુંગળી ઉત્પાદક")}
                  </h3>
                  <span className="text-[10px] font-mono text-[#F18B49] font-bold">
                    {tr("OTP LOGIN", "ओटीपी लॉगिन", "ओटीपी लॉगिन", "ઓટીપી લૉગિન")}
                  </span>
                </div>
                <p className="text-[11px] text-[#C4A494] mt-1 leading-snug">
                  {tr(
                    "Grade onion harvest, generate instant mandi slips, and raise quality disputes.",
                    "प्याज की फसल ग्रेड करें, तत्काल मंडी पर्ची बनाएं और गुणवत्ता विवाद उठाएं।",
                    "कांदा पिकाची प्रतवारी करा, तात्काळ पावती मिळवा आणि वाद नोंदवा.",
                    "ડુંગળી પાકનું ગ્રેડિંગ કરો, તાત્કાલિક પહોંચ મેળવો અને વિવાદ નોંધાવો."
                  )}
                </p>
              </div>

              {/* Card 2: Retailer */}
              <div
                onClick={() => handleSelectRole(ROLES.RETAILER)}
                className="p-5 rounded-2xl bg-[#120710] border border-white/[0.08] hover:border-[#EB87A9] hover:bg-[#180915] transition-all cursor-pointer select-none group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EB87A9]/15 border border-[#EB87A9]/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ShoppingBag size={24} className="text-[#EB87A9]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#F8D5C2]">
                    {tr("Retailer / Trader", "व्यापारी / थोक खरीदार", "व्यापारी / अडतदार", "વેપારી / જથ્થાબંધ ખરીદનાર")}
                  </h3>
                  <span className="text-[10px] font-mono text-[#EB87A9] font-bold">
                    {tr("OTP LOGIN", "ओटीपी लॉगिन", "ओटीपी लॉगिन", "ઓટીપી લૉગિન")}
                  </span>
                </div>
                <p className="text-[11px] text-[#C4A494] mt-1 leading-snug">
                  {tr(
                    "Browse certified lots, filter by % Grade A & diameter, and transmit bids.",
                    "प्रमाणित लॉट्स ब्राउज़ करें, ग्रेड 'अ' % व आकार से फ़िल्टर करें और खरीद अनुरोध भेजें।",
                    "प्रमाणित लॉट्स तपासा, ग्रेड 'अ' % नुसार निवडा आणि बोली लावा.",
                    "પ્રમાણિત લોટ જુઓ, ગ્રેડ 'અ' % મુજબ ફિલ્ટર કરો અને બોલી લગાવો."
                  )}
                </p>
              </div>

              {/* Card 3: Officer */}
              <div
                onClick={() => handleSelectRole(ROLES.OFFICER)}
                className="p-5 rounded-2xl bg-[#120710] border border-white/[0.08] hover:border-[#F18B49] hover:bg-[#180915] transition-all cursor-pointer select-none group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F18B49]/15 border border-[#F18B49]/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Scale size={24} className="text-[#F18B49]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#F8D5C2]">
                    {tr("Procurement Officer", "खरीद अधिकारी", "खरेदी केंद्र अधिकारी", "ખરીદ કેન્દ્ર અધિકારી")}
                  </h3>
                  <span className="text-[10px] font-mono text-[#C4A494] font-bold">
                    {tr("OFFICIAL ID", "आधिकारिक आईडी", "अधिकृत आयडी", "સત્તાવાર આઈડી")}
                  </span>
                </div>
                <p className="text-[11px] text-[#C4A494] mt-1 leading-snug">
                  {tr(
                    "Weighbridge terminal, daily intake counter, and electronic lot receipt generator.",
                    "वजनपुल टर्मिनल, दैनिक आवक काउंटर और इलेक्ट्रॉनिक लॉट रसीद जनरेटर।",
                    "वजनकाटा टर्मिनल, दैनिक आवक नोंद आणि इलेक्ट्रॉनिक पावती जनरेटर.",
                    "વજનકાંટો ટર્મિનલ, દૈનિક આવક કાઉન્ટર અને ઇલેક્ટ્રોનિક પહોંચ જનરેટર."
                  )}
                </p>
              </div>

              {/* Card 4: Government */}
              <div
                onClick={() => handleSelectRole(ROLES.GOVERNMENT)}
                className="p-5 rounded-2xl bg-[#120710] border border-white/[0.08] hover:border-[#FF4D4D] hover:bg-[#1F1414] transition-all cursor-pointer select-none group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Landmark size={24} className="text-[#FF4D4D]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#F8D5C2]">
                    {tr("Government / DoCA", "सरकार / DoCA", "शासकीय / DoCA", "સરકારી / DoCA")}
                  </h3>
                  <span className="text-[10px] font-mono text-[#FF4D4D] font-bold">
                    {tr("SECURE PORTAL", "सुरक्षित पोर्टल", "सुरक्षित पोर्टल", "સુરક્ષિત પોર્ટલ")}
                  </span>
                </div>
                <p className="text-[11px] text-[#C4A494] mt-1 leading-snug">
                  {tr(
                    "National quality split, regional buffer health, dispute adjudication, and rules.",
                    "राष्ट्रीय गुणवत्ता अनुपात, क्षेत्रीय बफर स्वास्थ्य, विवाद निपटान और नियम।",
                    "राष्ट्रीय गुणवत्ता प्रमाण, प्रादेशिक बफर साठा, वाद निवारण आणि नियम.",
                    "રાષ્ટ્રીય ગુણવત્તા ગુણોત્તર, પ્રાદેશિક બફર સ્ટોક, વિવાદ નિવારણ અને નિયમો."
                  )}
                </p>
              </div>

            </div>

            {/* Quick Demo Shortcut */}
            <div className="p-3.5 bg-[#1F0B1B] rounded-2xl border border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-[#C4A494] font-mono">
                {tr("Judge / Evaluator fast-track:", "त्वरित परीक्षक / जज शॉर्टकट:", "जलद परीक्षक / मूल्यमापन शॉर्टकट:", "ઝડપી મૂલ્યાંકનકાર શૉર્ટકટ:")}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(ROLES.FARMER)}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-[#F18B49]/20 text-[#F18B49] hover:bg-[#F18B49]/30 transition-colors cursor-pointer"
                >
                  {tr("Farmer Demo", "किसान डेमो", "शेतकरी डेमो", "ખેડૂત ડેમો")}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(ROLES.OFFICER)}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-white/10 text-[#F8D5C2] hover:bg-white/15 transition-colors cursor-pointer"
                >
                  {tr("Officer Demo", "अधिकारी डेमो", "अधिकारी डेमो", "અધિકારી ડેમો")}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(ROLES.GOVERNMENT)}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-[#FF4D4D]/20 text-[#FF4D4D] hover:bg-[#FF4D4D]/30 transition-colors cursor-pointer"
                >
                  {tr("DoCA Demo", "DoCA डेमो", "DoCA डेमो", "DoCA ડેમો")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ROLE-TAILORED CREDENTIALS */}
        {step === "credentials" && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-5 animate-in fade-in duration-150">
            
            {/* RURAL AUTH: Phone Number + OTP (Farmer & Retailer) */}
            {isRuralRole ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#C4A494] mb-1.5 uppercase">
                    {tr(
                      "Registered Mobile Number (UPI / Mandi linked)",
                      "पंजीकृत मोबाइल नंबर (यूपीआई / मंडी से जुड़ा)",
                      "नोंदणीकृत मोबाईल नंबर (यूपीआय / बाजार समिती लिंक)",
                      "નોંધાયેલ મોબાઈલ નંબર (યુપીઆઈ / મંડી લિંક્ડ)"
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-mono text-[#C4A494] border-r border-white/10 pr-2">
                      <span className="text-[10px] font-mono text-[#C4A494] font-bold">IN</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber.replace(/^\+91\s?/, "")}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98224 81920"
                      className="w-full input-3d pl-20 pr-24 py-3 text-sm font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="absolute right-2 px-3 py-1.5 rounded-xl bg-[#F18B49] hover:bg-[#FAAC78] text-[#000000] font-bold text-xs transition-colors cursor-pointer"
                    >
                      {otpSent ? tr("Resend", "पुनः भेजें", "पुन्हा पाठवा", "ફરી મોકલો") : tr("Send OTP", "ओटीपी भेजें", "ओटीपी पाठवा", "ઓટીપી મોકલો")}
                    </button>
                  </div>
                  {errors.phone && <p className="text-xs text-[#FF4D4D] mt-1">{errors.phone}</p>}
                </div>

                {otpSent && (
                  <div className="p-4 bg-[#120710] rounded-2xl border border-[#F18B49]/30 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#C4A494] font-mono">
                        {tr(
                          "Enter 4-Digit OTP sent to your phone:",
                          "अपने फोन पर प्राप्त 4-अंकीय ओटीपी दर्ज करें:",
                          "आपल्या फोनवर आलेला ४-अंकी ओटीपी प्रविष्ट करा:",
                          "તમારા ફોન પર આવેલ ૪-અંકનો ઓટીપી દાખલ કરો:"
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(["4", "2", "8", "0"])}
                        className="text-[11px] text-[#F18B49] font-mono font-bold hover:underline cursor-pointer"
                      >
                        {tr("Auto-fill OTP (4280)", "ओटीपी स्वतः भरें (4280)", "ओटीपी आपोआप भरा (४२८०)", "ઓટીપી આપમેળે ભરો (૪૨૮૦)")}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-12 h-12 text-center text-xl font-mono font-black rounded-xl bg-[#180915] border border-white/15 focus:border-[#F18B49] focus:outline-none text-[#F8D5C2]"
                        />
                      ))}
                    </div>
                    {errors.otp && <p className="text-xs text-[#FF4D4D] text-center">{errors.otp}</p>}

                    <div className="text-[11px] text-[#C4A494] text-center font-mono">
                      {tr("Simulated OTP: ", "परीक्षण ओटीपी: ", "चाचणी ओटीपी: ", "પરીક્ષણ ઓટીપી: ")}
                      <strong className="text-[#F18B49]">4 2 8 0</strong> {tr("(Mandi Gateway)", "(मंडी गेटवे)", "(बाजार समिती गेटवे)", "(માર્કેટ યાર્ડ ગેટવે)")}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* FORMAL AUTH: Official ID + Password (Officer & Government) */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#C4A494] mb-1 uppercase">
                    {selectedRole === ROLES.OFFICER 
                      ? tr("APMC Inspector Badge / ID", "एपीएमसी निरीक्षक बैज / आईडी", "बाजार समिती निरीक्षक बॅज / आयडी", "એપીએમસી નિરીક્ષક બેજ / આઈડી") 
                      : tr("DoCA Central Authority ID", "DoCA केंद्रीय प्राधिकरण आईडी", "DoCA केंद्रीय प्राधिकरण आयडी", "DoCA સેન્ટ્રલ ઓથોરિટી આઈડી")}
                  </label>
                  <div className="relative">
                    <UserCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
                    <input
                      type="text"
                      value={officialId}
                      onChange={(e) => setOfficialId(e.target.value)}
                      placeholder={selectedRole === ROLES.OFFICER ? "APMC-INSP-8492" : "ananya.roy@doca.nic.in"}
                      className="w-full input-3d pl-10 pr-3 py-3 text-sm font-mono"
                    />
                  </div>
                  {errors.officialId && <p className="text-xs text-[#FF4D4D] mt-1">{errors.officialId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#C4A494] mb-1 uppercase">
                    {tr("Department / APMC Mandi Yard", "विभाग / एपीएमसी मंडी यार्ड", "विभाग / बाजार समिती यार्ड", "વિભાગ / એપીએમસી માર્કેટ યાર્ડ")}
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Lasalgaon Yard #2"
                      className="w-full input-3d pl-10 pr-3 py-3 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#C4A494] mb-1 uppercase">
                    {tr("Security Password", "सुरक्षा पासवर्ड", "सुरक्षा पासवर्ड", "સુરક્ષા પાસવર્ડ")}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
                    <input
                      type="password"
                      value={officialPassword}
                      onChange={(e) => setOfficialPassword(e.target.value)}
                      className="w-full input-3d pl-10 pr-3 py-3 text-sm"
                    />
                  </div>
                  {errors.password && <p className="text-xs text-[#FF4D4D] mt-1">{errors.password}</p>}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("role")}
                className="px-5 py-3 btn-3d-dark text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{tr("Back", "पीछे जाएं", "मागे जा", "પાછા જાઓ")}</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 btn-3d-lime text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>
                  {isRuralRole && !otpSent
                    ? tr("Verify Mobile & Request OTP", "मोबाइल सत्यापित करें और ओटीपी पाएं", "मोबाईल तपासा आणि ओटीपी मिळवा", "મોબાઈલ ચકાસો અને ઓટીપી મેળવો")
                    : tr(
                        `Enter ${ROLE_INFO[selectedRole]?.name} Workspace`,
                        `${ROLE_INFO[selectedRole]?.nameHindi || ROLE_INFO[selectedRole]?.name} कार्यक्षेत्र खोलें`,
                        `${ROLE_INFO[selectedRole]?.nameMarathi || ROLE_INFO[selectedRole]?.name} कार्यक्षेत्र उघडा`,
                        `${ROLE_INFO[selectedRole]?.nameGujarati || ROLE_INFO[selectedRole]?.name} કાર્યક્ષેત્ર ખોલો`
                      )}
                </span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>,
    document.body
  );
}
