import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { useLanguage } from "@/lib/i18n";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

export default function ActivityChart() {
  const { t } = useLanguage();
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.weeklyPerformance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">{t("stats.loading")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats?.weeklyData || stats.weeklyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.weeklyPerformance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">{t("stats.noData")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: stats.weeklyData.map((week) => week.week),
    datasets: [
      {
        label: t("stats.distance"),
        data: stats.weeklyData.map((week) => week.distance),
        borderColor: "hsl(14, 98%, 49%)",
        backgroundColor: "rgba(252, 76, 2, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: t("stats.speed"),
        data: stats.weeklyData.map((week) => week.speed),
        borderColor: "hsl(142, 76%, 36%)",
        backgroundColor: "rgba(56, 161, 105, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: t("stats.distance"),
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: t("stats.speed"),
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dashboard.weeklyPerformance")}</CardTitle>
        <select className="text-sm border-gray-300 rounded-md" data-testid="select-time-period">
          <option>{t("stats.weeklyData")}</option>
          <option>Last 8 weeks</option>
          <option>Last 3 months</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="h-64" data-testid="chart-weekly-performance">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
