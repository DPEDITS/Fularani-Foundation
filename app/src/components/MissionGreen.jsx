import { ArrowRight, Leaf } from "lucide-react";
import { safeLocationRedirect } from "../utils/safeNavigate";
import missionGreenImg from "../assets/missionGreen.jpeg";

const MissionGreen = () => (
  <section 
    onClick={() => safeLocationRedirect("/missions/green")}
    className="apple-card apple-card-static overflow-hidden cursor-pointer"
  >
    <div className="grid md:grid-cols-2 gap-5 md:gap-7 p-5 md:p-7 items-center text-left">
      {/* TEXT */}
      <div>
        <div className="w-9 h-9 rounded-full bg-green-50 text-[#34c759] flex items-center justify-center mb-5">
          <Leaf size={18} />
        </div>
        <span className="text-[#34c759] font-bold text-[11px] tracking-[0.18em] uppercase mb-2.5 block">
          Environmental Impact
        </span>

        <h3 className="text-[24px] md:text-[28px] font-bold text-[#1d1d1f] leading-tight mb-3">
          Mission Green
        </h3>

        <p className="text-[15px] md:text-[16px] text-[#86868b] leading-7 max-w-md font-medium">
          Dedicating efforts to preserve our ecosystem through massive tree
          planting drives, sustainable waste management, and community awareness
          programs.
        </p>

        <div className="inline-flex items-center gap-1.5 mt-6 text-[#0066cc] font-semibold text-[14px]">
          Explore program{" "}
          <ArrowRight size={18} />
        </div>
      </div>

      {/* VISUAL */}
      <div className="w-full rounded-2xl bg-[#f5f5f7] overflow-hidden">
        <img
          src={missionGreenImg}
          alt="Mission Green"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  </section>
);

export default MissionGreen;
