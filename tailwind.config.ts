import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ─── RTL note ────────────────────────────────────────────────────────────
  // Always use Tailwind logical-property utilities:
  //   ps-* / pe-*  instead of  pl-* / pr-*
  //   ms-* / me-*  instead of  ml-* / mr-*
  //   text-start / text-end  instead of  text-left / text-right
  // This way the same class works for both RTL (Arabic) and LTR (English)
  // without any duplicate styles. See SKILL.md §6.
  // ─────────────────────────────────────────────────────────────────────────
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        // Arabic primary font — loaded via next/font/google in app/layout.tsx
        // The CSS variable --font-tajawal is injected into <html> by Next.js.
        sans: ['var(--font-tajawal)', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
