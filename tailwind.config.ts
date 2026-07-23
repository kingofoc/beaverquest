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
   'tg-accent_text_color': 'var(--tg-accent_text_color)',
   'tg-section_bg_color': 'var(--tg-section_bg_color)',
   'tg-section_header_text_color': 'var(--tg-section_header_text_color)',
   'tg-subtitle_text_color': 'var(--tg-subtitle_text_color)',
   'tg-destructive_text_color': 'var(--tg-destructive_text_color)',
   'tg-section_separator_color': 'var(--tg-section_separator_color)',
   'tg-bottom_bar_bg_color': 'var(--tg-bottom_bar_bg_color)',
   },
  },
 },
};

export default config;