/* eslint-disable @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-var-requires */
const path = require('path');
const _ = require('lodash');

const LANGS = ['it', 'en'];

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Sometimes, optional fields tend to get not picked up by the GraphQL
  // interpreter if not a single content uses it. Therefore, we're putting them
  // through `createNodeField` so that the fields still exist and GraphQL won't
  // trip up. An empty string is still required in replacement to `null`.
  // eslint-disable-next-line default-case
  switch (node.internal.type) {
    case 'MarkdownRemark': {
      const { permalink, layout, primaryTag, translationKey } = node.frontmatter;
      const { relativePath } = getNode(node.parent);
      const localeMatch = relativePath.match(/^(it|en)\/(.+)$/);
      const lang = localeMatch ? localeMatch[1] : 'it';
      const contentPath = (localeMatch ? localeMatch[2] : relativePath).replace(/\.md$/, '');

      let slug = permalink;

      if (!slug) {
        slug = `/${lang}/${contentPath}/`;
      } else if (!slug.startsWith(`/${lang}/`)) {
        slug = `/${lang}${slug.startsWith('/') ? slug : `/${slug}`}`;
      }

      // Used to generate URL to view this content.
      createNodeField({
        node,
        name: 'slug',
        value: slug || '',
      });

      // Used to determine a page layout.
      createNodeField({
        node,
        name: 'layout',
        value: layout || '',
      });

      createNodeField({
        node,
        name: 'primaryTag',
        value: primaryTag || '',
      });

      createNodeField({
        node,
        name: 'lang',
        value: lang,
      });

      createNodeField({
        node,
        name: 'translationKey',
        value: translationKey || '',
      });
    }
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`{
  allMarkdownRemark(
    limit: 2000
    sort: {frontmatter: {date: ASC}}
    filter: {frontmatter: {draft: {ne: true}}}
  ) {
    edges {
      node {
        excerpt(format: PLAIN)
        timeToRead
        frontmatter {
          title
          tags
          date
          draft
          excerpt
          image {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
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
        fields {
          layout
          slug
          lang
          translationKey
        }
      }
    }
  }
  allTagYaml {
    edges {
      node {
        name
        lang
      }
    }
  }
  allAuthorYaml {
    edges {
      node {
        name
      }
    }
  }
}`);

  if (result.errors) {
    console.error(result.errors);
    throw new Error(result.errors);
  }

  const posts = result.data.allMarkdownRemark.edges;
  const postsByLang = { it: [], en: [] };
  const translations = {};

  posts.forEach(edge => {
    const lang = edge.node.fields.lang || 'it';
    postsByLang[lang].push(edge);

    const key = edge.node.fields.translationKey;
    if (key) {
      translations[key] = translations[key] || {};
      translations[key][lang] = edge.node.fields.slug;
    }
  });

  // Create paginated indexes
  // TODO: new pagination
  const postsPerPage = 1000;

  LANGS.forEach(lang => {
    const numPages = Math.max(1, Math.ceil(postsByLang[lang].length / postsPerPage));

    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/${lang}/` : `/${lang}/${i + 1}/`,
        component: path.resolve('./src/templates/index.tsx'),
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage: i + 1,
          lang,
        },
      });
    });
  });

  // Create post pages
  LANGS.forEach(lang => {
    const langPosts = postsByLang[lang];

    langPosts.forEach(({ node }, index) => {
      const { slug, layout } = node.fields;
      const prev = index === 0 ? null : langPosts[index - 1].node;
      const next = index === langPosts.length - 1 ? null : langPosts[index + 1].node;
      const translation = translations[node.fields.translationKey] || {};
      const translationPath = translation[lang === 'it' ? 'en' : 'it'] || null;

      createPage({
        path: slug,
        // This will automatically resolve the template to a corresponding
        // `layout` frontmatter in the Markdown.
        //
        // Feel free to set any `layout` as you'd like in the frontmatter, as
        // long as the corresponding template file exists in src/templates.
        // If no template is set, it will fall back to the default `post`
        // template.
        //
        // Note that the template has to exist first, or else the build will fail.
        component: path.resolve(`./src/templates/${layout || 'post'}.tsx`),
        context: {
          // Data passed to context is available in page queries as GraphQL variables.
          slug,
          prev,
          next,
          primaryTag: node.frontmatter.tags ? node.frontmatter.tags[0] : '',
          lang,
          translationPath,
        },
      });
    });
  });

  // Create tag pages
  const tagTemplate = path.resolve('./src/templates/tags.tsx');
  LANGS.forEach(lang => {
    const tags = _.uniq(
      _.flatten(
        postsByLang[lang].map(edge => {
          return _.castArray(_.get(edge, 'node.frontmatter.tags', []));
        }),
      ),
    );
    tags.forEach(tag => {
      createPage({
        path: `/${lang}/tags/${_.kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
          lang,
        },
      });
    });
  });

  // Create author pages
  const authorTemplate = path.resolve('./src/templates/author.tsx');
  LANGS.forEach(lang => {
    result.data.allAuthorYaml.edges.forEach(edge => {
      createPage({
        path: `/${lang}/author/${_.kebabCase(edge.node.name)}/`,
        component: authorTemplate,
        context: {
          author: edge.node.name,
          lang,
        },
      });
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  // adds sourcemaps for tsx in dev mode
  if (stage === 'develop' || stage === 'develop-html') {
    actions.setWebpackConfig({
      devtool: 'eval-source-map',
    });
  }
};
