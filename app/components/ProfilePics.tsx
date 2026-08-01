'use client';

import { useEffect } from "react";

export default function ProfilePics() {
 useEffect(() => {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (tgUser.id) {
   fetch('/api/profile-pics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     userId: tgUser.id,
     profileURL: tgUser.photo_url
    })
   })
   .then(res => res.json())
   .then(data => {
    console.log("User Api Response:", data);
   })
   .catch(err => {
    console.error("Profile pics added:", err);
   });
  }
 }, [])
 return (
  <></>
 )
}