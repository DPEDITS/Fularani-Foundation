"use client";
import { useState } from "react";
import headerImg from "../assets/logindonor.svg";
import { Mail, Lock, Heart, ArrowRight, Eye, EyeOff } from "lucide-react";

const DonorLogin = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Donor Login Data:", form);
    };

    const isEmailValid = form.email.includes("@") && form.email.includes(".");
    const isPasswordValid = form.password.length >= 6;

    return (
        <main className="min-h-screen flex items-start justify-center px-4 md:px-8 lg:px-12 pt-26 pb-1">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px]">

                {/* LEFT SIDE: Brand & Visuals */}
                <div className="relative bg-gradient-to-br from-red-600 to-rose-600 p-10 md:p-12 flex flex-col justify-between text-white overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                    {/* Content */}
                    <div className="relative z-10 text-center md:text-left">


                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 -mt-6">
                            Welcome Back,<br />Donor
                        </h1>
                       <div className="h-1.5 w-35 bg-black rounded-full mb-6 mx-auto md:mx-0" />

                        <p className="text-red-50 text-lg leading-relaxed max-w-sm">
                            Your generosity drives our mission. Sign in to manage your contributions and see the impact you're making.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8 flex justify-center md:justify-start">
                        <img
                            src={headerImg}
                            alt="Fularani Foundation"
                            className="w-64 rounded-xl shadow-lg transform md:group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* RIGHT SIDE: Login Form */}
                <div className="p-10 md:p-14 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto space-y-8">

                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-900">Donor Login</h2>
                            <p className="text-gray-500 mt-2">Enter your details to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

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

                            {/* Links */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="text-gray-600 group-hover:text-gray-800">Remember me</span>
                                </label>
                                <a href="/forgot-password" className="text-red-600 hover:text-red-700 font-medium hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="group w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gray-900 to-black text-white font-medium
                hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5
                transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="text-center text-sm text-gray-500">
                                Don't have an account?{" "}
                                <a href="/donor-register" className="text-red-600 hover:text-red-700 font-semibold hover:underline">
                                    Register Now
                                </a>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default DonorLogin;
