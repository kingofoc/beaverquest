'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import TgIcon from "./Icon";

export default function Footer() {
 const pathname = usePathname();

 const footerItems = [
  { href: "/publish", label: "Create", icon: "/create.svg", activeIcon: "/create-active.svg" },
  { href: "/", label: "Tasks", icon: "/task.svg", activeIcon: "/task-active.svg" },
  { href: "/profile", label: "Me", icon: "/profile.svg", activeIcon: "/profile-active.svg" }
 ]
 return (
  <div className="grid grid-cols-5 fixed bottom-0 left-0 w-full --tg-button-color">
   <div className="grid grid-cols-3 col-span-3 col-start-2 primary-bg rounded-full p-1.5 mb-8">
    {footerItems.map(({ href, label, activeIcon, icon }) => {
     const isActive = pathname === href
     return (
      <Link 
       key={label} 
       href={href} 
       className={`flex flex-col justify-center items-center text-center p-1 ${isActive ? 'tertiary-bg-faded scale-105 rounded-full' : 'bg-transparent'} transition duration-500 ease-in-out`}>

        <TgIcon src={isActive ? activeIcon : icon} size={28} className={isActive ? "icon-color-active" : "icon-color"} />
        <span className={`text-xs ${isActive ? 'font-bold icon-text-color-active' : 'icon-text-color font-medium'}`}>{label}</span>
      </Link>
     )
    })}

   </div>
  </div>
 )
}