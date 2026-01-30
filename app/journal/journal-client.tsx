'use client';

import { useState } from 'react';
import { BookOpen, Save, Sparkles } from 'lucide-react';

export default function JournalPage() {
  const [entries, setEntries] = useState<Array<{ id: string; title: string; content: string; date: string }>>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSaveDraft = () => {
    if (title.trim() || content.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        title: title || 'Untitled Entry',
        content,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      setEntries([newEntry, ...entries]);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Journal</h1>

          {/* New Entry Card */}
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-primary" size={24} />
              <h2 className="text-2xl font-semibold text-foreground">New Entry</h2>
            </div>

            {/* Title Input */}
            <input
              type="text"
              placeholder="Entry title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />

            {/* Content Textarea */}
            <textarea
              placeholder="How are you feeling today? Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-48"
            />

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 justify-between items-center">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Save size={18} />
                Save Entry
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
                <Sparkles size={18} />
                Analyze with AI
              </button>
            </div>
          </div>

          {/* Previous Entries */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Previous Entries</h2>
            {entries.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-16 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <BookOpen className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Journal Entries Yet</h3>
                <p className="text-muted-foreground">Write your first journal entry above to get started. Your entries will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div key={entry.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
                      <span className="text-sm text-muted-foreground">{entry.date}</span>
                    </div>
                    <p className="text-foreground/80 line-clamp-2">{entry.content}</p>
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
