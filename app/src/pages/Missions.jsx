import MissionGreen from "../components/MissionGreen";
import MissionMobility from "../components/MissionMobility";
import MissionEducation from "../components/MissionEducation";
import MissionPeriod from "../components/MissionPeriod";
import MissionThalassemia from "../components/MissionThalassemia";
import { useEffect, useState } from "react";
import { ArrowRight, Globe, Leaf, Heart, School, Accessibility } from "lucide-react";
import headerImg from "../assets/missions1.jpeg";

const Missions = () => {
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
              Fularani Foundation is committed to creating lasting social impact through
              focused initiatives in healthcare, education, environment, and women's dignity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24">
            <StatCard end={1500} suffix="+" label="Meals Served" icon={<Heart size={20} />} />
            <StatCard end={10000} suffix="+" label="Trees Planted" icon={<Leaf size={20} />} />
            <StatCard end={100} suffix="+" label="Volunteers" icon={<Globe size={20} />} />
            <StatCard end={50} suffix="+" label="Campaigns" icon={<School size={20} />} />
          </div>
        </div>
      </section>

      {/* MISSIONS GRID */}
      <section className="py-24 px-6 bg-white border-t border-black/5">
        <div className="max-w-[1024px] mx-auto space-y-24">
          <div className="text-center md:text-left">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4">Our Dedicated Missions</h2>
            <p className="text-[19px] text-[#86868b] font-medium max-w-[600px]">
              Tailored programs designed to address specific social needs and drive sustainable change.
            </p>
          </div>

          <div className="space-y-12">
            <MissionEducation />
            <MissionThalassemia />
            <MissionPeriod />
            <MissionGreen />
            <MissionMobility />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 px-6">
        <div className="apple-card max-w-[980px] mx-auto p-12 md:p-20 text-center bg-[#f5f5f7]">
          <h2 className="text-[32px] md:text-[48px] font-bold text-[#1d1d1f] tracking-tight mb-6">Want to make an impact?</h2>
          <p className="text-[21px] text-[#86868b] mb-12 max-w-[600px] mx-auto">
            Join our community of volunteers and donors. Together, we can reach
            more people and transform more lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => window.location.href = "/volunteer-login"}
              className="bg-[#0071e3] text-white px-8 py-3 rounded-full text-[17px] font-medium hover:bg-[#0077ed] transition-all flex items-center gap-2 group"
            >
              Join the Mission <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="/contact" className="text-[#0066cc] text-[17px] font-medium hover:underline flex items-center gap-1 group">
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
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
    <div className="apple-card p-6 flex flex-col items-center text-center group">
      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-[24px] md:text-[32px] font-bold text-[#1d1d1f] leading-none mb-1">
        {count.toLocaleString()}{suffix}
      </h3>
      <p className="text-[13px] font-bold text-[#86868b] tracking-wide uppercase">{label}</p>
    </div>
  );
};

export default Missions;
