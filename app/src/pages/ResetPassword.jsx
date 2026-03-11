import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Loader2, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { resetPasswordDonor } from "../services/donorService";
import { resetPasswordVolunteer } from "../services/volunteerService";

const ResetPassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "donor";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (role === "volunteer") {
        await resetPasswordVolunteer(token, password);
      } else {
        await resetPasswordDonor(token, password);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate(role === "volunteer" ? "/volunteer-login" : "/donor-login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link might be expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0"></div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-[450px] p-8 md:p-10 rounded-[40px] shadow-2xl relative z-10"
      >
        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-secondary mb-2 lowercase tracking-tighter">
              Password Saved!
            </h3>
            <p className="text-secondary/60 text-sm font-bold">
              Your password has been reset successfully. Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-3xl font-black text-secondary mb-2 lowercase tracking-tighter">
                Set New Password
              </h3>
              <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                Please enter your new password below.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-normal">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 px-6 rounded-xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em] ml-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 px-6 rounded-xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-secondary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Save Password <Zap size={14} className="fill-accent text-accent" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </Motion.div>
    </div>
  );
};

export default ResetPassword;
