import { ArrowUpIcon, ArrowRightIcon, socialIcon, MailIcon } from './Icons.jsx';
import { profile } from '../data/site.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="foot-cta">
        <p className="fc-eyebrow">✦ still scrolling? ✦</p>
        <h2 className="fc-title">
          Let&rsquo;s build the
          <br />
          <em>next one</em> together.
        </h2>
        <p className="fc-sub">
          A product, a brand, an idea you can&rsquo;t stop thinking about — I&rsquo;d love to hear
          it.
        </p>

        <a href={`mailto:${profile.email}`} className="btn btn-primary fc-btn">
          {profile.email} <ArrowRightIcon width={18} height={18} />
        </a>

        {/* Second door: work that wants building or automating goes to the
            studio rather than to my inbox. */}
        <p className="fc-studio">
          <span className="fcs-lead">Got something worth automating — or a product in it?</span>
          <a href={profile.freshframe} target="_blank" rel="noopener" className="fcs-link">
            Build it with <b>FreshFrame</b>
            <ArrowRightIcon width={16} height={16} />
          </a>
        </p>

        <div className="foot-socials">
          {profile.socials.map((s) => {
            const Ico = socialIcon[s.id] ?? MailIcon;
            return (
              <a
                key={s.id}
                href={s.href}
                target={s.id === 'mail' ? undefined : '_blank'}
                rel="noopener"
                aria-label={s.label}
              >
                <Ico width={19} height={19} />
              </a>
            );
          })}
        </div>
      </div>

      <div className="foot-bar">
        <p className="foot-logo">
          vino<span>.</span>
          <em>made</em>
        </p>
        <p className="foot-note">
          Designed &amp; built with care — React + Node. © {new Date().getFullYear()}{' '}
          {profile.name}.
        </p>
        <a className="foot-top" href="#home">
          back to top <ArrowUpIcon width={16} height={16} />
        </a>
      </div>
    </footer>
  );
}
