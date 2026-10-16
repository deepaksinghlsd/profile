import { Check, Copy, Download, ExternalLink, Github, Linkedin, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { gsap, revealOnScroll, useMotion } from '../animation/gsap';
import { SectionHeader } from '../components/SectionHeader';
import { portfolio } from '../data/portfolio';
import { asset } from '../lib/asset';

// Web3Forms access keys are UUIDs and are meant to be public. Without a real
// key the form falls back to opening a pre-filled email instead of pretending
// to send.
const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '').trim();
const FORM_ENABLED = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(WEB3FORMS_KEY);

const LIMITS = { name: [2, 80], subject: [0, 120], message: [10, 3000] } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'mailto' } | { kind: 'error'; message: string };

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li data-contact-row className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-neon">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-400">{label}</p>
        <div className="mt-0.5 break-words text-[15px] font-medium text-white">{children}</div>
      </div>
    </li>
  );
}

function ContactForm() {
  const me = portfolio.personal;
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '', botcheck: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const update = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  function validate() {
    const e: typeof errors = {};
    const name = values.name.trim();
    const message = values.message.trim();
    if (name.length < LIMITS.name[0] || name.length > LIMITS.name[1]) e.name = 'Please enter your name (2–80 characters).';
    if (!EMAIL_RE.test(values.email.trim())) e.email = 'Please enter a valid email address.';
    if (values.subject.length > LIMITS.subject[1]) e.subject = 'Please keep the subject under 120 characters.';
    if (message.length < LIMITS.message[0] || message.length > LIMITS.message[1]) e.message = 'Please write a message of 10–3000 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const name = values.name.trim();
    const subject = values.subject.trim() || `Portfolio enquiry from ${name}`;

    if (!FORM_ENABLED) {
      const body = `${values.message.trim()}\n\n— ${name} (${values.email.trim()})`;
      window.location.href = `mailto:${me.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: 'mailto' });
      return;
    }
    if (values.botcheck) return; // honeypot filled: silently drop

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email: values.email.trim(),
          subject,
          message: values.message.trim(),
          from_name: `${me.name} Portfolio`,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus({ kind: 'sent' });
        setValues({ name: '', email: '', subject: '', message: '', botcheck: '' });
      } else {
        setStatus({ kind: 'error', message: data.message || `The message could not be sent (HTTP ${res.status}).` });
      }
    } catch {
      setStatus({ kind: 'error', message: 'The message could not be sent. Check your connection, or email directly.' });
    }
  }

  const field =
    'mt-2 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-[15px] text-white placeholder:text-ink-400 transition focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/20 aria-[invalid=true]:border-amber-300/70';
  const label = 'font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-300';
  const err = (k: keyof typeof values) =>
    errors[k] && (
      <p id={`cf-${k}-err`} className="mt-1.5 text-xs text-amber-300/90">
        {errors[k]}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate data-reveal className="card p-5 sm:p-7" aria-describedby="cf-mode">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            Name
          </label>
          <input id="cf-name" autoComplete="name" value={values.name} onChange={update('name')} maxLength={80} className={field} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>
            Email
          </label>
          <input id="cf-email" type="email" autoComplete="email" value={values.email} onChange={update('email')} maxLength={254} className={field} placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} />
          {err('email')}
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="cf-subject" className={label}>
          Subject <span className="normal-case tracking-normal text-ink-400">(optional)</span>
        </label>
        <input id="cf-subject" value={values.subject} onChange={update('subject')} maxLength={120} className={field} placeholder="Role, project or question" aria-invalid={!!errors.subject} />
        {err('subject')}
      </div>
      <div className="mt-5">
        <label htmlFor="cf-message" className={label}>
          Message
        </label>
        <textarea id="cf-message" rows={5} value={values.message} onChange={update('message')} maxLength={3000} className={`${field} resize-y`} placeholder="Tell me a little about what you have in mind…" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cf-message-err' : undefined} />
        {err('message')}
      </div>
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={update('botcheck')} className="hidden" aria-hidden="true" />

      <button type="submit" disabled={status.kind === 'sending'} className="btn-primary mt-6 w-full">
        {status.kind === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : FORM_ENABLED ? <Send className="h-5 w-5" aria-hidden="true" /> : <Mail className="h-5 w-5" aria-hidden="true" />}
        {status.kind === 'sending' ? 'Sending…' : FORM_ENABLED ? 'Send message' : 'Open in my email app'}
      </button>
      <p id="cf-mode" className="mt-3 text-xs leading-relaxed text-ink-400">
        {FORM_ENABLED
          ? 'Your message is delivered by Web3Forms to my inbox.'
          : `This opens your email app with the message filled in, addressed to ${me.email}.`}
      </p>

      <div role="status" aria-live="polite">
        {status.kind === 'sent' && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-neon/30 bg-neon/10 p-3 text-sm text-neon">
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Thanks! Your message was delivered. I'll get back to you soon.
          </p>
        )}
        {status.kind === 'mailto' && (
          <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-ink-200">
            Your email app should have opened with the message ready to send. If nothing happened, email{' '}
            <a className="text-neon underline" href={`mailto:${me.email}`}>
              {me.email}
            </a>{' '}
            directly.
          </p>
        )}
        {status.kind === 'error' && <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-200">{status.message}</p>}
      </div>
    </form>
  );
}

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const me = portfolio.personal;
  const [copied, setCopied] = useState(false);
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard;

  useMotion(ref, ({ q }) => {
    revealOnScroll(q('[data-reveal]'));
    revealOnScroll(q('[data-contact-row]'), { y: 20, stagger: 0.07 });
    gsap.fromTo(
      q('[data-eyes-img]'),
      { xPercent: -6, scale: 1.1 },
      { xPercent: 2, scale: 1, ease: 'none', scrollTrigger: { trigger: q('[data-eyes]')[0], start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(me.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const tel = me.phone.replace(/[^\d+]/g, '');

  return (
    <section id="contact" ref={ref} aria-labelledby="contact-title" className="relative pb-24 sm:pb-32">
      <div data-eyes className="relative h-[150px] overflow-hidden border-b border-white/[0.05] sm:h-[240px]" aria-hidden="true">
        <img
          data-eyes-img
          src={asset('images/portrait-eyes.webp')}
          alt=""
          width={1200}
          height={400}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center grayscale contrast-125 brightness-[.7]"
        />
        <div className="absolute inset-0 bg-neon/10 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-transparent to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-ink-950" />
      </div>

      <div className="container-x mt-16 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeader
            index="07"
            eyebrow="Contact"
            section="contact"
            title={
              <>
                Let's build something <span className="text-neon">great together.</span>
              </>
            }
            intro="Have a role, a project or a question? Email is the quickest way to reach me."
          />
          <ul className="mt-10 grid gap-3">
            <ContactRow icon={<Mail className="h-5 w-5" />} label="Email">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a href={`mailto:${me.email}`} className="inline-block py-1.5 hover:text-neon">
                    {me.email}
                  </a>
                  {canCopy && (
                    <button type="button" onClick={copyEmail} className="inline-flex min-h-[32px] items-center gap-1 text-xs font-semibold text-ink-300 hover:text-neon">
                      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </ContactRow>
            <ContactRow icon={<Phone className="h-5 w-5" />} label="Phone">
                <a href={`tel:${tel}`} className="inline-block py-1.5 hover:text-neon">
                  {me.phone}
                </a>
              </ContactRow>
            <ContactRow icon={<MapPin className="h-5 w-5" />} label="Location">
                {me.location}
              </ContactRow>
            {me.links.website && (
              <ContactRow icon={<ExternalLink className="h-5 w-5" />} label="Freelance practice">
                  <a href={me.links.website} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 hover:text-neon">
                    {new URL(me.links.website).host}
                  </a>
                </ContactRow>
            )}
          </ul>
          <div data-reveal className="mt-6 flex flex-wrap gap-3">
            <a href={asset(me.resume.href)} download={me.resume.fileName} className="btn-outline">
              <Download className="h-5 w-5" aria-hidden="true" />
              Download Resume
            </a>
            {me.links.linkedin && (
              <a href={me.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost" aria-label="LinkedIn profile">
                <Linkedin className="h-5 w-5" aria-hidden="true" /> LinkedIn
              </a>
            )}
            {me.links.github && (
              <a href={me.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" aria-label="GitHub profile">
                <Github className="h-5 w-5" aria-hidden="true" /> GitHub
              </a>
            )}
          </div>
        </div>

        <div className="lg:pt-16">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
