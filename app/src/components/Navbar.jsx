"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ChevronDown, Menu, X, LogOut, ArrowRight } from "lucide-react";
import { safeLocationRedirect } from "../utils/safeNavigate";
import {
  isAuthenticated as isDonorAuthenticated,
  getDonorUser,
  getDonorProfile,
  logoutDonor,
} from "../services/donorService";
import {
  isVolunteerAuthenticated,
  getVolunteerUser,
  getVolunteerProfile,
  logoutVolunteer,
} from "../services/volunteerService";
import {
  isAdminAuthenticated,
  getAdminUser,
  logoutAdmin,
} from "../services/adminService";
import { useInterval } from "usehooks-ts";
import logo from "../assets/image copy.png";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const fetchingRef = useRef(false);

  // Fetch user profile from the backend API
  const fetchUserFromBackend = useCallback(async (role) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      if (role === "donor") {
        const res = await getDonorProfile();
        setCurrentUser(res.data);
      } else if (role === "volunteer") {
        const res = await getVolunteerProfile();
        setCurrentUser(res.data);
      } else if (role === "admin") {
        // Admin has no dedicated profile endpoint; use localStorage as fallback
        setCurrentUser(getAdminUser());
      }
    } catch (err) {
      // Fallback to localStorage if API call fails (e.g. network issues)
      console.error("Navbar: failed to fetch profile from backend, using fallback", err);
      if (role === "donor") setCurrentUser(getDonorUser());
      else if (role === "volunteer") setCurrentUser(getVolunteerUser());
      else if (role === "admin") setCurrentUser(getAdminUser());
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // Check auth status (only token existence — fast, no API call)
  const checkAuth = useCallback(() => {
    const isDonor = isDonorAuthenticated();
    const isVolunteer = isVolunteerAuthenticated();
    const isAdmin = isAdminAuthenticated();

    const wasLoggedIn = isLoggedIn;
    const prevRole = userRole;
    const nowLoggedIn = isDonor || isVolunteer || isAdmin;

    let newRole = null;
    if (isAdmin) newRole = "admin";
    else if (isVolunteer) newRole = "volunteer";
    else if (isDonor) newRole = "donor";

    setIsLoggedIn(nowLoggedIn);
    setUserRole(newRole);

    // Only fetch from backend when auth status actually changes (login/logout/role switch)
    if (nowLoggedIn && (!wasLoggedIn || newRole !== prevRole)) {
      fetchUserFromBackend(newRole);
    } else if (!nowLoggedIn) {
      setCurrentUser(null);
    }
  }, [isLoggedIn, userRole, fetchUserFromBackend]);

  // Poll for auth status changes (login/logout detection only)
  useInterval(() => {
    checkAuth();
  }, 2000);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Initial auth check + fetch
    const isDonor = isDonorAuthenticated();
    const isVolunteer = isVolunteerAuthenticated();
    const isAdmin = isAdminAuthenticated();
    const nowLoggedIn = isDonor || isVolunteer || isAdmin;

    let role = null;
    if (isAdmin) role = "admin";
    else if (isVolunteer) role = "volunteer";
    else if (isDonor) role = "donor";

    setIsLoggedIn(nowLoggedIn);
    setUserRole(role);
    if (nowLoggedIn && role) {
      fetchUserFromBackend(role);
    }

    // Listen for profile-updated event (dispatched from dashboards after profile save)
    const handleProfileUpdated = () => {
      if (userRole || role) {
        fetchUserFromBackend(userRole || role);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkAuth);
    window.addEventListener("profile-updated", handleProfileUpdated);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (userRole === "admin") {
        await logoutAdmin();
      } else if (userRole === "volunteer") {
        await logoutVolunteer();
      } else {
        await logoutDonor();
      }
      safeLocationRedirect("/");
    } catch (err) {
      console.error("Logout failed:", err);
      safeLocationRedirect("/");
    }
  };

  const navItems = [
    { name: "Our Missions", link: "/missions" },
    { name: "CSR Partnership", link: "/csr-partnership" },
    { name: "Our Works", link: "/gallery" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 border-b ${scrolled
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
            <img
              src={logo}
              alt="Fularani Foundation"
              className="h-12 md:h-12 w-auto object-contain transition-transform"
            />
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
            {userRole === "admin" &&
              ["debashishparida75@gmail.com", "abhijeetduttaam2222@gmail.com", "abhijeetdashx@gmail.com"].includes(
                currentUser?.email?.toLowerCase()
              ) && (
                <Link
                  to="/add-content"
                  className="text-[14px] font-bold text-secondary/70 hover:text-secondary hover:text-primary transition-colors uppercase tracking-tight"
                >
                  Add Story
                </Link>
              )}
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    userRole === "admin"
                      ? "/admin-dashboard"
                      : userRole === "volunteer"
                        ? "/volunteer-dashboard"
                        : "/donor-dashboard"
                  }
                  className="flex items-center gap-3 p-1 shrink-0 md:pl-2 md:pr-4 md:py-1.5 bg-muted/50 md:bg-muted rounded-full hover:bg-primary/10 transition-all border border-secondary/5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs shadow-sm overflow-hidden">
                    {currentUser?.avatar ? (
                      <img
                        src={getSecureCloudinaryUrl(currentUser.avatar)}
                        alt={currentUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser?.username?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="hidden md:block text-xs font-black text-secondary uppercase tracking-tight">
                    {currentUser?.username || "Dashboard"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:block p-2 text-secondary/40 hover:text-accent transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-4 font-black">
                <Link
                  to="/donor-register?role=volunteer"
                  onClick={() => window.fbq?.('track', 'Lead', { content_name: 'Volunteer Join Button' })}
                  className="hidden sm:block text-[13px] font-black text-secondary/60 hover:text-primary uppercase tracking-tight transition-colors py-2 px-4"
                >
                  Join Us
                </Link>
                <Link
                  to="/donor-register"
                  onClick={() => window.fbq?.('track', 'InitiateCheckout', { content_name: 'Navbar Donate Button' })}
                  className={isHomePage ? "hidden lg:block" : "block"}
                >
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-[11px] lg:text-[13px] font-black uppercase tracking-tight shadow-md lg:shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap">
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
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-secondary/10 shadow-2xl py-4 px-5 overflow-y-auto max-h-[80vh]"
            >
              <div className="space-y-4">
                {navItems.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <Link
                      to={item.link}
                      className="text-2xl font-black text-secondary block uppercase tracking-tight"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-primary/20">
                        {item.dropdown.map((drop, idx) => (
                          <Link
                            key={idx}
                            to={item.link}
                            className="flex items-center gap-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center text-primary">
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

                <div className="pt-6 border-t border-secondary/10 space-y-3">
                  {!isLoggedIn && (
                    <>
                      <Link
                        to="/donor-register?role=volunteer"
                        className="block text-center py-3 bg-muted text-secondary rounded-xl font-black uppercase tracking-tight text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Join Us
                      </Link>
                      {!isHomePage && (
                      <Link
                          to="/donor-register"
                          onClick={() => {
                            window.fbq?.('track', 'InitiateCheckout', { content_name: 'Mobile Menu Donate Button' });
                            setIsMobileMenuOpen(false);
                          }}
                          className="block text-center py-3 bg-accent text-secondary rounded-xl font-black uppercase tracking-tight text-sm"
                        >
                          Donate Now
                        </Link>
                      )}
                    </>
                  )}
                  {isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 border-2 border-accent/10 text-accent rounded-xl font-black uppercase tracking-tight text-sm"
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
