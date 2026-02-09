import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, Heart, ShieldCheck } from "lucide-react";
import heroBg from "../assets/missions1.jpeg";

const Hero = () => {
  const impactBadges = [
    { text: "Urgent: Support Education", color: "#ffc20e" }, // accent
    { text: "Help: Mission Thalassemia", color: "#e11d48" }, // rose-600
    { text: "Action: Mission Green", color: "#059669" }, // emerald-600
    { text: "Care: Mission Mobility", color: "#0284c7" }, // sky-600
    { text: "Pride: Mission Period Pride", color: "#db2777" }, // pink-600
  ];
  const [currentBadge, setCurrentBadge] = useState(0);
  const videoRef = React.useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.muted = true; // Ensure muted for autoplay
        await video.play();
      } catch (error) {
        console.log("Video autoplay failed:", error);
      }
    };

    // Try to play when video can play
    video.addEventListener("canplay", playVideo);

    // Also try immediately
    playVideo();

    // Fallback: play on first user interaction (touch/click)
    const handleInteraction = () => {
      playVideo();
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });

    return () => {
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
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
      <div className="relative z-10 flex-grow flex flex-col-reverse lg:flex-row items-center pt-9">
        {/* Left Side: Impact Text */}
        <div className="w-full lg:w-1/2 px-6 py-2 md:px-12 lg:px-20 lg:py-0 lg:pt-0">
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
              in Bhadrak. Join the Fularani movement today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/donor-register"
                className="bg-accent hover:bg-accent/80 text-secondary px-8 py-4 lg:px-10 lg:py-5 rounded-xl text-base lg:text-lg font-black uppercase tracking-tight transition-all shadow-2xl shadow-accent/30 hover:translate-y-[-4px] flex items-center justify-center gap-3 group"
              >
                Donate Now
                <Heart
                  size={20}
                  className="fill-secondary group-hover:scale-125 transition-transform"
                />
              </a>
              <a
                href="/missions"
                className="bg-secondary hover:bg-black text-white px-8 py-4 lg:px-10 lg:py-5 rounded-xl text-base lg:text-lg font-black uppercase tracking-tight transition-all flex items-center justify-center gap-3 group"
              >
                Our Work
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 lg:mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-muted pt-4 lg:pt-8">
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

          <div className="w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={heroBg}
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            >
              <source src="/PXL_20230110_133736033.mp4" type="video/mp4" />
            </video>

            {/* Mask/Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/20 to-transparent z-10 transition-opacity"></div>
            <div className="absolute inset-0 bg-secondary/20 z-0"></div>
          </div>

          {/* Floating Impact Card */}
          <div className="absolute bottom-2 right-2 md:bottom-10 md:right-10 z-30 block">
            <div className="bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-3xl border border-white/20 max-w-[280px]">
              <div className="flex -space-x-3 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[8px] font-black text-white`}
                  >
                    FF
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-accent flex items-center justify-center text-[8px] font-black text-secondary">
                  +5k
                </div>
              </div>
              <p className="text-sm font-black text-secondary leading-tight">
                Join 5,000+ donors making a real difference in Bhadrak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
