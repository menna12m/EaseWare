import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // ---- Brand palette (EaseWear) -----------------------------------
        // Use these names directly for new code; the semantic aliases below
        // (cream / vanilla / clay / ink) are kept for backwards compatibility
        // and now resolve to brand-correct values.
        plum: {
          DEFAULT: '#6B1F3B',
          light: '#8B3552',
          dark: '#4A1428',
        },
        berry: {
          DEFAULT: '#9C2F5A',
          light: '#B85178',
        },
        rose: {
          DEFAULT: '#C86A7B',
          light: '#DCA4AF',
        },
        mauve: {
          DEFAULT: '#A88DB8',
          light: '#C5B0D2',
        },
        lilac: {
          DEFAULT: '#C3A6D6',
          light: '#DDC9E5',
        },
        teal: {
          DEFAULT: '#2D7A7B',
          light: '#5DA0A1',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B8941F',
          light: '#E5C868',
        },

        // ---- Semantic aliases (backwards compat) ------------------------
        // cream = warm off-white page background
        cream: {
          50: '#FBF7F0',
          100: '#F4ECDE',
          200: '#E8D9C2',
          300: '#D9C39E',
        },
        // vanilla = soft section background (slightly pinkish-cream)
        vanilla: {
          DEFAULT: '#F4ECDE',
          dark: '#E8D9C2',
        },
        // clay = brand accent (now gold)
        clay: {
          DEFAULT: '#D4AF37',
          dark: '#B8941F',
        },
        // ink = primary text (now plum)
        ink: {
          DEFAULT: '#6B1F3B',
          soft: '#8B4E66',
        },

        // ---- shadcn token bridges ---------------------------------------
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        // Body — Montserrat Light per brand spec
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        // Heading — Cinzel (closest Google Font to "Cinzel Elegant")
        serif: ['var(--font-cinzel)', 'Georgia', 'serif'],
        // Explicit alias for the display wordmark
        display: ['var(--font-cinzel)', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
