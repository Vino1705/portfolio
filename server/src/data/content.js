/* Canonical content for the JSON API. The React client ships its own copy in
   client/src/data/site.js so the site renders without a back end — keep the two
   in sync when you edit content. */

export const profile = {
  name: 'Vinothini T',
  handle: 'vino.made',
  role: 'Developer × Digital Marketer × Problem Solver',
  location: 'Chennai, Tamil Nadu, India',
  email: 'vinoism1703@gmail.com',
  phone: '+91 90427 85843',
  links: {
    github: 'https://github.com/Vino1705',
    linkedin: 'https://www.linkedin.com/in/vinothini-t-08b4b4274/',
  },
  summary:
    'Final-year CSE student at Saveetha Engineering College who builds AI-powered products, markets them, and ships them.',
};

export const projects = [
  {
    id: 'sahaay',
    title: 'Sahaay AI',
    category: 'ai',
    tag: 'AI · Wellness',
    blurb:
      'A gentle mental-wellness companion — mood check-ins, daily reflection and an anonymous safe space.',
    stack: ['React', 'Node.js', 'OpenAI', 'Firebase'],
  },
  {
    id: 'finmate',
    title: 'FinMate',
    category: 'fintech',
    tag: 'FinTech',
    blurb:
      'A personal-finance assistant that turns raw spending data into plain-English insight.',
    stack: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 'enterprise360',
    title: 'Enterprise360',
    category: 'ai',
    tag: 'AI · Enterprise',
    blurb: 'An AI assistant that unifies scattered enterprise data into one conversational view.',
    stack: ['React', 'Node.js', 'RAG'],
    wip: true,
  },
  {
    id: 'contentspark',
    title: 'ContentSpark',
    category: 'ai',
    tag: 'AI · Marketing',
    blurb: 'A privacy-first AI writing companion for ideation, rewriting and summarising.',
    stack: ['React', 'Node.js', 'OpenAI'],
    wip: true,
  },
];

export const experience = [
  {
    id: 'healthpilot',
    role: 'Tester & Business Development Executive',
    company: 'HealthPilot.ai',
    period: '2026 — Present',
    current: true,
  },
  {
    id: 'freshframe',
    role: 'Co-founder & Developer',
    company: 'FreshFrame',
    period: 'Freelance',
    current: false,
  },
];

export const wins = [
  { id: 'intel', title: 'Top 12 · Intel AI Hackathon 2025', date: 'May 2025', prize: '₹25,000' },
  { id: 'vit', title: 'Winner · VIT Symposium', date: 'Oct 2025', prize: '₹10,000' },
  { id: 'asme', title: 'Special Mention · ASME IMECE India', date: 'Sep 2025', prize: null },
  { id: 'nxtwave', title: 'Finalist · OpenAI × NxtWave Buildathon', date: 'Nov 2025', prize: null },
];
