import DailyInsightCard from '@/components/daily-insight-card';
import QuickAccessSection from '@/components/quick-access-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-6xl mx-auto ">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Welcome to MindMate
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Your sanctuary for mental clarity and emotional well-being
          </p>

          {/* Daily Insight Card */}
          <DailyInsightCard />

          {/* Quick Access Section */}
          <QuickAccessSection />

          {/* Recent Activity Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-primary rounded"></div>
              <h2 className="text-2xl font-semibold text-foreground">Recent Activity</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              <p>No recent activity yet. Start your wellness journey today!</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
