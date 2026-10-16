# Deepak Kumar Singh — Portfolio

A dark, cinematic, scroll-driven portfolio with an optional AI-narrated guided tour.
Built with React 19, Vite, TypeScript, Tailwind CSS and GSAP ScrollTrigger.

All content comes from the resume (`public/assets/Deepak-Kumar-Singh-Resume.pdf`, October 2026 version) and lives in one file: `src/data/portfolio.ts`. The narration is generated from that same data, so the site and the audio never disagree.

---

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
npm run lint
```

The site works fully with no API keys. Narration falls back to the visitor's built-in browser voice, and every section has a readable transcript.

---

## Project structure

```
src/
  data/portfolio.ts        ← all content (edit this)
  data/types.ts            ← content types
  config/site.ts           ← narration languages, music, tour settings
  narration/scripts.ts     ← builds narration text (English + Hindi/Hinglish) from the data
  narration/hash.ts        ← text hash used to detect stale audio
  audio/controller.ts      ← the one narration controller (no overlapping audio)
  audio/providers/         ← pre-generated MP3 provider + browser-speech fallback
  audio/music.ts           ← optional background music (generated ambient pad)
  tour/tour.ts             ← guided tour state machine
  animation/               ← GSAP setup, reduced-motion handling, active-section tracking
  components/              ← Navbar, AudioDock, SectionNarration, mockups, icons…
  sections/                ← Hero, About, Skills, Projects, Experience, Education, AiWorkflow, Contact
scripts/generate-narration.ts  ← build-time TTS generation (keys stay on your machine)
public/images/             ← portrait variants (cutout, face crop, eye strip, avatar, OG image)
public/audio/narration/    ← generated MP3s + manifest.json
```

---

## Editing content

Everything visible on the page (and everything the narrator says) comes from `src/data/portfolio.ts`:

- `personal`: name, contact, links, availability badge
- `stats`: hero numbers (each has a `source` note)
- `about`, `skillGroups`, `aiTools`, `aiWorkflow`
- `experience`: roles with resume bullets verbatim
- `projects`: case studies. Only `published: true` projects are shown and narrated.
- `education`, `certifications`

After editing, run `npm run narration:generate` if you use pre-generated audio. Changed sections are detected by hash and regenerated; unchanged ones are reused.

### Needs your verification

| Item | Where | Status |
| --- | --- | --- |
| LinkedIn URL | `personal.links.linkedin` | **Missing.** The resume's link is a placeholder (`linkedin.com/in/YOUR-LINKEDIN`). The button stays hidden until you set it. |
| GitHub URL | `personal.links.github` | **Missing.** The resume's link is a placeholder (`github.com/YOUR-GITHUB`). The button stays hidden until you set it. Fix the PDF too. |
| ApnaJob live link | `projects[apnajob].links.live` | From the resume (`lsd.qzz.io`), but it **did not respond** when checked on 2026-10-17. Remove it if the site is down. |
| Chat app links | `projects[chat].links` | None on the resume. Add a GitHub or demo link if one exists. |
| Availability badge | `personal.availability` | "Open to roles & freelance projects" is not on the resume. Set to `null` to hide it. |
| "How I use it" lines | `aiTools[].howIUse`, `aiWorkflow` | Written to describe a typical workflow. Edit them to match how you actually use each tool. |
| Problem/solution framing | `projects[].problem/solution` | Derived from the resume bullets. Contributions and stacks are resume-backed; the framing is editorial. |
| PrimeXSphere stack | `projects[primexsphere-site].stack` | Taken from the project repository (React, Vite, Express, Prisma, PostgreSQL), not the resume. |
| Candidate projects | `unverifiedCandidates` in `portfolio.ts` | WhatsApp Automation SaaS, E-commerce, School Management and AI Live Translation are **hidden** because they are not on the resume. Fill them in and set `published: true` once confirmed. |
| Certifications | `certifications` | None on the resume, so the block is hidden. |
| Firebase | — | Not on the resume, so it is not listed. |

Hero stats are all resume-backed: 4 roles since Oct 2024, 500+ payroll users, 30% less UI build effort.

---

## Narration

### How it works

Each section has a **Listen** button and a **Transcript** toggle. The floating **Audio guide** (bottom-right) has play/pause, stop, replay, seek, volume, mute, language (English / हिन्दी-Hinglish), music and the guided tour. Nothing plays until the visitor clicks.

The narrator speaks in the third person and says up front that it is a **synthetic, AI-generated voice, not Deepak's own**. No voice cloning is used.

Audio sources, tried in order (`src/audio/index.ts`):

1. **Pre-generated MP3s** in `public/audio/narration/`, made at build time with a real TTS provider. A file is used only if its manifest hash matches the current text, so stale audio is never played.
2. **The browser's built-in speech synthesis** (free, no key). Quality depends on the device. Chrome, Edge and Safari ship good voices; Hindi needs a Hindi voice on the device.
3. If neither is available, the player says so and opens the transcript, and the tour switches to a silent mode that shows each transcript on a timer.

If an MP3 fails to load, playback falls back to the browser voice automatically and says so in the player.

### Generating high-quality narration (optional)

No key is configured in this repo, so **no MP3s have been generated yet**. To generate them:

1. Pick one provider and put its key in **`.env.local`** (git-ignored, never committed):

   | Provider | Env var | Cost | Notes |
   | --- | --- | --- | --- |
   | Google Cloud Text-to-Speech (recommended) | `GOOGLE_TTS_API_KEY` | Monthly free tier, then pay as you go | Native Indian-English (`en-IN`) and Hindi (`hi-IN`) voices. Enable the Text-to-Speech API in a Google Cloud project, create an API key, and restrict it to that API. |
   | ElevenLabs | `ELEVENLABS_API_KEY` | Free plan with a small monthly character quota; paid plans above | Most natural voices; `eleven_multilingual_v2` also speaks Hindi. Check the plan's attribution and commercial-use terms. |
   | OpenAI | `OPENAI_API_KEY` | Paid per character | `gpt-4o-mini-tts`, voice `onyx` by default. |

   Optional voice overrides are listed in `.env.example`. Set `TTS_PROVIDER` if more than one key is present.

2. Preview the scripts and character counts (makes no API calls):

   ```bash
   npm run narration:preview
   ```

   Currently about **5,400 characters in English** and **4,900 in Hindi** for all 8 sections.

3. Generate:

   ```bash
   npm run narration:generate                 # all languages, only changed sections
   npm run narration:generate -- --lang en    # English only (saves quota)
   npm run narration:generate -- --force      # regenerate everything
   ```

   This writes `public/audio/narration/<lang>/<section>.mp3` and updates `manifest.json`. **Commit those files** so production serves them as static assets. The site picks them up automatically.

Keys are read only by the Node script at build time. Nothing secret is bundled into the browser (only `VITE_`-prefixed variables reach the client, and no TTS variable uses that prefix).

### Hindi / Hinglish

The Hindi narration is Devanagari with English technical terms, built from the same data (a few Hindi phrases live next to their English versions in `portfolio.ts`: `experienceLabelHi`, `availabilityHi`, `aiTools[].howIUseHi`, `aiWorkflow.principleHi`). Visitors switch language in the Audio guide.

### Background music

Off by default and only starts when the visitor switches it on. The default source is an ambient pad **synthesized live with the Web Audio API**, so there is no recorded track and nothing to license. It dips automatically while narration plays. To use a properly licensed track instead, put it in `public/audio/music/` and change `siteConfig.music.source` in `src/config/site.ts`.

### Guided tour

"Take a guided tour" (hero, navbar or Audio guide) scrolls to each section in order and narrates it, with progress, pause/resume, skip and exit. Normal scrolling keeps working throughout. If the visitor starts another section's narration, the tour pauses; Resume replays the interrupted step.

---

## Accessibility and motion

- Respects `prefers-reduced-motion`: no GSAP animations, no smooth scrolling, and everything renders static.
- Reveal animations use opacity only, so not-yet-revealed controls stay keyboard-focusable and reveal when focused.
- Skip link, visible focus rings, labelled controls, `aria-live` status for narration and tour, transcripts for all audio.
- Tested at 360, 390, 820 and 1440 px wide with no horizontal overflow.

---

## Contact form

Uses [Web3Forms](https://web3forms.com) when `VITE_WEB3FORMS_ACCESS_KEY` holds a real key (a UUID; this key is designed to be public). The current `.env` holds the placeholder, so **the form currently opens the visitor's email app** with the message pre-filled, addressed to the resume email. It never shows a success message unless Web3Forms confirms delivery.

---

## Deployment

It is a static site (`dist/`). Any static host works.

**Vercel / Netlify**
1. Push the repo to GitHub.
2. Import it. Build command `npm run build`, output directory `dist`.
3. Optional env var: `VITE_WEB3FORMS_ACCESS_KEY`.
4. Generate narration locally (`npm run narration:generate`) and commit the MP3s, or add the TTS key as a build secret and run `npm run narration:generate && npm run build` as the build command.

**Your own server / nginx**: copy `dist/` to the web root. Cache `assets/` and `audio/` aggressively; keep `index.html` and `audio/narration/manifest.json` short-cached.

**Sub-path hosting** (e.g. GitHub Pages at `/portfolio/`): set `base: '/portfolio/'` in `vite.config.ts`. Asset and audio paths already follow Vite's base URL.

**Social previews**: `index.html` points `og:image` at `/images/og-image.jpg`. Some platforms need an absolute URL, so change it to `https://your-domain/images/og-image.jpg` once the domain is known.

---

## Housekeeping

- `_legacy/` holds the previous version's components, kept in case you want anything back. It is excluded from the build and lint; delete it when you no longer need it.
- `public/assets/Deepak_Kumar_Singh_Resume.pdf` is the **older (August) resume**. The site links the new `Deepak-Kumar-Singh-Resume.pdf`. Delete the old file so it is no longer publicly served.
