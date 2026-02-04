import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "../../utils/cn";

export const Navbar = ({ children, className }) => {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled (for styling) - using 20px threshold
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine visibility - only trigger on significant scroll delta to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      layout
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
      className={cn(
        "fixed z-50 transition-colors duration-300",
        // Position & Layout - Always Floating Pill
        "top-0 left-0 right-0 w-full border-b border-white/10 shadow-2xl shadow-black/50",
        // Background - iOS Dark Liquid Glass
        "bg-blue-500/70 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-blue-500/60",
        className,
      )}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </motion.nav>
  );
};

export const NavBody = ({ children, className }) => {
  return (
    <div
      className={cn(
        "max-w-7xl mx-auto px-6 h-14 hidden md:flex items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const NavbarLogo = ({ className }) => {
  return (
    <a href="/" className={cn("flex flex-col leading-none group", className)}>
      <span className="text-xl font-semibold text-white tracking-tight transition-opacity group-hover:opacity-80">
        Fularani
      </span>
      <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">
        Foundation
      </span>
    </a>
  );
};

export const NavItems = ({ items, className }) => {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      {items.map((item, idx) => (
        <a
          key={`nav-item-${idx}`}
          href={item.link}
          className="text-[15px] font-medium text-white/80 hover:text-white transition-all duration-300 drop-shadow-sm"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
};

export const NavbarButton = ({
  children,
  onClick,
  variant = "primary",
  className,
}) => {
  const variants = {
    primary:
      "bg-[#007AFF] text-white hover:bg-[#0062cc] shadow-lg shadow-blue-500/30 border border-blue-400/20",
    secondary:
      "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md",
    outline:
      "bg-transparent text-white border border-white/30 hover:bg-white/10",
    ghost: "bg-transparent text-white/80 hover:text-white hover:bg-white/10",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 flex items-center gap-2 justify-center",
        variants[variant] || variants.primary,
        className,
      )}
    >
      {children}
    </button>
  );
};

export const MobileNav = ({ children, className }) => {
  return <div className={cn("md:hidden", className)}>{children}</div>;
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 h-14 border-b border-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavToggle = ({ isOpen, onClick, className }) => {
  return (
    <button onClick={onClick} className={cn("p-2 text-white", className)}>
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export const MobileNavMenu = ({ isOpen, onClose, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "bg-[#161617]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden shadow-2xl rounded-b-2xl",
            className,
          )}
        >
          <div className="flex flex-col p-6 gap-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
