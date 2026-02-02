import { ArrowRight, Accessibility } from "lucide-react";

const MissionMobility = () => (
  <section className="apple-card group overflow-hidden">
    <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12 items-center">
      {/* TEXT */}
      <div>
        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mb-6">
          <Accessibility size={20} />
        </div>
        <span className="text-[#0071e3] font-bold text-[13px] tracking-wide uppercase mb-3 block">
          Empowering Movement
        </span>

        <h3 className="text-[32px] font-bold text-[#1d1d1f] leading-tight mb-4">
          Mission Mobility
        </h3>

        <p className="text-[17px] text-[#86868b] leading-relaxed max-w-md font-medium">
          Providing essential mobility aids and support to individuals with
          physical challenges, restoring independence and dignity.
        </p>

        <a
          href="/missions/mobility"
          className="inline-flex items-center gap-1.5 mt-8 text-[#0066cc] hover:underline font-medium text-[17px] group"
        >
          Explore program <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* VISUAL */}
      <div className="h-64 rounded-2xl bg-[#f5f5f7] flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
          <Accessibility size={64} className="text-[#0071e3]/20" />
        </div>
      </div>
    </div>
  </section>
);

export default MissionMobility;
