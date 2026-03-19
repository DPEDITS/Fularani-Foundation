"use client";
import React, { useState, useEffect, useRef } from "react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
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
  X as CloseIcon,
} from "lucide-react";
import {
  getVolunteerProfile,
  getVolunteerStats,
  logoutVolunteer,
  isVolunteerAuthenticated,
  getVolunteerUser,
  getMyProjects,
  submitProofOfWork,
  updateVolunteerAvatar,
  clearAuthData,
} from "../services/volunteerService";
import { isAdminAuthenticated } from "../services/adminService";

// Extracted Components
import VolunteerOverviewTab from "../components/dashboard/VolunteerOverviewTab";
import VolunteerMissionsTab from "../components/dashboard/VolunteerMissionsTab";
import VolunteerProfileTab from "../components/dashboard/VolunteerProfileTab";
import Toast from "../components/dashboard/Toast";
import { format } from "date-fns";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Task State
  const [myTasks, setMyTasks] = useState([]);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      safeNavigate(navigate, "/admin-dashboard");
      return;
    }
    if (!isVolunteerAuthenticated()) {
      safeNavigate(navigate, "/volunteer-login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "tasks") {
      fetchTasks();
    }
  }, [activeTab]);

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
      if (err.response?.status === 401 || err.response?.status === 404) {
        clearAuthData();
        safeNavigate(navigate, "/volunteer-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await getMyProjects();
      if (response.success) {
        setMyTasks(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleTaskCompleted = async () => {
    setIsProofModalOpen(false);
    fetchTasks();
    setToastMessage({ type: 'success', text: 'Proof submitted successfully!' });
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUpdatingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await updateVolunteerAvatar(formData);
      if (response.success) {
        setProfile(response.data);
        setToastMessage({ type: 'success', text: 'Avatar updated successfully!' });
      }
    } catch (error) {
      console.error("Avatar update failed:", error);
      setToastMessage({ type: 'error', text: 'Failed to update avatar.' });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutVolunteer();
      clearAuthData(); // Force clear
      safeNavigate(navigate, "/volunteer-login");
    } catch (err) {
      console.error("Logout error:", err);
      clearAuthData();
      safeNavigate(navigate, "/volunteer-login");
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
          <p className="text-[#1d1d1f]/60 font-medium">
            Loading your profile...
          </p>
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
          <p className="text-[#1d1d1f] text-lg font-bold mb-2">
            Something went wrong
          </p>
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
                  <img
                    src={getSecureCloudinaryUrl(user.avatar)}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
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
              onClick={() => safeNavigate(navigate, "/missions")}
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                    Service Impact
                  </span>
                </div>
                <ArrowUpRight
                  className="text-white/40 group-hover:text-white transition-all"
                  size={28}
                />
              </div>
              <div>
                <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
                  {stats?.totalHours || 0} Hours
                </h3>
                <p className="text-white/60 font-bold text-base">
                  Dedicated to community service.
                </p>
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
            <Award
              className="text-secondary/10 absolute -bottom-4 -right-4"
              size={100}
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 relative z-10">
              Impact Score
            </p>
            <p className="text-5xl font-black text-secondary tracking-tighter relative z-10">
              {stats?.impactScore || 0}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-12 border-b-2 border-muted sticky top-24 bg-white/95 backdrop-blur-xl z-40 py-4 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview" },
              { id: "missions", label: "My Missions" },
              { id: "tasks", label: "My Tasks" },
              { id: "profile", label: "Identity" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-black uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 transition-all focus:outline-none ${activeTab === tab.id
                    ? "border-primary text-secondary"
                    : "border-transparent text-secondary/30 hover:text-secondary/60"
                  } `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && (
            <VolunteerOverviewTab profile={profile} stats={stats} />
          )}
          {activeTab === "missions" && <VolunteerMissionsTab />}
          {activeTab === "tasks" && (
            <VolunteerTasksTab
              tasks={myTasks}
              onSubmitProof={(task) => {
                setSelectedTask(task);
                setIsProofModalOpen(true);
              }}
            />
          )}
          {activeTab === "profile" && (
            <VolunteerProfileTab
              profile={profile}
              user={user}
              handleLogout={handleLogout}
              onUpdateAvatar={() => fileInputRef.current.click()}
              isUpdatingAvatar={isUpdatingAvatar}
            />
          )}
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarUpdate}
        disabled={isUpdatingAvatar}
      />

      {isProofModalOpen && selectedTask && (
        <SubmitProofModal
          task={selectedTask}
          onClose={() => setIsProofModalOpen(false)}
          onSuccess={handleTaskCompleted}
        />
      )}
    </main>
  );
};

const VolunteerTasksTab = ({ tasks, onSubmitProof }) => {
  return (
    <div className="bg-white rounded-[40px] border border-secondary/10 shadow-2xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-black text-secondary tracking-tighter lowercase">assigned directives.</h3>
        <span className="bg-secondary text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{tasks.length} Active</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tasks.length === 0 ? (
          <div className="py-20 text-center text-secondary/40 font-bold uppercase tracking-widest text-xs">No active tasks assigned yet.</div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="p-8 rounded-[32px] border border-secondary/5 bg-secondary/5 hover:bg-white hover:shadow-xl hover:border-secondary/10 transition-all group relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'} `}></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${task.status === 'Completed' ? 'text-green-600' : 'text-blue-600'} `}>{task.status}</span>
                    <span className="text-[10px] font-bold text-secondary/30">•</span>
                    <span className="text-[10px] font-bold text-secondary/40">{format(new Date(task.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <h4 className="text-xl font-black text-secondary tracking-tight mb-2">{task.title}</h4>
                  <p className="text-sm font-bold text-secondary/60 max-w-2xl">{task.description}</p>
                </div>

                {task.status !== 'Completed' && (
                  <button
                    onClick={() => onSubmitProof(task)}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Camera size={14} /> Submit Proof
                  </button>
                )}
                {task.status === 'Completed' && (
                  <div className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                    <Check size={14} /> Verified
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SubmitProofModal = ({ task, onClose, onSuccess }) => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) return alert("max 5 images allowed");
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please upload at least one image.");

    setLoading(true);
    const formData = new FormData();
    formData.append("projectId", task._id);
    formData.append("description", description);
    images.forEach(img => formData.append("images", img));

    try {
      const response = await submitProofOfWork(formData);
      if (response.success) {
        alert("Proof of work submitted successfully! 🎉");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Submit proof error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Upload failed.";
      alert(`Failed to upload proof of work: ${errorMsg} `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10">
      <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-3xl font-black text-secondary tracking-tighter lowercase">Proof of Work.</h3>
              <p className="text-secondary/50 text-xs font-bold uppercase tracking-widest mt-1">Submitting evidence for: {task.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-all"><CloseIcon size={24} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-1">Work Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe the work completed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-muted/30 border-2 border-transparent focus:border-secondary transition-all rounded-[20px] px-6 py-4 text-sm font-bold text-secondary outline-none resize-none placeholder:text-secondary/20 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-1">Visual Evidence</label>
              <div className="border-2 border-dashed border-secondary/20 rounded-[20px] p-8 text-center hover:bg-muted/30 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <Camera size={32} className="text-secondary/40 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-secondary/60">
                    {images.length > 0 ? `${images.length} files selected` : "Drag & drop or click to upload"}
                  </p>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-secondary text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Activity size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : "Submit Proof"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

function Check({ size, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Activity({ size, className }) {
  return (
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default VolunteerDashboard;
