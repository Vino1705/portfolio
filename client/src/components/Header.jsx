import { useEffect, useState } from 'react';

import { nav, profile } from '../data/site.js';
import { HomeIcon, SearchIcon, MenuIcon, CloseIcon } from './Icons.jsx';
import './Header.css';

export default function Header({ active, onSearch }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    return () => document.body.classList.remove('is-locked');
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`site-header${stuck ? ' is-stuck' : ''}`}>
      <nav className="navbar on-dark" aria-label="Primary">
        <a
          href="#home"
          className={`nav-home${active === 'home' ? ' is-active' : ''}`}
          aria-label="Back to top"
        >
          <HomeIcon width={19} height={19} />
        </a>

        <a href="#home" className="nav-brand">
          vino<span>.</span>
          <em>made</em>
        </a>

        <ul className="nav-links">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`nav-link${active === item.id ? ' is-active' : ''}`}
                aria-current={active === item.id ? 'true' : undefined}
              >
                <span className="nl-label">{item.label}</span>
                <span className="nl-sub">{item.sub}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-tools">
          <button type="button" className="nav-icon" onClick={onSearch} aria-label="Search the site">
            <SearchIcon width={19} height={19} />
          </button>
          <button
            type="button"
            className="nav-icon nav-burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <CloseIcon width={19} height={19} /> : <MenuIcon width={19} height={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div className={`nav-sheet on-dark${open ? ' is-open' : ''}`} hidden={!open}>
        <button
          type="button"
          className="sheet-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <CloseIcon width={22} height={22} />
        </button>
        <p className="sheet-brand">
          vino<span>.</span>
          <em>made</em>
        </p>
        <ul>
          <li>
            <a href="#home" onClick={() => setOpen(false)}>
              <span className="nl-label">Home</span>
              <span className="nl-sub">Start here</span>
            </a>
          </li>
          {nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                <span className="nl-label">{item.label}</span>
                <span className="nl-sub">{item.sub}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className="sheet-cta" onClick={() => setOpen(false)}>
              <span className="nl-label">Say hi</span>
              <span className="nl-sub">{profile.email}</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
