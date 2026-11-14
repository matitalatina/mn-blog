import { enUS, it as itLocale } from 'date-fns/locale';
import type { Locale } from 'date-fns';

import type { Lang } from './config';

export interface UiStrings {
  siteDescription: string;
  navHome: string;
  navProjects: string;
  navSlides: string;
  navDev: string;
  navHowTo: string;
  navFollow: string;
  languageName: string;
  footerLatestPosts: string;
  minRead: (minutes: number) => string;
  moreIn: string;
  seeAllPosts: (count: number) => string;
  onePost: string;
  noPosts: string;
  postsCount: (count: number) => string;
  morePosts: string;
  by: string;
  website: string;
  twitter: string;
  facebook: string;
  subscribeTitle: string;
  subscribeDescription: string;
  subscribePlaceholder: string;
  subscribeButton: string;
  sponsorTitle: string;
  sponsorDescription: string;
  buyCoffee: string;
  becomeSponsor: string;
  shareTitle: (title: string) => string;
  shareSubject: string;
  notFound: string;
  backHome: string;
  tagCollection: (count: number) => string;
  projectsTitle: string;
  projectsHeadTitle: string;
  aboutTitle: string;
  aboutHeadTitle: string;
}

const it: UiStrings = {
  siteDescription: 'Il mio blog personale',
  navHome: 'Home',
  navProjects: 'Progetti',
  navSlides: 'Slides',
  navDev: 'Dev',
  navHowTo: 'How-to',
  navFollow: 'Segui',
  languageName: 'English',
  footerLatestPosts: 'Ultimi Articoli',
  minRead: minutes => `${minutes} min`,
  moreIn: 'Altro in',
  seeAllPosts: count => `Leggi tutti i ${count} articoli`,
  onePost: '1 articolo',
  noPosts: 'Nessun articolo',
  postsCount: count => `${count} articoli`,
  morePosts: 'Altri articoli',
  by: 'di',
  website: 'Sito web',
  twitter: 'Twitter',
  facebook: 'Facebook',
  subscribeTitle: 'Rimanere aggiornati è fondamentale',
  subscribeDescription: 'Ricevi le ultime novità via email',
  subscribePlaceholder: 'tuaemail@esempio.com',
  subscribeButton: 'Segui',
  sponsorTitle: 'Hai imparato qualcosa di nuovo?',
  sponsorDescription: 'Aiutami a creare altri contenuti come questo!',
  buyCoffee: '☕️ Offrimi un caffè',
  becomeSponsor: '❤️ Diventa uno sponsor',
  shareTitle: title => `Davvero interessante! 👇\n${title}`,
  shareSubject: 'Ho trovato questo articolo online',
  notFound: 'Pagina non trovata',
  backHome: 'Vai alla pagina principale →',
  tagCollection: count => {
    if (count > 1) {
      return `Una collezione di ${count} articoli`;
    }
    if (count === 1) {
      return '1 articolo';
    }
    return 'Nessun articolo';
  },
  projectsTitle: 'I miei progetti',
  projectsHeadTitle: 'I miei progetti - Mattia Natali',
  aboutTitle: 'Chi sono',
  aboutHeadTitle: 'Chi sono - Mattia Natali',
};

const en: UiStrings = {
  siteDescription: 'My technical personal blog',
  navHome: 'Home',
  navProjects: 'Projects',
  navSlides: 'Slides',
  navDev: 'Dev',
  navHowTo: 'How-to',
  navFollow: 'Follow',
  languageName: 'Italiano',
  footerLatestPosts: 'Latest Posts',
  minRead: minutes => `${minutes} min read`,
  moreIn: 'More in',
  seeAllPosts: count => `See all ${count} posts`,
  onePost: '1 post',
  noPosts: 'No posts',
  postsCount: count => `${count} posts`,
  morePosts: 'More posts',
  by: 'by',
  website: 'Website',
  twitter: 'Twitter',
  facebook: 'Facebook',
  subscribeTitle: 'Keeping up to date is essential',
  subscribeDescription: 'Get the latest news by email',
  subscribePlaceholder: 'youremail@example.com',
  subscribeButton: 'Follow',
  sponsorTitle: 'Do you like my content?',
  sponsorDescription: 'Help me creating other stuff like this!',
  buyCoffee: '☕️ Buy me a coffee',
  becomeSponsor: '❤️ Become a sponsor',
  shareTitle: title => `Very interesting! 👇\n${title}`,
  shareSubject: 'I found this post online',
  notFound: 'Page not found',
  backHome: 'Go to the home page →',
  tagCollection: count => {
    if (count > 1) {
      return `A collection of ${count} posts`;
    }
    if (count === 1) {
      return '1 post';
    }
    return 'No posts';
  },
  projectsTitle: 'My Projects',
  projectsHeadTitle: 'My Projects - Mattia Natali',
  aboutTitle: 'About',
  aboutHeadTitle: 'About - Mattia Natali',
};

export const ui: Record<Lang, UiStrings> = { it, en };

export const getUi = (lang: Lang): UiStrings => ui[lang];

export const dateLocales: Record<Lang, Locale> = {
  it: itLocale,
  en: enUS,
};

export const getDateLocale = (lang: Lang): Locale => dateLocales[lang];
