/* ============================================================================
   Résumé content — transcribed from Vinothini_T_Resume_portfolio.pdf.

   Kept separate from `site.js` on purpose: the portfolio copy and the résumé
   are edited on different schedules. Update this file and the PDF in
   `public/resume/` together so the page and the download never disagree.
   ========================================================================== */

export const PDF_PATH = '/resume/vinothini-t-resume.pdf';

export const head = {
  name: 'Vinothini T',
  title: 'Computer Science Engineer — Full-Stack Development, AI & Business Development',
  location: 'Poonamalee, Chennai · 600056',
  email: 'vinoism1703@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinothini-t-08b4b4274/' },
    { label: 'GitHub', href: 'https://github.com/Vino1705' },
    { label: 'Portfolio', href: '/' },
  ],
};

export const summary =
  'Computer Science undergraduate (CGPA 8.9) with hands-on full-stack development experience ' +
  '(React.js, Node.js, MongoDB) and applied AI/NLP work using the OpenAI and Gemini APIs, ' +
  'including building and tuning a conversational chatbot. Combines this technical base with ' +
  'Business Development experience — client engagement, product pitching, and lead qualification ' +
  '— gained at an AI healthtech startup, where she also tested product features end-to-end and ' +
  'converted user feedback into actionable product insights.';

export const technicalSkills = [
  { label: 'Languages', items: 'JavaScript' },
  { label: 'Frontend', items: 'React.js, HTML, CSS, Responsive UI Design' },
  { label: 'Backend', items: 'Node.js, REST APIs, API Integration' },
  { label: 'Database', items: 'MongoDB, Database Design' },
  { label: 'AI / NLP', items: 'OpenAI API, Gemini API, Prompt Engineering, Chatbot Design & Tuning' },
  { label: 'Data Handling', items: 'Data Cleaning & Structuring, User-Feedback / Sentiment Analysis' },
  { label: 'Practices & Tools', items: 'Git/GitHub, Unit Testing, Debugging, Canva' },
];

export const businessSkills = [
  { label: 'Client Engagement', items: 'Product pitching, prospect outreach, requirement gathering' },
  { label: 'Pipeline', items: 'Lead qualification, consistent follow-ups' },
  {
    label: 'Communication',
    items: 'Presenting technical products to non-technical stakeholders (English, Tamil)',
  },
];

export const experience = [
  {
    org: 'HealthPilot AI',
    role: 'Business Development & Software Testing Associate (Intern)',
    place: 'Chennai',
    points: [
      "Engaged prospective clients and pitched the platform's value proposition to drive interest and adoption.",
      'Supported lead outreach and qualification, maintaining consistent follow-ups with prospects.',
      'Tested product features end-to-end and converted user feedback into actionable insights for the product team.',
      'Communicated technical product capabilities clearly to non-technical stakeholders, gathering requirements and pain points that fed back into product positioning.',
    ],
  },
];

export const projects = [
  {
    name: 'Sahaay AI — Mental Wellness Chatbot',
    stack: 'Gemini API',
    points: [
      'Built a web-based AI chatbot and designed conversational flows, tuning responses for accuracy, reliability, and user engagement.',
      'Tested and refined bot responses through iterative review of interaction quality.',
    ],
  },
  {
    name: 'FinMate — Personal Finance Management Web Application',
    stack: 'React, Node.js, MongoDB',
    points: [
      'Built a full-stack budgeting application with a structured UI to track expenses and visualize personal financial data.',
      'Planned AI-driven spending insights, applying an analytical approach to turning raw data into user-facing recommendations.',
    ],
  },
  {
    name: 'RoadWatch — Citizen Road Issue Reporting Platform',
    stack: 'React, Geolocation',
    points: [
      'Built a citizen-facing mobile app using geolocation to capture photos and report road issues on the spot.',
      'Built a government-side web app to receive, track, and manage reported issues end-to-end.',
    ],
  },
];

export const achievements = [
  { place: 'Top 12 Winning Team', event: 'Intel AI Hackathon 2025' },
  { place: 'Special Mention', event: 'ASME IMECE India Hackathon 2025' },
  { place: 'Runner-Up', event: "VOID V1'25 Hackathon, VIT" },
  { place: 'Regional Finalist', event: 'Nxtwave × OpenAI Buildathon' },
  { place: 'National Finalist', event: 'India AI Impact Summit 2026, New Delhi' },
  { place: 'National Finalist', event: 'India Innovates 2026, New Delhi' },
];

export const education = {
  degree: 'B.E. Computer Science and Engineering',
  school: 'Saveetha Engineering College, Chennai',
  detail: 'Expected May 2027 · CGPA 8.9',
};

export const certifications = [
  'Zoho Creators Student Training Program',
  'Website Designing and Development — Internship',
];

export const additional = [
  { label: 'Languages', items: 'English, Tamil' },
  {
    label: 'Availability',
    items:
      'Open to internship / full-time conversion; based in Chennai (open to office or remote as required)',
  },
];
