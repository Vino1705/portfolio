import { useEffect, useMemo, useRef, useState } from 'react';

import { SearchIcon, CloseIcon } from './Icons.jsx';
import { nav, projects, wins, skillGroups } from '../data/site.js';
import './SearchOverlay.css';

/* Flat index of everything worth jumping to. */
function buildIndex() {
  const entries = [
    { id: 'home', kind: 'Section', label: 'Home', hint: 'Start here' },
    ...nav.map((n) => ({ id: n.id, kind: 'Section', label: n.label, hint: n.sub })),
    { id: 'contact', kind: 'Section', label: 'Contact', hint: 'Say hi' },
    ...projects.map((p) => ({ id: 'work', kind: 'Project', label: p.title, hint: p.tag })),
    ...wins.map((w) => ({ id: 'wins', kind: 'Win', label: w.short, hint: w.meta })),
    ...skillGroups.flatMap((g) =>
      g.items.map((s) => ({ id: 'skills', kind: 'Skill', label: s.name, hint: g.title }))
    ),
  ];
  return entries;
}

export default function SearchOverlay({ open, onClose, onGo }) {
  const index = useMemo(buildIndex, []);
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return index.slice(0, 8);
    return index
      .filter(
        (e) =>
          e.label.toLowerCase().includes(needle) ||
          e.hint.toLowerCase().includes(needle) ||
          e.kind.toLowerCase().includes(needle)
      )
      .slice(0, 10);
  }, [q, index]);

  useEffect(() => {
    if (!open) return undefined;
    setQ('');
    setCursor(0);
    document.body.classList.add('is-locked');
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('is-locked');
    };
  }, [open]);

  useEffect(() => setCursor(0), [q]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (e.key === 'Escape') return onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === 'Enter' && results[cursor]) {
      e.preventDefault();
      onGo(results[cursor].id);
    }
    return undefined;
  };

  return (
    <div className="search-scrim" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" className="search-backdrop" onClick={onClose} aria-label="Close search" />
      <div className="search-panel on-dark" onKeyDown={onKeyDown}>
        <div className="search-bar">
          <SearchIcon width={20} height={20} />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sections, projects, skills, wins…"
            aria-label="Search the site"
          />
          <button type="button" className="search-x" onClick={onClose} aria-label="Close">
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <ul className="search-results">
          {results.length === 0 && <li className="search-empty">Nothing matches “{q}”.</li>}
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.label}`}>
              <button
                type="button"
                className={`search-hit${i === cursor ? ' is-cursor' : ''}`}
                onMouseEnter={() => setCursor(i)}
                onClick={() => onGo(r.id)}
              >
                <span className="sh-kind">{r.kind}</span>
                <span className="sh-label">{r.label}</span>
                <span className="sh-hint">{r.hint}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="search-foot">
          <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>↵</kbd> to jump · <kbd>esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
