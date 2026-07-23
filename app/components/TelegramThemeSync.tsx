'use client';
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';

async function loadRecoloredPattern(url: string, color: string): Promise<string> {
 const res = await fetch(url);
 let svgText = await res.text();

 // The source SVG uses #000000 for every stroke/fill - swap it for the theme color
 svgText = svgText.replace(/#000000/g, color);

 return svgText;
}

export default function TelegramThemeSync() {
 const [ colorScheme, setColorScheme ] = useState<"light" | "dark">('light');
 const [patternSvg, setPatternSvg] = useState<string | null>(null);
 const router = useRouter();
 const pathname = usePathname();

 useEffect(() => {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();

  const applyTheme = async () => {
   const theme = tg.themeParams;

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

   setColorScheme(tg.colorScheme);

   // Match Telegram's native chrome (header bar, background) to the current theme
   tg.setHeaderColor(theme.header_bg_color);
   tg.setBackgroundColor(theme.bg_color);

   // Load and recolor the chat pattern background using the hint color
   // (a muted tone works best for a subtle background texture)
   try {
    const recolored = await loadRecoloredPattern(
     '/tg-bg-pattern.svg',
     theme.accent_text_color
    );
    setPatternSvg(recolored);
   } catch (err) {
    console.error('Failed to load chat pattern:', err);
   }
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

 if (!patternSvg) return null;

 return (
  <div
   className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
   style={{ opacity: 0.08 }}
   dangerouslySetInnerHTML={{ __html: patternSvg }}
  />
 )
}
