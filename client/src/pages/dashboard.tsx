import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatsCard from "@/components/stats-card";
import ActivityChart from "@/components/activity-chart";
import CreateGroupModal from "@/components/create-group-modal";
import { Construction, Gauge, Mountain, Crown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import { useLanguage } from "@/lib/i18n";
import { useUnits } from "@/lib/units";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { User, Group, Activity } from "@shared/schema";

interface StatsData {
  weeklyDistance: number;
  avgSpeed: number;
  elevation: number;
  weeklyData: Array<{
    week: string;
    distance: number;
    speed: number;
  }>;
}

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { convertDistance, getDistanceLabel, convertSpeed, getSpeedLabel } = useUnits();
  const { data: user } = useQuery<User>({ queryKey: ["/api/user"] });
  const { data: stats } = useQuery<StatsData>({ queryKey: ["/api/stats"] });
  const { data: groups = [] } = useQuery<Group[]>({ queryKey: ["/api/groups"] });
  const { data: activities = [] } = useQuery<Activity[]>({ queryKey: ["/api/activities"] });

  const dateLocale = language === "ko" ? ko : enUS;

  // Handle OAuth callback results
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stravaResult = urlParams.get('strava');
    
    if (stravaResult === 'connected') {
      toast({
        title: "Strava 연결 성공",
        description: "Strava 계정이 성공적으로 연결되었습니다!",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (stravaResult === 'error') {
      toast({
        title: "Strava 연결 실패",
        description: "Strava 연결 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Strava Connection Status */}
      {!user?.stravaConnected && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-strava-orange to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{t("dashboard.connectStrava.title")}</h2>
                <p className="text-orange-100">{t("dashboard.connectStrava.description")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Statistics & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title={t("dashboard.weeklyDistance")}
              value={`${convertDistance((stats?.weeklyDistance || 0) * 1000).toFixed(1)}${getDistanceLabel()}`}
              change={stats?.weeklyDistance ? "+12%" : undefined}
              icon={Construction}
              iconColor="bg-blue-500"
            />
            <StatsCard
              title={t("dashboard.avgSpeed")}
              value={`${convertSpeed((stats?.avgSpeed || 0) / 3.6).toFixed(1)}${getSpeedLabel()}`}
              change={stats?.avgSpeed ? "+2.1" + getSpeedLabel() : undefined}
              icon={Gauge}
              iconColor="bg-green-500"
            />
            <StatsCard
              title={t("dashboard.elevation")}
              value={`${stats?.elevation || 0}m`}
              change={stats?.elevation ? "+18%" : undefined}
              icon={Mountain}
              iconColor="bg-purple-500"
            />
          </div>

          {/* Weekly Performance Chart */}
          <ActivityChart />

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.recentActivities")}</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t("dashboard.noActivities")}</p>
                  <p className="text-sm text-gray-400 mt-2">{t("dashboard.firstRide")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 3).map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg" data-testid={`activity-${activity.id}`}>
                      <div className="w-12 h-12 bg-strava-orange rounded-lg flex items-center justify-center">
                        <Construction className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900" data-testid="text-activity-title">{activity.title}</h4>
                        <p className="text-sm text-gray-600" data-testid="text-activity-details">
                          {formatDistanceToNow(new Date(activity.startTime), { addSuffix: true, locale: dateLocale })} • 
                          {convertDistance(activity.distance).toFixed(1)}{getDistanceLabel()} • 
                          {Math.floor(activity.duration / 60)}{language === "ko" ? "분" : "min"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900" data-testid="text-activity-speed">
                          {(activity.averageSpeed / 10).toFixed(1)}km/h
                        </p>
                        <p className="text-sm text-gray-600">{t("stats.avgSpeed")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Groups & Social */}
        <div className="space-y-6">
          {/* Create Group CTA */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("dashboard.createGroup")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("dashboard.createGroupDescription")}</p>
              <CreateGroupModal />
            </CardContent>
          </Card>

          {/* My Groups */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("dashboard.myGroups")}</CardTitle>
              <Badge variant="secondary" data-testid="text-groups-count">{groups.length}{language === "ko" ? "개" : ""}</Badge>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t("dashboard.noGroups")}</p>
                  <p className="text-sm text-gray-400 mt-2">{t("dashboard.firstGroup")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map((group: any) => (
                    <div key={group.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" data-testid={`group-${group.id}`}>
                      <div className="w-12 h-12 bg-strava-orange rounded-lg flex items-center justify-center text-white font-semibold">
                        {group.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900" data-testid="text-group-name">{group.name}</h4>
                        <p className="text-sm text-gray-600" data-testid="text-group-stats">{t("general.newGroup")} • {t("groups.thisWeek")} 0km</p>
                      </div>
                      <Crown className="h-4 w-4 text-yellow-500" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Leaderboard */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("dashboard.groupLeaderboard")}</CardTitle>
              <select className="text-sm border-gray-300 rounded-md" data-testid="select-leaderboard-group">
                <option>{t("dashboard.selectGroup")}</option>
                {groups.map((group: any) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">{t("dashboard.selectGroupPrompt")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Group Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.groupActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">{t("dashboard.noGroupActivity")}</p>
                <p className="text-sm text-gray-400 mt-2">{t("dashboard.joinAndStart")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
