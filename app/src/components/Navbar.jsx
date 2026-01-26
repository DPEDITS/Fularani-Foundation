"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2 hidden md:block">
        <div className="flex items-center gap-8 px-10 py-4 rounded-full bg-black/90 backdrop-blur-md border border-white/10 shadow-lg">
          <NavLinks />
          <DonateButton />
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav className="fixed top-4 left-4 right-4 z-50 md:hidden">
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-black/90 backdrop-blur-md border border-white/10 shadow-lg">
          <span className="text-white font-semibold">Fularani</span>

          <button onClick={() => setOpen(!open)} className="text-white">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="mt-3 p-6 rounded-2xl bg-black/95 border border-white/10 shadow-xl space-y-4">
            <MobileLink href="/" label="Home" />
            <MobileLink href="/about" label="About" />
            <MobileLink href="/gallery" label="Gallery" />
            <MobileLink href="/missions" label="Missions" />
            <MobileLink href="/contact" label="Contact" />

            <a
              href="/login"
              className="block w-full text-center mt-4 px-5 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white hover:text-black transition"
            >
              Join Us
            </a>
          </div>
        )}
      </nav>
    </>
  );
};

const NavLinks = () => (
  <>
    <NavItem href="/" label="Home" />
    <NavItem href="/about" label="About" />
    <NavItem href="/gallery" label="Gallery" />
    <NavItem href="/missions" label="Missions" />
    <NavItem href="/contact" label="Contact" />
  </>
);

const NavItem = ({ href, label }) => (
  <a href={href} className="text-white text-sm font-medium hover:text-gray-300">
    {label}
  </a>
);

const DonateButton = () => (
  <a
    href="/login"
    className="ml-4 px-5 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-black transition"
  >
    Join Us
  </a>
);

const MobileLink = ({ href, label }) => (
  <a
    href={href}
    className="block text-white text-base font-medium hover:text-gray-300"
  >
    {label}
  </a>
);

export default Navbar;
