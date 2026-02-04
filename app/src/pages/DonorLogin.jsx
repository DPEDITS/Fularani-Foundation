"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import headerImg from "../assets/logindonor.svg";
import {
  Mail,
  Lock,
  Heart,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { loginDonor, isAuthenticated } from "../services/donorService";
import {
  loginVolunteer,
  isVolunteerAuthenticated,
} from "../services/volunteerService";

const DonorLogin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(() => {
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
    setError(""); // Clear error on input change
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
    <main className="min-h-screen md:h-screen flex items-start justify-center px-4 md:px-8 lg:px-12 overflow-auto md:overflow-hidden ">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px] md:max-h-[85vh]">
        {/* LEFT SIDE: Brand & Visuals */}
        <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 p-10 md:p-12 flex flex-col justify-start gap-4 text-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 -mt-6">
              Welcome Back,
              <br />
              {role === "donor" ? "Donor" : "Volunteer"}
            </h1>
            <div className="h-1.5 w-35 bg-black rounded-full mb-6 mx-auto md:mx-0" />

            <p className="text-emerald-50 text-lg leading-relaxed max-w-sm mx-auto md:mx-0">
              {role === "donor"
                ? "Your generosity drives our mission. Sign in to manage your contributions and see the impact you're making."
                : "Your dedication changes lives. Sign in to track your volunteer hours and upcoming missions."}
            </p>
          </div>

          <div className="relative z-10 mt-4 flex justify-center md:justify-start">
            <img
              src={headerImg}
              alt="Fularani Foundation"
              className="w-60 rounded-xl shadow-lg transform md:group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="p-6 md:p-8 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto space-y-4">
            {/* ROLE TOGGLE */}
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

            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-900 -mt-2">
                {role === "donor" ? "Donor Login" : "Volunteer Login"}
              </h2>
              <p className="text-gray-500 mt-2">
                Enter your details to access your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    disabled={loading}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none
                      transition-all duration-300 disabled:opacity-50
                      ${
                        isEmailValid
                          ? "border-green-500 bg-green-50 focus:ring-4 focus:ring-green-500/10"
                          : "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-500/10"
                      }`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
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
                    disabled={loading}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border outline-none
                                            transition-all duration-300 disabled:opacity-50
                                            ${
                                              isPasswordValid
                                                ? "border-green-500 bg-green-50 focus:ring-4 focus:ring-green-500/10"
                                                : "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-500/10"
                                            }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-600 group-hover:text-gray-800">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gray-900 to-black text-white font-medium
                hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5
                transition-all duration-300 flex items-center justify-center gap-2
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <a
                  href="/donor-register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                >
                  Register Now
                </a>
              </div>
              <div className="relative flex items-center justify-center mt-2">
                <div className="absolute w-full border-t border-gray-200"></div>
                <span className="relative bg-white px-3 text-sm text-gray-400">
                  Or continue with
                </span>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={loading}
                  className="w-9 h-9 p-0 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DonorLogin;
