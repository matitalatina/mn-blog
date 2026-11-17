import { visit } from 'unist-util-visit';

export default function rehypeResponsiveImages() {
  return tree => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'img') return;
      const width = Number(node.properties?.width);
      if (!Number.isFinite(width) || width <= 0) return;
      node.properties = {
        ...node.properties,
        style: `max-width:${width}px`,
      };
    });
  };
}
