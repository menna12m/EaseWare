import { useTranslations } from 'next-intl';

type CareInstruction = { icon: string; label: string };

export function WashingCare({ instructions }: { instructions?: CareInstruction[] }) {
  const t = useTranslations('Sizes.wash');
  const fallback: CareInstruction[] = [
    { icon: '🌡️', label: t('items.cold') },
    { icon: '🚫', label: t('items.noBleach') },
    { icon: '👕', label: t('items.tumble') },
    { icon: '🔥', label: t('items.iron') },
  ];
  const items = instructions && instructions.length > 0 ? instructions : fallback;
  return (
    <div className="rounded-lg border border-ink/10 p-5">
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-ink">{t('title')}</h3>
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
