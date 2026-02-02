"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  TrendingUp,
  Calendar,
  DollarSign,
  Gift,
  RefreshCcw,
  Download,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import {
  getDonorProfile,
  getDonorDonations,
  getDonorStats,
  logoutDonor,
  isAuthenticated,
  getDonorUser,
} from "../services/donorService";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/donor-login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, donationsRes, statsRes] = await Promise.all([
        getDonorProfile(),
        getDonorDonations(),
        getDonorStats(),
      ]);
      setProfile(profileRes.data);
      setDonations(donationsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      if (err.response?.status === 401) {
        navigate("/donor-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutDonor();
      navigate("/donor-login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/donor-login");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-rose-500/10 rounded-full animate-spin border-t-rose-500"></div>
            <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-rose-500" />
          </div>
          <p className="text-[#1d1d1f]/60 font-medium">Preparing your insights...</p>
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

  const user = profile || getDonorUser();

  return (
    <main className="min-h-screen bg-[#fbfbfd] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] overflow-hidden bg-white shadow-sm border border-black/5 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.username?.[0]?.toUpperCase() || "D"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-black/5">
                <Sparkles className="w-4 h-4 text-rose-500" />
              </div>
            </div>
            <div>
              <p className="text-[#86868b] font-bold text-xs uppercase tracking-[0.2em] mb-1">Donor Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] tracking-tight">
                Welcome, {user?.username || "Donor"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[11px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} /> Elite Supporter
                </span>
                <span className="text-[#86868b] text-sm font-medium">• Making an Impact</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/contact")}
              className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95"
            >
              <Gift size={18} />
              Donate Now
            </button>
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
          <StatCard icon={DollarSign} label="Total Given" value={formatCurrency(stats?.totalDonatedAmount || 0)} accent="text-rose-500" />
          <StatCard icon={Heart} label="Donations" value={stats?.donationCount || 0} accent="text-pink-500" />
          <StatCard icon={Calendar} label="This Year" value={formatCurrency(stats?.thisYearTotal || 0)} accent="text-blue-500" />
          <StatCard icon={RefreshCcw} label="Recurring" value={stats?.recurringCount || 0} accent="text-purple-500" />
        </div>

        {/* Apple Style Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-[#f5f5f7] rounded-[20px] shadow-inner">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "donations", label: "History", icon: CreditCard },
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
          {activeTab === "overview" && (
            <OverviewTab
              stats={stats}
              donations={donations}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === "donations" && (
            <DonationsTab
              donations={donations}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === "profile" && (
            <ProfileTab profile={profile} user={user} handleLogout={handleLogout} />
          )}
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
    <p className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{value}</p>
  </div>
);

const OverviewTab = ({ stats, donations, formatCurrency, formatDate }) => {
  const recentDonations = donations?.slice(0, 3) || [];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Average Donation & Year Progress */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#1d1d1f] mb-8">Giving Insight</h3>
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[#86868b] text-sm font-medium mb-1">Average Donation</p>
                <p className="text-3xl font-bold text-[#1d1d1f]">{formatCurrency(stats?.averageDonation || 0)}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg uppercase tracking-tight">Consistent</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#86868b]">
                <span>Donation Frequency</span>
                <span className="text-[#1d1d1f]">{stats?.avgFrequency || "Monthly"}</span>
              </div>
              <div className="w-full bg-[#f5f5f7] rounded-full h-3 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
        <p className="text-[#86868b] text-xs leading-relaxed mt-8">
          Your regular contributions help us maintain long-term community projects. Thank you for your unwavering support.
        </p>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
        <h3 className="text-xl font-bold text-[#1d1d1f] mb-8">Recent Contributions</h3>
        <div className="space-y-4">
          {recentDonations.length > 0 ? recentDonations.map((donation, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-2xl hover:bg-[#efeff2] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Heart size={18} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-[#1d1d1f] font-bold">{formatCurrency(donation.amount)}</p>
                  <p className="text-[#86868b] text-xs font-medium">{formatDate(donation.donatedAt)}</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-[#86868b]" />
            </div>
          )) : (
            <p className="text-[#86868b] text-center py-10 italic">No recent donations yet.</p>
          )}
          {recentDonations.length > 0 && (
            <button className="w-full py-3 mt-4 text-[#86868b] text-sm font-bold hover:text-[#1d1d1f] transition-colors">
              View All History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DonationsTab = ({ donations, formatCurrency, formatDate }) => (
  <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-black/5">
    <div className="flex items-center justify-between mb-10">
      <h3 className="text-2xl font-bold text-[#1d1d1f]">Donation History</h3>
      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f5f5f7] text-[#1d1d1f] font-bold text-sm hover:bg-[#efeff2] transition-all">
        <Download size={16} /> Export PDF
      </button>
    </div>

    {donations.length > 0 ? (
      <div className="overflow-x-auto -mx-4 md:-mx-0">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-black/5">
              <th className="pb-6 px-4 text-[#86868b] text-xs font-bold uppercase tracking-widest">Date</th>
              <th className="pb-6 px-4 text-[#86868b] text-xs font-bold uppercase tracking-widest">Amount</th>
              <th className="pb-6 px-4 text-[#86868b] text-xs font-bold uppercase tracking-widest">Plan</th>
              <th className="pb-6 px-4 text-[#86868b] text-xs font-bold uppercase tracking-widest text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {donations.map((donation, i) => (
              <tr key={i} className="group hover:bg-[#fbfbfd] transition-colors">
                <td className="py-6 px-4 font-bold text-[#1d1d1f]">{formatDate(donation.donatedAt)}</td>
                <td className="py-6 px-4">
                  <span className="text-xl font-bold text-[#1d1d1f]">{formatCurrency(donation.amount)}</span>
                </td>
                <td className="py-6 px-4">
                  {donation.isRecurring ? (
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg uppercase tracking-tighter">Recurring</span>
                  ) : (
                    <span className="px-3 py-1 bg-[#f5f5f7] text-[#86868b] text-[10px] font-black rounded-lg uppercase tracking-tighter">One-time</span>
                  )}
                </td>
                <td className="py-6 px-4 text-right">
                  {donation.receiptUrl ? (
                    <a href={donation.receiptUrl} className="inline-flex items-center gap-1.5 text-rose-500 font-bold text-sm hover:underline">
                      <Download size={14} /> Download
                    </a>
                  ) : (
                    <span className="text-[#86868b]/40">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-20 bg-[#fbfbfd] rounded-3xl border border-dashed border-black/10">
        <DollarSign size={40} className="mx-auto text-[#86868b] mb-4 opacity-30" />
        <p className="text-[#86868b] font-medium">Your donation history is currently empty.</p>
        <button className="mt-6 text-rose-500 font-bold text-sm hover:underline">Make your first donation</button>
      </div>
    )}
  </div>
);

const ProfileTab = ({ profile, user, handleLogout }) => {
  const data = profile || user;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-5 p-8 bg-white rounded-[32px] shadow-sm border border-black/5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f5f5f7] border border-black/5 shrink-0 flex items-center justify-center shadow-inner">
          {data?.avatar ? (
            <img src={data.avatar} alt={data.username} className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-[#86868b]" />
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">Profile & Fiscal Settings</h3>
          <p className="text-[#86868b] text-sm font-medium">Manage your personal information and tax preferences</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Details Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
          <h3 className="text-lg font-bold text-[#1d1d1f] mb-8">Personal Information</h3>
          <div className="space-y-6">
            <ProfileRow icon={User} label="Display Name" value={data?.username} />
            <ProfileRow icon={Mail} label="Email Address" value={data?.email} />
            <ProfileRow icon={Phone} label="Primary Contact" value={data?.phone} />
            <ProfileRow icon={MapPin} label="Mailing Address" value={data?.address} />
          </div>
        </div>

        {/* Identity & Fiscal Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
          <h3 className="text-lg font-bold text-[#1d1d1f] mb-8">Fiscal Identity</h3>
          <div className="space-y-8">
            <ProfileRow icon={FileText} label="PAN Identification" value={data?.panNumber ? `•••• •••• ${data.panNumber.slice(-4)}` : 'N/A'} />

            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-[#1d1d1f] font-bold text-sm">80G Tax Benefit</p>
                  <p className="text-[#86868b] text-xs leading-relaxed mt-1">
                    Your account is set to {data?.wants80GReceipt ? 'receive' : 'not receive'} 80G tax receipts automatically for all eligible donations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#f5f5f7] rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-rose-500 text-xl shadow-sm">
                1
              </div>
              <div>
                <p className="text-[#1d1d1f] font-bold text-sm">Member Level</p>
                <p className="text-[#86868b] text-[11px] font-bold uppercase tracking-wider">Foundation Pillar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#f5f5f7] rounded-[32px] gap-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#1d1d1f]">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[#1d1d1f] font-bold">Member Since</p>
            <p className="text-[#86868b] text-xs font-medium">Actively supporting since {data?.createdAt ? new Date(data.createdAt).getFullYear() : '2024'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-black/5 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 md:flex-none px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all shadow-md shadow-red-500/20 active:scale-95"
          >
            Log Out
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

export default DonorDashboard;
