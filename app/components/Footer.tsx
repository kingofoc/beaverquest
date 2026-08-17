'use client';
import TgIcon from "./Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function Footer() {
 const pathname = usePathname();
 const { user } = useUser();
 const profileUrl = user?.profileURL;

 const footerItems = [
  { href: "/publish", label: "Publish", icon: "/publish.svg", activeIcon: "/publish-active.svg" },
  { href: "/", label: "Gigs", icon: "/gigs.svg", activeIcon: "/gigs-active.svg" },
  { href: "/ads", label: "Ads", icon: "/ads.svg", activeIcon: "/ads-active.svg" },
 ]

 const profileItems = { href: "/profile", icon: "/profile.svg", activeIcon: "/profile-active.svg" }

 const isProfileActive = pathname === profileItems.href;

 return (
  <div className="fixed bottom-0 left-0 w-full px-8 pt-2 backdrop-blur-lg tertiary-bg-faded mask-t-from-90%">
    <div className="grid grid-cols-4 mb-8">
      
      <div className="relative z-10 grid grid-cols-3 col-span-3 primary-bg rounded-full p-1.5 w-full">
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

      <div className="relative z-10 col-span-1 flex justify-end items-center rounded-full w-full">
        <Link href={profileItems.href}
        className={`relative w-16 h-16 rounded-full overflow-hidden transition-all duration-500 ${isProfileActive ? "border-active" : ""}`}>
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={"profile"}
              fill
              className="object-cover"> 
            </Image>
          ) : (
            <TgIcon src={isProfileActive ?  profileItems.activeIcon : profileItems.icon} size={58} className={`object-cover ${isProfileActive ? "icon-color-active" : "icon-color"}`} />
          )}
        </Link>
      </div>
      {/* <div className="absolute bottom-0 z-0 h-1/1 tertiary-bg-faded mask-t-from-80% mask-radial-from-70% mask-radial-to-80%"></div> */}
    </div>
  </div>
 )
}
