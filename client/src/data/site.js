/* Single source of content for the site. Edit here, not in the components.
   (The Node API keeps a trimmed copy in server/src/data/content.js.) */

export const profile = {
  name: 'Vinothini T',
  first: 'Vinothini',
  last: 'T',
  handle: 'vino.made',
  role: 'Developer × Digital Marketer',
  tagline: 'I build products, market ideas & ship them.',
  bio: 'Final-year CSE @ Saveetha Engineering College, Chennai. I live in the sweet spot between creativity and code — and I take it into the real world.',
  location: 'Chennai, Tamil Nadu · India',
  email: 'vinoism1703@gmail.com',
  phone: '+91 90427 85843',
  phoneHref: '+919042785843',
  available: 'Available for internships & freelance',
  resume: '/resume.html',
  /* The studio I run with my brother — linked from the Experience film roll
     and the footer. Defined once here so both stay in step. */
  freshframe: 'https://vino1705.github.io/FreshFrame/',
  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/Vino1705' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinothini-t-08b4b4274/' },
    { id: 'mail', label: 'Email', href: 'mailto:vinoism1703@gmail.com' },
  ],
};

/* Header — each entry renders as a label with a small caption underneath,
   the way the reference nav bar is laid out. */
export const nav = [
  { id: 'about', label: 'About', sub: 'Who I am' },
  { id: 'skills', label: 'Skills', sub: 'What I use' },
  { id: 'work', label: 'Work', sub: 'What I’ve shipped' },
  { id: 'experience', label: 'Experience', sub: 'Where I’ve been' },
  { id: 'wins', label: 'Wins', sub: 'The receipts' },
];

/* Note: the headline numbers live only in the Wins section (`winStats`) so they
   are not repeated across the page. */

export const marquee = [
  'React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'JavaScript',
  'MongoDB', 'Firebase', 'Supabase', 'Tailwind', 'OpenAI API', 'Prompt Design',
  'Figma', 'Canva', 'SEO', 'Git & GitHub',
];

/* ------------------------------- About ---------------------------------- */

export const specialties = {
  left: ['Full-stack builds', 'AI product design', 'Prompt engineering', 'QA & testing', 'Rapid prototyping'],
  right: ['Brand & identity', 'Content that converts', 'SEO & growth', 'Social strategy', 'Client engagement'],
};

export const aboutCopy = [
  "Hi! I'm a final-year **Computer Science Engineering** student at Saveetha Engineering College, Chennai — and I've never been very good at staying in one lane.",
  "I freelance, I teach, I pitch on stage, and somewhere in between I ship products. If a week goes by without me building something, I get twitchy.",
];

/* The three lives I juggle. Each gets its own colour. */
export const lives = [
  {
    id: 'freelance',
    icon: '💼',
    tint: 'joy-1',
    title: 'I freelance',
    text: 'Websites, branding and digital bits for real clients — built end to end with my brother at FreshFrame. Real deadlines, real feedback, real invoices.',
  },
  {
    id: 'hackathons',
    icon: '🎤',
    tint: 'joy-2',
    title: 'I hackathon (a lot)',
    text: 'I have lost count of the pitch decks. National finals, symposiums, buildathons — I build, I present, and I genuinely love the 3 a.m. bit.',
  },
  {
    id: 'teaching',
    icon: '📚',
    tint: 'joy-3',
    title: 'I teach tuition',
    text: 'School kids, after class. Explaining something to a distracted 14-year-old is the best debugging practice I have ever had.',
  },
];

export const funFacts = [
  { icon: '☕', text: 'Runs on filter coffee & deadlines', tint: 'joy-5' },
  { icon: '🚀', text: 'Ships first, perfects later', tint: 'joy-1' },
  { icon: '🎨', text: 'Designs in Canva, dreams in code', tint: 'joy-4' },
  { icon: '🧠', text: 'Always learning something new', tint: 'joy-3' },
];

/* ------------------------------- Skills ---------------------------------- */

/* Rendered as overlapping notebook pages. `logo` points at
   client/public/assets/logos/<logo>.svg; `glyph` falls back to a drawn icon. */

export const skillGroups = [
  {
    title: 'Frontend',
    note: 'what people see',
    tape: 'page 01',
    tint: 'joy-1',
    items: [
      { name: 'React', logo: 'react' },
      { name: 'Next.js', logo: 'nextdotjs' },
      { name: 'TypeScript', logo: 'typescript' },
      { name: 'JavaScript', logo: 'javascript' },
      { name: 'Tailwind', logo: 'tailwindcss' },
      { name: 'HTML5', logo: 'html5' },
      { name: 'CSS3', logo: 'css' },
    ],
  },
  {
    title: 'Backend & Data',
    note: 'what holds it up',
    tape: 'page 02',
    tint: 'joy-2',
    items: [
      { name: 'Node.js', logo: 'nodedotjs' },
      { name: 'Express', logo: 'express' },
      { name: 'MongoDB', logo: 'mongodb' },
      { name: 'Firebase', logo: 'firebase' },
      { name: 'Supabase', logo: 'supabase' },
    ],
  },
  {
    title: 'AI & Prompting',
    note: 'the fun part',
    tape: 'page 03',
    tint: 'joy-3',
    items: [
      { name: 'OpenAI API', logo: 'openai' },
      { name: 'Prompt Design', glyph: 'spark' },
      { name: 'Agentic AI', glyph: 'robot' },
      { name: 'RAG', glyph: 'database' },
      { name: 'Evals', glyph: 'flask' },
    ],
  },
  {
    title: 'Marketing & QA',
    note: 'ship it, then sell it',
    tape: 'page 04',
    tint: 'joy-4',
    items: [
      { name: 'Branding', glyph: 'palette' },
      { name: 'SEO', glyph: 'magnifier' },
      { name: 'Content', glyph: 'pen' },
      { name: 'Test Cases', glyph: 'checklist' },
      { name: 'Manual QA', glyph: 'bug' },
    ],
  },
];

/* -------------------------------- Work ----------------------------------- */

export const projects = [
  {
    id: 'sahaay',
    title: 'Sahaay AI',
    category: ['ai', 'web'],
    tag: 'AI · Wellness',
    image: '/assets/work-sahaay.webp',
    blurb:
      'A gentle mental-wellness companion — mood check-ins, daily reflection and an anonymous safe space. OpenAI × NxtWave Buildathon finalist.',
    problem:
      'Students talk about burnout constantly and do almost nothing about it — the existing apps feel clinical, heavy and judgemental.',
    build:
      'A calm daily check-in flow, an AI reflection partner tuned to be warm rather than clinical, and a fully anonymous space to vent. Built in React with a Node service in front of the model.',
    result: 'Top 10 in the Tamil Nadu regionals of the OpenAI × NxtWave Buildathon; heading to nationals.',
    stack: ['React', 'Node.js', 'Express', 'OpenAI', 'Firebase'],
  },
  {
    id: 'finmate',
    title: 'FinMate',
    category: ['fintech', 'web'],
    tag: 'FinTech',
    image: '/assets/work-finmate.webp',
    blurb:
      'A friendly personal-finance & budgeting assistant that turns spending data into plain-English insight. Won ₹10K at the VIT symposium.',
    problem:
      'Budgeting apps show you charts. Nobody changes behaviour because of a pie chart — they change because someone tells them what it means.',
    build:
      'Import spending, auto-categorise it, and hand it to a summariser that speaks in sentences: what you overspent on, what it will cost you by month end, what to do this week.',
    result: '₹10,000 winner at the VIT symposium.',
    stack: ['React', 'Node.js', 'MongoDB', 'Chart rendering'],
  },
  {
    id: 'enterprise360',
    title: 'Enterprise360',
    category: ['ai'],
    tag: 'AI · Enterprise',
    image: '/assets/work-enterprise360.webp',
    wip: true,
    blurb:
      'An AI assistant that unifies scattered enterprise data into one conversational view. Top 12 nationally at Intel AI Hackathon 2025 (₹25K).',
    problem:
      'Enterprise answers live in five dashboards and three spreadsheets. Getting one number means asking three people.',
    build:
      'A retrieval layer over the scattered sources plus a conversational front end, so a question in English returns the number and its source.',
    result: 'Top 12 nationally at the Intel AI Hackathon 2025 — ₹25,000.',
    stack: ['React', 'Node.js', 'RAG', 'Vector search'],
  },
  {
    id: 'contentspark',
    title: 'ContentSpark',
    category: ['ai'],
    tag: 'AI · Marketing',
    image: '/assets/work-contentspark.webp',
    wip: true,
    blurb:
      'A privacy-first AI writing companion for idea generation, rewriting & summarising — the marketer’s pocket co-pilot.',
    problem:
      'Marketers paste client copy into random AI tools all day. That is a data problem waiting to happen.',
    build:
      'A focused writing companion with a privacy-first posture: nothing stored, nothing trained on, everything scoped to the session.',
    result: 'In build — shipping soon.',
    stack: ['React', 'Node.js', 'OpenAI'],
  },
];

/* ----------------------------- Experience -------------------------------- */
/* Rendered as frames on a 35mm film strip. */

export const experience = [
  {
    id: 'healthpilot',
    frame: '01',
    role: 'Tester & Business Development Executive',
    company: 'HealthPilot.ai',
    href: 'https://healthpilot.ai',
    kind: 'AI healthcare startup',
    period: '2026 — Present',
    status: 'current',
    note: 'still rolling ✶',
    points: [
      '**QA & Testing** — writing test cases and catching edge cases before they reach users.',
      '**Business Development** — driving growth and opening new opportunities for the product.',
      '**Client Engagement** — building relationships and turning conversations into partnerships.',
    ],
    tags: ['Testing / QA', 'Business Development', 'Client Engagement', 'AI Product'],
  },
  {
    id: 'freshframe',
    frame: '02',
    role: 'Co-founder & Developer',
    company: 'FreshFrame',
    href: profile.freshframe,
    kind: 'we build, you grow',
    period: 'Freelance',
    status: 'open',
    note: 'our own reel ✶',
    points: [
      '**Websites** — designed, built & shipped end to end for real clients.',
      '**Branding & digital solutions** — identity and growth that stand out.',
      '**Got something worth building?** Tell us the idea — we’ll make it real.',
    ],
    tags: ['Websites', 'Branding', 'Digital Solutions', 'Full-Stack'],
    cta: { label: 'Visit FreshFrame', href: profile.freshframe, external: true },
  },
  {
    id: 'next',
    frame: '03',
    role: 'Your team, maybe?',
    company: 'Next frame',
    kind: 'undeveloped',
    period: 'Coming up',
    status: 'blank',
    note: 'shoot me a message ✶',
    points: ['This frame is deliberately empty — I’m looking for the next interesting problem.'],
    tags: ['Internships', 'Freelance', 'Full-time'],
  },
];

/* -------------------------------- Wins ----------------------------------- */

export const winStats = [
  { value: 35, prefix: '₹', suffix: 'K+', label: 'won pitching ideas' },
  { value: 4, label: 'national finals' },
  { value: 3, label: 'hackathons' },
  { value: 1, label: 'startup role' },
];

/* Achievements are presented as a game HUD, so each carries an XP value and a
   rarity tier alongside the real detail. */

export const wins = [
  {
    id: 'intel',
    medal: '🥇',
    date: 'May 2025',
    chip: 'Hackathon',
    title: 'Top 12 · Intel AI Hackathon 2025',
    short: 'Intel AI Hackathon',
    meta: 'Top 12 · ₹25K · National',
    desc: 'National recognition + ₹25,000 for Enterprise360, an AI assistant for unified enterprise insights.',
    image: '/assets/win-intel.webp',
    xp: 2500,
    tier: 'Legendary',
    rarity: 'joy-2',
  },
  {
    id: 'nxtwave',
    medal: '🚀',
    date: 'Nov 2025',
    chip: 'Buildathon',
    title: 'Finalist · OpenAI × NxtWave',
    short: 'OpenAI × NxtWave',
    meta: 'Finalist · Top 10',
    desc: 'Top 10 in the Tamil Nadu regionals with Sahaay AI — now heading to the national round.',
    image: '/assets/win-nxtwave.webp',
    xp: 2000,
    tier: 'Epic',
    rarity: 'joy-3',
  },
  {
    id: 'vit',
    medal: '💰',
    date: 'Oct 2025',
    chip: 'Symposium',
    title: 'Winner · VIT Symposium',
    short: 'VIT Symposium',
    meta: 'Winner · ₹10K',
    desc: 'Presented FinMate and took home ₹10,000 for a practical, problem-first finance assistant.',
    image: '/assets/win-vit.webp',
    xp: 1500,
    tier: 'Rare',
    rarity: 'joy-1',
  },
  {
    id: 'asme',
    medal: '⭐',
    date: 'Sep 2025',
    chip: 'Competition',
    title: 'Special Mention · ASME IMECE India',
    short: 'ASME IMECE India',
    meta: 'Special Mention',
    desc: 'Recognised at Brain Bolt – The Engineers’ Sprint in Hyderabad for creative engineering & teamwork.',
    image: '/assets/win-asme.webp',
    xp: 800,
    tier: 'Uncommon',
    rarity: 'joy-4',
  },
];

/* Side quests — smaller, always-unlocked flavour entries for the HUD. */
export const sideQuests = [
  { icon: '💼', label: 'Shipped for real clients' },
  { icon: '📚', label: 'Taught tuition after class' },
  { icon: '🎤', label: 'Pitched on stage' },
  { icon: '🌙', label: 'Survived the 3 a.m. build' },
];
