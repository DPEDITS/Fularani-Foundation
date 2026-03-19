import React, { useState } from "react";
import { Heart, DollarSign, Download, Award, Share2 } from "lucide-react";
import { generateDonationReceipt } from "../../utils/pdfGenerator";
import ShareDonationModal from "./ShareDonationModal";

const DonationsTab = ({ donations, user, formatCurrency, formatDate, setShowDonationModal }) => {
    const [shareDonation, setShareDonation] = useState(null);

    // Group donations by year
    const groupedDonations = donations.reduce((acc, donation) => {
        const year = new Date(donation.donatedAt).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(donation);
        return acc;
    }, {});

    const years = Object.keys(groupedDonations).sort((a, b) => b - a);

    if (donations.length === 0) {
        return (
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-secondary/10 text-center py-24">
                <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DollarSign size={32} className="text-secondary/20" />
                </div>
                <p className="text-secondary/60 font-black text-lg mb-6 tracking-tight">Your story of impact starts here.</p>
                <button
                    onClick={() => setShowDonationModal(true)}
                    className="px-8 py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-secondary/20"
                >
                    Make your first donation
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_80px] gap-8">
                {/* The Chronicle Timeline */}
                <div className="space-y-16">
                    {years.map((year) => {
                        const yearDonations = groupedDonations[year];
                        const yearTotal = yearDonations.reduce((sum, d) => sum + d.amount, 0);

                        return (
                            <section key={year} id={`year-${year}`} className="relative">
                                {/* Year Header */}
                                <div className="sticky top-28 z-30 mb-8">
                                    <div className="inline-flex items-center gap-4 bg-secondary text-white px-4 md:px-6 py-3 rounded-2xl shadow-2xl">
                                        <span className="text-2xl md:text-3xl font-black tracking-tighter">{year}</span>
                                        <div className="w-px h-6 bg-white/20"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 leading-none">Yearly Total</span>
                                            <span className="text-sm font-black text-accent">{formatCurrency(yearTotal)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Scrollable Wrapper for Timeline */}
                                <div className="max-h-[520px] overflow-y-auto overflow-x-hidden custom-scrollbar relative -ml-4 pl-4 pr-2">
                                    {/* Path Line */}
                                    <div className="absolute left-8 md:left-[56px] top-6 bottom-0 w-px bg-gradient-to-b from-secondary/20 via-secondary/10 to-transparent"></div>

                                    {/* Donation Nodes */}
                                    <div className="space-y-6 ml-4 pl-6 md:ml-10 md:pl-10 border-l-2 border-dashed border-secondary/5 py-4">
                                        {yearDonations.map((donation, i) => (
                                            <div key={i} className="group relative">
                                                {/* The Dot */}
                                                <div className="absolute -left-[33px] md:-left-[51px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-4 border-secondary group-hover:bg-accent group-hover:border-accent group-hover:scale-125 transition-all z-10 shadow-lg"></div>

                                                {/* The Card */}
                                                <div className="bg-white p-4 md:p-6 rounded-[24px] border border-secondary/10 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shrink-0 transition-colors">
                                                            <Heart size={24} className={i === 0 && year === years[0] ? "fill-primary text-primary" : ""} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h4 className="text-2xl font-black text-secondary tracking-tight">{formatCurrency(donation.amount)}</h4>
                                                                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black rounded-sm uppercase tracking-widest border border-green-100">Success</span>
                                                            </div>
                                                            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-[0.1em]">{formatDate(donation.donatedAt)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setShareDonation(donation)}
                                                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-95"
                                                        >
                                                            <Share2 size={14} /> Share
                                                        </button>
                                                        <button
                                                            onClick={async () => await generateDonationReceipt(donation, user)}
                                                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-muted text-secondary font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
                                                        >
                                                            <Download size={14} /> Receipt
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );
                    })}

                    {/* Ending Milestone */}
                    <div className="flex flex-col items-center py-10 opacity-20">
                        <div className="w-px h-20 bg-gradient-to-b from-secondary to-transparent mb-4"></div>
                        <Award size={40} className="text-secondary" />
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2">The journey continues</p>
                    </div>
                </div>

                {/* Quick Jump Sidebar - Desktop Only */}
                <div className="hidden lg:flex flex-col gap-2 sticky top-48 h-fit">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-secondary/30 mb-4 rotate-180 [writing-mode:vertical-lr] mx-auto">Quick Jump</p>
                    {years.map(year => (
                        <a
                            key={year}
                            href={`#year-${year}`}
                            className="w-12 h-12 rounded-xl border border-secondary/10 flex items-center justify-center font-black text-xs text-secondary/40 hover:bg-accent hover:text-secondary hover:border-accent transition-all shadow-sm"
                        >
                            '{year.toString().slice(-2)}
                        </a>
                    ))}
                </div>
            </div>

            {/* Share Donation Modal */}
            <ShareDonationModal
                show={!!shareDonation}
                onClose={() => setShareDonation(null)}
                amount={shareDonation?.amount}
                donorName={user?.username}
                donationDate={shareDonation?.donatedAt}
            />
        </>
    );
};

export default DonationsTab;
