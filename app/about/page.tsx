'use client';

import { Lock, Zap, BookOpen, Activity, MessageCircle, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 flex items-center gap-4">
              <span className="text-4xl "><img src="icon.svg" alt="" className='w-12' /></span>
              <span className="text-balance">{t('about', 'title')}</span>
            </h1>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-balance">
              {t('about', 'intro')}
            </p>
          </div>

          {/* Our Mission */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">{t('about', 'missionTitle')}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed text-balance">
                {t('about', 'mission1')}
              </p>
              <p className="text-lg leading-relaxed text-balance">
                {t('about', 'mission2')}
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Privacy First */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Lock size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t('about', 'privacyTitle')}</h3>
                  <p className="text-muted-foreground">
                    {t('about', 'privacyDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* AI-Powered Insights */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Zap size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t('about', 'aiTitle')}</h3>
                  <p className="text-muted-foreground">
                    {t('about', 'aiDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center mb-16 py-8">
            <p className="text-2xl italic text-primary font-light">
              {t('about', 'tagline')}
            </p>
          </div>

          {/* How Vihaara Works */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-primary rounded"></div>
              <h2 className="text-3xl font-bold text-foreground">{t('about', 'worksTitle')}</h2>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t('about', 'step1Title')}</h3>
                  <p className="text-muted-foreground">
                    {t('about', 'step1Desc')}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t('about', 'step2Title')}</h3>
                  <p className="text-muted-foreground">
                    {t('about', 'step2Desc')}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t('about', 'step3Title')}</h3>
                  <p className="text-muted-foreground">
                    {t('about', 'step3Desc')}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t('about', 'step4Title')}</h3>
                  <p className="text-muted-foreground">
                    {t('about', 'step4Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Commitment */}
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <Lock size={32} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">{t('about', 'commitmentTitle')}</h3>
            <p className="text-muted-foreground text-lg">
              {t('about', 'commitmentDesc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
