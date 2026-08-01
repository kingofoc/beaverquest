'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import TgIcon from "./Icon";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function Footer() {
 const pathname = usePathname();
 const { user } = useUser();
 const profileUrl = user?.profileURL

 const footerItems = [
  { href: "/publish", label: "Create", icon: "/create.svg", activeIcon: "/create-active.svg" },
  { href: "/", label: "Tasks", icon: "/task.svg", activeIcon: "/task-active.svg" },
  { href: "/ads", label: "Ads", icon: "/ads.svg", activeIcon: "/ads-active.svg" },
 ]

 const profileItems = { href: "/profile", icon: "/profile.svg", activeIcon: "/profile-active.svg" }

 const isProfileActive = pathname === profileItems.href;

 return (
  <div className="grid grid-cols-4 fixed bottom-0 left-0 w-full px-8">
   <div className="grid grid-cols-3 col-span-3 primary-bg rounded-full p-1.5 mb-8">
    {footerItems.map(({ href, label, activeIcon, icon }) => {
     const isActive = pathname === href
     return (
      <Link 
       key={label} 
       href={href} 
       className={`flex flex-col justify-center items-center text-center p-1 ${isActive ? 'tertiary-bg-faded scale-105 rounded-full' : 'bg-transparent'} transition duration-500 ease-in-out`}>

        <Image src={isActive ? activeIcon : icon} width={28} height={28} className={isActive ? "icon-color-active" : "icon-color"} alt=""></Image>
        <span className={`text-xs ${isActive ? 'font-bold icon-text-color-active' : 'icon-text-color font-medium'}`}>{label}</span>
      </Link>
     )
    })}

   </div>

   <div className="col-span-1 flex justify-center items-center rounded-full w-full mb-8">
    <Link href={profileItems.href}
    className={`relative w-14 h-14 rounded-full overflow-hidden transition-all duration-500 ${isProfileActive ? "border-active" : ""}`}>
      {profileUrl ? (
        <Image
          src={profileUrl}
          alt={"profile"}
          fill
          className="object-cover"> 
        </Image>
      ) : (
        <TgIcon src={isProfileActive ?  profileItems.activeIcon : profileItems.icon} size={28} className={isProfileActive ? "icon-color-active" : "icon-color"} />
      )}
    </Link>
   </div>
  </div>
 )
}