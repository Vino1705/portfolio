import {
  PDF_PATH,
  head,
  summary,
  technicalSkills,
  businessSkills,
  experience,
  projects,
  achievements,
  education,
  certifications,
  additional,
} from '../data/resume.js';
import { ArrowRightIcon, FileIcon } from './Icons.jsx';
import './ResumePage.css';

/* A labelled block — "Languages: JavaScript" style rows used by the skills
   and additional-information sections. */
function DefRows({ rows }) {
  return (
    <dl className="rs-rows">
      {rows.map((r) => (
        <div className="rs-row" key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.items}</dd>
        </div>
      ))}
    </dl>
  );
}

function Section({ id, title, children }) {
  return (
    <section className="rs-section" id={id}>
      <h2 className="rs-h2">
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}

/* The résumé as its own page: a cream sheet on the site's burgundy, printable
   as-is, with the original PDF one click away. */
export default function ResumePage() {
  return (
    <div className="rs-page">
      <div className="grain" aria-hidden="true" />

      <div className="rs-bar">
        <a className="rs-back" href="/">
          <ArrowRightIcon width={16} height={16} /> Back to portfolio
        </a>
        <div className="rs-bar-actions">
          <button type="button" className="btn btn-ghost rs-btn" onClick={() => window.print()}>
            Print
          </button>
          <a className="btn btn-primary rs-btn" href={PDF_PATH} download>
            <FileIcon width={17} height={17} /> Download PDF
          </a>
        </div>
      </div>

      <main className="rs-sheet on-paper">
        <header className="rs-head">
          <p className="rs-eyebrow">résumé · 2026</p>
          <h1 className="rs-name">{head.name}</h1>
          <p className="rs-title">{head.title}</p>
          <p className="rs-contact">
            <span>{head.location}</span>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${head.email}`}>{head.email}</a>
            {head.links.map((l) => (
              <span key={l.label}>
                <span aria-hidden="true">·</span>
                <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
                  {l.label}
                </a>
              </span>
            ))}
          </p>
        </header>

        <Section id="summary" title="Professional summary">
          <p className="rs-summary">{summary}</p>
        </Section>

        <Section id="skills" title="Technical skills">
          <DefRows rows={technicalSkills} />
        </Section>

        <Section id="bd" title="Business development skills">
          <DefRows rows={businessSkills} />
        </Section>

        <Section id="experience" title="Experience">
          {experience.map((job) => (
            <article className="rs-entry" key={job.org}>
              <h3 className="rs-entry-title">
                {job.org} <span className="rs-dash">—</span> <span className="rs-role">{job.role}</span>
              </h3>
              <p className="rs-place">{job.place}</p>
              <ul className="rs-list">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </Section>

        <Section id="projects" title="Projects">
          {projects.map((p) => (
            <article className="rs-entry" key={p.name}>
              <h3 className="rs-entry-title">
                {p.name} <span className="rs-stack">({p.stack})</span>
              </h3>
              <ul className="rs-list">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          ))}
        </Section>

        <Section id="achievements" title="Achievements">
          <ul className="rs-wins">
            {achievements.map((a) => (
              <li key={a.event}>
                <b>{a.place}</b>
                <span>{a.event}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="education" title="Education">
          <article className="rs-entry">
            <h3 className="rs-entry-title">
              {education.degree} <span className="rs-dash">—</span>{' '}
              <span className="rs-role">{education.school}</span>
            </h3>
            <p className="rs-place">{education.detail}</p>
          </article>
        </Section>

        <Section id="certifications" title="Certifications">
          <ul className="rs-list rs-list--plain">
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Section>

        <Section id="additional" title="Additional information">
          <DefRows rows={additional} />
        </Section>

        <footer className="rs-foot">
          <a className="btn btn-primary rs-btn" href={PDF_PATH} download>
            <FileIcon width={17} height={17} /> Download the PDF
          </a>
          <a className="rs-back rs-back--foot" href="/">
            Back to the portfolio
          </a>
        </footer>
      </main>
    </div>
  );
}
