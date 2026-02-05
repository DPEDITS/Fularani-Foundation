import React from "react";

const TrustStrip = () => {
  const stats = [
    { label: "Trees Planted", value: "500+" },
    { label: "Child Outreach", value: "1,200+" },
    { label: "Villages Served", value: "20+" },
    { label: "Active Missions", value: "4" },
  ];

  return (
    <section className="bg-secondary text-white py-12 md:py-16 relative overflow-hidden">
      {/* Decorative pulse element */}
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="max-w-[200px]">
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none border-l-4 border-primary pl-4">
              Our Real <br />
              <span className="text-primary italic">Impact</span>
            </h2>
          </div>

          <div className="flex-grow grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center md:items-start group"
              >
                <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter transition-transform group-hover:scale-110">
                  {stat.value}
                </span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
