import React from 'react';

import { AboutPage } from '../../components/AboutPage';
import { SiteHead } from '../../components/SiteHead';
import { getUi } from '../../i18n/ui';

export const Head = () => (
  <SiteHead>
    <title>{getUi('it').aboutHeadTitle}</title>
    <link rel="alternate" hrefLang="it" href="https://www.mattianatali.it/it/about/" />
    <link rel="alternate" hrefLang="en" href="https://www.mattianatali.it/en/about/" />
    <link rel="alternate" hrefLang="x-default" href="https://www.mattianatali.it/it/about/" />
  </SiteHead>
);

const About = () => <AboutPage lang="it" />;

export default About;
