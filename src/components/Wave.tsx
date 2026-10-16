/** Small animated equalizer shown while narration plays. */
export function Wave({ className = '', bars = 4 }: { className?: string; bars?: number }) {
  return (
    <span className={`inline-flex h-3.5 items-end gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="h-full w-[3px] origin-bottom animate-wave rounded-full bg-current"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
