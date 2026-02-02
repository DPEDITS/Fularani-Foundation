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
    ExternalLink,
    Shield
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        foundation: [
            { label: "About Us", href: "/about" },
            { label: "Our Missions", href: "/missions" },
            { label: "Photo Gallery", href: "/gallery" },
            { label: "Contact Us", href: "/contact" }
        ],
        missions: [
            { label: "Mission Education", href: "/missions" },
            { label: "Mission Green", href: "/missions" },
            { label: "Mission Mobility", href: "/missions" },
            { label: "Period Pride", href: "/missions" }
        ],
        support: [
            { label: "Donor Login", href: "/donor-login" },
            { label: "Volunteer Login", href: "/volunteer-login" },
            { label: "Make a Donation", href: "/contact" },
            { label: "Get Involved", href: "/contact" }
        ]
    };

    return (
        <footer className="bg-[#f5f5f7] border-t border-black/5 pt-20 pb-12 px-6">
            <div className="max-w-[1024px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 group cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-black/5 group-hover:scale-105 transition-transform">
                                <Heart size={20} className="text-[#0071e3]" fill="#0071e3" />
                            </div>
                            <span className="text-[21px] font-bold text-[#1d1d1f] tracking-tight">Fularani<br /><span className="text-[17px] text-[#86868b] -mt-1 block font-medium">Foundation</span></span>
                        </div>
                        <p className="text-[14px] text-[#86868b] leading-relaxed font-medium">
                            Empowering lives through education, health, and sustainable development.
                            Together, we can build a brighter future for every individual.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon icon={<Facebook size={18} />} href="#" />
                            <SocialIcon icon={<Twitter size={18} />} href="#" />
                            <SocialIcon icon={<Instagram size={18} />} href="#" />
                            <SocialIcon icon={<Linkedin size={18} />} href="#" />
                        </div>
                    </div>

                    {/* Links Sections */}
                    <FooterColumn title="Foundation" links={footerLinks.foundation} />
                    <FooterColumn title="Our Missions" links={footerLinks.missions} />
                    <FooterColumn title="Get Involved" links={footerLinks.support} />
                </div>

                <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[13px] text-[#86868b] font-medium">
                        <span>© {currentYear} Fularani Foundation. All rights reserved.</span>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-[#1d1d1f] transition-colors">Terms of Service</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[13px] text-[#86868b] font-medium bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm">
                        <Shield size={14} className="text-[#0071e3]" />
                        <span>Website Developers: <span className="text-[#1d1d1f] font-bold">Zygon Noesis Team</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterColumn = ({ title, links }) => (
    <div className="space-y-6">
        <h3 className="text-[14px] font-bold text-[#1d1d1f] uppercase tracking-tight">{title}</h3>
        <ul className="space-y-3">
            {links.map((link, index) => (
                <li key={index}>
                    <a
                        href={link.href}
                        className="text-[14px] text-[#86868b] hover:text-[#0066cc] font-medium transition-colors flex items-center gap-1 group"
                    >
                        {link.label}
                        <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const SocialIcon = ({ icon, href }) => (
    <a
        href={href}
        className="w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center text-[#1d1d1f] hover:bg-[#0071e3] hover:text-white transition-all shadow-sm"
    >
        {icon}
    </a>
);

const ArrowRight = ({ size, className }) => (
    <svg
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
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);

export default Footer;
