import React from 'react';
import type { GatsbySSR } from 'gatsby';

import { LanguageProvider } from './src/i18n/LanguageProvider';
import { getLangFromPath } from './src/i18n/config';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ pathname, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: getLangFromPath(pathname) });
};

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({ element, props }) => {
  const pathname = props.location?.pathname ?? props.path ?? '/';
  return <LanguageProvider pathname={pathname}>{element}</LanguageProvider>;
};
