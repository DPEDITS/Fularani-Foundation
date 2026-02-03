import Hero from "./Hero";
import TrustStrip from "../components/TrustStrip";
import BentoGrid from "../components/BentoGrid";
import Stories from "../components/Stories";
import CTASection from "../components/CTASection";

const Home = () => {
  return (
    <div className="bg-white">
      <main>
        <Hero />
        <TrustStrip />
        <BentoGrid />
        <Stories />
        <CTASection />
      </main>
    </div>
  );
};

export default Home;
