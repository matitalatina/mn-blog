import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { PostFullContent } from '../components/PostContent';
import { SiteHead } from '../components/SiteHead';
import { Wrapper } from '../components/Wrapper';
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

  /* Higher specificity to override PostFullContent styles */
  .post-full-content & {
    box-shadow: none;
  }

  &:hover {
    color: #fff;
    background: ${colors.primary};
    text-decoration: none;
    box-shadow: none;
  }

  /* Higher specificity for hover state to override PostFullContent styles */
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

export const Head = () => (
  <SiteHead>
    <title>I miei progetti - Mattia Natali</title>
  </SiteHead>
);

const Projects: React.FC = () => (
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
            <PostFullHeader className="post-full-header" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
              <PostFullTitle className="post-full-title">I miei progetti</PostFullTitle>
            </PostFullHeader>

            <PostFullContent className="post-full-content">
              <div className="post-content">
                <p>
                  Qui puoi trovare alcuni dei progetti su cui ho lavorato. Spaziano da applicazioni
                  web ad app mobile pensate per risolvere problemi specifici o fornire servizi
                  utili.
                </p>

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={fontanelleImage} alt="Fontanelle in Italia" />
                    <ProjectInfo>
                      <ProjectTitle>Fontanelle in Italia</ProjectTitle>
                      <ProjectDescription>
                        Un&apos;applicazione web che aiuta le persone a trovare le fontanelle
                        pubbliche in Italia. L&apos;app mostra la posizione di ogni fontanella su una
                        mappa, rendendo facile per gli utenti trovare acqua potabile di qualità
                        mentre sono in giro.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://fontanelle.mattianatali.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visita il sito
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={squizlyImage} alt="Squizly" />
                    <ProjectInfo>
                      <ProjectTitle>Squizly</ProjectTitle>
                      <ProjectDescription>
                        Squizly è il compressore video più semplice per macOS. Questa applicazione
                        desktop open-source rende facile comprimere e convertire file video su Mac,
                        disponibile sia per processori Intel che Apple Silicon.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://github.com/matitalatina/squizly"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vedi su GitHub
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={gaslowImage} alt="GasLow" />
                    <ProjectInfo>
                      <ProjectTitle>GasLow</ProjectTitle>
                      <ProjectDescription>
                        GasLow è un&apos;applicazione che aiuta gli utenti a trovare i migliori
                        prezzi del carburante nelle vicinanze. L&apos;app fornisce informazioni in
                        tempo reale sui prezzi dei carburanti delle diverse stazioni di servizio,
                        permettendo agli utenti di risparmiare sui costi del carburante. I dati
                        provengono dagli open data pubblicati dal &quot;Ministero dello sviluppo
                        economico&quot; e vengono aggiornati quotidianamente.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://gaslow.mattianatali.it/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visita il sito
                        </ProjectLink>
                        <ProjectLink
                          href="https://apps.apple.com/us/app/gaslow-prezzo-carburanti/id1510630580"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vedi su App Store
                        </ProjectLink>
                        <ProjectLink
                          href="https://play.google.com/store/apps/details?id=it.mattianatali.gaslowapp&hl=it"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vedi su Google Play
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={metextImage} alt="Metext | OCR" />
                    <ProjectInfo>
                      <ProjectTitle>Metext | OCR</ProjectTitle>
                      <ProjectDescription>
                        Metext è un&apos;app OCR (Optical Character Recognition) che estrae il testo
                        dalle immagini. Gli utenti possono estrarre testo da foto scattate con la
                        fotocamera o da immagini nella galleria. L&apos;app utilizza algoritmi OCR
                        all&apos;avanguardia per fornire un riconoscimento del testo accurato e
                        permette agli utenti di selezionare parti specifiche dell&apos;immagine,
                        rivedere e modificare il testo estratto, e condividerlo o copiarlo per
                        utilizzarlo in altre applicazioni.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://play.google.com/store/apps/details?id=it.mattianatali.metext&hl=it"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vedi su Google Play
                        </ProjectLink>
                        <ProjectLink
                          href="https://apps.apple.com/us/app/metext-text-scanner-ocr/id1510120975"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vedi su App Store
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={pricemetImage} alt="PriceMet" />
                    <ProjectInfo>
                      <ProjectTitle>PriceMet (Dismesso)</ProjectTitle>
                      <ProjectDescription>
                        PriceMet è un&apos;applicazione mobile che avvisa gli utenti quando i prezzi
                        su Amazon scendono. Questa app aiuta gli utenti a risparmiare monitorando i
                        prezzi dei prodotti e inviando notifiche quando gli articoli desiderati sono
                        in offerta o diminuiscono di prezzo.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://pricemet.mattianatali.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visita il sito
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={randommetImage} alt="RandomMet 2" />
                    <ProjectInfo>
                      <ProjectTitle>RandomMet 2</ProjectTitle>
                      <ProjectDescription>
                        RandomMet è un&apos;app divertente per prendere decisioni che aiuta te e i
                        tuoi amici a scegliere dove andare (bowling, bar, pub, cinema, ecc.) quando
                        non riuscite a decidere. Funziona anche come &quot;Oracolo&quot; per dirti se
                        la tua idea è buona o no, e può persino aiutarti a trovare un nuovo colore
                        quando hai bisogno di ispirazione.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://play.google.com/store/apps/details?id=it.mattianatali.randommetapp2&hl=it"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vedi su Google Play
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>
              </div>
            </PostFullContent>
          </article>
        </div>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default Projects;
