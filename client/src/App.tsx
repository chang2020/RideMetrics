import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LanguageProvider from "@/components/language-provider";
import UnitsProvider from "@/components/units-provider";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import Groups from "@/pages/groups";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { useLanguage } from "@/lib/i18n";
import type { User } from "@shared/schema";

function Router() {
  const { t } = useLanguage();
  
  // Check authentication status
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Show login page if not authenticated
  if (error || (!isLoading && !user)) {
    return <Login />;
  }

  // Show loading or authenticated app
  if (isLoading) {
    return (
      <div className="min-h-screen bg-strava-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-strava-orange mx-auto mb-4"></div>
          <p className="text-strava-gray">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-strava-light">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/groups" component={Groups} />
        <Route path="/activities" component={() => <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><h1 className="text-3xl font-bold">{t("nav.activities")} (Coming Soon)</h1></div>} />
        <Route path="/stats" component={() => <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><h1 className="text-3xl font-bold">{t("nav.stats")} (Coming Soon)</h1></div>} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <UnitsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UnitsProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
