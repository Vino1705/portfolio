/* Inline icon set — replaces the old Font Awesome CDN dependency.
   Every icon inherits the current text colour. */

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const Icon = ({ children, ...rest }) => (
  <svg {...base} {...rest}>
    {children}
  </svg>
);

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
  </Icon>
);

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </Icon>
);

export const MenuIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

export const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Icon>
);

export const ArrowLeftIcon = (p) => (
  <Icon {...p}>
    <path d="M20 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Icon>
);

export const ArrowUpIcon = (p) => (
  <Icon {...p}>
    <path d="M12 20V5" />
    <path d="m6 11 6-6 6 6" />
  </Icon>
);

export const ArrowDownIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v15" />
    <path d="m18 13-6 6-6-6" />
  </Icon>
);

export const MailIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Icon>
);

export const PhoneIcon = (p) => (
  <Icon {...p}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4Z" />
  </Icon>
);

export const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Icon>
);

export const FileIcon = (p) => (
  <Icon {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Icon>
);

export const SendIcon = (p) => (
  <Icon {...p}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3l-6.8 18-3.7-7.5L3 9.8Z" />
  </Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.6 2.6L16 9.8" />
  </Icon>
);

export const GithubIcon = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

export const LinkedinIcon = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.9c0-3.3-1.76-4.84-4.11-4.84-1.9 0-2.75 1.05-3.22 1.78V8.5H9.73V21h3.38v-6.98c0-.37.03-.74.14-1 .3-.74.97-1.5 2.1-1.5 1.48 0 2.07 1.13 2.07 2.78V21h3.38v-7.1Z" />
  </svg>
);

export const socialIcon = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: MailIcon,
};

export const LockIcon = (p) => (
  <Icon {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    <path d="M12 14.5v2.2" />
  </Icon>
);

export const ReplayIcon = (p) => (
  <Icon {...p}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20 3.5V9h-5.5" />
  </Icon>
);

export const TrophyIcon = (p) => (
  <Icon {...p}>
    <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0V4Z" />
    <path d="M7.5 5.5H5a2.5 2.5 0 0 0 2.5 4M16.5 5.5H19a2.5 2.5 0 0 1-2.5 4" />
    <path d="M12 13.5V17M9 20.5h6M10 17h4" />
  </Icon>
);

/* --- glyphs for skills that have no brand logo --------------------------- */

export const SparkGlyph = (p) => (
  <Icon {...p}>
    <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18.1l-1.8-5.5L4.7 10.8 10.2 9 12 3.5Z" />
    <path d="M18.5 16.5 19.3 19l2.5.8-2.5.8-.8 2.5" />
  </Icon>
);

export const RobotGlyph = (p) => (
  <Icon {...p}>
    <rect x="4" y="8" width="16" height="11" rx="3" />
    <path d="M12 4.5V8M8.5 13h.01M15.5 13h.01M9.5 16.2h5" />
    <circle cx="12" cy="3.4" r="1.2" />
  </Icon>
);

export const DatabaseGlyph = (p) => (
  <Icon {...p}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" />
    <path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
    <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
  </Icon>
);

export const FlaskGlyph = (p) => (
  <Icon {...p}>
    <path d="M9.5 3v6.2L4.8 17.6A2 2 0 0 0 6.5 20.7h11a2 2 0 0 0 1.7-3.1L14.5 9.2V3" />
    <path d="M8.6 3h6.8M7.6 14.5h8.8" />
  </Icon>
);

export const PaletteGlyph = (p) => (
  <Icon {...p}>
    <path d="M12 3a9 9 0 1 0 0 18c1.3 0 2-.9 2-1.9 0-1.4-1.2-1.7-1.2-2.8 0-.8.7-1.4 1.6-1.4H16a5 5 0 0 0 5-5C21 5.9 17 3 12 3Z" />
    <path d="M7.6 11h.01M10 7.6h.01M14.4 7.6h.01" />
  </Icon>
);

export const PenGlyph = (p) => (
  <Icon {...p}>
    <path d="M4 20.2 4.9 16 16.4 4.6a2 2 0 0 1 2.9 2.9L7.9 19 4 20.2Z" />
    <path d="M14.6 6.4 17.6 9.4" />
  </Icon>
);

export const ChecklistGlyph = (p) => (
  <Icon {...p}>
    <path d="M4 6.5 5.6 8 8.5 5M4 13.5 5.6 15l2.9-3M4.6 20.2h.01" />
    <path d="M11.5 6.5h8.5M11.5 13.5h8.5M11.5 20.2h8.5" />
  </Icon>
);

export const BugGlyph = (p) => (
  <Icon {...p}>
    <rect x="7.5" y="7.5" width="9" height="12" rx="4.5" />
    <path d="M9.5 7.5a2.5 2.5 0 0 1 5 0M4 11h3.5M16.5 11H20M4 16h3.5M16.5 16H20M6.5 6.5 8.4 8.4M17.5 6.5 15.6 8.4" />
  </Icon>
);

export const skillGlyph = {
  spark: SparkGlyph,
  robot: RobotGlyph,
  database: DatabaseGlyph,
  flask: FlaskGlyph,
  palette: PaletteGlyph,
  magnifier: SearchIcon,
  pen: PenGlyph,
  checklist: ChecklistGlyph,
  bug: BugGlyph,
};
