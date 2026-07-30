'use client';
import { useUser } from "@/context/UserContext";


export default function HeroCard() {
 const { user } = useUser()

 const userName = user?.userName;
 const firstName = user?.firstName;
 return (
  <div>
   <p>Hello {userName}</p>
   <p>Welcome {firstName}</p>
  </div>
 )
}
