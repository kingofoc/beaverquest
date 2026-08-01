'use client';
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export default function GetUser() {
 const { setUser, setLoading} = useUser();

 useEffect(() => {
  async function fetchUser() {
   try{
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!tgUser) {
     setLoading(false);
     return;
    }

    const userId = tgUser.id;

    const res = await fetch(`/api/user-data?userId=${userId}`);

    if (!res.ok) {
     throw new Error("Failed to get user")
    }

    const user = await res.json();
    setUser(user)

   } catch(error) {
    console.error(error)
   } finally {
    setLoading(false);
   }
  }

  fetchUser()
 }, [setUser, setLoading]);

 return null;
}