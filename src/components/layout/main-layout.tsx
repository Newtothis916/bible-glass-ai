import { ReactNode, useState } from "react";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

interface MainLayoutProps {
  children: ReactNode;
  currentTab?: string;
}

export function MainLayout({ children, currentTab = "home" }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState(currentTab);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    
    // Handle navigation to different sections
    switch (tab) {
      case 'home':
        window.location.href = '/';
        break;
      case 'read':
        window.location.href = '/read';
        break;
      case 'listen':
        window.location.href = '/listen';
        break;
      case 'pray':
        window.location.href = '/?tab=pray';
        break;
      case 'groups':
        window.location.href = '/groups';
        break;
      default:
        console.log(`Navigate to: ${tab}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero font-inter">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,206,84,0.3),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(120,119,198,0.2),transparent_50%)]" />
      
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Main content */}
      <div className="relative z-10 pb-20">
        {children}
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} onTabClick={handleTabClick} />
    </div>
  );
}