import Footer from "./components/Footer";
import Header from "./components/Header";
import ProfilePics from "./components/ProfilePics";
import UserCountry from "./components/UserCountry";

export default function Home() {
  return (
    <div>
      <UserCountry />
      <ProfilePics />
      <Header />

      <Footer />
    </div>
  );
}
