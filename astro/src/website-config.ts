export interface WebsiteConfig {
  title: string;
  description: string;
  coverImage?: string;
  logo: string;
  lang: string;
  siteUrl: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  showSubscribe: boolean;
  mailchimpAction?: string;
  mailchimpName?: string;
  mailchimpEmailFieldName?: string;
  googleSiteVerification?: string;
  footer?: string;
}

const config: WebsiteConfig = {
  title: 'Mattia Natali',
  description: '',
  coverImage: 'img/blog-cover.jpg',
  logo: 'img/ghost-logo.png',
  lang: 'it',
  siteUrl: 'https://www.mattianatali.it',
  facebook: 'https://www.facebook.com/mattianatali.dev/',
  twitter: 'https://twitter.com/matitalatina',
  linkedin: 'https://www.linkedin.com/in/mattian/',
  github: 'https://github.com/matitalatina/',
  showSubscribe: true,
  mailchimpAction:
    'https://gmail.us4.list-manage.com/subscribe/post?u=a8dbd77c4662328d660883c64&amp;id=31345af945',
  mailchimpName: 'b_a8dbd77c4662328d660883c64_31345af945',
  mailchimpEmailFieldName: 'EMAIL',
  googleSiteVerification: 'GoogleCode',
  footer: '',
};

export default config;
