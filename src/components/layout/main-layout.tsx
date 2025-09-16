import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { FloatingSideNav } from "@/components/navigation/floating-side-nav";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

interface MainLayoutProps {
  children: ReactNode;
  currentTab?: string;
}

export function MainLayout({ children, currentTab }: MainLayoutProps) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)_/_0.05),transparent_50%),radial-gradient(circle_at_80%_20%,hsl(var(--primary-light)_/_0.08),transparent_50%)]" />
      </div>
      
      {/* Floating Side Navigation */}
      <FloatingSideNav 
        isOpen={isSideNavOpen} 
        setIsOpen={setIsSideNavOpen} 
      />
      
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Main content with proper mobile spacing */}
      <div className="relative z-10 min-h-screen">
        <div className="pb-20 pt-16 safe-area-inset">
          {children}
        </div>
      </div>

      {/* Mobile Navigation - Hidden when side nav is open */}
      {!isSideNavOpen && (
        <div className="z-40">
          <MobileNav activeTab={getActiveTab()} onTabClick={handleTabClick} />
        </div>
      )}
    </div>
  );
}