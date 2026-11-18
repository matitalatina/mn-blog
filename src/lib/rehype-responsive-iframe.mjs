import { visit } from 'unist-util-visit';

const isWrapper = node =>
  node &&
  node.type === 'element' &&
  node.tagName === 'div' &&
  Array.isArray(node.properties?.className) &&
  node.properties.className.includes('gatsby-resp-iframe-wrapper');

export default function rehypeResponsiveIframe() {
  return tree => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'iframe' || !parent || index === undefined || isWrapper(parent)) {
        return;
      }

      const properties = node.properties || {};
      const width = Number(properties.width) || 0;
      const height = Number(properties.height) || 0;
      const ratio = width > 0 && height > 0 ? (height / width) * 100 : 56.25;

      delete properties.width;
      delete properties.height;
      properties.style = 'position:absolute;top:0;left:0;width:100%;height:100%';

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['gatsby-resp-iframe-wrapper'],
          style: `padding-bottom:${ratio}%;position:relative;height:0;overflow:hidden;margin-bottom:1rem;width:100%`,
        },
        children: [node],
      };
    });
  };
}
