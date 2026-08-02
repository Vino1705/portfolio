import { useEffect, useState } from 'react';
import useInView from '../hooks/useInView.js';

/* Counts up from 0 to `value` the first time it scrolls into view. */
export default function Counter({ value, prefix = '', suffix = '', duration = 1400 }) {
  const [ref, seen] = useInView({ threshold: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!seen) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return undefined;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);

  return (
    <span ref={ref} className="counter">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}
