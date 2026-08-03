/* Contact form: validation + submission.

   The message is sent **straight from the browser** to Web3Forms. That is not
   an oversight — Web3Forms rejects server-side calls on the free plan:

     403 "This method is not allowed. Use our API in client side or contact
          support with server IP address (Pro plan is required)"

   Their access keys are public by design; every example in their docs puts one
   in plain HTML. It identifies the destination inbox, it does not authorise
   anything on your behalf, and it cannot be used to read past submissions.

   Spam handling is therefore Web3Forms' job (plus the honeypot below), which is
   the trade they intend on the free tier. */

const ENDPOINT = 'https://api.web3forms.com/submit';

/* Public by design — see the note above. */
export const ACCESS_KEY = 'a5a582b3-1479-41e6-9cf4-cdf79427379e';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/* Returns an errors object, or null when the form is good to send. */
export function validateContact(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Tell me your name.';
  if (!isEmail(form.email.trim())) errors.email = 'That email looks off.';
  if (form.subject.trim().length < 2) errors.subject = 'What is it about?';
  if (form.message.trim().length < 10) errors.message = 'A few more words, please.';
  return Object.keys(errors).length ? errors : null;
}

/* Throws with a readable message on failure; resolves on success. */
export async function submitContact(form) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      from_name: 'vino.made portfolio',
      subject: `[vino.made] ${form.subject.trim()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      // Web3Forms drops the submission if this is filled — bots do, people don't.
      botcheck: form.botcheck,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'The mail service refused the message.');
  }
  return data;
}
