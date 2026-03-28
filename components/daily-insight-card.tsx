'use client';

import { Lightbulb } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CACHE_KEY = 'daily-insight-cache';

interface CachedInsight {
  date: string;
  lang: string;
  text: string;
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getCachedInsight(lang: string): string | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedInsight = JSON.parse(raw);
    if (cached.date === getTodayDateString() && cached.lang === lang) {
      return cached.text;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedInsight(lang: string, text: string) {
  const data: CachedInsight = {
    date: getTodayDateString(),
    lang,
    text,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export default function DailyInsightCard() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string>('');

  const fetchInsight = useCallback(async () => {
    setLoading(true);

    const systemPrompt = language === 'am'
      ? `You are a helpful and professional Mental Wellness AI Assistant. Give the user a short daily wellness tip in Amharic. The tip should be 3 to 4 lines long, actionable, calming, and encouraging. Do not add any title or label — just the tip itself. Each tip should be unique and different.`
      : `You are a helpful and professional Mental Wellness AI Assistant. Give the user a short daily wellness tip in English. The tip should be 3 to 4 lines long, actionable, calming, and encouraging. Do not add any title or label — just the tip itself. Each tip should be unique and different.`;
    const userMessage = language === 'am'
      ? 'ለዛሬ አጭር የአእምሮ ጤና ምክር ስጠኝ።'
      : 'Give me a daily wellness tip for today.';

    try {
      const response = await fetch('/api/generate-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userMessage, language }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setInsight(data.reply);
        setCachedInsight(language, data.reply);
      } else {
        setInsight(language === 'am'
          ? 'ይቅርታ፣ ምክር ማመንጨት አልተቻለም።'
          : "Sorry, couldn't generate today's tip.");
      }
    } catch (error) {
      console.error(error);
      setInsight(language === 'am'
        ? 'ይቅርታ፣ ምክር ማመንጨት አልተቻለም።'
        : "Sorry, couldn't generate today's tip.");
    } finally {
      setLoading(false);
    }
  }, [language]);

  // On mount or language change: load from cache or auto-fetch from AI
  useEffect(() => {
    const cached = getCachedInsight(language);
    if (cached) {
      setInsight(cached);
      setLoading(false);
    } else {
      fetchInsight();
    }
  }, [language, fetchInsight]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6 transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Lightbulb size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-card-foreground">{t('dailyInsight', 'title')}</h2>
      </div>

      {/* Content */}
      <div className="mb-4 pl-4 border-l-4 border-primary">
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm italic">
              {language === 'am' ? 'የዛሬውን ምክር በማመንጨት ላይ...' : "Generating today's tip..."}
            </span>
          </div>
        ) : (
          <p className="text-card-foreground text-base italic whitespace-pre-line">
            {insight}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <span>📅</span>
        <span>{t('dailyInsight', 'todayTip')}</span>
      </div>
    </div>
  );
}
