import React from 'react';
import { useI18n } from '../../i18n/LanguageProvider';
import { ButtonLink } from '../ui/Button';

export const BuyBeerButton: React.FC<{className?: string}> = ({ className }) => {
  const { t } = useI18n();
  return (<ButtonLink className={className} href="https://www.buymeacoffee.com/mattianatali" target="_blank">{t.buyCoffee}</ButtonLink>);
};
