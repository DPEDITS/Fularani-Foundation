"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { isAuthenticated, getDonorUser } from "../services/donorService";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [donorUser, setDonorUser] = useState(null);

  useEffect(() => {
    // Check auth status on mount and when localStorage changes
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
      setDonorUser(getDonorUser());
    };

    checkAuth();

    // Listen for storage changes (in case of login/logout in another tab)
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav
        className={`fixed left-1/2 z-50 -translate-x-1/2 hidden md:block transition-all duration-300 ${visible ? "top-6" : "-top-24"}`}
      >
        <div className="flex items-center gap-8 px-10 py-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-gradient-to-br from-gray-900/50 to-black/30">
          <span className="flex flex-col leading-tight italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            <span>Fularani</span>
            <span className="text-xs">Foundation</span>
          </span>
          <NavLinks />
          {isLoggedIn ? (
            <DashboardButton username={donorUser?.username} />
          ) : (
            <JoinUsButton />
          )}
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav
        className={`fixed left-4 right-4 z-50 md:hidden transition-all duration-300 ${visible ? "top-4" : "-top-32"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-gradient-to-br from-gray-900/50 to-black/30">
          <span className="flex flex-col leading-tight italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            <span>Fularani</span>
            <span className="text-xs">Foundation</span>
          </span>

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

            {isLoggedIn ? (
              <a
                href="/donor-dashboard"
                className="
                  relative overflow-hidden block w-full text-center mt-4 px-5 py-3 rounded-full
                  bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium
                  transition-all duration-300 flex items-center justify-center gap-2
                  shadow-lg shadow-pink-500/20
                "
              >
                <User className="w-4 h-4" />
                <span>My Dashboard</span>
              </a>
            ) : (
              <a
                href="/volunteer-login"
                className="
                  relative overflow-hidden block w-full text-center mt-4 px-5 py-3 rounded-full
                  border border-white/20 text-white font-medium
                  transition-colors duration-300
                  before:absolute before:inset-0
                  before:bg-pink-500
                  before:translate-x-[-100%]
                  before:transition-transform before:duration-[300ms]
                  hover:before:translate-x-0
                  hover:text-black
                "
              >
                <span className="relative z-10">Join Us</span>
              </a>
            )}
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

const JoinUsButton = () => (
  <a
    href="/volunteer-login"
    className="
      relative overflow-hidden ml-4 px-5 py-2 rounded-full
      border border-white/20 text-white text-sm font-medium
      transition-colors duration-300
      before:absolute before:inset-0
      before:bg-pink-500
      before:translate-x-[-100%]
      before:transition-transform before:duration-[300ms]
      hover:before:translate-x-0
      hover:text-black
    "
  >
    <span className="relative z-10">Join Us</span>
  </a>
);

const DashboardButton = ({ username }) => (
  <a
    href="/donor-dashboard"
    className="
      ml-4 px-5 py-2 rounded-full
      bg-gradient-to-r from-pink-500 to-rose-600 
      text-white text-sm font-medium
      transition-all duration-300
      hover:shadow-lg hover:shadow-pink-500/20
      flex items-center gap-2
    "
  >
    <User className="w-4 h-4" />
    <span className="relative z-10">{username || "Dashboard"}</span>
  </a>
);

const MobileLink = ({ href, label }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-3xl font-semibold text-[#1d1d1f] hover:opacity-70 transition-opacity"
  >
    {label}
  </a>
);

export default Navbar;


