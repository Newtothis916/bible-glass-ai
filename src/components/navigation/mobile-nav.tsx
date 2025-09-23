import { Home, BookOpen, HeadphonesIcon, Heart, Users } from "lucide-react";
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-2xl shadow-glass-lg">
      <div className="px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabClick(id)}
              className={cn(
                "flex flex-col items-center gap-1 h-14 px-3 py-2 text-xs font-medium transition-all duration-300 mobile-touch-target rounded-xl backdrop-blur-md bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 active:bg-transparent",
                activeTab === id 
                  ? "text-foreground bg-white/10 backdrop-blur-lg" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:backdrop-blur-lg"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}