import { useEffect, useState } from 'react';

import { skillGlyph, ArrowLeftIcon, ArrowRightIcon } from './Icons.jsx';
import { skillGroups } from '../data/site.js';
import './Skills.css';

const AUTO_FLIP_MS = 7000;

function SkillChip({ item }) {
  const Glyph = item.glyph ? skillGlyph[item.glyph] : null;

  return (
    <li className="skill-chip">
      <span className="sc-logo">
        {item.logo ? (
          <img src={`/assets/logos/${item.logo}.svg`} alt="" loading="lazy" width={30} height={30} />
        ) : (
          Glyph && <Glyph width={26} height={26} />
        )}
      </span>
      <span className="sc-name">{item.name}</span>
    </li>
  );
}

function Page({ group, side }) {
  return (
    <div className={`page page--${side}`} style={{ '--tint': `var(--${group.tint})` }}>
      <span className="page-tab" aria-hidden="true" />
      <header className="page-head">
        <h3>{group.title}</h3>
        <span className="page-note">{group.note}</span>
      </header>
      <ul className="page-list">
        {group.items.map((item) => (
          <SkillChip key={item.name} item={item} />
        ))}
      </ul>
      <span className="page-num">{group.tape}</span>
    </div>
  );
}

/* An open notebook. One leaf turns on its spine to reveal the second spread —
   auto-turns on a timer, pauses on hover, and can be driven by the controls. */
export default function Skills() {
  const [flipped, setFlipped] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pageA, pageB, pageC, pageD] = skillGroups;

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => setFlipped((f) => !f), AUTO_FLIP_MS);
    return () => clearTimeout(t);
  }, [flipped, paused]);

  return (
    <section id="skills" className="section skills panel panel--deep">
      <header className="section-head skills-head" data-reveal>
        <span className="eyebrow">at a glance</span>
        <h2 className="section-title">
          My <em>skills</em>, out of the notebook.
        </h2>
        <p className="section-lead">
          Two spreads, four pages — the tools I actually reach for, grouped by what they do for a
          product. It turns itself, or you can.
        </p>
      </header>

      <div className="notebook" data-reveal>
        <div
          className={`book${flipped ? ' is-flipped' : ''}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* the two fixed pages underneath */}
          <div className="leaf leaf--left on-paper">
            <Page group={pageA} side="left" />
          </div>
          <div className="leaf leaf--right on-paper">
            <Page group={pageD} side="right" />
          </div>

          {/* the leaf that actually turns */}
          <div className="leaf leaf--flip on-paper">
            <div className="face face--front">
              <Page group={pageB} side="right" />
            </div>
            <div className="face face--back">
              <Page group={pageC} side="left" />
            </div>
          </div>

          <span className="book-spine" aria-hidden="true" />
        </div>

        <div className="book-nav">
          <button
            type="button"
            className="bn-btn"
            onClick={() => setFlipped(false)}
            disabled={!flipped}
            aria-label="Previous spread"
          >
            <ArrowLeftIcon width={18} height={18} />
          </button>

          <span className="bn-dots">
            <button
              type="button"
              className={`bn-dot${!flipped ? ' is-on' : ''}`}
              onClick={() => setFlipped(false)}
              aria-label="Spread 1"
            />
            <button
              type="button"
              className={`bn-dot${flipped ? ' is-on' : ''}`}
              onClick={() => setFlipped(true)}
              aria-label="Spread 2"
            />
          </span>

          <button
            type="button"
            className="bn-btn"
            onClick={() => setFlipped(true)}
            disabled={flipped}
            aria-label="Next spread"
          >
            <ArrowRightIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
