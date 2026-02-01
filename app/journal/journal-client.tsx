"use client";

import { useState, useTransition } from "react";
import { BookOpen, Save, Sparkles, Calendar, Trash2 } from "lucide-react";
import { createJournalEntry } from "@/lib/actions/journal-actions";
import { toast } from "sonner";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export default function JournalPage({
  initialEntries,
}: {
  initialEntries: JournalEntry[];
}) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    const optimisticEntry: JournalEntry = {
      id: `temp-${Date.now()}`,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "temp",
    };

    // Optimistic update
    setEntries([optimisticEntry, ...entries]);
    setTitle("");
    setContent("");

    startTransition(async () => {
      try {
        await createJournalEntry({ title, content });
        toast.success("Journal entry saved successfully!");
        // The page will revalidate and show the real entry
      } catch (error) {
        // Rollback optimistic update
        setEntries(entries);
        setTitle(title);
        setContent(content);
        toast.error("Failed to save entry. Please try again.");
      }
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <section className="px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with gradient text */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Journal
            </h1>
            <p className="text-muted-foreground">
              Capture your thoughts, track your journey
            </p>
          </div>

          {/* New Entry Card with glassmorphism */}
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  New Entry
                </h2>
              </div>

              {/* Title Input with enhanced styling */}
              <input
                type="text"
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4 transition-all duration-200 hover:border-primary/50"
              />

              {/* Content Textarea with enhanced styling */}
              <textarea
                placeholder="How are you feeling today? Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPending}
                className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-48 transition-all duration-200 hover:border-primary/50"
              />

              {/* Action Buttons with enhanced effects */}
              <div className="flex gap-3 mt-6 justify-between items-center">
                <button
                  onClick={handleSaveEntry}
                  disabled={isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Save
                    size={18}
                    className={isPending ? "animate-pulse" : ""}
                  />
                  {isPending ? "Saving..." : "Save Entry"}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
                  <Sparkles size={18} />
                  Analyze with AI
                </button>
              </div>
            </div>
          </div>

          {/* Previous Entries */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="text-primary" size={24} />
              Previous Entries
            </h2>
            {entries.length === 0 ? (
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-16 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <BookOpen className="text-primary" size={36} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Journal Entries Yet
                </h3>
                <p className="text-muted-foreground">
                  Write your first journal entry above to get started. Your
                  entries will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(entry.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-foreground/70 line-clamp-2 leading-relaxed">
                        {entry.content}
                      </p>
                      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs text-muted-foreground">
                          Click to view full entry
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
