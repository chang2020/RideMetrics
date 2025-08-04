import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Activity, BarChart3, Users, Home, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import LanguageToggle from "@/components/language-toggle";
import UnitsToggle from "@/components/units-toggle";
import type { User } from "@shared/schema";

export default function Navigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const connectStravaMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/strava/connect"),
    onSuccess: (data: any) => {
      if (data.authUrl) {
        window.open(data.authUrl, '_blank', 'width=600,height=600');
      }
    },
    onError: () => {
      toast({ title: "연결 실패", description: "Strava 연결에 실패했습니다.", variant: "destructive" });
    },
  });

  const syncStravaMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/strava/sync"),
    onSuccess: (data: any) => {
      toast({ 
        title: "동기화 완료", 
        description: `${data.count}개의 활동이 동기화되었습니다.` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
      toast({ title: "동기화 실패", description: "활동 동기화에 실패했습니다.", variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      toast({ title: "로그아웃", description: "성공적으로 로그아웃되었습니다." });
      // Refresh the page to reset state
      window.location.reload();
    },
    onError: () => {
      toast({ title: "로그아웃 실패", description: "로그아웃에 실패했습니다.", variant: "destructive" });
    },
  });

  const navItems = [
    { path: "/", label: t("nav.dashboard"), icon: Home },
    { path: "/groups", label: t("nav.groups"), icon: Users },
    { path: "/activities", label: t("nav.activities"), icon: Activity },
    { path: "/stats", label: t("nav.stats"), icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-strava-orange">CycleConnect</h1>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                        location === item.path
                          ? "text-strava-orange"
                          : "text-gray-700 hover:text-strava-orange"
                      }`}
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <UnitsToggle />
            <LanguageToggle />
            {user?.stravaConnected ? (
              <Button
                onClick={() => syncStravaMutation.mutate()}
                disabled={syncStravaMutation.isPending}
                className="bg-green-600 text-white hover:bg-green-700"
                data-testid="button-strava-sync"
              >
                <Activity className="h-4 w-4 mr-2" />
                {syncStravaMutation.isPending ? "Syncing..." : "Sync Strava"}
              </Button>
            ) : (
              <Button
                onClick={() => connectStravaMutation.mutate()}
                disabled={connectStravaMutation.isPending}
                className="bg-strava-orange text-white hover:bg-orange-600"
                data-testid="button-strava-connect"
              >
                <Activity className="h-4 w-4 mr-2" />
                {connectStravaMutation.isPending ? "Connecting..." : t("strava.connect")}
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback data-testid="text-user-initials">
                  {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700" data-testid="text-username">
                {user?.name || t("general.loading")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="h-8 px-2 text-gray-600 hover:text-gray-900"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
