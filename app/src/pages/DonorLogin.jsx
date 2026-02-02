"use client";
import { useState } from "react";
import { Mail, Lock, Heart, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

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
        <main className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 pt-32 pb-20">
            <div className="max-w-[440px] w-full">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-black/5">
                        <Heart size={32} className="text-[#0071e3]" fill="#0071e3" />
                    </div>
                    <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight mb-2">Donor Sign In</h1>
                    <p className="text-[17px] text-[#86868b] font-medium">Welcome back. Your support means everything.</p>
                </div>

                <div className="apple-card p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="Enter your email"
                                    className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[14px] font-bold text-[#1d1d1f] uppercase tracking-tight">Password</label>
                                <a href="/forgot-password" size="sm" className="text-[13px] text-[#0066cc] font-medium hover:underline">
                                    Forgot password?
                                </a>
                            </div>
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

                        <button
                            type="submit"
                            className="w-full h-14 bg-[#0071e3] text-white rounded-2xl font-bold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 group"
                        >
                            Sign In
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
                            Don't have an account?{" "}
                            <a href="/donor-register" className="text-[#0066cc] font-bold hover:underline">
                                Register Now
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-[#86868b]">
                    <ShieldCheck size={16} />
                    <span className="text-[13px] font-medium">Secure login with bank-grade encryption</span>
                </div>
            </div>
        </main>
    );
};

export default DonorLogin;
