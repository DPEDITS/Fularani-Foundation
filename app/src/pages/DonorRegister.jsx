"use client";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Phone,
  Calendar,
  MapPin,
  ChevronLeft,
  Camera,
  CheckCircle2,
  Target,
} from "lucide-react";
import { registerDonor, isAuthenticated } from "../services/donorService";
import {
  registerVolunteer,
  isVolunteerAuthenticated,
} from "../services/volunteerService";

const DonorRegister = () => {
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
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    panNumber: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
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
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = role === "donor" ? 2 : 4;

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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (
        !form.username ||
        !form.email ||
        !form.password ||
        form.password !== form.confirmPassword
      ) {
        setError("Please check your basic credentials");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    setError("");
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (avatar) formData.append("avatar", avatar);

      if (role === "donor") {
        await registerDonor(formData);
      } else {
        await registerVolunteer(formData);
      }
      setSuccess(true);
      setTimeout(
        () =>
          navigate(
            role === "donor" ? "/donor-login" : "/donor-login?role=volunteer",
          ),
        2000,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <Motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
            <CheckCircle2 className="text-secondary" size={40} />
          </div>
          <h2 className="text-5xl font-black text-secondary tracking-tighter lowercase mb-2">
            Welcome aboard!
          </h2>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Setting up your mission...
          </p>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[100px] -translate-x-1/4"></div>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10 pt-12 pb-12">
        <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Dynamic Branding & Progress */}
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
                Join the <br />
                <span className="text-white bg-primary px-6 py-2 inline-block -rotate-1 mt-2">
                  Mission.
                </span>
              </h1>

              <div className="pt-4 space-y-4">
                <p className="text-[14px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                  {role === "donor"
                    ? "donor registration"
                    : "volunteer registration"}
                </p>
                <div className="flex items-center gap-6">
                  <div className="h-[1px] w-20 bg-secondary/10"></div>
                  <span className="text-primary font-black text-2xl tracking-tighter">
                    Step {currentStep}{" "}
                    <span className="text-secondary/20">/ {totalSteps}</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xl text-muted-foreground font-bold leading-tight max-w-[400px]">
              {role === "donor"
                ? "Your small contribution can light up a child's future."
                : "Your hands-on dedication is the backbone of our change on the ground."}
            </p>
          </Motion.div>

          {/* Right Side: Compact Form Card */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-10 rounded-[48px] shadow-2xl border border-secondary/5 relative overflow-hidden max-w-[500px] mx-auto lg:mr-0 lg:ml-auto"
          >
            {/* Progress Bar (Mobile) */}
            <div className="lg:hidden flex items-center justify-between mb-8">
              <Link to="/" className="text-primary">
                <ChevronLeft size={20} />
              </Link>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            <div className="flex p-1 bg-muted/30 rounded-2xl mb-8 relative">
              <div
                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-500 ease-out ${role === "volunteer" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}`}
              />
              <button
                onClick={() => {
                  setRole("donor");
                  setCurrentStep(1);
                }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl relative z-10 transition-colors ${role === "donor" ? "text-primary" : "text-secondary/40"}`}
              >
                Donor
              </button>
              <button
                onClick={() => {
                  setRole("volunteer");
                  setCurrentStep(1);
                }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl relative z-10 transition-colors ${role === "volunteer" ? "text-primary" : "text-secondary/40"}`}
              >
                Volunteer
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 lowercase">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <Motion.div
                    key="1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <Field
                      label="Full Name"
                      icon={<User size={18} />}
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                    <Field
                      label="Email"
                      icon={<Mail size={18} />}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@mission.org"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Password"
                        icon={<Lock size={18} />}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••"
                        toggleShow={() => setShowPassword(!showPassword)}
                        isShowing={showPassword}
                      />
                      <Field
                        label="Confirm"
                        icon={<Lock size={18} />}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••"
                        toggleShow={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        isShowing={showConfirmPassword}
                      />
                    </div>
                  </Motion.div>
                )}

                {currentStep === 2 && role === "donor" && (
                  <Motion.div
                    key="donor2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <Field
                      label="PAN Number"
                      icon={<FileText size={18} />}
                      name="panNumber"
                      value={form.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                    />
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-3xl p-8 transition-colors hover:border-primary/20 group">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          className="w-20 h-20 rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-secondary/20 mb-4">
                          <Camera size={32} />
                        </div>
                      )}
                      <label className="text-[11px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline">
                        Upload Avatar
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleAvatarChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </Motion.div>
                )}

                {currentStep === 2 && role === "volunteer" && (
                  <Motion.div
                    key="vol2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <Field
                      label="Phone"
                      icon={<Phone size={18} />}
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 0000000000"
                    />
                    <Field
                      label="Date of Birth"
                      icon={<Calendar size={18} />}
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      placeholder="YYYY-MM-DD"
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full h-14 px-4 rounded-2xl bg-muted/20 border-none outline-none font-black text-base appearance-none cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </Motion.div>
                )}

                {currentStep === 3 && role === "volunteer" && (
                  <Motion.div
                    key="vol3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <Field
                      label="Address"
                      icon={<MapPin size={18} />}
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Your City, District"
                    />
                    <Field
                      label="PAN Number"
                      icon={<FileText size={18} />}
                      name="panNumber"
                      value={form.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                    />
                    <Field
                      label="Preferred Areas"
                      icon={<Target size={18} />}
                      name="preferredAreas"
                      value={form.preferredAreas}
                      onChange={handleChange}
                      placeholder="Education, Green, etc"
                    />
                  </Motion.div>
                )}

                {currentStep === 4 && role === "volunteer" && (
                  <Motion.div
                    key="vol4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                        Motivation
                      </label>
                      <textarea
                        name="motivation"
                        value={form.motivation}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-5 rounded-2xl bg-muted/20 border-none outline-none font-black text-base resize-none"
                        placeholder="What drives you to join us?"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-2xl p-6">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          className="w-16 h-16 rounded-full object-cover mb-4"
                        />
                      ) : (
                        <Camera size={28} className="text-muted mb-4" />
                      )}
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer">
                        Add Photo
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleAvatarChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 h-14 bg-muted/20 text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-muted/40 transition-all"
                  >
                    Back
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] h-14 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] h-14 bg-accent text-secondary rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-accent/20 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Complete <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center pt-2">
              <p className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">
                Already registered?{" "}
                <Link
                  to="/donor-login"
                  className="text-primary hover:underline underline-offset-4 decoration-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Motion.div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, icon, toggleShow, isShowing, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/20 flex items-center">
        {icon}
      </div>
      <input
        {...props}
        className={`w-full h-14 pl-14 ${toggleShow ? "pr-14" : "pr-5"} rounded-2xl bg-muted/20 border-none outline-none font-black text-base placeholder:text-gray-300 transition-all focus:ring-2 focus:ring-primary/10`}
      />
      {toggleShow && (
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
        >
          {isShowing ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  </div>
);

const FileText = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

export default DonorRegister;
