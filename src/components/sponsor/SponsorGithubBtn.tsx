import React from 'react';
import { useI18n } from '../../i18n/LanguageProvider';
import styled from '@emotion/styled';
import { btnColor, ButtonLink } from '../ui/Button';
import { colors } from '../../styles/colors';

export const SponsorGithubBtn: React.FC<{className?: string}> = ({ className }) => {
  const { t } = useI18n();
  return (<ButtonFlex className={className} href="https://github.com/sponsors/matitalatina" target="_blank">{t.becomeSponsor}</ButtonFlex>);
};

const ButtonFlex = styled(ButtonLink)`
  ${btnColor(colors.pink)}
`;
