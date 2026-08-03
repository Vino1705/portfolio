import { handleContact } from './_core/contact.js';

/* Vercel serverless function → POST /api/contact */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const { status, body } = await handleContact({
    body: req.body,
    ip,
    accessKey: process.env.WEB3FORMS_ACCESS_KEY,
  });

  return res.status(status).json(body);
}
