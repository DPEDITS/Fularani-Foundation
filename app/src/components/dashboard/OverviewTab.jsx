import React from "react";
import { Heart, Sparkles, ArrowUpRight } from "lucide-react";

const OverviewTab = ({
    stats,
    donations,
    formatCurrency,
    formatDate,
    setActiveTab,
}) => {
    const engagementScore = Math.min(100, Math.max(15, (stats?.donationCount || 0) * 15));
    const engagementLabel = engagementScore > 80 ? "Legendary" : engagementScore > 50 ? "Consistent" : "Growing";
    const recentDonations = donations?.slice(0, 3) || [];

    return (
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Giving Insight */}
            <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl border border-secondary/10 flex flex-col justify-between group hover:border-secondary/20 transition-all">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-secondary mb-6 lowercase tracking-tighter">giving insight.</h3>
                    <div className="space-y-8">
                        <div className="flex justify-between items-end border-b border-muted pb-5">
                            <div>
                                <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">Average Donation</p>
                                <p className="text-2xl md:text-3xl font-black text-secondary tracking-tight">{formatCurrency(stats?.averageDonation || 0)}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-[9px] font-black text-white px-2 py-1 rounded-sm uppercase tracking-widest ${engagementScore > 50 ? 'bg-green-600' : 'bg-orange-500'}`}>
                                    {engagementLabel}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-b border-muted pb-5">
                            <div>
                                <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">Latest Contribution</p>
                                <p className="text-2xl md:text-3xl font-black text-secondary tracking-tight">
                                    {donations?.[0] ? formatCurrency(donations[0].amount) : "—"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-secondary/60">
                                <span>Engagement Score</span>
                                <span className="text-secondary">{engagementScore}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-sm h-3 overflow-hidden">
                                <div className="bg-accent h-full rounded-sm transition-all duration-1000" style={{ width: `${engagementScore}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-secondary/60 text-xs font-bold leading-relaxed mt-8">
                    Your regular contributions are building a legacy. Thank you for being a pillar of support.
                </p>
            </div>

            {/* Recent Activity List */}
            <div className="bg-secondary p-6 md:p-10 rounded-[32px] shadow-2xl flex flex-col">
                <h3 className="text-xl md:text-2xl font-black text-white mb-6 lowercase tracking-tighter">recent contributions.</h3>
                <div className="space-y-3 flex-1">
                    {recentDonations.length > 0 ? recentDonations.map((donation, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
                                    <Heart size={16} className="text-secondary fill-secondary" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg">{formatCurrency(donation.amount)}</p>
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">{formatDate(donation.donatedAt)}</p>
                                </div>
                            </div>
                            <ArrowUpRight size={18} className="text-white/40" />
                        </div>
                    )) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40">
                            <Sparkles size={32} className="text-white mb-3" />
                            <p className="text-white font-bold text-sm">No recent donations yet.</p>
                        </div>
                    )}
                </div>
                {recentDonations.length > 0 && (
                    <button
                        onClick={() => setActiveTab("donations")}
                        className="w-full py-4 mt-6 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-secondary transition-all rounded-xl"
                    >
                        View Full History
                    </button>
                )}
            </div>
        </div>
    );
};

export default OverviewTab;
