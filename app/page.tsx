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
      <p className="tg-link">Hello</p>
      <p className="tg-hint">Hello</p>
      <p className="tg-secondary-bg">Hello</p>
      <p className="tg-header-bg-color">Hello</p>
      <p className="tg-accent-text-color">Hello</p>
      <p className="tg-section-bg-color">Hello</p>
      <p className="tg-section-header-tect-color">Hello</p>
      <p className="tg-subtitle-text-color">Hello</p>
      <p className="tg-destruction-text-color">Hello</p>
      <p className="tg-section-seperator-color">Hello</p>
      <p className="tg-bottom-bar-bg-color">Hello</p>

      <Footer />
    </div>
  );
}
