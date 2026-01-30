"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  BookOpen,
  MessageCircle,
  Smile,
  Heart,
  Flower2,
  Info,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "AI Chat", href: "/chat", icon: MessageCircle },
  { name: "Health Advice", href: "/health-advice", icon: Heart },
  { name: "Mental Peace", href: "/mental-peace", icon: Flower2 },
  { name: "About", href: "/about", icon: Info },
];

interface SidebarProps {
  session?: any; // Add session prop if you want to show user info
}

export default function Sidebar({ session }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Menu Button - Better positioned */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-lg bg-card border border-border text-foreground hover:bg-accent transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-background border-r border-border p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Smile className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">MindMate</h1>
              <p className="text-xs text-muted-foreground">Mental Wellness</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Navigation
          </p>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section (if logged in) */}
        {session && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card hover:bg-accent transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user?.email || "Welcome back"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-6 pt-6 border-t border-border space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Preferences
          </p>

          <button
            onClick={() => {
              setIsOpen(false);
              // Navigate to settings or open settings modal
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors text-sm font-medium"
          >
            <Settings size={18} className="text-muted-foreground" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              const newTheme =
                theme === "light"
                  ? "dark"
                  : theme === "dark"
                    ? "system"
                    : "light";
              setTheme(newTheme);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors text-sm font-medium"
            title={`Switch theme (Current: ${theme})`}
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon size={18} className="text-muted-foreground" />
              ) : (
                <Sun size={18} className="text-muted-foreground" />
              )}
              <span>Theme</span>
            </div>
            <span className="text-xs px-2 py-1 bg-secondary rounded-md text-muted-foreground capitalize">
              {theme}
            </span>
          </button>

          {/* Sign Out if logged in */}
          {session && (
            <button
              onClick={() => {
                // Handle sign out
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium mt-2"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main content wrapper - adds left margin on desktop */}
      <div className="md:ml-64" />
    </>
  );
}
