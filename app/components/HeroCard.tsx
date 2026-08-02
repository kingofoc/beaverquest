'use client';
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import TgIcon from "./Icon";

export default function HeroCard() {
 const { user } = useUser();

 const balance = user?.balance;
 const level = user?.level;
 return (
  <div className="w-full">
   <div className="grid grid-cols-6 gap-4 w-full tertiary-bg p-4 rounded-md">
    <div className="col-span-5">
     <span className="text-2xl font-bold tertiary-text-color">${balance}</span>
    </div>
    <div className="col-span-1 secondary-bg rounded-md text-center">
     <span className="link-color text-sm font-medium">Lv{level}</span>
    </div>
   </div>

   <div className="grid grid-cols-4 gap-4 w-full mt-4">
    <Link href="/airdrop" className="tertiary-bg-faded rounded-md p-1 flex flex-col justify-center items-center text-center">
     <span className="text-xs font-medium">Airdrop</span>
    </Link>
    <Link href="/profile" className="tertiary-bg-faded rounded-md p-1 flex flex-col justify-center items-center text-center">
     <span className="text-xs font-medium">TON</span>
    </Link>
    <Link href="/profile" className="tertiary-bg-faded rounded-md p-1 flex flex-col justify-center items-center text-center">
     <span className="text-xs font-medium">Stars</span>
    </Link>
    <Link href="/community" className="tertiary-bg-faded rounded-md p-1 flex flex-col justify-center items-center text-center">
     <TgIcon src="/community.svg" size={38} className="icon-text-color-active"></TgIcon>
     <span className="text-xs font-medium">Community</span>
    </Link>
   </div>
  </div>
 )
}
