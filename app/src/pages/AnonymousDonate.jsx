import { Link } from "react-router-dom";
import { motion as Motion } from "motion/react";
import { ChevronLeft, QrCode, ShieldAlert, ReceiptText } from "lucide-react";
import qrCode from "../assets/qrcode.jpeg";

const AnonymousDonate = () => {
  return (
    <div className="h-screen bg-white relative overflow-hidden flex flex-col">
      <div className="absolute inset-y-0 right-0 w-1/3 bg-primary/5 -skew-x-12 translate-x-1/3" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 flex-1 min-h-0 px-6 pt-20 pb-8 md:pt-24 md:pb-10 overflow-hidden">
        <div className="mx-auto max-w-6xl h-full min-h-0">
          <Link
            to="/donor-login"
            className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            <ChevronLeft size={16} /> back to donor login
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start h-full min-h-0">
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 min-h-0"
            >
              <p className="text-[12px] font-black uppercase tracking-[0.35em] text-primary">
                direct upi donation
              </p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-secondary leading-[0.95] lowercase">
                donate without
                <span className="ml-3 inline-block -rotate-1 bg-primary px-4 py-2 text-white">
                  login
                </span>
              </h1>
              <p className="max-w-xl text-base md:text-lg font-bold leading-relaxed text-secondary/70">
                Anyone can donate instantly by scanning the UPI QR code below.
                This flow is meant for anonymous contributions where speed is
                more important than donor account access.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-secondary/10 bg-white p-5 shadow-lg">
                  <ShieldAlert className="mb-4 text-primary" size={24} />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-secondary">
                    anonymous disclaimer
                  </h2>
                  <p className="mt-3 text-sm font-bold leading-6 text-secondary/70">
                    If you donate anonymously, you will not receive any donation
                    receipt from this flow.
                  </p>
                </div>

                <div className="rounded-[28px] border border-secondary/10 bg-white p-5 shadow-lg">
                  <ReceiptText className="mb-4 text-primary" size={24} />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-secondary">
                    need a receipt?
                  </h2>
                  <p className="mt-3 text-sm font-bold leading-6 text-secondary/70">
                    Please login as a donor and complete your donation from your
                    account if you want receipt support.
                  </p>
                </div>
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 }}
              className="rounded-[40px] border border-secondary/10 bg-white p-6 md:p-8 shadow-2xl overflow-hidden max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar"
            >
              <div className="rounded-[32px] border-2 border-dashed border-primary/25 bg-primary/5 p-8 text-center">
                <div className="mx-auto flex h-64 w-full max-w-[320px] items-center justify-center rounded-[28px] border border-primary/15 bg-white shadow-inner">
                  <div className="space-y-3 text-center">
                    <p className="px-6 text-sm font-bold text-secondary/60">
                      <img src={qrCode} alt="" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] bg-secondary px-6 py-5 text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-white/70">
                  important note
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-white/90">
                  Donations made through this anonymous QR path are treated as
                  anonymous contributions. For a receipt-enabled donation
                  journey, return to the donor login and pay after signing in.
                </p>
              </div>
            </Motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousDonate;
