import { ArrowRight, Heart } from "lucide-react";
import missionHealthcareImg from "../assets/missionHealthcare.png";

import { Link } from "react-router-dom";

const MissionHealthcare = () => (
  <section className="apple-card group overflow-hidden">
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 items-center">
      {/* TEXT */}
      <div>
        <div className="w-10 h-10 rounded-full bg-red-50 text-[#ff3b30] flex items-center justify-center mb-6">
          <Heart size={20} />
        </div>
        <span className="text-[#ff3b30] font-bold text-[13px] tracking-wide uppercase mb-3 block">
          Dignity & Health
        </span>

        <h3 className="text-[32px] font-bold text-[#1d1d1f] leading-tight mb-4">
          Mission Healthcare
        </h3>

        <p className="text-[17px] text-[#86868b] leading-relaxed max-w-md font-medium">
          Providing essential healthcare services and support to individuals
          with physical challenges, restoring independence and dignity.
        </p>

        <Link
          to="/missions/healthcare"
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
      <div className="w-full rounded-2xl bg-[#f5f5f7] overflow-hidden">
        <img
          src={missionHealthcareImg}
          alt="Mission Healthcare"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  </section>
);

export default MissionHealthcare;
