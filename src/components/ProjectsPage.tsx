import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Footer } from './Footer';
import SiteNav from './header/SiteNav';
import { PostFullContent } from './PostContent';
import { Wrapper } from './Wrapper';
import { getUi } from '../i18n/ui';
import { projectsByLang } from '../i18n/projects';
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

import fontanelleImage from '../images/projects/fontanelle.jpg';
import gaslowImage from '../images/projects/gaslow.png';
import pricemetImage from '../images/projects/pricemet.png';
import metextImage from '../images/projects/metext.png';
import randommetImage from '../images/projects/randommet.png';
import squizlyImage from '../images/projects/squizly.gif';

const projectImages = [
  { alt: 'Fontanelle in Italia', src: fontanelleImage },
  { alt: 'Squizly', src: squizlyImage },
  { alt: 'GasLow', src: gaslowImage },
  { alt: 'Metext | OCR', src: metextImage },
  { alt: 'PriceMet', src: pricemetImage },
  { alt: 'RandomMet 2', src: randommetImage },
];

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

const ProjectItemContainer = styled.div`
  margin-bottom: 1vw;
`;

const ProjectContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1170px) {
    flex-direction: column;
  }
`;

const ProjectImage = styled.img`
  width: 240px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 1170px) {
    width: 180px;
    margin-bottom: 1rem;
  }
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h2`
  margin: 0 0 0.8em;
  font-size: 3.2rem;
  font-weight: 700;
  color: ${colors.primary};

  @media (max-width: 500px) {
    font-size: 2.6rem;
  }
`;

const ProjectDescription = styled.p`
  margin: 0 0 1.5em;
  font-size: 1.8rem;
  line-height: 1.6em;
`;

const ProjectLink = styled.a`
  display: inline-block;
  padding: 0.5em 1.2em;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  font-size: 1.6rem;
  line-height: 1.6em;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.2s ease;
  box-shadow: none;
  margin: 0 0.5em 0.5em 0;

  .post-full-content & {
    box-shadow: none;
  }

  &:hover {
    color: #fff;
    background: ${colors.primary};
    text-decoration: none;
    box-shadow: none;
  }

  .post-full-content &:hover {
    color: #fff;
    box-shadow: none;
  }
`;

const ProjectLinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5em;
`;

const Divider = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  margin: 4vw 0;
  background: #e5eff5;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface ProjectsPageProps {
  lang: Lang;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ lang }) => {
  const t = getUi(lang);
  const content = projectsByLang[lang];

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
              <PostFullHeader
                className="post-full-header"
                style={{ paddingTop: '4rem', paddingBottom: '4rem' }}
              >
                <PostFullTitle className="post-full-title">{t.projectsTitle}</PostFullTitle>
              </PostFullHeader>

              <PostFullContent className="post-full-content">
                <div className="post-content">
                  <p>{content.intro}</p>

                  {content.items.map((project, index) => (
                    <React.Fragment key={project.name}>
                      {index > 0 && <Divider />}
                      <ProjectItemContainer>
                        <ProjectContent>
                          <ProjectImage
                            src={projectImages[index].src}
                            alt={projectImages[index].alt}
                          />
                          <ProjectInfo>
                            <ProjectTitle>{project.name}</ProjectTitle>
                            <ProjectDescription>{project.description}</ProjectDescription>
                            <ProjectLinksContainer>
                              {project.links.map(link => (
                                <ProjectLink
                                  key={link.href}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {link.label}
                                </ProjectLink>
                              ))}
                            </ProjectLinksContainer>
                          </ProjectInfo>
                        </ProjectContent>
                      </ProjectItemContainer>
                    </React.Fragment>
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
