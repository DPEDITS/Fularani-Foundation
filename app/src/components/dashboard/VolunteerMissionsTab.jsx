import React from "react";
import { Briefcase, Sparkles } from "lucide-react";

const VolunteerMissionsTab = () => (
    <div className="bg-white p-10 rounded-[40px] shadow-xl border border-secondary/10 text-center py-24 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase size={32} className="text-secondary/20" />
        </div>
        <h4 className="text-2xl font-black text-secondary mb-4 tracking-tight">no active missions.</h4>
        <p className="text-secondary/60 font-bold max-w-[320px] leading-relaxed mb-10">
            We're currently matching missions to your specific skill set. Come back soon or browse all available slots.
        </p>
        <button className="px-10 py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-secondary/20">
            Browse Opportunities
        </button>
    </div>
);

export default VolunteerMissionsTab;
