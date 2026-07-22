'use client';
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { useEffect } from "react";

export default function ConnectWallet() {
 const walletAddress = useTonAddress();

 useEffect(() => {
  if(walletAddress) {
   const userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;

   fetch('/api/wallet', {
    method: 'POST',
    headers: { 'COntent-Type': 'application/json' },
    body: JSON.stringify({ userId, walletAddress })
   })
   .then((res) => res.json())
   .then((data) => console.log("Wallet saved:", data))
   .catch((err) => console.error("Error saving wallet:", err))
  }
 },[walletAddress]);

 return (
  <TonConnectButton />
 )
}