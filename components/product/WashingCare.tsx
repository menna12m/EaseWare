type CareInstruction = { icon: string; label: string };

const FALLBACK: CareInstruction[] = [
  { icon: '🌡️', label: 'Machine wash cold (30°C)' },
  { icon: '🚫', label: 'Do not bleach' },
  { icon: '👕', label: 'Tumble dry low' },
  { icon: '🔥', label: 'Iron on low heat' },
];

export function WashingCare({ instructions }: { instructions?: CareInstruction[] }) {
  const items = instructions && instructions.length > 0 ? instructions : FALLBACK;
  return (
    <div className="rounded-lg border border-ink/10 p-5">
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-ink">Wash & care</h3>
      <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {items.map((it) => (
          <li key={it.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl" aria-hidden>
              {it.icon}
            </span>
            <span className="text-xs text-ink-soft">{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
