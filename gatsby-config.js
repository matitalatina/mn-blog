/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Mattia Natali',
    description: 'Il mio blog personale',
    siteUrl: 'https://www.mattianatali.it', // full path to blog - no ending slash
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': 'AuthorYaml.name',
  },
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaultQuality: 90,
        stripMetadata: true,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: path.join(__dirname, 'src', 'content'),
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem; width: 100%;',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 2000,
              quality: 90,
              backgroundColor: 'none',
            },
          },
        ],
      },
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://www.mattianatali.it',
      },
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-emotion',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [require('postcss-color-function'), require('cssnano')()],
      },
    },
    {
      resolve: 'gatsby-plugin-gdpr-tracking',
      options: {
        // logging to the console, if debug is true
        debug: false,
        googleAnalytics: {
          // The property ID; the tracking code won't be generated without it.
          trackingId: 'UA-81893752-1',
          // Defines it google analytics should be started with out the cookie consent
          autoStart: false, // <--- default
          // Setting this parameter is optional
          anonymize: true, // <--- default
          // Name of the cookie, that enables the tracking if it is true
          controlCookieName: 'gdpr-analytics-enabled', // <--- default
          cookieFlags: 'secure;samesite=none', // <--- default
        },
        googleAds: {
          // The property ID; the tracking code won't be generated without it.
          trackingId: 'ca-pub-7145772846945296',
          // Setting this parameter is optional
          anonymize: true, // <--- default
          // Name of the cookie, that enables the tracking if it is true
          controlCookieName: 'gdpr-marketing-enabled', // <--- default
          cookieFlags: 'secure;samesite=none', // <--- default
        },
        // Defines the environments where the tracking should be available  - default is ["production"]
        environments: ['production', 'development'],
      },
    },
  ],
};
