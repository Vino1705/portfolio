import { Router } from 'express';
import { profile, wins, projects, experience } from '../data/content.js';

const router = Router();

/* Read-only content endpoints. The React app ships with the same content inline
   so the site works offline/static; these exist for résumé widgets, embeds and
   anything else that wants the data as JSON. */

router.get('/', (_req, res) => res.json({ ok: true, profile, counts: {
  projects: projects.length,
  wins: wins.length,
  roles: experience.length,
} }));

router.get('/profile', (_req, res) => res.json({ ok: true, profile }));
router.get('/projects', (_req, res) => res.json({ ok: true, projects }));
router.get('/experience', (_req, res) => res.json({ ok: true, experience }));
router.get('/wins', (_req, res) => res.json({ ok: true, wins }));

export default router;
