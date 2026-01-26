"use client";
import { useState } from "react";
import headerImg from "../assets/logindonor.svg";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Heart } from "lucide-react";

const DonorRegister = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Donor Register Data:", form);
    };

    const isNameValid = form.name.length > 2;
    const isEmailValid = form.email.includes("@") && form.email.includes(".");
    const isPasswordValid = form.password.length >= 6;
    const isConfirmValid = form.confirmPassword === form.password && form.confirmPassword.length > 0;

    return (
        <main className="min-h-screen md:h-screen flex items-start justify-center px-4 md:px-8 lg:px-12 pt-26 pb-1 overflow-auto md:overflow-hidden">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px] md:max-h-[85vh]">

                {/* LEFT SIDE: Brand & Visuals */}
                <div className="relative bg-gradient-to-br from-red-600 to-rose-600 p-10 md:p-12 flex flex-col justify-start gap-4 text-white overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                    {/* Content */}
                    <div className="relative z-10 text-center md:text-left">

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 -mt-6">
                            Join Us as a<br />Donor
                        </h1>
                        <div className="h-1.5 w-35 bg-black rounded-full mb-6 mx-auto md:mx-0" />

                        <p className="text-red-50 text-lg leading-relaxed max-w-sm mx-auto md:mx-0 mb-0">
                            Become a part of our family. registered donors can track their impact and receive regular updates on our missions.
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
                <div className="p-6 md:p-8 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto space-y-3">

                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-bold text-gray-900 -mt-4">Donor Registration</h2>
                            <p className="text-gray-500 mt-2">Create your account to start donating</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">

                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
                                        ${form.name
                                            ? isNameValid ? "text-green-600" : "text-red-500"
                                            : "text-gray-400"}`}
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none
                                            transition-all duration-300
                                            ${form.name
                                                ? isNameValid
                                                    ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                    : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
                    ${form.email
                                            ? isEmailValid ? "text-green-600" : "text-red-500"
                                            : "text-gray-400"}`}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="you@example.com"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none
                      transition-all duration-300
                      ${form.email
                                                ? isEmailValid
                                                    ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                    : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
                                        ${form.password
                                            ? isPasswordValid ? "text-green-600" : "text-red-500"
                                            : "text-gray-400"}`}
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className={`w-full pl-12 pr-12 py-3 rounded-xl border outline-none
                                            transition-all duration-300
                                            ${form.password
                                                ? isPasswordValid
                                                    ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                    : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300
                                        ${form.confirmPassword
                                            ? isConfirmValid ? "text-green-600" : "text-red-500"
                                            : "text-gray-400"}`}
                                    />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className={`w-full pl-12 pr-12 py-3 rounded-xl border outline-none
                                            transition-all duration-300
                                            ${form.confirmPassword
                                                ? isConfirmValid
                                                    ? "border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20"
                                                    : "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20"
                                                : "border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-gray-300"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="group w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gray-900 to-black text-white font-medium
                hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5
                transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                            >
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="text-center text-sm text-gray-500">
                                Already have an account?{" "}
                                <a href="/donor-login" className="text-red-600 hover:text-red-700 font-semibold hover:underline">
                                    Login
                                </a>
                            </div>

                            <div className="relative flex items-center justify-center mt-6">
                                <div className="absolute w-full border-t border-gray-200"></div>
                                <span className="relative bg-white px-3 text-sm text-gray-400">Or continue with</span>
                            </div>

                            <button
                                type="button"
                                className="w-full md:w-9 md:h-9 py-3 px-4 md:p-0 rounded-xl md:rounded-full border border-gray-200 flex items-center justify-center gap-3 md:gap-0 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 md:mx-auto"
                            >
                                <svg className="w-6 h-6 md:w-6 md:h-6" viewBox="0 0 24 24">
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
                                <span className="text-gray-700 font-medium md:hidden">Google</span>
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default DonorRegister;
