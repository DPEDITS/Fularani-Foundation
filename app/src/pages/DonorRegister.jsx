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
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [touched, setTouched] = useState({});

  const totalSteps = role === "donor" ? 2 : 4;

  // Sync role state with URL parameters
  useEffect(() => {
    const roleParam = searchParams.get("role");
    const newRole = roleParam === "volunteer" ? "volunteer" : "donor";

    if (newRole !== role) {
      setRole(newRole);
      setCurrentStep(1);
      setError("");
    }
  }, [searchParams, role]);

  useEffect(() => {
    if (role === "donor" && isAuthenticated()) {
      navigate("/donor-dashboard");
    } else if (role === "volunteer" && isVolunteerAuthenticated()) {
      navigate("/volunteer-dashboard");
    }
  }, [navigate, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
    setError("");
  };

  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  // Validation functions
  const getFieldValidation = (fieldName, value) => {
    if (!touched[fieldName]) return null;

    switch (fieldName) {
      case 'username':
        return value.length >= 3;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'password':
        return value.length >= 6;
      case 'confirmPassword':
        return value === form.password && value.length >= 6;
      case 'phone':
        return value.length >= 10;
      case 'panNumber':
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value);
      case 'skills':
      case 'availabilityHours':
      case 'address':
        return value.trim().length > 0;
      case 'gender':
      case 'dateOfBirth':
        return value !== '';
      default:
        return value.length > 0;
    }
  };

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }

    setForm({ ...form, dateOfBirth: value });
    setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("Avatar file selected - type:", file?.type, "size:", file?.size, "name:", file?.name);

    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      alert("Please choose an image file (jpg, png, etc)");
      return;
    }

    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    // Only validate on step 1, not on other steps
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
    // Clear error and move to next step
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(""); // Clear any errors when going back
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (currentStep < totalSteps) {
      nextStep();
      setLoading(false);
      return;
    }

    try {
      if (currentStep !== totalSteps) return;

      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (avatar) formData.append("avatar", avatar);

      if (role === "donor") {
        // Double check we are on the final step for donor
        if (currentStep !== 2) return;

        if (!form.panNumber?.trim()) {
          setError("PAN Number is required");
          setLoading(false);
          return;
        }
        await registerDonor(formData);
      } else {
        console.log("Submitting volunteer registration...");
        console.log("Avatar state:", avatar);
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }
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
      setError(err.response?.data?.message || err.message || "Registration failed");
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
            {/* Role Switcher */}
            <div className="relative flex items-center bg-muted/20 p-1.5 rounded-2xl mb-8">
              <div
                className={`absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-primary rounded-xl shadow-lg transition-transform duration-300 ${role === "volunteer" ? "translate-x-[calc(100%+12px)]" : ""}`}
              />
              <button
                type="button"
                onClick={() => {
                  setRole("donor");
                  navigate("/donor-register");
                  setCurrentStep(1);
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
                  navigate("/donor-register?role=volunteer");
                  setCurrentStep(1);
                  setError("");
                }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl relative z-10 transition-colors ${role === "volunteer" ? "text-white" : "text-secondary/40"}`}
              >
                Volunteer
              </button>
            </div>

            {error && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    !
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700">
                      {error}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Please check all required fields and try again.
                    </p>
                  </div>
                </div>
              </Motion.div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (currentStep < totalSteps) {
                    nextStep();
                  }
                }
              }}
            >
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
                      label="Username"
                      icon={<User size={18} />}
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      onBlur={() => handleBlur('username')}
                      isValid={getFieldValidation('username', form.username)}
                      placeholder="your_username"
                    />
                    <Field
                      label="Email"
                      icon={<Mail size={18} />}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      isValid={getFieldValidation('email', form.email)}
                      placeholder="you@example.com"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Password"
                        icon={<Lock size={18} />}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                        isValid={getFieldValidation('password', form.password)}
                        placeholder="••••••••"
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
                      isValid={getFieldValidation('panNumber', form.panNumber)}
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
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                        Date of Birth (DD/MM/YYYY)
                      </label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/20" />
                        <input
                          type="text"
                          name="dateOfBirth"
                          value={form.dateOfBirth}
                          onChange={handleDateChange}
                          placeholder="DD/MM/YYYY"
                          maxLength="10"
                          className="w-full h-14 pl-14 pr-5 rounded-2xl bg-muted/20 border-none outline-none font-black text-base placeholder:text-gray-300 transition-all focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
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
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
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
                      label="Skills (comma-separated)"
                      icon={<Target size={18} />}
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="Teaching, Cooking, IT, etc"
                      required
                    />
                    <Field
                      label="Availability (hours/week)"
                      icon={<Target size={18} />}
                      name="availabilityHours"
                      value={form.availabilityHours}
                      onChange={handleChange}
                      placeholder="10"
                      type="number"
                      required
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
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2">
                        Profile Picture *
                      </label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-2xl p-6 bg-muted/10 transition-all hover:border-primary group">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-primary shadow-lg"
                          />
                        ) : (
                          <Camera size={32} className="text-secondary/30 mb-3 group-hover:text-primary transition-colors" />
                        )}
                        <label className="cursor-pointer">
                          <span className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">
                            {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleAvatarChange}
                            accept="image/*"
                            required
                          />
                        </label>
                        <p className="text-[9px] text-secondary/40 mt-2 uppercase tracking-wider">Required • JPG/PNG</p>
                      </div>
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
                  to={
                    role === "donor"
                      ? "/donor-login"
                      : "/donor-login?role=volunteer"
                  }
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

const Field = ({ label, icon, toggleShow, isShowing, isValid, ...props }) => {
  const getBorderColor = () => {
    if (isValid === null || isValid === undefined) return 'border-transparent';
    return isValid ? 'border-green-500' : 'border-red-500';
  };

  return (
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
          className={`w-full h-14 pl-14 ${toggleShow ? "pr-14" : "pr-5"} rounded-2xl bg-muted/20 border-2 ${getBorderColor()} outline-none font-black text-base placeholder:text-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary/10`}
        />
        {toggleShow && (
          <button
            type="button"
            onClick={toggleShow}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/30"
          >
            {isShowing ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

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
