import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  iconColor: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconColor,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600" data-testid="text-stats-title">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900" data-testid="text-stats-value">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${iconColor}`}>
            <Icon className="text-white" />
          </div>
        </div>
        {change && (
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span
                className={`font-medium ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
                data-testid="text-stats-change"
              >
                {change}
              </span>
              <span className="text-gray-600 ml-1">지난 주 대비</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
