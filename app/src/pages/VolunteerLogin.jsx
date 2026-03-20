import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { loginVolunteer, googleAuthVolunteer, isVolunteerAuthenticated } from "../services/volunteerService";
import { loginAdmin, googleAuthAdmin, isAdminAuthenticated } from "../services/adminService";
import GoogleSignInButton from "../components/GoogleSignInButton";

const VolunteerLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      safeNavigate(navigate, "/admin-dashboard");
    } else if (isVolunteerAuthenticated()) {
      safeNavigate(navigate, "/volunteer-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const adminEmails = ["debashishparida75@gmail.com", "abhijeetduttaam2222@gmail.com", "abhijeetdashx@gmail.com"];
      const isAdminEmail = adminEmails.includes(form.email.trim().toLowerCase());

      if (isAdminEmail) {
        const response = await loginAdmin(
          form.email.trim().toLowerCase(),
          form.password,
        );
        if (response.success) {
          safeNavigate(navigate, "/admin-dashboard");
        } else {
          setError(response.message || "Admin login failed");
        }
        return; // ALWAYS return for admin email
      }

      const response = await loginVolunteer(form.email, form.password);
      if (response.success) {
        safeNavigate(navigate, "/volunteer-dashboard");
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = form.email.includes("@") && form.email.includes(".");
  const isPasswordValid = form.password.length >= 6;

  // Google Sign-In handler
  const handleGoogleSuccess = async (credential) => {
    setGoogleLoading(true);
    setError("");
    try {
      // Decode JWT to check email before calling backend
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const email = payload.email?.toLowerCase();

      const adminEmails = ["debashishparida75@gmail.com", "abhijeetduttaam2222@gmail.com", "abhijeetdashx@gmail.com"];
      if (adminEmails.includes(email)) {
        await googleAuthAdmin(credential);
        safeNavigate(navigate, "/admin-dashboard");
        return;
      }

      const result = await googleAuthVolunteer(credential);
      if (result.data?.isNewUser) {
        // New volunteer — redirect to register with Google profile pre-filled
        const profile = result.data.googleProfile;
        const params = new URLSearchParams({
          role: "volunteer",
          googleName: profile.name || "",
          googleEmail: profile.email || "",
          googlePicture: profile.picture || "",
          googleId: profile.googleId || "",
        });
        safeNavigate(navigate, `/donor-register?${params.toString()}`);
      } else {
        safeNavigate(navigate, "/volunteer-dashboard");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      setError(
        err.response?.data?.message || "Google sign-in failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorMsg) => {
    setError(errorMsg || "Google sign-in failed");
  };

  return (
    <main className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-black/5">
            <Users size={32} className="text-[#0071e3]" />
          </div>
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight mb-2">
            Volunteer Sign In
          </h1>
          <p className="text-[17px] text-[#86868b] font-medium">
            Welcome back, hero. Ready to make an impact?
          </p>
        </div>

        <div className="apple-card p-8 md:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[14px] font-bold text-[#1d1d1f] uppercase tracking-tight">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  size="sm"
                  className="text-[13px] text-[#0066cc] font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1d1d1f] text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && (
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full border-t border-black/5"></div>
              <span className="relative bg-white px-4 text-[13px] text-[#86868b] font-medium uppercase tracking-widest">
                or
              </span>
            </div>

            <div>
              {googleLoading ? (
                <div className="w-full h-14 flex items-center justify-center bg-[#f5f5f7] rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin text-[#0071e3]" />
                  <span className="ml-2 text-sm font-bold text-[#86868b]">Signing in with Google...</span>
                </div>
              ) : (
                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  disabled={loading}
                  text="signin_with"
                />
              )}
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[15px] text-[#86868b] font-medium">
              New Volunteer?{" "}
              <a
                href="/volunteer-register"
                className="text-[#0066cc] font-bold hover:underline"
              >
                Register Now
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[#86868b]">
          <ShieldCheck size={16} />
          <span className="text-[13px] font-medium">
            Secure login with bank-grade encryption
          </span>
        </div>
      </div>
    </main>
  );
};

export default VolunteerLogin;
