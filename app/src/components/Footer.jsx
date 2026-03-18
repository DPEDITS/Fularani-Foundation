import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShieldCheck,
  ChevronRight,
  Globe,
  Award,
  Send,
} from "lucide-react";
import logo from "../assets/image copy.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    missions: [
      { label: "Mission Education", to: "/missions/education" },
      { label: "Mission Green", to: "/missions/green" },
      { label: "Mission Healthcare", to: "/missions/healthcare" },
      { label: "CSR Partnership", to: "/csr-partnership" },
    ],
    company: [
      { label: "About Us", to: "/about" },
      { label: "Our Works", to: "/gallery" },
      { label: "Success Stories", to: "/gallery" }, // Assuming stories are here or in a separate stories page
      { label: "Contact Us", to: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", to: "/legal-policy" },
      { label: "Terms of Service", to: "/about" },
      { label: "Annual Reports", to: "/about" },
      { label: "80G/12A Status", to: "/about" },
    ],
  };

  return (
    <footer className="bg-[#0A0A0B] text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block bg-white p-4 rounded-3xl group transition-all hover:scale-105">
              <img src={logo} alt="Fularani Foundation" className="h-12 w-auto object-contain" />
            </Link>
            
            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm">
              Empowering communities across India through sustainable impact in education, climate, and healthcare.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <SocialIcon icon={<Facebook size={20} />} href="https://www.facebook.com/fularaniorg" />
              <SocialIcon icon={<Twitter size={20} />} href="https://x.com/fularaniorg" />
              <SocialIcon icon={<Instagram size={20} />} href="https://www.instagram.com/fularanifoundation/" />
              <SocialIcon icon={<Linkedin size={20} />} href="https://in.linkedin.com/company/fularanifoundation" />
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterList title="Our Missions" links={footerLinks.missions} />
            <FooterList title="Company" links={footerLinks.company} />
            <FooterList title="Transparency" links={footerLinks.legal} />
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Stay Updated</h3>
            <p className="text-gray-400 text-sm font-medium">
              Join our newsletter to receive updates on our impact and missions.
            </p>
            <div className="relative group overflow-hidden rounded-2xl">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-10 border-y border-white/5 mb-10">
          <Badge 
            icon={<ShieldCheck className="text-primary" size={24} />} 
            title="Verified NGO" 
            desc="Registered Section 8" 
          />
          <Badge 
            icon={<Award className="text-primary" size={24} />} 
            title="Tax Benefits" 
            desc="80G & 12A Certified" 
          />
          <Badge 
            icon={<MapPin className="text-primary" size={24} />} 
            title="Local Roots" 
            desc="Active in 20+ Districts" 
          />
          <Badge 
            icon={<Heart className="text-primary" size={24} />} 
            title="Grassroots" 
            desc="100% Community Led" 
          />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-gray-500 text-sm font-bold tracking-tight">
              &copy; {currentYear} Fularani Foundation. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Privacy</Link>
              <Link to="/about" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Terms</Link>
              <Link to="/contact" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Cookies</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-widest italic group">
            Made with <Heart size={14} className="text-accent fill-accent transition-transform group-hover:scale-125" /> for India
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterList = ({ title, links }) => (
  <div className="space-y-6">
    <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">{title}</h3>
    <ul className="space-y-4">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link 
            to={link.to} 
            className="text-gray-400 hover:text-white font-bold text-sm transition-all flex items-center gap-2 group/link"
          >
            <ChevronRight size={14} className="text-primary opacity-0 -translate-x-2 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0" />
            <span className="transition-transform group-hover/link:translate-x-1">{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all border border-white/5"
  >
    {icon}
  </a>
);

const Badge = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h4 className="text-sm font-black text-white leading-none mb-1">{title}</h4>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{desc}</p>
    </div>
  </div>
);

export default Footer;

