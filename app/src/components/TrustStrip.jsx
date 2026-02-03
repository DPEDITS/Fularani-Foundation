import React from "react";
import { cn } from "../utils/cn";

const TrustStrip = () => {
  const stats = [
    { label: "Trees Planted", value: "500+" },
    { label: "Meals Served", value: "80+" },
    { label: "Active Missions", value: "3" },
  ];

  return (
    <section className="bg-gray-50 border-y border-gray-200 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-mono font-bold text-[#1d1d1f] tracking-tighter">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
