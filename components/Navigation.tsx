"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button"; // If you're using shadcn/ui
import { Settings, LogOut, User } from "lucide-react";

type Session = typeof auth.$Infer.Session;

export default function Navigation({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile: Centered Logo */}
        <div className="md:hidden flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-foreground">MindMate</span>
          </Link>
        </div>

        {/* Desktop: Left Logo */}
        <Link href="/" className="hidden md:flex items-center space-x-2">
          <span className="text-xl font-bold text-foreground">MindMate</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4">
          {!session ? (
            <>
              {/* Sign In Button - hidden on mobile, visible on desktop */}
              <Button
                variant="outline"
                asChild
                className="hidden sm:inline-flex"
                size="sm"
              >
                <Link href="/auth">Sign In</Link>
              </Button>

              {/* Get Started Button */}
              <Button asChild size="sm">
                <Link href="/auth?mode=signup">Get Started</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* User Info (Desktop only) */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {session.user?.name || "User"}
                </span>
              </div>

              {/* Settings Link */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-9 w-9"
                title="Settings"
              >
                <Link href="/settings">
                  <Settings size={18} className="text-muted-foreground" />
                </Link>
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  // Handle logout here
                  console.log("Logout clicked");
                }}
                title="Sign Out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
