import { visit } from 'unist-util-visit';

function getClasses(node) {
  const className = node.properties?.className;
  if (Array.isArray(className)) return className;
  if (typeof className === 'string') return className.split(/\s+/).filter(Boolean);
  return [];
}

function addClass(node, name) {
  const classes = getClasses(node);
  if (classes.includes(name)) return;
  node.properties = { ...node.properties, className: [...classes, name] };
}

function languageOf(code) {
  const languageClass = getClasses(code).find((name) => name.startsWith('language-'));
  return languageClass ? languageClass.slice('language-'.length) : 'text';
}

export default function rehypeGatsbyHighlight() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return;
      if (
        node.tagName === 'span' &&
        getClasses(node).includes('code-line')
      ) {
        parent.children.splice(index, 1, ...node.children);
        return index + node.children.length;
      }
      if (node.tagName === 'code') {
        const classes = getClasses(node).filter(name => name !== 'code-highlight');
        node.properties = { ...node.properties, className: classes };
      }
    });

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null || node.tagName !== 'pre') return;
      const code = node.children.find(
        (child) => child.type === 'element' && child.tagName === 'code'
      );
      if (!code) return;

      const language = languageOf(code);
      addClass(node, `language-${language}`);
      addClass(code, `language-${language}`);

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['gatsby-highlight'],
          'data-language': language,
        },
        children: [node],
      };

      return 'skip';
    });

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return;
      if (node.tagName === 'code' && parent.tagName !== 'pre') {
        addClass(node, 'language-text');
      }
    });
  };
}
