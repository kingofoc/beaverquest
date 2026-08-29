import Link from "next/link";
import Footer from "../components/Footer";
import TgIcon from "../components/Icon";

export default function Publish() {
 return (
  <div>
   <div>
    <h1 className="mb-2 font-bold text-xl">Choose Campaign Type</h1>
    <p className="text-sm hint-color">Select the number of impression or clicks you need, create your gig, pay with GIGSGRAM Token</p>
   </div>
   <div className="mt-4">
    <Link href="/publish/socialGig" className="w-full rounded-lg secondary-bg">
     <div className="p-4 flex flex-row gap-4 items-center">
      <TgIcon src="/click.svg" size={28} className="icon-color"></TgIcon>
      <div className="flex flex-col">
       <span className="text-lg font-medium">Standard Click Task</span>
       <span className="text-sm hint-color">Pay per clicks. Perfect for traffic and engagement.</span>
      </div>
     </div>
    </Link>
   </div>
   <Footer />
  </div>
 )
}