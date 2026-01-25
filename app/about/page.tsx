'use client';

import { Lock, Zap, BookOpen, Activity, MessageCircle, Gift } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 flex items-center gap-4">
              <span className="text-4xl">🕉️</span>
              <span className="text-balance">About Vihaara</span>
            </h1>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-balance">
              Vihaara — derived from Sanskrit, meaning lifestyle or mindful dwelling — is your personal
              sanctuary for mental clarity and emotional well-being. Inspired by ancient concepts of balance and
              modern intelligence, Vihaara blends the wisdom of mindful living with the power of advanced AI.
            </p>
          </div>

          {/* Our Mission */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed text-balance">
                Our mission is simple: To provide a private, intelligent, and comforting space for daily self-care, reflection, and
                emotional support — without judgment, tracking, or cloud storage.
              </p>
              <p className="text-lg leading-relaxed text-balance">
                Whether you're journaling your thoughts, checking in on your mood, or seeking health and wellness tips,
                Vihaara is designed to meet you with calm, insight, and compassion — every single day.
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">Privacy First</h3>
                  <p className="text-muted-foreground">
                    All your data stays on your device. Nothing is sent to the cloud.
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Insights</h3>
                  <p className="text-muted-foreground">
                    Advanced AI helps you understand patterns and provides personalized guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center mb-16 py-8">
            <p className="text-2xl italic text-primary font-light">
              "Live gently. Think clearly. Feel deeply."
            </p>
          </div>

          {/* How Vihaara Works */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-primary rounded"></div>
              <h2 className="text-3xl font-bold text-foreground">How Vihaara Works</h2>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Journal Your Thoughts</h3>
                  <p className="text-muted-foreground">
                    Write down your feelings and experiences. Vihaara's AI will analyze the emotions and provide insights.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Track Your Mood</h3>
                  <p className="text-muted-foreground">
                    Log your daily mood with simple selections. Discover patterns over time.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Chat with Your AI</h3>
                  <p className="text-muted-foreground">
                    Have supportive conversations with Vihaara's AI assistant for guidance and mental wellness tips.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Receive Daily Tips</h3>
                  <p className="text-muted-foreground">
                    Get personalized wellness suggestions based on your mood patterns and journal content.
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
            <h3 className="text-2xl font-bold text-foreground mb-3">Privacy Commitment</h3>
            <p className="text-muted-foreground text-lg">
              Your mental wellness journey is deeply personal. We're committed to protecting your privacy and ensuring your data
              remains yours alone—always stored locally, never shared, and completely secure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
