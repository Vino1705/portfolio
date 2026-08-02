import TornEdge from './TornEdge.jsx';
import { ArrowRightIcon, FileIcon, ArrowDownIcon } from './Icons.jsx';
import { profile } from '../data/site.js';
import './Hero.css';

/* Full-bleed cover banner — the single intro block. */
export default function Hero() {
  return (
    <section id="home" className="hero on-dark">
      <span className="hc-noise" aria-hidden="true" />
      <span className="hc-glow" aria-hidden="true" />

      <div className="hc-inner">
        <div className="hc-type">
          <span className="hc-badge">
            <span className="hc-dot" /> {profile.available}
          </span>
          <p className="hc-kicker">portfolio · 2026</p>
          <h1 className="hc-title">
            I build products, market ideas <em>&amp; ship</em> them.
          </h1>
          <p className="hc-lead">
            I&rsquo;m <strong>{profile.name}</strong> — {profile.role.toLowerCase()}, final-year
            CSE in Chennai. I turn ideas into things people actually use.
          </p>

          <div className="hc-actions">
            <a href="#work" className="btn btn-primary">
              See my work <ArrowRightIcon width={18} height={18} />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener" className="btn btn-ghost">
              <FileIcon width={18} height={18} /> My résumé
            </a>
          </div>

          <a href="#about" className="hc-scroll">
            <span>scroll for the good stuff</span>
            <ArrowDownIcon width={16} height={16} />
          </a>
        </div>

        <figure className="hc-art">
          <img src="/assets/caricature.png" alt="" loading="eager" />
        </figure>
      </div>

      <p className="hc-strip" aria-hidden="true">
        <span>developer × digital marketer × problem solver&nbsp;&nbsp;—&nbsp;&nbsp;</span>
        <span>developer × digital marketer × problem solver&nbsp;&nbsp;—&nbsp;&nbsp;</span>
      </p>

      <TornEdge fill="var(--wine-900)" />
    </section>
  );
}
