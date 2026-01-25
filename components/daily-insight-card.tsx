'use client';

import { Lightbulb, RotateCw } from 'lucide-react';
import { useState } from 'react';

export default function DailyInsightCard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Lightbulb size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-card-foreground">Daily Insight</h2>
      </div>

      {/* Content */}
      <div className="mb-4 pl-4 border-l-4 border-primary">
        <p className="text-card-foreground text-base italic">
          Taking a few minutes for mindful breathing can reset your nervous system
          and improve your focus throughout the day.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>📅</span>
          <span>Today&apos;s Tip</span>
        </div>
        <button
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-card-foreground hover:border-primary transition-all ${
            refreshing ? 'animate-spin' : ''
          }`}
        >
          <RotateCw size={16} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>
    </div>
  );
}
