import { useCallback, useEffect, useMemo, useState } from 'react';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Work from './components/Work.jsx';
import Experience from './components/Experience.jsx';
import Wins from './components/Wins.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import SearchOverlay from './components/SearchOverlay.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import BackToTop from './components/BackToTop.jsx';

import useReveal from './hooks/useReveal.js';
import useScrollSpy from './hooks/useScrollSpy.js';
import { nav, projects } from './data/site.js';

export default function App() {
  const sectionIds = useMemo(() => ['home', ...nav.map((n) => n.id), 'contact'], []);
  const active = useScrollSpy(sectionIds);

  const [searchOpen, setSearchOpen] = useState(false);
  const [openProject, setOpenProject] = useState(null);

  useReveal([]);

  /* Scroll progress bar. The scrollable height is cached and the write is
     deferred to an animation frame, so scrolling never triggers a layout. */
  useEffect(() => {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return undefined;

    let max = 0;
    let frame = 0;

    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };

    const paint = () => {
      frame = 0;
      bar.style.setProperty('--p', max > 0 ? String(window.scrollY / max) : '0');
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
    };
  }, []);

  /* ⌘K / Ctrl+K opens search */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const project = useMemo(
    () => projects.find((p) => p.id === openProject) ?? null,
    [openProject]
  );

  const goTo = useCallback((id) => {
    setSearchOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <a className="skip-link" href="#home">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />

      <Header active={active} onSearch={() => setSearchOpen(true)} />

      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Work onOpen={setOpenProject} />
        <Experience />
        <Wins />
        <Contact />
      </main>

      <Footer />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onGo={goTo} />
      <ProjectModal project={project} onClose={() => setOpenProject(null)} />
      <BackToTop />
    </>
  );
}
