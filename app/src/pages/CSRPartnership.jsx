import React from "react";
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
} from "lucide-react";

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
      <div className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-[1200px] mx-auto">
          <Motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center md:text-left"
          >
            <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-6">
              Partnership for Growth
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-secondary leading-[0.9] tracking-tighter mb-10 lowercase">
              Partner for <br />
              <span className="text-white bg-primary px-6 py-2 inline-block -rotate-1 mt-2">
                impactful change.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-tight max-w-[800px] font-bold mb-12">
              Align your brand with our missions to create sustainable
              developments and transform lives across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-accent hover:bg-accent/80 text-secondary px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-tight transition-all shadow-2xl shadow-accent/30 hover:translate-y-[-4px] flex items-center justify-center gap-3 group"
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

      {/* Trust & Stats Section */}
      <section className="py-24 px-6 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8 lowercase">
                Our track <br />
                <span className="text-secondary bg-accent px-4 py-1 inline-block rotate-1 mt-2">
                  record.
                </span>
              </h2>
              <p className="text-xl text-white/60 font-medium leading-tight">
                We work with leading corporates to fulfill their ESG and SDG
                goals through transparent and impactful initiatives.
              </p>
            </div>

            <div className="flex-grow grid grid-cols-2 gap-8">
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
                  <div className="text-4xl md:text-6xl font-black text-primary tracking-tighter transition-transform group-hover:scale-110">
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

      {/* Ways to Collaborate */}
      <section className="py-32 bg-white px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center md:text-left mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter leading-none mb-6 lowercase">
              ways to{" "}
              <span className="text-primary italic underline decoration-accent decoration-8 underline-offset-8">
                collaborate
              </span>
              .
            </h2>
            <p className="text-xl text-muted-foreground font-bold max-w-2xl leading-tight">
              Every partnership is unique. We offer diverse engagement models to
              suit your brand's CSR objectives.
            </p>
          </div>

          <Motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {collabWays.map((way, idx) => (
              <Motion.div
                key={idx}
                variants={fadeIn}
                className="group p-10 bg-muted/20 rounded-[40px] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div
                  style={{
                    backgroundColor: `${way.color}15`,
                    color: way.color,
                  }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110"
                >
                  <way.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-secondary mb-4 lowercase tracking-tight group-hover:text-primary transition-colors">
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
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto bg-primary text-white p-12 md:p-24 rounded-[40px] relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.8] mb-12 lowercase">
                Brand development through <br />
                <span className="text-secondary bg-accent px-6 py-2 inline-block -rotate-1 mt-4">
                  compassion.
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 font-bold leading-tight mb-12">
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

            <div className="w-full lg:w-[400px]">
              <div className="bg-white p-10 rounded-[32px] shadow-2xl relative">
                <h3 className="text-3xl font-black text-secondary mb-2 tracking-tight lowercase">
                  Interest Form
                </h3>
                <p className="text-muted-foreground font-bold mb-8 uppercase text-[10px] tracking-widest">
                  Let's start a conversation
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full h-14 px-6 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="Work Email"
                    className="w-full h-14 px-6 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:text-gray-400"
                  />
                  <button className="w-full h-16 bg-secondary text-white rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-secondary/10 hover:bg-black transition-all mt-4">
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-32 bg-white px-6 relative z-10 text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-8">
            Ready to start?
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-secondary tracking-tighter leading-[0.8] mb-20 lowercase">
            Let's Build a <br />
            <span className="text-white bg-primary px-6 py-2 inline-block -rotate-1 mt-4">
              luminous future.
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <a
              href="mailto:info@fularanifoundation.org"
              className="flex flex-col items-center p-12 bg-muted/20 rounded-[40px] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transition-all group-hover:bg-primary group-hover:text-white">
                <Mail size={28} />
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                Email Us
              </div>
              <div className="text-xl font-black text-secondary">
                info@fularani.org
              </div>
            </a>
            <a
              href="tel:+917997801001"
              className="flex flex-col items-center p-12 bg-muted/20 rounded-[40px] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transition-all group-hover:bg-primary group-hover:text-white">
                <Phone size={28} />
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                Call Us
              </div>
              <div className="text-xl font-black text-secondary">
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
