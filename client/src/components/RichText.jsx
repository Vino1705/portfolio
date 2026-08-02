import { Fragment } from 'react';

/* Renders the tiny bit of markdown the content data uses: **bold**. */
export default function RichText({ text, as: Tag = 'span', ...rest }) {
  const parts = String(text).split(/\*\*(.+?)\*\*/g);
  return (
    <Tag {...rest}>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>
      )}
    </Tag>
  );
}
