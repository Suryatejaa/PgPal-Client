import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  type: "line" | "bar" | "pie";
  data: any;
  options?: any;
  title?: string;
  height?: number;
}

const DashboardChart: React.FC<ChartProps> = ({
  type,
  data,
  options,
  title,
  height = 300,
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales:
      type !== "pie"
        ? {
            y: {
              beginAtZero: true,
            },
          }
        : undefined,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const renderChart = () => {
    switch (type) {
      case "line":
        return <Line data={data} options={mergedOptions} />;
      case "bar":
        return <Bar data={data} options={mergedOptions} />;
      case "pie":
        return <Pie data={data} options={mergedOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {title && !options?.plugins?.title?.display && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }}>{renderChart()}</div>
    </div>
  );
};

export default DashboardChart;
