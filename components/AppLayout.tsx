"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

interface AppLayoutProps {
  children: React.ReactNode;
  session: any;
}

export default function AppLayout({ children, session }: AppLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <ThemeProvider>
      {!isAuthPage && <Sidebar session={session} />}
      <main className={`${!isAuthPage ? "md:ml-64" : ""} min-h-screen`}>
        {children}
      </main>
    </ThemeProvider>
  );
}
