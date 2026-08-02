import RichText from './RichText.jsx';
import { ArrowRightIcon } from './Icons.jsx';
import { experience } from '../data/site.js';
import './Experience.css';

const statusLabel = {
  current: 'Now rolling',
  open: 'Open for work',
  blank: 'Unexposed',
};

export default function Experience() {
  return (
    <section id="experience" className="section experience">
      <div className="panel panel--wine">
        <header className="section-head" data-reveal>
          <span className="eyebrow">what i&rsquo;m up to</span>
          <h2 className="section-title">
            My <em>experience</em>, frame by frame.
          </h2>
          <p className="section-lead">
            Real-world work at a startup, freelance builds with my brother — and one frame still
            waiting to be shot.
          </p>
        </header>

        <div className="filmroll" data-reveal>
          <p className="film-edge film-edge--top">
            <span>KODAK 5077</span>
            <span className="fe-mark">✦</span>
            <span>VINO · EXPERIENCE ROLL</span>
            <span className="fe-mark">✦</span>
            <span>2026</span>
          </p>

          <div className="filmstrip on-dark">
            <span className="film-perfs film-perfs--left" aria-hidden="true" />
            <span className="film-perfs film-perfs--right" aria-hidden="true" />

            <ol className="film-frames">
              {experience.map((exp, i) => (
                <li className={`film-frame is-${exp.status}`} key={exp.id} style={{ '--i': i }}>
                  <span className="frame-no" aria-hidden="true">
                    {exp.frame}
                    <i>A</i>
                  </span>
                  <span className="frame-note" aria-hidden="true">
                    {exp.note}
                  </span>

                  <div className="frame-meta">
                    <span className={`frame-badge frame-badge--${exp.status}`}>
                      <span className="fb-dot" />
                      {statusLabel[exp.status]}
                    </span>
                    <span className="frame-period">{exp.period}</span>
                    <span className="frame-kind">{exp.kind}</span>
                  </div>

                  <div className="frame-body">
                    <h3 className="frame-role">{exp.role}</h3>
                    <p className="frame-co">
                      {exp.href ? (
                        <a href={exp.href} target="_blank" rel="noopener">
                          {exp.company}
                        </a>
                      ) : (
                        exp.company
                      )}
                    </p>

                    <ul className="frame-points">
                      {exp.points.map((point, i) => (
                        <RichText as="li" key={i} text={point} />
                      ))}
                    </ul>

                    <ul className="frame-tags">
                      {exp.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>

                    {exp.status !== 'current' && (
                      <a href="#contact" className="frame-cta">
                        Let&rsquo;s build something <ArrowRightIcon width={16} height={16} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="film-edge film-edge--bottom">
            <span>ISO 400</span>
            <span className="fe-mark">✦</span>
            <span>DEVELOPER × DIGITAL MARKETER</span>
            <span className="fe-mark">✦</span>
            <span>EXP 36</span>
          </p>
        </div>
      </div>
    </section>
  );
}
