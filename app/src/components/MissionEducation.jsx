import { ArrowRight, School } from "lucide-react";
import missionEducationImg from "../assets/missionEducation.jpeg";
import { Link } from "react-router-dom";

const MissionEducation = () => (
  <section className="apple-card group overflow-hidden">
    <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12 items-center">
      {/* TEXT */}
      <div>
        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mb-6">
          <School size={20} />
        </div>
        <span className="text-[#0071e3] font-bold text-[13px] tracking-wide uppercase mb-3 block">
          Sustainability & Knowledge
        </span>

        <h3 className="text-[32px] font-bold text-[#1d1d1f] leading-tight mb-4">
          Education For All
        </h3>

        <p className="text-[17px] text-[#86868b] leading-relaxed max-w-md font-medium">
          Empowering the next generation in rural Odisha by providing essential
          learning materials, dedicated mentorship, and safe educational
          environments.
        </p>

        <Link
          to="/missions/education"
          className="inline-flex items-center gap-1.5 mt-8 text-[#0066cc] hover:underline font-medium text-[17px] group"
        >
          Explore program{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* VISUAL */}
      <div className="h-64 rounded-2xl bg-[#f5f5f7] overflow-hidden">
        <img
          src={missionEducationImg}
          alt="Education For All"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
);

export default MissionEducation;
