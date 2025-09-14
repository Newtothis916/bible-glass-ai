import { useOffline } from "@/hooks/use-offline";
import { LiquidGlassCard, CardContent } from "@/components/ui/liquid-glass-card";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs">
      <LiquidGlassCard variant="outline" className="bg-destructive/10 border-destructive/50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm">
            <WifiOff className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-medium">Offline Mode</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Some features may be limited while offline
          </p>
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}

export function ConnectionStatus() {
  const { isOnline } = useOffline();

  return (
    <div className="flex items-center gap-1 text-xs">
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3 text-success" />
          <span className="text-success">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-destructive" />
          <span className="text-destructive">Offline</span>
        </>
      )}
    </div>
  );
}