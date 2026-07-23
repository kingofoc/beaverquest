'use client';
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';

function buildPatternBackground(color: string) {
 const encodedColor = encodeURIComponent(color);

 const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='${encodedColor}' fill-opacity='1'><path fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z'/></g></svg>`;

 return `url("data:image/svg+xml,${svg.replace(/#/g, '%23')}")`
}

export default function TelegramThemeSync() {
 const [ colorScheme, setColorScheme ] = useState<"light" | "dark">('light');
 const router = useRouter();
 const pathname = usePathname();

 useEffect(() => {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();

  const applyTheme = () => {
   const theme = tg.themeParams;

   document.documentElement.style.setProperty('--tg-pattern-bg', buildPatternBackground(theme.button_color));
   document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color);
   document.documentElement.style.setProperty('--tg-text-color', theme.text_color);
   document.documentElement.style.setProperty('--tg-button-color', theme.button_color);
   document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color);
   document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color);
   document.documentElement.style.setProperty('--tg-link-color', theme.link_color);
   document.documentElement.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color);
   document.documentElement.style.setProperty('--tg-header-bg-color', theme.header_bg_color);
   document.documentElement.style.setProperty('--tg-accent-text-color', theme.accent_text_color);
   document.documentElement.style.setProperty('--tg-section-bg-color', theme.section_bg_color);
   document.documentElement.style.setProperty('--tg-section-header-text-color', theme.section_header_text_color);
   document.documentElement.style.setProperty('--tg-subtitle-text-color', theme.subtitle_text_color);
   document.documentElement.style.setProperty('--tg-destructive-text-color', theme.destructive_text_color);
   document.documentElement.style.setProperty('--tg-section-separator-color', theme.section_separator_color);
   document.documentElement.style.setProperty('--tg-bottom-bar-bg-color', theme.bottom_bar_bg_color);

   setColorScheme(tg.colorScheme ?? 'light');

   // Match Telegram's native chrome (header bar, background) to the current theme
   tg.setHeaderColor(theme.header_bg_color);
   tg.setBackgroundColor(theme.bg_color);
  }

  // apply theme immediately on load
  applyTheme();

  // re-apply theme when user switches theme while app is open
  tg.onEvent('themeChanged', applyTheme);

  return () => {
   tg.offEvent('themeChanged', applyTheme)
  };
 }, []);

 useEffect(() => {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return;

  const handleBack = () => router.back();

  if (pathname === '/' || pathname === '/home') {
   // Show Close button on home page
   tg.BackButton.hide();
  } else {
   // Show Back button on other pages
   tg.BackButton.show();
   tg.BackButton.onClick(handleBack);
  }

  return () => {
   tg.BackButton.offClick(handleBack);
   tg.BackButton.hide();
  }
 }, [pathname, router])

 useEffect(() => {
  // Optional: toggle a class on <html> for Tailwind dark mode support
  document.documentElement.classList.toggle('dark', colorScheme === 'dark');
 }, [colorScheme]);

 return null;
}
