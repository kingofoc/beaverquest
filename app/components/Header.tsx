'use client';
import TgIcon from "./Icon";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
// import { usePathname } from "next/navigation";

export default function Header() {
 // const pathname = usePathname();
 const { user } = useUser();
 const firsttName = user?.firstName;
 const profileUrl = user?.profileURL;
 const balance = user?.balance;

 const profileItems = { href: "/profile", icon: "/profile.svg", activeIcon: "/profile-active.svg" }
 // const isProfileActive = pathname === profileItems.href;

 return (
  <div className="fixed top-0 inset-x-0 z-50">
   <div className="absolute top-0 inset-x-0 z-0 h-12 secondary-bg-faded backdrop-blur-sm mask-b-from-65%"></div>
   <div className="relative z-10 grid grid-cols-6 p-4">
    <Link href={profileItems.href} className="flex items-center col-span-3 gap-2">
     <div className="relative w-7 h-7 rounded-full overflow-hidden transition-all duration-500 border-active">
      {profileUrl ? (
       <Image
        src={profileUrl}
        alt={"profile"}
        fill
        className="object-cover"> 
       </Image>
      ) : (
       <TgIcon src={profileItems.activeIcon} size={28} className="object-cover icon-color-active" />
      )}
     </div>
     <span className="text-sm">{firsttName}</span>
    </Link>

    <div className="col-span-2 flex flex-row justify-end items-center gap-1">
     <TgIcon src="/gigsgram.svg" size={18} className={"icon-color-active"} />
     <span className="text-sm font-bold link-color">{balance}</span>
    </div>
   </div>
  </div>
 )
}
