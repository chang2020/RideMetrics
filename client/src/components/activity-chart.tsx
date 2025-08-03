import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
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
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주간 성과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">차트를 로딩 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats?.weeklyData || stats.weeklyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주간 성과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">활동 데이터가 없습니다. 첫 번째 라이딩을 시작해보세요!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: stats.weeklyData.map((week) => week.week),
    datasets: [
      {
        label: "거리 (km)",
        data: stats.weeklyData.map((week) => week.distance),
        borderColor: "hsl(14, 98%, 49%)",
        backgroundColor: "rgba(252, 76, 2, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "평균 속도 (km/h)",
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
          text: "거리 (km)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "속도 (km/h)",
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
        <CardTitle>주간 성과</CardTitle>
        <select className="text-sm border-gray-300 rounded-md" data-testid="select-time-period">
          <option>지난 4주</option>
          <option>지난 8주</option>
          <option>지난 3개월</option>
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
