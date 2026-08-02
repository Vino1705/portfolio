/* Retro handset illustration for the contact card — drawn, not photographed,
   so it stays sharp and picks up the theme colours. */
export default function PhoneArt() {
  return (
    <svg
      className="phone-art"
      viewBox="0 0 360 430"
      role="img"
      aria-label="Illustration of a retro telephone handset"
    >
      <defs>
        <linearGradient id="handsetBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--wine-500)" />
          <stop offset="100%" stopColor="var(--wine-800)" />
        </linearGradient>
        <linearGradient id="handsetDisc" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="var(--wine-400)" />
          <stop offset="100%" stopColor="var(--wine-700)" />
        </linearGradient>
        <radialGradient id="deskShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(58,18,25,.34)" />
          <stop offset="100%" stopColor="rgba(58,18,25,0)" />
        </radialGradient>
      </defs>

      {/* soft shadow on the desk */}
      <ellipse cx="176" cy="368" rx="140" ry="34" fill="url(#deskShadow)" />

      {/* coiled cord */}
      <path
        d="M232 306 q 22 34 47 9 q 25 -25 47 9 q 14 19 24 12"
        fill="none"
        stroke="var(--wine-700)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      <g transform="rotate(-20 170 175)">
        {/* bar */}
        <rect x="139" y="72" width="62" height="206" rx="28" fill="url(#handsetBody)" />

        {/* earpiece + mouthpiece */}
        {[80, 270].map((cy) => (
          <g key={cy}>
            <circle cx="170" cy={cy} r="58" fill="url(#handsetDisc)" />
            <circle cx="170" cy={cy} r="58" fill="none" stroke="var(--wine-900)" strokeWidth="3" opacity="0.35" />
            <circle cx="170" cy={cy} r="42" fill="none" stroke="var(--rose-soft)" strokeWidth="5" opacity="0.55" />
            <circle cx="170" cy={cy} r="28" fill="none" stroke="var(--rose-soft)" strokeWidth="5" opacity="0.45" />
            <circle cx="170" cy={cy} r="14" fill="none" stroke="var(--rose-soft)" strokeWidth="5" opacity="0.35" />
            <circle cx="170" cy={cy} r="5" fill="var(--rose-soft)" opacity="0.5" />
            {/* highlight */}
            <path
              d={`M132 ${cy - 34} a 52 52 0 0 1 46 -22`}
              fill="none"
              stroke="var(--cream)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.3"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
