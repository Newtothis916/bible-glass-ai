import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, User, Settings, BookOpen, Bookmark, Download, BarChart3,
  HelpCircle, MessageSquare, Info, Shield, Mail, Heart, Users,
  Headphones, Search, Bot, Calendar, Home, Crown, Brain, Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface FloatingSideNavProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navigationSections = [
  {
    title: "Main",
    items: [
      { id: "home", label: "Home", icon: Home, path: "/" },
      { id: "read", label: "Read Bible", icon: BookOpen, path: "/read" },
      { id: "listen", label: "Listen", icon: Headphones, path: "/listen" },
      { id: "pray", label: "Prayer Journal", icon: Heart, path: "/pray" },
      { id: "groups", label: "Groups", icon: Users, path: "/groups" },
    ]
  },
  {
    title: "Spiritual Growth",
    items: [
      { id: "practices", label: "Guided Practices", icon: Calendar, path: "/practices" },
      { id: "memory", label: "Memory Verses", icon: Brain, path: "/memory" },
      { id: "rule-of-life", label: "Rule of Life", icon: Target, path: "/rule-of-life" },
    ]
  },
  {
    title: "Study Tools",
    items: [
      { id: "plans", label: "Reading Plans", icon: Calendar, path: "/plans" },
      { id: "search", label: "Search", icon: Search, path: "/search" },
      { id: "ai", label: "AI Assistant", icon: Bot, path: "/ai", premium: true },
      { id: "notes", label: "Notes & Highlights", icon: BookOpen, path: "/notes" },
      { id: "bookmarks", label: "Bookmarks", icon: Bookmark, path: "/bookmarks" },
    ]
  },
  {
    title: "Personal",
    items: [
      { id: "profile", label: "Profile", icon: User, path: "/profile" },
      { id: "analytics", label: "Progress", icon: BarChart3, path: "/analytics", premium: true },
      { id: "downloads", label: "Downloads", icon: Download, path: "/downloads", premium: true },
      { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    ]
  },
  {
    title: "Support",
    items: [
      { id: "help", label: "Help Center", icon: HelpCircle, path: "/help" },
      { id: "feedback", label: "Feedback", icon: MessageSquare, path: "/feedback" },
      { id: "contact", label: "Contact Support", icon: Mail, path: "/contact" },
      { id: "giving", label: "Giving", icon: Heart, path: "/giving" },
      { id: "about", label: "About", icon: Info, path: "/about" },
      { id: "privacy", label: "Terms & Privacy", icon: Shield, path: "/privacy" },
    ]
  }
];

export function FloatingSideNav({ className, isOpen, setIsOpen }: FloatingSideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isPremium = false; // TODO: Add subscription logic
  const currentPath = location.pathname;

  // Scroll lock effect
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <LiquidGlassButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300",
          className
        )}
      >
        <Menu className="w-5 h-5" />
      </LiquidGlassButton>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Side Navigation */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 max-w-[90vw] z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <LiquidGlassCard className="h-full m-4 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-inter font-semibold text-foreground">Bible App</h2>
                {user && (
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <LiquidGlassButton
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </LiquidGlassButton>
          </div>

          {/* Premium Status */}
          {isPremium && (
            <div className="px-6 py-3 bg-gradient-primary/10">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Member</span>
              </div>
            </div>
          )}

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <LiquidGlassButton
                      key={item.id}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-full justify-start gap-3 h-10 px-3 font-normal",
                        isActive(item.path) 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-muted text-foreground",
                        item.premium && !isPremium && "opacity-60"
                      )}
                      disabled={item.premium && !isPremium}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.premium && !isPremium && (
                        <Badge variant="secondary" className="text-xs">
                          Pro
                        </Badge>
                      )}
                    </LiquidGlassButton>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4">
            <div className="text-xs text-muted-foreground text-center">
              Version 1.0.0 • Made with ❤️
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </>
  );
}