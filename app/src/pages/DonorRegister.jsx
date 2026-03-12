"use client";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
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
  ChevronDown,
  ShieldCheck,
  AlertCircle,
  BadgeCheck,
  FileText,
  Zap,
} from "lucide-react";
import { registerDonor, isAuthenticated, verifyPAN, googleAuthDonor, completePanVerification } from "../services/donorService";
import {
  registerVolunteer,
  isVolunteerAuthenticated,
  verifyPAN as verifyPANVolunteer,
  googleAuthVolunteer,
} from "../services/volunteerService";
import GoogleSignInButton from "../components/GoogleSignInButton";

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
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  // PAN Verification State
  const [panVerified, setPanVerified] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);
  const [panHolderName, setPanHolderName] = useState("");
  const [panError, setPanError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Check for Google PAN completion mode
  const isGooglePanMode = searchParams.get("googlePan") === "true";
  // Check for Google pre-filled volunteer data
  const googleName = searchParams.get("googleName");
  const googleEmail = searchParams.get("googleEmail");

  // Pre-fill form with Google data if available
  useEffect(() => {
    if (googleName || googleEmail) {
      setForm((prev) => ({
        ...prev,
        username: googleName || prev.username,
        email: googleEmail || prev.email,
      }));
    }
  }, [googleName, googleEmail]);

  // If in Google PAN mode (donor), skip to step 2
  useEffect(() => {
    if (isGooglePanMode && role === "donor") {
      setCurrentStep(2);
    }
  }, [isGooglePanMode, role]);

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
      safeNavigate(navigate, "/donor-dashboard");
    } else if (role === "volunteer" && isVolunteerAuthenticated()) {
      safeNavigate(navigate, "/volunteer-dashboard");
    }
  }, [navigate, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Remove immediate touched marking to prevent red borders while typing
    // setTouched({ ...touched, [name]: true });
    setError("");

    // Reset PAN verification status when PAN number or DOB changes
    if (name === "panNumber" || name === "dateOfBirth") {
      setPanVerified(false);
      setPanHolderName("");
      setPanError("");
    }
  };

  // PAN Verification Handler
  const handleVerifyPAN = async () => {
    const pan = form.panNumber?.trim().toUpperCase();
    if (!pan) {
      setPanError("Please enter a PAN number");
      return;
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      setPanError("Invalid PAN format. Expected: ABCDE1234F");
      return;
    }

    // Validate DOB is provided
    if (!form.dateOfBirth?.trim()) {
      setPanError("Please enter your Date of Birth first");
      return;
    }

    setPanVerifying(true);
    setPanError("");
    setPanHolderName("");
    setPanVerified(false);

    try {
      // Call PAN Lite API — pass username for name matching + DOB for DOB matching
      const verifyFn = role === "volunteer" ? verifyPANVolunteer : verifyPAN;
      const response = await verifyFn(pan, form.username, form.dateOfBirth);
      if (response?.data?.isValid) {
        setPanVerified(true);
        setPanHolderName(response.data.holderName || "Verified");
        setPanError("");
      } else {
        setPanVerified(false);
        setPanError(response?.message || "PAN verification failed — the PAN number is invalid");
      }
    } catch (err) {
      setPanVerified(false);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "PAN verification service unavailable. Please try again.";
      setPanError(errMsg);
    } finally {
      setPanVerifying(false);
    }
  };

  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  // Validation functions
  const getFieldValidation = (fieldName, value) => {
    if (!touched[fieldName]) return null;

    switch (fieldName) {
      case "username":
        return value.length >= 3;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "password":
        return value.length >= 6;
      case "confirmPassword":
        return value === form.password && value.length >= 6;
      case "phone":
        return value.length >= 10;
      case "panNumber":
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value);
      case "skills":
      case "availabilityHours":
      case "address":
        return value.trim().length > 0;
      case "gender":
      case "dateOfBirth":
        return value !== "";
      default:
        return value.length > 0;
    }
  };

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "/" + value.slice(5, 9);
    }

    setForm({ ...form, dateOfBirth: value });
    setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    // Validate file type
    if (file && !file.type.startsWith("image/")) {
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

      // Include PAN verification status in form data
      formData.append("panVerified", panVerified);
      formData.append("panHolderName", panHolderName || "");
      if (avatar) formData.append("avatar", avatar);

      if (role === "donor") {
        // Double check we are on the final step for donor
        if (currentStep !== 2) return;

        if (!form.panNumber?.trim()) {
          setError("PAN Number is required");
          setLoading(false);
          return;
        }
        if (!panVerified) {
          setError("Please verify your PAN number before completing registration");
          setLoading(false);
          return;
        }
        await registerDonor(formData);
      } else {
        // Volunteer also requires PAN verification
        if (!panVerified) {
          setError("Please verify your PAN number before completing registration");
          setLoading(false);
          return;
        }
        await registerVolunteer(formData);
      }
      setSuccess(true);
      setTimeout(
        () =>
          safeNavigate(
            navigate,
            role === "donor" ? "/donor-dashboard" : "/volunteer-dashboard",
          ),
        2000,
      );
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle PAN completion for Google-signed-up donors
  const handleGooglePanComplete = async () => {
    if (!form.panNumber?.trim()) {
      setError("PAN Number is required");
      return;
    }
    if (!panVerified) {
      setError("Please verify your PAN number first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await completePanVerification({
        panNumber: form.panNumber,
        panVerified: true,
        panHolderName: panHolderName,
        username: form.username,
      });
      setSuccess(true);
      setTimeout(() => safeNavigate(navigate, "/donor-dashboard"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "PAN verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In handler for register page
  const handleGoogleSuccess = async (credential) => {
    setGoogleLoading(true);
    setError("");
    try {
      if (role === "donor") {
        const result = await googleAuthDonor(credential);
        if (result.data?.needsPanVerification || result.needsPanVerification) {
          // Account created, now collect PAN
          setCurrentStep(2);
          // Update URL to reflect PAN mode
          safeNavigate(navigate, "/donor-register?googlePan=true");
        } else {
          setSuccess(true);
          setTimeout(() => safeNavigate(navigate, "/donor-dashboard"), 2000);
        }
      } else {
        const result = await googleAuthVolunteer(credential);
        if (result.data?.isNewUser) {
          // Pre-fill form with Google data
          const profile = result.data.googleProfile;
          setForm((prev) => ({
            ...prev,
            username: profile.name || prev.username,
            email: profile.email || prev.email,
          }));
          if (profile.picture) {
            setAvatarPreview(profile.picture);
          }
        } else {
          setSuccess(true);
          setTimeout(() => safeNavigate(navigate, "/volunteer-dashboard"), 2000);
        }
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
    <div className="bg-[#f8fafc] min-h-screen flex flex-col overflow-hidden relative font-sans selection:bg-primary/20">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] z-0 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] z-0"></div>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10 py-16">
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
              <div className="space-y-1">
                <h1 className="text-4xl xl:text-6xl font-bold text-secondary tracking-tight leading-[1.1]">
                  Join the <br />
                  <span className="text-primary italic font-serif">Movement.</span>
                </h1>
                <div className="w-12 h-1 bg-primary rounded-full"></div>
              </div>

              <div className="pt-1 space-y-3">
                <p className="text-[11px] font-bold text-primary/60 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-primary/30"></span>
                  {role === "donor"
                    ? "Donor Registration"
                    : "Volunteer Registration"}
                </p>
                <div className="space-y-4 pt-2">
                  {(role === "donor"
                    ? [
                      { id: 1, title: "Account", desc: "Credentials" },
                      { id: 2, title: "Personal", desc: "Details" },
                    ]
                    : [
                      { id: 1, title: "Account", desc: "Credentials" },
                      { id: 2, title: "Basic Info", desc: "Personal" },
                      { id: 3, title: "Skills", desc: "Expertise" },
                      { id: 4, title: "Final", desc: "Motivation" },
                    ]
                  ).map((step, index, arr) => (
                    <div key={step.id} className="flex gap-4 relative group">
                      {/* Connecting Line */}
                      {index !== arr.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-[-18px] w-[1.5px] bg-secondary/5 rounded-full overflow-hidden">
                          <Motion.div
                            initial={{ height: "0%" }}
                            animate={{
                              height: currentStep > step.id ? "100%" : "0%",
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full bg-primary"
                          />
                        </div>
                      )}

                      {/* Step Indicator */}
                      <Motion.div
                        initial={false}
                        animate={{
                          backgroundColor:
                            currentStep >= step.id
                              ? "var(--color-primary)"
                              : "var(--color-muted)",
                          scale: currentStep === step.id ? 1.05 : 1,
                          opacity: currentStep < step.id ? 0.3 : 1,
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg relative z-10 ${currentStep >= step.id ? "shadow-primary/30" : ""}`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <span className="font-bold text-sm">{step.id}</span>
                        )}
                      </Motion.div>

                      {/* Step Content */}
                      <div
                        className={`pt-1 transition-opacity duration-300 ${currentStep === step.id ? "opacity-100" : "opacity-40"}`}
                      >
                        <h4 className="text-sm font-bold uppercase tracking-wider text-secondary">
                          {step.title}
                        </h4>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-start gap-4 p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-white max-w-[400px] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Zap size={20} />
                  </div>
                  <p className="text-base text-secondary/70 font-medium leading-relaxed">
                    {role === "donor"
                      ? "Your small contribution can light up a child's future."
                      : "Your hands-on dedication is the backbone of our change."}
                  </p>
                </div>
              </div>
            </div>
          </Motion.div>

              {/* Right Side: Compact Form Card */}
              <Motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden w-full max-w-[480px] mx-auto lg:mr-0 lg:ml-auto"
              >
                {/* Soft background glow for the card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Role Switcher */}
                <div className="relative flex items-center bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100/50">
                  <div
                    className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-primary rounded-[10px] shadow-md shadow-primary/20 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${role === "volunteer" ? "translate-x-[calc(100%+8px)]" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRole("donor");
                      safeNavigate(navigate, "/donor-register");
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
                      safeNavigate(navigate, "/donor-register?role=volunteer");
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
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.6">
                        !
                      </div>
                      <div className="flex-1 mt-0.6">
                        <p className="text-sm font-bold text-red-700">{error}</p>
                      </div>
                    </div>
                  </Motion.div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isGooglePanMode && role === "donor") {
                      handleGooglePanComplete();
                    } else {
                      handleSubmit(e);
                    }
                  }}
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
                        className="space-y-4"
                      >
                        {/* Google Sign-Up Button */}
                        <div className="mb-0 min-h-[44px]">
                          {googleLoading ? (
                            <div className="w-full h-12 flex items-center justify-center bg-muted/20 rounded-2xl">
                              <Loader2 className="w-5 h-5 animate-spin text-primary" />
                              <span className="ml-2 text-xs font-bold text-secondary/60 uppercase tracking-wider">Signing up with Google...</span>
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

                        {/* Divider */}
                        <div className="flex items-center gap-4 py-1">
                          <div className="flex-1 h-[1px] bg-secondary/10"></div>
                          <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-[0.2em]">or</span>
                          <div className="flex-1 h-[1px] bg-secondary/10"></div>
                        </div>

                        <Field
                          label="Username (Name on PAN)"
                          icon={<User size={18} />}
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          onBlur={() => handleBlur("username")}
                          isValid={getFieldValidation("username", form.username)}
                          placeholder="JOHN DOE"
                        />
                        <Field
                          label="Email"
                          icon={<Mail size={18} />}
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={() => handleBlur("email")}
                          isValid={getFieldValidation("email", form.email)}
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
                            onBlur={() => handleBlur("password")}
                            isValid={getFieldValidation("password", form.password)}
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
                        {/* Date of Birth Field */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                            Date of Birth (as on PAN)
                          </label>
                          <div className="relative">
                            <Calendar
                              size={18}
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/20"
                            />
                            <input
                              type="text"
                              name="dateOfBirth"
                              value={form.dateOfBirth}
                              onChange={handleDateChange}
                              onBlur={() => handleBlur("dateOfBirth")}
                              placeholder="DD/MM/YYYY"
                              maxLength="10"
                              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none font-black text-base placeholder:text-gray-300 transition-all"
                            />
                          </div>
                        </div>

                        {/* PAN Number with Cashfree Verification */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                            PAN Number
                          </label>
                          <div className="relative">
                            <FileText
                              size={18}
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/20"
                            />
                            <input
                              type="text"
                              name="panNumber"
                              value={form.panNumber}
                              onChange={handleChange}
                              onBlur={() => handleBlur("panNumber")}
                              placeholder="ABCDE1234F"
                              maxLength="10"
                              className={`w-full h-14 pl-14 pr-32 rounded-2xl bg-muted/20 outline-none font-black text-base uppercase placeholder:normal-case placeholder:text-gray-300 transition-all focus:ring-2 focus:ring-primary/10 ${panVerified
                                ? "border-2 border-green-500 ring-2 ring-green-100"
                                : panError
                                  ? "border-2 border-red-400 ring-2 ring-red-50"
                                  : "border-none"
                                }`}
                            />
                            {/* Verify Button */}
                            <button
                              type="button"
                              onClick={handleVerifyPAN}
                              disabled={panVerifying || panVerified || form.panNumber.length < 10}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${panVerified
                                ? "bg-green-100 text-green-700 cursor-default"
                                : panVerifying
                                  ? "bg-primary/10 text-primary/50 cursor-wait"
                                  : form.panNumber.length >= 10
                                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "bg-muted/30 text-secondary/20 cursor-not-allowed"
                                }`}
                            >
                              {panVerifying ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : panVerified ? (
                                <span className="flex items-center gap-1">
                                  <BadgeCheck size={14} /> Verified
                                </span>
                              ) : (
                                "Verify"
                              )}
                            </button>
                          </div>

                          {/* PAN Verification Feedback */}
                          <AnimatePresence mode="wait">
                            {panVerified && panHolderName && (
                              <Motion.div
                                key="pan-success"
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl"
                              >
                                <ShieldCheck size={18} className="text-green-600 shrink-0" />
                                <div>
                                  <p className="text-xs font-black text-green-800 uppercase tracking-wide">
                                    PAN Verified
                                  </p>
                                  <p className="text-sm font-bold text-green-700 mt-0.5">
                                    {panHolderName}
                                  </p>
                                </div>
                              </Motion.div>
                            )}
                            {panError && (
                              <Motion.div
                                key="pan-error"
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl"
                              >
                                <AlertCircle size={18} className="text-red-500 shrink-0" />
                                <p className="text-xs font-bold text-red-600">
                                  {panError}
                                </p>
                              </Motion.div>
                            )}
                          </AnimatePresence>
                        </div>
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
                            <Calendar
                              size={18}
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/20"
                            />
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
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                            Gender
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setIsGenderDropdownOpen(!isGenderDropdownOpen)
                              }
                              className={`w-full h-14 px-6 rounded-2xl bg-muted/20 border-2 transition-all flex items-center justify-between font-black text-base ${isGenderDropdownOpen ? "border-primary ring-2 ring-primary/5" : "border-transparent text-secondary"}`}
                            >
                              <span
                                className={
                                  form.gender ? "text-secondary" : "text-gray-300"
                                }
                              >
                                {form.gender
                                  ? form.gender.charAt(0).toUpperCase() +
                                  form.gender.slice(1)
                                  : "Select Gender"}
                              </span>
                              <ChevronDown
                                size={20}
                                className={`text-secondary/20 transition-transform duration-300 ${isGenderDropdownOpen ? "rotate-180" : ""}`}
                              />
                            </button>

                            {isGenderDropdownOpen && (
                              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-secondary/5 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {["male", "female", "other"].map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                      setForm({ ...form, gender: option });
                                      setIsGenderDropdownOpen(false);
                                      setError("");
                                    }}
                                    className={`w-full px-6 py-4 text-left text-sm font-black transition-all hover:bg-primary hover:text-white lowercase tracking-tight ${form.gender === option ? "bg-primary/5 text-primary" : "text-secondary/70"}`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
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
                        {/* PAN Number with Cashfree Verification (Volunteer) */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                            PAN Number
                          </label>
                          <div className="relative">
                            <FileText
                              size={18}
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/20"
                            />
                            <input
                              type="text"
                              name="panNumber"
                              value={form.panNumber}
                              onChange={handleChange}
                              onBlur={() => handleBlur("panNumber")}
                              placeholder="ABCDE1234F"
                              maxLength="10"
                              className={`w-full h-14 pl-14 pr-32 rounded-2xl bg-muted/20 outline-none font-black text-base uppercase placeholder:normal-case placeholder:text-gray-300 transition-all focus:ring-2 focus:ring-primary/10 ${panVerified
                                ? "border-2 border-green-500 ring-2 ring-green-100"
                                : panError
                                  ? "border-2 border-red-400 ring-2 ring-red-50"
                                  : "border-none"
                                }`}
                            />
                            <button
                              type="button"
                              onClick={handleVerifyPAN}
                              disabled={panVerifying || panVerified || form.panNumber.length < 10}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${panVerified
                                ? "bg-green-100 text-green-700 cursor-default"
                                : panVerifying
                                  ? "bg-primary/10 text-primary/50 cursor-wait"
                                  : form.panNumber.length >= 10
                                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "bg-muted/30 text-secondary/20 cursor-not-allowed"
                                }`}
                            >
                              {panVerifying ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : panVerified ? (
                                <span className="flex items-center gap-1">
                                  <BadgeCheck size={14} /> Verified
                                </span>
                              ) : (
                                "Verify"
                              )}
                            </button>
                          </div>

                          <AnimatePresence mode="wait">
                            {panVerified && panHolderName && (
                              <Motion.div
                                key="pan-success"
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl"
                              >
                                <ShieldCheck size={18} className="text-green-600 shrink-0" />
                                <div>
                                  <p className="text-xs font-black text-green-800 uppercase tracking-wide">
                                    PAN Verified
                                  </p>
                                  <p className="text-sm font-bold text-green-700 mt-0.5">
                                    {panHolderName}
                                  </p>
                                </div>
                              </Motion.div>
                            )}
                            {panError && (
                              <Motion.div
                                key="pan-error"
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl"
                              >
                                <AlertCircle size={18} className="text-red-500 shrink-0" />
                                <p className="text-xs font-bold text-red-600">
                                  {panError}
                                </p>
                              </Motion.div>
                            )}
                          </AnimatePresence>
                        </div>
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
                            className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-secondary text-base resize-none focus:ring-2 focus:ring-primary/10 transition-all"
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
                              <Camera
                                size={32}
                                className="text-secondary/30 mb-3 group-hover:text-primary transition-colors"
                              />
                            )}
                            <label className="cursor-pointer">
                              <span className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">
                                {avatarPreview ? "Change Photo" : "Upload Photo"}
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={handleAvatarChange}
                                accept="image/*"
                                required
                              />
                            </label>
                            <p className="text-[9px] text-secondary/40 mt-2 uppercase tracking-wider">
                              Required • JPG/PNG
                            </p>
                          </div>
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4 pt-4">
                    {currentStep > 1 && !isGooglePanMode && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 h-14 bg-slate-50 text-secondary border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                      >
                        Back
                      </button>
                    )}
                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-[2] h-14 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98]"
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

      const Field = ({label, icon, toggleShow, isShowing, isValid, ...props }) => {
  const getBorderColor = () => {
    if (isValid === null || isValid === undefined) return "border-transparent";
      return isValid ? "border-green-500" : "border-red-500";
  };

      return (
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em] ml-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/20 flex items-center">
            {icon}
          </div>
          <input
            {...props}
            className={`w-full h-14 pl-14 ${toggleShow ? "pr-14" : "pr-5"} rounded-2xl bg-slate-50 border border-slate-100 ${getBorderColor()} outline-none font-semibold text-secondary text-base placeholder:text-slate-300 transition-all duration-300 focus:ring-2 focus:ring-primary/10`}
          />
          {toggleShow && (
            <button
              type="button"
              onClick={toggleShow}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors hover:text-primary"
            >
              {isShowing ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
      );
};

      export default DonorRegister;
