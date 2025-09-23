import { Home, BookOpen, HeadphonesIcon, Heart, Users } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "read", label: "Read", icon: BookOpen },
  { id: "listen", label: "Listen", icon: HeadphonesIcon },
  { id: "pray", label: "Pray", icon: Heart },
  { id: "groups", label: "Groups", icon: Users },
];

export function MobileNav({ activeTab, onTabClick }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-glass-bg backdrop-blur-xl border-t border-glass-border shadow-glass-lg">
      <div className="px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <LiquidGlassButton
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => onTabClick(id)}
              className={cn(
                "flex flex-col items-center gap-1 h-14 px-3 py-2 text-xs font-medium transition-all duration-300 mobile-touch-target rounded-xl backdrop-blur-sm",
                activeTab === id 
                  ? "text-primary-foreground bg-primary/90 backdrop-blur-md shadow-glow border border-primary/30" 
                  : "text-muted-foreground hover:text-primary hover:bg-white/10 hover:backdrop-blur-md hover:border-white/20 border border-transparent"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </LiquidGlassButton>
          ))}
        </div>
      </div>
    </nav>
  );
}