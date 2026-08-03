/* Contact-form logic, shared by both deployment targets:
   - api/contact.js        → Vercel serverless function (production)
   - server/src/routes/    → Express route (local dev, and any Node host)

   Kept dependency-free so the serverless bundle stays tiny. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SENDS = 5;

/* Best-effort rate limit. On a long-lived Node process this is exact; on
   serverless it only covers a warm instance, which still blunts naive spam.
   Web3Forms applies its own spam filtering on top.

   Only *delivered* messages count. Validation failures and honeypot hits do
   not, so someone fixing a typo five times is never locked out. */
const sends = new Map();

function recent(ip) {
  const now = Date.now();
  const entry = (sends.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (entry.length) sends.set(ip, entry);
  else sends.delete(ip); // keep the map from growing forever
  return entry;
}

/* Check only — does not consume an allowance. */
export function rateLimited(ip) {
  return recent(ip).length >= MAX_SENDS;
}

/* Call once a message has actually been accepted for delivery. */
export function recordSend(ip) {
  const entry = recent(ip);
  entry.push(Date.now());
  sends.set(ip, entry);
}

/* Whole minutes until the oldest send falls out of the window. */
export function retryAfterMinutes(ip) {
  const entry = recent(ip);
  if (!entry.length) return 0;
  return Math.max(1, Math.ceil((WINDOW_MS - (Date.now() - entry[0])) / 60000));
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
    const mins = retryAfterMinutes(ip);
    return {
      status: 429,
      body: {
        ok: false,
        error: `That's ${MAX_SENDS} messages already — try again in about ${mins} minute${
          mins === 1 ? '' : 's'
        }, or email me directly.`,
      },
    };
  }

  const { botcheck, data, errors } = validate(body);
  if (botcheck) return { status: 200, body: { ok: true } }; // honeypot — pretend it worked
  if (errors) return { status: 400, body: { ok: false, errors } }; // typos are free

  const result = await relay(data, accessKey);
  if (result.status === 200) recordSend(ip); // only real sends use an allowance
  return result;
}
