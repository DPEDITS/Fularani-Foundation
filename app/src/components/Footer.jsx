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
    <footer className="bg-secondary text-white py-8 md:py-12 px-4 md:px-6 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-primary"></div>

      <div className="max-w-[1200px] mx-auto text-left">
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-0 md:gap-y-8 mb-6 md:mb-8">
          {/* Brand & Manifesto */}
          <div className="col-span-2 lg:col-span-1 space-y-3 pb-6 border-b md:border-none border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center font-black text-lg md:text-xl text-white">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black uppercase tracking-tight leading-none">
                  Fularani
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] leading-none">
                  Foundation
                </span>
              </div>
            </div>

            <p className="text-[11px] md:text-xs font-bold text-white/60 leading-relaxed max-w-xs">
              Building a resilient Bhadrak through education, climate action,
              and healthcare.
            </p>

            <div className="flex gap-2 pt-1">
              <SocialIcon icon={<Facebook size={14} />} />
              <SocialIcon icon={<Twitter size={14} />} />
              <SocialIcon icon={<Instagram size={14} />} />
              <SocialIcon icon={<Linkedin size={14} />} />
            </div>
          </div>

          {/* Quick Links Columns - Grid Flow */}
          <FooterColumn title="Our Work" links={footerLinks.work} />
          <FooterColumn title="Transparency" links={footerLinks.transparency} />
          <FooterColumn title="Get Involved" links={footerLinks.connect} />
        </div>

        {/* Impact Badges - Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border-y border-white/10 mb-6">
          <Badge
            icon={
              <ShieldCheck className="text-primary w-4 h-4 md:w-5 md:h-5" />
            }
            text="Verified NGO"
            subtext="Bhadrak"
          />
          <Badge
            icon={<Award className="text-primary w-4 h-4 md:w-5 md:h-5" />}
            text="Tax Exempt"
            subtext="80G/12A"
          />
          <Badge
            icon={<Globe className="text-primary w-4 h-4 md:w-5 md:h-5" />}
            text="Local Impact"
            subtext="20+ Villages"
          />
          <Badge
            icon={<Heart className="text-primary w-4 h-4 md:w-5 md:h-5" />}
            text="Volunteer"
            subtext="500+ Peers"
          />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
            <span>© {currentYear} Fularani Foundation</span>
            <div className="flex gap-3 flex-wrap justify-center">
              <a href="#" className="hover:text-primary transition-all">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-all">
                Terms
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
            Made with <Heart size={10} className="text-accent fill-accent" />{" "}
            for Bhadrak.
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b md:border-none border-white/10 last:border-b-0 md:last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:mb-2 group text-left"
      >
        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
          {title}
        </h3>
        <ChevronRight
          size={14}
          className={`text-white/50 md:hidden transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-60 opacity-100 mb-4" : "max-h-0 opacity-0 md:max-h-none md:opacity-100 md:mb-0"}`}
      >
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="text-[11px] md:text-xs font-bold text-white/70 hover:text-white transition-all flex items-center gap-1.5 group"
              >
                <ChevronRight
                  size={10}
                  className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden md:block"
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon, href = "#" }) => (
  <a
    href={href}
    className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-secondary transition-all shadow-sm"
  >
    {icon}
  </a>
);

const Badge = ({ icon, text, subtext }) => (
  <div className="flex flex-col items-center md:items-start gap-1 p-2 bg-white/5 md:bg-transparent rounded-lg md:rounded-none">
    <div className="mb-1">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest leading-none text-white/90">
      {text}
    </span>
    <span className="text-[9px] font-bold text-white/30 tracking-tight leading-none">
      {subtext}
    </span>
  </div>
);

export default Footer;
