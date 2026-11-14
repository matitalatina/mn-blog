import React from 'react';

import { useI18n } from '../../i18n/LanguageProvider';
import { SubscribeForm } from './SubscribeForm';
import { Hero } from '../ui/hero/Hero';
import { HeroTitle } from '../ui/hero/HeroTitle';

export interface SubscribeProps {
  title: string;
}

export const Subscribe: React.FC<SubscribeProps> = () => {
  const { t } = useI18n();
  return (
    <SubscribeFormSection>
      <SubscribeFormTitle css={SubscribeFormTitle}>{t.subscribeTitle}</SubscribeFormTitle>
      <p>{t.subscribeDescription}</p>
      <SubscribeForm />
    </SubscribeFormSection>
  );
};

const SubscribeFormSection = Hero;

const SubscribeFormTitle = HeroTitle;
