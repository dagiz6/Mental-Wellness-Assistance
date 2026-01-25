'use client';

import Link from 'next/link';
import { BookOpen, MessageCircle, Flower2 } from 'lucide-react';

const quickAccessItems = [
  {
    title: 'Journal',
    description: 'Reflect and get AI insights',
    href: '/journal',
    icon: BookOpen,
    bgColor: 'from-purple-500/20 to-purple-600/20',
    iconColor: '#a855f7',
  },
  {
    title: 'AI Chat',
    description: 'Talk to your wellness AI',
    href: '/chat',
    icon: MessageCircle,
    bgColor: 'from-blue-500/20 to-blue-600/20',
    iconColor: '#3b82f6',
  },
  {
    title: 'Mental Peace',
    description: 'Inner calm techniques',
    href: '/mental-peace',
    icon: Flower2,
    bgColor: 'from-cyan-500/20 to-cyan-600/20',
    iconColor: '#06b6d4',
  },
];

export default function QuickAccessSection() {
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-primary rounded"></div>
        <h2 className="text-2xl font-semibold text-foreground">Quick Access</h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickAccessItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-opacity-80 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center h-full">
                {/* Icon Container */}
                <div className="mb-6 group-hover:scale-125 transition-transform duration-300">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${item.iconColor}40 0%, ${item.iconColor}20 100%)`,
                    }}
                  >
                    <Icon size={40} style={{ color: item.iconColor }} className="drop-shadow-md" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
