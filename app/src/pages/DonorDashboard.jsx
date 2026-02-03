"use client";
import { useState, useEffect, useRef } from "react";
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
  Edit2,
  X,
  Check,
  Camera,
} from "lucide-react";
import {
  getDonorProfile,
  getDonorDonations,
  getDonorStats,
  logoutDonor,
  isAuthenticated,
  getDonorUser,
  updateDonorProfile,
  updateDonorAvatar,
  createDonation,
} from "../services/donorService";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleSimulateDonation = async (amount, isRecurring) => {
    try {
      setIsUpdating(true);
      const donor = getDonorUser();
      const donationData = {
        donorId: donor._id,
        amount: parseInt(amount),
        currency: "INR",
        paymentGateway: "Simulation",
        paymentId: `sim_${Math.random().toString(36).substr(2, 9)}`,
        isRecurring: isRecurring,
        recurringInterval: isRecurring ? "monthly" : "once",
        recurringId: isRecurring ? `rec_${Math.random().toString(36).substr(2, 9)}` : "na",
        receiptNumber: `FF-${Date.now()}`,
        receiptUrl: "https://example.com/receipt.pdf",
        receiptGeneratedAt: new Date().toISOString(),
        donatedAt: new Date().toISOString(),
      };

      await createDonation(donationData);
      await fetchDashboardData();
      setShowDonationModal(false);
    } catch (err) {
      console.error("Donation simulation failed:", err);
      alert("Donation failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      setIsUpdating(true);
      await updateDonorProfile(data);
      await fetchDashboardData();
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("avatar", file);
      await updateDonorAvatar(formData);
      await fetchDashboardData();
    } catch (err) {
      console.error("Avatar update failed:", err);
      alert("Failed to update avatar.");
    } finally {
      setIsUpdating(false);
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
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] overflow-hidden bg-white shadow-sm border border-black/5 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.username?.[0]?.toUpperCase() || "D"}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[32px]">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUpdating}
              />
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
              onClick={() => setShowDonationModal(true)}
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
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "donations" && (
            <DonationsTab
              donations={donations}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              setShowDonationModal={setShowDonationModal}
            />
          )}
          {activeTab === "profile" && (
            <ProfileTab
              user={user}
              onUpdate={handleUpdateProfile}
              isUpdating={isUpdating}
            />
          )}
        </div>
      </div>

      {/* Donation Simulation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1d1d1f]">Make a Donation</h2>
              <button onClick={() => setShowDonationModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2 block">Amount (INR)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleSimulateDonation(amt, false)}
                      className="py-3 px-2 rounded-xl border border-black/5 bg-[#f5f5f7] hover:bg-rose-50 hover:border-rose-200 text-[#1d1d1f] font-bold text-sm transition-all"
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Custom"
                      className="w-full py-3 px-3 rounded-xl border border-black/5 bg-[#f5f5f7] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSimulateDonation(e.target.value, false);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex gap-3">
                  <RefreshCcw className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <p className="text-blue-900 font-bold text-sm">Monthly Giving</p>
                    <p className="text-blue-700/70 text-xs mt-1">Become a recurring donor to provide consistent support.</p>
                    <button
                      onClick={() => handleSimulateDonation(1000, true)}
                      className="mt-3 text-blue-600 font-bold text-xs hover:underline"
                    >
                      Start Monthly ₹1,000 →
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#86868b] text-center leading-relaxed">
                This is a simulation. In a production environment, this would redirect you to a secure payment gateway like Razorpay or Stripe.
              </p>
            </div>
          </div>
        </div>
      )}
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

const OverviewTab = ({ stats, donations, formatCurrency, formatDate, setActiveTab }) => {
  const recentDonations = donations?.slice(0, 3) || [];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Giving Insight */}
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
            <button
              onClick={() => setActiveTab("donations")}
              className="w-full py-3 mt-4 text-[#86868b] text-sm font-bold hover:text-[#1d1d1f] transition-colors"
            >
              View All History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DonationsTab = ({ donations, formatCurrency, formatDate, setShowDonationModal }) => (
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
                  <button
                    onClick={() => window.open(donation.receiptUrl, '_blank')}
                    className="inline-flex items-center gap-1.5 text-rose-500 font-bold text-sm hover:underline"
                  >
                    <Download size={14} /> Download
                  </button>
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
        <button
          onClick={() => setShowDonationModal(true)}
          className="mt-6 text-rose-500 font-bold text-sm hover:underline"
        >
          Make your first donation
        </button>
      </div>
    )}
  </div>
);

const ProfileTab = ({ user, onUpdate, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
    panNumber: user?.panNumber || "",
    wants80GReceipt: user?.wants80GReceipt || false,
  });

  // Sync form data when user prop changes (after successful update)
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
        panNumber: user.panNumber || "",
        wants80GReceipt: !!user.wants80GReceipt,
      });
    }
  }, [user, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Update error:", err);
      // Show error from backend if available
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-8 relative">
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[110] bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-green-500/20 flex items-center gap-3 animate-in slide-in-from-right duration-500">
          <div className="bg-white/20 p-1 rounded-full"><Check size={16} /></div>
          <p className="font-bold text-sm">Profile updated successfully!</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 bg-white rounded-[32px] shadow-sm border border-black/5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#f5f5f7] border border-black/5 shrink-0 flex items-center justify-center">
            <User size={28} className="text-[#86868b]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">Identity Settings</h3>
            <p className="text-[#86868b] text-sm font-medium">Manage your personal information and preferences</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] font-bold text-sm hover:bg-[#efeff2] transition-all"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-2xl bg-gray-100 text-[#1d1d1f] font-bold text-sm hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1d1d1f] text-white font-bold text-sm hover:bg-black transition-all disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : <><Check size={16} /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
          <h3 className="text-lg font-bold text-[#1d1d1f] mb-8">Contact Information</h3>
          <div className="space-y-6">
            <ProfileField
              icon={User}
              label="Username"
              name="username"
              value={formData.username}
              isEditing={isEditing}
              onChange={(val) => setFormData({ ...formData, username: val })}
            />
            <ProfileField
              icon={Phone}
              label="Phone"
              name="phone"
              value={formData.phone}
              isEditing={isEditing}
              type="tel"
              onChange={(val) => setFormData({ ...formData, phone: val })}
            />
            <ProfileField
              icon={MapPin}
              label="Address"
              name="address"
              value={formData.address}
              isEditing={isEditing}
              onChange={(val) => setFormData({ ...formData, address: val })}
            />
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
          <h3 className="text-lg font-bold text-[#1d1d1f] mb-8">Fiscal Identity</h3>
          <div className="space-y-6">
            <ProfileField
              icon={FileText}
              label="PAN Number"
              name="panNumber"
              value={formData.panNumber}
              isEditing={isEditing}
              isReadOnly={true}
              placeholder="ABCDE1234F"
              onChange={(val) => setFormData({ ...formData, panNumber: val })}
            />

            <div className="pt-4 mt-4 border-t border-black/5">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={formData.wants80GReceipt}
                    onChange={(e) => isEditing && setFormData({ ...formData, wants80GReceipt: e.target.checked })}
                    disabled={!isEditing}
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${formData.wants80GReceipt ? 'bg-rose-500 border-rose-500' : 'bg-transparent border-gray-300'}`}>
                    {formData.wants80GReceipt && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <div>
                  <p className="text-[#1d1d1f] font-bold text-sm">Automated 80G Receipts</p>
                  <p className="text-[#86868b] text-[11px] leading-relaxed mt-1">Receive tax exemption certificates automatically in your email after every donation.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Fiscal Benefit Card */}
      <div className="p-8 bg-rose-50 rounded-[32px] border border-rose-100">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
            <ShieldCheck size={32} className="text-rose-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-rose-900 mb-1">Tax Benefits (Sec 80G)</h4>
            <p className="text-rose-700/70 text-sm leading-relaxed max-w-2xl">
              All your donations to Fularani Foundation are 50% tax-exempt under Section 80G of the Income Tax Act. Ensure your PAN is updated to receive accurate receipts.
            </p>
          </div>
          <a href="/about" className="px-6 py-3 bg-white text-rose-500 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value, isEditing, onChange, type = "text", placeholder, isReadOnly = false }) => (
  <div className="flex items-start gap-5">
    <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center shrink-0">
      <Icon size={18} className="text-[#86868b]" />
    </div>
    <div className="flex-1">
      <p className="text-[#86868b] text-[11px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
      {isEditing && !isReadOnly ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#f5f5f7] border-none rounded-lg px-3 py-1.5 text-[15px] font-medium text-[#1d1d1f] focus:ring-2 focus:ring-rose-500/20"
        />
      ) : (
        <div className="flex items-center gap-2">
          <p className={`text-[#1d1d1f] font-bold text-[15px] min-h-[22.5px] ${isReadOnly && isEditing ? "opacity-50" : ""}`}>
            {value || "—"}
          </p>
          {isReadOnly && isEditing && (
            <ShieldCheck size={14} className="text-[#86868b]" title="Verified & Immutable" />
          )}
        </div>
      )}
    </div>
  </div>
);

export default DonorDashboard;
