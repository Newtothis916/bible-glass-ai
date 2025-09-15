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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-2 shadow-xl">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <LiquidGlassButton
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onTabClick(id)}
            className={cn(
              "flex flex-col items-center gap-1 h-14 px-3 py-2 text-xs font-inter font-normal tracking-tighter transition-all duration-300",
              activeTab === id 
                ? "text-primary-foreground bg-primary shadow-xl hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/20" 
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </LiquidGlassButton>
        ))}
      </div>
    </nav>
  );
}