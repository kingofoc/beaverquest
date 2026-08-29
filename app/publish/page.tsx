import Link from "next/link";
import Footer from "../components/Footer";
import TgIcon from "../components/Icon";

export default function Publish() {
 return (
  <div>
   <div>
    <h1 className="mb-4 font-bold">Choose Campaign Type</h1>
    <p>Select the number of impression or clicks you need, create your gig, pay with GIGSGRAM Token</p>
   </div>
   <div className="mt-4">
    <Link href="/socialGig" className="w-full rounded-lg primary-bg">
     <div className="p-4 flex flex-row gap-4 items-center">
      <TgIcon src="/clicks.svg" size={28}></TgIcon>
      <div>
       <span className="text-xl font-medium">Standard Click Task</span>
       <span className="text-sm hint-color">Pay per clicks. Perfect for traffic and engagement.</span>
      </div>
     </div>
    </Link>
   </div>
   <Footer />
  </div>
 )
}