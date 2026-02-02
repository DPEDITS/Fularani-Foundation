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
} from "lucide-react";
import { registerDonor, isAuthenticated } from "../services/donorService";

const DonorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    panNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/donor-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Backend expects username, email, password, panNumber
      // Using FormData because the service/backend supports avatar (even if optional)
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("panNumber", form.panNumber);

      await registerDonor(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/donor-login");
      }, 2000);
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

  return (
    <main className="min-h-screen md:h-screen flex items-start justify-center px-4 md:px-8 lg:px-12 pt-26 pb-1 overflow-auto md:overflow-hidden">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px] md:max-h-[85vh]">
        {/* LEFT SIDE: Brand & Visuals */}
        <div className="relative bg-gradient-to-br from-pink-400 to-rose-600 p-10 md:p-12 flex flex-col justify-start gap-4 text-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 -mt-6">
              Join Us as a<br />
              Donor
            </h1>
            <div className="h-1.5 w-35 bg-black rounded-full mb-6 mx-auto md:mx-0" />

            <p className="text-red-50 text-lg leading-relaxed max-w-sm mx-auto md:mx-0 mb-0">
              Become a part of our family. registered donors can track their
              impact and receive regular updates on our missions.
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
        <div className="p-6 md:p-8 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto space-y-3">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-900 -mt-4">
                Donor Registration
              </h2>
              <p className="text-gray-500 mt-2">
                Create your account to start donating
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                Registration successful! Redirecting to login...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Username Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Username
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
                                        ${
                                          form.username
                                            ? isUsernameValid
                                              ? "text-green-600"
                                              : "text-red-500"
                                            : "text-gray-400"
                                        }`}
                  />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                    placeholder="johndoe123"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none
                                            transition-all duration-300 disabled:opacity-50
                                            ${
                                              form.username
                                                ? isUsernameValid
                                                  ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                  : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                            }`}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
                    ${
                      form.email
                        ? isEmailValid
                          ? "text-green-600"
                          : "text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none
                      transition-all duration-300 disabled:opacity-50
                      ${
                        form.email
                          ? isEmailValid
                            ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                            : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                      }`}
                  />
                </div>
              </div>

              {/* PAN Number Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  PAN Number (Required for 80G)
                </label>
                <div className="relative">
                  <FileText
                    className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
                                        ${
                                          form.panNumber
                                            ? isPanValid
                                              ? "text-green-600"
                                              : "text-red-500"
                                            : "text-gray-400"
                                        }`}
                  />
                  <input
                    type="text"
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                    placeholder="ABCDE1234F"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none
                                            transition-all duration-300 uppercase disabled:opacity-50
                                            ${
                                              form.panNumber
                                                ? isPanValid
                                                  ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                  : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                            }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-4 top-3.5 w-4 h-4 transition-colors duration-300
                                            ${
                                              form.password
                                                ? isPasswordValid
                                                  ? "text-green-600"
                                                  : "text-red-500"
                                                : "text-gray-400"
                                            }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={loading || success}
                      placeholder="••••••"
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm
                                                transition-all duration-300 disabled:opacity-50
                                                ${
                                                  form.password
                                                    ? isPasswordValid
                                                      ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                      : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                    : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                                }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-4 top-3.5 w-4 h-4 transition-colors duration-300
                                            ${
                                              form.confirmPassword
                                                ? isConfirmValid
                                                  ? "text-green-600"
                                                  : "text-red-500"
                                                : "text-gray-400"
                                            }`}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading || success}
                      placeholder="••••••"
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm
                                                transition-all duration-300 disabled:opacity-50
                                                ${
                                                  form.confirmPassword
                                                    ? isConfirmValid
                                                      ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                      : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                    : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                                }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="group w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gray-900 to-black text-white font-medium
                hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5
                transition-all duration-300 flex items-center justify-center gap-2 mt-2
                disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href="/donor-login"
                  className="text-red-600 hover:text-red-700 font-semibold hover:underline"
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
