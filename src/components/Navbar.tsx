"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Moon,
  Sun,
  Menu,
  ArrowRight,
  Settings,
  Users,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  // { name: "Home", href: "/" },
  { name: "Upcoming Events", href: "/events" },
  // { name: "Manage Event", href: "/manage-events" },
];

const protectedLinks = [
  {
    name: "Create Event",
    href: "/create-event",
    Icon: Calendar,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    name: "Manage Events",
    href: "/manage-events",
    Icon: Settings,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    name: "Joined Events",
    href: "/joined-events",
    Icon: Users,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark, mounted]);

  const toggleTheme = () => setDark((prev) => !prev);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen((open) => !open);

  return (
    <nav className="sticky top-0 z-50 border-y border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
            <span className="text-violet-600 font-bold">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            SocialServe
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center 
        gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground 
              hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 
            text-muted-foreground hover:text-foreground
             hover:bg-accent transition-colors"
            aria-label="Toggle theme"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Moon className="h-5 w-5" /> :
             <Sun className="h-5 w-5" />}
          </button>

          {isAuthenticated && user ? (
            <div className="relative group">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors"
                title={user.name || user.email}
                aria-label="User menu"
              >
                <Image
                  src={user.photoURL || user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="User profile"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-border"
                  priority
                />
                <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              <div
                className={cn(
                  "absolute z-50 mt-2 w-80 rounded-xl border border-border bg-white shadow-lg p-4 opacity-0 translate-y-2 pointer-events-none transition-all duration-200",
                  isDropdownOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-2 pointer-events-none"
                )}
              >
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                  <Image
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt="User profile"
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border border-border"
                    priority
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {protectedLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors",
                        link.iconBg,
                        link.iconColor
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                        <link.Icon className="h-5 w-5" />
                      </div>
                      {link.name}
                      <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                  <div className="border-t border-border pt-4 mt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                        <ArrowRight className="h-5 w-5 text-red-600" />
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          ) : (
           
            
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors border border-transparent">
                Login
              </button>
            </Link>
          )}

          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden border-y border-border bg-background ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-3 text-sm font-medium">
                <button
                  onClick={toggleTheme}
                  className="w-10 rounded-md p-1 text-muted-foreground hover:bg-accent"
                >
                  {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent">
                    <Image
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt="User profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full border border-border"
                      priority
                    />
                    <span className="text-muted-foreground">{user.name}</span>
                    <ChevronUp className="ml-auto h-4 w-4" />
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="w-full text-center py-2 rounded-lg text-white bg-violet-600 hover:bg-violet-700"
                  >
                    Login
                  </Link>
                )}
              </div>
              {isAuthenticated && user && (
                <div className="mt-3 space-y-2">
                  {protectedLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-accent transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
