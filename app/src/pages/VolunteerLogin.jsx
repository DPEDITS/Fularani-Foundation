"use client";
import { useState } from "react";
import headerImg from "../assets/logindonor.svg";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const VolunteerLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Volunteer Login Data:", form);
  };

  const isEmailValid = form.email.includes("@") && form.email.includes(".");
  const isPasswordValid = form.password.length >= 6;

  return (
    <main className="min-h-screen md:h-screen flex items-start justify-center px-4 md:px-8 lg:px-12 pt-26 overflow-auto md:overflow-hidden">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px] md:max-h-[85vh]">

        {/* LEFT SIDE */}
        <div className="relative bg-gradient-to-br from-pink-400 to-rose-600 p-10 md:p-12 flex flex-col justify-between text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 -mt-6">
              Welcome Back,<br />Volunteer
            </h1>
            <div className="h-1.5 w-35 bg-black rounded-full mb-6" />
            <p className="text-red-50 text-lg max-w-sm">
              Your service creates change. Log in to continue your volunteering journey.
            </p>
          </div>

          <img src={headerImg} alt="Volunteer" className="w-64 rounded-xl shadow-lg" />
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-8">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">Volunteer Login</h2>
              <p className="text-gray-500 mt-2">
                Enter your details to access your volunteer account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-3.5 w-5 h-5 ${
                    form.email
                      ? isEmailValid ? "text-green-600" : "text-red-500"
                      : "text-gray-400"
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-12 py-3 rounded-xl border"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-sm text-gray-500">
                New Volunteer?{" "}
                <a href="/volunteer-register" className="text-red-600 font-semibold">
                  Register Now
                </a>
              </p>

              {/* Google Button – SAME */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-full border-t border-gray-200"></div>
                <span className="relative bg-white px-3 text-sm text-gray-400">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-3 hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-6 h-6"
                />
                <span className="font-medium text-gray-700">Google</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </main>
  );
};

export default VolunteerLogin;
