"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Users, ShieldCheck, Phone, Calendar, MapPin, Target } from "lucide-react";
import { registerVolunteer } from "../services/volunteerService";

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
    motivation: ""
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
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
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
      navigate("/donor-login?role=volunteer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isNameValid = form.username.length > 2;
  const isEmailValid = form.email.includes("@") && form.email.includes(".");
  const isPasswordValid = form.password.length >= 6;
  const isConfirmValid = form.confirmPassword === form.password && form.confirmPassword.length > 0;

  return (
    <main className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-black/5">
            <Users size={32} className="text-[#0071e3]" />
          </div>
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight mb-2">Volunteer Signup</h1>
          <p className="text-[17px] text-[#86868b] font-medium">Join our community of changemakers.</p>
        </div>

        <div className="apple-card p-8 md:p-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Gender</label>
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Date of Birth (DD/MM/YYYY)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">PAN Number</label>
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Skills (comma-separated)</label>
              <div className="relative">
                <Target className="absolute left-4 top-4 text-[#86868b]" size={20} />
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Availability (hours/week)</label>
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Preferred Areas (optional)</label>
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Motivation (optional)</label>
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
              <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Profile Picture *</label>
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
                    {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                  </span>
                  <input
                    type="file"
                    onChange={handleAvatarChange}
                    accept="image/*"
                    required
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-[#86868b] mt-2">Required • JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1d1d1f] text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group pt-1"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full border-t border-black/5"></div>
              <span className="relative bg-white px-4 text-[13px] text-[#86868b] font-medium uppercase tracking-widest">or</span>
            </div>

            <button
              type="button"
              className="w-full h-14 bg-[#f5f5f7] text-[#1d1d1f] rounded-2xl font-bold hover:bg-[#ecece5] transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[15px] text-[#86868b] font-medium">
              Already have an account?{" "}
              <a href="/volunteer-login" className="text-[#0066cc] font-bold hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[#86868b]">
          <ShieldCheck size={16} />
          <span className="text-[13px] font-medium">Secure registration with bank-grade encryption</span>
        </div>
      </div>
    </main>
  );
};

export default VolunteerRegister;