import React from "react";
import { motion as Motion } from "motion/react";
import { Users, Heart, Globe, BriefcaseMedical } from "lucide-react";

const stats = [
  {
    id: 1,
    label: "Lives Impacted",
    value: "10,000+",
    icon: Heart,
    color: "text-red-400",
  },
  {
    id: 2,
    label: "Dedicated Volunteers",
    value: "500+",
    icon: Users,
    color: "text-blue-400",
  },
  {
    id: 3,
    label: "Missions Completed",
    value: "50+",
    icon: BriefcaseMedical,
    color: "text-green-400",
  },
  {
    id: 4,
    label: "Communities Served",
    value: "20+",
    icon: Globe,
    color: "text-amber-400",
  },
];

const ImpactStats = () => {
  return (
    <div className="w-full relative z-10 py-6">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Motion.div
            key={stat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-start p-3 rounded-lg bg-gray-50/50 hover:bg-white/80 transition-colors border border-gray-100"
          >
            <div
              className={`flex items-center justify-center p-2 rounded-full bg-white shadow-sm mb-2 ${stat.color}`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 leading-none">
                {stat.value}
              </h3>
              <p className="text-xs font-medium text-gray-500 mt-1">
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
