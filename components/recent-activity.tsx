"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getRecentActivity, Activity } from "@/lib/actions/activity-actions";
import { BookOpen, MessageSquare, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { t, language } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const data = await getRecentActivity();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-muted-foreground">Loading activity...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
        <p>{t("home", "noActivity")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {activities.map((activity) => (
        <Link
          key={`${activity.type}-${activity.id}`}
          href={activity.link}
          className="group block bg-card hover:bg-accent/50 border border-border rounded-xl p-4 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
              activity.type === "journal" 
                ? "bg-primary/10 text-primary" 
                : "bg-purple-500/10 text-purple-500"
            }`}>
              {activity.type === "journal" ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <MessageSquare className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {activity.type === "journal" ? t("nav", "journal") : t("nav", "chat")}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                </div>
              </div>
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {activity.title}
              </h3>
            </div>

            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  );
}
