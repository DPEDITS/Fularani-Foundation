import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { ArrowRight, Heart, ShieldCheck } from "lucide-react";
import heroBg from "../assets/missions1.jpeg";
import { getRecentDonors } from "../services/donorService";

const Hero = () => {
  const impactBadges = [
    { text: "Urgent: Support Education", color: "#ffc20e" }, // accent
    { text: "Help: Mission Thalassemia", color: "#e11d48" }, // rose-600
    { text: "Action: Mission Green", color: "#059669" }, // emerald-600
    { text: "Care: Mission Healthcare", color: "#dc2626" }, // red-600
  ];
  const [currentBadge, setCurrentBadge] = useState(0);
  const [recentDonors, setRecentDonors] = useState([]);
  const [totalDonorsCount, setTotalDonorsCount] = useState(5000);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await getRecentDonors();
        if (response.success) {
          setRecentDonors(response.data.donors);
          setTotalDonorsCount(response.data.totalDonors);
        }
      } catch (error) {
        console.error("Error fetching recent donors:", error);
      }
    };
    fetchDonors();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBadge((prev) => (prev + 1) % impactBadges.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow flex flex-col-reverse lg:flex-row items-center pt-11">
        {/* Left Side: Impact Text */}
        <div className="w-full lg:w-1/2 px-6 py-10 md:px-12 lg:px-20 lg:py-0 lg:pt-0">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-black text-secondary leading-[0.9] tracking-tighter mb-3 lg:mb-8 ">
              Empowering Dreams <br />
              <span className="text-accent underline decoration-primary decoration-4 lg:decoration-8 underline-offset-4 lg:underline-offset-8">
                inspiring
              </span>{" "}
              <br />{" "}
              <span className="text-white bg-primary px-2 lg:px-4 py-1 inline-block -rotate-1">
                humanity.
              </span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-xl mb-6 lg:mb-12 font-bold leading-tight">
              A systemic approach to Education, Sustainability, and Healthcare
              in India. Join the Fularani movement today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/donor-register"
                className="bg-accent hover:bg-accent/80 text-secondary w-full sm:w-auto px-6 py-4 lg:px-10 lg:py-5 rounded-xl text-base lg:text-lg font-black uppercase tracking-tight transition-all shadow-2xl shadow-accent/30 hover:translate-y-[-4px] flex items-center justify-center gap-3 group"
              >
                Donate Now
                <Heart
                  size={20}
                  className="fill-secondary group-hover:scale-125 transition-transform"
                />
              </a>
              <a
                href="/missions"
                className="hidden sm:flex bg-secondary hover:bg-black text-white w-full sm:w-auto px-6 py-4 lg:px-10 lg:py-5 rounded-xl text-base lg:text-lg font-black uppercase tracking-tight transition-all items-center justify-center gap-3 group"
              >
                Our Work
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 lg:mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-muted pt-4 lg:pt-8">
              <div className="flex items-center gap-2">
                <ShieldCheck size={24} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">
                  Verified NGO
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={24} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">
                  100% Transparency
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                  <span className="text-[10px] font-black text-green-600">
                    %
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">
                  80G & 12A Benefits
                </span>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Right Side: Impact Imagery (Now Video) */}
        <div className="block w-full lg:w-1/2 h-[50vh] lg:h-screen relative overflow-hidden bg-secondary">
          {/* Floating Badge */}
          <div className="hidden md:inline-flex absolute top-10 right-10 z-[40] items-center gap-2 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl shadow-black/10 border border-white/20 overflow-hidden">
            <Motion.span
              animate={{ backgroundColor: impactBadges[currentBadge].color }}
              transition={{ duration: 0.8 }}
              className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            ></Motion.span>
            <div className="h-4 flex items-center justify-center relative min-w-[210px]">
              <AnimatePresence mode="wait">
                <Motion.span
                  key={currentBadge}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary whitespace-nowrap absolute text-center"
                >
                  {impactBadges[currentBadge].text}
                </Motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div
            className="w-full h-full relative"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src="/0214.gif"
              alt="Fularani Foundation Impact"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Mask/Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/20 to-transparent z-10 transition-opacity"></div>
            <div className="absolute inset-0 bg-secondary/20 z-0"></div>
          </div>

          {/* Floating Impact Card - Pill on Mobile, Square on PC */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10 md:right-10 md:left-auto md:translate-x-0 z-40 w-full flex justify-center md:block md:w-auto px-4">
            <div className="bg-white/95 backdrop-blur-xl px-4 py-2 md:p-6 rounded-full md:rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center md:block gap-3 md:gap-0 max-w-fit md:max-w-[280px]">
              <div className="flex -space-x-2.5 md:-space-x-3 md:mb-1 shrink-0">
                {recentDonors.length > 0
                  ? recentDonors.map((donor, i) => (
                      <div
                        key={donor._id || i}
                        className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden bg-primary"
                      >
                        <img
                          src={donor.avatar}
                          alt={donor.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  : [1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[7px] md:text-[8px] font-black text-white`}
                      >
                        FF
                      </div>
                    ))}
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-white bg-accent flex items-center justify-center text-[9px] md:text-[10px] font-black text-secondary">
                  +{totalDonorsCount > 5000 ? totalDonorsCount : "5k"}
                </div>
              </div>

              <p className="text-[10px] md:text-sm font-black text-secondary/90 leading-tight md:mt-2 italic whitespace-nowrap tracking-tight">
                Join{" "}
                {totalDonorsCount > 5000
                  ? totalDonorsCount.toLocaleString()
                  : "5,000"}
                + life-changers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
