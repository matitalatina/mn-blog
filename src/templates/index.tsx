import { graphql } from 'gatsby';
import { getSrc, IGatsbyImageData } from "gatsby-plugin-image";
import React from 'react';

import { css } from '@emotion/react';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import Pagination from '../components/Pagination';
import { PostCard } from '../components/PostCard';
import { SiteHead } from '../components/SiteHead';
import { Wrapper } from '../components/Wrapper';
import { useI18n } from '../i18n/LanguageProvider';
import { getUi } from '../i18n/ui';
import type { Lang } from '../i18n/config';
import IndexLayout from '../layouts';
import {
  inner,
  outer,
  PostFeed,
  Posts,
  SiteDescription,
  SiteHeader,
  SiteHeaderContent,
  SiteMain,
  SiteTitle,
  SiteHeaderDim,
  SiteHeaderStyles,
} from '../styles/shared';
import config from '../website-config';
import { PageContext } from './post';

export interface IndexProps {
  children: React.ReactNode;
  pageContext: {
    currentPage: number;
    numPages: number;
    lang: Lang;
  };
  data: {
    logo: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };
    header: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };
    allMarkdownRemark: {
      edges: Array<{
        node: PageContext;
      }>;
    };
  };
}

const IndexPage: React.FC<IndexProps> = props => {
  const { t } = useI18n();
  return (
    <IndexLayout css={HomePosts}>
      <Wrapper>
        <div
          css={[outer, SiteHeader, SiteHeaderStyles]}
          className="site-header-background"
          style={{
            backgroundImage: `url('${getSrc(props.data.header.childImageSharp.gatsbyImageData)}')`,
          }}
        >
          <div css={SiteHeaderDim} />
          <div css={inner}>
            <SiteNav isHome />
            <SiteHeaderContent className="site-header-conent">
              <SiteTitle className="site-title">
                {props.data.logo ? (
                  <img
                    style={{ maxHeight: '55px' }}
                    src={getSrc(props.data.logo.childImageSharp.gatsbyImageData)}
                    alt={config.title}
                  />
                ) : (
                  config.title
                )}
              </SiteTitle>
              <SiteDescription>{t.siteDescription}</SiteDescription>
            </SiteHeaderContent>
          </div>
        </div>
        <main id="site-main" css={[SiteMain, outer]}>
          <div css={[inner, Posts]}>
            <div css={[PostFeed]}>
              {props.data.allMarkdownRemark.edges.map((post, index) => {
                // filter out drafts in production
                return (
                  (post.node.frontmatter.draft !== true ||
                    process.env.NODE_ENV !== 'production') && (
                    <PostCard key={post.node.fields.slug} post={post.node} large={index === 0} />
                  )
                );
              })}
            </div>
          </div>
        </main>
        {props.children}
        {props.pageContext.numPages > 1 && (
          <Pagination
            currentPage={props.pageContext.currentPage}
            numPages={props.pageContext.numPages}
          />
        )}
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

export const Head = ({
  data,
  pageContext,
}: {
  data: IndexProps['data'];
  pageContext: IndexProps['pageContext'];
}) => {
  const headerImage = data.header.childImageSharp.gatsbyImageData;
  const { width, height } = headerImage;
  const headerSrc = getSrc(headerImage);
  const t = getUi(pageContext.lang);
  const pageUrl = `${config.siteUrl}/${pageContext.lang}/`;

  return (
    <SiteHead>
      <title>{config.title}</title>
      <meta name="description" content={t.siteDescription} />
      <meta property="og:site_name" content={config.title} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={t.siteDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={`${config.siteUrl}${headerSrc}`} />
      <link rel="alternate" hrefLang="it" href={`${config.siteUrl}/it/`} />
      <link rel="alternate" hrefLang="en" href={`${config.siteUrl}/en/`} />
      <link rel="alternate" hrefLang="x-default" href={`${config.siteUrl}/it/`} />
      {config.facebook && <meta property="article:publisher" content={config.facebook} />}
      {config.googleSiteVerification && (
        <meta name="google-site-verification" content={config.googleSiteVerification} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={t.siteDescription} />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:image" content={`${config.siteUrl}${headerSrc}`} />
      {config.twitter && (
        <meta
          name="twitter:site"
          content={`@${config.twitter.split('https://twitter.com/')[1]}`}
        />
      )}
      <meta property="og:image:width" content={width.toString()} />
      <meta property="og:image:height" content={height.toString()} />
    </SiteHead>
  );
};

export const pageQuery = graphql`query blogPageQuery($skip: Int!, $limit: Int!, $lang: String!) {
  logo: file(relativePath: {eq: "img/ghost-logo.png"}) {
    childImageSharp {
      gatsbyImageData(layout: FIXED)
    }
  }
  header: file(relativePath: {eq: "img/blog-cover.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 2000, quality: 100, layout: FIXED)
    }
  }
  allMarkdownRemark(
    sort: {frontmatter: {date: DESC}}
    filter: {fields: {lang: {eq: $lang}}, frontmatter: {draft: {ne: true}}}
    limit: $limit
    skip: $skip
  ) {
    edges {
      node {
        frontmatter {
          title
          date
          tags
          draft
          excerpt
          image {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
            }
          }
          author {
            name
            bio
            avatar {
              children {
                ... on ImageSharp {
                  gatsbyImageData(layout: FULL_WIDTH, breakpoints: [40, 80, 120])
                }
              }
            }
          }
        }
        excerpt(format: PLAIN)
        timeToRead
        fields {
          layout
          slug
          lang
        }
      }
    }
  }
}`;

const HomePosts = css`
  @media (min-width: 795px) {
    .post-card-large {
      flex: 1 1 100%;
      flex-direction: row;
      padding-bottom: 40px;
      min-height: 280px;
      border-top: 0;
    }

    .post-card-large .post-card-title {
      margin-top: 0;
      font-size: 3.2rem;
    }

    .post-card-large:not(.no-image) .post-card-header {
      margin-top: 0;
    }

    .post-card-large .post-card-image-link {
      position: relative;
      flex: 1 1 auto;
      margin-bottom: 0;
      min-height: 380px;
    }

    .post-card-large .post-card-image {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .post-card-large .post-card-content {
      flex: 0 1 361px;
      justify-content: center;
    }

    .post-card-large .post-card-title {
      margin-top: 0;
      font-size: 3.2rem;
    }

    .post-card-large .post-card-content-link {
      padding: 0 0 0 40px;
    }

    .post-card-large .post-card-meta {
      padding: 0 0 0 40px;
    }

    .post-card-large .post-card-excerpt p {
      margin-bottom: 1.5em;
      font-size: 1.8rem;
      line-height: 1.5em;
    }
  }
`;

export default IndexPage;
