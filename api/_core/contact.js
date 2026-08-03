/* Contact-form logic, shared by both deployment targets:
   - api/contact.js        → Vercel serverless function (production)
   - server/src/routes/    → Express route (local dev, and any Node host)

   Kept dependency-free so the serverless bundle stays tiny. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

/* Best-effort rate limit. On a long-lived Node process this is exact; on
   serverless it only covers a warm instance, which still blunts naive spam.
   Web3Forms applies its own spam filtering on top. */
const hits = new Map();

export function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip)?.filter((t) => now - t < WINDOW_MS) ?? [];
  entry.push(now);
  hits.set(ip, entry);
  return entry.length > MAX_HITS;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const clean = (v) => String(v ?? '').trim();

/* Returns { botcheck, data, errors } — `errors` is null when valid. */
export function validate(body) {
  const data = {
    name: clean(body?.name),
    email: clean(body?.email),
    subject: clean(body?.subject),
    message: clean(body?.message),
  };

  if (clean(body?.botcheck)) return { botcheck: true, data, errors: null };

  const errors = {};
  if (data.name.length < 2) errors.name = 'Tell me your name.';
  if (!isEmail(data.email)) errors.email = 'That email looks off.';
  if (data.subject.length < 2) errors.subject = 'What is it about?';
  if (data.message.length < 10) errors.message = 'A few more words, please.';

  return { botcheck: false, data, errors: Object.keys(errors).length ? errors : null };
}

/* Relays to Web3Forms. Without a key it logs and reports delivered:false, so
   the form still works in local development. */
export async function relay(data, accessKey) {
  if (!accessKey) {
    console.log('[contact] no WEB3FORMS_ACCESS_KEY set — logging instead:', data);
    return { status: 200, body: { ok: true, delivered: false } };
  }

  try {
    const upstream = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: 'Portfolio · vino.made',
        subject: `[vino.made] ${data.subject}`,
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result.success === false) {
      console.error('[contact] upstream rejected:', result);
      return { status: 502, body: { ok: false, error: 'Mail service refused the message.' } };
    }
    return { status: 200, body: { ok: true, delivered: true } };
  } catch (err) {
    console.error('[contact] upstream error:', err);
    return { status: 502, body: { ok: false, error: 'Could not reach the mail service.' } };
  }
}

/* The whole flow, for callers that just want a status + body. */
export async function handleContact({ body, ip, accessKey }) {
  if (rateLimited(ip)) {
    return { status: 429, body: { ok: false, error: 'Too many messages — try again in a bit.' } };
  }

  const { botcheck, data, errors } = validate(body);
  if (botcheck) return { status: 200, body: { ok: true } }; // honeypot — pretend it worked
  if (errors) return { status: 400, body: { ok: false, errors } };

  return relay(data, accessKey);
}
