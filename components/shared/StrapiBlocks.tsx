import { Fragment } from 'react';

/**
 * Renders Strapi v4's "blocks" rich-text format into React nodes.
 *
 * Handles: paragraph, headings (h1–h6), bulleted/numbered lists, quote, code,
 * inline links, and text marks (bold/italic/underline/strikethrough/code).
 * Add new node types here as the editor uses them.
 */

type TextLeaf = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type LinkNode = {
  type: 'link';
  url: string;
  children: Node[];
};

type ListItemNode = {
  type: 'list-item';
  children: Node[];
};

type BlockNode =
  | { type: 'paragraph'; children: Node[] }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: Node[] }
  | { type: 'list'; format: 'ordered' | 'unordered'; children: ListItemNode[] }
  | { type: 'quote'; children: Node[] }
  | { type: 'code'; children: Node[] }
  | LinkNode
  | ListItemNode
  | TextLeaf;

type Node = BlockNode;

function renderLeaf(leaf: TextLeaf, key: string | number) {
  let node: React.ReactNode = leaf.text;
  if (leaf.code) node = <code>{node}</code>;
  if (leaf.bold) node = <strong>{node}</strong>;
  if (leaf.italic) node = <em>{node}</em>;
  if (leaf.underline) node = <u>{node}</u>;
  if (leaf.strikethrough) node = <s>{node}</s>;
  return <Fragment key={key}>{node}</Fragment>;
}

function renderChildren(children: Node[] | undefined): React.ReactNode {
  if (!children) return null;
  return children.map((child, i) => renderNode(child, i));
}

function renderNode(node: Node, key: string | number): React.ReactNode {
  if (!node || typeof node !== 'object') return null;

  switch (node.type) {
    case 'text':
      return renderLeaf(node, key);

    case 'paragraph':
      return <p key={key}>{renderChildren(node.children)}</p>;

    case 'heading': {
      const H = `h${node.level}` as keyof JSX.IntrinsicElements;
      return <H key={key}>{renderChildren(node.children)}</H>;
    }

    case 'list': {
      const Tag = node.format === 'ordered' ? 'ol' : 'ul';
      return <Tag key={key}>{renderChildren(node.children as Node[])}</Tag>;
    }

    case 'list-item':
      return <li key={key}>{renderChildren(node.children)}</li>;

    case 'quote':
      return <blockquote key={key}>{renderChildren(node.children)}</blockquote>;

    case 'code':
      return (
        <pre key={key}>
          <code>{renderChildren(node.children)}</code>
        </pre>
      );

    case 'link':
      return (
        <a key={key} href={node.url} target="_blank" rel="noopener noreferrer">
          {renderChildren(node.children)}
        </a>
      );

    default:
      // Unknown block — fall back to rendering children if present so we
      // don't drop content silently when Strapi adds a new block type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <Fragment key={key}>{renderChildren((node as any).children)}</Fragment>;
  }
}

export function StrapiBlocks({ blocks }: { blocks: unknown }) {
  if (!Array.isArray(blocks)) return null;
  return <>{(blocks as Node[]).map((b, i) => renderNode(b, i))}</>;
}
