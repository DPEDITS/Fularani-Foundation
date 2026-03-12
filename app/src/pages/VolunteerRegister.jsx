"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  ShieldCheck,
  Phone,
  Calendar,
  MapPin,
  Target,
  Loader2,
} from "lucide-react";
import { registerVolunteer, googleAuthVolunteer } from "../services/volunteerService";
import GoogleSignInButton from "../components/GoogleSignInButton";

const VolunteerRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    panNumber: "",
    idType: "PAN",
    skills: "",
    availabilityHours: "",
    preferredAreas: "",
    motivation: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "/" + value.slice(5, 9);
    }

    setForm({ ...form, dateOfBirth: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (avatar) formData.append("avatar", avatar);

      await registerVolunteer(formData);
      safeNavigate(navigate, "/donor-login?role=volunteer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isNameValid = form.username.length > 2;
  const isEmailValid = form.email.includes("@") && form.email.includes(".");
  const isPasswordValid = form.password.length >= 6;
  const isConfirmValid =
    form.confirmPassword === form.password && form.confirmPassword.length > 0;
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Sign-In handler
  const handleGoogleSuccess = async (credential) => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await googleAuthVolunteer(credential);
      if (result.data?.isNewUser) {
        // Pre-fill form with Google data
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
        err.response?.data?.message || "Google sign-up failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorMsg) => {
    setError(errorMsg || "Google sign-up failed");
  };

  return (
    <main className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-black/5">
            <Users size={32} className="text-[#0071e3]" />
          </div>
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight mb-2">
            Volunteer Signup
          </h1>
          <p className="text-[17px] text-[#86868b] font-medium">
            Join our community of changemakers.
          </p>
        </div>

        <div className="apple-card p-8 md:p-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Password
              </label>
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

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 0000000000"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full h-14 px-4 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Date of Birth (DD/MM/YYYY)
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type="text"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleDateChange}
                  required
                  placeholder="DD/MM/YYYY"
                  maxLength="10"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Your City, District"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                PAN Number
              </label>
              <input
                type="text"
                name="panNumber"
                value={form.panNumber}
                onChange={handleChange}
                required
                placeholder="ABCDE1234F"
                className="w-full h-14 px-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Skills (comma-separated)
              </label>
              <div className="relative">
                <Target
                  className="absolute left-4 top-4 text-[#86868b]"
                  size={20}
                />
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  required
                  placeholder="Teaching, Cooking, IT"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Availability (hours/week)
              </label>
              <input
                type="number"
                name="availabilityHours"
                value={form.availabilityHours}
                onChange={handleChange}
                required
                placeholder="10"
                className="w-full h-14 px-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Preferred Areas (optional)
              </label>
              <input
                type="text"
                name="preferredAreas"
                value={form.preferredAreas}
                onChange={handleChange}
                placeholder="Education, Green, etc"
                className="w-full h-14 px-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Motivation (optional)
              </label>
              <textarea
                name="motivation"
                value={form.motivation}
                onChange={handleChange}
                rows="3"
                placeholder="Why do you want to volunteer?"
                className="w-full p-4 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">
                Profile Picture *
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#0071e3]/30 rounded-2xl p-6 bg-[#f5f5f7] transition-all hover:border-[#0071e3] group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[#0071e3]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#e5e5e7] flex items-center justify-center mb-4 group-hover:bg-[#d1d1d6] transition-colors">
                    <User className="text-[#86868b]" size={40} />
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="text-sm font-bold text-[#0071e3] hover:underline">
                    {avatarPreview ? "Change Photo" : "Upload Photo"}
                  </span>
                  <input
                    type="file"
                    onChange={handleAvatarChange}
                    accept="image/*"
                    required
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-[#86868b] mt-2">
                  Required • JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1d1d1f] text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group pt-1"
            >
              {loading ? "Creating Account..." : "Create Account"}
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
                  <span className="ml-2 text-sm font-bold text-[#86868b]">Signing up with Google...</span>
                </div>
              ) : (
                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  disabled={loading}
                  text="signup_with"
                />
              )}
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[15px] text-[#86868b] font-medium">
              Already have an account?{" "}
              <a
                href="/volunteer-login"
                className="text-[#0066cc] font-bold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[#86868b]">
          <ShieldCheck size={16} />
          <span className="text-[13px] font-medium">
            Secure registration with bank-grade encryption
          </span>
        </div>
      </div>
    </main>
  );
};

export default VolunteerRegister;
