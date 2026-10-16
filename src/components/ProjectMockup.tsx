import { Bell, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MockupKind } from '../data/types';

// Illustrative, content-free UI sketches. They use skeleton bars instead of
// numbers or names so they never read as real metrics or screenshots.

const Bar = ({ w, className = '' }: { w: string; className?: string }) => (
  <span className={`block h-2 rounded-full bg-white/10 ${className}`} style={{ width: w }} />
);

function Frame({ address, children }: { address: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 min-w-0 flex-1 truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-ink-400">
          {address}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden p-3 sm:p-4">{children}</div>
    </div>
  );
}

function VoiceDashboard() {
  return (
    <div className="grid h-full grid-cols-[36px_1fr] gap-3">
      <div className="flex flex-col gap-2.5 rounded-lg bg-white/[0.03] p-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-5 w-5 rounded-md ${i === 1 ? 'bg-neon/70' : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
              <Bar w="55%" />
              <Bar w="35%" className="mt-2 h-3 bg-white/20" />
            </div>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 gap-3">
          <div className="relative flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neon/15 px-2 py-0.5 font-mono text-[9px] font-semibold text-neon">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-neon" /> LIVE
            </span>
            <div className="absolute inset-x-3 bottom-3 top-9 flex items-center gap-[3px]">
              {Array.from({ length: 28 }, (_, i) => (
                <span
                  key={i}
                  className="h-full flex-1 origin-center animate-wave rounded-full bg-neon/70"
                  style={{ animationDelay: `${(i % 7) * 0.12}s`, opacity: 0.35 + ((i * 37) % 60) / 100 }}
                />
              ))}
            </div>
          </div>
          <div className="hidden w-[38%] flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 sm:flex">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-4 w-4 shrink-0 rounded-full bg-white/10" />
                <Bar w="60%" />
                <span className={`ml-auto h-2 w-6 rounded-full ${i % 2 ? 'bg-neon/50' : 'bg-white/15'}`} />
              </div>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 300 60" className="h-[22%] w-full" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="vd-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#c6f94e" stopOpacity=".35" />
              <stop offset="1" stopColor="#c6f94e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 48 C40 40 60 20 100 26 S160 50 200 30 S260 8 300 14 L300 60 L0 60Z" fill="url(#vd-area)" />
          <path d="M0 48 C40 40 60 20 100 26 S160 50 200 30 S260 8 300 14" fill="none" stroke="#c6f94e" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

function Jobs() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <Search className="h-3.5 w-3.5 text-ink-400" />
          <Bar w="40%" />
        </div>
        <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-white/10">
          <Bell className="h-3.5 w-3.5 text-ink-300" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-neon" />
        </span>
      </div>
      <div className="flex gap-1.5">
        {['22%', '16%', '19%'].map((w, i) => (
          <span key={i} className={`h-5 rounded-full ${i === 0 ? 'bg-neon/25' : 'bg-white/[0.06]'}`} style={{ width: w }} />
        ))}
      </div>
      {[0.8, 0.62, 0.45].map((fill, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
          <span className="h-8 w-8 shrink-0 rounded-md bg-white/10" />
          <div className="min-w-0 flex-1">
            <Bar w="58%" className="bg-white/20" />
            <Bar w="36%" className="mt-2" />
          </div>
          <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="4" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#c6f94e" strokeWidth="4" strokeDasharray={`${fill * 94} 94`} strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function Payroll() {
  return (
    <div className="grid h-full grid-cols-[1.2fr_1fr] gap-3">
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
        <Bar w="40%" className="bg-white/20" />
        <div className="mt-3 grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => (
            <span
              key={i}
              className={`aspect-square rounded-[4px] ${
                i % 7 >= 5 ? 'bg-white/[0.03]' : i === 17 ? 'bg-amber-300/40' : i % 9 === 3 ? 'bg-white/10' : 'bg-neon/40'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
        <Bar w="50%" className="bg-white/20" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <Bar w="45%" />
            <Bar w="20%" />
          </div>
        ))}
        <div className="mt-auto flex items-center justify-between rounded-md bg-neon/15 px-2 py-2">
          <Bar w="30%" className="bg-neon/60" />
          <Bar w="25%" className="bg-neon/60" />
        </div>
      </div>
    </div>
  );
}

function Crm() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <Search className="h-3.5 w-3.5 text-ink-400" />
          <Bar w="30%" />
        </div>
        <span className="h-7 w-14 rounded-lg bg-neon/70" />
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border border-white/[0.06]">
        <div className="grid grid-cols-[16px_1fr_1fr_44px] items-center gap-3 border-b border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <span />
          <Bar w="50%" />
          <Bar w="40%" />
          <Bar w="100%" />
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-[16px_1fr_1fr_44px] items-center gap-3 border-b border-white/[0.04] px-3 py-2">
            <span className="h-3 w-3 rounded-[3px] border border-white/20" />
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 shrink-0 rounded-full bg-white/15" />
              <Bar w="70%" />
            </span>
            <Bar w={`${45 + ((i * 13) % 35)}%`} />
            <span className={`h-3.5 rounded-full ${['bg-neon/40', 'bg-sky-300/30', 'bg-white/15'][i % 3]}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div className="grid h-full grid-cols-[34%_1fr] gap-3">
      <div className="flex flex-col gap-2 rounded-lg bg-white/[0.02] p-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex items-center gap-2 rounded-md p-1.5 ${i === 0 ? 'bg-white/[0.06]' : ''}`}>
            <span className="h-6 w-6 shrink-0 rounded-full bg-white/15" />
            <div className="min-w-0 flex-1">
              <Bar w="70%" className="bg-white/20" />
              <Bar w="45%" className="mt-1.5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <span className="max-w-[70%] self-start rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2.5">
          <Bar w="120px" className="max-w-full bg-white/20" />
        </span>
        <span className="max-w-[70%] self-end rounded-2xl rounded-br-sm bg-neon/80 px-3 py-2.5">
          <Bar w="90px" className="max-w-full bg-ink-950/30" />
        </span>
        <span className="max-w-[70%] self-start rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2.5">
          <Bar w="150px" className="max-w-full bg-white/20" />
          <Bar w="80px" className="mt-1.5 max-w-full bg-white/20" />
        </span>
        <span className="flex gap-1 self-start rounded-2xl bg-white/10 px-3 py-2.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-blink rounded-full bg-white/70" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </span>
        <div className="mt-auto flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
          <Bar w="50%" />
          <span className="ml-auto h-5 w-5 rounded-full bg-neon/80" />
        </div>
      </div>
    </div>
  );
}

function Website() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="h-3 w-16 rounded-full bg-white/25" />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <Bar key={i} w="28px" />
          ))}
          <span className="h-3 w-12 rounded-full bg-neon/70" />
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center gap-2.5 text-center">
        <span className="h-4 w-[68%] rounded-full bg-white/25" />
        <span className="h-4 w-[48%] rounded-full bg-white/25" />
        <Bar w="56%" className="mt-1" />
        <span className="mt-1 h-6 w-24 rounded-full bg-neon/80" />
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
            <span className="block h-5 w-5 rounded-md bg-neon/30" />
            <Bar w="70%" className="mt-2.5 bg-white/20" />
            <Bar w="90%" className="mt-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

const CONTENT: Record<MockupKind, () => ReactNode> = {
  'voice-dashboard': VoiceDashboard,
  jobs: Jobs,
  payroll: Payroll,
  crm: Crm,
  chat: Chat,
  website: Website,
};

export function ProjectMockup({ kind, address }: { kind: MockupKind; address: string }) {
  const Content = CONTENT[kind];
  return (
    <Frame address={address}>
      <Content />
    </Frame>
  );
}

export function ProjectScreenshot({ src, alt, address }: { src: string; alt: string; address: string }) {
  return (
    <Frame address={address}>
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
    </Frame>
  );
}
