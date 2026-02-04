import React from "react";
import {
  ArrowRight,
  GraduationCap,
  Leaf,
  Accessibility,
  HeartPulse,
} from "lucide-react";
import missionsBg from "../assets/missions1.jpeg";

const BentoGrid = () => {
  const focusAreas = [
    {
      title: "Quality Education",
      subtitle: "Mission Education",
      desc: "Providing holistic learning environments and digital literacy to rural children.",
      icon: <GraduationCap size={32} />,
      link: "/missions",
      color: "bg-primary",
      textColor: "text-secondary",
      span: "md:col-span-2 md:row-span-2",
      image: missionsBg,
    },
    {
      title: "Environmental Action",
      subtitle: "Mission Green",
      desc: "Reforestation projects and sustainable farming initiatives.",
      icon: <Leaf size={24} />,
      link: "/missions",
      color: "bg-muted",
      textColor: "text-secondary",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Health & Care",
      subtitle: "Healthcare Support",
      desc: "Medical camps and specialized care for chronic conditions.",
      icon: <HeartPulse size={24} />,
      link: "/missions",
      color: "bg-muted",
      textColor: "text-secondary",
      span: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-block bg-primary px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-4">
              What We Do
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter leading-none lowercase">
              our core <br />
              <span className="text-accent underline decoration-primary decoration-8 underline-offset-4">
                missions
              </span>
              .
            </h2>
          </div>
          <p className="text-lg font-bold text-muted-foreground max-w-sm leading-tight">
            Systemic solutions for community resilience, driven by transparency
            and local leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-8 h-auto md:h-[700px]">
          {/* Main Card (Large) */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-secondary shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-40 grayscale hover:grayscale-0 transition-all"
              style={{ backgroundImage: `url(${missionsBg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent"></div>

            <div className="absolute top-8 left-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-secondary">
                <GraduationCap size={32} />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 p-10 md:p-12 w-full">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
                Mission Education
              </span>
              <h3 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[1] lowercase">
                breaking the cycle <br /> through{" "}
                <span className="text-primary">learning.</span>
              </h3>
              <p className="text-white/60 text-lg font-bold mb-8 max-w-lg leading-tight">
                Empowering the next generation in Bhadrak with quality
                resources, digital tools, and emotional support.
              </p>
              <a
                href="/missions"
                className="inline-flex items-center gap-3 bg-white text-secondary px-8 py-4 rounded-xl font-black uppercase tracking-tight text-sm hover:bg-primary transition-all"
              >
                Explore Mission <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Secondary Cards */}
          <div className="relative group overflow-hidden bg-primary p-10 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <Leaf size={40} className="text-white" />
              <h3 className="text-3xl font-black text-white tracking-tighter leading-none lowercase">
                mission <br /> <span className="text-accent">green.</span>
              </h3>
            </div>
            <a
              href="/missions"
              className="mt-8 flex items-center gap-2 font-black uppercase tracking-tight text-sm text-white group-hover:translate-x-2 transition-transform"
            >
              Read Story <ArrowRight size={18} />
            </a>
          </div>

          <div className="relative group overflow-hidden bg-muted p-10 shadow-2xl flex flex-col justify-between border border-secondary/5">
            <div className="space-y-4">
              <HeartPulse size={40} className="text-accent" />
              <h3 className="text-3xl font-black text-secondary tracking-tighter leading-none lowercase">
                health & <br />{" "}
                <span className="text-accent underline">access.</span>
              </h3>
            </div>
            <a
              href="/missions"
              className="mt-8 flex items-center gap-2 font-black uppercase tracking-tight text-sm text-secondary group-hover:translate-x-2 transition-transform"
            >
              Learn More <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
