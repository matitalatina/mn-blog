export const LANGS = ['it', 'en'] as const;

export type Lang = (typeof LANGS)[number];

export const defaultLang: Lang = 'it';

export const isLang = (value: string): value is Lang =>
  (LANGS as readonly string[]).includes(value);

export const getLangFromPath = (pathname = '/'): Lang => {
  const path = pathname.split('?')[0];
  if (path === '/en' || path.startsWith('/en/')) {
    return 'en';
  }
  if (path === '/it' || path.startsWith('/it/')) {
    return 'it';
  }
  // App privacy pages stay on the old English root paths.
  if (
    path.startsWith('/gaslow/') ||
    path.startsWith('/metext/') ||
    path.startsWith('/randommet/')
  ) {
    return 'en';
  }
  return defaultLang;
};

export const localizedPath = (lang: Lang, path = '/'): string => {
  if (!path || path === '/') {
    return `/${lang}/`;
  }
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
};

export const otherLang = (lang: Lang): Lang => (lang === 'it' ? 'en' : 'it');

export const languageSwitchPath = (pathname: string, targetLang: Lang): string => {
  if (pathname.includes('/tags/') || pathname.includes('/author/')) {
    return `/${targetLang}/`;
  }

  const match = pathname.match(/^\/(it|en)(\/.*)?$/);
  if (match) {
    return `/${targetLang}${match[2] || '/'}`;
  }

  return `/${targetLang}/`;
};
