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
  <div className="fixed bottom-1 left-0 w-full flex justify-center items-center">
   <div className="grid grid-cols-3 gap-8 secondary-bg rounded-full p-2">
    {footerItems.map(({ href, label, icon }) => {
     const isActive = pathname === href

     return (
      <Link 
       key={label} 
       href={href} 
       className={`flex flex-col justify-center items-center text-center text-xs p-1 ${isActive ? 'tertiary-bg opacity2 scale-105 rounded-full font-bold' : 'bg-transparent text font-medium'} transition-all duration-200 ease-in-out`}>

        <Image src={icon} width={32} height={32} alt={label} />
        <span className="">{label}</span>
       
       </Link>
     )
    })}

   </div>
  </div>
 )
}