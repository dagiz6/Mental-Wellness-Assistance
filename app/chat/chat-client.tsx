"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Plus, History } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatClient() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSessionId = searchParams.get("sessionId");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: t("chat", "initialGreeting"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(!!initialSessionId);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSessionContent = useCallback(async (id: string) => {
    setIsPageLoading(true);
    try {
      const response = await fetch(`/api/chat/sessions/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.session && data.session.messages) {
          const loadedMessages = data.session.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.createdAt),
          }));
          if (loadedMessages.length > 0) {
            setMessages(loadedMessages);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialSessionId) {
      loadSessionContent(initialSessionId);
      setSessionId(initialSessionId);
    } else {
      // If we are coming back to /chat without a param, reset to fresh
      setSessionId(null);
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: t("chat", "initialGreeting"),
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialSessionId, loadSessionContent]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: sessionId,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          `Server returned an error (${response.status}). Please check server logs.`,
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Error ${response.status}: Something went wrong`,
        );
      }

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        // Update URL without refreshing to persist session in browser history
        window.history.pushState({}, "", `/chat?sessionId=${data.sessionId}`);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "I'm having trouble connecting right now. Please try again in a moment."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: t("chat", "initialGreeting"),
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setSessionId(null);
    router.push("/chat");
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("chatHistory", "loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 border-b border-border bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
                MM
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  MindMate Assistant
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-powered wellness support
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/chat/history">
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                <History size={18} />
                <span className="hidden sm:inline">{t("chatHistory", "Chat History")}</span>
              </button>
            </Link>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{t("chatHistory", "New Chat")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl px-6 py-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border text-foreground rounded-bl-none"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <span
                  className={`text-xs mt-2 block ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                   }`}
                >
                  {message.timestamp.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border text-foreground px-6 py-4 rounded-2xl rounded-bl-none">
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={18} />
                  <span className="text-sm text-muted-foreground">
                    {t("chat", "thinking")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Privacy Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            {t("chat", "privacyNotice")}
          </div>

          {/* Input Form */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              placeholder={t("chat", "placeholder")}
              className="flex-1 bg-input border border-border rounded-2xl px-6 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            {t("chat", "disclaimer")}
          </p>
        </div>
      </footer>
    </div>
  );
}
