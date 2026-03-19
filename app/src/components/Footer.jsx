import React, { useState } from "react";
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
  Plus,
  Minus,
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
    ],
    company: [
      // { label: "About Us", to: "/about" },
      { label: "Our Works", to: "/gallery" },
      // { label: "Success Stories", to: "/gallery" }, // Assuming stories are here or in a separate stories page
      { label: "Contact Us", to: "/contact" },
      { label: "CSR Partnership", to: "/csr-partnership" },
    ],
    legal: [
      { label: "Privacy Policy", to: "/legal-policy" },
      { label: "Terms and Conditions", to: "/terms" },
    ],
  };

  return (
    <footer className="bg-[#0A0A0B] text-white pt-6 md:pt-20 pb-4 md:pb-10 relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 md:mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-3 lg:space-y-8">
            <Link to="/" className="inline-block bg-white p-3 md:p-4 rounded-3xl group transition-all hover:scale-105">
               <img src={logo} alt="Fularani Foundation" className="h-8 md:h-12 w-auto object-contain" />
            </Link>
            
            <p className="text-gray-400 text-xs md:text-lg font-medium leading-tight md:leading-relaxed max-w-sm">
              Empowering communities across India through sustainable impact in education, climate, and healthcare.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-2 md:gap-4"
            >
              <SocialIcon icon={<Facebook size={20} />} href="https://www.facebook.com/fularaniorg" />
              <SocialIcon icon={<Twitter size={20} />} href="https://x.com/fularaniorg" />
              <SocialIcon icon={<Instagram size={20} />} href="https://www.instagram.com/fularanifoundation/" />
              <SocialIcon icon={<Linkedin size={20} />} href="https://in.linkedin.com/company/fularanifoundation" />
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8">
            <FooterList title="Our Missions" links={footerLinks.missions} />
            <FooterList title="Company" links={footerLinks.company} />
            <FooterList title="Transparency" links={footerLinks.legal} />
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-2 md:space-y-6">
            <h3 className="text-xs md:text-sm font-black text-primary uppercase tracking-[0.2em]">Stay Updated</h3>
            <p className="hidden md:block text-gray-400 text-sm font-medium">
              Join our newsletter to receive updates on our impact and missions.
            </p>
            <div className="relative group overflow-hidden rounded-2xl">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-1.5 top-1.5 bottom-1.5 md:right-2 md:top-2 md:bottom-2 bg-primary hover:bg-primary/90 text-white w-10 md:w-12 rounded-lg md:rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-primary/20 flex items-center justify-center"
              >
                <Send className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 py-4 md:py-10 border-y border-white/5 mb-4 md:mb-10">
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8">
            <p className="text-gray-500 text-xs md:text-sm font-bold tracking-tight">
              &copy; {currentYear} Fularani Foundation. All rights reserved.
            </p>
            <div className="flex gap-4 md:gap-6 mt-2 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-[10px] md:text-xs font-bold transition-colors">Privacy</Link>
              <Link to="/about" className="text-gray-500 hover:text-white text-[10px] md:text-xs font-bold transition-colors">Terms</Link>
              <Link to="/contact" className="text-gray-500 hover:text-white text-[10px] md:text-xs font-bold transition-colors">Cookies</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-widest italic group mt-2 md:mt-0">
            Made with <Heart size={12} className="text-accent fill-accent transition-transform group-hover:scale-125 md:w-[14px] md:h-[14px]" /> for India
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterList = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1 lg:space-y-6 border-b border-white/5 md:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 md:py-0 text-left focus:outline-none md:cursor-default"
      >
        <h3 className="text-xs md:text-sm font-black text-primary uppercase tracking-[0.2em]">{title}</h3>
        <div className="md:hidden text-primary">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 md:max-h-full ${isOpen ? 'max-h-64 my-2' : 'max-h-0 md:max-h-[1000px] md:my-0'}`}>
        <ul className="space-y-2 lg:space-y-4 pt-1 md:pt-0 pb-2 md:pb-0">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link 
                to={link.to} 
                className="text-gray-400 hover:text-white font-bold text-[11px] md:text-sm transition-all flex items-center gap-1 md:gap-2 group/link"
              >
                <ChevronRight className="w-3 h-3 md:w-[14px] md:h-[14px] text-primary opacity-0 -translate-x-2 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0" />
                <span className="transition-transform group-hover/link:translate-x-1">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-8 h-8 md:w-11 md:h-11 bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all border border-white/5"
  >
    <div className="scale-75 md:scale-100 flex items-center justify-center">
      {icon}
    </div>
  </a>
);

const Badge = ({ icon, title, desc }) => (
  <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-4 p-2 md:p-4 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
    <div className="flex-shrink-0 scale-75 md:scale-100">{icon}</div>
    <div className="text-center md:text-left">
      <h4 className="text-[11px] md:text-sm font-black text-white leading-none mb-1">{title}</h4>
      <p className="text-[9px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider">{desc}</p>
    </div>
  </div>
);

export default Footer;

