import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendValue,
  icon,
  color = "blue",
  loading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    red: "bg-red-50 text-red-600 border-red-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    stable: "text-gray-500",
  };

  const trendIcons = {
    up: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 17l9.2-9.2M17 17V7H7"
        />
      </svg>
    ),
    down: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7l9.2 9.2M17 7v10H7"
        />
      </svg>
    ),
    stable: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 12H4"
        />
      </svg>
    ),
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>
          {trend && trendValue && (
            <div
              className={`flex items-center mt-2 text-xs sm:text-sm ${trendColors[trend]}`}
            >
              {trendIcons[trend]}
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>
        <div
          className={`flex-shrink-0 p-2 sm:p-3 rounded-lg border ${colorClasses[color]}`}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
