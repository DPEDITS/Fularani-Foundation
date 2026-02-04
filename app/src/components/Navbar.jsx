"use client";
import React, { useState, useEffect } from "react";
import {
  Navbar as UiNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { isAuthenticated as isDonorAuthenticated, getDonorUser, logoutDonor } from "../services/donorService";
import { isVolunteerAuthenticated, getVolunteerUser, logoutVolunteer } from "../services/volunteerService";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Missions", link: "/missions" },
    { name: "Gallery", link: "/gallery" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div className="w-full">
      <UiNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <a href={userRole === "volunteer" ? "/volunteer-dashboard" : "/donor-dashboard"}>
                  <NavbarButton variant="ghost" className="!px-3 !py-2">
                    <User size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </NavbarButton>
                </a>
                <NavbarButton variant="secondary" onClick={handleLogout} className="!px-3 !py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                  <LogOut size={18} />
                </NavbarButton>
              </>
            ) : (
              <>
                <a href="/donor-register?role=volunteer">
                  <NavbarButton variant="ghost">Volunteer</NavbarButton>
                </a>
                <a href="/donor-register">
                  <NavbarButton variant="primary">Donate Now</NavbarButton>
                </a>
              </>
            )}

          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>

            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2 py-2 bg-gray-50 rounded-lg">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={20} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentUser?.username || "User"}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                </div>

                <a href={userRole === "volunteer" ? "/volunteer-dashboard" : "/donor-dashboard"}>
                  <NavbarButton variant="secondary" className="w-full justify-center">Dashboard</NavbarButton>
                </a>
                <NavbarButton variant="outline" onClick={handleLogout} className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50">
                  Logout
                </NavbarButton>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a href="/donor-register?role=volunteer">
                  <NavbarButton variant="secondary" className="w-full justify-center">Join as Volunteer</NavbarButton>
                </a>
                <a href="/donor-register">
                  <NavbarButton variant="primary" className="w-full justify-center">Donate Now</NavbarButton>
                </a>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </UiNavbar>
    </div>
  );
};

export default Navbar;
