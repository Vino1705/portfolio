import { useState } from 'react';

import PhoneArt from './PhoneArt.jsx';
import { MailIcon, PhoneIcon, PinIcon, SendIcon, CheckIcon, socialIcon } from './Icons.jsx';
import { validateContact, submitContact } from '../lib/contactForm.js';
import { profile } from '../data/site.js';
import './Contact.css';

const EMPTY = { name: '', email: '', subject: '', message: '', botcheck: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [note, setNote] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErrors({});
    setNote('');

    const found = validateContact(form);
    if (found) {
      setErrors(found);
      setNote('Please check the fields above.');
      setState('error');
      return;
    }

    setState('sending');
    try {
      await submitContact(form);
      setForm(EMPTY);
      setState('sent');
      setTimeout(() => setState('idle'), 6000);
    } catch (err) {
      setState('error');
      setNote(`${err.message} You can also email me directly at ${profile.email}.`);
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="panel panel--deep" data-reveal>
        <header className="section-head contact-head">
          <span className="eyebrow">let&rsquo;s make something</span>
          <h2 className="section-title">
            Got a problem worth <em>solving</em>?
          </h2>
          <p className="section-lead">
            A product to build, a brand that needs to pop, or a second brain on a tricky idea —
            I reply fast, and I&rsquo;m genuinely nice to work with. 🌷
          </p>
        </header>

        <div className="contact-card">
          {/* ------------------------- phone side ------------------------- */}
          <aside className="cc-visual on-paper">
            <PhoneArt />

            <p className="cc-hint">Prefer to just talk?</p>

            <ul className="contact-list">
              <li>
                <MailIcon width={18} height={18} />
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <PhoneIcon width={18} height={18} />
                <a href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
              </li>
              <li>
                <PinIcon width={18} height={18} />
                {profile.location}
              </li>
            </ul>

            <div className="socials">
              {profile.socials.map((s) => {
                const Ico = socialIcon[s.id] ?? MailIcon;
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    target={s.id === 'mail' ? undefined : '_blank'}
                    rel="noopener"
                    aria-label={s.label}
                  >
                    <Ico width={19} height={19} />
                  </a>
                );
              })}
            </div>
          </aside>

          {/* -------------------------- form side -------------------------- */}
          <div className="cc-form">
            <h3 className="cc-title">Tell me about it</h3>
            <p className="cc-sub">Fill this in and it lands straight in my inbox.</p>

            <form onSubmit={onSubmit} noValidate>
              <input
                type="text"
                name="botcheck"
                value={form.botcheck}
                onChange={update('botcheck')}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="honeypot"
              />

              <div className="field">
                <label htmlFor="name">Name and surname</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                />
                {errors.name && <span className="field-err">{errors.name}</span>}
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="jane@company.com"
                  autoComplete="email"
                  required
                />
                {errors.email && <span className="field-err">{errors.email}</span>}
              </div>

              <div className="field">
                <label htmlFor="subject">What&rsquo;s it about?</label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={update('subject')}
                  placeholder="A project, a role, a hello…"
                  required
                />
                {errors.subject && <span className="field-err">{errors.subject}</span>}
              </div>

              <div className="field">
                <label htmlFor="message">Please enter the details of your request</label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell me the fun part…"
                  required
                />
                {errors.message && <span className="field-err">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={state === 'sending'}
              >
                {state === 'sending' ? (
                  'Sending…'
                ) : state === 'sent' ? (
                  <>
                    <CheckIcon width={18} height={18} /> Sent — talk soon!
                  </>
                ) : (
                  <>
                    <SendIcon width={18} height={18} /> Send it over
                  </>
                )}
              </button>

              <p className={`form-note${state === 'error' ? ' is-error' : ''}`} role="status">
                {state === 'sent'
                  ? "Got it — I'll get back to you soon ✿"
                  : note || 'No newsletters, no spam. Promise.'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
