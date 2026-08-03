import { useEffect, useState } from 'react';

/* Returns the id of the section currently filling most of the viewport.

   Section tops are measured once and re-measured on resize rather than on
   every scroll event: reading `offsetTop` forces a synchronous layout, and
   doing that seven times per scroll event is what makes phones stutter. The
   handler itself is throttled to one animation frame. */
export default function useScrollSpy(ids, offset = 140) {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    let tops = [];
    let pageBottom = 0;
    let frame = 0;

    const measure = () => {
      tops = ids
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, top: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter(Boolean);
      pageBottom = document.documentElement.scrollHeight;
    };

    const pick = () => {
      frame = 0;
      const y = window.scrollY + offset;
      let current = ids[0] ?? '';
      for (const s of tops) if (s.top <= y) current = s.id;
      // Pin the last section once the page is scrolled to the bottom.
      if (window.innerHeight + window.scrollY >= pageBottom - 4) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    pick();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    /* Images and web fonts settle after first paint and move the sections. */
    window.addEventListener('load', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
    };
  }, [ids, offset]);

  return active;
}
