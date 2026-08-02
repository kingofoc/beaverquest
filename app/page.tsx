import Footer from "./components/Footer";
import HeroCard from "./components/HeroCard";
import ProfilePics from "./components/ProfilePics";
import UserCountry from "./components/UserCountry";

export default function Home() {
  return (
    <div>
      <UserCountry />
      <ProfilePics />
      
      <div>
        <HeroCard />
      </div>

      <Footer />
    </div>
  );
}
