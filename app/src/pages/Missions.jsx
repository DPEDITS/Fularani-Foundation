import { useEffect, useState } from "react";
import {
  ArrowRight,
  Globe,
  Leaf,
  Heart,
  School,
  Accessibility,
} from "lucide-react";
import headerImg from "../assets/missions1.jpeg";

const Missions = () => {
  const missions = [
    {
      id: "education",
      label: "Mission Education",
      title: "Empowering the Next Generation",
      description:
        "Providing quality education and resources to underprivileged children in rural Odisha.",
      longDescription:
        "Empowering the next generation in rural Odisha by providing essential learning materials, dedicated mentorship, and safe educational environments.",
      image: headerImg,
      icon: <School size={20} />,
      largeIcon: <School size={64} />,
      color: "blue",
      accentColor: "text-[#0071e3]",
      bgColor: "bg-blue-50",
      stats: { value: "1500+", label: "Students" },
      link: "/missions/education",
      // Bento Grid Specifics
      bentoBg: "bg-cover bg-center",
      isLarge: true,
    },
    {
      id: "green",
      label: "Mission Green",
      title: "Sustainable Future",
      description:
        "Dedicating efforts to preserve our ecosystem through massive tree planting drives.",
      longDescription:
        "Dedicating efforts to preserve our ecosystem through massive tree planting drives, sustainable waste management, and community awareness programs.",
      icon: <Leaf size={20} />,
      largeIcon: <Leaf size={200} />,
      color: "green",
      accentColor: "text-[#34c759]",
      bgColor: "bg-green-50",
      gradient: "from-[#d1fae5] to-[#a7f3d0]",
      textDark: "text-[#064e3b]",
      link: "/missions/green",
    },
    {
      id: "mobility",
      label: "Mission Mobility",
      title: "Access for All",
      description:
        "Providing essential mobility aids and support to individuals with physical challenges.",
      longDescription:
        "Providing essential mobility aids and support to individuals with physical challenges, restoring independence and dignity.",
      icon: <Accessibility size={20} />,
      largeIcon: <Accessibility size={200} />,
      color: "blue",
      accentColor: "text-[#0071e3]",
      bgColor: "bg-blue-50",
      gradient: "from-[#eff6ff] to-[#dbeafe]",
      textDark: "text-[#1e3a8a]",
      link: "/missions/mobility",
    },
    {
      id: "thalassemia",
      label: "Mission Thalassemia",
      category: "Healthcare & Care",
      title: "Mission Thalassemia",
      description:
        "Advocating for regular screenings and providing vital support services for children and families affected by Thalassemia across the region.",
      icon: <Heart size={20} />,
      largeIcon: <Heart size={64} />,
      color: "red",
      accentColor: "text-[#ff3b30]",
      bgColor: "bg-red-50",
      visualGradient: "from-red-50 to-orange-50",
      link: "/missions/thalassemia",
    },
    {
      id: "period",
      label: "Mission Period Pride",
      category: "Dignity & Health",
      title: "Mission Period Pride",
      description:
        "Breaking taboos and promoting menstrual hygiene through education, resource distribution, and supportive community initiatives.",
      icon: <Heart size={20} />,
      largeIcon: <Heart size={64} />,
      color: "rose",
      accentColor: "text-[#e11d48]",
      bgColor: "bg-rose-50",
      visualGradient: "from-red-50 to-rose-50",
      link: "/missions/period-pride",
    },
  ];

  const featuredMissions = missions.slice(0, 3);
  const otherMissions = missions.slice(3);

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* PAGE HEADER */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#0071e3] font-semibold text-[17px] mb-4 block tracking-tight">
              Impact & Initiatives
            </span>
            <h1 className="text-[48px] md:text-[64px] font-bold text-[#1d1d1f] leading-[1.1] tracking-tight mb-8">
              Changing lives, <br />
              <span className="text-[#86868b]">one mission at a time.</span>
            </h1>
            <p className="text-[21px] md:text-[23px] text-[#86868b] leading-relaxed max-w-[800px] mx-auto font-medium">
              Fularani Foundation is committed to creating lasting social impact
              through focused initiatives in healthcare, education, environment,
              and women's dignity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24">
            <StatCard
              end={1500}
              suffix="+"
              label="Meals Served"
              icon={<Heart size={20} />}
            />
            <StatCard
              end={10000}
              suffix="+"
              label="Trees Planted"
              icon={<Leaf size={20} />}
            />
            <StatCard
              end={100}
              suffix="+"
              label="Volunteers"
              icon={<Globe size={20} />}
            />
            <StatCard
              end={50}
              suffix="+"
              label="Campaigns"
              icon={<School size={20} />}
            />
          </div>
        </div>
      </section>

      {/* MISSIONS GRID */}
      <section className="py-24 px-6 bg-white border-t border-black/5">
        <div className="max-w-[1024px] mx-auto space-y-24">
          <div className="text-center md:text-left">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4">
              Our Dedicated Missions
            </h2>
            <p className="text-[19px] text-[#86868b] font-medium max-w-[600px]">
              Tailored programs designed to address specific social needs and
              drive sustainable change.
            </p>
          </div>

          {/* BENTO GRID LAYOUT (First 3 Missions) */}
          {featuredMissions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LARGE CARD - Index 0 */}
              {featuredMissions[0] && (
                <div className="lg:col-span-2 relative h-[500px] rounded-[32px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${featuredMissions[0].image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                    <div className="mb-auto">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform transition-transform group-hover:rotate-45 duration-500">
                        <ArrowRight size={20} className="-rotate-45" />
                      </div>
                    </div>

                    <div>
                      <span className="text-blue-400 font-bold text-sm tracking-widest uppercase mb-2 block">
                        {featuredMissions[0].label}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        {featuredMissions[0].title}
                      </h3>
                      <p className="text-white/90 text-lg max-w-md antialiased font-medium opacity-90">
                        {featuredMissions[0].description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* RIGHT COLUMN - Index 1 & 2 */}
              <div className="flex flex-col gap-6">
                {featuredMissions.slice(1).map((mission) => (
                  <div
                    key={mission.id}
                    className={`flex-1 bg-gradient-to-br ${mission.gradient} rounded-[32px] p-8 md:p-10 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
                  >
                    <div className="relative z-10">
                      <span
                        className={`${mission.accentColor} font-bold text-xs tracking-widest uppercase mb-2 block`}
                      >
                        {mission.label}
                      </span>
                      <h3
                        className={`text-2xl md:text-3xl font-bold ${mission.textDark}`}
                      >
                        {mission.title}
                      </h3>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 text-current">
                      {mission.largeIcon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER MISSIONS (Dynamic List) */}
          {otherMissions.length > 0 && (
            <div className="space-y-12 pt-12 border-t border-gray-100">
              {otherMissions.map((mission) => (
                <MissionRowCard key={mission.id} mission={mission} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 px-6">
        <div className="apple-card max-w-[980px] mx-auto p-12 md:p-20 text-center bg-[#f5f5f7]">
          <h2 className="text-[32px] md:text-[48px] font-bold text-[#1d1d1f] tracking-tight mb-6">
            Want to make an impact?
          </h2>
          <p className="text-[21px] text-[#86868b] mb-12 max-w-[600px] mx-auto">
            Join our community of volunteers and donors. Together, we can reach
            more people and transform more lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => (window.location.href = "/volunteer-login")}
              className="bg-[#0071e3] text-white px-8 py-3 rounded-full text-[17px] font-medium hover:bg-[#0077ed] transition-all flex items-center gap-2 group"
            >
              Join the Mission{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <a
              href="/contact"
              className="text-[#0066cc] text-[17px] font-medium hover:underline flex items-center gap-1 group"
            >
              Contact Us{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Generic Row Card for "Other Missions"
const MissionRowCard = ({ mission }) => (
  <section className="apple-card group overflow-hidden">
    <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12 items-center">
      {/* TEXT */}
      <div>
        <div
          className={`w-10 h-10 rounded-full ${mission.bgColor} ${mission.accentColor} flex items-center justify-center mb-6`}
        >
          {mission.icon}
        </div>
        <span
          className={`${mission.accentColor} font-bold text-[13px] tracking-wide uppercase mb-3 block`}
        >
          {mission.category || mission.label}
        </span>

        <h3 className="text-[32px] font-bold text-[#1d1d1f] leading-tight mb-4">
          {mission.title}
        </h3>

        <p className="text-[17px] text-[#86868b] leading-relaxed max-w-md font-medium">
          {mission.longDescription || mission.description}
        </p>

        <a
          href={mission.link}
          className="inline-flex items-center gap-1.5 mt-8 text-[#0066cc] hover:underline font-medium text-[17px] group"
        >
          Explore program{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </a>
      </div>

      {/* VISUAL */}
      <div className="h-64 rounded-2xl bg-[#f5f5f7] flex items-center justify-center overflow-hidden">
        <div
          className={`w-full h-full bg-gradient-to-br ${mission.visualGradient || "from-gray-50 to-gray-100"} flex items-center justify-center`}
        >
          <div className={`${mission.accentColor} opacity-20`}>
            {mission.largeIcon}
          </div>
        </div>
      </div>
    </div>
  </section>
);

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
    <div className="apple-card p-6 flex flex-col items-center text-center group">
      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-[24px] md:text-[32px] font-bold text-[#1d1d1f] leading-none mb-1">
        {count.toLocaleString()}
        {suffix}
      </h3>
      <p className="text-[13px] font-bold text-[#86868b] tracking-wide uppercase">
        {label}
      </p>
    </div>
  );
};

export default Missions;
