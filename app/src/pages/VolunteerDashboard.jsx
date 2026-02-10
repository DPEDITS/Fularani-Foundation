"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    TrendingUp,
    Calendar,
    Clock,
    LogOut,
    User,
    Sparkles,
    Award,
    ArrowUpRight,
    Target,
    Wrench,
    Briefcase,
    Camera,
    ShieldCheck,
} from "lucide-react";
import {
    getVolunteerProfile,
    getVolunteerStats,
    logoutVolunteer,
    isVolunteerAuthenticated,
    getVolunteerUser,
} from "../services/volunteerService";

// Extracted Components
import VolunteerOverviewTab from "../components/dashboard/VolunteerOverviewTab";
import VolunteerMissionsTab from "../components/dashboard/VolunteerMissionsTab";
import VolunteerProfileTab from "../components/dashboard/VolunteerProfileTab";
import Toast from "../components/dashboard/Toast";

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [error, setError] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        if (!isVolunteerAuthenticated()) {
            navigate("/volunteer-login");
            return;
        }
        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [profileRes, statsRes] = await Promise.all([
                getVolunteerProfile(),
                getVolunteerStats(),
            ]);
            setProfile(profileRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data. Please try again.");
            if (err.response?.status === 401) {
                navigate("/volunteer-login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutVolunteer();
            navigate("/volunteer-login");
        } catch (err) {
            console.error("Logout error:", err);
            navigate("/volunteer-login");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/10 rounded-full animate-spin border-t-emerald-500"></div>
                        <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-[#1d1d1f]/60 font-medium">Loading your profile...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
                <div className="text-center p-10 bg-white rounded-[32px] shadow-sm border border-black/5 max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-[#1d1d1f] text-lg font-bold mb-2">Something went wrong</p>
                    <p className="text-[#86868b] mb-8">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="w-full py-4 bg-[#1d1d1f] text-white rounded-2xl font-bold hover:bg-black transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    const user = profile || getVolunteerUser();

    return (
        <main className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-10">
            <div className="max-w-[1440px] mx-auto">
                {/* Hero Header Section */}
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 mb-12 text-center lg:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative group">
                            <div className="w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 bg-accent">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-white text-6xl font-black uppercase">
                                        {user?.username?.[0] || "V"}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="text-white" size={40} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="inline-block bg-accent px-3 py-1 rounded-sm text-xs font-black uppercase tracking-widest text-secondary mb-3 shadow-lg shadow-accent/20">
                                Volunteer Dashboard
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-secondary tracking-tighter leading-[0.9] lowercase">
                                namaste, <br />
                                <span className="text-white bg-primary px-4 py-2 inline-block -rotate-2 shadow-xl shadow-primary/30 mt-2">
                                    {user?.username || "changemaker"}.
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/missions")}
                            className="group relative px-6 py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-tight text-sm shadow-xl shadow-secondary/30 hover:-translate-y-1 transition-all"
                        >
                            Find Missions
                        </button>
                    </div>
                </div>

                {/* Bento Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
                    {/* Main Stat - Total Hours */}
                    <div className="md:col-span-2 bg-secondary p-6 md:p-10 rounded-[32px] relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-700"></div>
                        <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
                            <div className="flex items-start justify-between">
                                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                    <Sparkles size={12} className="text-accent" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Service Impact</span>
                                </div>
                                <ArrowUpRight className="text-white/40 group-hover:text-white transition-all" size={28} />
                            </div>
                            <div>
                                <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
                                    {stats?.totalHours || 0} Hours
                                </h3>
                                <p className="text-white/60 font-bold text-base">Dedicated to community service.</p>
                            </div>
                        </div>
                    </div>

                    {/* Missions Count */}
                    <div className="bg-primary p-6 md:p-10 rounded-[32px] relative overflow-hidden group shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                        <div className="absolute -bottom-10 -right-10 text-white/10 transition-transform duration-500">
                            <Target size={120} fill="currentColor" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-10">
                                <Target size={24} className="text-primary" />
                            </div>
                            <h3 className="text-5xl font-black text-white tracking-tighter mb-1">
                                {stats?.activeMissions || 0}
                            </h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
                                Active Missions
                            </p>
                        </div>
                    </div>

                    {/* Impact Score */}
                    <div className="bg-muted/30 p-6 md:p-10 rounded-[32px] border border-secondary/5 relative overflow-hidden group">
                        <Award className="text-secondary/10 absolute -bottom-4 -right-4" size={100} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 relative z-10">Impact Score</p>
                        <p className="text-5xl font-black text-secondary tracking-tighter relative z-10">{stats?.impactScore || 0}</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-12 border-b-2 border-muted sticky top-24 bg-white/95 backdrop-blur-xl z-40 py-4 -mx-6 px-6 md:mx-0 md:px-0">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "missions", label: "My Missions" },
                            { id: "profile", label: "Identity" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-sm font-black uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 transition-all ${activeTab === tab.id
                                    ? "border-primary text-secondary"
                                    : "border-transparent text-secondary/30 hover:text-secondary/60"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {activeTab === "overview" && <VolunteerOverviewTab profile={profile} stats={stats} />}
                    {activeTab === "missions" && <VolunteerMissionsTab />}
                    {activeTab === "profile" && <VolunteerProfileTab profile={profile} user={user} handleLogout={handleLogout} />}
                </div>
            </div>

            <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        </main>
    );
};

export default VolunteerDashboard;
