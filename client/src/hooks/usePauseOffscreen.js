import { useEffect, useRef } from 'react';

/* Parks CSS animations inside an element while it is off-screen.

   The hero ticker, the marquee and the floating artwork are all `infinite`
   animations. Left alone they keep a composited layer alive and repainting for
   as long as the tab is open, which on a phone is a steady frame-rate and
   battery cost paid for something nobody can see. This toggles `is-offscreen`
   (see base.css) as the element leaves and re-enters the viewport.

   Class toggling rather than React state on purpose: this fires on every
   scroll past the element and must not re-render the tree. */
export default function usePauseOffscreen(rootMargin = '200px') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-offscreen', !entry.isIntersecting),
      { rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return ref;
}
