"use client";

import React from "react";

import { useState } from "react";
import { Heart, Apple, Moon, Droplets, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdviceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  advice: string;
}

const healthAdviceCategories: AdviceCategory[] = [
  {
    id: "general",
    title: "General Wellness",
    icon: <Heart size={20} className="text-red-400" />,
    description: "Overall wellness advice for a balanced, healthy lifestyle.",
    advice:
      "Maintain a consistent sleep schedule, stay hydrated, exercise regularly, and eat balanced meals. Aim for 7-9 hours of sleep, drink at least 8 glasses of water daily, and engage in at least 150 minutes of moderate physical activity per week.",
  },
  {
    id: "nutrition",
    title: "Nutrition",
    icon: <Apple size={20} className="text-green-400" />,
    description: "Evidence-based nutritional guidance for optimal health.",
    advice:
      "Incorporate a variety of whole foods including fruits, vegetables, lean proteins, and whole grains. Reduce processed foods and added sugars. Consider consulting a nutritionist for personalized meal plans.",
  },
  {
    id: "sleep",
    title: "Sleep",
    icon: <Moon size={20} className="text-indigo-400" />,
    description: "Tips for better sleep quality and sleep hygiene.",
    advice:
      "Create a dark, quiet, and cool sleep environment. Avoid screens 30 minutes before bed. Maintain a consistent sleep schedule even on weekends. Try relaxation techniques like deep breathing or meditation.",
  },
  {
    id: "hydration",
    title: "Hydration",
    icon: <Droplets size={20} className="text-blue-400" />,
    description: "Guidance on proper hydration and fluid intake.",
    advice:
      "Drink water throughout the day, not just when thirsty. Aim for 2-3 liters daily, adjusting for activity level and climate. Include hydrating foods like fruits and vegetables.",
  },
  {
    id: "posture",
    title: "Posture",
    icon: <Zap size={20} className="text-yellow-400" />,
    description: "Exercises and tips for maintaining healthy posture.",
    advice:
      "Keep your shoulders relaxed, maintain neutral spine alignment, and take frequent breaks when sitting. Practice stretching and strengthening exercises daily to support good posture.",
  },
];

export default function HealthAdvicePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("general");

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
              Health Advice
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get evidence-based advice for improving your physical health and
              wellbeing. Select a category below to receive personalized
              suggestions that align with your needs.
            </p>
          </div>

          {/* Category Selector */}
          <div className="mb-8 flex flex-wrap gap-3">
            {healthAdviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 border ${
                  selectedCategory === category.id
                    ? "bg-card border-primary text-foreground"
                    : "bg-transparent border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {category.icon}
                <span className="text-sm font-medium">{category.title}</span>
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
                    {currentCategory.title} Tips
                  </h2>
                  <p className="text-muted-foreground">
                    {currentCategory.description}
                  </p>
                </div>
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                {currentCategory.advice}
              </p>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Heart size={18} className="mr-2" />
                Get {currentCategory.title} Advice
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-center pt-8 border-t border-border">
            <Heart size={18} className="text-red-500 flex-shrink-0" />
            <p>
              Always consult healthcare professionals for personalized medical
              advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
