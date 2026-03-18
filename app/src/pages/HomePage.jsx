import Hero from "./Hero";
import TrustStrip from "../components/TrustStrip";
import BentoGrid from "../components/BentoGrid";
import Stories from "../components/Stories";
import CTASection from "../components/CTASection";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-white">
      {/* Fixed Social Icons */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col items-start gap-3 z-50">
        <a
          href="https://www.facebook.com/fularaniorg"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white hover:bg-[#1877F2] hover:text-white rounded-r-xl shadow-lg border border-l-0 border-muted/20 transition-all text-secondary flex items-center justify-center -translate-x-2 hover:translate-x-0 group duration-300"
        >
          <Facebook
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </a>
        <a
          href="https://www.instagram.com/fularanifoundation/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white hover:bg-[#E4405F] hover:text-white rounded-r-xl shadow-lg border border-l-0 border-muted/20 transition-all text-secondary flex items-center justify-center -translate-x-2 hover:translate-x-0 group duration-300"
        >
          <Instagram
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </a>
        <a
          href="https://x.com/fularaniorg"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white hover:bg-black hover:text-white rounded-r-xl shadow-lg border border-l-0 border-muted/20 transition-all text-secondary flex items-center justify-center -translate-x-2 hover:translate-x-0 group duration-300"
        >
          <Twitter
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </a>
        <a
          href="https://in.linkedin.com/company/fularanifoundation"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white hover:bg-[#0A66C2] hover:text-white rounded-r-xl shadow-lg border border-l-0 border-muted/20 transition-all text-secondary flex items-center justify-center -translate-x-2 hover:translate-x-0 group duration-300"
        >
          <Linkedin
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </a>
      </div>

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
