import { createContext, useContext, useState } from "react";
import { translations } from "../i18n/translations";

const LangContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const value = {
    lang,
    setLang,
    t: translations[lang],
    isRTL: lang === "ur",
  };

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
