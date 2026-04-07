import React, { useEffect, useRef } from "react";
import Hero from "./Hero";
import TrustStrip from "../components/TrustStrip";
import BentoGrid from "../components/BentoGrid";
import Stories from "../components/Stories";
import HomeGallery from "../components/HomeGallery";
import CTASection from "../components/CTASection";
import {
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  GraduationCap,
  Truck,
  Leaf,
  Ribbon,
  Dumbbell,
  Landmark,
  Droplets,
  Recycle,
  Sparkles,
  Briefcase,
  Bot,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projectTiles = [
  {
    id: "education-for-all",
    title: "Mission education for all",
    subtitle: "Providing modern digital tools and dedicated mentorship to rural children across Odisha.",
    accentColor: "#0066cc",
    icon: GraduationCap,
  },
  {
    id: "mission-mobility",
    title: "Mission mobility",
    subtitle: "Breaking barriers to accessible movement across underserved communities.",
    accentColor: "#0d9488",
    icon: Truck,
  },
  {
    id: "green",
    title: "Mission green",
    subtitle: "500+ trees planted and counting—driving environmental action at the grassroots.",
    accentColor: "#059669",
    icon: Leaf,
  },
  {
    id: "mission-period-pride",
    title: "Mission period pride",
    subtitle: "Championing menstrual dignity through awareness, access, and education.",
    accentColor: "#db2777",
    icon: Ribbon,
  },
  {
    id: "healthy-bhadrak-gym",
    title: "Healthy bhadrak gym",
    subtitle: "Building fitness infrastructure for healthier, stronger communities.",
    accentColor: "#7c3aed",
    icon: Dumbbell,
  },
  {
    id: "donation-wall",
    title: "Donation wall",
    subtitle: "A transparent ledger of every contribution—accountability you can see.",
    accentColor: "#d97706",
    icon: Landmark,
  },
  {
    id: "no-thalassemia-2035",
    title: "No thalassemia 2035",
    subtitle: "An urgent mission to eliminate thalassemia through screening and care.",
    accentColor: "#dc2626",
    icon: Droplets,
  },
  {
    id: "waste-to-wealth",
    title: "Waste to wealth",
    subtitle: "Turning community waste into economic opportunity and environmental gain.",
    accentColor: "#65a30d",
    icon: Recycle,
  },
  {
    id: "jeevan-kaushal",
    title: "Jeevan kaushal",
    subtitle: "Life skills training to unlock brighter futures for rural youth.",
    accentColor: "#334155",
    icon: Sparkles,
  },
  {
    id: "career-connect",
    title: "Career connect",
    subtitle: "Guiding career journeys with mentorship and opportunity mapping.",
    accentColor: "#0891b2",
    icon: Briefcase,
  },
  {
    id: "krishi-sakha-ai",
    title: "Krishi sakha AI",
    subtitle: "AI-powered farming support for smarter, sustainable agriculture.",
    accentColor: "#047857",
    icon: Bot,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ProjectTileCard = ({ project, className = "" }) => {
  const Icon = project.icon;

  return (
    <Link
      to={`/missions/${project.id}`}
      className={`block h-full rounded-[28px] md:rounded-[32px] border border-secondary/10 bg-white/90 backdrop-blur-sm p-5 md:p-7 relative overflow-hidden ${className}`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 mb-4 md:mb-5">
          <div
            className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: project.accentColor }}
          >
            <Icon size={20} />
          </div>
          {/* <span className="text-[9px] uppercase tracking-[0.3em] font-black text-secondary/40 leading-none">
            Initiative
          </span> */}
        </div>
        <h3 className="text-[1.05rem] md:text-xl font-black text-secondary mb-2 leading-tight tracking-tight ">
          {project.title}
        </h3>
        <p className="hidden md:block text-[13px] md:text-sm text-muted-foreground font-medium leading-6 md:leading-relaxed mb-4">
          {project.subtitle}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/50">
          Learn more <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const heroPanel = document.querySelector(".home-hero-panel");
        const revealPanels = gsap.utils.toArray(".home-reveal-panel");

        if (heroPanel) {
          gsap.to(heroPanel, {
            // scale: 0.965,
            // autoAlpha: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: heroPanel,
              start: "top top",
              end: "bottom top+=10%",
              scrub: true,
              pin: true,
              pinSpacing: false,
            },
          });
        }

        revealPanels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 120, autoAlpha: 0.15 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom-=8%",
                end: "top center+=8%",
                scrub: true,
              },
            }
          );
        });
      });

      mm.add("(max-width: 1023px)", () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger?.classList?.contains("home-mobile-projects-stage")) {
            trigger.kill();
          }
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-white">
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
        <div className="home-hero-panel relative z-0 bg-white">
          <Hero />
        </div>
        {/* ── OUR PROJECTS SO FAR ── */}
        <section className="home-reveal-panel py-20 md:py-32 px-6 bg-white border-y border-secondary/5 relative overflow-hidden z-10">
          {/* Decorative background elements matching the site theme */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[120px] -translate-x-1/2"></div>

          <div className="max-w-[1200px] mx-auto relative z-10">
            {/* Header — matching BentoGrid / Missions page pattern */}
            <div className="mb-10 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <Motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl"
              >
                <div className="inline-block bg-primary px-4 py-1 rounded-sm text-[12px] font-black uppercase tracking-[0.2em] text-white mb-6">
                  Our Projects So Far
                </div>
                <h2 className="text-5xl md:text-7xl lg:text-7xl font-black text-secondary tracking-tighter leading-[0.85] lowercase">
                  building brighter futures,{" "}
                  <br />
                  <span className="text-secondary bg-accent px-4 py-1 inline-block -rotate-1 mt-3">
                    one initiative at a time.
                  </span>
                </h2>
              </Motion.div>
              <Motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl font-bold text-muted-foreground max-w-sm leading-tight pb-4 border-l-4 border-primary pl-6"
              >
                Explore the community-led programs we are building—from
                education and health to green innovation and digital
                empowerment.
              </Motion.p>
            </div>

            <Motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
            >
              {projectTiles.map((project) => (
                <Motion.div key={project.id} variants={cardVariants}>
                  <ProjectTileCard project={project} />
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </section>

        <div className="home-reveal-panel relative z-20 bg-white">
          <BentoGrid />
        </div>
        <div className="home-reveal-panel relative z-25 bg-white">
          <HomeGallery />
        </div>
        <div className="home-reveal-panel relative z-30 bg-white">
          <Stories />
        </div>
        <div className="home-reveal-panel relative z-40 bg-white">
          <CTASection />
        </div>
      </main>
    </div>
  );
};

export default Home;
