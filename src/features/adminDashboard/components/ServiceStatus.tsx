import React from "react";
import type { ServiceInfo } from "../services/monitoringService";

interface ServiceStatusProps {
  services: Record<string, ServiceInfo>;
  loading?: boolean;
  onViewService?: (serviceName: string) => void;
}

const ServiceStatus: React.FC<ServiceStatusProps> = ({
  services,
  loading = false,
  onViewService,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unhealthy":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "healthy":
        return (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "degraded":
        return (
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "unhealthy":
        return (
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
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const formatServiceName = (serviceName: string) => {
    return serviceName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatErrorRate = (errorRate?: string) => {
    if (!errorRate) return "0%";
    return `${parseFloat(errorRate).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Service Status
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const serviceEntries = Object.entries(services);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Service Status
        </h3>
      </div>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-200">
          {serviceEntries.map(([serviceName, service]) => (
            <div key={serviceName} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg border ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {getStatusIcon(service.status)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {formatServiceName(serviceName)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Port: {service.port}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    service.status
                  )}`}
                >
                  {service.status || "Unknown"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Error Rate:</span>
                  <p className="font-medium">
                    {formatErrorRate(service.errorRate)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Requests:</span>
                  <p className="font-medium">{service.requests || 0}</p>
                </div>
              </div>

              {onViewService && (
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onViewService(serviceName)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden lg:block p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceEntries.map(([serviceName, service]) => (
            <div
              key={serviceName}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewService?.(serviceName)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {getStatusIcon(service.status)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {formatServiceName(serviceName)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Port: {service.port}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    service.status
                  )}`}
                >
                  {service.status || "Unknown"}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Error Rate:</span>
                  <span className="font-medium">
                    {formatErrorRate(service.errorRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Requests:</span>
                  <span className="font-medium">{service.requests || 0}</span>
                </div>
                {service.errors !== undefined && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Errors:</span>
                    <span className="font-medium text-red-600">
                      {service.errors}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar for error rate */}
              <div className="mt-3">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span>Health Score</span>
                  <span>{100 - parseFloat(service.errorRate || "0")}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      parseFloat(service.errorRate || "0") < 5
                        ? "bg-green-500"
                        : parseFloat(service.errorRate || "0") < 10
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.max(
                        5,
                        100 - parseFloat(service.errorRate || "0")
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {serviceEntries.length === 0 && (
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No services found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Services are not responding or data is unavailable.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceStatus;
