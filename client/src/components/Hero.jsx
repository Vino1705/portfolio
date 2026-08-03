import TornEdge from './TornEdge.jsx';
import { ArrowRightIcon, FileIcon, ArrowDownIcon } from './Icons.jsx';
import usePauseOffscreen from '../hooks/usePauseOffscreen.js';
import { profile } from '../data/site.js';
import './Hero.css';

/* The headline, split by word so each one can drop in on its own beat.
   `em` marks the script-italic phrase, which drops as a single unit. */
const HEADLINE = [
  { word: 'I' },
  { word: 'build' },
  { word: 'products,' },
  { word: 'market' },
  { word: 'ideas' },
  { word: '& ship', em: true },
  { word: 'them.' },
];

const HEADLINE_TEXT = HEADLINE.map((w) => w.word).join(' ');

/* Full-bleed cover banner — the single intro block. */
export default function Hero() {
  const ref = usePauseOffscreen();

  return (
    <section id="home" className="hero on-dark" ref={ref}>
      <span className="hc-noise" aria-hidden="true" />
      <span className="hc-glow" aria-hidden="true" />

      <div className="hc-inner">
        <div className="hc-type">
          <span className="hc-badge hc-drop" style={{ '--i': 0 }}>
            <span className="hc-dot" /> {profile.available}
          </span>
          <p className="hc-kicker hc-drop" style={{ '--i': 1 }}>
            portfolio · 2026
          </p>

          {/* aria-label carries the sentence, so the per-word spans never make
              a screen reader run the words together. */}
          <h1 className="hc-title" aria-label={HEADLINE_TEXT}>
            {HEADLINE.map(({ word, em }, i) => (
              <span className="hc-word" key={word} style={{ '--i': i }} aria-hidden="true">
                <span className="hc-word-in">{em ? <em>{word}</em> : word}</span>
              </span>
            ))}
          </h1>

          <p className="hc-lead hc-drop" style={{ '--i': HEADLINE.length + 1 }}>
            I&rsquo;m <strong>{profile.name}</strong> — {profile.role.toLowerCase()}, final-year
            CSE in Chennai. I turn ideas into things people actually use.
          </p>

          <div className="hc-actions hc-drop" style={{ '--i': HEADLINE.length + 2 }}>
            <a href="#work" className="btn btn-primary">
              See my work <ArrowRightIcon width={18} height={18} />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener" className="btn btn-ghost">
              <FileIcon width={18} height={18} /> My résumé
            </a>
          </div>

          <a href="#about" className="hc-scroll hc-drop" style={{ '--i': HEADLINE.length + 3 }}>
            <span>scroll for the good stuff</span>
            <ArrowDownIcon width={16} height={16} />
          </a>
        </div>

        {/* Phones render this at roughly a third of its intrinsic width, so
            they get the small file and skip half the bytes. */}
        <figure className="hc-art">
          <img
            src="/assets/caricature.webp"
            srcSet="/assets/caricature-420.webp 420w, /assets/caricature.webp 768w"
            sizes="(max-width: 900px) 45vw, 40vw"
            width="768"
            height="1365"
            alt=""
            loading="eager"
            fetchPriority="high"
          />
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
