'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
 const pathname = usePathname();

 const footerItems = [
  { href: "/publish", label: "Create", icon: "/create.svg" },
  { href: "/", label: "Tasks", icon: "/taskactive.svg" },
  { href: "/profile", label: "Me", icon: "/profile.svg" }
 ]
 return (
  <div className="grid grid-cols-5 fixed bottom-0 left-0 w-full">
   <div className="grid grid-cols-3 col-span-3 col-start-2 gap-2 primary-bg rounded-full p-1 mb-8">
    {footerItems.map(({ href, label, icon }) => {
     const isActive = pathname === href

     return (
      <Link 
       key={label} 
       href={href} 
       className={`flex flex-col justify-center items-center text-center text-xs p-1 ${isActive ? 'tertiary-bg-faded scale-105 rounded-full font-bold' : 'bg-transparent font-medium'} transition-all duration-200 ease-in-out`}>

        <Image src={icon} width={32} height={32} alt={label} />
        <span className="">{label}</span>
       
      </Link>
     )
    })}

   </div>
  </div>
 )
}