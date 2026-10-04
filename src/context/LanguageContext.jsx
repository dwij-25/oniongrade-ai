import React, { createContext, useContext, useState } from "react";
import { TRANSLATIONS } from "../constants/translations";

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", label: "EN", native: "English", region: "National / Standard" },
  { code: "hi", name: "हिन्दी (Hindi)", label: "हिन्दी", native: "हिन्दी", region: "राष्ट्रीय / उत्तर भारत" },
  { code: "mr", name: "मराठी (Marathi)", label: "मराठी", native: "मराठी", region: "महाराष्ट्र (लासलगाव / पिंपळगाव)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", label: "ગુજરાતી", native: "ગુજરાતી", region: "ગુજરાત (મહુવા / ભાવનગર)" }
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("oniongrade_lang") || "en";
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("oniongrade_lang", lang);
  };

  const toggleLanguage = () => {
    const order = ["en", "hi", "mr", "gu"];
    const nextIdx = (order.indexOf(language) + 1) % order.length;
    setLanguage(order[nextIdx]);
  };

  /**
   * Helper to fetch translated text by dot path e.g. t('farmer.welcome')
   */
  const t = (path, fallback = "") => {
    if (!path) return fallback;
    const parts = path.split(".");
    
    // 1. Check target language
    let current = TRANSLATIONS[language];
    let found = true;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        found = false;
        break;
      }
    }
    
    if (found && current !== undefined) return current;

    // 2. Fallback to Hindi if target language is Marathi/Gujarati and key is missing
    if (language !== "en" && language !== "hi") {
      let hiCurrent = TRANSLATIONS.hi;
      let hiFound = true;
      for (const part of parts) {
        if (hiCurrent && hiCurrent[part] !== undefined) {
          hiCurrent = hiCurrent[part];
        } else {
          hiFound = false;
          break;
        }
      }
      if (hiFound && hiCurrent !== undefined) return hiCurrent;
    }

    // 3. Fallback to English
    let enCurrent = TRANSLATIONS.en;
    for (const enPart of parts) {
      if (enCurrent && enCurrent[enPart] !== undefined) {
        enCurrent = enCurrent[enPart];
      } else {
        return fallback || path;
      }
    }
    return enCurrent !== undefined ? enCurrent : fallback || path;
  };

  /**
   * Helper for quick inline translation across 4 languages
   * e.g. tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")
   */
  const tr = (enText, hiText, mrText, guText) => {
    if (language === "mr") return mrText || hiText || enText;
    if (language === "gu") return guText || hiText || enText;
    if (language === "hi") return hiText || enText;
    return enText;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        tr,
        isHindi: language === "hi",
        isMarathi: language === "mr",
        isGujarati: language === "gu",
        isRegional: language !== "en"
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
