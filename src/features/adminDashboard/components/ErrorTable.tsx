import React, { useState } from "react";
import type { ErrorLog } from "../services/monitoringService";

interface ErrorTableProps {
  errors: ErrorLog[];
  loading?: boolean;
  onViewDetails?: (error: ErrorLog) => void;
}

const ErrorTable: React.FC<ErrorTableProps> = ({
  errors,
  loading = false,
  onViewDetails,
}) => {
  const [sortField, setSortField] = useState<keyof ErrorLog>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof ErrorLog) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedErrors = [...errors].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getStatusColor = (status: number) => {
    if (status >= 500) return "bg-red-100 text-red-800";
    if (status >= 400) return "bg-yellow-100 text-yellow-800";
    if (status >= 300) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getServiceColor = (service: string) => {
    const colors = {
      "auth-service": "bg-purple-100 text-purple-800",
      "property-service": "bg-blue-100 text-blue-800",
      "room-service": "bg-green-100 text-green-800",
      "tenant-service": "bg-yellow-100 text-yellow-800",
      "payment-service": "bg-red-100 text-red-800",
      gateway: "bg-gray-100 text-gray-800",
    };
    return (
      colors[service as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "N/A";
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Recent Errors
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Recent Errors
        </h3>
      </div>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-200">
          {sortedErrors.map((error) => (
            <div key={error.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        error.status
                      )}`}
                    >
                      {error.status}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getServiceColor(
                        error.service
                      )}`}
                    >
                      {error.service}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {error.method} {error.url}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(error.timestamp)}
                  </p>
                </div>
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(error)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50"
                    title="View Details"
                  >
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <p className="font-medium">
                    {formatDuration(error.duration)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">User:</span>
                  <p className="font-medium truncate">
                    {error.userId || "Anonymous"}
                  </p>
                </div>
              </div>

              {error.error && (
                <div>
                  <span className="text-xs text-gray-500">Error:</span>
                  <p className="text-xs text-red-600 mt-1 truncate">
                    {error.error}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center">
                  Time
                  {sortField === "timestamp" && (
                    <svg
                      className={`w-4 h-4 ml-1 ${
                        sortDirection === "asc" ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("service")}
              >
                Service
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endpoint
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error
              </th>
              {onViewDetails && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedErrors.map((error) => (
              <tr key={error.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTimestamp(error.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getServiceColor(
                      error.service
                    )}`}
                  >
                    {error.service}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      error.status
                    )}`}
                  >
                    {error.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="font-medium">{error.method}</span>{" "}
                  {error.url.length > 40
                    ? `${error.url.substring(0, 40)}...`
                    : error.url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(error.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">
                      {error.userId || "Anonymous"}
                    </div>
                    {error.userRole && (
                      <div className="text-xs text-gray-500">
                        {error.userRole}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-red-600 max-w-xs">
                  <span className="truncate">{error.error || "N/A"}</span>
                </td>
                {onViewDetails && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(error)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="View Details"
                    >
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No errors found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All services are running smoothly.
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorTable;
