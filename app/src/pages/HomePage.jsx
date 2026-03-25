import Hero from "./Hero";
import TrustStrip from "../components/TrustStrip";
import BentoGrid from "../components/BentoGrid";
import Stories from "../components/Stories";
import CTASection from "../components/CTASection";
import { Facebook, Instagram, Linkedin } from "lucide-react";

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
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current group-hover:scale-110 transition-transform">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
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
