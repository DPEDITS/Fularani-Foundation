import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import {
  Users,
  HandHeart,
  Gift,
  Building2,
  Calendar,
  Box,
  Megaphone,
  Briefcase,
  Mail,
  Phone,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Globe,
  Award,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { submitContactForm } from "../services/contactService";

const CSRPartnership = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.email) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await submitContactForm({
        name: form.companyName,
        email: form.email,
        phone: form.phone || "N/A",
        subject: "CSR Partnership Interest",
        message: `CSR Interest Form submitted by ${form.companyName}.`,
      });
      setSuccess(true);
      setForm({ companyName: "", email: "", phone: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const collabWays = [
    {
      title: "Volunteerism",
      desc: "Elevate your team’s spirit by diving into hands-on and virtual volunteering opportunities. From tree-planting to digital mentoring.",
      icon: Users,
      color: "#0071e3", // blue
    },
    {
      title: "Payroll Giving",
      desc: "Empower your employees to contribute a small portion of their salary towards sculpting a better future for children.",
      icon: HandHeart,
      color: "#ff3b30", // rose
    },
    {
      title: "Event Sponsorships",
      desc: "Merge brand visibility with impact by sponsoring our marathons, cyclothons, and community upliftment events.",
      icon: Calendar,
      color: "#ff9f0a", // orange
    },
    {
      title: "Donation Boxes",
      desc: "Place co-branded physical or digital donation boxes at strategic locations to invite collective action.",
      icon: Box,
      color: "#34c759", // green
    },
    {
      title: "Cause-Related Marketing",
      desc: "Intertwine your brand with meaningful causes. A portion of sales can directly support our impactful missions.",
      icon: Megaphone,
      color: "#af52de", // purple
    },
    {
      title: "Adopt a Project",
      desc: "Choose a specific initiative that resonates with your CSR aspirations—be it in education, health, or conservation.",
      icon: Briefcase,
      color: "#55bef0", // cyan
    },
    {
      title: "Corporate Donations",
      desc: "Channel your company’s generosity through one-off or recurring donations to catalyze our programs.",
      icon: Gift,
      color: "#5856d6", // indigo
    },
    {
      title: "Brand Development",
      desc: "Collaborate on unique initiatives that align your brand with social impact and global sustainability goals.",
      icon: Award,
      color: "#ffcc00", // amber
    },
  ];

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[120px] -translate-x-1/2"></div>

      {/* Hero Section */}
      <div className="relative pt-20 md:pt-25 pb-12 md:pb-20 px-4 md:px-6 z-10">
        <div className="max-w-[1200px] mx-auto">
          <Motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center md:text-left"
          >
            <div className="inline-block bg-accent px-3 md:px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-4 md:mb-6">
              Partnership for Growth
            </div>
            <h1 className="text-5xl md:text-8xl lg:text-[90px] font-black text-secondary leading-[0.9] tracking-tighter mb-6 md:mb-10 lowercase">
              Partner for <br />
              <span className="text-white bg-primary px-4 md:px-6 py-1 md:py-2 inline-block -rotate-1 mt-2">
                impactful change.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground leading-tight max-w-[800px] font-bold mb-8 md:mb-12">
              Align your brand with our missions to create sustainable
              developments and transform lives across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-accent hover:bg-accent/80 text-secondary px-8 md:px-12 py-4 md:py-6 rounded-2xl text-base md:text-lg font-black uppercase tracking-tight transition-all shadow-2xl shadow-accent/30 hover:translate-y-[-4px] flex items-center justify-center gap-3 group"
              >
                Collaborate Now
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </a>
            </div>
          </Motion.div>
        </div>
      </div>

      {/* Trust & Stats Section 
      <section className="py-12 md:py-24 px-4 md:px-6 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4 md:mb-8 lowercase">
                Our track <br />
                <span className="text-secondary bg-accent px-3 md:px-4 py-1 inline-block rotate-1 mt-2">
                  record.
                </span>
              </h2>
              <p className="text-lg md:text-xl text-white/60 font-medium leading-tight">
                We work with leading corporates to fulfill their ESG and SDG
                goals through transparent and impactful initiatives.
              </p>
            </div>

            <div className="flex-grow grid grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  label: "Lives Impacted",
                  value: "1.5M+",
                  icon: <Users size={24} />,
                },
                {
                  label: "Corporate Partners",
                  value: "220+",
                  icon: <Building2 size={24} />,
                },
                {
                  label: "States Covered",
                  value: "15+",
                  icon: <Globe size={24} />,
                },
                {
                  label: "SDG Goals Met",
                  value: "12",
                  icon: <ShieldCheck size={24} />,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center lg:items-start group"
                >
                  <div className="text-3xl md:text-6xl font-black text-primary tracking-tighter transition-transform group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Ways to Collaborate */}
      <section className="py-12 md:py-32 bg-white px-4 md:px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center md:text-left mb-12 md:mb-24">
            <h2 className="text-3xl md:text-6xl font-black text-secondary tracking-tighter leading-none mb-4 md:mb-6 lowercase">
              ways to{" "}
              <span className="text-primary italic underline decoration-accent decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">
                collaborate
              </span>
              .
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-bold max-w-2xl leading-tight">
              Every partnership is unique. We offer diverse engagement models to
              suit your brand's CSR objectives.
            </p>
          </div>

          <Motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {collabWays.map((way, idx) => (
              <Motion.div
                key={idx}
                variants={fadeIn}
                className="group p-6 md:p-10 bg-muted/20 rounded-[30px] md:rounded-[40px] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div
                  style={{
                    backgroundColor: `${way.color}15`,
                    color: way.color,
                  }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 transition-all duration-500 group-hover:scale-110"
                >
                  <way.icon size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-secondary mb-2 md:mb-4 lowercase tracking-tight group-hover:text-primary transition-colors">
                  {way.title}
                </h3>
                <p className="text-muted-foreground font-bold leading-tight uppercase text-xs tracking-wider opacity-60">
                  {way.desc}
                </p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* Brand Development / Direct Impact */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto bg-primary text-white p-6 md:p-12 lg:p-24 rounded-[30px] md:rounded-[40px] relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.8] mb-8 md:mb-12 lowercase">
                Brand development through <br />
                <span className="text-secondary bg-accent px-4 md:px-6 py-1 md:py-2 inline-block -rotate-1 mt-2 md:mt-4">
                  compassion.
                </span>
              </h2>
              <p className="text-lg md:text-2xl text-white/80 font-bold leading-tight mb-8 md:mb-12">
                Connect your business objectives with social good. Our team
                ensures that your corporate contributions translate into
                tangible, documented impact.
              </p>

              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-accent">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <div className="font-black text-lg uppercase tracking-tight">
                      Transparent
                    </div>
                    <div className="text-xs text-white/40 font-bold uppercase tracking-widest">
                      Full reporting & Audits
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-accent">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <div className="font-black text-lg uppercase tracking-tight">
                      Scalable
                    </div>
                    <div className="text-xs text-white/40 font-bold uppercase tracking-widest">
                      PAN India Presence
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[440px]">
              <div className="bg-white dark:bg-[#1d1d1f] p-6 text-left md:p-10 rounded-[30px] md:rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/5 relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                
                <AnimatePresence mode="wait">
                  {success ? (
                    <Motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-10"
                    >
                      <div className="w-24 h-24 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                        <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-secondary dark:text-white mb-4 lowercase">Received!</h3>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Our CSR team will review <br /> your request and reach out.
                      </p>
                      <button 
                        onClick={() => setSuccess(false)}
                        className="mt-10 px-8 py-3 rounded-xl text-xs font-black text-primary uppercase tracking-[0.2em] border border-primary hover:bg-primary hover:text-white transition-all"
                      >
                        Send another
                      </button>
                    </Motion.div>
                  ) : (
                    <Motion.div 
                      key="form" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="text-secondary dark:text-white"
                    >
                      <div className="mb-8">
                        <h3 className="text-4xl font-black mb-3 tracking-tighter lowercase">
                          Interest Form
                        </h3>
                        <p className="text-muted-foreground font-bold uppercase text-[11px] tracking-[0.2em] opacity-60">
                          Let's start a conversation
                        </p>
                      </div>

                      {error && (
                        <Motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100 dark:border-red-500/20"
                        >
                          <AlertCircle size={18} />
                          <span className="text-[11px] font-black uppercase tracking-wider">{error}</span>
                        </Motion.div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div className="space-y-1 md:space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Company Name</label>
                          <input
                            type="text"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            placeholder="Your Company Inc."
                            className="w-full h-14 md:h-16 px-4 md:px-6 bg-muted/30 dark:bg-white/5 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 text-secondary dark:text-white text-sm md:text-base"
                          />
                        </div>

                        <div className="space-y-1 md:space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Work Email</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            className="w-full h-14 md:h-16 px-4 md:px-6 bg-muted/30 dark:bg-white/5 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 text-secondary dark:text-white text-sm md:text-base"
                          />
                        </div>

                        <div className="space-y-1 md:space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 00000 00000"
                            className="w-full h-14 md:h-16 px-4 md:px-6 bg-muted/30 dark:bg-white/5 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 text-secondary dark:text-white text-sm md:text-base"
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full h-14 md:h-18 bg-secondary dark:bg-accent dark:text-secondary text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.1em] text-xs md:text-sm shadow-2xl shadow-secondary/20 dark:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Submit Request
                              <ArrowRight size={20} />
                            </>
                          )}
                        </button>
                      </form>
                      
                      <p className="mt-8 text-center text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest leading-relaxed">
                        By submitting, you agree to our <br /> partnership terms and privacy policy.
                      </p>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 md:py-32 bg-white px-4 md:px-6 relative z-10 text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="inline-block bg-accent px-3 md:px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-6 md:mb-8">
            Ready to start?
          </div>
          <h2 className="text-4xl md:text-8xl font-black text-secondary tracking-tighter leading-[0.8] mb-12 md:mb-20 lowercase">
            Let's Build a <br />
            <span className="text-white bg-primary px-4 md:px-6 py-1 md:py-2 inline-block -rotate-1 mt-2 md:mt-4">
              luminous future.
            </span>
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-8 mb-12 md:mb-16">
            <a
              href="mailto:info@fularanifoundation.org"
              className="flex flex-col items-center p-4 sm:p-8 md:p-12 bg-muted/20 rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all group"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary mb-3 sm:mb-4 md:mb-6 transition-all group-hover:bg-primary group-hover:text-white">
                <Mail size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <div className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">
                Email
              </div>
              <div className="text-[13px] sm:text-sm md:text-xl font-black text-secondary break-all sm:break-normal text-center w-full">
                info@fularani.org
              </div>
            </a>
            <a
              href="tel:+917997801001"
              className="flex flex-col items-center p-4 sm:p-8 md:p-12 bg-muted/20 rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all group"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary mb-3 sm:mb-4 md:mb-6 transition-all group-hover:bg-primary group-hover:text-white">
                <Phone size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <div className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">
                Call
              </div>
              <div className="text-[13px] sm:text-sm md:text-xl font-black text-secondary text-center w-full">
                +91 79978 01001
              </div>
            </a>
          </div>

          <p className="text-sm font-black text-secondary/30 uppercase tracking-[0.3em]">
            Average response time: 24h
          </p>
        </div>
      </section>
    </div>
  );
};

export default CSRPartnership;
