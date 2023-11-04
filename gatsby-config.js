/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  flags: {
    DEV_SSR: true,
  },
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
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => allMarkdownRemark.edges.map(edge => ({
              ...edge.node.frontmatter,
              description: edge.node.excerpt,
              date: edge.node.frontmatter.date,
              url: `${site.siteMetadata.siteUrl}${edge.node.fields.slug}`,
              guid: `${site.siteMetadata.siteUrl}${edge.node.fields.slug}`,
              custom_elements: [{ 'content:encoded': edge.node.html }],
            })),
            query: `{
  allMarkdownRemark(
    filter: {frontmatter: {draft: {ne: true}}}
    sort: {frontmatter: {date: DESC}}
  ) {
    edges {
      node {
        excerpt
        html
        fields {
          slug
        }
        frontmatter {
          title
          date
        }
      }
    }
  }
}`,
            output: '/rss.xml',
            title: 'Blog di Mattia Natali',
            match: '^/blog/',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [require('postcss-color-function'), require('cssnano')()],
      },
    },
  ],
};
