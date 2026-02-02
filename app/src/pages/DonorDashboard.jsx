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
      // If unauthorized, redirect to login
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
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-500/30 rounded-full animate-spin border-t-pink-500"></div>
            <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-pink-500" />
          </div>
          <p className="text-white/70 text-lg">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-md">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const user = profile || getDonorUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-24 pb-16 px-4 md:px-8">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-pink-500/30">
                {user?.username?.[0]?.toUpperCase() || "D"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome back, {user?.username || "Donor"}!
              </h1>
              <p className="text-white/60 flex items-center gap-2 mt-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Generous Supporter</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/contact")}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-pink-400" />
              <span className="hidden md:inline">Donate Again</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={DollarSign}
            label="Total Donated"
            value={formatCurrency(stats?.totalDonatedAmount || 0)}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={Heart}
            label="Total Donations"
            value={stats?.donationCount || 0}
            gradient="from-pink-500 to-rose-600"
          />
          <StatCard
            icon={Calendar}
            label="This Year"
            value={formatCurrency(stats?.thisYearTotal || 0)}
            gradient="from-blue-500 to-indigo-600"
          />
          <StatCard
            icon={RefreshCcw}
            label="Recurring"
            value={stats?.recurringCount || 0}
            gradient="from-purple-500 to-violet-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "donations", label: "Donation History", icon: Heart },
            { id: "profile", label: "Profile", icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
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
            <ProfileTab profile={profile} user={user} />
          )}
        </div>
      </div>
    </main>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 overflow-hidden">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
    />
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-white/60 text-sm mb-1">{label}</p>
    <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
  </div>
);

// Overview Tab Component
const OverviewTab = ({ stats, donations, formatCurrency, formatDate }) => {
  const recentDonations = donations?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-400" />
          Quick Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-5">
            <p className="text-white/60 text-sm mb-1">Average Donation</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats?.averageDonation || 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-5">
            <p className="text-white/60 text-sm mb-1">This Year Donations</p>
            <p className="text-2xl font-bold text-white">
              {stats?.thisYearCount || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-5">
            <p className="text-white/60 text-sm mb-1">Active Recurring</p>
            <p className="text-2xl font-bold text-white">
              {stats?.recurringCount || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-pink-400" />
          Recent Donations
        </h3>
        {recentDonations.length > 0 ? (
          <div className="space-y-3">
            {recentDonations.map((donation, index) => (
              <div
                key={donation._id || index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className="text-white/50 text-sm">
                      {formatDate(donation.donatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {donation.isRecurring && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <RefreshCcw className="w-3 h-3" />
                      Recurring
                    </span>
                  )}
                  <ArrowUpRight className="w-5 h-5 text-white/30" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/50">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No donations yet. Start making a difference today!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Donations Tab Component
const DonationsTab = ({ donations, formatCurrency, formatDate }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Heart className="w-5 h-5 text-pink-400" />
        All Donations
      </h3>

      {donations && donations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/60 text-sm font-medium py-3 px-4">
                  Date
                </th>
                <th className="text-left text-white/60 text-sm font-medium py-3 px-4">
                  Amount
                </th>
                <th className="text-left text-white/60 text-sm font-medium py-3 px-4">
                  Type
                </th>
                <th className="text-left text-white/60 text-sm font-medium py-3 px-4">
                  Receipt
                </th>
                <th className="text-left text-white/60 text-sm font-medium py-3 px-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr
                  key={donation._id || index}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 text-white">
                    {formatDate(donation.donatedAt)}
                  </td>
                  <td className="py-4 px-4 text-white font-medium">
                    {formatCurrency(donation.amount)}
                  </td>
                  <td className="py-4 px-4">
                    {donation.isRecurring ? (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full inline-flex items-center gap-1">
                        <RefreshCcw className="w-3 h-3" />
                        {donation.recurringInterval}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                        One-time
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {donation.receiptUrl ? (
                      <a
                        href={donation.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden md:inline">Download</span>
                      </a>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-white/50">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">No donations found</p>
          <p className="text-sm">Your generosity journey starts here!</p>
        </div>
      )}
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ profile, user }) => {
  const data = profile || user;

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-pink-400" />
        Profile Information
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-white/70 text-sm font-medium uppercase tracking-wider">
            Personal Details
          </h4>

          <ProfileItem icon={User} label="Username" value={data?.username} />
          <ProfileItem icon={Mail} label="Email" value={data?.email} />
          <ProfileItem
            icon={Phone}
            label="Phone"
            value={data?.phone || "Not provided"}
          />
          <ProfileItem
            icon={MapPin}
            label="Address"
            value={data?.address || "Not provided"}
          />
        </div>

        {/* Tax Information */}
        <div className="space-y-4">
          <h4 className="text-white/70 text-sm font-medium uppercase tracking-wider">
            Tax Information
          </h4>

          <ProfileItem
            icon={FileText}
            label="PAN Number"
            value={
              data?.panNumber
                ? `****${data.panNumber.slice(-4)}`
                : "Not provided"
            }
          />
          <ProfileItem
            icon={FileText}
            label="80G Receipt"
            value={
              data?.wants80GReceipt
                ? "Yes, I want 80G receipt"
                : "No, not required"
            }
          />

          <div className="mt-6 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-medium">Tax Benefits</p>
                <p className="text-white/60 text-sm mt-1">
                  Your donations may be eligible for tax deductions under
                  Section 80G of the Income Tax Act.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
        <p className="text-white/50 text-sm">
          Member since{" "}
          {data?.createdAt
            ? new Date(data.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })
            : "N/A"}
        </p>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-pink-500/20 text-pink-400 text-sm font-medium rounded-full flex items-center gap-2">
            <Heart className="w-4 h-4" />
            {data?.isActive ? "Active Donor" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Profile Item Component
const ProfileItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
      <Icon className="w-5 h-5 text-pink-400" />
    </div>
    <div>
      <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-white font-medium">{value || "—"}</p>
    </div>
  </div>
);

export default DonorDashboard;
