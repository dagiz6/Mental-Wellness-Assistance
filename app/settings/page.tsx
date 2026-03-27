"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Globe, User, Shield } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // Client-side auth checker

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("settings", "title")}</h1>
        <p className="text-muted-foreground mt-2">{t("settings", "description")}</p>
      </div>

      <div className="grid gap-6">
        
        {/* Language Selection */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t("settings", "language")}</h3>
                <p className="text-sm text-muted-foreground">{t("settings", "languageDesc")}</p>
              </div>
            </div>
          </div>
          
          <div className="flex bg-muted p-1 rounded-xl w-full sm:w-fit">
            <button
              onClick={() => setLanguage("en")}
              className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${language === "en" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("settings", "english")}
            </button>
            <button
              onClick={() => setLanguage("am")}
              className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${language === "am" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("settings", "amharic")}
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {theme === "dark" ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t("settings", "theme")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings", "themeDesc")}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all flex-1 ${theme === "light" ? "border-primary bg-primary/5" : "border-transparent bg-muted hover:bg-muted/80"}`}
            >
              <Sun className="w-6 h-6" />
              <span className="text-sm font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all flex-1 ${theme === "dark" ? "border-primary bg-primary/5" : "border-transparent bg-muted hover:bg-muted/80"}`}
            >
              <Moon className="w-6 h-6" />
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all flex-1 ${theme === "system" ? "border-primary bg-primary/5" : "border-transparent bg-muted hover:bg-muted/80"}`}
            >
              <Monitor className="w-6 h-6" />
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
        </div>

        {/* Account Settings */}
        {session?.user && (
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t("settings", "account")}</h3>
                <p className="text-sm text-muted-foreground">{t("settings", "accountDesc")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
               <div className="flex-shrink-0">
                  {session.user.image ? (
                     <img src={session.user.image} alt={session.user.name} className="w-20 h-20 rounded-full shadow-sm object-cover border border-border" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shadow-inner">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
               </div>
               
               <div className="flex-1 space-y-4">
                 <div className="grid gap-1">
                   <p className="text-sm font-medium text-muted-foreground">{t("settings", "name")}</p>
                   <p className="text-base font-semibold">{session.user.name}</p>
                 </div>
                 <div className="grid gap-1">
                   <p className="text-sm font-medium text-muted-foreground">{t("settings", "email")}</p>
                   <p className="text-base">{session.user.email}</p>
                 </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
