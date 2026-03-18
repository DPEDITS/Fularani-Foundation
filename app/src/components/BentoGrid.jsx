import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  Leaf,
  HeartPulse,
  Heart,
} from "lucide-react";
import { motion as Motion } from "motion/react";
import educationBg from "../assets/AI/education_bg.png";
import greenBg from "../assets/AI/green_bg.png";
import healthcareBg from "../assets/AI/healthcare_bg.png";
import thalassemiaBg from "../assets/AI/thalassemia_bg.png";

const BentoGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="pt-10 pb-16 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="mb-8 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <Motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-block bg-primary px-4 py-1 rounded-sm text-[12px] font-black uppercase tracking-[0.2em] text-white mb-6">
              Empowerment in Action
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-secondary tracking-tighter leading-[0.85] lowercase">
              our core <br />
              <span className="text-secondary bg-accent px-4 py-1 inline-block -rotate-1 mt-4">
                missions.
              </span>
            </h2>
          </Motion.div>
          <Motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl font-bold text-muted-foreground max-w-sm leading-tight pb-4 border-l-4 border-primary pl-6"
          >
            Systemic solutions for community resilience, driven by transparency
            and local leadership.
          </Motion.p>
        </div>

        <Motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-none lg:grid-rows-2 gap-6 h-auto lg:h-[700px]"
        >
          {/* Mission Education - Large Featured Card */}
          <Motion.div 
            variants={itemVariants}
            className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden bg-secondary rounded-[32px] md:rounded-[40px] shadow-2xl min-h-[400px] lg:min-h-0 cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-60"
              style={{ backgroundImage: `url(${educationBg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 z-20">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 transform group-hover:rotate-12 transition-transform duration-500">
                <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />
              </div>

              <div>
                <span className="text-white bg-primary px-3 py-1 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] mb-3 md:mb-4 inline-block">
                  Featured Mission
                </span>
                <h3 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-[0.9] lowercase">
                  breaking the cycle <br /> through <span className="text-primary italic">learning.</span>
                </h3>
                <p className="hidden md:block text-white/70 text-lg font-bold mb-8 max-w-md leading-snug">
                  Providing modern digital tools and dedicated mentorship to 1200+ rural children in Odisha.
                </p>
                <Link
                  to="/missions"
                  className="inline-flex items-center gap-3 bg-white text-secondary px-8 py-4 rounded-2xl font-black uppercase tracking-tight text-sm hover:bg-primary transition-all group/btn shadow-xl"
                >
                  Explore Mission <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </Motion.div>

          {/* Mission Green - Wide Secondary Card */}
          <Motion.div 
            variants={itemVariants}
            className="lg:col-span-2 lg:row-span-1 relative group overflow-hidden bg-[#34c759] rounded-[24px] md:rounded-[32px] shadow-xl min-h-[220px] md:min-h-[300px] cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-50 grayscale hover:grayscale-0 transition-all"
              style={{ backgroundImage: `url(${greenBg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#34c759]/90 via-[#34c759]/40 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
                  <Leaf className="w-5 h-5 md:w-6 md:w-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none lowercase">
                  mission <br /> <span className="text-secondary">green.</span>
                </h3>
              </div>
              
              <Link
                to="/missions/green"
                className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-[11px] text-white hover:translate-x-2 transition-transform opacity-70 hover:opacity-100"
              >
                Read Success Story <ArrowRight size={16} />
              </Link>
            </div>
          </Motion.div>

          {/* Healthcare Card */}
          <Motion.div 
            variants={itemVariants}
            className="lg:col-span-1 lg:row-span-1 relative group overflow-hidden bg-white border-2 border-primary/10 rounded-[24px] md:rounded-[32px] shadow-xl min-h-[220px] md:min-h-[300px] cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-20"
              style={{ backgroundImage: `url(${healthcareBg})` }}
            ></div>
            
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-20">
              <div className="space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <HeartPulse className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-secondary tracking-tighter leading-none lowercase">
                  health & <br /> <span className="text-primary underline decoration-2 underline-offset-4">access.</span>
                </h3>
              </div>
              
              <Link
                to="/missions/healthcare"
                className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-[11px] text-secondary hover:translate-x-2 transition-transform"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </Motion.div>

          {/* Thalassemia Card - Action Oriented */}
          <Motion.div 
            variants={itemVariants}
            className="lg:col-span-1 lg:row-span-1 relative group overflow-hidden bg-primary rounded-[24px] md:rounded-[32px] shadow-2xl min-h-[220px] md:min-h-[300px] cursor-pointer border-2 border-white/20"
          >
             <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-40 mix-blend-overlay"
              style={{ backgroundImage: `url(${thalassemiaBg})` }}
            ></div>
            
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-20">
              <div className="space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 animate-pulse">
                  <Heart className="w-5 h-5 md:w-6 md:h-6" fill="white" />
                </div>
                <div>
                   <span className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest block mb-2">Urgent Appeal</span>
                   <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none lowercase">
                    save <br /> <span className="text-accent underline decoration-2 underline-offset-4">lives.</span>
                  </h3>
                </div>
              </div>
              
              <Link
                to="/missions/thalassemia"
                className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-[11px] text-white hover:translate-x-2 transition-transform bg-black/20 p-2 rounded-lg backdrop-blur-sm"
              >
                Support Now <ArrowRight size={16} />
              </Link>
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
};

export default BentoGrid;