"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Heart, ChevronDown, Menu, X, LogOut, ArrowRight } from "lucide-react";
import {
  isAuthenticated as isDonorAuthenticated,
  getDonorUser,
  logoutDonor,
} from "../services/donorService";
import {
  isVolunteerAuthenticated,
  getVolunteerUser,
  logoutVolunteer,
} from "../services/volunteerService";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const checkAuth = () => {
      const isDonor = isDonorAuthenticated();
      const isVolunteer = isVolunteerAuthenticated();

      setIsLoggedIn(isDonor || isVolunteer);
      if (isVolunteer) {
        setUserRole("volunteer");
        setCurrentUser(getVolunteerUser());
      } else if (isDonor) {
        setUserRole("donor");
        setCurrentUser(getDonorUser());
      } else {
        setUserRole(null);
        setCurrentUser(null);
      }
    };

    checkAuth();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (userRole === "volunteer") {
        await logoutVolunteer();
      } else {
        await logoutDonor();
      }
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
  };

  const navItems = [
    { name: "Our Missions", link: "/missions" },
    { name: "CSR Partnership", link: "/csr-partnership" },
    { name: "Our Works", link: "/gallery" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 border-b ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-secondary/10 shadow-sm py-2"
            : "bg-white border-transparent py-3"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-black text-xl text-white shadow-md group-hover:bg-primary/90 transition-all">
              F
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-xl font-black text-secondary uppercase tracking-tight leading-none">
                Fularani
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-none">
                Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 ml-10">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group py-2"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.link}
                  className="flex items-center gap-1.5 text-[14px] font-bold text-secondary/70 hover:text-secondary group-hover:text-primary transition-colors uppercase tracking-tight"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                {/* Dropdown - Mongo Style */}
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 w-[280px] pt-6 transition-all duration-200 ${activeDropdown === item.name ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}`}
                  >
                    <div className="bg-white border border-secondary/10 shadow-2xl rounded-2xl overflow-hidden p-3">
                      {item.dropdown.map((drop, idx) => (
                        <Link
                          key={idx}
                          to={item.link}
                          className="flex items-start gap-4 p-4 hover:bg-muted/50 rounded-xl transition-all group/item"
                        >
                          <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                            {drop.icon}
                          </div>
                          <div>
                            <div className="text-sm font-black text-secondary leading-none mb-1">
                              {drop.label}
                            </div>
                            <div className="text-[11px] font-bold text-muted-foreground leading-tight">
                              {drop.desc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    userRole === "volunteer"
                      ? "/volunteer-dashboard"
                      : "/donor-dashboard"
                  }
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-muted rounded-full hover:bg-primary/10 transition-all border border-secondary/5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:block text-xs font-black text-secondary uppercase tracking-tight">
                    Dashboard
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-secondary/40 hover:text-accent transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-4 font-black">
                <Link
                  to="/donor-register?role=volunteer"
                  className="hidden sm:block text-[13px] font-black text-secondary/60 hover:text-primary uppercase tracking-tight transition-colors py-2 px-4"
                >
                  Join Us
                </Link>
                <Link to="/donor-register">
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-[13px] font-black uppercase tracking-tight shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                    Donate Now
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-secondary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-secondary/10 shadow-2xl py-8 px-6 overflow-y-auto max-h-[80vh]"
            >
              <div className="space-y-6">
                {navItems.map((item) => (
                  <div key={item.name} className="space-y-4">
                    <Link
                      to={item.link}
                      className="text-2xl font-black text-secondary block lowercase"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-primary/20">
                        {item.dropdown.map((drop, idx) => (
                          <Link
                            key={idx}
                            to={item.link}
                            className="flex items-center gap-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-primary">
                              {drop.icon}
                            </div>
                            <span className="text-sm font-bold text-secondary/70">
                              {drop.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-8 border-t border-secondary/10 space-y-4">
                  {!isLoggedIn && (
                    <>
                      <Link
                        to="/donor-register?role=volunteer"
                        className="block text-center py-4 bg-muted text-secondary rounded-xl font-black uppercase tracking-tight"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Join Us
                      </Link>
                      <Link
                        to="/donor-register"
                        className="block text-center py-4 bg-accent text-secondary rounded-xl font-black uppercase tracking-tight"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Donate Now
                      </Link>
                    </>
                  )}
                  {isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="w-full py-4 border-2 border-accent/10 text-accent rounded-xl font-black uppercase tracking-tight"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
