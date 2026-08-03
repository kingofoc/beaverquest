'use client';
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import Image from "next/image";

export default function HeroCard() {
 const { user } = useUser();

 const balance = user?.balance;
 const level = user?.level;
 return (
  <div className="w-full gradient-bg p-4 rounded-full">
   <div className="grid grid-cols-6">
    <div className="grid grid-cols-5 gap-4 col-span-5 ">
     <span className="col-span-4 text-2xl font-bold tertiary-text-color">$ {balance}</span>

     <Link href="/boost" className="col-span-1 tertiary-bg-faded rounded-full p-2">
      <Image src="/boost.svg" width={24} height={24} alt=""></Image>
     </Link>
    </div>
    <div className="col-span-1 text-center">
     <span className="primary-bg rounded-full p-2 link-color text-sm font-medium">Lv{level}</span>
    </div>
   </div>
  </div>
 )
}
