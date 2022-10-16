import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';

const buttonStyle = { borderRadius: '5px' };
const gdprAnalyticsCookieKey = 'gdpr-analytics-enabled';
const onAccept = () => {
  [gdprAnalyticsCookieKey, 'gdpr-marketing-enabled']
    .forEach(key => Cookies.set(key, 'true', { expires: 365, path: '/' }));
  (window as any).trackGoogleAnalytics();
  (window as any).trackGoogleAds();
};

export const MyCookieConsent: React.FC = () => {
  return (
    <CookieConsent enableDeclineButton setDeclineCookie={false} cookieName={gdprAnalyticsCookieKey} buttonText="Va bene!" declineButtonText="Rifiuto" style={{ fontSize: '0.8em' }} buttonStyle={buttonStyle} declineButtonStyle={buttonStyle} onAccept={onAccept}>
      Vorrei utilizzare i seguenti servizi che richiedono i cookies:
      <ul>
        <li>Google Analytics: per sapere quante persone come te visitano il mio sito.</li>
        <li>Google Adsense: per mantere gratuito quello che stai leggendo.</li>
      </ul>
    </CookieConsent>
  );
};
