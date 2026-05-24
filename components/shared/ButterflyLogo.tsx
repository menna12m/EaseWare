import { cn } from '@/lib/utils/cn';

type Props = {
  className?: string;
  /** Pixel size of the rendered logo. Aspect ratio is preserved (12:11). */
  size?: number;
};

// Inline SVG so the brand mark paints on first frame with no extra request.
// Mirrors public/logo.svg — keep the two in sync if you tweak the artwork.
export function ButterflyLogo({ className, size = 36 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 110"
      width={size}
      height={(size * 110) / 120}
      fill="none"
      role="img"
      aria-label="EaseWear"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="ew-wing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C3A6D6" />
          <stop offset="55%" stopColor="#A88DB8" />
          <stop offset="100%" stopColor="#6B1F3B" />
        </linearGradient>
      </defs>

      <g transform="translate(60 55)" stroke="#D4AF37" strokeWidth="0.8">
        <ellipse cx="0" cy="0" rx="32" ry="22" fill="url(#ew-wing)" transform="translate(-26 -10) rotate(-30)" />
        <ellipse cx="0" cy="0" rx="32" ry="22" fill="url(#ew-wing)" transform="translate(26 -10) rotate(30)" />
        <ellipse cx="0" cy="0" rx="22" ry="14" fill="url(#ew-wing)" transform="translate(-18 18) rotate(28)" />
        <ellipse cx="0" cy="0" rx="22" ry="14" fill="url(#ew-wing)" transform="translate(18 18) rotate(-28)" />
      </g>

      <path
        d="M 60 22 C 56 32 64 42 60 50 C 56 58 64 70 60 85"
        stroke="#D4AF37"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="20" r="2.5" fill="#D4AF37" />

      <circle cx="32" cy="88" r="2" fill="#2D7A7B" />
      <circle cx="88" cy="88" r="2" fill="#9C2F5A" />
    </svg>
  );
}
