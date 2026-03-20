"use client";
import React, { useState, useEffect, useRef } from "react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
import {
  Heart,
  ChevronRight,
  Sparkles,
  Award,
  ArrowUpRight,
  ShieldCheck,
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
  clearAuthData,
} from "../services/donorService";
import { isAdminAuthenticated } from "../services/adminService";
import { generateDonationReceipt } from "../utils/pdfGenerator";

// Extracted Components
import OverviewTab from "../components/dashboard/OverviewTab";
import DonationsTab from "../components/dashboard/DonationsTab";
import ProfileTab from "../components/dashboard/ProfileTab";
import ImpactTab from "../components/dashboard/ImpactTab";
import DonationModal from "../components/dashboard/DonationModal";
import SuccessModal from "../components/dashboard/SuccessModal";
import Toast from "../components/dashboard/Toast";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
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
    if (isAdminAuthenticated()) {
      safeNavigate(navigate, "/admin-dashboard");
      return;
    }
    if (!isAuthenticated()) {
      safeNavigate(navigate, "/donor-login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, donationsRes, statsRes, subscriptionsRes] =
        await Promise.all([
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
      if (err.response?.status === 401 || err.response?.status === 404) {
        clearAuthData();
        safeNavigate(navigate, "/donor-login");
      }
    } finally {
      setLoading(false);
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
      const { id: order_id } = orderData.data;
      const keyData = await getRazorpayKey();
      const donor = getDonorUser();

      const options = {
        key: keyData.data.key,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Fularani Foundation",
        description: "Donation Transaction",
        order_id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await verifyRazorpayPayment(verificationData);

            // Server handles: donorId (from JWT), receipt number, dates, recurringId
            const donationData = {
              amount: parseInt(amount),
              currency: "INR",
              paymentGateway: "Razorpay",
              paymentId: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              isRecurring,
              recurringInterval: isRecurring ? "monthly" : "once",
              donatedAt: new Date().toISOString(),
            };

            await createDonation(donationData);
            await fetchDashboardData();
            setShowDonationModal(false);
            setSuccessAmount(parseInt(amount));
            setShowSuccessModal(true);

            if (donor?.wants80GReceipt || profile?.wants80GReceipt) {
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
        theme: { color: "#F43F5E" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setToastMessage({
        type: "error",
        text: err.response?.data?.message || "Payment initiation failed.",
      });
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
      setToastMessage({
        type: "success",
        text: "Subscription stopped successfully.",
      });
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
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
      // Notify Navbar to re-fetch user data from backend
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error("Profile update failed:", err);
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
      // Notify Navbar to re-fetch user data from backend
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error("Avatar update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading)
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

  if (error)
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

  const user = profile || getDonorUser();

  return (
    <main className="min-h-screen bg-white pt-28 pb-10 px-4 md:px-10 md:pt-32 md:pb-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Hero Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 mb-12 text-center lg:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-24 h-24 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 bg-accent">
                {user?.avatar ? (
                  <img
                    src={getSecureCloudinaryUrl(user.avatar)}
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
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-secondary tracking-tighter leading-[0.9] lowercase">
                welcome, <br />
                <span className="text-white bg-primary px-4 py-2 inline-block -rotate-2 shadow-xl shadow-primary/30 mt-2">
                  {user?.username || "changemaker"}.
                </span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowDonationModal(true)}
            className="group relative px-6 py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-tight text-sm shadow-xl shadow-red-500/30 hover:-translate-y-1 transition-all"
          >
            <span className="relative z-10 flex items-center gap-2">
              Donate Now{" "}
              <Heart
                size={18}
                className="fill-accent text-accent animate-pulse"
              />
            </span>
          </button>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          <div className="md:col-span-2 bg-secondary p-6 md:p-10 rounded-[32px] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                  <Sparkles size={12} className="text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                    Total Impact
                  </span>
                </div>
                <ArrowUpRight
                  className="text-white/40 group-hover:text-white transition-all"
                  size={28}
                />
              </div>
              <div>
                <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-2">
                  {formatCurrency(stats?.totalDonatedAmount || 0)}
                </h3>
                <p className="text-white/60 font-bold text-base">
                  Invested in changing lives.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 md:p-10 rounded-[32px] relative overflow-hidden group shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
            <div className="absolute -bottom-10 -right-10 text-white/10 transition-transform duration-500">
              <Heart size={120} fill="currentColor" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-10">
                <Heart size={24} className="text-primary fill-primary" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">
                {stats?.donationCount || 0}
              </h3>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
                Contributions
              </p>
            </div>
          </div>

          <div className="bg-muted/20 p-6 md:p-10 rounded-[32px] border border-secondary/5 relative overflow-hidden group">
            <Sparkles
              className="text-secondary/10 absolute -bottom-4 -right-4"
              size={100}
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 relative z-10">
              Supporter Since
            </p>
            <p className="text-2xl font-black text-secondary tracking-tight relative z-10">
              {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-12 border-b-2 border-muted sticky top-24 bg-white/95 backdrop-blur-xl z-40 py-4 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview" },
              { id: "donations", label: "History" },
              { id: "impact", label: "Impact" },
              { id: "profile", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-black uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 transition-all focus:outline-none ${activeTab === tab.id ? "border-primary text-secondary" : "border-transparent text-secondary/30 hover:text-secondary/60"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
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
              user={user}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              setShowDonationModal={setShowDonationModal}
            />
          )}
          {activeTab === "impact" && (
            <ImpactTab
              formatCurrency={formatCurrency}
              formatDate={formatDate}
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

      <DonationModal
        show={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onDonate={handleRazorpayPayment}
      />
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={successAmount}
        formatCurrency={formatCurrency}
        donorName={user?.username}
        donorAvatar={user?.avatar ? getSecureCloudinaryUrl(user.avatar) : null}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </main>
  );
};

export default DonorDashboard;
