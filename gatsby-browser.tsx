import React from 'react';
import type { GatsbyBrowser } from 'gatsby';

import { LanguageProvider } from './src/i18n/LanguageProvider';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element, props }) => {
  const pathname = props.location?.pathname ?? props.path ?? '/';
  return <LanguageProvider pathname={pathname}>{element}</LanguageProvider>;
};
