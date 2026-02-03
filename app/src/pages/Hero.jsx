import React from "react";
import {
  ArrowRight,
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
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-r from-black/50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex items-center px-6 md:px-12 lg:px-20 pt-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 drop-shadow-lg tracking-tight">
            Empowering Bhadrak. <br />
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
