import type { Locale } from 'date-fns';
import React, { createContext, useContext, useMemo } from 'react';

import {
  defaultLang,
  getLangFromPath,
  languageSwitchPath,
  localizedPath,
  otherLang,
  type Lang,
} from './config';
import { getDateLocale, getUi, type UiStrings } from './ui';

interface I18nContextValue {
  lang: Lang;
  otherLang: Lang;
  pathname: string;
  t: UiStrings;
  dateLocale: Locale;
  path: (path?: string) => string;
  switchPath: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface LanguageProviderProps {
  pathname?: string;
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  pathname = '/',
  children,
}) => {
  const value = useMemo<I18nContextValue>(() => {
    const lang = getLangFromPath(pathname);
    const targetLang = otherLang(lang);
    return {
      lang,
      otherLang: targetLang,
      pathname,
      t: getUi(lang),
      dateLocale: getDateLocale(lang),
      path: (path = '/') => localizedPath(lang, path),
      switchPath: languageSwitchPath(pathname, targetLang),
    };
  }, [pathname]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside LanguageProvider');
  }
  return context;
};

export { defaultLang };
