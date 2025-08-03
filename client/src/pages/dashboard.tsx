import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatsCard from "@/components/stats-card";
import ActivityChart from "@/components/activity-chart";
import CreateGroupModal from "@/components/create-group-modal";
import { Construction, Gauge, Mountain, Crown, Trophy, Medal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function Dashboard() {
  const { data: user } = useQuery({ queryKey: ["/api/user"] });
  const { data: stats } = useQuery({ queryKey: ["/api/stats"] });
  const { data: groups = [] } = useQuery({ queryKey: ["/api/groups"] });
  const { data: activities = [] } = useQuery({ queryKey: ["/api/activities"] });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Strava Connection Status */}
      {!user?.stravaConnected && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-strava-orange to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Strava와 연결하여 시작하세요!</h2>
                <p className="text-orange-100">라이딩 데이터를 자동으로 동기화하고 그룹과 함께 성과를 공유하세요.</p>
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
              title="이번 주 거리"
              value={`${stats?.weeklyDistance || 0}km`}
              change={stats?.weeklyDistance ? "+12%" : undefined}
              icon={Construction}
              iconColor="bg-blue-500"
            />
            <StatsCard
              title="평균 속도"
              value={`${stats?.avgSpeed || 0}km/h`}
              change={stats?.avgSpeed ? "+2.1km/h" : undefined}
              icon={Gauge}
              iconColor="bg-green-500"
            />
            <StatsCard
              title="총 고도 상승"
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
              <CardTitle>최근 활동</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">아직 활동이 없습니다.</p>
                  <p className="text-sm text-gray-400 mt-2">첫 번째 라이딩을 기록해보세요!</p>
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
                          {formatDistanceToNow(new Date(activity.startTime), { addSuffix: true, locale: ko })} • 
                          {(activity.distance / 1000).toFixed(1)}km • 
                          {Math.floor(activity.duration / 60)}분
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900" data-testid="text-activity-speed">
                          {(activity.averageSpeed / 10).toFixed(1)}km/h
                        </p>
                        <p className="text-sm text-gray-600">평균 속도</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">새 그룹 만들기</h3>
              <p className="text-sm text-gray-600 mb-4">친구들과 함께 라이딩하고 성과를 공유해보세요!</p>
              <CreateGroupModal />
            </CardContent>
          </Card>

          {/* My Groups */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>내 그룹</CardTitle>
              <Badge variant="secondary" data-testid="text-groups-count">{groups.length}개</Badge>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">아직 그룹에 가입하지 않았습니다.</p>
                  <p className="text-sm text-gray-400 mt-2">첫 번째 그룹을 만들어보세요!</p>
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
                        <p className="text-sm text-gray-600" data-testid="text-group-stats">새 그룹 • 이번 주 0km</p>
                      </div>
                      <Crown className="h-4 w-4 text-yellow-500" title="관리자" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Leaderboard */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>그룹 순위</CardTitle>
              <select className="text-sm border-gray-300 rounded-md" data-testid="select-leaderboard-group">
                <option>그룹을 선택하세요</option>
                {groups.map((group: any) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">그룹 순위를 보려면 그룹을 선택하세요.</p>
              </div>
            </CardContent>
          </Card>

          {/* Group Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>그룹 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">아직 그룹 활동이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">그룹에 가입하고 활동을 시작해보세요!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
