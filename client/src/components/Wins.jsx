import { useEffect, useMemo, useRef, useState } from 'react';

import useInView from '../hooks/useInView.js';
import { LockIcon, ReplayIcon, TrophyIcon } from './Icons.jsx';
import { wins, winStats, sideQuests } from '../data/site.js';
import './Wins.css';

const UNLOCK_STEP_MS = 900;
const TOAST_MS = 2600;
const XP_PER_LEVEL = 1200;

/* The achievements section as a game HUD: a player card with an XP bar, and a
   row of badges that unlock one by one when the section comes into view. Each
   badge can also be tapped to unlock or re-open it. */
export default function Wins() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const [unlocked, setUnlocked] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(0);

  const totalXp = useMemo(() => wins.reduce((sum, w) => sum + w.xp, 0), []);
  const earnedXp = useMemo(
    () => wins.filter((w) => unlocked.includes(w.id)).reduce((sum, w) => sum + w.xp, 0),
    [unlocked]
  );

  const level = Math.max(1, Math.floor(earnedXp / XP_PER_LEVEL) + 1);
  const pct = totalXp ? Math.round((earnedXp / totalXp) * 100) : 0;
  const active = wins.find((w) => w.id === selected) ?? null;

  const announce = (win) => {
    setToast(win);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  };

  const unlock = (win) => {
    setUnlocked((list) => (list.includes(win.id) ? list : [...list, win.id]));
    announce(win);
  };

  /* Auto-run the unlock sequence the first time the section is seen. */
  useEffect(() => {
    if (!seen) return undefined;
    const timers = wins.map((win, i) =>
      setTimeout(() => {
        setUnlocked((list) => (list.includes(win.id) ? list : [...list, win.id]));
        setToast(win);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
      }, 350 + i * UNLOCK_STEP_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [seen]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const replay = () => {
    setUnlocked([]);
    setSelected(null);
    setToast(null);
    wins.forEach((win, i) => {
      setTimeout(() => {
        setUnlocked((list) => (list.includes(win.id) ? list : [...list, win.id]));
        setToast(win);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
      }, 250 + i * UNLOCK_STEP_MS);
    });
  };

  return (
    <section id="wins" className="section wins panel panel--deep" ref={ref}>
      <header className="section-head wins-head" data-reveal>
        <span className="eyebrow">achievements</span>
        <h2 className="section-title">
          The <em>receipts</em>, unlocked.
        </h2>
        <p className="section-lead">
          Because &ldquo;trust me, I&rsquo;m good&rdquo; only goes so far. Tap a badge to open it —
          or hit replay and watch them drop again.
        </p>
      </header>

      <div className="hud">
        {/* --------------------------- player card --------------------------- */}
        <aside className="player">
          <div className="pl-top">
            <figure className="pl-avatar">
              <img src="/assets/caricature.png" alt="" loading="lazy" />
            </figure>
            <div>
              <p className="pl-name">vino.made</p>
              <p className="pl-class">Builder / Marketer — hybrid class</p>
            </div>
            <span className="pl-level">
              <small>LVL</small>
              <b>{String(level).padStart(2, '0')}</b>
            </span>
          </div>

          <div className="pl-xp">
            <div className="xp-labels">
              <span>XP</span>
              <span>
                {earnedXp.toLocaleString()} / {totalXp.toLocaleString()}
              </span>
            </div>
            <div className="xp-track">
              <span className="xp-fill" style={{ '--pct': `${pct}%` }} />
            </div>
          </div>

          <ul className="pl-stats">
            {winStats.map((s) => (
              <li key={s.label}>
                <b>
                  {s.prefix ?? ''}
                  {s.value}
                  {s.suffix ?? ''}
                </b>
                <small>{s.label}</small>
              </li>
            ))}
          </ul>

          <ul className="pl-quests">
            {sideQuests.map((q) => (
              <li key={q.label}>
                <span aria-hidden="true">{q.icon}</span> {q.label}
              </li>
            ))}
          </ul>
        </aside>

        {/* ---------------------------- badges ------------------------------ */}
        <div className="board">
          <div className="board-head">
            <p className="bh-count">
              <TrophyIcon width={17} height={17} />
              <b>
                {unlocked.length} / {wins.length}
              </b>{' '}
              unlocked
            </p>
            <button type="button" className="bh-replay" onClick={replay}>
              <ReplayIcon width={16} height={16} /> Replay
            </button>
          </div>

          <ul className="badges">
            {wins.map((win) => {
              const isOpen = unlocked.includes(win.id);
              return (
                <li key={win.id} style={{ '--rarity': `var(--${win.rarity})` }}>
                  <button
                    type="button"
                    className={`badge${isOpen ? ' is-open' : ''}${
                      selected === win.id ? ' is-selected' : ''
                    }`}
                    onClick={() => (isOpen ? setSelected(win.id) : unlock(win))}
                    aria-label={isOpen ? `Open ${win.short}` : `Unlock ${win.short}`}
                  >
                    <span className="bd-face">
                      {isOpen ? (
                        <span className="bd-medal">{win.medal}</span>
                      ) : (
                        <LockIcon width={22} height={22} />
                      )}
                    </span>
                    <span className="bd-name">{isOpen ? win.short : '???'}</span>
                    <span className="bd-tier">{isOpen ? win.tier : 'Locked'}</span>
                    <span className="bd-xp">+{win.xp} XP</span>
                    <span className="bd-shine" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ---------------------------- detail ---------------------------- */}
          <div className={`detail patch${active ? ' is-on' : ''}`}>
            {active ? (
              <>
                <figure className="dt-media">
                  <img key={active.id} src={active.image} alt={active.title} loading="lazy" />
                  <span className="dt-medal">{active.medal}</span>
                </figure>
                <div className="dt-body">
                  <p className="dt-meta">
                    <span>{active.date}</span>
                    <span className="dt-chip">{active.chip}</span>
                    <span className="dt-chip dt-chip--tier">{active.tier}</span>
                  </p>
                  <h3 className="dt-title">{active.title}</h3>
                  <p className="dt-desc">{active.desc}</p>
                  <p className="dt-xp">+{active.xp} XP earned</p>
                </div>
              </>
            ) : (
              <p className="dt-empty">
                <TrophyIcon width={20} height={20} />
                Pick a badge to read the story behind it.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------- toast ------------------------------- */}
      <div className={`unlock-toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span className="ut-medal">{toast.medal}</span>
            <span className="ut-text">
              <b>Achievement unlocked</b>
              <small>
                {toast.short} · +{toast.xp} XP
              </small>
            </span>
          </>
        )}
      </div>
    </section>
  );
}
