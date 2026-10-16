// Builds the narration for each section from the same portfolio data the page
// renders, so the spoken words and the on-screen transcript never drift from
// the content. Third-person narrator: the voice is synthetic and never claims
// to be Deepak.
//
// The Hindi scripts are Hinglish (Devanagari with English technical terms).
// Sentences are built around the work ("ne ... kaam kiya", "kaam jaari hai")
// so verbs do not have to agree with the subject's gender.

import type { Lang } from '../config/site.ts';
import { portfolio, publishedProjects } from '../data/portfolio.ts';
import type { SectionId, YearMonth } from '../data/types.ts';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const monthYear = (ym: YearMonth) => {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

function list(items: string[], lang: Lang): string {
  const and = lang === 'hi' ? 'और' : 'and';
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}

const lcFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const article = (s: string) => (/^[aeiou]/i.test(s) ? 'an' : 'a');
const spokenEmail = (email: string) => email.replace('@', ' at ').replace(/\./g, ' dot ');

/** Turn display text into something a TTS voice reads naturally. */
export function speakable(text: string, lang: Lang): string {
  const and = lang === 'hi' ? ' और ' : ' and ';
  return text
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/CI\/CD/g, 'CI CD')
    .replace(/B\.Tech/g, 'B. Tech')
    .replace(/\s+Pvt\.?\s*Ltd\.?/g, '')
    .replace(/(\d+)\+/g, '$1-plus')
    .replace(/\s*\/\s*/g, and)
    .replace(/\s*&\s*/g, and)
    .replace(/\s+[–—]\s+/g, ', ')
    .replace(/\s*·\s*/g, ', ')
    .replace(/\*/g, '')
    .replace(/\.\.(?!\.)/g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const { personal: me } = portfolio;
const first = me.firstName;
const current = portfolio.experience.find((r) => r.end === null) ?? portfolio.experience[0];
const past = portfolio.experience.filter((r) => r !== current);
const edu = portfolio.education[0];
const lead = publishedProjects[0];
const skillName = (name: string, note: string | undefined, lang: Lang) =>
  note ? (lang === 'hi' ? `${name}, ${note} level पर` : `${name}, at a ${note} level`) : name;

type Builder = Record<Lang, () => string>;

const builders: Record<SectionId, Builder> = {
  home: {
    en: () =>
      `Welcome. This is the portfolio of ${me.name}, ${article(me.role)} ${me.role.toLowerCase()} based in ${me.location}. ` +
      `${first}'s work covers ${list(me.focus, 'en')}, built mainly with ${list(me.coreStack, 'en')}. ` +
      `You can scroll at your own pace, or start the guided tour to hear each section in turn. ` +
      `One note before we begin: this narration uses a synthetic, AI-generated voice. It is not ${first}'s own voice.`,
    hi: () =>
      `नमस्ते! यह ${me.name} का portfolio है। ${first}, ${me.location} में based एक ${me.role} हैं। ` +
      `उनका काम ${list(me.focus, 'hi')} पर है, और इसके लिए मुख्य रूप से ${list(me.coreStack, 'hi')} का इस्तेमाल होता है। ` +
      `आप अपनी रफ़्तार से scroll कर सकते हैं, या guided tour शुरू करके हर section सुन सकते हैं। ` +
      `एक ज़रूरी बात: यह narration एक synthetic, AI-generated आवाज़ में है। यह ${first} की अपनी आवाज़ नहीं है।`,
  },

  about: {
    en: () =>
      `About ${first}. ${first} is a software engineer from ${me.location}, with ${me.experienceLabel} of professional experience. ` +
      `The journey so far includes ${list(past.map((r) => r.company), 'en')}, and today ${first} works as ${article(current.title)} ${current.title.toLowerCase()} at ${current.company}. ` +
      `Recent work has centred on ${list(me.focus, 'en')}, including ${lead.name}, ${article(lead.tagline)} ${lcFirst(lead.tagline)}${lead.context ? `, at ${lead.context}` : ''}. ` +
      `${first} studied ${edu.field} with a specialization in ${edu.specialization}, from ${edu.start} to ${edu.end}.`,
    hi: () =>
      `${first} के बारे में। ${first}, ${me.location} से एक software engineer हैं, और उनके पास ${me.experienceLabelHi} का professional अनुभव है। ` +
      `अब तक उन्होंने ${list(past.map((r) => r.company), 'hi')} में काम किया है, और अभी ${current.company} में ${current.title} के तौर पर काम जारी है। ` +
      `हाल के काम का focus ${list(me.focus, 'hi')} रहा है, जिसमें ${lead.context ? `${lead.context} में ` : ''}${lead.name} शामिल है: ${lead.tagline}। ` +
      `पढ़ाई ${edu.field} में हुई, ${edu.specialization} specialization के साथ, ${edu.start} से ${edu.end} तक।`,
  },

  skills: {
    en: () =>
      `Here is ${first}'s toolkit, grouped by area. ` +
      portfolio.skillGroups
        .map((g) => `${g.title}: ${list(g.skills.map((s) => skillName(s.name, s.note, 'en')), 'en')}.`)
        .join(' ') +
      ` Kept separate from the core stack are the AI and developer productivity tools: ${list(portfolio.aiTools.map((t) => t.name), 'en')}. ` +
      `The AI workflow section explains how they are used.`,
    hi: () =>
      `${first} का toolkit, area के हिसाब से। ` +
      portfolio.skillGroups
        .map((g) => `${g.title}: ${list(g.skills.map((s) => skillName(s.name, s.note, 'hi')), 'hi')}।`)
        .join(' ') +
      ` Core stack से अलग, AI और developer productivity tools हैं: ${list(portfolio.aiTools.map((t) => t.name), 'hi')}। ` +
      `इनका इस्तेमाल कैसे होता है, यह AI workflow section में बताया गया है।`,
  },

  projects: {
    en: () =>
      `A look at selected work. ` +
      publishedProjects
        .map((p) => `${p.name}: ${lcFirst(p.tagline)}${p.context ? `, built at ${p.context}` : ''}. ${p.solution}`)
        .join(' ') +
      ` Each case study on the page lists the problem, the solution, ${first}'s own contribution and the technology used.`,
    hi: () =>
      `अब कुछ चुने हुए projects। ` +
      publishedProjects
        .map(
          (p) =>
            `${p.name}: ${p.tagline}${p.context ? `, ${p.context} में` : ''}। इसमें ${list(p.stack.slice(0, 4), 'hi')} का इस्तेमाल हुआ।`,
        )
        .join(' ') +
      ` हर case study में problem, solution, ${first} का अपना योगदान और technology stack दिया गया है।`,
  },

  experience: {
    en: () =>
      `${first}'s professional journey, most recent first. ` +
      portfolio.experience
        .map((r) =>
          r.end
            ? `From ${monthYear(r.start)} to ${monthYear(r.end)}, ${first} worked as ${article(r.title)} ${r.title} at ${r.company}. ${r.summary}`
            : `Since ${monthYear(r.start)}, ${first} has been ${article(r.title)} ${r.title.toLowerCase()} at ${r.company}. ${r.summary}`,
        )
        .join(' '),
    hi: () =>
      `${first} का professional सफ़र, सबसे हाल के role से शुरू करते हुए। ` +
      portfolio.experience
        .map((r) =>
          r.end
            ? `${monthYear(r.start)} से ${monthYear(r.end)} तक, ${first} ने ${r.company} में ${r.title} के रूप में काम किया। मुख्य stack: ${list(r.stack.slice(0, 4), 'hi')}।`
            : `${monthYear(r.start)} से अब तक, ${r.company} में ${r.title} के रूप में काम जारी है।`,
        )
        .join(' '),
  },

  education: {
    en: () =>
      `Education. ${first} studied for ${article(edu.degree)} ${edu.degree} in ${edu.field}, specializing in ${edu.specialization}, ` +
      `at ${edu.institution}, affiliated with ${edu.universitySpoken}, from ${edu.start} to ${edu.end}.` +
      (portfolio.certifications.length ? ` Certifications: ${list(portfolio.certifications, 'en')}.` : ''),
    hi: () =>
      `शिक्षा। ${first} ने ${edu.start} से ${edu.end} तक ${edu.institution} से ${edu.field} में ${edu.degree} की पढ़ाई की, ` +
      `${edu.specialization} specialization के साथ। यह college ${edu.universitySpoken} से affiliated है।` +
      (portfolio.certifications.length ? ` Certifications: ${list(portfolio.certifications, 'hi')}।` : ''),
  },

  'ai-workflow': {
    en: () =>
      `How ${first} works with AI. ` +
      portfolio.aiTools.map((t) => `${t.name}, by ${t.maker}, is used for ${lcFirst(t.howIUse)}`).join(' ') +
      ` The workflow runs in ${portfolio.aiWorkflow.steps.length} steps: ${list(portfolio.aiWorkflow.steps.map((s) => s.title.toLowerCase()), 'en')}. ` +
      `${portfolio.aiWorkflow.principle} These are everyday tools, not certifications.`,
    hi: () =>
      `${first} के रोज़ के काम में AI-assisted development tools शामिल हैं। ` +
      portfolio.aiTools.map((t) => `${t.name}, ${t.maker} का tool है, और इसका इस्तेमाल ${t.howIUseHi} के लिए होता है।`).join(' ') +
      ` Workflow के ${portfolio.aiWorkflow.steps.length} कदम हैं: ${list(portfolio.aiWorkflow.steps.map((s) => s.title.toLowerCase()), 'hi')}। ` +
      `${portfolio.aiWorkflow.principleHi} ये रोज़ इस्तेमाल होने वाले tools हैं, certifications नहीं।`,
  },

  contact: {
    en: () =>
      `Let's talk. You can reach ${first} by email at ${spokenEmail(me.email)}, or by phone at the number shown on screen. ` +
      `${first} is based in ${me.location}${me.availability ? `, and is ${lcFirst(me.availability)}` : ''}. ` +
      `The latest resume can be downloaded from this page. Thanks for listening.`,
    hi: () =>
      `चलिए बात करते हैं! ${first} से email पर संपर्क करें: ${spokenEmail(me.email)}, या screen पर दिए गए number पर call करें। ` +
      `${first}, ${me.location} में based हैं${me.availabilityHi ? `, और ${me.availabilityHi} हैं` : ''}। ` +
      `Latest resume इसी page से download किया जा सकता है। सुनने के लिए धन्यवाद!`,
  },
};

export function buildNarration(section: SectionId, lang: Lang): string {
  return speakable(builders[section][lang](), lang);
}

export function buildAllNarrations(langs: Lang[] = ['en', 'hi']): { lang: Lang; section: SectionId; text: string }[] {
  const sections = Object.keys(builders) as SectionId[];
  return langs.flatMap((lang) => sections.map((section) => ({ lang, section, text: buildNarration(section, lang) })));
}
