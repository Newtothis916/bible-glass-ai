import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Dashboard } from "@/components/home/dashboard";
import { BibleReader } from "@/components/bible/bible-reader";
import { AIAssistant } from "@/components/ai/ai-assistant";
import { PrayerJournal } from "@/components/prayer/prayer-journal";
import { PremiumFeatures } from "@/components/premium/premium-features";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'read' | 'ai' | 'pray' | 'premium'>('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard />;
      case 'read':
        return <BibleReader />;
      case 'ai':
        return <AIAssistant />;
      case 'pray':
        return <PrayerJournal />;
      case 'premium':
        return <PremiumFeatures />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout currentTab={currentView}>
      <div className="min-h-screen">
        {renderCurrentView()}
        
        {/* Temporary Navigation for Demo */}
        <div className="fixed top-4 right-4 z-50 flex gap-2 flex-wrap max-w-xs">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'home' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'bg-glass-bg backdrop-blur-md text-muted-foreground hover:text-primary'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('read')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'read' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'bg-glass-bg backdrop-blur-md text-muted-foreground hover:text-primary'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setCurrentView('ai')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'ai' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'bg-glass-bg backdrop-blur-md text-muted-foreground hover:text-primary'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setCurrentView('pray')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'pray' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'bg-glass-bg backdrop-blur-md text-muted-foreground hover:text-primary'
            }`}
          >
            Pray
          </button>
          <button
            onClick={() => setCurrentView('premium')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'premium' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'bg-glass-bg backdrop-blur-md text-muted-foreground hover:text-primary'
            }`}
          >
            Premium
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
