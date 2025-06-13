import React, { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import ErrorTable from "./ErrorTable";
import ServiceStatus from "./ServiceStatus";
import { monitoringService, SERVICES } from "../services/monitoringService";
import type {
  ErrorLog,
  GatewayHealth,
  ServiceInfo,
  ServiceName,
  ServiceMetrics,
  InternalApiStats,
  InternalApiError,
  ServiceHealthStatus,
  ServiceHealth,
} from "../services/monitoringService";

// Define SystemOverview type locally since it's not exported
interface SystemOverview {
  gateway: GatewayHealth;
  services: Record<string, ServiceHealth>;
  metrics: Record<string, ServiceMetrics>;
  internalApi: Record<string, InternalApiStats>;
  dependencies: Record<string, ServiceHealthStatus>;
  summary: {
    totalServices: number;
    healthyServices: number;
    degradedServices: number;
    offlineServices: number;
    totalErrors24h: number;
    errorRate: string;
    criticalAlerts: number;
  };
}

const ErrorMonitoring: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Core data states
  const [gatewayHealth, setGatewayHealth] = useState<GatewayHealth | null>(
    null
  );
  const [recentErrors, setRecentErrors] = useState<ErrorLog[]>([]);
  const [services, setServices] = useState<Record<string, ServiceInfo>>({});
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d">("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Enhanced monitoring states
  const [viewMode, setViewMode] = useState<
    "overview" | "services" | "health" | "metrics"
  >("overview");
  const [systemOverview, setSystemOverview] = useState<SystemOverview | null>(
    null
  );
  const [allServicesHealth, setAllServicesHealth] = useState<
    Record<string, ServiceHealth>
  >({});
  const [internalApiStats, setInternalApiStats] = useState<
    Record<ServiceName, InternalApiStats>
  >({} as Record<ServiceName, InternalApiStats>);
  const [internalApiErrors, setInternalApiErrors] = useState<
    Record<ServiceName, InternalApiError[]>
  >({} as Record<ServiceName, InternalApiError[]>);
  const [serviceDependencies, setServiceDependencies] = useState<
    Record<ServiceName, ServiceHealthStatus>
  >({} as Record<ServiceName, ServiceHealthStatus>);
  const [selectedService, setSelectedService] = useState<ServiceName | null>(
    null
  );

  useEffect(() => {
    loadMonitoringData();

    if (autoRefresh) {
      const interval = setInterval(loadMonitoringData, 30000);
      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, timeRange, viewMode]);

  const loadMonitoringData = async () => {
    try {
      setError(null);
      setLoading(true);

      if (viewMode === "overview") {
        // Load system overview data
        const systemData = await monitoringService.getSystemOverview();

        setSystemOverview(systemData);
        setGatewayHealth(systemData.gateway);
        setServices(systemData.services as Record<string, ServiceInfo>);
        setRecentErrors(systemData.gateway.errorStats.recentErrors || []);
      } else if (viewMode === "services") {
        // Load all services health and connectivity
        const [healthData, internalStatsData] = await Promise.all([
          monitoringService.getAllServicesHealth(),
          monitoringService.getAllInternalApiStats(),
        ]);

        setAllServicesHealth(healthData);
        setInternalApiStats(internalStatsData);
      } else if (viewMode === "health") {
        // Load health checks and dependencies
        const [healthData, dependenciesData, gatewayData] = await Promise.all([
          monitoringService.getAllServicesHealth(),
          monitoringService.getAllServiceDependencies(),
          monitoringService.getGatewayHealth(),
        ]);

        setAllServicesHealth(healthData);
        setServiceDependencies(dependenciesData);
        setGatewayHealth(gatewayData);
      } else if (viewMode === "metrics") {
        // Load detailed metrics and error tracking
        const [errorsData, internalErrorsData] = await Promise.all([
          monitoringService.getErrors({
            limit: 50,
            since:
              timeRange === "1h"
                ? new Date(Date.now() - 60 * 60 * 1000).toISOString()
                : timeRange === "24h"
                ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          }),
          monitoringService.getAllInternalApiErrors(),
        ]);

        setRecentErrors(errorsData.errors || []);
        setInternalApiErrors(internalErrorsData);
      }
    } catch (err: any) {
      console.error("Error loading monitoring data:", err);
      setError(`Failed to load monitoring data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = async (serviceName: ServiceName) => {
    try {
      setSelectedService(serviceName);
      // Load detailed service data when selected
      const [health, internalStats, internalErrors] = await Promise.all([
        monitoringService.getServiceHealth(serviceName),
        monitoringService.getInternalApiStats(serviceName),
        monitoringService.getInternalApiErrors(serviceName),
      ]);

      setAllServicesHealth((prev: Record<string, ServiceHealth>) => ({
        ...prev,
        [serviceName]: health,
      }));
      setInternalApiStats((prev: Record<ServiceName, InternalApiStats>) => ({
        ...prev,
        [serviceName]: internalStats,
      }));
      setInternalApiErrors((prev: Record<ServiceName, InternalApiError[]>) => ({
        ...prev,
        [serviceName]: internalErrors,
      }));
    } catch (err: any) {
      console.error(`Error loading ${serviceName} details:`, err);
      setError(`Failed to load ${serviceName} details: ${err.message}`);
    }
  };

  const handleClearErrors = async () => {
    try {
      await monitoringService.clearErrors();
      await loadMonitoringData();
    } catch (err: any) {
      setError(err.message || "Failed to clear error logs");
    }
  };

  const handleViewErrorDetails = (errorLog: ErrorLog) => {
    setSelectedError(errorLog);
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return "text-green-600 bg-green-100";
      case "degraded":
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "offline":
      case "error":
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderViewModeSelector = () => (
    <div className="flex overflow-x-auto space-x-1 mb-6 bg-gray-100 p-1 rounded-lg scrollbar-hide">
      {[
        { key: "overview", label: "System Overview", icon: "🏠" },
        { key: "services", label: "Services Status", icon: "🔧" },
        { key: "health", label: "Health Checks", icon: "💚" },
        { key: "metrics", label: "Metrics & Errors", icon: "📊" },
      ].map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => setViewMode(key as any)}
          className={`flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 min-w-0 ${
            viewMode === key
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span className="text-sm sm:text-base">{icon}</span>
          <span className="hidden xs:inline sm:inline truncate">{label}</span>
          <span className="xs:hidden sm:hidden text-xs">{key}</span>
        </button>
      ))}
    </div>
  );

  const renderSystemOverview = () => {
    if (!systemOverview) return null;

    const { summary, gateway, services: servicesSummary } = systemOverview;

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="System Health"
            value={`${summary.healthyServices}/${summary.totalServices} services`}
            trend={
              summary.healthyServices === summary.totalServices
                ? "up"
                : "stable"
            }
            icon="💚"
          />
          <MetricCard
            title="Error Rate"
            value={`${summary.errorRate}%`}
            trend={
              parseFloat(summary.errorRate) < 1
                ? "up"
                : parseFloat(summary.errorRate) > 5
                ? "down"
                : "stable"
            }
            icon="⚠️"
          />
          <MetricCard
            title="Active Alerts"
            value={`${summary.criticalAlerts} alerts`}
            trend={summary.criticalAlerts === 0 ? "up" : "down"}
            icon="🚨"
          />
          <MetricCard
            title="Gateway Uptime"
            value={formatUptime(gateway.uptime)}
            trend="up"
            icon="⏱️"
          />
        </div>

        {/* Gateway Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gateway Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  gateway.status
                )}`}
              >
                {gateway.status.toUpperCase()}
              </div>
              <p className="text-sm text-gray-500 mt-1">Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {gateway.errorStats.total24h}
              </div>
              <p className="text-sm text-gray-500">Total Errors (24h)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {gateway.errorStats.recentErrors.length}
              </div>
              <p className="text-sm text-gray-500">Recent Errors</p>
            </div>
          </div>
        </div>

        {/* Services Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Services Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(servicesSummary).map(
              ([serviceName, serviceInfo]) => (
                <div key={serviceName} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {serviceName.replace("-", " ")}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        serviceInfo.status
                      )}`}
                    >
                      {serviceInfo.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Error Rate:</span>
                      <span>{serviceInfo.errorRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Requests:</span>
                      <span>{serviceInfo.requests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <span>{serviceInfo.errors}</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recent Errors */}
        {recentErrors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Errors
            </h3>
            <ErrorTable
              errors={recentErrors}
              onViewDetails={handleViewErrorDetails}
            />
          </div>
        )}
      </div>
    );
  };

  const renderServicesView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((serviceName) => {
          const health = allServicesHealth[serviceName];
          const internalStats = internalApiStats[serviceName];

          return (
            <div
              key={serviceName}
              className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedService === serviceName ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleServiceSelect(serviceName)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {serviceName.replace("-", " ")}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    health
                      ? getStatusColor(health.status)
                      : "text-gray-500 bg-gray-100"
                  }`}
                >
                  {health?.status || "Unknown"}
                </span>
              </div>

              {health && (
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span>
                      {health.uptime ? formatUptime(health.uptime) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>{health.responseTime || "N/A"}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate:</span>
                    <span>{health.errorRate || "0"}%</span>
                  </div>
                </div>
              )}

              {internalStats && (
                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Internal Calls:</span>
                    <span>{internalStats.totalCalls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed Calls:</span>
                    <span>{internalStats.failedCalls}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderHealthChecks = () => (
    <div className="space-y-6">
      {/* Gateway Health */}
      {gatewayHealth && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gateway Health
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  gatewayHealth.status
                )}`}
              >
                {gatewayHealth.status.toUpperCase()}
              </div>
              <p className="text-sm text-gray-500 mt-1">Status</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatUptime(gatewayHealth.uptime)}
              </div>
              <p className="text-sm text-gray-500">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {Math.round(
                  (gatewayHealth.memory.heapUsed /
                    gatewayHealth.memory.heapTotal) *
                    100
                )}
                %
              </div>
              <p className="text-sm text-gray-500">Memory Usage</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {gatewayHealth.version}
              </div>
              <p className="text-sm text-gray-500">Version</p>
            </div>
          </div>
        </div>
      )}

      {/* Services Health - Use existing ServiceStatus component properly */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Services Health Status
        </h3>
        <ServiceStatus
          services={services}
          loading={loading}
          onViewService={(serviceName) =>
            handleServiceSelect(serviceName as ServiceName)
          }
        />
      </div>

      {/* Service Dependencies */}
      {Object.keys(serviceDependencies).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Service Dependencies
          </h3>
          <div className="space-y-4">
            {Object.entries(serviceDependencies).map(
              ([serviceName, dependency]) => (
                <div
                  key={serviceName}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">
                      {serviceName.replace("-", " ")}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Dependency Health Check
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      dependency.status
                    )}`}
                  >
                    {dependency.status}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderMetricsView = () => (
    <div className="space-y-6">
      {/* Simple System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Services"
          value={SERVICES.length.toString()}
          trend="stable"
          icon="🔧"
        />
        <MetricCard
          title="Monitoring Views"
          value="4 views"
          trend="up"
          icon="📊"
        />
        <MetricCard
          title="Error Tracking"
          value="Active"
          trend="up"
          icon="🔍"
        />
      </div>

      {/* Internal API Errors */}
      {Object.keys(internalApiErrors).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Internal API Errors
          </h3>
          <div className="space-y-6">
            {Object.entries(internalApiErrors).map(([serviceName, errors]) => (
              <div key={serviceName} className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-800 mb-2 capitalize">
                  {serviceName.replace("-", " ")} ({errors.length} errors)
                </h4>
                {errors.length > 0 ? (
                  <div className="space-y-2">
                    {errors.slice(0, 5).map((error, index) => (
                      <div
                        key={index}
                        className="text-sm bg-red-50 p-2 rounded"
                      >
                        <div className="font-medium text-red-800">
                          {error.endpoint}
                        </div>
                        <div className="text-red-600">{error.error}</div>
                        <div className="text-red-500 text-xs">
                          {new Date(error.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {errors.length > 5 && (
                      <p className="text-sm text-gray-500">
                        ... and {errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-green-600">No recent errors</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Errors Table */}
      {recentErrors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Errors
            </h3>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) =>
                  setTimeRange(e.target.value as "1h" | "24h" | "7d")
                }
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
              <button
                onClick={handleClearErrors}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                Clear Errors
              </button>
            </div>
          </div>
          <ErrorTable
            errors={recentErrors}
            onViewDetails={handleViewErrorDetails}
          />
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case "overview":
        return renderSystemOverview();
      case "services":
        return renderServicesView();
      case "health":
        return renderHealthChecks();
      case "metrics":
        return renderMetricsView();
      default:
        return renderSystemOverview();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading monitoring data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error Loading Monitoring Data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={loadMonitoringData}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Error Monitoring Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              autoRefresh
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            <span className="mr-1 sm:mr-2">{autoRefresh ? "🔄" : "⏸️"}</span>
            <span className="hidden xs:inline sm:inline">
              {autoRefresh ? "Auto Refresh ON" : "Auto Refresh OFF"}
            </span>
            <span className="xs:hidden sm:hidden">
              {autoRefresh ? "Auto ON" : "Auto OFF"}
            </span>
          </button>
          <button
            onClick={loadMonitoringData}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span className="mr-1 sm:mr-2">🔄</span>
            <span className="hidden xs:inline sm:inline">Refresh Now</span>
            <span className="xs:hidden sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {renderViewModeSelector()}
      {renderContent()}

      {/* Error Details Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Error Details
              </h3>
              <button
                onClick={() => setSelectedError(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Error
                </label>
                <p className="text-gray-900">
                  {selectedError.error || "No error message"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Service
                </label>
                <p className="text-gray-900">{selectedError.service}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">URL</label>
                <p className="text-gray-900">{selectedError.url}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="text-gray-900">{selectedError.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Timestamp
                </label>
                <p className="text-gray-900">
                  {new Date(selectedError.timestamp).toLocaleString()}
                </p>
              </div>
              {selectedError.duration && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Duration
                  </label>
                  <p className="text-gray-900">{selectedError.duration}ms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorMonitoring;
