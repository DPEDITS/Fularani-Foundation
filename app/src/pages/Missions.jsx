import MissionGreen from "../components/MissionGreen";
import MissionMobility from "../components/MissionMobility";
import MissionEducation from "../components/MissionEducation";
import MissionPeriod from "../components/MissionPeriod";
import MissionThalassemia from "../components/MissionThalassemia";
import { useEffect, useState } from "react";
import { motion as Motion } from "motion/react";
import {
  ArrowRight,
  Globe,
  Leaf,
  Heart,
  School,
  ShieldCheck,
} from "lucide-react";

const Missions = () => {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[120px] -translate-x-1/2"></div>

      {/* PAGE HEADER */}
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left mb-20"
          >
            <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-6">
              Impact & Initiatives
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-secondary leading-[0.9] tracking-tighter mb-10 lowercase">
              Changing lives, <br />
              <span className="text-white bg-primary px-6 py-2 inline-block -rotate-1 mt-2">
                one mission at a time.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-tight max-w-[800px] font-bold">
              Fularani Foundation is committed to creating systemic social
              impact through focused initiatives in healthcare, education,
              environment, and humanitarian relief.
            </p>
          </Motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            <StatCard
              end={1500}
              suffix="+"
              label="Meals Served"
              icon={<Heart size={24} />}
            />
            <StatCard
              end={10000}
              suffix="+"
              label="Trees Planted"
              icon={<Leaf size={24} />}
            />
            <StatCard
              end={100}
              suffix="+"
              label="Volunteers"
              icon={<Globe size={24} />}
            />
            <StatCard
              end={50}
              suffix="+"
              label="Campaigns"
              icon={<ShieldCheck size={24} />}
            />
          </div>
        </div>
      </section>

      {/* MISSIONS GRID */}
      <section className="py-24 px-6 bg-muted/10 border-y border-secondary/5 relative z-10">
        <div className="max-w-[1200px] mx-auto space-y-32">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter leading-none mb-6 lowercase">
              Our{" "}
              <span className="text-primary italic underline decoration-accent decoration-8 underline-offset-8">
                Dedicated
              </span>{" "}
              Missions
            </h2>
            <p className="text-xl text-muted-foreground font-bold max-w-[600px] leading-tight">
              Tailored programs designed to address specific social needs and
              drive sustainable change in the heart of Bhadrak.
            </p>
          </Motion.div>

          <div className="space-y-16">
            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <MissionEducation />
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <MissionPeriod />
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <MissionGreen />
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <MissionMobility />
            </Motion.div>
          </div>
        </div>
      </section>

      {/* UPCOMING MISSIONS */}
      <section className="py-32 px-6 bg-secondary text-white relative overflow-hidden">
        {/* Decorative pulse element */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

        <div className="max-w-[1200px] mx-auto space-y-24 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-white mb-6">
                Future Impact
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none lowercase">
                upcoming <br />
                <span className="text-secondary bg-accent px-4 py-1 inline-block rotate-1 mt-2">
                  initiatives.
                </span>
              </h2>
            </div>
            <p className="text-xl text-white/60 font-medium max-w-[400px] leading-tight pb-2">
              Critical projects requiring immediate collective action and
              heartfelt support.
            </p>
          </div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <MissionThalassemia />
          </Motion.div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto bg-primary text-white p-12 md:p-24 rounded-[40px] text-center relative overflow-hidden shadow-2xl shadow-primary/30">
          {/* Abstract background element */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-12 lowercase">
              Want to make <br />
              <span className="text-secondary bg-accent px-6 py-2 inline-block -rotate-1 mt-4">
                an impact?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-16 max-w-[700px] mx-auto font-bold leading-tight">
              Join our community of 5,000+ volunteers and donors. Together, we
              can reach more people and transform more lives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => (window.location.href = "/volunteer-login")}
                className="w-full sm:w-auto bg-secondary text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-tight hover:bg-black transition-all flex items-center justify-center gap-3 group"
              >
                Join the Mission{" "}
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
              <a
                href="/contact"
                className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-tight hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ end, suffix = "", label, icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="flex flex-col items-center md:items-start group">
      <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm">
        {icon}
      </div>
      <h3 className="text-5xl md:text-6xl font-black text-secondary leading-none mb-2 tracking-tighter">
        {count.toLocaleString()}
        {suffix}
      </h3>
      <p className="text-[10px] font-black text-secondary/40 tracking-[0.2em] uppercase">
        {label}
      </p>
    </div>
  );
};

export default Missions;
