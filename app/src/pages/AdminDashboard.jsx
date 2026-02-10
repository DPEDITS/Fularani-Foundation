"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    TrendingUp,
    ShieldCheck,
    LogOut,
    User,
    Sparkles,
    LayoutDashboard,
    PieChart,
    Settings,
    Bell,
    Search,
    Download,
    Eye,
    ChevronDown,
    Activity,
    Database,
    Heart,
    DollarSign,
    Briefcase,
    Camera,
    Check,
    X as CloseIcon,
} from "lucide-react";
import { getAdminUser, isAdminAuthenticated, logoutAdmin, getAdminStats, getVolunteersList, getDonorsList, getMissionsList, updateVolunteerStatus, assignTask } from "../services/adminService";
import { format } from "date-fns";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [admin, setAdmin] = useState(null);
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalVolunteers: 0,
        totalFunds: 0,
        activeMissions: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);
    const [listData, setListData] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    // Assignment State
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [missions, setMissions] = useState([]);

    useEffect(() => {
        if (!isAdminAuthenticated()) {
            navigate("/volunteer-login");
            return;
        }
        setAdmin(getAdminUser());
        fetchStats();
    }, [navigate]);

    useEffect(() => {
        if (activeTab !== "overview" && activeTab !== "settings") {
            fetchListData();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const response = await getAdminStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats:", error);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchListData = async () => {
        try {
            setLoadingList(true);
            let response;
            if (activeTab === "volunteers") response = await getVolunteersList();
            else if (activeTab === "donors") response = await getDonorsList();
            else if (activeTab === "missions") response = await getMissionsList();

            if (response?.success) {
                setListData(response.data);
                if (activeTab === "missions") setMissions(response.data);
            }
        } catch (error) {
            console.error(`Failed to fetch ${activeTab}:`, error);
        } finally {
            setLoadingList(false);
        }
    };

    const fetchMissionsForAssignment = async () => {
        if (missions.length > 0) return;
        try {
            const response = await getMissionsList();
            if (response.success) setMissions(response.data);
        } catch (error) {
            console.error("Failed to fetch missions:", error);
        }
    };

    const handleStatusUpdate = async (volunteerId, newStatus) => {
        try {
            const response = await updateVolunteerStatus(volunteerId, newStatus);
            if (response.success) {
                // Optimistically update the list
                setListData(prev => prev.map(item =>
                    item._id === volunteerId ? { ...item, status: newStatus } : item
                ));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update volunteer status. Please try again.");
        }
    };

    const handleLogout = () => {
        logoutAdmin();
        navigate("/volunteer-login");
    };

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        return `₹${amount.toLocaleString()}`;
    };

    const dashboardStats = [
        { label: "Total Donors", value: stats.totalDonors, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Total Volunteers", value: stats.totalVolunteers, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Total Funds", value: formatCurrency(stats.totalFunds), icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Active Missions", value: stats.activeMissions, icon: TargetIcon, color: "text-rose-500", bg: "bg-rose-50" },
    ];

    return (
        <main className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-10">
            <div className="max-w-[1540px] mx-auto">
                {/* Admin Hero Header */}
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 mb-16 text-center lg:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-secondary flex items-center justify-center relative group">
                            {admin?.avatar ? (
                                <img src={admin.avatar} alt={admin.username} className="w-full h-full object-cover" />
                            ) : (
                                <ShieldCheck size={48} className="text-accent animate-pulse" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-secondary text-accent px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-xl">
                                <Activity size={12} /> {admin?.role?.replace("_", " ") || "System Administrator"}
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-secondary tracking-tighter leading-[0.9] lowercase">
                                Control <br />
                                <span className="text-white bg-secondary px-4 py-2 inline-block -rotate-1 shadow-2xl mt-2 italic">
                                    {admin?.username || "Command"}.
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-muted/30 rounded-2xl hover:bg-muted transition-all relative">
                            <Bell size={20} className="text-secondary" />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-red-500/20"
                        >
                            <LogOut size={16} /> Termination
                        </button>
                    </div>
                </div>

                {/* System Vital Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {dashboardStats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-secondary/5 shadow-xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                            <div className={`absolute -right-4 -bottom-4 ${stat.bg} w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
                            <div className="relative z-10">
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110`}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-black text-secondary tracking-tighter">
                                    {loadingStats ? "..." : stat.value}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Bar */}
                <div className="mb-12 border-b-2 border-muted sticky top-24 bg-white/95 backdrop-blur-xl z-40 py-4 -mx-6 px-6 md:mx-0 md:px-0 flex items-center justify-between">
                    <div className="flex gap-10 overflow-x-auto no-scrollbar">
                        {[
                            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                            { id: "volunteers", label: "Volunteers", icon: Briefcase },
                            { id: "donors", label: "Donors", icon: Heart },
                            { id: "missions", label: "Missions", icon: Database },
                            { id: "settings", label: "System", icon: Settings },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 transition-all ${activeTab === tab.id ? "border-secondary text-secondary" : "border-transparent text-secondary/30 hover:text-secondary/60"}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4 bg-muted/20 px-4 py-2 rounded-xl border border-secondary/5">
                        <Search size={16} className="text-secondary/30" />
                        <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-xs font-bold text-secondary w-48" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-white rounded-[40px] border border-secondary/10 shadow-2xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-secondary tracking-tighter lowercase">active {activeTab}.</h2>
                                <p className="text-secondary/50 text-sm font-bold mt-1 uppercase tracking-tight">Real-time system telemetry and management.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                                    <Download size={14} /> Export Report
                                </button>
                                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-secondary font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-all">
                                    + Add New
                                </button>
                            </div>
                        </div>

                        {/* List Component Shell */}
                        <div className="w-full overflow-hidden">
                            {loadingList ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4 text-secondary/20">
                                    <Activity size={48} className="animate-spin" />
                                    <p className="font-black uppercase tracking-widest text-xs">Synchronizing stream...</p>
                                </div>
                            ) : listData.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4 text-secondary/10">
                                    <Database size={48} />
                                    <p className="font-black uppercase tracking-widest text-xs">No records found in active sector.</p>
                                </div>
                            ) : (
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-muted">
                                            <th className="text-left py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Identifier</th>
                                            <th className="text-left py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">
                                                {activeTab === "missions" ? "Classification" : "Communication"}
                                            </th>
                                            <th className="text-left py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">
                                                {activeTab === "donors" ? "Contribution" : "Current Status"}
                                            </th>
                                            <th className="text-left py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Temporal Mark</th>
                                            <th className="text-right py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listData.map((item, i) => (
                                            <tr key={item._id} className="group hover:bg-muted/10 transition-colors border-b border-muted/50 last:border-none">
                                                <td className="py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-secondary/5 shadow-sm">
                                                            {item.avatar || item.coverImage ? (
                                                                <img src={item.avatar || item.coverImage} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <div className="w-full h-full bg-muted flex items-center justify-center font-black text-secondary/20">
                                                                    {(item.username || item.title).charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-black text-secondary">{item.username || item.title}</p>
                                                            <p className="text-[10px] font-bold text-secondary/40 lowercase">{item.email || "mission_stream"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    {activeTab === "missions" ? (
                                                        <span className="bg-muted px-2 py-1 rounded-sm text-[9px] font-black uppercase text-secondary/60">
                                                            {item.category || "General"}
                                                        </span>
                                                    ) : (
                                                        <p className="text-xs font-bold text-secondary/60 lowercase tracking-tighter">
                                                            {item.phone || "no_contact_data"}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-6">
                                                    {activeTab === "donors" ? (
                                                        <p className="text-sm font-black text-emerald-600 tracking-tighter">
                                                            ₹{(item.totalDonatedAmount || 0).toLocaleString()}
                                                        </p>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${item.status === 'active' || item.status === 'Approved' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                                            <span className={`text-xs font-black uppercase tracking-tight ${item.status === 'active' || item.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>
                                                                {item.status || "Pending"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-6 text-sm font-bold text-secondary/60">
                                                    {format(new Date(item.createdAt), "dd MMM yyyy")}
                                                </td>
                                                <td className="py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {activeTab === "volunteers" && item.status === "Pending" && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(item._id, "Approved")}
                                                                    className="p-2 hover:bg-green-500 hover:text-white rounded-lg transition-all text-green-500/50 bg-green-50"
                                                                    title="Approve Volunteer"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(item._id, "Rejected")}
                                                                    className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all text-red-500/50 bg-red-50"
                                                                    title="Reject Volunteer"
                                                                >
                                                                    <CloseIcon size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                        {activeTab === "volunteers" && item.status === "Approved" && (
                                                            <button
                                                                onClick={async () => {
                                                                    await fetchMissionsForAssignment();
                                                                    setSelectedVolunteer(item);
                                                                    setIsAssignModalOpen(true);
                                                                }}
                                                                className="p-2 hover:bg-accent hover:text-secondary rounded-lg transition-all text-accent/50 bg-secondary"
                                                                title="Assign Task"
                                                            >
                                                                <Database size={16} />
                                                            </button>
                                                        )}
                                                        <button className="p-2 hover:bg-secondary hover:text-white rounded-lg transition-all text-secondary/30">
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Modal */}
            {isAssignModalOpen && (
                <AssignTaskModal
                    volunteer={selectedVolunteer}
                    missions={missions}
                    onClose={() => setIsAssignModalOpen(false)}
                />
            )}
        </main>
    );
};

const TargetIcon = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const AssignTaskModal = ({ volunteer, missions, onClose }) => {
    const [formData, setFormData] = useState({
        missionId: "",
        taskTitle: "",
        taskDescription: ""
    });
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.missionId) return alert("Please select a mission.");
        setLoading(true);
        try {
            const response = await assignTask({
                volunteerId: volunteer._id,
                ...formData
            });
            if (response.success) {
                alert("Task assigned successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Assignment failed:", error);
            alert("Failed to assign task.");
        } finally {
            setLoading(false);
        }
    };

    const selectedMission = missions.find(m => m._id === formData.missionId);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-3xl font-black text-secondary tracking-tighter lowercase">Task Allocation.</h3>
                            <p className="text-secondary/50 text-xs font-bold uppercase tracking-widest mt-1">Assigning mission for : {volunteer.username}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-all"><CloseIcon size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-1">Target Mission</label>

                            {/* Custom Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between bg-muted/30 border-2 transition-all rounded-[20px] px-6 py-4 text-sm font-bold text-secondary outline-none ${isDropdownOpen ? 'border-secondary' : 'border-transparent'}`}
                                >
                                    <span className={formData.missionId ? 'text-secondary font-black' : 'text-secondary/40'}>
                                        {selectedMission ? selectedMission.title : "Select a mission..."}
                                    </span>
                                    <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-secondary/10 rounded-3xl shadow-2xl z-[210] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="max-h-[250px] overflow-y-auto no-scrollbar">
                                            {missions.length === 0 ? (
                                                <div className="px-6 py-4 text-xs font-bold text-secondary/40 text-center">No active missions available.</div>
                                            ) : (
                                                missions.map((m) => (
                                                    <button
                                                        key={m._id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, missionId: m._id });
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-6 py-4 text-left text-sm transition-all hover:bg-secondary hover:text-white flex items-center justify-between group ${formData.missionId === m._id ? 'bg-secondary/5 text-secondary' : 'text-secondary/70'}`}
                                                    >
                                                        <span className="font-bold">{m.title}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select Sector</span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-1">Designated Task Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Area Survey Coordinator"
                                value={formData.taskTitle}
                                onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
                                className="w-full bg-muted/30 border-2 border-transparent focus:border-secondary transition-all rounded-[20px] px-6 py-4 text-sm font-bold text-secondary outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-1">Operational Directives</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Detail the specific responsibilities and expected deliverables..."
                                value={formData.taskDescription}
                                onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
                                className="w-full bg-muted/30 border-2 border-transparent focus:border-secondary transition-all rounded-[20px] px-6 py-4 text-sm font-bold text-secondary outline-none resize-none placeholder:text-secondary/20 font-bold"
                            />
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-5 bg-secondary text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Activity size={16} className="animate-spin" />
                                    Allocating Resources...
                                </>
                            ) : "Initialize Assignment"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
