import Link from "next/link";
import Footer from "../components/Footer";
import TgIcon from "../components/Icon";

export default function Publish() {
 return (
  <div>
   <div>
    <h1 className="mb-2 font-bold text-2xl">Choose Campaign Type</h1>
    <p className="text-sm hint-color">Select the number of impression or clicks you need, create your gig, pay with GIGSGRAM Token</p>
   </div>
   <div className="mt-4 flex flex-col gap-4">
    <Link href="/publish/socialGig" className="w-full">
     <div className="p-4 flex flex-row gap-4 items-center w-full rounded-2xl primary-bg">
      <TgIcon src="/click.svg" size={28} className="icon-color-active"></TgIcon>
      <div className="flex flex-col">
       <span className="text-lg">Standard Click Gig</span>
       <span className="text-sm hint-color">Pay per click or gig completion. Ideal for driving social traffic and engagement.</span>
      </div>
     </div>
    </Link>

    <Link href="/publish/cryptoGig" className="w-full">
     <div className="p-4 flex flex-row gap-4 items-center w-full rounded-2xl primary-bg">
      <TgIcon src="/gigsgram.svg" size={28} className="icon-color-active"></TgIcon>
      <div className="flex flex-col">
       <span className="text-lg">Crypto Gig</span>
       <span className="text-sm hint-color">Grow token holders. Reward users for buying and holding crypto token.</span>
      </div>
     </div>
    </Link>
   </div>
   <Footer />
  </div>
 )
}