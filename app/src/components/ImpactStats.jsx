import React from "react";
import { motion as Motion } from "motion/react";
import { Users, Heart, Globe, BriefcaseMedical } from "lucide-react";

const stats = [
  {
    id: 1,
    label: "Lives Impacted",
    value: "10,000+",
    icon: Heart,
    color: "text-[#ff3b30]",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    label: "Dedicated Volunteers",
    value: "500+",
    icon: Users,
    color: "text-[#0071e3]",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    label: "Missions Completed",
    value: "50+",
    icon: BriefcaseMedical,
    color: "text-[#34c759]",
    bgColor: "bg-green-50",
  },
  {
    id: 4,
    label: "Communities Served",
    value: "20+",
    icon: Globe,
    color: "text-[#ff9500]",
    bgColor: "bg-orange-50",
  },
];

const ImpactStats = () => {
  return (
    <div className="w-full relative z-10 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="apple-card p-6 flex flex-col items-center text-center group"
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} ${stat.color} mb-4 transition-transform group-hover:scale-110`}
            >
              <stat.icon size={22} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] tracking-tight mb-1">
                {stat.value}
              </h3>
              <p className="text-[13px] font-medium text-[#86868b] tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default ImpactStats;
