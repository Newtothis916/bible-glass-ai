import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import ReadPage from "./pages/read";
import PlansPage from "./pages/plans";
import SearchPage from "./pages/search";
import AIPage from "./pages/ai";
import ListenPage from "./pages/listen";
import GroupsPage from "./pages/groups";
import PrayPage from "./pages/pray";
import PracticesPage from "./pages/practices";
import MemoryPage from "./pages/memory";
import RuleOfLifePage from "./pages/rule-of-life";
import Success from "./pages/success";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import NotesPage from "./pages/notes";
import BookmarksPage from "./pages/bookmarks";
import DownloadsPage from "./pages/downloads";
import AnalyticsPage from "./pages/analytics";
import HelpPage from "./pages/help";
import FeedbackPage from "./pages/feedback";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import GivingPage from "./pages/giving";
import PrivacyPage from "./pages/privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
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
            <Route path="/practices" element={<PracticesPage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/rule-of-life" element={<RuleOfLifePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/giving" element={<GivingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/success" element={<Success />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
