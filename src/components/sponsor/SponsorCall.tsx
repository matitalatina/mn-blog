import { BuyBeerButton } from './BuyBeerBtn';

import React from 'react';
import { useI18n } from '../../i18n/LanguageProvider';
import { Hero } from '../ui/hero/Hero';
import { HeroTitle } from '../ui/hero/HeroTitle';
import { SponsorGithubBtn } from './SponsorGithubBtn';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const boxCss = css`
  /* flex: 0 1; */
  margin: 5px;
`;

export const SponsorCall: React.FC = () => {
  const { t } = useI18n();
  return (
    <Hero>
      <HeroTitle>{t.sponsorTitle}</HeroTitle>
      <p>{t.sponsorDescription}</p>
      <BtnGroup>
        <BuyBeerButton css={boxCss} />
        <SponsorGithubBtn css={boxCss} />
      </BtnGroup>
    </Hero>
  );
};

const BtnGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
