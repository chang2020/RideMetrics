import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateGroupModal from "@/components/create-group-modal";
import { Button } from "@/components/ui/button";
import { Crown, Users, TrendingUp, Plus } from "lucide-react";
import type { Group } from "@shared/schema";

export default function Groups() {
  const { data: groups = [], isLoading } = useQuery<Group[]>({ queryKey: ["/api/groups"] });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">그룹</h1>
          <p className="text-gray-600 mt-2">사이클링 그룹에 참여하고 함께 라이딩을 즐겨보세요</p>
        </div>
        <CreateGroupModal>
          <Button className="bg-strava-orange text-white hover:bg-orange-600" data-testid="button-create-group-header">
            <Plus className="h-4 w-4 mr-2" />
            그룹 만들기
          </Button>
        </CreateGroupModal>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 그룹이 없습니다</h3>
            <p className="text-gray-600 mb-6">첫 번째 사이클링 그룹을 만들어 친구들과 함께 라이딩을 시작해보세요!</p>
            <CreateGroupModal>
              <Button className="bg-strava-orange text-white hover:bg-orange-600" data-testid="button-create-first-group">
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 그룹 만들기
              </Button>
            </CreateGroupModal>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group: any) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer" data-testid={`group-card-${group.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-strava-orange rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg" data-testid="text-group-card-name">{group.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" data-testid="text-group-visibility">
                          {group.visibility === "public" ? "공개" : group.visibility === "private" ? "비공개" : "초대만"}
                        </Badge>
                        <Crown className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4" data-testid="text-group-description">
                  {group.description || "그룹 설명이 없습니다."}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span data-testid="text-group-member-count">1명</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span data-testid="text-group-weekly-distance">이번 주 0km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Suggested Groups Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 그룹</h2>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">추천할 그룹이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">더 많은 그룹이 생기면 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
}
