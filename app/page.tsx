import Footer from "./components/Footer";
import ProfilePics from "./components/ProfilePics";
import UserCountry from "./components/UserCountry";

export default function Home() {
  return (
    <div>
      <UserCountry />
      <ProfilePics />

      <Footer />
    </div>
  );
}
