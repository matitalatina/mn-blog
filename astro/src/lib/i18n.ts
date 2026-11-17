import { enUS, it as itLocale } from 'date-fns/locale';
import type { Locale } from 'date-fns';

export const LANGS = ['it', 'en'] as const;

export type Lang = (typeof LANGS)[number];

export const defaultLang: Lang = 'it';

export const getLangFromPath = (pathname = '/'): Lang => {
  const path = pathname.split('?')[0];
  if (path === '/en' || path.startsWith('/en/')) {
    return 'en';
  }
  if (path === '/it' || path.startsWith('/it/')) {
    return 'it';
  }
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

export interface UiStrings {
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

export const getUi = (lang: Lang): UiStrings => ui[lang] ?? ui[defaultLang];

export const dateLocales: Record<Lang, Locale> = {
  it: itLocale,
  en: enUS,
};

export const getDateLocale = (lang: Lang): Locale => dateLocales[lang];

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectData {
  name: string;
  description: string;
  links: ProjectLink[];
}

export interface ProjectsContent {
  intro: string;
  items: ProjectData[];
}

export const projectsByLang: Record<Lang, ProjectsContent> = {
  it: {
    intro:
      'Qui puoi trovare alcuni dei progetti su cui ho lavorato. Spaziano da applicazioni web ad app mobile pensate per risolvere problemi specifici o fornire servizi utili.',
    items: [
      {
        name: 'Fontanelle in Italia',
        description:
          "Un'applicazione web che aiuta le persone a trovare le fontanelle pubbliche in Italia. L'app mostra la posizione di ogni fontanella su una mappa, rendendo facile per gli utenti trovare acqua potabile di qualità mentre sono in giro.",
        links: [
          {
            label: 'Visita il sito',
            href: 'https://fontanelle.mattianatali.com/',
          },
        ],
      },
      {
        name: 'Squizly',
        description:
          'Squizly è il compressore video più semplice per macOS. Questa applicazione desktop open-source rende facile comprimere e convertire file video su Mac, disponibile sia per processori Intel che Apple Silicon.',
        links: [
          {
            label: 'Vedi su GitHub',
            href: 'https://github.com/matitalatina/squizly',
          },
        ],
      },
      {
        name: 'GasLow',
        description:
          "GasLow è un'applicazione che aiuta gli utenti a trovare i migliori prezzi del carburante nelle vicinanze. L'app fornisce informazioni in tempo reale sui prezzi dei carburanti delle diverse stazioni di servizio, permettendo agli utenti di risparmiare sui costi del carburante. I dati provengono dagli open data pubblicati dal \"Ministero dello sviluppo economico\" e vengono aggiornati quotidianamente.",
        links: [
          {
            label: 'Visita il sito',
            href: 'https://gaslow.mattianatali.it/',
          },
          {
            label: 'Vedi su App Store',
            href: 'https://apps.apple.com/us/app/gaslow-prezzo-carburanti/id1510630580',
          },
          {
            label: 'Vedi su Google Play',
            href: 'https://play.google.com/store/apps/details?id=it.mattianatali.gaslowapp&hl=it',
          },
        ],
      },
      {
        name: 'Metext | OCR',
        description:
          "Metext è un'app OCR (Optical Character Recognition) che estrae il testo dalle immagini. Gli utenti possono estrarre testo da foto scattate con la fotocamera o da immagini nella galleria. L'app utilizza algoritmi OCR all'avanguardia per fornire un riconoscimento del testo accurato e permette agli utenti di selezionare parti specifiche dell'immagine, rivedere e modificare il testo estratto, e condividerlo o copiarlo per utilizzarlo in altre applicazioni.",
        links: [
          {
            label: 'Vedi su Google Play',
            href: 'https://play.google.com/store/apps/details?id=it.mattianatali.metext&hl=it',
          },
          {
            label: 'Vedi su App Store',
            href: 'https://apps.apple.com/us/app/metext-text-scanner-ocr/id1510120975',
          },
        ],
      },
      {
        name: 'PriceMet (Dismesso)',
        description:
          "PriceMet è un'applicazione mobile che avvisa gli utenti quando i prezzi su Amazon scendono. Questa app aiuta gli utenti a risparmiare monitorando i prezzi dei prodotti e inviando notifiche quando gli articoli desiderati sono in offerta o diminuiscono di prezzo.",
        links: [
          {
            label: 'Visita il sito',
            href: 'https://pricemet.mattianatali.com/',
          },
        ],
      },
      {
        name: 'RandomMet 2',
        description:
          "RandomMet è un'app divertente per prendere decisioni che aiuta te e i tuoi amici a scegliere dove andare (bowling, bar, pub, cinema, ecc.) quando non riuscite a decidere. Funziona anche come \"Oracolo\" per dirti se la tua idea è buona o no, e può persino aiutarti a trovare un nuovo colore quando hai bisogno di ispirazione.",
        links: [
          {
            label: 'Vedi su Google Play',
            href: 'https://play.google.com/store/apps/details?id=it.mattianatali.randommetapp2&hl=it',
          },
        ],
      },
    ],
  },
  en: {
    intro:
      "Here you can find some of the projects I've been working on. These range from web applications to mobile apps designed to solve specific problems or provide useful services.",
    items: [
      {
        name: 'Fontanelle in Italia',
        description:
          'A web application that helps people find public drinking fountains in Italy. The app shows the location of each fountain on a map, making it easy for users to find clean drinking water while out and about.',
        links: [
          {
            label: 'Visit Website',
            href: 'https://fontanelle.mattianatali.com/',
          },
        ],
      },
      {
        name: 'Squizly',
        description:
          'Squizly is the simplest video compressor for macOS. This open-source desktop application makes it easy to compress and convert video files on Mac, available for both Intel and Apple Silicon processors.',
        links: [
          {
            label: 'View on GitHub',
            href: 'https://github.com/matitalatina/squizly',
          },
        ],
      },
      {
        name: 'GasLow',
        description:
          'GasLow is an application that helps users find the best fuel prices around them. The app provides real-time information about fuel prices from different gas stations, allowing users to save money on fuel costs. The data is sourced from the open data published by the "Ministero dello sviluppo economico" and is updated daily.',
        links: [
          {
            label: 'Visit Website',
            href: 'https://gaslow.mattianatali.it/',
          },
          {
            label: 'View on App Store',
            href: 'https://apps.apple.com/us/app/gaslow-prezzo-carburanti/id1510630580',
          },
          {
            label: 'View on Google Play',
            href: 'https://play.google.com/store/apps/details?id=it.mattianatali.gaslowapp&hl=it',
          },
        ],
      },
      {
        name: 'Metext | OCR',
        description:
          'Metext is an OCR (Optical Character Recognition) app that extracts text from images. Users can extract text from photos taken with their camera or images from their gallery. The app uses state-of-the-art OCR algorithms to provide accurate text recognition and allows users to select specific parts of the image, review and edit the extracted text, and share or copy it for use in other applications.',
        links: [
          {
            label: 'View on Google Play',
            href: 'https://play.google.com/store/apps/details?id=it.mattianatali.metext&hl=it',
          },
          {
            label: 'View on App Store',
            href: 'https://apps.apple.com/us/app/metext-text-scanner-ocr/id1510120975',
          },
        ],
      },
      {
        name: 'PriceMet (Discontinued)',
        description:
          'PriceMet is a mobile application that notifies users when prices on Amazon drop. This app helps users save money by monitoring product prices and sending notifications when desired items go on sale or decrease in price.',
        links: [
          {
            label: 'Visit Website',
            href: 'https://pricemet.mattianatali.com/',
          },
        ],
      },
      {
        name: 'RandomMet 2',
        description:
          'RandomMet is a fun decision-making app that helps you and your friends choose where to go (bowling, bar, pub, cinema, etc.) when you can\'t decide. It also works as an "Oracle" to tell you if your idea is good or not, and can even help you find a new color when you need inspiration.',
        links: [
          {
            label: 'View on Google Play',
            href: 'https://play.google.com/store/apps/details?id=it.mattianatali.randommetapp2&hl=it',
          },
        ],
      },
    ],
  },
};
