import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import ReadPage from "./pages/read";
import PlansPage from "./pages/plans";
import SearchPage from "./pages/search";
import AIPage from "./pages/ai";
import ListenPage from "./pages/listen";
import GroupsPage from "./pages/groups";
import PrayPage from "./pages/pray";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/read" element={<ReadPage />} />
            <Route path="/read/:version/:book/:chapter" element={<ReadPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/listen" element={<ListenPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/pray" element={<PrayPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
