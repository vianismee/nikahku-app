"use client";

import { createContext, useContext, useState, useCallback } from "react";
import landingDataId from "@/data/landing-page.json";
import landingDataEn from "@/data/landing-page.en.json";

type Lang = "id" | "en";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  data: typeof landingDataId;
}

const LangContext = createContext<LangContextType>({
  lang: "id",
  toggleLang: () => {},
  data: landingDataId,
});

const dataMap = { id: landingDataId, en: landingDataEn };

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  }, []);

  return (
    <LangContext.Provider value={{ lang, toggleLang, data: dataMap[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
