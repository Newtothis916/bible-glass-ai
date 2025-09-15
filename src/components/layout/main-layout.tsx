import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { FloatingSideNav } from "@/components/navigation/floating-side-nav";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

interface MainLayoutProps {
  children: ReactNode;
  currentTab?: string;
}

export function MainLayout({ children, currentTab }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from current route
  const getActiveTab = () => {
    if (currentTab) return currentTab;
    
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/read')) return 'read';
    if (path.startsWith('/listen')) return 'listen';
    if (path.startsWith('/pray')) return 'pray';
    if (path.startsWith('/groups')) return 'groups';
    return 'home';
  };

  const handleTabClick = (tab: string) => {
    // Fast client-side navigation using React Router
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'read':
        navigate('/read');
        break;
      case 'listen':
        navigate('/listen');
        break;
      case 'pray':
        navigate('/pray');
        break;
      case 'groups':
        navigate('/groups');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(274_94%_38%_/_0.05),transparent_50%),radial-gradient(circle_at_80%_20%,hsl(275_60%_84%_/_0.08),transparent_50%)]" />
      </div>
      
      {/* Floating Side Navigation */}
      <FloatingSideNav />
      
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Main content */}
      <div className="relative z-10 pb-20">
        {children}
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={getActiveTab()} onTabClick={handleTabClick} />
    </div>
  );
}