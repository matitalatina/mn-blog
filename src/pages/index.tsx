import React, { useEffect } from 'react';

import { SiteHead } from '../components/SiteHead';

const RootRedirect = () => {
  useEffect(() => {
    const language = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
    window.location.replace(language.startsWith('en') ? '/en/' : '/it/');
  }, []);

  return (
    <>
      <SiteHead>
        <title>Mattia Natali</title>
        <meta name="robots" content="noindex" />
        <link rel="alternate" hrefLang="it" href="https://www.mattianatali.it/it/" />
        <link rel="alternate" hrefLang="en" href="https://www.mattianatali.it/en/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.mattianatali.it/it/" />
      </SiteHead>
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <a href="/it/">Italiano</a> · <a href="/en/">English</a>
      </div>
    </>
  );
};

export default RootRedirect;
