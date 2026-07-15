'use client';
import { useEffect } from "react";

export default function UserCountry() {
 useEffect(() => {
  const userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id

  fetch('/api/country', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ userId })
  })
 }, []);

 return (
  <div></div>
 )
}