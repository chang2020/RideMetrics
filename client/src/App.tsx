import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import Groups from "@/pages/groups";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-strava-light">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/groups" component={Groups} />
        <Route path="/activities" component={() => <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><h1 className="text-3xl font-bold">활동 페이지 (개발 예정)</h1></div>} />
        <Route path="/stats" component={() => <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><h1 className="text-3xl font-bold">통계 페이지 (개발 예정)</h1></div>} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
