import React from "react";
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
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    work: [
      { label: "Mission Education", href: "/missions" },
      { label: "Mission Green", href: "/missions" },
      { label: "Mission Mobility", href: "/missions" },
      { label: "Mission Period Pride", href: "/missions" },
      { label: "Health & Nutrition", href: "/missions" },
    ],
    transparency: [
      { label: "Annual Reports", href: "/about" },
      { label: "Financial Statements", href: "/about" },
      { label: "Our Reach & Impact", href: "/about" },
      { label: "FCRA Compliance", href: "/about" },
      { label: "Privacy Policy", href: "/about" },
    ],
    connect: [
      { label: "Donor Portal", href: "/donor-login" },
      { label: "Join as Volunteer", href: "/donor-register?role=volunteer" },
      { label: "Careers", href: "/contact" },
      { label: "Partner with Us", href: "/contact" },
      { label: "Contact Us", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-secondary text-white pt-24 pb-12 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-primary"></div>

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-black text-2xl text-white">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black uppercase tracking-tight leading-none">
                  Fularani
                </span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] leading-none">
                  Foundation
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-white/60 leading-relaxed">
              Fularani Foundation is a registered non-profit organization
              dedicated to creating a resilient Bhadrak through education,
              climate action, and equitable healthcare.
            </p>

            <div className="flex gap-4 pt-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* Quick Links Columns */}
          <FooterColumn title="Our Work" links={footerLinks.work} />
          <FooterColumn title="Transparency" links={footerLinks.transparency} />
          <FooterColumn title="Get Involved" links={footerLinks.connect} />
        </div>

        {/* Impact Badges & Certification */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/10 mb-12">
          <Badge
            icon={<ShieldCheck className="text-primary" />}
            text="Verified NGO"
            subtext="Bhadrak, Odisha"
          />
          <Badge
            icon={<Award className="text-primary" />}
            text="100% Tax Exempt"
            subtext="Under 80G/12A"
          />
          <Badge
            icon={<Globe className="text-primary" />}
            text="Local Impact"
            subtext="20+ Villages"
          />
          <Badge
            icon={<Heart className="text-primary" />}
            text="Volunteer Driven"
            subtext="500+ Peers"
          />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 text-[10px] font-black uppercase tracking-widest text-white/40">
            <span>© {currentYear} Fularani Foundation (NGO)</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-all">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-all">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-all">
                Donor Refund Policy
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
            Made with <Heart size={10} className="text-accent fill-accent" />{" "}
            for the children of Bhadrak.
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => (
  <div className="space-y-8">
    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">
      {title}
    </h3>
    <ul className="space-y-4">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className="text-[13px] font-extrabold text-white/70 hover:text-white transition-all flex items-center gap-2 group"
          >
            <ChevronRight
              size={12}
              className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
            />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ icon, href = "#" }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-secondary transition-all shadow-lg"
  >
    {icon}
  </a>
);

const Badge = ({ icon, text, subtext }) => (
  <div className="flex flex-col items-center md:items-start gap-2">
    <div className="mb-1">{icon}</div>
    <span className="text-xs font-black uppercase tracking-widest leading-none">
      {text}
    </span>
    <span className="text-[10px] font-bold text-white/30 tracking-tight leading-none">
      {subtext}
    </span>
  </div>
);

export default Footer;
