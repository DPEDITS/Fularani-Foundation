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
} from "lucide-react";
import { loginDonor, isAuthenticated } from "../services/donorService";
import {
  loginVolunteer,
  isVolunteerAuthenticated,
} from "../services/volunteerService";

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
                  <a
                    href="/forgot-password"
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4 decoration-2"
                  >
                    Forgot?
                  </a>
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
    </div>
  );
};

export default DonorLogin;
