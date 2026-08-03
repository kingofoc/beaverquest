'use client';
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export default function GetUser() {
 const { setUser, setLoading } = useUser();

 useEffect(() => {
  async function fetchUser() {
   try{
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!tgUser) {
     setLoading(false);
     return;
    }

    const cacheKey = `cachedUser-${tgUser.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
     try {
      setUser(JSON.parse(cached));
     } catch {
      localStorage.removeItem(cacheKey)
     }
    }

    const res = await fetch(`/api/user-data?userId=${tgUser.id}`);

    if (!res.ok) {
     throw new Error("Failed to get user")
    }

    const user = await res.json();
    setUser(user)
    localStorage.setItem(
     cacheKey,
     JSON.stringify(user)
    );

   } catch(err) {
    console.error(err)
   } finally {
    setLoading(false);
   }
  }

  fetchUser()
 }, [setUser, setLoading]);

 return null;
}