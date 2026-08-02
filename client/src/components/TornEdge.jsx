/* Hand-cut paper edge. Sits at the bottom of a coloured band and is filled
   with the colour of whatever sits below it, so the band looks ripped away. */
export default function TornEdge({ fill = 'var(--cream)', className = '' }) {
  return (
    <svg
      className={`torn-edge ${className}`.trim()}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ fill }}
    >
      <path
        d="M0,40 L0,18 L18,26 L42,12 L64,24 L92,10 L118,22 L146,9 L172,25 L198,14 L226,27
           L252,13 L280,24 L308,11 L334,23 L362,10 L390,25 L418,15 L446,27 L472,12 L500,23
           L528,10 L556,24 L584,14 L612,26 L640,12 L668,23 L696,11 L724,25 L752,14 L780,26
           L808,12 L836,24 L864,10 L892,22 L920,13 L948,26 L976,12 L1004,24 L1032,11 L1060,23
           L1088,14 L1116,26 L1144,12 L1172,23 L1200,16 L1200,40 Z"
      />
    </svg>
  );
}
