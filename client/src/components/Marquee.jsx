import { marquee } from '../data/site.js';
import './Marquee.css';

/* Decorative band of tools. The list is duplicated so the loop is seamless. */
export default function Marquee() {
  const row = [...marquee, ...marquee];

  return (
    <section className="marquee on-dark" aria-label="Tools and tech I use">
      <div className="mq-track">
        {row.map((item, i) => (
          <span className="mq-chip" key={`${item}-${i}`} aria-hidden={i >= marquee.length}>
            <span className="mq-dot" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
