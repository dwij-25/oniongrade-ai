import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2, Scale, ShoppingBag, Sprout, ArrowRight, Sparkles, User, Phone, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ROLES, ROLE_INFO } from "../constants/rules";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const searchRole = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState(searchRole || ROLES.FARMER);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mandi, setMandi] = useState("Lasalgaon APMC");
  
  const { login, guestLogin } = useAuth();
  const { language, t, tr } = useLanguage();
  const navigate = useNavigate();

  const handleEnter = (demo = false) => {
    if (demo) {
      guestLogin(selectedRole);
    } else {
      login(selectedRole, {
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        mandi: mandi || undefined
      });
    }
    navigate(`/${selectedRole}`);
  };

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

  const roles = [
    {
      key: ROLES.FARMER,
      name: tr("Farmer", "किसान", "शेतकरी", "ખેડૂત"),
      icon: Sprout,
      color: "#F18B49"
    },
    {
      key: ROLES.RETAILER,
      name: tr("Retailer", "व्यापारी", "व्यापारी", "વેપારી"),
      icon: ShoppingBag,
      color: "#EB87A9"
    },
    {
      key: ROLES.OFFICER,
      name: tr("Officer", "अधिकारी", "अधिकारी", "અધિકારી"),
      icon: Scale,
      color: "#F18B49"
    },
    {
      key: ROLES.GOVERNMENT,
      name: tr("Government", "सरकार", "शासकीय", "સરકાર"),
      icon: Building2,
      color: "#FF4D4D"
    },
  ];

  const currentRoleInfo = ROLE_INFO[selectedRole] || ROLE_INFO[ROLES.FARMER];

  return (
    <main className="min-h-screen bg-[#000000] text-[#F8D5C2] grid lg:grid-cols-[0.8fr_1.2fr]">
      {/* Left Hero Sidebar */}
      <section className="flex flex-col justify-between p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-[#120710] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#F18B49]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-[#C4A494] hover:text-[#F18B49] transition-colors">
            <ArrowLeft size={16} />
            <span>{tr("Back to Showcase", "मुख्य पृष्ठ पर वापस जाएं", "मुख्य पृष्ठावर परत जा", "મુખ્ય પૃષ્ઠ પર પાછા જાઓ")}</span>
          </Link>

          <div className="mt-16 sm:mt-24 space-y-4">
            <span className="capsule-tag">
              <Sparkles size={11} />
              <span>{tr("NATIONAL MANDI TERMINAL", "राष्ट्रीय मंडी टर्मिनल", "राष्ट्रीय बाजार समिती टर्मिनल", "રાષ્ટ્રીય માર્કેટ યાર્ડ ટર્મિનલ")}</span>
            </span>

            <h1 className="font-sans font-black text-3xl sm:text-5xl text-[#F8D5C2] tracking-tight leading-tight">
              {tr(
                "One unified platform. Four dedicated viewpoints.",
                "एक एकीकृत मंच। चार समर्पित दृष्टिकोण।",
                "एकच एकात्मिक व्यासपीठ. चार समर्पित कार्यक्षेत्रे.",
                "એક સંકલિત મંચ. ચાર સમર્પિત દ્રષ્ટિકોણ."
              )}
            </h1>

            <p className="text-sm text-[#C4A494] leading-relaxed max-w-md">
              {tr(
                "Enter your stakeholder workspace to grade lots, discover fair rates, record weighbridge intakes, or oversee national buffer reserves.",
                "सत्यापित प्याज लॉट्स की ग्रेडिंग, खरीद, वजनपुल आवक और राष्ट्रीय बफर निगरानी के लिए अपने हितधारक कार्यक्षेत्र में प्रवेश करें।",
                "प्रमाणित कांदा लॉट्सची प्रतवारी, खरेदी, वजनकाटा आवक आणि राष्ट्रीय बफर साठा देखरेखीसाठी आपल्या कार्यक्षेत्रात प्रवेश करा.",
                "પ્રમાણિત ડુંગળી લોટ ગ્રેડિંગ, ખરીદી, વજનકાંટો આવક અને રાષ્ટ્રીય બફર સ્ટોક દેખરેખ માટે તમારા કાર્યક્ષેત્રમાં પ્રવેશ કરો."
              )}
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-10 text-[11px] font-mono text-[#C4A494]">
          <span>{tr("DoCA Standard • ICAR-DOGR Calibrated", "DoCA मानक • ICAR-DOGR कैलिब्रेटेड", "DoCA मानक • ICAR-DOGR कॅलिब्रेटेड", "DoCA ધોરણ • ICAR-DOGR કેલિબ્રેટેડ")}</span>
        </div>
      </section>

      {/* Right Login Action Area */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-xl space-y-6">
          <div>
            <span className="capsule-tag-dark mb-2">
              {tr("STAKEHOLDER SELECTION", "हितधारक चयन", "हितधारक निवड", "હિતધારક પસંદગી")}
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#F8D5C2]">
              {tr("Select Your Workspace", "अपना कार्यक्षेत्र चुनें", "आपले कार्यक्षेत्र निवडा", "તમારું કાર્યક્ષેત્ર પસંદ કરો")}
            </h2>
            <p className="text-xs text-[#C4A494] mt-1">
              {tr(
                "Select your role in the supply chain to open your dedicated workflow.",
                "अपनी मंडी भूमिका चुनें और प्रमाणित कार्यक्षेत्र में लॉग इन करें।",
                "आपली भूमिका निवडा आणि समर्पित कार्यक्षेत्रात लॉग इन करा.",
                "તમારી મંડી ભૂમિકા પસંદ કરો અને સમર્પિત કાર્યક્ષેત્રમાં લૉગ ઇન કરો."
              )}
            </p>
          </div>

          {/* Role selector tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roles.map(({ key, name: roleName, icon: Icon, color }) => {
              const isSelected = selectedRole === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedRole(key)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#1F0B1B] border-[#F18B49] shadow-lg shadow-[#F18B49]/15 ring-1 ring-[#F18B49]"
                      : "bg-[#120710] border-white/[0.06] hover:border-white/20 text-[#C4A494]"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40`, color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase block text-[#C4A494]">
                      {key}
                    </span>
                    <span className="font-sans font-bold text-sm text-[#F8D5C2]">
                      {roleName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Role form container */}
          <div className="card-3d p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#C4A494] uppercase">
                  {tr("Active Role", "सक्रिय भूमिका", "सक्रिय भूमिका", "સક્રિય ભૂમિકા")}
                </span>
                <h3 className="font-bold text-base text-[#F8D5C2] mt-0.5">
                  {getRoleDisplayName(currentRoleInfo)}
                </h3>
              </div>
              <span className="capsule-tag text-xs font-mono">
                {selectedRole.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#C4A494]">{tr("Name (Optional)", "नाम (वैकल्पिक)", "नाव (पर्यायी)", "નામ (વૈકલ્પિક)")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={tr("e.g. Rameshwar Patil", "उदा. रामेश्वर पाटिल", "उदा. रामेश्वर पाटील", "દા.ત. રમેશભાઈ પટેલ")}
                    className="input-3d w-full pl-9 pr-3 py-2.5 text-xs text-[#F8D5C2]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#C4A494]">{tr("Phone (Optional)", "मोबाइल नंबर (वैकल्पिक)", "मोबाईल नंबर (पर्यायी)", "મોબાઇલ નંબર (વૈકલ્પિક)")}</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98224 81920"
                    className="input-3d w-full pl-9 pr-3 py-2.5 text-xs text-[#F8D5C2]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[#C4A494]">{tr("APMC Mandi Yard", "एपीएमसी मंडी यार्ड", "बाजार समिती यार्ड", "એપીએમસી માર્કેટ યાર્ડ")}</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A494]" />
                  <select
                    value={mandi}
                    onChange={(e) => setMandi(e.target.value)}
                    className="input-3d w-full pl-9 pr-3 py-2.5 text-xs text-[#F8D5C2]"
                  >
                    <option value="Lasalgaon APMC">{tr("Lasalgaon APMC (Nashik, MH)", "लासलगांव एपीएमसी (नासिक, महाराष्ट्र)", "लासलगाव बाजार समिती (नाशिक, महा.)", "લાસલગાવ એપીએમસી (નાસિક, મહારાષ્ટ્ર)")}</option>
                    <option value="Pimpalgaon APMC">{tr("Pimpalgaon APMC (Nashik, MH)", "पिंपलगांव एपीएमसी (नासिक, महाराष्ट्र)", "पिंपळगाव बाजार समिती (नाशिक, महा.)", "પિંપળગાવ એપીએમસી (નાસિક, મહારાષ્ટ્ર)")}</option>
                    <option value="Mahuva APMC">{tr("Mahuva APMC (Bhavnagar, GJ)", "महुवा एपीएमसी (भावनगर, गुजरात)", "महुआ बाजार समिती (भावनगर, गुजरात)", "મહુવા એપીએમસી (ભાવનગર, ગુજરાત)")}</option>
                    <option value="Kurnool APMC">{tr("Kurnool APMC (Andhra Pradesh)", "कर्नूल एपीएमसी (आंध्र प्रदेश)", "कर्नूल बाजार समिती (आंध्र प्रदेश)", "કુર્નૂલ એપીએમસી (આંધ્ર પ્રદેશ)")}</option>
                    <option value="Alwar Mandi">{tr("Alwar Mandi (Rajasthan)", "अलवर मंडी (राजस्थान)", "अलवर बाजार समिती (राजस्थान)", "અલવર મંડી (રાજસ્થાન)")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleEnter(false)}
                className="w-full py-3.5 btn-3d-lime text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>
                  {tr(
                    `Authenticate as ${currentRoleInfo.name}`,
                    `${getRoleDisplayShort(currentRoleInfo)} कार्यक्षेत्र में प्रवेश करें`,
                    `${getRoleDisplayShort(currentRoleInfo)} कार्यक्षेत्रात प्रवेश करा`,
                    `${getRoleDisplayShort(currentRoleInfo)} કાર્યક્ષેત્રમાં પ્રવેશ કરો`
                  )}
                </span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleEnter(true)}
                className="w-full py-2.5 btn-3d-dark text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer text-[#C4A494] hover:text-[#F18B49]"
              >
                <span>
                  {tr(
                    `Enter as 1-Click Demo ${currentRoleInfo.shortName}`,
                    `1-क्लिक डेमो के रूप में प्रवेश करें (${getRoleDisplayShort(currentRoleInfo)})`,
                    `१-क्लिक डेमो म्हणून प्रवेश करा (${getRoleDisplayShort(currentRoleInfo)})`,
                    `૧-ક્લિક ડેમો તરીકે પ્રવેશ કરો (${getRoleDisplayShort(currentRoleInfo)})`
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
