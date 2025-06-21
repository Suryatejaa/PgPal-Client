// Error Monitoring Service API Client
import axiosInstance from "../../../services/axiosInstance";

const GATEWAY_BASE_URL = '/gateway';

// Service list for comprehensive monitoring
export const SERVICES = [
  'complaint-service',
  'dashboard-service', 
  'kitchen-service',
  'notification-service',
  'property-service',
  'room-service',
  'tenant-service',
  'auth-service'
] as const;

export type ServiceName = typeof SERVICES[number];

export interface ErrorLog {
  id: string;
  timestamp: string;
  service: string;
  method: string;
  url: string;
  status: number;
  duration?: number;
  error?: string;
  type?: string;
  userId?: string;
  userRole?: string;
  ip?: string;
  userAgent?: string;
  functionName?: string;
  headers?: {
    'content-type'?: string;
    authorization?: string;
  };
}

export interface ServiceMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  uptime: number;
  timestamp: string;
  pid: number;
  version?: string;
  environment?: string;
}

export interface InternalApiStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  byEndpoint: Record<string, {
    calls: number;
    success: number;
    failures: number;
    avgResponseTime: number;
  }>;
  byTargetService: Record<string, {
    calls: number;
    success: number;
    failures: number;
  }>;
  recentActivity: Array<{
    timestamp: string;
    targetService: string;
    endpoint: string;
    method: string;
    status: number;
    duration: number;
  }>;
}

export interface InternalApiError {
  id: string;
  timestamp: string;
  sourceService: string;
  targetService: string;
  functionName: string;
  endpoint: string;
  method: string;
  error: string;
  statusCode: number;
  duration: number;
  requestData?: any;
  context?: any;
}

export interface ServiceHealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  uptime: number;
  errorRate: string;
  requests: number;
  errors: number;
  dependencies: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    responseTime: number;
    errorRate: string;
  }>;
  lastChecked: string;
}

export interface ErrorStats {
  total24h: number;
  totalLastHour: number;
  totalRequests: number;
  overallErrorRate: string;
  byService: Record<string, number>;
  byStatus: Record<string, number>;
  topFailingEndpoints: Array<{
    endpoint: string;
    count: number;
  }>;
  serviceErrorRates: Record<string, {
    errorRate: string;
    totalRequests: number;
    totalErrors: number;
  }>;
  recentErrors: ErrorLog[];
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  errorRate: string;
  requests: number;
  errors: number;
  uptime?: number;
  responseTime?: number;
}

export interface GatewayHealth {
  status: string;
  timestamp: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  errorStats: ErrorStats;
  serviceHealth: Record<string, ServiceHealth>;
  version: string;
  environment: string;
}

export interface ServiceInfo {
  port: number;
  status?: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  errorRate?: string;
  requests?: number;
  errors?: number;
  uptime?: number;
  responseTime?: number;
  lastCheck?: string;
}

export interface DashboardAggregateData {
  propertyId: string;
  period: string;
  summary: {
    totalRevenue: number;
    totalBookings: number;
    occupancyRate: number;
    averageStay: number;
  };
  trends: {
    revenue: Array<{ date: string; amount: number }>;
    bookings: Array<{ date: string; count: number }>;
    occupancy: Array<{ date: string; rate: number }>;
  };
  errors: ErrorLog[];
  performance: {
    averageResponseTime: number;
    errorRate: string;
    uptimePercentage: number;
  };
}

class MonitoringService {
  // ==================== GATEWAY ENDPOINTS ====================
  
  // Gateway Health
  async getGatewayHealth(): Promise<GatewayHealth> {
    const response = await axiosInstance.get(`${GATEWAY_BASE_URL}/health`);
    return response.data;
  }

  // Error Logs
  async getErrors(params?: {
    limit?: number;
    service?: string;
    status?: number;
    since?: string;
  }): Promise<{
    errors: ErrorLog[];
    total: number;
    filters: any;
    stats: ErrorStats;
  }> {
    const response = await axiosInstance.get(`${GATEWAY_BASE_URL}/errors`, { params });
    return response.data;
  }

  // Error Statistics
  async getErrorStats(): Promise<ErrorStats> {
    const response = await axiosInstance.get(`${GATEWAY_BASE_URL}/errors/stats`);
    return response.data;
  }

  // Service Status
  async getServices(): Promise<{
    services: Record<string, ServiceInfo>;
    timestamp: string;
  }> {
    const response = await axiosInstance.get(`${GATEWAY_BASE_URL}/services`);
    return response.data;
  }

  // Clear Error Logs (Admin only)
  async clearErrors(): Promise<{
    message: string;
    clearedCount: number;
    timestamp: string;
  }> {
    const response = await axiosInstance.delete(`${GATEWAY_BASE_URL}/errors?confirm=true`);
    return response.data;
  }

  // ==================== INDIVIDUAL SERVICE HEALTH CHECKS ====================
  
  async getServiceHealth(service: ServiceName): Promise<ServiceHealth> {
    try {
      const response = await axiosInstance.get(`/${service}/monitor/health`);
      return {
        status: response.data.status || 'healthy',
        errorRate: response.data.errorRate || '0',
        requests: response.data.requests || 0,
        errors: response.data.errors || 0,
        uptime: response.data.uptime || 0,
        responseTime: response.data.responseTime || 0
      };
    } catch (error: any) {
      console.log(`${service}: ${error}`)
      return {
        status: 'offline',
        errorRate: '100',
        requests: 0,
        errors: 0,
        uptime: 0,
        responseTime: 0
      };
    }
  }

  async getAllServicesHealth(): Promise<Record<string, ServiceHealth>> {
    const results: Record<string, ServiceHealth> = {};
    
    await Promise.allSettled(
      SERVICES.map(async (service) => {
        try {
          results[service] = await this.getServiceHealth(service);
        } catch (error) {
          results[service] = {
            status: 'offline',
            errorRate: '100',
            requests: 0,
            errors: 0
          };
        }
      })
    );

    return results;
  }

  // ==================== SYSTEM METRICS ====================
  
  async getServiceMetrics(service: ServiceName): Promise<ServiceMetrics> {
    const response = await axiosInstance.get(`/${service}/monitor/metrics`);
    return response.data;
  }

  async getAllServicesMetrics(): Promise<Record<string, ServiceMetrics>> {
    const results: Record<string, ServiceMetrics> = {};
    
    await Promise.allSettled(
      SERVICES.map(async (service) => {
        try {
          results[service] = await this.getServiceMetrics(service);
        } catch (error) {
          // Service is offline or unreachable
          results[service] = {
            cpu: { usage: 0, loadAverage: [0, 0, 0] },
            memory: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 },
            uptime: 0,
            timestamp: new Date().toISOString(),
            pid: 0
          };
        }
      })
    );

    return results;
  }

  // ==================== INTERNAL API MONITORING ====================
  
  async getInternalApiStats(service: ServiceName): Promise<InternalApiStats> {
    const response = await axiosInstance.get(`/${service}/monitor/internal-api/stats`);
    return response.data;
  }

  async getAllInternalApiStats(): Promise<Record<string, InternalApiStats>> {
    const results: Record<string, InternalApiStats> = {};
    
    // Filter services that have internal API monitoring (excluding kitchen-service for now)
    const servicesWithInternalApi = SERVICES.filter(s => s !== 'kitchen-service' && s !== 'auth-service');
    
    await Promise.allSettled(
      servicesWithInternalApi.map(async (service) => {
        try {
          results[service] = await this.getInternalApiStats(service);
        } catch (error) {
          results[service] = {
            totalCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            averageResponseTime: 0,
            byEndpoint: {},
            byTargetService: {},
            recentActivity: []
          };
        }
      })
    );

    return results;
  }

  // ==================== INTERNAL API ERRORS ====================
  
  async getInternalApiErrors(
    service: ServiceName, 
    params?: {
      limit?: number;
      service?: string;
      functionName?: string;
    }
  ): Promise<{
    errors: InternalApiError[];
    total: number;
    service: string;
  }> {
    const response = await axiosInstance.get(`/${service}/monitor/internal-api/errors`, { params });
    return response.data;
  }

  async getAllInternalApiErrors(params?: {
    limit?: number;
    targetService?: string;
  }): Promise<Record<string, InternalApiError[]>> {
    const results: Record<string, InternalApiError[]> = {};
    
    const servicesWithInternalApi = SERVICES.filter(s => s !== 'kitchen-service' && s !== 'auth-service');
    
    await Promise.allSettled(
      servicesWithInternalApi.map(async (service) => {
        try {
          const response = await this.getInternalApiErrors(service, params);
          results[service] = response.errors;
        } catch (error) {
          results[service] = [];
        }
      })
    );

    return results;
  }

  // ==================== SERVICE DEPENDENCY HEALTH ====================
  
  async getServiceDependencyHealth(service: ServiceName): Promise<ServiceHealthStatus> {
    try {
      const response = await axiosInstance.get(`/${service}/monitor/internal-api/health`);
      return response.data;
    } catch (error: any) {
      return {
        service,
        status: 'offline',
        uptime: 0,
        errorRate: '100',
        requests: 0,
        errors: 0,
        dependencies: {},
        lastChecked: new Date().toISOString()
      };
    }
  }

  async getAllServiceDependencies(): Promise<Record<string, ServiceHealthStatus>> {
    const results: Record<string, ServiceHealthStatus> = {};
    
    const servicesWithDependencies = SERVICES.filter(s => s !== 'kitchen-service' && s !== 'auth-service');
    
    await Promise.allSettled(
      servicesWithDependencies.map(async (service) => {
        results[service] = await this.getServiceDependencyHealth(service);
      })
    );

    return results;
  }

  // ==================== DASHBOARD SERVICE AGGREGATES ====================
  
  async getDashboardAggregate(
    propertyId: string, 
    period: '7d' | '30d' = '7d'
  ): Promise<DashboardAggregateData> {
    const response = await axiosInstance.get(`/dashboard-service/aggregate/${propertyId}?period=${period}`);
    return response.data;
  }

  // ==================== COMPREHENSIVE SYSTEM OVERVIEW ====================
  
  async getSystemOverview(): Promise<{
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
  }> {
    const [gateway, services, metrics, internalApi, dependencies] = await Promise.all([
      this.getGatewayHealth(),
      this.getAllServicesHealth(),
      this.getAllServicesMetrics(),
      this.getAllInternalApiStats(),
      this.getAllServiceDependencies()
    ]);

    const servicesList = Object.values(services);
    const healthyServices = servicesList.filter(s => s.status === 'healthy').length;
    const degradedServices = servicesList.filter(s => s.status === 'degraded').length;
    const offlineServices = servicesList.filter(s => s.status === 'offline').length;
    
    const criticalAlerts = gateway.errorStats.recentErrors.filter(e => e.status >= 500).length;

    return {
      gateway,
      services,
      metrics,
      internalApi,
      dependencies,
      summary: {
        totalServices: servicesList.length,
        healthyServices,
        degradedServices,
        offlineServices,
        totalErrors24h: gateway.errorStats.total24h,
        errorRate: gateway.errorStats.overallErrorRate,
        criticalAlerts
      }
    };
  }

  // ==================== REAL-TIME MONITORING HELPERS ====================

  async getRealtimeMetrics(): Promise<{
    currentErrors: number;
    errorRate: string;
    avgResponseTime: number;
    healthyServices: number;
    totalServices: number;
    criticalAlerts: number;
  }> {
    const [health, errors] = await Promise.all([
      this.getGatewayHealth(),
      this.getErrorStats()
    ]);

    const services = Object.values(health.serviceHealth);
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const criticalAlerts = errors.recentErrors.filter(e => e.status >= 500).length;

    return {
      currentErrors: errors.totalLastHour,
      errorRate: health.errorStats.overallErrorRate,
      avgResponseTime: 0, // Calculate from recent errors if duration is available
      healthyServices,
      totalServices: services.length,
      criticalAlerts
    };
  }

  // Service specific monitoring
  async getServiceMetricsDetailed(serviceName: string, hours: number = 24): Promise<{
    errorCount: number;
    errorRate: string;
    requests: number;
    recentErrors: ErrorLog[];
    healthStatus: ServiceHealth;
    systemMetrics: ServiceMetrics;
    internalApiStats: InternalApiStats | null;
    dependencyHealth: ServiceHealthStatus | null;
  }> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const [errors, health, systemMetrics] = await Promise.all([
      this.getErrors({ service: serviceName, since }),
      this.getGatewayHealth(),
      this.getServiceMetrics(serviceName as ServiceName).catch(() => null),
    ]);

    let internalApiStats = null;
    let dependencyHealth = null;

    // Get internal API stats for services that support it
    if (!['kitchen-service',  'auth-service'].includes(serviceName)) {
      internalApiStats = await this.getInternalApiStats(serviceName as ServiceName).catch(() => null);
      dependencyHealth = await this.getServiceDependencyHealth(serviceName as ServiceName).catch(() => null);
    }

    return {
      errorCount: errors.total,
      errorRate: health.serviceHealth[serviceName]?.errorRate || '0',
      requests: health.serviceHealth[serviceName]?.requests || 0,
      recentErrors: errors.errors.slice(0, 10),
      healthStatus: health.serviceHealth[serviceName] || {
        status: 'healthy',
        errorRate: '0',
        requests: 0,
        errors: 0
      },
      systemMetrics: systemMetrics || {
        cpu: { usage: 0, loadAverage: [0, 0, 0] },
        memory: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 },
        uptime: 0,
        timestamp: new Date().toISOString(),
        pid: 0
      },
      internalApiStats,
      dependencyHealth
    };
  }

  // Alert thresholds
  async checkAlerts(): Promise<{
    criticalErrors: ErrorLog[];
    degradedServices: string[];
    highErrorRateServices: string[];
    systemAlerts: string[];
    internalApiAlerts: string[];
    dependencyAlerts: string[];
  }> {
    const [health, recentErrors, internalApiStats, dependencies] = await Promise.all([
      this.getGatewayHealth(),
      this.getErrors({ since: new Date(Date.now() - 60 * 60 * 1000).toISOString() }),
      this.getAllInternalApiStats(),
      this.getAllServiceDependencies()
    ]);

    const criticalErrors = recentErrors.errors.filter(e => e.status >= 500);
    const degradedServices = Object.entries(health.serviceHealth)
      .filter(([_, service]) => service.status === 'degraded' || service.status === 'unhealthy')
      .map(([name]) => name);
    
    const highErrorRateServices = Object.entries(health.serviceHealth)
      .filter(([_, service]) => parseFloat(service.errorRate) > 10)
      .map(([name]) => name);

    const systemAlerts = [];
    if (health.memory.heapUsed / health.memory.heapTotal > 0.9) {
      systemAlerts.push('High memory usage detected');
    }
    if (parseFloat(health.errorStats.overallErrorRate) > 5) {
      systemAlerts.push('Overall error rate is elevated');
    }
    if (health.uptime < 300) {
      systemAlerts.push('Gateway recently restarted');
    }

    const internalApiAlerts = Object.entries(internalApiStats)
      .filter(([_, stats]) => stats.failedCalls / stats.totalCalls > 0.1)
      .map(([service]) => `${service}: High internal API failure rate`);

    const dependencyAlerts = Object.entries(dependencies)
      .filter(([_, health]) => health.status === 'degraded' || health.status === 'unhealthy')
      .map(([service]) => `${service}: Service dependency issues`);

    return {
      criticalErrors,
      degradedServices,
      highErrorRateServices,
      systemAlerts,
      internalApiAlerts,
      dependencyAlerts
    };
  }

  // ==================== UTILITY METHODS ====================
  
  async testServiceConnectivity(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    await Promise.allSettled(
      SERVICES.map(async (service) => {
        try {
          await axiosInstance.get(`/${service}/monitor/health`, { timeout: 5000 });
          results[service] = true;
        } catch (error) {
          results[service] = false;
        }
      })
    );

    return results;
  }

  async getServiceUptime(service: ServiceName): Promise<number> {
    try {
      const metrics = await this.getServiceMetrics(service);
      return metrics.uptime;
    } catch (error) {
      return 0;
    }
  }
}

export const monitoringService = new MonitoringService();
