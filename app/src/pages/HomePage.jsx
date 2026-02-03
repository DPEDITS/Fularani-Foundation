import { Banner } from "../components/Banner";
import FeaturedMissions from "../components/FeaturedMissions";
import HomeAbout from "../components/HomeAbout";
import HomeGallery from "../components/HomeGallery";
import CTASection from "../components/CTASection";

const Home = () => {
  return (
    <div className="bg-white">
      <main>
        <Banner />
        <FeaturedMissions />
        <HomeAbout />
        <HomeGallery />
        <CTASection />
      </main>
    </div>
  );
};

export default Home;
