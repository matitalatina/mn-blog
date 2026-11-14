import type { Lang } from './config';

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
