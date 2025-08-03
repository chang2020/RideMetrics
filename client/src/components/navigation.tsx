import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Activity, BarChart3, Users, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function Navigation() {
  const [location] = useLocation();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const connectStravaMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/strava/connect"),
    onSuccess: () => {
      toast({ title: "Strava 연결 성공", description: "Strava와 성공적으로 연결되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: () => {
      toast({ title: "연결 실패", description: "Strava 연결에 실패했습니다.", variant: "destructive" });
    },
  });

  const navItems = [
    { path: "/", label: "대시보드", icon: Home },
    { path: "/groups", label: "그룹", icon: Users },
    { path: "/activities", label: "활동", icon: Activity },
    { path: "/stats", label: "통계", icon: BarChart3 },
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
            <Button
              onClick={() => connectStravaMutation.mutate()}
              disabled={connectStravaMutation.isPending || user?.stravaConnected}
              className="bg-strava-orange text-white hover:bg-orange-600"
              data-testid="button-strava-connect"
            >
              <Activity className="h-4 w-4 mr-2" />
              {user?.stravaConnected ? "Strava 연결됨" : "Strava 연결"}
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback data-testid="text-user-initials">
                  {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700" data-testid="text-username">
                {user?.name || "Loading..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
