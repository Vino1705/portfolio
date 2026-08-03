import { useState } from 'react';

import RichText from './RichText.jsx';
import TornEdge from './TornEdge.jsx';
import { specialties, aboutCopy, lives, funFacts } from '../data/site.js';
import './About.css';

/* Background-removed cut-out of the profile photo; source in assets-source/. */
const CENTRE = '/assets/about-cutout.webp';
const CENTRE_FALLBACK = '/assets/about-centre.webp';

export default function About() {
  const [src, setSrc] = useState(CENTRE);

  return (
    <section id="about" className="section about">
      <div className="panel panel--deep panel--flush about-panel" data-reveal>
        {/* --------- title banner: headline behind, cutout in front --------- */}
        <header className="about-banner on-dark">
          <p className="ab-mark">
            <span className="ab-diamond">◆</span> about · profile
          </p>

          <div className="niche-stage" data-reveal="group">
            <h2 className="niche-title">
              <span className="nt-line">
                MY <em>Niche</em> &amp;
              </span>
              <span className="nt-line">SPECIALTIES</span>
            </h2>

            <div className="niche-cast">
              <ul className="niche-col niche-col--left">
                {specialties.left.map((item, i) => (
                  <li key={item} className="niche-pill" style={{ '--i': i }}>
                    {item}
                  </li>
                ))}
              </ul>

              <figure className="niche-centre">
                <span className="nc-halo" aria-hidden="true" />
                <img
                  src={src}
                  srcSet={
                    src === CENTRE
                      ? '/assets/about-cutout-300.webp 300w, /assets/about-cutout.webp 443w'
                      : undefined
                  }
                  sizes="(max-width: 760px) 40vw, 25vw"
                  width="443"
                  height="848"
                  alt="Vinothini T"
                  loading="lazy"
                  onError={() => src !== CENTRE_FALLBACK && setSrc(CENTRE_FALLBACK)}
                />
              </figure>

              <ul className="niche-col niche-col--right">
                {specialties.right.map((item, i) => (
                  <li key={item} className="niche-pill" style={{ '--i': i }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="ab-sub">The two halves of what I do, and the person doing it.</p>
          <TornEdge fill="var(--wine-900)" />
        </header>

        {/* ---------------------------- body -------------------------------- */}
        <div className="about-inner rail">
          {/* ------------------------- the story --------------------------- */}
          <div className="about-story">
            <h3 className="about-sub">
              A developer who also <span className="hand">ships, sells &amp; teaches</span>.
            </h3>
            {aboutCopy.map((p, i) => (
              <RichText as="p" key={i} text={p} />
            ))}
          </div>

          {/* --------------------- the three lives ------------------------- */}
          <ul className="lives" data-reveal="group">
            {lives.map((life, i) => (
              <li
                className="life patch"
                key={life.id}
                style={{ '--tint': `var(--${life.tint})`, '--i': i }}
              >
                <span className="life-icon" aria-hidden="true">
                  {life.icon}
                </span>
                <h4 className="life-title">{life.title}</h4>
                <p className="life-text">{life.text}</p>
              </li>
            ))}
          </ul>

          {/* ------------------------- fun facts --------------------------- */}
          <div className="about-foot">
            <p className="ff-lead">
              <span className="hand">and the small print…</span>
            </p>
            <ul className="fun-facts">
              {funFacts.map((f) => (
                <li key={f.text} style={{ '--tint': `var(--${f.tint})` }}>
                  <span className="ff-icon">{f.icon}</span>
                  {f.text}
                </li>
              ))}
            </ul>
            <p className="about-sign">— Vinothini ✿</p>
          </div>
        </div>
      </div>
    </section>
  );
}
