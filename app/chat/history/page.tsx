"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageSquare, Calendar, ChevronRight, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChatSession {
  id: string;
  createdAt: string;
  messages: {
    content: string;
  }[];
}

export default function ChatHistoryPage() {
  const { t, language } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/chat/sessions");
        if (response.ok) {
          const data = await response.json();
          setSessions(data.sessions);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "am" ? "am-ET" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("chatHistory", "title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("chatHistory", "description")}
            </p>
          </div>
          <Link href="/chat">
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              {t("chatHistory", "newChat")}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">{t("chatHistory", "loading")}</p>
          </div>
        ) : sessions.length === 0 ? (
          <Card className="border-dashed border-2 py-20">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <MessageSquare size={48} className="text-muted-foreground/30" />
              <p className="text-xl font-medium text-muted-foreground">
                {t("chatHistory", "noSessions")}
              </p>
              <Link href="/chat">
                <Button variant="outline">{t("chatHistory", "newChat")}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Link key={session.id} href={`/chat?sessionId=${session.id}`}>
                <Card className="hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        {formatDate(session.createdAt)}
                      </CardTitle>
                      <CardDescription className="line-clamp-1 mt-1">
                        {session.messages[0]?.content || "Empty conversation"}
                      </CardDescription>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
