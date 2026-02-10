import React from "react";
import { TrendingUp, Award } from "lucide-react";

const VolunteerOverviewTab = ({ profile, stats }) => (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Engagement Insight */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl border border-secondary/10 flex flex-col justify-between group hover:border-secondary/20 transition-all">
            <div>
                <h3 className="text-xl md:text-2xl font-black text-secondary mb-6 lowercase tracking-tighter">engagement insight.</h3>
                <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-muted pb-5">
                        <div>
                            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">Weekly Commitment</p>
                            <p className="text-3xl font-black text-secondary tracking-tight">{profile?.availabilityHours || 0} Hours</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-black text-white px-2 py-1 rounded-sm uppercase tracking-widest bg-green-600">
                                On Track
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end border-b border-muted pb-5">
                        <div>
                            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">Impact Score</p>
                            <p className="text-3xl font-black text-secondary tracking-tight">{stats?.impactScore || 0}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-secondary/60">
                            <span>Contribution Bar</span>
                            <span className="text-secondary">{Math.min((profile?.availabilityHours || 0) * 10, 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-sm h-3 overflow-hidden">
                            <div
                                className="bg-accent h-full rounded-sm transition-all duration-1000"
                                style={{ width: `${Math.min((profile?.availabilityHours || 0) * 10, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-secondary/60 text-xs font-bold leading-relaxed mt-8">
                Your regular contributions are building a legacy. Thank you for being a pillar of support.
            </p>
        </div>

        {/* Recognition Card */}
        <div className="bg-secondary p-6 md:p-10 rounded-[32px] shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                <Award size={32} className="text-accent" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-2 lowercase tracking-tighter">rising star.</h3>
            <p className="text-white/60 text-sm font-bold max-w-[240px] leading-relaxed">
                You're just getting started! Complete your first mission to earn your next badge.
            </p>
            <button className="mt-8 px-8 py-4 bg-accent text-secondary rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl shadow-accent/20">
                Explore Missions
            </button>
        </div>
    </div>
);

export default VolunteerOverviewTab;
