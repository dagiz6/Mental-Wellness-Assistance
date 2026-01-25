'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
} from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'AI Chat', href: '/chat', icon: MessageCircle },
  { name: 'Health Advice', href: '/health-advice', icon: Heart },
  { name: 'Mental Peace', href: '/mental-peace', icon: Flower2 },
  { name: 'About', href: '/about', icon: Info },
];

export default function Sidebar() {
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 md:hidden p-2 text-foreground hover:bg-secondary rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col transform transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
            ☸
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">
            MindMate
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-sidebar-border pt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button 
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
              setTheme(newTheme);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left"
            title={`Current: ${theme}`}
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="text-sm font-medium">
              {theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main content wrapper - adds left margin on desktop */}
      <div className="md:ml-64" />
    </>
  );
}
