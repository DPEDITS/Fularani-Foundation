import React from "react";
import {
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Trees,
  Utensils,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import heroBg from "../assets/missions1.jpeg";

const Hero = () => {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex flex-col">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://ik.imagekit.io/whyr6vf5a/Abhi/IMG_20260115_171518_400.jpg?updatedAt=1768477602056)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-r from-black/50 to-transparent"></div>
      </div>

      {/* Social Sidebar */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-6 p-4 bg-black/50 backdrop-blur-md border-l border-y border-white/20 rounded-l-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform translate-x-0">
        <a
          href="#"
          className="text-white/80 hover:text-[#1877F2] hover:scale-110 transition-all duration-300"
        >
          <Facebook size={24} />
        </a>
        <a
          href="#"
          className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300"
        >
          {/* Using Twitter icon for X as fallback, styling it white on hover like X logo usually is */}
          <Twitter size={24} />
        </a>
        <a
          href="#"
          className="text-white/80 hover:text-[#E4405F] hover:scale-110 transition-all duration-300"
        >
          <Instagram size={24} />
        </a>
        <a
          href="#"
          className="text-white/80 hover:text-[#0A66C2] hover:scale-110 transition-all duration-300"
        >
          <Linkedin size={24} />
        </a>
        <a
          href="#"
          className="text-white/80 hover:text-[#FF0000] hover:scale-110 transition-all duration-300"
        >
          <Youtube size={24} />
        </a>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex items-center px-6 md:px-12 lg:px-20 pt-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 drop-shadow-lg tracking-tight">
            Empowering World. <br />
            Greening the Future.
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mb-10 font-medium drop-shadow-md leading-relaxed">
            A systemic approach to Education, Sustainability, and Health.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-16">
            <a
              href="/missions"
              className="bg-[#007AFF] hover:bg-[#0062cc] text-white px-8 py-4 rounded-full text-[17px] font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-[0.98]"
            >
              See Our Impact
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <button
              onClick={() => {}} // Placeholder for video modal
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full text-[17px] font-medium hover:bg-white/20 transition-all flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Watch Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
