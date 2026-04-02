import { ArrowRight, Heart } from "lucide-react";
import missionHealthcareImg from "../assets/missionHealthcare.png";
import { safeLocationRedirect } from "../utils/safeNavigate";

const MissionHealthcare = () => (
  <section 
    onClick={() => safeLocationRedirect("/missions/healthcare")}
    className="apple-card apple-card-static overflow-hidden cursor-pointer"
  >
    <div className="grid md:grid-cols-2 gap-5 md:gap-7 p-5 md:p-7 items-center text-left">
      {/* TEXT */}
      <div>
        <div className="w-9 h-9 rounded-full bg-red-50 text-[#ff3b30] flex items-center justify-center mb-5">
          <Heart size={18} />
        </div>
        <span className="text-[#ff3b30] font-bold text-[11px] tracking-[0.18em] uppercase mb-2.5 block">
          Dignity & Health
        </span>

        <h3 className="text-[24px] md:text-[28px] font-bold text-[#1d1d1f] leading-tight mb-3">
          Mission Healthcare
        </h3>

        <p className="text-[15px] md:text-[16px] text-[#86868b] leading-7 max-w-md font-medium">
          Providing essential healthcare services and support to individuals
          with physical challenges, restoring independence and dignity.
        </p>

        <div className="inline-flex items-center gap-1.5 mt-6 text-[#0066cc] font-semibold text-[14px]">
          Explore program{" "}
          <ArrowRight size={18} />
        </div>
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
