'use client';
import TgIcon from "./Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
 const pathname = usePathname();

 const footerItems = [
  { href: "/publish", label: "Publish", icon: "/publish.svg", activeIcon: "/publish-active.svg" },
  { href: "/", label: "Gigs", icon: "/gigs.svg", activeIcon: "/gigs-active.svg" },
  { href: "/ads", label: "Ads", icon: "/ads.svg", activeIcon: "/ads-active.svg" },
  { href: "/community", label: "Community", icon: "/community.svg", activeIcon: "/community-active.svg" }
 ]

 return (
  <div className="fixed bottom-0 inset-x-0 z-50">
    <div className="absolute bottom-0 inset-x-0 z-0 h-26 secondary-bg-faded backdrop-blur-sm mask-t-from-65%"></div>
    <div className="relative z-10 grid grid-cols-4 mb-4 px-8">
      <div className="primary-bg rounded-full p-1.5 w-full">
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
  </div>
 )
}
