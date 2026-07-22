'use client';
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl = "https://kingofoc.github.io/tonconnect-manifest/tonconnect-manifest.json";

export function TonProvider({ children }: { children: React.ReactNode }) {
 return (
  <TonConnectUIProvider manifestUrl={ manifestUrl }
   actionsConfiguration={{
    twaReturnUrl: "https://t.me/beaverquestbot"
   }}
  >
   {children}
  </TonConnectUIProvider>
 )
}