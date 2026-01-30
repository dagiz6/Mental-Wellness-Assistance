'use client';

import React from "react"

import { useState } from 'react';
import { Flower2, BarChart3, Wind, Lightbulb, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PeaceTechnique {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  technique: string;
}

const peaceTechniques: PeaceTechnique[] = [
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    icon: <Brain size={20} className="text-purple-400" />,
    description: 'Present-moment awareness practices to calm your mind.',
    technique: 'Start with 5-10 minute sessions. Sit comfortably and focus on your breath. When your mind wanders, gently bring attention back to the present moment without judgment. Practice daily for best results.',
  },
  {
    id: 'stress-relief',
    title: 'Stress Relief',
    icon: <BarChart3 size={20} className="text-blue-400" />,
    description: 'Techniques to manage and reduce stress levels.',
    technique: 'Try progressive muscle relaxation: tense and release each muscle group for 5 seconds. Use the 4-7-8 breathing method: inhale for 4 counts, hold for 7, exhale for 8. Practice these daily.',
  },
  {
    id: 'breathing',
    title: 'Breathing',
    icon: <Wind size={20} className="text-cyan-400" />,
    description: 'Breathing exercises for instant calm and relaxation.',
    technique: 'Box breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5-10 times. Alternate nostril breathing: Close right nostril, inhale left, switch, exhale right.',
  },
  {
    id: 'affirmations',
    title: 'Affirmations',
    icon: <Lightbulb size={20} className="text-yellow-400" />,
    description: 'Positive affirmations to build mental resilience.',
    technique: 'Choose 2-3 affirmations that resonate with you. Repeat them daily, preferably in the morning and evening. Examples: "I am capable," "I am worthy," "I choose peace."',
  },
  {
    id: 'meditation',
    title: 'Meditation',
    icon: <Flower2 size={20} className="text-indigo-400" />,
    description: 'Guided meditation for emotional balance and clarity.',
    technique: 'Find a quiet space and sit comfortably. Close your eyes and focus on a mantra or breath. Start with 10-15 minutes daily. Guided meditation apps can help you get started.',
  },
];

export default function MentalPeacePage() {
  const [selectedTechnique, setSelectedTechnique] = useState<string>('mindfulness');
  
  const currentTechnique = peaceTechniques.find(tech => tech.id === selectedTechnique);

  return (
    <div className="min-h-screen bg-background">
      <section className="px-6 pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance flex items-center gap-3">
              <Flower2 size={40} className="text-blue-400" />
              Mental Peace
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover techniques for cultivating mental peace and emotional balance. Select a category to receive guidance
              that can help bring tranquility to your busy life.
            </p>
          </div>

          {/* Category Selector */}
          <div className="mb-8 flex flex-wrap gap-3">
            {peaceTechniques.map((technique) => (
              <button
                key={technique.id}
                onClick={() => setSelectedTechnique(technique.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 border ${
                  selectedTechnique === technique.id
                    ? 'bg-card border-primary text-foreground'
                    : 'bg-transparent border-border text-muted-foreground hover:border-primary'
                }`}
              >
                {technique.icon}
                <span className="text-sm font-medium">{technique.title}</span>
              </button>
            ))}
          </div>

          {/* Selected Technique Content */}
          {currentTechnique && (
            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{currentTechnique.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{currentTechnique.title}</h2>
                  <p className="text-muted-foreground">{currentTechnique.description}</p>
                </div>
              </div>

              <p className="text-foreground mb-6 leading-relaxed">{currentTechnique.technique}</p>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Flower2 size={18} className="mr-2" />
                Get {currentTechnique.title} Technique
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-center pt-8 border-t border-border">
            <Flower2 size={18} className="text-blue-400 flex-shrink-0" />
            <p>For persistent mental health concerns, please consult with a qualified professional.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
