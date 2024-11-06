"use client";

import i18next from "i18next";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import { initI18n } from "@/lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initI18n();
      setIsI18nInitialized(true);
    };
    init();
  }, []);

  if (!isI18nInitialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
