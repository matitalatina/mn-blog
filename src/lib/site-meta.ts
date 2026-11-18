import type { Lang } from './i18n';

interface SiteMeta {
  rssTitle: string;
  siteDescription: string;
  ogLocale: string;
}

export const siteMeta: Record<Lang, SiteMeta> = {
  it: {
    rssTitle: 'Blog di Mattia Natali',
    siteDescription: 'Il mio blog personale',
    ogLocale: 'it_IT',
  },
  en: {
    rssTitle: "Mattia Natali's Blog",
    siteDescription: 'My technical personal blog',
    ogLocale: 'en_US',
  },
};
