import { ArrowRight, Heart } from "lucide-react";

const MissionThalassemia = () => (
  <section className="apple-card group overflow-hidden border-2 border-red-100 shadow-2xl shadow-red-500/5">
    <div className="grid md:grid-cols-2 gap-12 p-8 md:p-14 items-center">
      {/* TEXT */}
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#ff3b30] flex items-center justify-center mb-6 shadow-sm">
          <Heart size={24} className="animate-bounce" />
        </div>
        <span className="text-[#ff3b30] font-black text-[14px] tracking-[0.2em] uppercase mb-4 block">
          Urgent Appeal: Save Little Lives
        </span>

        <h3 className="text-[36px] md:text-[44px] font-black text-[#1d1d1f] leading-none mb-6 tracking-tight">
          Mission <span className="text-[#ff3b30]">Thalassemia</span>
        </h3>

        <div className="space-y-6 text-[18px] text-[#424245] leading-relaxed font-bold italic">
          <p className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 rounded-r-xl">
            Our hearts heavy with grief, we reach out to you. Every day,
            innocent children battle the silent agony of Thalassemia, their
            childhoods fading in hospital corridors.
          </p>
          <p>
            To bring a glimmer of hope to these fragile lives, we desperately
            need to set up a dedicated Thalassemia care unit. We require
            approximately{" "}
            <span className="text-[#ff3b30] text-3xl font-black not-italic block mt-2">
              ₹90 Lakhs
            </span>{" "}
            for two advanced treatment machines and complete facility setup.
          </p>
          <p className="text-[#1d1d1f] not-italic">
            Without this, their struggle continues. We cannot do this alone.
            Your contribution isn't just a donation; it's a breath of life for a
            child who just wants to live.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/donor-register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff3b30] text-white rounded-2xl font-black text-[16px] uppercase tracking-wider hover:bg-[#d73128] transition-all shadow-lg shadow-red-500/20 group hover:-translate-y-1"
          >
            Emergency Donate{" "}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>

      {/* VISUAL */}
      <div className="relative h-80 rounded-[2.5rem] bg-[#f5f5f7] flex items-center justify-center overflow-hidden shadow-inner border border-red-50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-orange-50 opacity-60"></div>
        <div className="relative z-10 text-center px-6">
          <Heart
            size={100}
            className="text-[#ff3b30] mx-auto mb-6 opacity-80"
          />
          <div className="text-[12px] font-black text-[#ff3b30] uppercase tracking-[0.3em]">
            Hope is in your hands
          </div>
        </div>
        {/* Decorative Grid */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ff3b30 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>
    </div>
  </section>
);

export default MissionThalassemia;
