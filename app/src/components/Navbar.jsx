"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-nav border-b border-black/5" : "bg-transparent"
        }`}
    >
      <div className="max-w-[1024px] mx-auto px-6 h-12 flex items-center justify-between">
        {/* Branding */}
        <a href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-70">
          <span className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
            FULARANI
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavItem href="/" label="Home" />
          <NavItem href="/about" label="About" />
          <NavItem href="/gallery" label="Gallery" />
          <NavItem href="/missions" label="Missions" />
          <NavItem href="/contact" label="Contact" />

          <a
            href="/volunteer-login"
            className="flex items-center gap-1.5 bg-[#0071e3] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0077ed] transition-colors"
          >
            <User size={14} />
            Join
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#1d1d1f] hover:opacity-70 transition-opacity"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-white z-[60] transition-transform duration-500 ease-in-out transform ${open ? "translate-y-0" : "-translate-y-full"
          } md:hidden`}
      >
        <div className="flex flex-col h-full pt-12 px-10">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-semibold tracking-tight text-[#1d1d1f]">FULARANI</span>
            <button onClick={() => setOpen(false)} className="text-[#1d1d1f]">
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <MobileLink href="/" label="Home" onClick={() => setOpen(false)} />
            <MobileLink href="/about" label="About" onClick={() => setOpen(false)} />
            <MobileLink href="/gallery" label="Gallery" onClick={() => setOpen(false)} />
            <MobileLink href="/missions" label="Missions" onClick={() => setOpen(false)} />
            <MobileLink href="/contact" label="Contact" onClick={() => setOpen(false)} />
            <a
              href="/volunteer-login"
              onClick={() => setOpen(false)}
              className="mt-4 text-2xl font-medium text-[#0071e3]"
            >
              Join Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ href, label }) => (
  <a
    href={href}
    className="text-xs font-normal text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors tracking-wide"
  >
    {label}
  </a>
);

const MobileLink = ({ href, label, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-3xl font-semibold text-[#1d1d1f] hover:opacity-70 transition-opacity"
  >
    {label}
  </a>
);

export default Navbar;


