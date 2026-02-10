"use client";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion as Motion } from "motion/react";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { loginDonor, isAuthenticated, forgotPasswordDonor } from "../services/donorService";
import {
  loginVolunteer,
  isVolunteerAuthenticated,
  forgotPasswordVolunteer,
} from "../services/volunteerService";
import { loginAdmin } from "../services/adminService";

const DonorLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) return roleParam;
    return window.location.pathname.includes("volunteer")
      ? "volunteer"
      : "donor";
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    email: "",
    panNumber: "",
    newPassword: "",
  });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    if (role === "donor" && isAuthenticated()) {
      navigate("/donor-dashboard");
    } else if (role === "volunteer" && isVolunteerAuthenticated()) {
      navigate("/volunteer-dashboard");
    }
  }, [navigate, role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Admin Redirection Logic
      const isSystemAdmin = form.email.trim().toLowerCase() === "admin@gmail.com";
      if (isSystemAdmin) {
        const response = await loginAdmin(form.email.trim().toLowerCase(), form.password);
        if (response.success) {
          navigate("/admin-dashboard");
          return;
        }
      }

      if (role === "donor") {
        await loginDonor(form.email, form.password);
        navigate("/donor-dashboard");
      } else {
        await loginVolunteer(form.email, form.password);
        navigate("/volunteer-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      if (role === "donor") {
        await forgotPasswordDonor(forgotForm.email, forgotForm.panNumber, forgotForm.newPassword);
      } else {
        await forgotPasswordVolunteer(forgotForm.email, forgotForm.panNumber, forgotForm.newPassword);
      }
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess(false);
        setForgotForm({ email: "", panNumber: "", newPassword: "" });
      }, 3000);
    } catch (err) {
      setForgotError(err.response?.data?.message || "Reset failed. Verify details.");
    } finally {
      setForgotLoading(false);
    }
  };

  const isEmailValid = form.email.includes("@") && form.email.includes(".");
  const isPasswordValid = form.password.length >= 6;

  return (
    <div className="bg-white min-h-screen flex flex-col overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[100px] -translate-x-1/4"></div>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10 pt-12 pb-12">
        <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Branding */}
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block space-y-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              <ChevronLeft size={16} /> back to home
            </Link>

            <div className="space-y-4">
              <h1 className="text-7xl xl:text-8xl font-black text-secondary leading-[0.9] tracking-tighter lowercase">
                Welcome <br />
                <span className="text-white bg-primary px-6 py-2 inline-block -rotate-1 mt-2">
                  Back.
                </span>
              </h1>

              <div className="pt-4">
                <p className="text-[14px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                  {role === "donor" ? "donor access" : "volunteer access"}
                </p>
                <div className="h-[1px] w-20 bg-secondary/10 mt-4"></div>
              </div>
            </div>

            <p className="text-xl text-muted-foreground font-bold leading-tight max-w-[400px]">
              {role === "donor"
                ? "Sign in to track your impact and manage your donations."
                : "Sign in to access your missions and coordinate with the team."}
            </p>
          </Motion.div>

          {/* Right Side: Form Card */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-10 rounded-[48px] shadow-2xl border border-secondary/5 relative overflow-hidden max-w-[500px] mx-auto lg:mr-0 lg:ml-auto"
          >
            {/* Role Switcher */}
            <div className="relative flex items-center bg-muted/20 p-1.5 rounded-2xl mb-8">
              <div
                className={`absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-primary rounded-xl shadow-lg transition-transform duration-300 ${role === "volunteer" ? "translate-x-[calc(100%+12px)]" : ""}`}
              />
              <button
                type="button"
                onClick={() => {
                  setRole("donor");
                  navigate("/donor-login");
                  setError("");
                }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl relative z-10 transition-colors ${role === "donor" ? "text-white" : "text-secondary/40"}`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("volunteer");
                  navigate("/donor-login?role=volunteer");
                  setError("");
                }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl relative z-10 transition-colors ${role === "volunteer" ? "text-white" : "text-secondary/40"}`}
              >
                Volunteer
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 lowercase">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${form.email ? (isEmailValid ? "text-primary" : "text-red-500") : "text-secondary/20"}`}
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@mission.org"
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-base placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4 decoration-2"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${form.password ? (isPasswordValid ? "text-primary" : "text-red-500") : "text-secondary/20"}`}
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full h-14 pl-14 pr-14 rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-base placeholder:text-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors h-5 flex items-center"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-8 text-center pt-2">
                <p className="text-[11px] font-black text-secondary/40 uppercase tracking-[0.2em]">
                  No account?{" "}
                  <Link
                    to={
                      role === "donor"
                        ? "/donor-register"
                        : "/donor-register?role=volunteer"
                    }
                    className="text-primary hover:underline underline-offset-4 decoration-2"
                  >
                    Join mission
                  </Link>
                </p>
              </div>
            </form>
          </Motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-md">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-[450px] p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden"
          >
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-muted/30 rounded-full transition-colors"
            >
              <X size={20} className="text-secondary/40" />
            </button>

            {forgotSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-secondary mb-2 lowercase tracking-tighter">password reset!</h3>
                <p className="text-secondary/60 text-sm font-bold">Your security is updated. You can now login with your new password.</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-secondary mb-2 lowercase tracking-tighter">forgot access?</h3>
                  <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">Verify your identity to reset password.</p>
                </div>

                {forgotError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold border border-red-100 uppercase tracking-widest">
                    {forgotError}
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">Email</label>
                    <input
                      type="email"
                      value={forgotForm.email}
                      onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                      required
                      placeholder="registered@email.com"
                      className="w-full h-12 px-6 rounded-xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">Verified PAN Number</label>
                    <input
                      type="text"
                      value={forgotForm.panNumber}
                      onChange={(e) => setForgotForm({ ...forgotForm, panNumber: e.target.value })}
                      required
                      placeholder="ABCDE1234F"
                      className="w-full h-12 px-6 rounded-xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">New Password</label>
                    <input
                      type="password"
                      value={forgotForm.newPassword}
                      onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full h-12 px-6 rounded-xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-14 bg-secondary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {forgotLoading ? <Loader2 className="animate-spin" /> : <>Reset Password <Zap size={14} className="fill-accent text-accent" /></>}
                  </button>
                </form>
              </>
            )}
          </Motion.div>
        </div>
      )}
    </div>
  );
};

export default DonorLogin;
