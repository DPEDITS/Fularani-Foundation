import MissionGreen from "../components/MissionGreen";
import MissionEducation from "../components/MissionEducation";
import MissionHealthcare from "../components/MissionHealthcare";
import { useEffect, useState } from "react";
import { motion as Motion } from "motion/react";
import { safeLocationRedirect } from "../utils/safeNavigate";
import { missions } from "../data/missions";
import {
  ChevronDown,
  ArrowRight,
  Globe,
  Leaf,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const groupedSubdivisions = [
  {
    key: "education",
    eyebrow: "Education Projects",
    title: "Sub-division projects under Mission Education",
    projectIds: ["jeevan-kaushal", "career-connect"],
    cardClassName: "border-blue-100 bg-blue-50/60",
    badgeClassName: "bg-blue-100 text-[#0071e3]",
    linkClassName: "text-[#0071e3]",
  },
  {
    key: "healthcare",
    eyebrow: "Healthcare Projects",
    title: "Sub-division projects under Mission Healthcare",
    projectIds: [
      "mission-mobility",
      "mission-period-pride",
      "healthy-bhadrak-gym",
      "donation-wall",
      "thalassemia",
    ],
    cardClassName: "border-red-100 bg-red-50/60",
    badgeClassName: "bg-red-100 text-[#ff3b30]",
    linkClassName: "text-[#ff3b30]",
  },
  {
    key: "green",
    eyebrow: "Green Projects",
    title: "Sub-division projects under Mission Green",
    projectIds: ["waste-to-wealth", "krishi-sakha-ai"],
    cardClassName: "border-green-100 bg-green-50/60",
    badgeClassName: "bg-green-100 text-[#34c759]",
    linkClassName: "text-[#198754]",
  },
];

const Missions = () => {
  const [activeMission, setActiveMission] = useState("");

  const subdivisionProjects = groupedSubdivisions.map((group) => ({
    ...group,
    projects: group.projectIds
      .map((projectId) => missions.find((mission) => mission.id === projectId))
      .filter(Boolean),
  }));

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[120px] -translate-x-1/2"></div>

      {/* PAGE HEADER */}
      <section className="pt-24 pb-16 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-start">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left mb-12"
            >
              <div className="inline-block bg-accent px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.18em] text-secondary mb-4">
                Impact & Initiatives
              </div>
              <h1 className="text-[2.8rem] md:text-6xl lg:text-[4.6rem] font-black text-secondary leading-[0.92] tracking-tighter mb-6 lowercase">
                Changing lives, <br />
                <span className="text-white bg-primary px-2 py-2 inline-block -rotate-1 mt-2">
                  Empowering change
                  <br />
                  on every front.
                </span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground leading-snug max-w-[720px] font-semibold">
                Fularani Foundation is committed to creating systemic social
                impact through focused initiatives in healthcare, education,
                environment.
              </p>
            </Motion.div>

            <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-28">
              <div className="rounded-[32px] border border-secondary/10 bg-white/90 p-4 shadow-xl backdrop-blur-sm">
                <StatCard
                  end={500}
                  suffix="+"
                  label="Trees Planted"
                  icon={<Leaf size={20} />}
                />
              </div>
              <div className="rounded-[32px] border border-secondary/10 bg-white/90 p-4 shadow-xl backdrop-blur-sm">
                <StatCard
                  end={1200}
                  suffix="+"
                  label="Child Outreach"
                  icon={<Heart size={20} />}
                />
              </div>
              <div className="rounded-[32px] border border-secondary/10 bg-white/90 p-4 shadow-xl backdrop-blur-sm">
                <StatCard
                  end={10}
                  suffix="+"
                  label="Villages Served"
                  icon={<Globe size={20} />}
                />
              </div>
              <div className="rounded-[32px] border border-secondary/10 bg-white/90 p-4 shadow-xl backdrop-blur-sm">
                <StatCard
                  end={3}
                  suffix=""
                  label="Active Missions"
                  icon={<ShieldCheck size={20} />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSIONS GRID */}
      <section className="py-6 px-6 bg-muted/10 border-y border-secondary/5 relative z-10">
        <div className="max-w-[1200px] mx-auto space-y-24">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-black text-secondary tracking-tighter leading-[0.95] mb-4 lowercase">
              Our{" "}
              <span className="text-primary italic underline decoration-accent decoration-8 underline-offset-8">
                Dedicated
              </span>{" "}
              Missions
            </h2>
            <p className="text-base md:text-lg text-muted-foreground font-semibold max-w-[560px] leading-snug">
              Tailored programs designed to address specific social needs and
              drive sustainable change in the heart of India.
            </p>
          </Motion.div>

          <div className="max-w-[1200px] mx-auto mt-14 space-y-5">
            {subdivisionProjects.map((group, index) => {
              const isActive = activeMission === group.key;
              const ParentMissionCard =
                group.key === "education"
                  ? MissionEducation
                  : group.key === "healthcare"
                    ? MissionHealthcare
                    : MissionGreen;

              return (
                <Motion.div
                  key={group.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  className="rounded-[32px] border border-secondary/10 bg-white shadow-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMission((current) =>
                        current === group.key ? "" : group.key
                      )
                    }
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-4 p-5 md:p-6 border-b border-secondary/5 bg-white">
                      <div>
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${group.badgeClassName}`}
                        >
                          <Sparkles size={12} />
                          {group.eyebrow}
                        </div>
                        <h3 className="mt-3 text-xl md:text-2xl font-black text-secondary tracking-tight">
                          {group.title.replace("Sub-division projects under ", "")}
                        </h3>
                        <p className="mt-1 text-sm md:text-[15px] text-muted-foreground font-medium">
                          Tap to {isActive ? "hide" : "view"} all projects under this mission.
                        </p>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/5 text-secondary">
                        <ChevronDown
                          size={22}
                          className={`transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                  </button>

                  {isActive && (
                    <div className="p-5 md:p-6 space-y-6 bg-[#fcfcfd]">
                      <ParentMissionCard />
                      <SubDivisionProjects group={group} />
                    </div>
                  )}
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto bg-primary text-white p-10 md:p-18 rounded-[40px] text-center relative overflow-hidden shadow-2xl shadow-primary/30">
          {/* Abstract background element */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85] mb-8 lowercase">
              Want to make <br />
              <span className="text-secondary bg-accent px-6 py-2 inline-block -rotate-1 mt-4">
                an impact?
              </span>
            </h2>
            <p className="text-base md:text-xl text-white/80 mb-12 max-w-[620px] mx-auto font-semibold leading-snug">
              Join our community of 100+ volunteers and donors. Together, we
              can reach more people and transform more lives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => {
                  window.fbq?.('track', 'Lead', { content_name: 'Mission Page Bottom CTA' });
                  safeLocationRedirect("/volunteer-login");
                }}
                className="w-full sm:w-auto bg-secondary text-white px-10 py-4 rounded-2xl text-base font-black uppercase tracking-tight flex items-center justify-center gap-3"
              >
                Join the Mission{" "}
                <ArrowRight size={24} />
              </button>
               <a
                href="/contact"
                onClick={() => window.fbq?.('track', 'Contact', { content_name: 'Mission Page Contact Link' })}
                className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-2xl text-base font-black uppercase tracking-tight flex items-center justify-center gap-3"
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

const SubDivisionProjects = ({ group }) => {
  if (!group?.projects?.length) return null;

  return (
    <div className="rounded-[28px] border border-secondary/10 bg-white p-5 md:p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${group.badgeClassName}`}
          >
            <Sparkles size={12} />
            {group.eyebrow}
          </div>
          <h3 className="mt-3 text-xl md:text-[1.7rem] font-black text-secondary tracking-tight leading-tight">
            {group.title}
          </h3>
        </div>
        <p className="text-sm md:text-[15px] font-medium text-muted-foreground max-w-lg leading-snug">
          Each project below is linked to its own detailed mission page.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {group.projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => safeLocationRedirect(`/missions/${project.id}`)}
            className={`rounded-[22px] border p-4 md:p-5 text-left ${group.cardClassName}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm"
                style={{ color: project.theme?.color }}
              >
                {project.icon ? <project.icon size={22} /> : <Sparkles size={22} />}
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-secondary/60">
                {project.subtitle}
              </span>
            </div>

            <h4 className="mt-4 text-lg md:text-xl font-black text-secondary leading-snug tracking-tight">
              {project.title}
            </h4>
            <p className="mt-2.5 text-[14px] leading-6 text-secondary/70 font-medium">
              {project.description}
            </p>

            <div
              className={`mt-4 inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.14em] ${group.linkClassName}`}
            >
              Explore project
              <ArrowRight size={16} />
            </div>
          </button>
        ))}
      </div>
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
    <div className="flex flex-col items-center md:items-start">
      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-3xl md:text-4xl font-black text-secondary leading-none mb-2 tracking-tighter">
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
