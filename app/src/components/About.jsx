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

const About = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } },
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
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "L. Charles",
      role: "Managing Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Sarah Johnson",
      role: "Director of Operations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    },
  ];

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[980px] mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="text-[#0071e3] font-semibold text-[17px] mb-4 block tracking-tight">
              About Fularani Foundation
            </span>
            <h1 className="text-[48px] md:text-[72px] font-bold text-[#1d1d1f] leading-[1.05] tracking-tight mb-8">
              Enabling change. <br />
              <span className="text-[#86868b]">For everyone, everywhere.</span>
            </h1>
            <p className="text-[21px] md:text-[24px] text-[#86868b] leading-relaxed max-w-[700px] mx-auto font-medium">
              We believe every individual deserves dignity, care, and the opportunity
              to thrive. Our mission is to bridge the gap between hope and reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards - Apple Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="apple-card p-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-[40px] md:text-[48px] font-bold text-[#1d1d1f] leading-none mb-2">10,000+</h3>
            <p className="text-[17px] text-[#86868b] font-medium tracking-wide uppercase">Lives Impacted</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="apple-card p-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mb-6">
              <Heart size={32} />
            </div>
            <h3 className="text-[40px] md:text-[48px] font-bold text-[#1d1d1f] leading-none mb-2">₹43.46 Cr+</h3>
            <p className="text-[17px] text-[#86868b] font-medium tracking-wide uppercase">Total Support</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[980px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] mb-12 text-center">
            A mission-driven organization.
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8 text-[19px] text-[#1d1d1f] leading-relaxed font-normal">
              <p>
                Fularani Foundation was born from a simple yet powerful belief:
                <strong> kindness transforms lives.</strong> What started as a
                local initiative has grown into a widespread movement for
                social equality and humanitarian aid.
              </p>
              <p>
                Every mission we undertake is a step toward building a more inclusive
                society. We focus on health, education, and women's empowerment,
                ensuring that resources reach those who need them most.
              </p>
            </div>
            <div className="space-y-8 text-[19px] text-[#86868b] leading-relaxed font-normal">
              <p>
                Our commitment to transparency and accountability ensures
                that every contribution counts. We walk alongside our
                community partners, fostering long-term resilience and
                self-reliance.
              </p>
              <div className="pt-4">
                <button className="bg-[#0071e3] text-white px-8 py-3 rounded-full text-[17px] font-medium hover:bg-[#0077ed] transition-all flex items-center gap-2 group">
                  Volunteer With Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[40px] md:text-[48px] font-bold text-[#1d1d1f] tracking-tight">Our Leadership.</h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="apple-card overflow-hidden group"
              >
                <div className="h-[300px] overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#1d1d1f] mb-1">{member.name}</h3>
                  <p className="text-[#86868b] font-medium tracking-tight text-sm uppercase">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Transparency / CTA Section */}
      <section className="py-32 px-6 bg-[#1d1d1f] text-white">
        <div className="max-w-[700px] mx-auto text-center">
          <HelpCircle size={48} className="text-[#0071e3] mx-auto mb-8" />
          <h2 className="text-[40px] md:text-[48px] font-bold tracking-tight mb-6">Transparency that builds trust.</h2>
          <p className="text-[21px] text-[#86868b] mb-12">
            We provide clear, detailed reports of our activities and impact.
            Review our annual statements and see where your support goes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-[#0071e3] text-white px-8 py-3 rounded-full text-[17px] font-medium hover:bg-[#0077ed] transition-all flex items-center gap-2">
              View Reports <Eye size={18} />
            </button>
            <button className="text-[#0071e3] text-[17px] font-medium hover:underline flex items-center gap-2">
              Download PDF <Download size={18} />
            </button>
          </div>
        </div>
      </section> section
    </div>
  );
};

const ArrowRight = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default About;
