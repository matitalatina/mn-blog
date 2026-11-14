import { Link } from 'gatsby';
import { darken } from 'polished';
import React, { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { useI18n } from '../../i18n/LanguageProvider';
import { colors } from '../../styles/colors';
import { SocialLink } from '../../styles/shared';
import config from '../../website-config';
import { Facebook } from '../icons/facebook';
import GitHub from '../icons/github';
import LinkedIn from '../icons/linkedin';
import { Twitter } from '../icons/twitter';
import { SubscribeModal, SubscribeModalHandle } from '../subscribe/SubscribeModal';
import { SiteNavLogo } from './SiteNavLogo';

interface SiteNavProps {
  isHome?: boolean;
  isPost?: boolean;
  post?: { title?: string };
  translationPath?: string | null;
}

const SiteNav: React.FC<SiteNavProps> = ({
  isHome = false,
  isPost = false,
  post = {},
  translationPath,
}) => {
  const { t, path, switchPath } = useI18n();
  const [showTitle, setShowTitle] = useState(false);
  const subscribe = useRef<SubscribeModalHandle>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isPost) {
      return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      if (!titleRef.current) {
        return;
      }

      lastScrollY = window.scrollY;
      const trigger = titleRef.current.getBoundingClientRect().top;
      const triggerOffset = titleRef.current.offsetHeight + 35;
      setShowTitle(lastScrollY >= trigger + triggerOffset);
      ticking = false;
    };

    const onScroll = () => {
      if (!titleRef.current) {
        return;
      }
      if (!ticking) {
        requestAnimationFrame(update);
      }
      ticking = true;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isPost]);

  const openModal = () => {
    subscribe.current?.open();
  };

  return (
    <>
      {config.showSubscribe && <SubscribeModal ref={subscribe} />}
      <nav css={SiteNavStyles}>
        <SiteNavLeft className="site-nav-left">
          {!isHome && <SiteNavLogo />}
          <SiteNavContent css={showTitle ? HideNav : ''}>
            <ul css={NavStyles} role="menu">
              {/* TODO: mark current nav item - add class nav-current */}
              <li key="home" role="menuitem">
                <Link to={path('/')}>{t.navHome}</Link>
              </li>
              <li key="projects" role="menuitem">
                <Link to={path('/projects')}>{t.navProjects}</Link>
              </li>
              <li key="dev" role="menuitem">
                <Link to={path('/tags/dev/')}>{t.navDev}</Link>
              </li>
              <li key="how-to" role="menuitem">
                <Link to={path('/tags/how-to/')}>{t.navHowTo}</Link>
              </li>
              <li key="slides" role="menuitem">
                <a href="https://slides.mattianatali.dev" target="_blank" rel="noreferrer">
                  {t.navSlides}
                </a>
              </li>
              <li key="language" role="menuitem">
                <Link to={translationPath || switchPath}>{t.languageName}</Link>
              </li>
            </ul>
            {isPost && (
              <NavPostTitle ref={titleRef} className="nav-post-title">
                {post.title}
              </NavPostTitle>
            )}
          </SiteNavContent>
        </SiteNavLeft>
        <SiteNavRight>
          <SocialLinks>
            {config.linkedin && (
              <a
                css={SocialLink}
                href={config.linkedin}
                target="_blank"
                title="LinkedIn"
                rel="noopener noreferrer"
              >
                <LinkedIn />
              </a>
            )}
            {config.github && (
              <a
                css={SocialLink}
                href={config.github}
                target="_blank"
                title="GitHub"
                rel="noopener noreferrer"
              >
                <GitHub />
              </a>
            )}
            {config.facebook && (
              <a
                css={SocialLink}
                href={config.facebook}
                target="_blank"
                title="Facebook"
                rel="noopener noreferrer"
              >
                <Facebook />
              </a>
            )}
            {config.twitter && (
              <a
                css={SocialLink}
                href={config.twitter}
                title="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </a>
            )}
          </SocialLinks>
          {config.showSubscribe && (
            <SubscribeButton onClick={openModal}>{t.navFollow}</SubscribeButton>
          )}
        </SiteNavRight>
      </nav>
    </>
  );
};

export const SiteNavMain = css`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  /* background: color(var(--darkgrey) l(-5%)) */
  background: ${darken('0.05', colors.darkgrey)};

  @media (max-width: 700px) {
    padding-right: 0;
    padding-left: 0;
  }
`;

const SiteNavStyles = css`
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow-y: hidden;
  height: 64px;
  font-size: 1.3rem;
`;

const SiteNavLeft = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  margin-right: 10px;
  padding: 10px 0 80px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  white-space: nowrap;

  -ms-overflow-scrolling: touch;

  @media (max-width: 700px) {
    margin-right: 0;
    padding-left: 5vw;
  }
`;

const SiteNavContent = styled.div`
  position: relative;
  align-self: flex-start;
`;

const NavStyles = css`
  position: absolute;
  z-index: 1000;
  display: flex;
  margin: 0 0 0 -12px;
  padding: 0;
  list-style: none;
  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);

  li {
    display: block;
    margin: 0;
    padding: 0;
  }

  li a {
    position: relative;
    display: block;
    padding: 12px 12px;
    color: #fff;
    opacity: 0.8;
    transition: opacity 0.35s ease-in-out;
  }

  li a:hover {
    text-decoration: none;
    opacity: 1;
  }

  li a:before {
    content: '';
    position: absolute;
    right: 100%;
    bottom: 8px;
    left: 12px;
    height: 1px;
    background: #fff;
    opacity: 0.25;
    transition: all 0.35s ease-in-out;
  }

  li a:hover:before {
    right: 12px;
    opacity: 0.5;
  }
`;

const SiteNavRight = styled.div`
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 0;
  height: 64px;

  @media (max-width: 700px) {
    display: none;
  }
`;

const SocialLinks = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const SubscribeButton = styled.a`
  display: block;
  padding: 4px 10px;
  margin: 0 0 0 10px;
  border: #fff 1px solid;
  color: #fff;
  line-height: 1em;
  border-radius: 10px;
  opacity: 0.8;

  :hover {
    text-decoration: none;
    opacity: 1;
    cursor: pointer;
  }
`;

const NavPostTitle = styled.span`
  visibility: hidden;
  position: absolute;
  top: 9px;
  color: #fff;
  font-size: 1.7rem;
  font-weight: 400;
  text-transform: none;
  opacity: 0;
  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateY(175%);

  .dash {
    left: -25px;
  }

  .dash:before {
    content: '– ';
    opacity: 0.5;
  }
`;

const HideNav = css`
  ul {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-175%);
  }
  .nav-post-title {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`;

export default SiteNav;
