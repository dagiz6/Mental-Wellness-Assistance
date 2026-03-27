'use client';

import DailyInsightCard from '@/components/daily-insight-card';
import QuickAccessSection from '@/components/quick-access-section';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-6xl mx-auto ">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            {t('home', 'welcome')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            {t('home', 'subtitle')}
          </p>

          {/* Daily Insight Card */}
          <DailyInsightCard />

          {/* Quick Access Section */}
          <QuickAccessSection />

          {/* Recent Activity Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-primary rounded"></div>
              <h2 className="text-2xl font-semibold text-foreground">{t('home', 'recentActivity')}</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              <p>{t('home', 'noActivity')}</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
