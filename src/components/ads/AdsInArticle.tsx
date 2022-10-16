import React from 'react';
import Cookies from 'js-cookie';
import { gdprAdsCookieKey } from '../gdpr/MyCookieConsent';

export const AdsInArticle = () => {
  if (!Cookies.get(gdprAdsCookieKey)) {
    return null;
  }

  return (
    <>
      <script
        async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7145772846945296"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', paddingTop: '80px' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-7145772846945296"
        data-ad-slot="8363941371"
      />
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </>
  );
};
