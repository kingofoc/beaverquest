import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { UserProvider } from "@/context/UserContext";
import { TonProvider } from "./components/TonProvider";
import TelegramThemeSync from "./components/TelegramThemeSync";
import GetUser from "./components/GetUser";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Beaver Quest",
  description: "Telegram mini-app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

        <Script src="https://sad.adsgram.ai/js/sad.min.js"></Script>
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        <TonProvider>
          <UserProvider>
            <GetUser />
            <TelegramThemeSync />
            {children}
          </UserProvider>
          
        </TonProvider>
      </body>
    </html>
  );
}