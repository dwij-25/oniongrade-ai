import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";
import { ROLES, ROLE_INFO } from "../constants/rules";
import { resetDemoData } from "../services/storage";
import {
  User,
  ChevronDown,
  LogOut,
  RefreshCw,
  Scale,
  ShoppingBag,
  Landmark,
  Sprout,
  MapPin,
  ShieldCheck,
  Check,
  Home,
  LayoutDashboard,
  Globe,
  ArrowRight,
  Menu,
  X,
  Award,
  Sparkles,
  BarChart3
} from "lucide-react";

export default function Header() {
  const { user, role, isLoggedIn, logout, switchRole, openLoginModal, showToast } = useAuth();
  const { language, setLanguage, tr, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const headerRef = useRef(null);
  const ctaBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoleInfo = ROLE_INFO[role] || ROLE_INFO[ROLES.FARMER];

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

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Window scroll listener for reactive header density & active nav tracking
  // Window scroll listener for reactive header density & active nav tracking
  useEffect(() => {
    // Initial activeNav on route change
    const initialHash = window.location.hash.replace("#", "");
    if (location.pathname === "/") {
      setActiveNav(initialHash === "standards" || initialHash === "privacy" ? initialHash : initialHash === "model-benchmark" ? "batches" : "home");
    } else {
      setActiveNav(initialHash || "overview");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
      const scrollPos = window.scrollY + 280;

      if (location.pathname === "/") {
        const privacyElem = document.getElementById("privacy");
        const benchmarkElem = document.getElementById("model-benchmark");
        const testedElem = document.getElementById("tested-results");
        const standardsElem = document.getElementById("standards");

        if (privacyElem && scrollPos >= privacyElem.offsetTop) {
          setActiveNav("privacy");
        } else if (benchmarkElem && scrollPos >= benchmarkElem.offsetTop) {
          setActiveNav("batches");
        } else if (testedElem && scrollPos >= testedElem.offsetTop) {
          setActiveNav("batches");
        } else if (standardsElem && scrollPos >= standardsElem.offsetTop) {
          setActiveNav("standards");
        } else {
          setActiveNav("home");
        }
      } else if (location.pathname === "/farmer") {
        const profileElem = document.getElementById("profile");
        const lotsElem = document.getElementById("harvest-lots");

        if (profileElem && scrollPos >= profileElem.offsetTop) {
          setActiveNav("profile");
        } else if (lotsElem && scrollPos >= lotsElem.offsetTop) {
          setActiveNav("harvest-lots");
        } else {
          setActiveNav("overview");
        }
      } else if (location.pathname === "/retailer") {
        const lotsElem = document.getElementById("lots");
        const filtersElem = document.getElementById("filters");

        if (lotsElem && scrollPos >= lotsElem.offsetTop) {
          setActiveNav("lots");
        } else if (filtersElem && scrollPos >= filtersElem.offsetTop) {
          setActiveNav("filters");
        } else {
          setActiveNav("overview");
        }
      } else if (location.pathname === "/officer") {
        const hash = window.location.hash.replace("#", "");
        if (hash && ["camera", "queue", "purchases"].includes(hash)) {
          setActiveNav(hash);
        } else if (window.scrollY < 150) {
          setActiveNav("overview");
        }
      } else if (location.pathname === "/government") {
        const hash = window.location.hash.replace("#", "");
        if (hash && ["analytics", "disputes", "rules"].includes(hash)) {
          setActiveNav(hash);
        } else if (window.scrollY < 150) {
          setActiveNav("overview");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Synchronize hash with activeNav
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveNav(hash === "model-benchmark" ? "batches" : hash);
      }
    };
    window.addEventListener("hashchange", handleHashSync);
    return () => window.removeEventListener("hashchange", handleHashSync);
  }, []);

  // GSAP Entrance Animation
  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -35, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // GSAP Magnetic Micro-interaction on CTA button (Awwwards style)
  const handleCtaMouseMove = (e) => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(btn, {
      x: x * 0.22,
      y: y * 0.22,
      duration: 0.25,
      ease: "power2.out"
    });
  };

  const handleCtaMouseLeave = () => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1.1, 0.4)"
    });
  };

  const handleRoleSelect = (targetRole) => {
    switchRole(targetRole);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(`/${targetRole}`);
  };

  const handleReset = () => {
    const confirmMsg = tr(
      "Reset all test lots and disputes to factory seed data?",
      "सभी परीक्षण लॉट और विवादों को फ़ैक्टरी डेटा पर रीसेट करें?",
      "सर्व चाचणी लॉट्स आणि तक्रारी मूळ फॅक्टरी डेटावर रीसेट करायचे का?",
      "તમામ પરીક્ષણ લોટ્સ અને વિવાદોને ફેક્ટરી ડેટા પર રીસેટ કરવા છે?"
    );
    const toastMsg = tr(
      "Data restored to factory seed state",
      "डेटा फ़ैक्टरी स्थिति में पुनर्स्थापित किया गया",
      "डेटा मूळ फॅक्टरी स्थितीत पुनर्संचयित केला",
      "ડેટા ફેક્ટરી સ્થિતિમાં પુનઃસ્થાપિત થયો"
    );
    if (window.confirm(confirmMsg)) {
      resetDemoData();
      showToast(toastMsg, "info");
      setDropdownOpen(false);
      window.location.reload();
    }
  };

  const scrollToSection = (id) => {
    setActiveNav(id === "model-benchmark" ? "batches" : id);
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dynamic navigation items based on current page / role
  const getNavItems = () => {
    if (location.pathname === "/farmer") {
      return [
        { id: "overview", label: tr("Overview", "अवलोकन", "आढावा", "ઝાંખી") },
        { id: "harvest-lots", label: tr("Certified Lots", "प्रमाणित लॉट्स", "प्रमाणित लॉट्स", "પ્રમાણિત લોટ્સ") },
        { id: "profile", label: tr("Mandi Profile", "मंडी प्रोफ़ाइल", "बाजार समिती प्रोफाइल", "માર્કેટ યાર્ડ પ્રોફાઇલ") },
      ];
    }
    if (location.pathname === "/retailer") {
      return [
        { id: "overview", label: tr("Marketplace", "मंडी बाज़ार", "बाजारपेठ", "માર્કેટ બજાર") },
        { id: "filters", label: tr("Filter Lots", "फ़िल्टर लॉट्स", "लॉट्स फिल्टर", "લોટ્સ ફિલ્ટર") },
        { id: "lots", label: tr("Verified Lots", "सत्यापित लॉट्स", "प्रमाणित लॉट्स", "ચકાસાયેલ લોટ્સ") },
      ];
    }
    if (location.pathname === "/officer") {
      return [
        { id: "overview", label: tr("Terminal", "टर्मिनल", "टर्मिनल", "ટર્મિનલ") },
        { id: "camera", label: tr("Intake & Grading", "आवक व ग्रेडिंग", "आवक व प्रतवारी", "આવક અને ગ્રેડિંગ") },
        { id: "queue", label: tr("Graded Queue", "ग्रेडिंग सूची", "प्रतवारी यादी", "ગ્રેડિંગ યાદી") },
        { id: "purchases", label: tr("Purchase Requests", "खरीद अनुरोध", "खरेदी विनंत्या", "ખરીદ વિનંતીઓ") },
      ];
    }
    if (location.pathname === "/government") {
      return [
        { id: "overview", label: tr("Central Desk", "केंद्रीय डेस्क", "केंद्रीय डेस्क", "સેન્ટ્રલ ડેસ્ક") },
        { id: "analytics", label: tr("Analytics", "विश्लेषिकी", "विश्लेषण", "વિશ્લેષણ") },
        { id: "disputes", label: tr("Disputes Queue", "विवाद सूची", "तक्रार यादी", "વિવાદ યાદી") },
        { id: "rules", label: tr("Model Rules", "मॉडल नियम", "मॉडेल नियम", "મોડેલ નિયમો") },
      ];
    }
    // Default: Home Page Navigation
    return [
      { id: "home", label: tr("Home", "होम", "मुख्य पृष्ठ", "હોમ") },
      { id: "standards", label: tr("Standards", "मानक", "मानके", "ધોરણો"), dot: true },
      { id: "batches", label: tr("Batches", "परीक्षण बैच", "तपासणी बॅचेस", "ચકાસાયેલ બેચ") },
      { id: "privacy", label: tr("Privacy", "गोपनीयता", "गोपनीयता", "ગોપનીયતા") },
    ];
  };

  const handleNavClick = (id) => {
    setActiveNav(id);
    setMobileMenuOpen(false);

    if (location.pathname === "/") {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else {
        const targetId = id === "batches" ? "model-benchmark" : id;
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        }
        window.history.pushState(null, "", `/#${id}`);
      }
      return;
    }

    // Role pages navigation
    if (id === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", `${location.pathname}#overview`);
      window.dispatchEvent(new Event("hashchange"));
      return;
    }

    // Update URL hash & trigger component sync (tabs for officer / government)
    window.history.pushState(null, "", `${location.pathname}#${id}`);
    window.dispatchEvent(new Event("hashchange"));

    // Scroll smoothly to target element
    setTimeout(() => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }, 60);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-2 sm:top-4 z-40 px-3 sm:px-6 transition-all duration-300 ${
          scrolled ? "pt-0 sm:pt-0" : "pt-1"
        }`}
      >
        {/* Acctual-Style Glassmorphism Pill Container — Bright Cream Shade */}
        <div
          className={`max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 relative ${
            scrolled
              ? "bg-[#FFF6EF]/92 dark:bg-[#FFF6EF]/95 backdrop-blur-2xl shadow-[0_18px_50px_rgba(0,0,0,0.32),0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-[#F8D5C2]/90"
              : "bg-[#FFF5ED]/88 dark:bg-[#FFF5ED]/92 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-[#F8D5C2]/70"
          }`}
        >
          {/* Glass Top Highlight Sheen */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFF8F3] to-transparent pointer-events-none opacity-90" />

          {/* Left: Brand Mark + Dynamic Navigation Links */}
          <div className="flex items-center gap-3 lg:gap-7">
            {/* Brand Logo without any hover visual overlay or scale shift */}
            <Link
              to="/"
              onClick={() => {
                setActiveNav("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 active:scale-95 flex-shrink-0"
              title="OnionGrade AI — Public Portal"
            >
              {/* Stable Brand Icon with No Hover Distortion */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#000000] flex items-center justify-center text-white shadow-sm flex-shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="OnionGrade AI"
                  className="w-full h-full object-contain select-none"
                  onError={(e) => {
                    // Fallback to geometric mark if image fails
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Brand Typography in Crisp Charcoal/Black */}
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-sm sm:text-base text-[#000000] tracking-tight leading-none">
                  OnionGrade
                </span>
                <span className="bg-[#000000] text-[#F18B49] font-mono font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full leading-none shadow-xs">
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Contextual to Current Page) with Black Active Highlight */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {getNavItems().map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#000000] text-white font-bold shadow-md"
                        : "text-neutral-800 hover:text-black hover:bg-black/[0.06] font-semibold"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-[#F18B49]" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Cluster: Language Switcher, Log in, Sign up for free (Pill CTA) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 4-Language Dropdown Capsule */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer border ${
                  langDropdownOpen
                    ? "bg-black text-white border-black ring-2 ring-[#F18B49]"
                    : "bg-black/[0.05] hover:bg-black/[0.09] text-neutral-900 border-black/10"
                }`}
                title="Switch Language / भाषा निवडा / ભાષા બદલો"
                aria-label="Select language"
                aria-expanded={langDropdownOpen}
              >
                <Globe size={13} className={langDropdownOpen ? "text-[#F18B49]" : "text-neutral-700"} />
                <span className="tracking-wide">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label || "EN"}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    langDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Language Selection Popover (High-contrast opaque dark card) */}
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-3xl p-3 text-xs text-[#F8D5C2] z-[100] animate-in fade-in slide-in-from-top-2 duration-150 shadow-[0_25px_70px_rgba(0,0,0,0.98)] border-2 border-[#F18B49]/50 bg-[#0C040A] backdrop-blur-2xl">
                  {/* Popover Header */}
                  <div className="px-3 py-2 border-b border-white/[0.08] mb-2.5 flex items-center justify-between bg-[#180815] rounded-2xl">
                    <div className="flex items-center gap-1.5 text-[#F18B49]">
                      <Globe size={13} />
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider">
                        {tr("Select Language", "भाषा चुनें", "भाषा निवडा", "ભાષા પસંદ કરો")}
                      </span>
                    </div>
                    <span className="capsule-tag py-0.5 px-2 text-[9px] font-bold">4 REGIONS</span>
                  </div>

                  {/* Language Cards */}
                  <div className="space-y-1.5">
                    {SUPPORTED_LANGUAGES.map((langItem) => {
                      const isSelected = language === langItem.code;
                      return (
                        <button
                          key={langItem.code}
                          type="button"
                          onClick={() => {
                            setLanguage(langItem.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 sm:p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#F18B49]/15 border-2 border-[#F18B49] text-[#F8D5C2] shadow-md shadow-[#F18B49]/15"
                              : "bg-[#150812] hover:bg-[#200C1C] border-white/[0.06] hover:border-[#F18B49]/40 text-[#F8D5C2]"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 pr-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold text-sm ${
                                  isSelected ? "text-[#F18B49]" : "text-[#F8D5C2]"
                                }`}
                              >
                                {langItem.native}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-black/50 text-[#F18B49] border border-white/10 font-bold">
                                {langItem.code.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#C4A494] leading-tight font-sans">
                              {langItem.region}
                            </span>
                          </div>
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-[#F18B49] text-[#000000] flex items-center justify-center shadow-sm">
                                <Check size={13} strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-white/30" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Popover Footer Banner */}
                  <div className="mt-2.5 pt-2 border-t border-white/[0.08] px-2 text-[10px] text-[#C4A494] font-mono flex items-center justify-between">
                    <span>
                      {tr(
                        "Mandi Belt Localization",
                        "मंडी भाषा अनुकूलन",
                        "बाजार समिती भाषा सानुकूलन",
                        "માર્કેટ યાર્ડ ભાષા અનુકૂલન"
                      )}
                    </span>
                    <span className="text-[#F18B49] font-bold">100% LOCALIZED</span>
                  </div>
                </div>
              )}
            </div>

            {/* Authentication & CTA Cluster */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2" ref={dropdownRef}>
                {/* Active Workspace Capsule Link */}
                {location.pathname === "/" ? (
                  <Link
                    to={`/${role}`}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-neutral-900 text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
                    title="Open active workspace"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#F18B49]" />
                    <span>
                      {tr(
                        `${currentRoleInfo?.shortName} Workspace`,
                        `${getRoleDisplayShort(currentRoleInfo)} कार्यक्षेत्र`,
                        `${getRoleDisplayShort(currentRoleInfo)} कार्यक्षेत्र`,
                        `${getRoleDisplayShort(currentRoleInfo)} કાર્યક્ષેત્ર`
                      )}
                    </span>
                    <ArrowRight size={12} className="text-neutral-500" />
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-neutral-800 text-xs font-semibold transition-all whitespace-nowrap"
                  >
                    <Home size={13} />
                    <span>{tr("Public Portal", "सार्वजनिक पोर्टल", "सार्वजनिक पोर्टल", "જાહેર પોર્ટલ")}</span>
                  </Link>
                )}

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 transition-all active:scale-95 cursor-pointer"
                    aria-label="User profile menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#000000] text-[#F18B49] font-black text-xs flex items-center justify-center shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <ChevronDown
                      size={12}
                      className={`text-neutral-700 mr-1 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-64 rounded-3xl p-2.5 text-sm text-[#F8D5C2] z-[100] animate-in fade-in slide-in-from-top-2 duration-150 shadow-[0_25px_70px_rgba(0,0,0,0.98)] border-2 border-white/15 bg-[#0C040A] backdrop-blur-2xl">
                      <div className="px-3 py-2.5 border-b border-white/[0.08] mb-1 bg-[#180815] rounded-2xl">
                        <div className="font-bold text-sm text-[#F8D5C2]">{user?.name}</div>
                        <div className="text-xs text-[#C4A494] flex items-center gap-1 mt-0.5">
                          <span>{user?.phone || user?.email}</span>
                        </div>
                        {user?.mandi && (
                          <div className="text-[11px] text-[#F18B49] font-mono mt-1 flex items-center gap-1">
                            <MapPin size={11} />
                            <span>{user.mandi}</span>
                          </div>
                        )}
                      </div>

                      {/* Navigation Jump */}
                      <div className="px-1 py-1 space-y-0.5 border-b border-white/[0.08] mb-1">
                        <Link
                          to="/"
                          onClick={() => setDropdownOpen(false)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs transition-colors ${
                            location.pathname === "/"
                              ? "bg-[#F18B49]/20 text-[#F18B49] font-bold"
                              : "text-[#C4A494] hover:bg-white/5 hover:text-[#F8D5C2]"
                          }`}
                        >
                          <Home size={13} />
                          <span>
                            {tr(
                              "Public Homepage & Showcase",
                              "सार्वजनिक मुख्य पृष्ठ व शोकेस",
                              "मुख्य पृष्ठ व शोकेस",
                              "મુખ્ય પૃષ્ઠ અને શૉકેસ"
                            )}
                          </span>
                        </Link>

                        <Link
                          to={`/${role}`}
                          onClick={() => setDropdownOpen(false)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs transition-colors ${
                            location.pathname === `/${role}`
                              ? "bg-[#F18B49]/20 text-[#F18B49] font-bold"
                              : "text-[#C4A494] hover:bg-white/5 hover:text-[#F8D5C2]"
                          }`}
                        >
                          <LayoutDashboard size={13} />
                          <span>
                            {tr(
                              `My Workspace (${currentRoleInfo?.shortName})`,
                              `कार्यक्षेत्र (${getRoleDisplayShort(currentRoleInfo)})`,
                              `कार्यक्षेत्र (${getRoleDisplayShort(currentRoleInfo)})`,
                              `કાર્યક્ષેત્ર (${getRoleDisplayShort(currentRoleInfo)})`
                            )}
                          </span>
                        </Link>
                      </div>

                      {/* Switch Active Role */}
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[#C4A494] uppercase tracking-wider">
                        {tr("Switch Active Role", "सक्रिय भूमिका बदलें", "सक्रिय भूमिका बदला", "સક્રિય ભૂમિકા બદલો")}
                      </div>

                      <div className="space-y-0.5 px-1">
                        <button
                          onClick={() => handleRoleSelect(ROLES.FARMER)}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                            role === ROLES.FARMER
                              ? "bg-[#F18B49]/20 text-[#F18B49] font-bold"
                              : "hover:bg-white/5 text-[#F8D5C2]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Sprout size={16} className="text-[#F18B49]" />
                            <div className="text-xs font-bold leading-none">
                              {tr("Farmer / Seller", "किसान / उत्पादक", "शेतकरी / कांदा उत्पादक", "ખેડૂત / ડુંગળી ઉત્પાદક")}
                            </div>
                          </div>
                          {role === ROLES.FARMER && <Check size={14} className="text-[#F18B49]" />}
                        </button>

                        <button
                          onClick={() => handleRoleSelect(ROLES.RETAILER)}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                            role === ROLES.RETAILER
                              ? "bg-[#EB87A9]/20 text-[#EB87A9] font-bold"
                              : "hover:bg-white/5 text-[#F8D5C2]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag size={16} className="text-[#EB87A9]" />
                            <div className="text-xs font-bold leading-none">
                              {tr("Retailer / Trader", "व्यापारी / थोक खरीदार", "व्यापारी / अडतदार", "વેપારી / જથ્થાબંધ ખરીદનાર")}
                            </div>
                          </div>
                          {role === ROLES.RETAILER && <Check size={14} className="text-[#EB87A9]" />}
                        </button>

                        <button
                          onClick={() => handleRoleSelect(ROLES.OFFICER)}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                            role === ROLES.OFFICER
                              ? "bg-[#F8D5C2]/20 text-[#F8D5C2] font-bold"
                              : "hover:bg-white/5 text-[#F8D5C2]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Scale size={16} className="text-[#F8D5C2]" />
                            <div className="text-xs font-bold leading-none">
                              {tr("Procurement Officer", "खरीद केंद्र अधिकारी", "खरेदी केंद्र अधिकारी", "ખરીદ કેન્દ્ર અધિકારી")}
                            </div>
                          </div>
                          {role === ROLES.OFFICER && <Check size={14} className="text-[#F8D5C2]" />}
                        </button>

                        <button
                          onClick={() => handleRoleSelect(ROLES.GOVERNMENT)}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                            role === ROLES.GOVERNMENT
                              ? "bg-[#5F1C47]/50 text-[#EB87A9] font-bold"
                              : "hover:bg-white/5 text-[#F8D5C2]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Landmark size={16} className="text-[#EB87A9]" />
                            <div className="text-xs font-bold leading-none">
                              {tr("Government / DoCA", "सरकार / DoCA", "शासकीय / DoCA", "સરકારી / DoCA")}
                            </div>
                          </div>
                          {role === ROLES.GOVERNMENT && <Check size={14} className="text-[#EB87A9]" />}
                        </button>
                      </div>

                      <div className="h-px bg-white/[0.08] my-2" />

                      <div className="space-y-0.5 px-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            scrollToSection("standards");
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[#F18B49] hover:bg-[#F18B49]/10 transition-colors cursor-pointer"
                        >
                          <Award size={14} />
                          <span>{tr("DoCA Agmark Standards", "DoCA एगमार्क मानक", "DoCA अ‍ॅगमार्क मानके", "DoCA એગમાર્ક ધોરણો")}</span>
                        </button>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            scrollToSection("privacy");
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[#F8D5C2] hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <ShieldCheck size={14} />
                          <span>{tr("Data Privacy Architecture", "डेटा गोपनीयता संरचना", "माहिती गोपनीयता रचना", "ડેટા ગોપનીયતા માળખું")}</span>
                        </button>

                        <button
                          onClick={handleReset}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[#C4A494] hover:bg-white/5 hover:text-[#F8D5C2] transition-colors cursor-pointer"
                        >
                          <RefreshCw size={14} />
                          <span>{tr("Reset Demo Data", "डेमो डेटा रीसेट करें", "डेमो डेटा रीसेट करा", "ડેમો ડેટા રીસેટ કરો")}</span>
                        </button>

                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[#EB87A9] hover:bg-[#EB87A9]/15 transition-colors cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>{tr("Log out", "लॉग आउट", "लॉग आऊट", "લૉગ આઉટ")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* When Logged Out: Solid Black Pill Button used for Login */
              <div className="flex items-center">
                <Link
                  ref={ctaBtnRef}
                  to="/login"
                  onMouseMove={handleCtaMouseMove}
                  onMouseLeave={handleCtaMouseLeave}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-white font-medium text-xs sm:text-sm shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.45)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  title="Open Stakeholder Login Terminal"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F18B49]" />
                  <span>{tr("Log in", "लॉग इन", "लॉग इन", "લૉગ ઇન")}</span>
                  <ArrowRight size={13} className="text-[#F18B49]" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Glass Menu Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-6xl mx-auto mt-2 p-4 rounded-3xl bg-[#FFF6EF]/95 dark:bg-[#0C040A]/95 backdrop-blur-2xl border border-[#F8D5C2]/50 dark:border-white/10 shadow-2xl animate-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col gap-1 text-sm font-semibold">
              {getNavItems().map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                      isActive
                        ? "bg-[#000000] text-white font-bold"
                        : "text-neutral-900 dark:text-[#F8D5C2] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.dot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F18B49]" />
                    )}
                  </button>
                );
              })}

              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />

              {/* For Role Pages: Quick jump to Public Portal */}
              {location.pathname !== "/" && (
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-neutral-900 dark:text-[#F8D5C2] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Home size={14} className="text-[#F18B49]" />
                    <span>{tr("Public Portal", "सार्वजनिक पोर्टल", "सार्वजनिक पोर्टल", "જાહેર પોર્ટલ")}</span>
                  </span>
                  <ArrowRight size={14} className="text-neutral-400" />
                </Link>
              )}

              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-neutral-900 dark:text-[#F8D5C2] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between"
                >
                  <span>{tr("Role Login Screen", "भूमिका लॉगिन स्क्रीन", "भूमिका लॉगिन स्क्रीन", "ભૂમિકા લૉગિન સ્ક્રીન")}</span>
                  <ArrowRight size={14} className="text-[#F18B49]" />
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
