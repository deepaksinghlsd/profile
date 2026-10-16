/**
 * Generates narration MP3s from the portfolio data with a real text-to-speech
 * provider and writes them to public/audio/narration/, plus a manifest the
 * site reads. API keys are read here, at build time, and never reach the
 * browser bundle.
 *
 * Usage:
 *   npm run narration:generate                 # all languages, only changed sections
 *   npm run narration:generate -- --lang en    # one language
 *   npm run narration:generate -- --force      # regenerate everything
 *   npm run narration:generate -- --dry-run    # print scripts + character counts, call nothing
 *
 * Provider is chosen by TTS_PROVIDER (google | elevenlabs | openai), or by
 * whichever key is present. See README "Narration" for setup.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { langConfig, type Lang } from '../src/config/site.ts';
import { textHash } from '../src/narration/hash.ts';
import type { NarrationManifest } from '../src/narration/manifest.ts';
import { buildAllNarrations } from '../src/narration/scripts.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'audio', 'narration');
const manifestPath = join(outDir, 'manifest.json');

for (const file of ['.env', '.env.local']) {
  const p = join(root, file);
  if (existsSync(p)) {
    try {
      process.loadEnvFile(p);
    } catch {
      /* ignore malformed env files */
    }
  }
}

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const langs = (option('lang')?.split(',') ?? ['en', 'hi']) as Lang[];
const env = (k: string) => process.env[k]?.trim() || undefined;

interface Provider {
  id: string;
  voice: (lang: Lang) => string;
  synthesize: (text: string, lang: Lang) => Promise<Buffer>;
}

async function check(res: Response, provider: string): Promise<Response> {
  if (res.ok) return res;
  const body = (await res.text()).slice(0, 400);
  throw new Error(`${provider} returned HTTP ${res.status}: ${body}`);
}

const providers: Record<string, () => Provider | null> = {
  // Google Cloud Text-to-Speech: has a monthly free tier and native Indian
  // English and Hindi voices. Needs an API key with the TTS API enabled.
  google: () => {
    const key = env('GOOGLE_TTS_API_KEY');
    if (!key) return null;
    const voice = (lang: Lang) =>
      lang === 'hi' ? (env('GOOGLE_TTS_VOICE_HI') ?? 'hi-IN-Neural2-B') : (env('GOOGLE_TTS_VOICE_EN') ?? 'en-IN-Neural2-B');
    return {
      id: 'google',
      voice,
      synthesize: async (text, lang) => {
        const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: { languageCode: langConfig(lang).speechLang, name: voice(lang) },
            audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 },
          }),
        });
        const data = (await (await check(res, 'Google TTS')).json()) as { audioContent?: string };
        if (!data.audioContent) throw new Error('Google TTS returned no audio.');
        return Buffer.from(data.audioContent, 'base64');
      },
    };
  },

  // ElevenLabs: very natural voices; the multilingual model also speaks Hindi.
  // Free plan has a small monthly character quota and its own attribution terms.
  elevenlabs: () => {
    const key = env('ELEVENLABS_API_KEY');
    if (!key) return null;
    const voiceId = env('ELEVENLABS_VOICE_ID') ?? 'JBFqnCBsd6RMkjVDRZzb';
    const model = env('ELEVENLABS_MODEL') ?? 'eleven_multilingual_v2';
    return {
      id: 'elevenlabs',
      voice: () => `${voiceId} (${model})`,
      synthesize: async (text) => {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
          method: 'POST',
          headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
          body: JSON.stringify({ text, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
        });
        return Buffer.from(await (await check(res, 'ElevenLabs')).arrayBuffer());
      },
    };
  },

  // OpenAI text-to-speech: paid per character, no free tier.
  openai: () => {
    const key = env('OPENAI_API_KEY');
    if (!key) return null;
    const model = env('OPENAI_TTS_MODEL') ?? 'gpt-4o-mini-tts';
    const voice = env('OPENAI_TTS_VOICE') ?? 'onyx';
    return {
      id: 'openai',
      voice: () => `${voice} (${model})`,
      synthesize: async (text) => {
        const res = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, voice, input: text, response_format: 'mp3' }),
        });
        return Buffer.from(await (await check(res, 'OpenAI')).arrayBuffer());
      },
    };
  },
};

function pickProvider(): Provider | null {
  const wanted = env('TTS_PROVIDER');
  if (wanted) {
    const make = providers[wanted];
    if (!make) throw new Error(`Unknown TTS_PROVIDER "${wanted}". Use one of: ${Object.keys(providers).join(', ')}.`);
    const p = make();
    if (!p) throw new Error(`TTS_PROVIDER=${wanted} but its API key is not set. See README "Narration".`);
    return p;
  }
  for (const make of Object.values(providers)) {
    const p = make();
    if (p) return p;
  }
  return null;
}

function readManifest(): NarrationManifest {
  try {
    const m = JSON.parse(readFileSync(manifestPath, 'utf8')) as NarrationManifest;
    if (m.version === 1 && m.entries) return m;
  } catch {
    /* start fresh */
  }
  return { version: 1, entries: {} };
}

async function main() {
  const items = buildAllNarrations(langs);
  const totals = new Map<Lang, number>();
  items.forEach((i) => totals.set(i.lang, (totals.get(i.lang) ?? 0) + i.text.length));

  if (flag('dry-run')) {
    for (const i of items) console.log(`\n── ${i.lang}/${i.section} · ${i.text.length} chars · ${textHash(i.text)}\n${i.text}`);
    console.log(`\nCharacters: ${[...totals].map(([l, n]) => `${l} ${n}`).join(', ')}`);
    return;
  }

  const provider = pickProvider();
  if (!provider) {
    console.error(
      [
        'No text-to-speech provider is configured, so no audio was generated.',
        'The site still works: visitors hear their browser\'s built-in voice, or can read the transcripts.',
        '',
        'To generate high-quality narration, add ONE of these to .env.local (never commit it):',
        '  GOOGLE_TTS_API_KEY=...   (Google Cloud Text-to-Speech, has a free tier)',
        '  ELEVENLABS_API_KEY=...   (ElevenLabs)',
        '  OPENAI_API_KEY=...       (OpenAI, paid)',
        'then run: npm run narration:generate',
      ].join('\n'),
    );
    process.exitCode = 1;
    return;
  }

  mkdirSync(outDir, { recursive: true });
  const manifest = readManifest();
  let made = 0;
  let cached = 0;
  let failed = 0;
  console.log(`Provider: ${provider.id}. Languages: ${langs.join(', ')}.`);

  for (const { lang, section, text } of items) {
    const key = `${lang}/${section}` as const;
    const file = `${lang}/${section}.mp3`;
    const abs = join(outDir, file);
    const hash = textHash(text);
    const prev = manifest.entries[key];
    if (!flag('force') && prev && prev.hash === hash && existsSync(abs)) {
      cached++;
      continue;
    }
    process.stdout.write(`  ${key} (${text.length} chars)… `);
    try {
      const audio = await provider.synthesize(text, lang);
      if (audio.length < 1000) throw new Error(`audio is suspiciously small (${audio.length} bytes)`);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, audio);
      manifest.entries[key] = {
        file,
        hash,
        provider: provider.id,
        voice: provider.voice(lang),
        chars: text.length,
        bytes: statSync(abs).size,
        generatedAt: new Date().toISOString(),
      };
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      made++;
      console.log('done');
    } catch (err) {
      failed++;
      console.log('FAILED');
      console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`\nGenerated ${made}, reused ${cached} cached, failed ${failed}.`);
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
