'use client';
import { useUser } from "@/context/UserContext";
import TgIcon from "./Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Footer() {
 const pathname = usePathname();
 const { user } = useUser();
 const profileUrl = user?.profileURL;

 const footerItems = [
  { href: "/publish", label: "Publish", icon: "/publish.svg", activeIcon: "/publish-active.svg" },
  { href: "/", label: "Gigs", icon: "/gigs.svg", activeIcon: "/gigs-active.svg" },
  { href: "/ads", label: "Ads", icon: "/ads.svg", activeIcon: "/ads-active.svg" },
  { href: "/community", label: "Community", icon: "/community.svg", activeIcon: "/community-active.svg" }
 ];

 const profileItems = { href: "/profile", label: "Profile", icon: "/profile.svg", activeIcon: "/profile-active.svg" };
 const isProfileActive = pathname === profileItems.href;

 return (
  <div className="fixed bottom-0 inset-x-0 z-50 primary-bg backdrop-blur-sm p-1.5">
    <div className="relative z-10 grid grid-cols-4 mb-2">
      <div className="w-full grid grid-cols-4 gap-2 col-span-4">
        {footerItems.map(({ href, label, activeIcon, icon }) => {
        const isActive = pathname === href
        return (
          <Link 
          key={label} 
          href={href} 
          className="flex flex-col justify-center items-center text-center transition duration-500 ease-in-out">

            <TgIcon src={isActive ? activeIcon : icon} size={28} className={isActive ? "icon-color-active" : "icon-color"} />
            <span className={`text-xs ${isActive ? 'font-bold icon-text-color-active' : 'icon-text-color font-medium'}`}>{label}</span>
          </Link>
        )
        })}

        <Link href={profileItems.href} className="flex flex-col justify-center items-center text-center transition duration-500 ease-in-out">
          <div className={`relative w-7 h-7 rounded-full overflow-hidden transition-all duration-500 ${isProfileActive ? "border-active" : ""}`}>
            {profileUrl ? (
            <Image
              src={profileUrl}
              alt={"profile"}
              fill
              className="object-cover"> 
            </Image>
            ) : (
            <TgIcon src={profileItems.activeIcon} size={28} className={`object-cover icon-color-active ${isProfileActive ? "icon-color-active" : "icon-color"}`} />
            )}
          </div>
          <span className={`text-xs ${isProfileActive ? "icon-text-color-active font-bold" : "icon-text-color font-medium"}`}>{profileItems.label}</span>
        </Link>
      </div>
    </div>
  </div>
 )
}


// 'use client';
// import TgIcon from "./Icon";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState, useRef } from "react";

// const MORE_ITEMS = [
//   { href: "/community", label: "Community", icon: "/community.svg" }
// ]

// export default function Footer() {
//  const pathname = usePathname();
//  const [moreOpen, setMoreOpen] = useState(false);
//  const panelRef = useRef<HTMLDivElement>(null);
//  const [prevPathname, setPrevPathname] = useState(pathname);

//  if (prevPathname !== pathname) {
//     setPrevPathname(pathname);
//     if (moreOpen) {
//       setMoreOpen(false);
//     }
//   }

//  const footerItems = [
//   { href: "/publish", label: "Publish", icon: "/publish.svg", activeIcon: "/publish-active.svg" },
//   { href: "/", label: "Gigs", icon: "/gigs.svg", activeIcon: "/gigs-active.svg" },
//   { href: "/ads", label: "Ads", icon: "/ads.svg", activeIcon: "/ads-active.svg" },
//  ];

//   const isMoreActive = MORE_ITEMS.some((item) => item.href === pathname) || moreOpen;

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
//         setMoreOpen(false);
//       }
//     }

//     if (moreOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [moreOpen])

//  return (
//   <div className="fixed bottom-0 inset-x-0 z-50">
//     <div className="absolute bottom-0 inset-x-0 z-0 h-26 secondary-bg-faded backdrop-blur-sm mask-t-from-65%"></div>

//     {moreOpen && (
//       <div 
//         ref={panelRef}
//         className="w-1/2 relative z-20 primary-bg rounded-2xl p-2 mx-8 shadow-lg opacity-100 translate-y-0 transition-all duration-200">
//           {MORE_ITEMS.map(({ href, label, icon }) => {
//             const isActive = pathname === href
//             return (
//               <Link
//                 key={label}
//                 href={href}
//                 onClick={() => setMoreOpen(false)}
//                 className={`flex flex-row items-center gap-2 rounded-full transition-colors hover:tertiary-bg-faded p-4 ${isActive ? "tertiary-bg-faded rounded-full" : "bg-transparent"}`}>
//                   <TgIcon src={icon} size={28} className={`${isActive ? "icon-color-active" : "icon-color"}`}></TgIcon>
//                   <span className={`text-xs text-center ${isActive ? "icon-text-color-active font-bold" : "icon-text-color font-medium"}`}>{label}</span>
//               </Link>
//             )
//             })}
//       </div>
//     )}
//     <div className="relative z-10 grid grid-cols-4 mb-4 px-8">
//       <div className="primary-bg rounded-full p-1.5 w-full grid grid-cols-4 gap-2 col-span-4">
//         {footerItems.map(({ href, label, activeIcon, icon }) => {
//         const isActive = pathname === href
//         return (
//           <Link 
//           key={label} 
//           href={href} 
//           className={`flex flex-col justify-center items-center text-center p-1 ${isActive ? 'tertiary-bg-faded scale-105 rounded-full' : 'bg-transparent'} transition duration-500 ease-in-out`}>

//             <TgIcon src={isActive ? activeIcon : icon} size={28} className={isActive ? "icon-color-active" : "icon-color"} />
//             <span className={`text-xs ${isActive ? 'font-bold icon-text-color-active' : 'icon-text-color font-medium'}`}>{label}</span>
//           </Link>
//         )
//         })}

//         <div
//           onClick={() => setMoreOpen((prev) => !prev)}
//           className={`flex flex-col justify-center items-center text-center p-1 ${isMoreActive ? 'tertiary-bg-faded scale-105 rounded-full' : 'bg-transparent'} transition duration-500 ease-in-out`}>
//             <TgIcon src={isMoreActive ? "/more-active.svg" : "/more.svg"} size={28} className={isMoreActive ? "icon-color-active" : "icon-color"} />
//             <span className={`text-xs ${isMoreActive ? 'font-bold icon-text-color-active' : 'icon-text-color font-medium'}`}>More</span>
//         </div>
//       </div>
//     </div>
//   </div>
//  )
// }
