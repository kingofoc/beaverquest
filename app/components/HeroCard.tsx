'use client';
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import Image from "next/image";

export default function HeroCard() {
 const { user } = useUser();

 const balance = user?.balance;
 return (
  <div className="w-full gradient-bg p-4 rounded-full">
   <div className="grid grid-cols-6 gap-4 ">
    <span className="col-span-5 text-2xl font-bold tertiary-text-color">$ {balance}</span>

    <Link href="/boost" className="col-span-1 relative">
     {[...Array(5)].map((_, i) => (
      <Image
       key={i}
       src="/boost.svg"
       alt=""
       width={20}
       height={20}
       className="boost-ripple"
       style={{
        animationDelay: `${i * 0.4}s`,
       }}
      />
     ))}
     <Image src="/boost.svg" width={20} height={20} alt="" className="relative z-10"></Image>
    </Link>
   </div>
  </div>
 )
}
