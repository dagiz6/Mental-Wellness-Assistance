"use client";

import React, { useState } from "react";
import { Heart, Apple, Moon, Droplets, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

const healthAdviceCategories = [
  { id: "general", icon: <Heart size={20} className="text-red-400" /> },
  { id: "nutrition", icon: <Apple size={20} className="text-green-400" /> },
  { id: "sleep", icon: <Moon size={20} className="text-indigo-400" /> },
  { id: "hydration", icon: <Droplets size={20} className="text-blue-400" /> },
  { id: "posture", icon: <Zap size={20} className="text-yellow-400" /> },
];

export default function HealthAdvicePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedAdvice, setGeneratedAdvice] = useState<string>('');

  const { language, t } = useLanguage();

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    setGeneratedAdvice('');
  };

  const handleGenerateAdvice = async () => {
    setIsGenerating(true);
    setGeneratedAdvice('');

    const title = t('healthAdvice', `cat_${selectedCategory}_title`);
    const advice = t('healthAdvice', `cat_${selectedCategory}_advice`);
    const systemPrompt = `You are a helpful and professional Health and Wellness AI Assistant. The user wants personalized advice regarding "${title}". Keep the response practical, actionable, and encouraging, focusing on natural wellness. Provide the response in ${language === 'am' ? 'Amharic' : 'English'}. Remember disclaimer: you are an AI, not a doctor.`;
    const userMessage = `Please give me health advice regarding: ${title}. Base your tips loosely on: ${advice}`;

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

  const currentCategory = healthAdviceCategories.find(
    (cat) => cat.id === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="px-6 pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance flex items-center gap-3">
              <Heart size={40} className="text-red-500" />
              {t('healthAdvice', 'title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('healthAdvice', 'description')}
            </p>
          </div>

          {/* Category Selector */}
          <div className="mb-8 flex flex-wrap gap-3">
            {healthAdviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 border ${
                  selectedCategory === category.id
                    ? "bg-card border-primary text-foreground"
                    : "bg-transparent border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {category.icon}
                <span className="text-sm font-medium">{t('healthAdvice', `cat_${category.id}_title`)}</span>
              </button>
            ))}
          </div>

          {/* Selected Category Content */}
          {currentCategory && (
            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{currentCategory.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t('healthAdvice', `cat_${currentCategory.id}_title`)}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('healthAdvice', `cat_${currentCategory.id}_desc`)}
                  </p>
                </div>
              </div>

              {!generatedAdvice && !isGenerating && (
                <p className="text-foreground mb-6 leading-relaxed">
                  {t('healthAdvice', `cat_${currentCategory.id}_advice`)}
                </p>
              )}

              {isGenerating && (
                <div className="py-8 flex justify-center text-muted-foreground animate-pulse">
                  {t('healthAdvice', 'loading')}
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
                <Heart size={18} className="mr-2" />
                {t('healthAdvice', 'getAdviceBtn').replace('{category}', t('healthAdvice', `cat_${currentCategory.id}_title`))}
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-center pt-8 border-t border-border">
            <Heart size={18} className="text-red-500 flex-shrink-0" />
            <p>
              {t('healthAdvice', 'disclaimer')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
