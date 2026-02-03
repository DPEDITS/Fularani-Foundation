"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { isAuthenticated as isDonorAuthenticated, getDonorUser, logoutDonor } from "../services/donorService";
import { isVolunteerAuthenticated, getVolunteerUser, logoutVolunteer } from "../services/volunteerService";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] border-b border-[#d2d2d7]/30 ${visible ? "translate-y-0" : "-translate-y-full"
          } ${isScrolled
            ? "bg-gradient-to-r from-blue-50/95 via-white/95 to-blue-50/95 shadow-sm backdrop-blur-xl"
            : "bg-gradient-to-r from-blue-50/80 to-white/80 backdrop-blur-md"}`}
      >
        <div className="max-w-[1024px] mx-auto px-6 h-[44px] flex items-center justify-between">
          <a href="/" className="group flex items-center gap-2 tracking-tight">
            <div className="flex flex-col leading-none">
              <span className="text-[14px] font-semibold text-[#1d1d1f] transition-opacity group-hover:opacity-75">Fularani</span>
              <span className="text-[8px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Foundation</span>
            </div>
          </a>

          <div className="hidden md:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:block">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <DashboardButton
                    username={currentUser?.username}
                    role={userRole}
                    avatar={currentUser?.avatar}
                  />
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full text-[#86868b] hover:text-red-500 hover:bg-red-50/50 transition-all duration-300"
                    title="Logout"
                  >
                    <LogOut size={14} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <LoginButton />
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-[#1d1d1f] p-1 hover:opacity-70 transition-opacity"
            >
              {open ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <div className="fixed inset-0 w-full h-screen bg-white/98 backdrop-blur-2xl z-[60] flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-6 h-[44px] border-b border-[#d2d2d7]/30 bg-gradient-to-r from-blue-50/90 to-white/90">
            <div className="flex flex-col leading-none tracking-tight">
              <span className="text-[14px] font-semibold text-[#1d1d1f]">Fularani</span>
              <span className="text-[8px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Foundation</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#1d1d1f] p-1">
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-col gap-8 px-10 pt-16">
            <MobileLink href="/" label="Home" onClick={() => setOpen(false)} />
            <MobileLink href="/about" label="About" onClick={() => setOpen(false)} />
            <MobileLink href="/gallery" label="Gallery" onClick={() => setOpen(false)} />
            <MobileLink href="/missions" label="Missions" onClick={() => setOpen(false)} />
            <MobileLink href="/contact" label="Contact" onClick={() => setOpen(false)} />

            <div className="mt-8 pt-8 border-t border-[#d2d2d7]/30 flex flex-col gap-4">
              {isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <a
                    href={userRole === "volunteer" ? "/volunteer-dashboard" : "/donor-dashboard"}
                    onClick={() => setOpen(false)}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] text-white text-[15px] font-semibold transition-transform active:scale-95"
                  >
                    <User size={16} />
                    <span>Dashboard</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-full bg-red-50 text-red-500 border border-red-100 text-[15px] font-semibold transition-transform active:scale-95"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/donor-register"
                  onClick={() => setOpen(false)}
                  className="w-full h-11 flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[15px] font-semibold transition-transform active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NavLinks = () => (
  <div className="flex items-center gap-8">
    <NavItem href="/" label="Home" />
    <NavItem href="/about" label="About" />
    <NavItem href="/gallery" label="Gallery" />
    <NavItem href="/missions" label="Missions" />
    <NavItem href="/contact" label="Contact" />
  </div>
);

const NavItem = ({ href, label }) => (
  <a
    href={href}
    className="text-[11px] font-normal text-[#1d1d1f]/80 hover:text-[#0071e3] transition-all duration-300 tracking-tight"
  >
    {label}
  </a>
);

const LoginButton = () => (
  <a
    href="/donor-register"
    className="px-3 py-1 rounded-full bg-[#0071e3] text-white text-[11px] font-medium transition-all duration-300 hover:bg-[#0077ed] active:scale-95 shadow-sm shadow-blue-500/10"
  >
    Sign In
  </a>
);

const DashboardButton = ({ username, role, avatar }) => (
  <a
    href={role === "volunteer" ? "/volunteer-dashboard" : "/donor-dashboard"}
    className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/50 text-[#1d1d1f] text-[11px] font-medium border border-[#d2d2d7]/50 transition-all duration-300 hover:bg-white hover:border-[#d2d2d7] active:scale-95 ${role === "volunteer" ? "border-emerald-200 text-emerald-700 bg-emerald-50/50" : ""}`}
  >
    <div className="w-4 h-4 rounded-full overflow-hidden bg-[#f5f5f7] flex items-center justify-center shrink-0 border border-[#d2d2d7]/50">
      {avatar ? (
        <img src={avatar} alt={username} className="w-full h-full object-cover" />
      ) : (
        <User size={10} className={role === "volunteer" ? "text-emerald-500" : "text-[#86868b]"} />
      )}
    </div>
    <span>{(username && username !== "undefined") ? username : "Account"}</span>
  </a>
);

const MobileLink = ({ href, label, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-[28px] font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors tracking-tight"
  >
    {label}
  </a>
);

export default Navbar;
