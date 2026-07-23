import ConnectWallet from "./components/ConnectWallet";
import Footer from "./components/Footer";
import UserCountry from "./components/UserCountry";

export default function Home() {
  return (
    <div>
      <UserCountry />

      <div>
        <h1>Welcome to BeaverQuest</h1>
        <ConnectWallet />
      </div>

      <button>Start task</button>

      <h2>Telegram theme colors</h2>
      <p className="color1">Hello</p>
      <p className="color2">Hello</p>
      <p className="color3">Hello</p>
      <p className="color4">Hello</p>
      <p className="color5">Hello</p>
      <p className="color6">Hello</p>
      <p className="color7">Hello</p>
      <p className="color8">Hello</p>
      <p className="color9">Hello</p>
      <p className="color10">Hello</p>
      <p className="color11">Hello</p>

      <Footer />
    </div>
  );
}
