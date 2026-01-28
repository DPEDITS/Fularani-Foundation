import React from "react";
import { motion } from "motion/react";
import {
  Download,
  Eye,
  HelpCircle,
  Heart,
  Users,
  TrendingUp,
  HandHeart,
} from "lucide-react";
import aboutHero from "../assets/about-hero.png";

const About = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const teamMembers = [
    {
      name: "Mr. Raja Monsingh",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "L. Charles",
      role: "Managing Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Sarah Johnson",
      role: "Director of Operations",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Michael Chen",
      role: "Head of Outreach",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Priya Patel",
      role: "Community Manager",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "David Wilson",
      role: "Volunteer Coordinator",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutHero}
            alt="Community support"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60 mix-blend-multiply" />
        </div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-1 mt-3 inline-block"
          >
            <span className="py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wider uppercase ">
              About Thaagam Foundation
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Together, We Can Make a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">
              Difference.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto">
            Join us in our mission to bring hope, dignity, and sustainable
            change to communities in need.
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-16 z-20 container mx-auto px-4 pb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeIn}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-6 hover:translate-y-[-5px] transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Users size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                115.94 Lakhs+
              </h3>
              <p className="text-gray-600 font-medium">
                Beneficiaries Impacted
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-6 hover:translate-y-[-5px] transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Heart size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                ₹43.46 Crores+
              </h3>
              <p className="text-gray-600 font-medium">Total Donated</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mission Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-rose-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
              <img
                src={aboutHero} // Using the hero image as the main detail image too, or could use another
                alt="Our Mission"
                className="rounded-3xl shadow-2xl relative z-10 w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs hidden md:block">
                <p className="text-gray-800 font-semibold italic">
                  "Hope does not end with immediate relief but continues to grow
                  within the communities we serve."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Your Impact Begins with{" "}
                <span className="text-rose-600">Thaagam Foundation</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At Thaagam Foundation, our journey begins with a simple yet
                  powerful belief:{" "}
                  <strong className="text-gray-900">
                    every individual deserves dignity, care, and an opportunity
                    to thrive.
                  </strong>{" "}
                  What started as a compassionate response to human suffering
                  has grown into a mission-driven organization dedicated to
                  creating lasting social impact.
                </p>
                <p>
                  Through our work in humanitarian aid and community
                  empowerment, we stand beside vulnerable individuals and
                  families, addressing urgent needs while nurturing pathways
                  toward long-term stability and self-reliance. Each initiative
                  we implement is thoughtfully planned to create sustainable
                  change.
                </p>
                <p>
                  Equally important to us is the experience of those who walk
                  this journey with us. We are committed to making your
                  involvement meaningful, transparent, and impactful—whether you
                  support us through donations, volunteering, or partnerships.
                  Backed by a responsive support team and a strong commitment to
                  accountability, Thaagam Foundation ensures that every act of
                  generosity translates into real, measurable change.
                </p>
              </div>

              <div className="mt-10">
                <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl flex items-center gap-3">
                  <HandHeart size={20} />
                  Join Our Mission
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-20 bg-rose-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                fill="currentColor"
                className="text-white"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <HelpCircle className="text-rose-200 w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Have Questions?
            </h2>
            <p className="text-xl text-rose-100 max-w-2xl mx-auto mb-10">
              We’ll help you choose how you want to make a difference. Whether
              it's volunteering, donating, or partnering, we're here to guide
              you.
            </p>
            <button className="bg-white text-rose-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-colors shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform duration-200">
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-rose-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              Our Leadership
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet our team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join THAAGAM FOUNDATION to help provide meals, essential items,
              educational support, medical aid, blankets for the needy, and tree
              planting events.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group relative overflow-hidden rounded-3xl h-[400px]"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-rose-300 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold mb-6">
                  <TrendingUp size={16} />
                  <span>Annual Reports</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Transparency that Builds Trust
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Explore Thaagam Foundation’s Annual Reports to see the impact
                  we've created together. Our reports provide a detailed
                  overview of our financials, initiatives, and the lives we've
                  touched.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                    <Eye size={18} />
                    View Report
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-900 transition-colors">
                    <Download size={18} />
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-48 h-64 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-r-2xl border-l-[12px] border-rose-500 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mb-6">
                      <TrendingUp className="text-rose-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Annual Report
                    </h4>
                    <p className="text-sm text-gray-500">2024-2025</p>
                  </div>
                  <div className="absolute bottom-0 w-full bg-gray-50 p-4 text-center text-xs font-medium text-gray-500">
                    Thaagam Foundation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
