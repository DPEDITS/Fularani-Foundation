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
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getActiveSubscriptions,
  cancelSubscription,
} from "../services/donorService";
import { generateDonationReceipt, generateDonationsReport } from "../utils/pdfGenerator";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

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
      const [profileRes, donationsRes, statsRes, subscriptionsRes] = await Promise.all([
        getDonorProfile(),
        getDonorDonations(),
        getDonorStats(),
        getActiveSubscriptions(),
      ]);
      setProfile(profileRes.data);
      setDonations(donationsRes.data);
      setStats(statsRes.data);
      setActiveSubscriptions(subscriptionsRes.data || []);
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

  const handleRazorpayPayment = async (amount, isRecurring) => {
    try {
      setIsUpdating(true);
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const orderData = await createRazorpayOrder(amount);
      const { id: order_id, currency } = orderData.data;

      const keyData = await getRazorpayKey();
      const key = keyData.data.key;

      const donor = getDonorUser(); // Ensure donor info is current

      const options = {
        key,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Fularani Foundation",
        description: "Donation Transaction",
        // image: "https://example.com/logo.png",
        order_id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await verifyRazorpayPayment(verificationData);

            const donationData = {
              donorId: donor._id,
              amount: parseInt(amount),
              currency: "INR",
              paymentGateway: "Razorpay",
              paymentId: response.razorpay_payment_id,
              isRecurring: isRecurring,
              recurringInterval: isRecurring ? "monthly" : "once",
              recurringId: isRecurring
                ? `rec_${Math.random().toString(36).substr(2, 9)}`
                : "na",
              receiptNumber: `FF-${Date.now()}`,
              receiptUrl: "https://example.com/receipt.pdf",
              receiptGeneratedAt: new Date().toISOString(),
              donatedAt: new Date().toISOString(),
            };

            await createDonation(donationData);
            await fetchDashboardData();
            setShowDonationModal(false);
            setSuccessAmount(parseInt(amount));
            setShowSuccessModal(true);

            // Auto-download 80G receipt if requested
            if (donor?.wants80GReceipt || profile?.wants80GReceipt) {
              console.log("Auto-downloading 80G receipt as requested...");
              await generateDonationReceipt(donationData, donor || profile);
            }
          } catch (verifyError) {
            console.error("Verification failed:", verifyError);
            setToastMessage({
              type: "error",
              text: "Payment verification failed. Please contact support.",
            });
            setTimeout(() => setToastMessage(null), 5000);
          }
        },
        prefill: {
          name: donor?.username,
          contact: donor?.phone,
          email: donor?.email || "donor@example.com",
        },
        notes: {
          address: "Fularani Foundation Office",
        },
        theme: {
          color: "#F43F5E",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Payment initiation failed. Please try again.";
      setToastMessage({ type: "error", text: errorMessage });
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      setIsUpdating(true);
      await cancelSubscription(subscriptionId);
      await fetchDashboardData();
      setToastMessage({ type: "success", text: "Subscription stopped successfully." });
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error("Cancel subscription failed:", err);
      setToastMessage({ type: "error", text: "Failed to stop subscription." });
      setTimeout(() => setToastMessage(null), 5000);
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
          <p className="text-[#1d1d1f]/60 font-medium">
            Preparing your insights...
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

  const user = profile || getDonorUser();

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Hero Header Section */}
        {/* Hero Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 mb-12 text-center lg:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 bg-accent">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center text-white text-6xl font-black uppercase">
                    {user?.username?.[0] || "D"}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white" size={40} />
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
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="inline-block bg-accent px-3 py-1 rounded-sm text-xs font-black uppercase tracking-widest text-secondary mb-3 shadow-lg shadow-accent/20">
                Donor Dashboard
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-secondary tracking-tighter leading-[0.9] lowercase">
                welcome, <br />
                <span className="text-white bg-primary px-4 py-2 inline-block -rotate-2 shadow-xl shadow-primary/30 mt-2">
                  {user?.username || "changemaker"}.
                </span>
              </h1>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowDonationModal(true)}
              className="group relative px-6 py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-tight text-sm overflow-hidden hover:bg-red-600 transition-all shadow-xl shadow-red-500/30 hover:-translate-y-1 active:translate-y-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                Donate Now <Heart size={18} className="fill-accent text-accent animate-pulse" />
              </span>
            </button>
          </div>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">

          {/* Main Stat - Total Given */}
          <div className="md:col-span-2 bg-secondary p-6 md:p-10 rounded-[32px] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700"></div>

            <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                  <Sparkles size={12} className="text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Total Impact</span>
                </div>
                <ArrowUpRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={28} />
              </div>

              <div>
                <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
                  {formatCurrency(stats?.totalDonatedAmount || 0)}
                </h3>
                <p className="text-white/60 font-bold text-base">Invested in changing lives.</p>
              </div>
            </div>
          </div>

          {/* Donation Count */}
          <div className="bg-primary p-6 md:p-10 rounded-[32px] relative overflow-hidden group shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-500">
              <Heart size={120} fill="currentColor" />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-10">
                <Heart size={24} className="text-primary fill-primary" />
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter mb-1">
                {stats?.donationCount || 0}
              </h3>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
                Contributions
              </p>
            </div>
          </div>

          {/* Stats Column 4 - Supporter Since */}
          <div className="bg-muted/20 p-6 md:p-10 rounded-[32px] border border-secondary/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Sparkles className="text-secondary/10 absolute -bottom-4 -right-4" size={100} />
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 relative z-10">Supporter Since</p>
            <p className="text-2xl font-black text-secondary tracking-tight relative z-10">{formatDate(user?.createdAt || new Date())}</p>
          </div>
        </div>

        {/* Navigation Tabs - MongoDB Style */}
        <div className="mb-12 border-b-2 border-muted sticky top-24 bg-white/95 backdrop-blur-xl z-40 py-4 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview" },
              { id: "donations", label: "History" },
              { id: "profile", label: "Settings" },
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
          {activeTab === "overview" && (
            <OverviewTab
              stats={stats}
              donations={donations}
              activeSubscriptions={activeSubscriptions}
              handleCancelSubscription={handleCancelSubscription}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "donations" && (
            <DonationsTab
              donations={donations}
              user={user}
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
              <h2 className="text-2xl font-bold text-[#1d1d1f]">
                Make a Donation
              </h2>
              <button
                onClick={() => setShowDonationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2 block">
                  Amount (INR)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleRazorpayPayment(amt, false)}
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
                        if (e.key === "Enter")
                          handleRazorpayPayment(e.target.value, false);
                      }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#86868b] text-center leading-relaxed">
                Your contribution goes directly towards our mission.
                Transactions are secured by Razorpay.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 text-center relative overflow-hidden">
            {/* Animated background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10">
              {/* Success Icon with Animation */}
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <Check size={36} className="text-white" strokeWidth={3} />
                </div>
                {/* Sparkles */}
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-yellow-400 animate-bounce delay-100" />
              </div>

              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">
                Thank You! 🎉
              </h2>
              <p className="text-[#86868b] mb-6">
                Your donation was successful
              </p>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 mb-6 border border-rose-100">
                <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">
                  Amount Donated
                </p>
                <p className="text-4xl font-bold text-[#1d1d1f]">
                  {formatCurrency(successAmount)}
                </p>
              </div>

              <p className="text-sm text-[#86868b] mb-8 leading-relaxed">
                Your generosity will make a real difference in someone's life. A
                receipt has been sent to your email.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-24 right-8 z-[110] px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-500 max-w-sm ${toastMessage.type === "error"
            ? "bg-red-500 text-white shadow-red-500/20"
            : "bg-green-500 text-white shadow-green-500/20"
            }`}
        >
          <div className="bg-white/20 p-1.5 rounded-full shrink-0">
            {toastMessage.type === "error" ? (
              <X size={16} />
            ) : (
              <Check size={16} />
            )}
          </div>
          <p className="font-medium text-sm">{toastMessage.text}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
};

const OverviewTab = ({
  stats,
  donations,
  activeSubscriptions,
  handleCancelSubscription,
  formatCurrency,
  formatDate,
  setActiveTab,
}) => {
  const engagementScore = Math.min(100, Math.max(15, (stats?.donationCount || 0) * 15));
  const engagementLabel = engagementScore > 80 ? "Legendary" : engagementScore > 50 ? "Consistent" : "Growing";
  const recentDonations = donations?.slice(0, 3) || [];

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6" >
      {/* Giving Insight */}
      < div className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl border border-secondary/10 flex flex-col justify-between group hover:border-secondary/20 transition-all" >
        <div>
          <h3 className="text-xl md:text-2xl font-black text-secondary mb-6 lowercase tracking-tighter">giving insight.</h3>
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-muted pb-5">
              <div>
                <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">Average Donation</p>
                <p className="text-3xl font-black text-secondary tracking-tight">{formatCurrency(stats?.averageDonation || 0)}</p>
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
                <p className="text-3xl font-black text-secondary tracking-tight">
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
      </div >

      {/* Recent Activity List */}
      < div className="bg-secondary p-6 md:p-10 rounded-[32px] shadow-2xl flex flex-col" >
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
        {
          recentDonations.length > 0 && (
            <button
              onClick={() => setActiveTab("donations")}
              className="w-full py-4 mt-6 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-secondary transition-all rounded-xl"
            >
              View Full History
            </button>
          )
        }
      </div >

    </div >
  );
};

const DonationsTab = ({ donations, user, formatCurrency, formatDate, setShowDonationModal }) => {
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
                <div className="inline-flex items-center gap-4 bg-secondary text-white px-6 py-3 rounded-2xl shadow-2xl">
                  <span className="text-3xl font-black tracking-tighter">{year}</span>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 leading-none">Yearly Total</span>
                    <span className="text-sm font-black text-accent">{formatCurrency(yearTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Path Line */}
              <div className="absolute left-10 top-20 bottom-0 w-px bg-gradient-to-b from-secondary/20 via-secondary/10 to-transparent"></div>

              {/* Donation Nodes */}
              <div className="space-y-6 ml-10 pl-10 border-l-2 border-dashed border-secondary/5 py-4">
                {yearDonations.map((donation, i) => (
                  <div key={i} className="group relative">
                    {/* The Dot */}
                    <div className="absolute -left-[51px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-4 border-secondary group-hover:bg-accent group-hover:border-accent group-hover:scale-125 transition-all z-10 shadow-lg"></div>

                    {/* The Card */}
                    <div className="bg-white p-6 rounded-[24px] border border-secondary/10 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
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

                      <div className="flex items-center gap-4">
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
  );
};

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
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-6 relative">
      {showSuccess && (
        <div className="fixed top-32 right-10 z-[110] bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500 border border-white/20">
          <div className="bg-green-500 rounded-full p-1"><Check size={14} className="text-white" /></div>
          <p className="font-black text-xs uppercase tracking-widest">Profile updated</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 md:p-8 bg-secondary rounded-[32px] shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 shrink-0 flex items-center justify-center backdrop-blur-sm">
            <User size={24} className="text-white/80" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-1">identity settings.</h3>
            <p className="text-white/60 text-xs font-bold">Manage your personal information and preferences.</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-secondary font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all relative z-10"
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-3 rounded-xl bg-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-secondary font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-accent/20"
            >
              {isUpdating ? "Saving..." : <><Check size={14} /> Save</>}
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-secondary/10">
          <h3 className="text-xl font-black text-secondary mb-6 lowercase tracking-tighter">contact information.</h3>
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

        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-secondary/10">
          <h3 className="text-xl font-black text-secondary mb-6 lowercase tracking-tighter">fiscal identity.</h3>
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

            <div className="pt-4 mt-2 border-t border-secondary/10">
              <label className="flex items-start gap-4 cursor-pointer group select-none">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={formData.wants80GReceipt}
                    onChange={(e) =>
                      isEditing &&
                      setFormData({
                        ...formData,
                        wants80GReceipt: e.target.checked,
                      })
                    }
                    disabled={!isEditing}
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${formData.wants80GReceipt ? 'bg-primary border-primary' : 'bg-transparent border-secondary/20 group-hover:border-primary'}`}>
                    {formData.wants80GReceipt && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <div>
                  <p className="text-secondary font-black text-xs uppercase tracking-tight">Automated 80G Receipts</p>
                  <p className="text-secondary/60 text-[10px] font-bold leading-relaxed mt-1">Receive tax exemption certificates automatically in your email after every donation.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Fiscal Benefit Card */}
      <div className="p-6 md:p-8 bg-primary/10 rounded-[32px] border border-primary/20">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-black text-secondary mb-1 uppercase tracking-tight">Tax Benefits (Sec 80G)</h4>
            <p className="text-secondary/70 text-xs font-bold leading-relaxed max-w-3xl">
              All your donations to Fularani Foundation are 50% tax-exempt under Section 80G of the Income Tax Act. Ensure your PAN is updated to receive accurate receipts.
            </p>
          </div>
          <a href="/about" className="px-6 py-3 bg-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/10 hover:-translate-y-1 transition-transform">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({
  icon: Icon,
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  placeholder,
  isReadOnly = false,
}) => (
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
      <Icon size={20} className="text-secondary/60" />
    </div>
    <div className="flex-1">
      <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
      {isEditing && !isReadOnly ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-muted/50 border-2 border-transparent focus:border-primary rounded-lg px-4 py-2 text-base font-bold text-secondary focus:outline-none transition-colors"
        />
      ) : (
        <div className="flex items-center gap-2">
          <p className={`text-secondary font-black text-lg min-h-[28px] ${isReadOnly && isEditing ? "opacity-50" : ""}`}>
            {value || "—"}
          </p>
          {isReadOnly && isEditing && (
            <ShieldCheck size={16} className="text-green-500" title="Verified & Immutable" />
          )}
        </div>
      )}
    </div>
  </div>
);

export default DonorDashboard;
