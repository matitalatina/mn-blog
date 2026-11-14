import React from 'react';

import { css } from '@emotion/react';

import { Footer } from './Footer';
import SiteNav from './header/SiteNav';
import { PostFullContent } from './PostContent';
import { Wrapper } from './Wrapper';
import { getUi } from '../i18n/ui';
import type { Lang } from '../i18n/config';
import IndexLayout from '../layouts';
import {
  inner,
  outer,
  SiteArchiveHeader,
  SiteHeader,
  SiteMain,
  SiteNavMain,
} from '../styles/shared';
import { NoImage, PostFull, PostFullHeader, PostFullTitle } from '../templates/post';
import { colors } from '../styles/colors';

const PageTemplate = css`
  .site-main {
    margin-top: 64px;
    padding-bottom: 4vw;
    background: #fff;
  }

  @media (prefers-color-scheme: dark) {
    .site-main {
      background: ${colors.darkmode};
    }
  }
`;

const content: Record<Lang, string[]> = {
  it: [
    'Sono Mattia Natali, engineering manager e sviluppatore. Scrivo di sviluppo software, DevOps, produttività e tutto ciò che imparo lungo il percorso.',
    'Questo blog raccoglie i miei articoli tecnici in italiano e in inglese. Puoi cambiare lingua dal menu di navigazione.',
  ],
  en: [
    "I'm Mattia Natali, an engineering manager and developer. I write about software development, DevOps, productivity, and everything I learn along the way.",
    'This blog collects my technical articles in Italian and English. You can switch language from the navigation menu.',
  ],
};

interface AboutPageProps {
  lang: Lang;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const t = getUi(lang);

  return (
    <IndexLayout>
      <Wrapper css={PageTemplate}>
        <header className="site-archive-header no-image" css={[SiteHeader, SiteArchiveHeader]}>
          <div css={[outer, SiteNavMain]}>
            <div css={inner}>
              <SiteNav isHome={false} />
            </div>
          </div>
        </header>
        <main id="site-main" className="site-main" css={[SiteMain, outer]}>
          <div css={inner}>
            <article className="post page" css={[PostFull, NoImage]}>
              <PostFullHeader className="post-full-header">
                <PostFullTitle className="post-full-title">{t.aboutTitle}</PostFullTitle>
              </PostFullHeader>

              <PostFullContent className="post-full-content">
                <div className="post-content">
                  {content[lang].map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </PostFullContent>
            </article>
          </div>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};
