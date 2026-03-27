'use client';

import React, { useState } from 'react';
import { Flower2, BarChart3, Wind, Lightbulb, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const peaceTechniques = [
  { id: 'mindfulness', icon: <Brain size={20} className="text-purple-400" /> },
  { id: 'stress', icon: <BarChart3 size={20} className="text-blue-400" /> },
  { id: 'breathing', icon: <Wind size={20} className="text-cyan-400" /> },
  { id: 'affirmations', icon: <Lightbulb size={20} className="text-yellow-400" /> },
  { id: 'meditation', icon: <Flower2 size={20} className="text-indigo-400" /> },
];

export default function MentalPeacePage() {
  const [selectedTechnique, setSelectedTechnique] = useState<string>('mindfulness');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedAdvice, setGeneratedAdvice] = useState<string>('');
  
  const { language, t } = useLanguage();

  const handleSelectTechnique = (id: string) => {
    setSelectedTechnique(id);
    setGeneratedAdvice(''); // Clear generated advice when switching category
  };

  const handleGenerateAdvice = async () => {
    setIsGenerating(true);
    setGeneratedAdvice('');

    const title = t('mentalPeace', `tech_${selectedTechnique}_title`);
    const tech = t('mentalPeace', `tech_${selectedTechnique}_technique`);
    const systemPrompt = `You are a helpful and professional Mental Wellness AI Assistant. The user wants a personalized and specific technique for "${title}". Give them an actionable, calming, and detailed guide for practicing this technique. Provide the response in ${language === 'am' ? 'Amharic' : 'English'}.`;
    const userMessage = `Please give me advice and a technique for: ${title}. Based on: ${tech}`;

    try {
      const response = await fetch('/api/generate-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userMessage, language }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedAdvice(data.reply);
      } else {
        setGeneratedAdvice(language === 'am' ? "ይቅርታ፣ ማመንጨት አልተቻለም።" : "Sorry, failed to generate advice.");
      }
    } catch (error) {
      console.error(error);
      setGeneratedAdvice(language === 'am' ? "ይቅርታ፣ ማመንጨት አልተቻለም።" : "Sorry, failed to generate advice.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentCategory = peaceTechniques.find(tech => tech.id === selectedTechnique);

  return (
    <div className="min-h-screen bg-background">
      <section className="px-6 pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance flex items-center gap-3">
              <Flower2 size={40} className="text-blue-400" />
              {t('mentalPeace', 'title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('mentalPeace', 'description')}
            </p>
          </div>

          {/* Category Selector */}
          <div className="mb-8 flex flex-wrap gap-3">
            {peaceTechniques.map((technique) => (
              <button
                key={technique.id}
                onClick={() => handleSelectTechnique(technique.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 border ${
                  selectedTechnique === technique.id
                    ? 'bg-card border-primary text-foreground'
                    : 'bg-transparent border-border text-muted-foreground hover:border-primary'
                }`}
              >
                {technique.icon}
                <span className="text-sm font-medium">{t('mentalPeace', `tech_${technique.id}_title`)}</span>
              </button>
            ))}
          </div>

          {/* Selected Technique Content */}
          {currentCategory && (
            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{currentCategory.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t('mentalPeace', `tech_${currentCategory.id}_title`)}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('mentalPeace', `tech_${currentCategory.id}_desc`)}
                  </p>
                </div>
              </div>

              {!generatedAdvice && !isGenerating && (
                <p className="text-foreground mb-6 leading-relaxed">
                  {t('mentalPeace', `tech_${currentCategory.id}_technique`)}
                </p>
              )}

              {isGenerating && (
                <div className="py-8 flex justify-center text-muted-foreground animate-pulse">
                  {t('mentalPeace', 'loading')}
                </div>
              )}

              {generatedAdvice && !isGenerating && (
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mb-6 w-full prose prose-sm md:prose-base dark:prose-invert">
                  <div className="text-foreground whitespace-pre-wrap">{generatedAdvice}</div>
                </div>
              )}

              <Button 
                onClick={handleGenerateAdvice} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isGenerating}
              >
                <Flower2 size={18} className="mr-2" />
                {t('mentalPeace', 'getTechniqueBtn').replace('{technique}', t('mentalPeace', `tech_${currentCategory.id}_title`))}
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-center pt-8 border-t border-border">
            <Flower2 size={18} className="text-blue-400 flex-shrink-0" />
            <p>{t('mentalPeace', 'disclaimer')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
