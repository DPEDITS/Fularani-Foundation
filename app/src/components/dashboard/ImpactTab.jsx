"use client";
import React, { useState, useEffect } from "react";
import {
    Heart,
    Eye,
    Check,
    Clock,
    Activity,
    X as CloseIcon,
    Sparkles,
    User,
    ArrowUpRight,
    Target,
    Zap,
    Image as ImageIcon
} from "lucide-react";
import { getDonorDonationsWithProjects } from "../../services/donorService";

const ImpactTab = ({ formatCurrency, formatDate }) => {
    const [donationsWithProjects, setDonationsWithProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchImpactData();
    }, []);

    const fetchImpactData = async () => {
        try {
            setLoading(true);
            const response = await getDonorDonationsWithProjects();
            if (response.success) {
                setDonationsWithProjects(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch impact data:", error);
        } finally {
            setLoading(false);
        }
    };

    const linkedDonations = donationsWithProjects.filter(d => d.project);
    // Sort linked donations by date desc
    linkedDonations.sort((a, b) => new Date(b.donatedAt) - new Date(a.donatedAt));

    const unlinkedDonations = donationsWithProjects.filter(d => !d.project);

    if (loading) {
        return (
            <div className="py-32 flex flex-col items-center justify-center gap-6 animate-pulse">
                <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-secondary/20 animate-spin" />
                </div>
                <p className="text-secondary/30 text-xs font-black uppercase tracking-widest">Synchronizing impact data...</p>
            </div>
        );
    }

    const ImpactStatCard = ({ label, value, icon: Icon, colorClass, bgClass }) => (
        <div className="bg-white p-8 rounded-[32px] border border-secondary/5 shadow-xl hover:-translate-y-2 transition-all group overflow-hidden relative">
            <div className={`absolute -right-4 -bottom-4 ${bgClass} w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
            <div className="relative z-10">
                <div className={`w-12 h-12 ${bgClass} rounded-xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110`}>
                    <Icon className={colorClass} size={24} />
                </div>
                <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-4xl font-black text-secondary tracking-tighter">
                    {value}
                </h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-6 border-b border-muted/50">
                <div>
                    <div className="inline-flex items-center gap-2 bg-secondary/5 px-3 py-1 rounded-full mb-4">
                        <Zap size={12} className="text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Real-time Impact Report</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter lowercase">
                        your <br />
                        <span className="text-secondary underline decoration-wavy decoration-accent/50 underline-offset-4">legacy.</span>
                    </h2>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-secondary/40 text-xs font-bold uppercase tracking-widest">Last updated</p>
                    <p className="text-secondary font-black tracking-tight">{formatDate(new Date())}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImpactStatCard
                    label="Projects Funded"
                    value={linkedDonations.length}
                    icon={Target}
                    colorClass="text-emerald-500"
                    bgClass="bg-emerald-50"
                />
                <ImpactStatCard
                    label="Missions Completed"
                    value={linkedDonations.filter(d => d.project?.status === "Completed").length}
                    icon={Check}
                    colorClass="text-blue-500"
                    bgClass="bg-blue-50"
                />
                <ImpactStatCard
                    label="Total Contributions"
                    value={donationsWithProjects.length}
                    icon={Heart}
                    colorClass="text-rose-500"
                    bgClass="bg-rose-50"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Projects Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-secondary tracking-tighter lowercase flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center text-xs">01</span>
                            Direct Impact.
                        </h3>
                    </div>

                    {linkedDonations.length > 0 ? (
                        <div className="space-y-8 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-[2px] before:bg-muted/30">
                            {linkedDonations.map((donation) => (
                                <div key={donation._id} className="relative pl-20 group">
                                    {/* Timeline Node */}
                                    <div className="absolute left-0 top-0 w-16 h-16 rounded-[20px] bg-white border-4 border-white shadow-xl z-10 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <div className={`w-2 h-2 rounded-full mb-1 ${donation.project?.status === "Completed" ? "bg-emerald-500" :
                                                donation.project?.status === "In Progress" ? "bg-blue-500 animate-pulse" : "bg-amber-500"
                                            }`} />
                                        <span className="text-[10px] font-black text-secondary/40">
                                            {new Date(donation.donatedAt).getDate()}
                                        </span>
                                        <span className="text-[8px] font-bold text-secondary/30 uppercase">
                                            {new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </div>

                                    {/* Project Card */}
                                    <div className="bg-white rounded-[32px] border border-secondary/5 shadow-lg overflow-hidden group-hover:-translate-y-1 transition-all duration-500">
                                        <div className="p-8">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                                <div>
                                                    {donation.project?.mission && (
                                                        <span className="inline-block px-3 py-1 rounded-lg bg-muted/30 text-secondary/60 text-[9px] font-black uppercase tracking-widest mb-3">
                                                            {donation.project.mission.title}
                                                        </span>
                                                    )}
                                                    <h4 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-2">
                                                        {donation.project?.title || "Untitled Project"}
                                                    </h4>
                                                    <p className="text-sm font-medium text-secondary/50 leading-relaxed md:max-w-md">
                                                        {donation.project?.description || "No description provided."}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/30 mb-1">Contribution</p>
                                                    <p className="text-2xl font-black text-emerald-600 tracking-tighter">{formatCurrency(donation.amount)}</p>
                                                </div>
                                            </div>

                                            {/* Proof of Work Gallery */}
                                            {donation.project?.proofOfWork && donation.project.proofOfWork.images?.length > 0 ? (
                                                <div className="bg-muted/10 rounded-3xl p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                                                            <ImageIcon size={12} /> Execution Evidence
                                                        </p>
                                                        {donation.project?.assignedTo && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-wider">Executed by</span>
                                                                <span className="text-xs font-black text-secondary bg-white px-2 py-1 rounded-md shadow-sm">
                                                                    {donation.project.assignedTo.username}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {donation.project.proofOfWork.images.map((img, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setSelectedImage(img.url)}
                                                                className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-all group/img relative cursor-zoom-in"
                                                            >
                                                                <img src={img.url} className="w-full h-full object-cover" alt="Proof" />
                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <Eye className="text-white" size={20} />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {donation.project.proofOfWork.description && (
                                                        <div className="mt-4 pt-4 border-t border-secondary/5">
                                                            <p className="text-sm italic font-medium text-secondary/60">
                                                                "{donation.project.proofOfWork.description}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100/50 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                        <Clock size={18} className="text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-wide text-amber-800 mb-1">Work in Progress</p>
                                                        <p className="text-xs font-medium text-amber-700/70">
                                                            Our volunteers are currently executing this project. Proof of work will be uploaded upon completion.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-8 py-4 bg-muted/20 border-t border-secondary/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${donation.project?.status === "Completed" ? "bg-green-500" :
                                                        donation.project?.status === "In Progress" ? "bg-blue-500 animate-pulse" : "bg-amber-500"
                                                    }`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">
                                                    Status: {donation.project?.status || "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] border border-secondary/5 shadow-xl p-12 text-center">
                            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Target size={32} className="text-secondary/20" />
                            </div>
                            <h4 className="text-xl font-black text-secondary tracking-tight mb-2">No specific projects yet.</h4>
                            <p className="text-secondary/40 text-sm font-medium max-w-xs mx-auto">
                                Your donations are currently in the general fund. We will assign them to specific projects soon!
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: General Contributions */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-secondary tracking-tighter lowercase flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center text-xs">02</span>
                            General Fund.
                        </h3>
                    </div>

                    <div className="bg-white rounded-[32px] border border-secondary/5 shadow-xl overflow-hidden block">
                        <div className="p-8 border-b border-muted/50 bg-muted/10">
                            <p className="text-secondary/50 text-xs font-bold leading-relaxed">
                                Contributions here support our day-to-day operations and emergency relief efforts.
                            </p>
                        </div>

                        <div className="divide-y divide-muted/50 max-h-[412px] overflow-y-auto custom-scrollbar">
                            {unlinkedDonations.length > 0 ? unlinkedDonations.map((donation) => (
                                <div key={donation._id} className="p-6 hover:bg-muted/10 transition-colors group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                                <Heart size={14} fill="currentColor" />
                                            </div>
                                            <p className="text-lg font-black text-secondary tracking-tight">
                                                {formatCurrency(donation.amount)}
                                            </p>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary/30 bg-muted/20 px-2 py-1 rounded">
                                            General
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-secondary/30 uppercase tracking-wider pl-11">
                                        {formatDate(donation.donatedAt)}
                                    </p>
                                </div>
                            )) : (
                                <div className="p-10 text-center text-secondary/30 text-xs font-black uppercase tracking-widest">
                                    No general records found.
                                </div>
                            )}
                        </div>

                        {unlinkedDonations.length > 0 && (
                            <div className="p-4 bg-muted/20 border-t border-muted/50 text-center">
                                <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                                    Total: {formatCurrency(unlinkedDonations.reduce((acc, curr) => acc + curr.amount, 0))}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty State Overlay if no data at all */}
            {donationsWithProjects.length === 0 && (
                <div className="py-32 text-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-secondary/20">
                        <Sparkles size={40} className="text-white animate-pulse" />
                    </div>
                    <h3 className="text-4xl font-black text-secondary tracking-tighter mb-4">Start your journey.</h3>
                    <p className="text-secondary/40 font-medium max-w-md mx-auto mb-8">
                        Make your first donation to begin tracking your real-world impact.
                    </p>
                </div>
            )}

            {/* Image Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="absolute inset-0 bg-secondary/90 backdrop-blur-md"></div>
                    <div className="relative max-w-5xl max-h-[85vh] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 z-10 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full text-white transition-all transform hover:rotate-90"
                        >
                            <CloseIcon size={24} />
                        </button>
                        <img src={selectedImage} alt="Proof of work" className="w-full h-full object-contain bg-black" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImpactTab;
