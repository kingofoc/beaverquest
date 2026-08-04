'use client';
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import Image from "next/image";
import TgIcon from "./Icon";

export default function HeroCard() {
 const { user } = useUser();

 const balance = user?.balance;
 return (
  <div className="w-full gradient-bg p-4 rounded-full">
   
   <div className="grid grid-cols-6 gap-4 ">
    <div className="col-span-5 flex flex-col items-center">
     <TgIcon src="/gigsgram.svg" size={12} className="tertiary-text-color"/>
     <span className="text-2xl font-bold tertiary-text-color">{balance}</span>
    </div>

    <Link href="/boost" className="col-span-1 relative">
     {[...Array(5)].map((_, i) => (
      <Image
       key={i}
       src="/boost-animate.svg"
       alt=""
       width={24}
       height={24}
       className="absolute align-center inline-flex motion-safe:animate-ping opacity-75 z-1"
       style={{
        animationDelay: `${i * 0.4}s`,
       }}
      />
     ))}
     <Image src="/boost.svg" width={24} height={24} alt="" className="relative z-10 align-center inline-flex"></Image>
    </Link>
   </div>
  </div>
 )
}
