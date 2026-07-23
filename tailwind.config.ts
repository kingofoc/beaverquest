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
   'tg-hint': 'var(--tg-hint-color)',
   'tg-secondary-bg': 'var(--tg-secondary-bg-color)',
   },
  },
 },
};

export default config;