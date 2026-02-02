"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    TrendingUp,
    Calendar,
    Clock,
    LogOut,
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    ChevronRight,
    Sparkles,
    Award,
    ArrowUpRight,
    Target,
    Wrench,
    Heart,
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

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [error, setError] = useState(null);

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
        <main className="min-h-screen bg-[#fbfbfd] pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] overflow-hidden bg-white shadow-sm border border-black/5 flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                                        {user?.username?.[0]?.toUpperCase() || "V"}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-black/5">
                                <Sparkles className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[#86868b] font-bold text-xs uppercase tracking-[0.2em] mb-1">Volunteer Dashboard</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] tracking-tight">
                                Namaste, {user?.username || "Volunteer"}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg uppercase tracking-wider">Active Status</span>
                                <span className="text-[#86868b] text-sm font-medium">• Dedicated Changemaker</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/missions")}
                            className="px-6 py-3 rounded-2xl bg-[#f5f5f7] hover:bg-[#ecece5] text-[#1d1d1f] font-bold text-sm transition-all flex items-center gap-2"
                        >
                            <Target size={18} className="text-emerald-500" />
                            Find Missions
                        </button>
                        {/* Mobile context might move logout to a menu, but keeping here for direct access as per previous UI */}
                        <button
                            onClick={handleLogout}
                            className="p-3 rounded-2xl bg-white border border-black/5 hover:bg-red-50 text-red-500 transition-all shadow-sm"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    <StatCard icon={Clock} label="Total Hours" value={`${stats?.totalHours || 0}h`} accent="text-emerald-500" />
                    <StatCard icon={Target} label="Active Missions" value={stats?.activeMissions || 0} accent="text-blue-500" />
                    <StatCard icon={Award} label="Impact Score" value={stats?.impactScore || 0} accent="text-purple-500" />
                    <StatCard icon={Wrench} label="Skills Shared" value={stats?.skillCount || 0} accent="text-orange-500" />
                </div>

                {/* Apple Style Tab Switcher */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex p-1.5 bg-[#f5f5f7] rounded-[20px] shadow-inner">
                        {[
                            { id: "overview", label: "Overview", icon: TrendingUp },
                            { id: "missions", label: "My Missions", icon: Briefcase },
                            { id: "profile", label: "Profile", icon: User },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-[14px] text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-white text-[#1d1d1f] shadow-md"
                                        : "text-[#86868b] hover:text-[#1d1d1f]"
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Container */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === "overview" && <OverviewTab stats={stats} profile={profile} />}
                    {activeTab === "missions" && <MissionsTab />}
                    {activeTab === "profile" && <ProfileTab profile={profile} user={user} handleLogout={handleLogout} />}
                </div>
            </div>
        </main>
    );
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 hover:shadow-md transition-shadow duration-300">
        <div className={`w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center mb-6`}>
            <Icon size={24} className={accent} />
        </div>
        <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-widest mb-2">{label}</p>
        <p className="text-4xl font-bold text-[#1d1d1f] tracking-tight">{value}</p>
    </div>
);

const OverviewTab = ({ profile }) => (
    <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#1d1d1f]">Weekly Engagement</h3>
                <TrendingUp size={20} className="text-emerald-500" />
            </div>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[#86868b] text-sm font-medium mb-1">Commitment</p>
                        <p className="text-3xl font-bold text-[#1d1d1f]">{profile?.availabilityHours || 0} <span className="text-lg text-[#86868b] font-medium">Hours / week</span></p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tight">On Track</span>
                    </div>
                </div>
                <div className="w-full bg-[#f5f5f7] rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-[#1d1d1f] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((profile?.availabilityHours || 0) * 10, 100)}%` }}
                    />
                </div>
                <p className="text-[#86868b] text-xs leading-relaxed">
                    Based on your shared availability. Consistent engagement helps us plan better impact missions.
                </p>
            </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                <Award size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Rising Star</h3>
            <p className="text-[#86868b] text-sm max-w-[240px] leading-relaxed">
                You're just getting started! Complete your first mission to earn your silver badge.
            </p>
            <button className="mt-8 px-8 py-3 bg-[#1d1d1f] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform active:scale-95">
                Explore Opportunities
            </button>
        </div>
    </div>
);

const MissionsTab = () => (
    <div className="bg-white rounded-[40px] p-16 shadow-sm border border-black/5 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-8">
            <Briefcase size={40} className="text-[#86868b]" />
        </div>
        <h4 className="text-2xl font-bold text-[#1d1d1f] mb-4">No Active Missions</h4>
        <p className="text-[#86868b] max-w-[320px] leading-relaxed mb-10">
            We're currently matching missions to your specific skill set. Come back soon or browse all available slots.
        </p>
        <button className="px-10 py-4 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ecece5] rounded-2xl font-bold transition-all">
            See All Mission Slots
        </button>
    </div>
);

const ProfileTab = ({ profile, user, handleLogout }) => {
    const data = profile || user;
    const skillsList = typeof data?.skills === 'string' ? data.skills.split(',') : (Array.isArray(data?.skills) ? data.skills : []);
    const areasList = typeof data?.preferredAreas === 'string' ? data.preferredAreas.split(',') : (Array.isArray(data?.preferredAreas) ? data.preferredAreas : []);

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Details Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                    <h3 className="text-lg font-bold text-[#1d1d1f] mb-8">Personal Information</h3>
                    <div className="space-y-6">
                        <ProfileRow icon={User} label="Full Name" value={data?.username} />
                        <ProfileRow icon={Mail} label="Email" value={data?.email} />
                        <ProfileRow icon={Phone} label="Phone" value={data?.phone} />
                        <ProfileRow icon={MapPin} label="Location" value={data?.address} />
                    </div>
                </div>

                {/* Identity & Skills Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                    <h3 className="text-lg font-bold text-[#1d1d1f] mb-8">Identity & Interests</h3>
                    <div className="space-y-8">
                        <ProfileRow icon={FileText} label={`${data?.idType || 'ID'}`} value={data?.panNumber ? `•••• •••• ${data.panNumber.slice(-4)}` : 'N/A'} />

                        <div>
                            <p className="text-[#86868b] text-[11px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Wrench size={14} /> Skills & Expertise
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {skillsList.length > 0 ? skillsList.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-[#f5f5f7] text-[#1d1d1f] text-xs font-bold rounded-xl border border-black/5">{skill.trim()}</span>
                                )) : <span className="text-[#86868b] text-xs italic">No skills listed</span>}
                            </div>
                        </div>

                        <div>
                            <p className="text-[#86868b] text-[11px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Target size={14} /> Preferred Areas
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {areasList.length > 0 ? areasList.map((area, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-500/10">{area.trim()}</span>
                                )) : <span className="text-[#86868b] text-xs italic">No areas selected</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Motivation Section */}
            <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Sparkles size={18} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1d1d1f]">Your Motivation</h3>
                </div>
                <p className="text-[#1d1d1f] text-lg font-medium leading-[1.6] italic text-center max-w-2xl mx-auto">
                    "{data?.motivation || "I want to help the community and make a positive impact through Fularani Foundation."}"
                </p>
            </div>

            {/* Footer Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#f5f5f7] rounded-[32px] gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1d1d1f] font-black text-xl border border-black/5">
                        1
                    </div>
                    <div>
                        <p className="text-[#1d1d1f] font-bold">Impact Level 1</p>
                        <p className="text-[#86868b] text-xs font-medium">Rising Star Volunteer • Member since {data?.createdAt ? new Date(data.createdAt).getFullYear() : '2024'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-white border border-black/5 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                        <Camera size={18} className="text-[#86868b]" />
                        Update Avatar
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all shadow-md shadow-red-500/20 active:scale-95"
                    >
                        Logout Account
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-5">
        <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center shrink-0">
            <Icon size={18} className="text-[#86868b]" />
        </div>
        <div>
            <p className="text-[#86868b] text-[11px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-[#1d1d1f] font-bold text-[15px]">{value || "—"}</p>
        </div>
    </div>
);

export default VolunteerDashboard;
