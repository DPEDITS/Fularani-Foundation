"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import headerImg from "../assets/logindonor.svg";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  FileText,
  Loader2,
  Phone,
  Calendar,
  MapPin,
  UserCircle,
  Wrench,
  Clock,
  Target,
  Edit3,
  Camera,
} from "lucide-react";
import { registerDonor, isAuthenticated } from "../services/donorService";
import { registerVolunteer, isVolunteerAuthenticated } from "../services/volunteerService";

const DonorRegister = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(() => {
    return window.location.pathname.includes("volunteer") ? "volunteer" : "donor";
  });
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    panNumber: "",
    // Volunteer specific fields
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

  const totalSteps = role === "donor" ? 2 : 4;

  // Redirect if already logged in
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (role === "volunteer") {
      if (!avatar) {
        setError("Profile picture is required for volunteers");
        return;
      }
      if (!form.phone || !form.gender || !form.dateOfBirth || !form.address) {
        setError("Please fill in all required personal details");
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("panNumber", form.panNumber);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      if (role === "donor") {
        await registerDonor(formData);
        setSuccess(true);
        setTimeout(() => {
          navigate("/donor-login");
        }, 2000);
      } else {
        // Volunteer specific fields
        formData.append("phone", form.phone);
        formData.append("gender", form.gender.toLowerCase());

        // Format date to dd/mm/yyyy for backend regex if needed, 
        // but backend also handles Date objects if it's matched.
        // Let's send it in a way the backend likes.
        const [year, month, day] = form.dateOfBirth.split("-");
        formData.append("dateOfBirth", `${day}/${month}/${year}`);

        formData.append("address", form.address);
        formData.append("idType", form.idType);

        // Split strings into arrays for backend
        form.skills.split(",").forEach(skill => {
          formData.append("skills", skill.trim());
        });

        form.preferredAreas.split(",").forEach(area => {
          formData.append("preferredAreas", area.trim());
        });

        formData.append("availabilityHours", form.availabilityHours);
        formData.append("motivation", form.motivation);

        if (avatar) {
          formData.append("avatar", avatar);
        }

        await registerVolunteer(formData);
        setSuccess(true);
        setTimeout(() => {
          navigate("/volunteer-login");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isUsernameValid = form.username.length >= 3;
  const isEmailValid = form.email.includes("@") && form.email.includes(".");
  const isPasswordValid = form.password.length >= 6;
  const isConfirmValid =
    form.confirmPassword === form.password && form.confirmPassword.length > 0;
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
    form.panNumber.toUpperCase(),
  );

  // Volunteer specific validations
  const isPhoneValid = form.phone.length >= 10;
  const isGenderValid = form.gender !== "";
  const isDobValid = form.dateOfBirth !== "";
  const isAddressValid = form.address.length >= 5;
  const isPreferredAreasValid = form.preferredAreas.length > 0;
  const isSkillsValid = form.skills.length > 0;
  const isAvailabilityValid = form.availabilityHours !== "";
  const isMotivationValid = form.motivation.length > 5;

  const nextStep = () => {
    if (currentStep === 1) {
      if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
        setError("Please fill in all account details correctly");
        return;
      }
    }
    if (currentStep === 2 && role === "volunteer") {
      if (!form.phone || !form.gender || !form.dateOfBirth) {
        setError("Please fill in your personal details");
        return;
      }
    }
    if (currentStep === 3 && role === "volunteer") {
      if (!form.address || !form.preferredAreas || !isPanValid) {
        setError("Please fill in your location, preferences, and valid PAN number");
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

  return (
    <main className="min-h-screen md:h-screen flex items-start justify-center px-4 md:px-8 lg:px-12 pb-1 overflow-auto md:overflow-hidden">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px] md:max-h-[85vh]">
        {/* LEFT SIDE: Brand & Visuals */}
        <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 p-10 md:p-12 flex flex-col justify-start gap-4 text-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 -mt-6">
              Join Us as a<br />
              {role === "donor" ? "Donor" : "Volunteer"}
            </h1>
            <div className="h-1.5 w-35 bg-black rounded-full mb-6 mx-auto md:mx-0" />

            <p className="text-red-50 text-lg leading-relaxed max-w-sm mx-auto md:mx-0 mb-0">
              {role === "donor"
                ? "Become a part of our family. registered donors can track their impact and receive regular updates on our missions."
                : "Become a changemaker. Join our community of volunteers and contribute your skills to our various missions."}
            </p>
          </div>

          <div className="relative z-10 flex justify-center md:justify-start">
            <img
              src={headerImg}
              alt="Fularani Foundation"
              className="w-60 rounded-xl shadow-lg transform md:group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* RIGHT SIDE: Register Form */}
        <div className="p-6 md:p-8 flex flex-col justify-start md:py-10 bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto space-y-3">
            {/* ROLE TOGGLE - Integrated into original UI style */}
            <div className="flex p-1 bg-gray-50 rounded-xl mb-2 relative">
              <div
                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out border border-gray-100 ${role === "volunteer" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}`}
              />
              <button
                onClick={() => setRole("donor")}
                className={`flex-1 py-3 text-xs font-bold rounded-lg relative z-10 transition-colors duration-300 ${role === "donor" ? "text-emerald-600" : "text-gray-500"}`}
              >
                Donor
              </button>
              <button
                onClick={() => setRole("volunteer")}
                className={`flex-1 py-3 text-xs font-bold rounded-lg relative z-10 transition-colors duration-300 ${role === "volunteer" ? "text-emerald-600" : "text-gray-500"}`}
              >
                Volunteer
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {[...Array(totalSteps)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full transition-all duration-300 ${currentStep > i ? "bg-emerald-600 w-12" : "bg-gray-200"
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                {currentStep === 1 && "Account Setup"}
                {currentStep === 2 && (role === "donor" ? "Additional Info" : "Personal Info")}
                {currentStep === 3 && (role === "volunteer" ? "Location & Preferences" : "")}
                {currentStep === 4 && "Volunteer Profile"}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                {currentStep === 1 && "Start with your basic credentials"}
                {currentStep === 2 && (role === "donor" ? "Final details for your account" : "Basic details about yourself")}
                {currentStep === 3 && (role === "volunteer" ? "Where and how you'd like to help" : "")}
                {currentStep === 4 && "Define how you want to contribute"}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium animate-shake">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-xs font-medium">
                Registration successful! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Username Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">
                      Username
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 ${form.username ? (isUsernameValid ? "text-green-600" : "text-red-500") : "text-gray-400"}`} />
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                        placeholder="johndoe123"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 disabled:opacity-50 ${isUsernameValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 ${form.email ? (isEmailValid ? "text-green-600" : "text-red-500") : "text-gray-400"}`} />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                        placeholder="you@example.com"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 disabled:opacity-50 ${isEmailValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                      />
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Password</label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-3.5 w-4 h-4 transition-colors duration-300 ${form.password ? (isPasswordValid ? "text-green-600" : "text-red-500") : "text-gray-400"}`} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          disabled={loading || success}
                          placeholder="••••••"
                          className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm transition-all duration-300 disabled:opacity-50 ${isPasswordValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 outline-none">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Confirm</label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-3.5 w-4 h-4 transition-colors duration-300 ${form.confirmPassword ? (isConfirmValid ? "text-green-600" : "text-red-500") : "text-gray-400"}`} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                          disabled={loading || success}
                          placeholder="••••••"
                          className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm transition-all duration-300 disabled:opacity-50 ${isConfirmValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 outline-none">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  {role === "donor" ? (
                    <div className="space-y-1">
                      <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="relative group cursor-pointer">
                          <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-rose-400">
                            {avatarPreview ? (
                              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <Camera className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Picture (Optional)</span>
                      </div>

                      <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">
                        PAN Number (Required for 80G)
                      </label>
                      <div className="relative">
                        <FileText className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 ${form.panNumber ? (isPanValid ? "text-green-600" : "text-red-500") : "text-gray-400"}`} />
                        <input
                          type="text"
                          name="panNumber"
                          value={form.panNumber}
                          onChange={handleChange}
                          required
                          disabled={loading || success}
                          placeholder="ABCDE1234F"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none uppercase transition-all duration-300 disabled:opacity-50 ${isPanValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="relative group cursor-pointer">
                          <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-400">
                            {avatarPreview ? (
                              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <Camera className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Picture</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={form.phone}
                              onChange={handleChange}
                              required
                              placeholder="9876543210"
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${isPhoneValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Gender</label>
                          <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 bg-white ${isGenderValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${isDobValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {currentStep === 3 && role === "volunteer" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder="Street, City, State, Zip"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${isAddressValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Preferred Areas</label>
                    <div className="relative">
                      <Target className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="preferredAreas"
                        value={form.preferredAreas}
                        onChange={handleChange}
                        required
                        placeholder="Education, Healthcare, Environment..."
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${isPreferredAreasValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">PAN Number (Required)</label>
                    <div className="relative">
                      <FileText className={`absolute left-4 top-3.5 w-4 h-4 transition-colors duration-300 ${form.panNumber ? (isPanValid ? "text-green-600" : "text-red-500") : "text-gray-400"}`} />
                      <input
                        type="text"
                        name="panNumber"
                        value={form.panNumber}
                        onChange={handleChange}
                        required
                        placeholder="ABCDE1234F"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none uppercase transition-all duration-300 ${isPanValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && role === "volunteer" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Skills</label>
                      <div className="relative">
                        <Wrench className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="skills"
                          value={form.skills}
                          onChange={handleChange}
                          placeholder="Teaching, Design..."
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${isSkillsValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Hours/Week</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          name="availabilityHours"
                          value={form.availabilityHours}
                          onChange={handleChange}
                          placeholder="5"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${isAvailabilityValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Motivation</label>
                    <div className="relative">
                      <Edit3 className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="motivation"
                        value={form.motivation}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Why do you want to join us?"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 resize-none ${isMotivationValid ? "border-green-500 bg-green-50/20 focus:ring-4 focus:ring-green-500/10" : "border-red-500 bg-red-50/20 focus:ring-4 focus:ring-red-500/10"}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3.5 px-4 rounded-xl border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    Back
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] py-3.5 px-4 rounded-xl bg-gray-900 text-white font-bold hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="flex-[2] py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Finish Signup</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href={role === "donor" ? "/donor-login" : "/volunteer-login"}
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                >
                  Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DonorRegister;
