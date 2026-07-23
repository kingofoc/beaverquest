// tailwind.config.ts
import type { Config } from 'tailwindcss'
const config: Config = {
 darkMode: 'class', // enables the .dark class toggle to work
 theme: {
  extend: {
   colors: {
   'tg-bg': 'var(--tg-bg-color)',
   'tg-text': 'var(--tg-text-color)',
   'tg-button': 'var(--tg-button-color)',
   'tg-button-text': 'var(--tg-button-text-color)',
   'tg-link': 'var(--tg-link-color)',
   'tg-hint': 'var(--tg-hint-color)',
   'tg-secondary-bg': 'var(--tg-secondary-bg-color)',
   'tg-header-bg-color': 'var(--tg-header-bg-color)',
   'tg-accent-text-color': 'var(--tg-accent-text-color)',
   'tg-section-bg-color': 'var(--tg-section-bg-color)',
   'tg-section-header-text-color': 'var(--tg-section-header-text-color)',
   'tg-subtitle-text-color': 'var(--tg-subtitle-text-color)',
   'tg-destructive-text-color': 'var(--tg-destructive-text-color)',
   'tg-section-separator-color': 'var(--tg-section-separator-color)',
   'tg-bottom-bar-bg-color': 'var(--tg-bottom-bar-bg-color)',
   },
  },
 },
};

export default config;