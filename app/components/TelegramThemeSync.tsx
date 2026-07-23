'use client';
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';

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
   const bgColor = theme.bg_color ?? '#ffffff';

   document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color ?? '#ffffff');
   document.documentElement.style.setProperty('--tg-text-color', theme.text_color ?? '#000000');
   document.documentElement.style.setProperty('--tg-button-color', theme.button_color ?? '#2481cc');
   document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color ?? '#ffffff');
   document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color ?? '#999999');
   document.documentElement.style.setProperty('--tg-link-color', theme.link_color ?? '#2481cc');
   document.documentElement.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color ?? '#f0f0f0');

   setColorScheme(tg.colorScheme ?? 'light');

   // Match Telegram's native chrome (header bar, background) to the current theme
   tg.setHeaderColor(bgColor);
   tg.setBackgroundColor(bgColor);
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