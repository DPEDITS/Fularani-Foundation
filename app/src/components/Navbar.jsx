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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] border-b border-white/10 ${visible ? "translate-y-0" : "-translate-y-full"
          } ${isScrolled ? "bg-black/80 backdrop-blur-xl" : "bg-black/60 backdrop-blur-lg"}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[52px] md:h-[48px] flex items-center justify-between">
          <a href="/" className="group flex flex-col leading-none tracking-tight">
            <span className="text-[17px] font-semibold text-white/95 transition-opacity group-hover:opacity-75">Fularani</span>
            <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.25em] mt-0.5">Foundation</span>
          </a>

          <div className="hidden md:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-6">
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
                    className="p-1.5 rounded-full bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    title="Logout"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <LoginButton />
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-white/90 p-1 hover:opacity-70 transition-opacity"
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <div className="fixed inset-0 w-full h-screen bg-black/95 backdrop-blur-2xl z-[60] flex flex-col pt-[52px] animate-in fade-in duration-500">
          <div className="absolute top-0 left-0 w-full h-[52px] flex items-center justify-between px-6 border-b border-white/5">
            <div className="flex flex-col leading-none tracking-tight">
              <span className="text-[17px] font-semibold text-white">Fularani</span>
              <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.25em] mt-1">Foundation</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/90 p-1">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col gap-6 px-10 pt-12">
            <MobileLink href="/" label="Home" onClick={() => setOpen(false)} />
            <MobileLink href="/about" label="About" onClick={() => setOpen(false)} />
            <MobileLink href="/gallery" label="Gallery" onClick={() => setOpen(false)} />
            <MobileLink href="/missions" label="Missions" onClick={() => setOpen(false)} />
            <MobileLink href="/contact" label="Contact" onClick={() => setOpen(false)} />

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
              {isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <a
                    href={userRole === "volunteer" ? "/volunteer-dashboard" : "/donor-dashboard"}
                    onClick={() => setOpen(false)}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-white text-black text-[15px] font-semibold transition-transform active:scale-95"
                  >
                    <User size={16} />
                    <span>Dashboard</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[15px] font-semibold transition-transform active:scale-95"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/donor-register"
                  onClick={() => setOpen(false)}
                  className="w-full h-11 flex items-center justify-center rounded-xl bg-white text-black text-[15px] font-semibold transition-transform active:scale-95"
                >
                  Login
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
    className="text-[12px] font-medium text-white/70 hover:text-white transition-all duration-300 tracking-tight"
  >
    {label}
  </a>
);

const LoginButton = () => (
  <a
    href="/donor-register"
    className="px-4 py-1.5 rounded-full bg-white text-black text-[12px] font-semibold transition-all duration-300 hover:bg-white/90 active:scale-95"
  >
    Login
  </a>
);

const DashboardButton = ({ username, role, avatar }) => (
  <a
    href={role === "volunteer" ? "/volunteer-dashboard" : "/donor-dashboard"}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-white/90 text-[12px] font-semibold border transition-all duration-300 hover:bg-white/10 active:scale-95 ${role === "volunteer" ? "border-emerald-500/30 text-emerald-400" : "border-white/15"
      }`}
  >
    <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
      {avatar ? (
        <img src={avatar} alt={username} className="w-full h-full object-cover" />
      ) : (
        <User size={10} className={role === "volunteer" ? "text-emerald-400" : "text-white/40"} />
      )}
    </div>
    <span>{(username && username !== "undefined") ? username : "Account"}</span>
  </a>
);

const MobileLink = ({ href, label, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-3xl font-semibold text-white/90 hover:text-white transition-colors tracking-tight"
  >
    {label}
  </a>
);

export default Navbar;
