import { Router } from 'express';

import { handleContact } from '../../../api/_core/contact.js';

/* Express wrapper around the shared contact logic (see api/_core/contact.js),
   so local dev and the Vercel function behave identically. */

const router = Router();

router.post('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';

  const { status, body } = await handleContact({
    body: req.body,
    ip,
    accessKey: process.env.WEB3FORMS_ACCESS_KEY,
  });

  res.status(status).json(body);
});

export default router;
