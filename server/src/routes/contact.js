import { Router } from 'express';

const router = Router();

/* Very small in-memory rate limiter: 5 messages per IP per 10 minutes. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip)?.filter((t) => now - t < WINDOW_MS) ?? [];
  entry.push(now);
  hits.set(ip, entry);
  return entry.length > MAX_HITS;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const clean = (v) => String(v ?? '').trim();

router.post('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many messages — try again in a bit.' });
  }

  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const subject = clean(req.body?.subject);
  const message = clean(req.body?.message);
  const botcheck = clean(req.body?.botcheck);

  if (botcheck) return res.json({ ok: true }); // honeypot tripped — pretend it worked

  const errors = {};
  if (name.length < 2) errors.name = 'Tell me your name.';
  if (!isEmail(email)) errors.email = 'That email looks off.';
  if (subject.length < 2) errors.subject = 'What is it about?';
  if (message.length < 10) errors.message = 'A few more words, please.';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.log('[contact] (no WEB3FORMS_ACCESS_KEY set — logging instead)', {
      name,
      email,
      subject,
      message,
    });
    return res.json({ ok: true, delivered: false });
  }

  try {
    const upstream = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: 'Portfolio · vino.made',
        subject: `[vino.made] ${subject}`,
        name,
        email,
        message,
      }),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok || data.success === false) {
      console.error('[contact] upstream rejected:', data);
      return res.status(502).json({ ok: false, error: 'Mail service refused the message.' });
    }
    return res.json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[contact] upstream error:', err);
    return res.status(502).json({ ok: false, error: 'Could not reach the mail service.' });
  }
});

export default router;
