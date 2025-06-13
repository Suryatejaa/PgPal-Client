// Room Service API Client
import axiosInstance from '../../../services/axiosInstance';
const ROOM_BASE_URL = '/admin/room-service';

export interface Room {
  _id: string;
  propertyId: string;
  roomNumber: number;
  floor: number;
  type: string;
  totalBeds: number;
  rentPerBed: number;
  beds: Array<{
    bedId: string;
    status: string;
    tenantNo: string | null;
    tenantPpt: string | null;
    _id: string;
  }>;
  status: string;
  pgpalId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RoomAnalytics {
  data: any;
  totalRooms: number;
  occupancyRate: number;
  vacantBeds:any
  availableRooms: number;
  occupiedRooms: number;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  averageRent: number;
  totalProperties: number;
  roomsByType: any[];
  roomsByStatus: any[];
  lastUpdated: string;
  typeDistribution: {
    [key: string]: number;
  };
  recentActivity: {
    recentRooms: Array<{
      id: string;
      roomNumber: number;
      propertyId: string;
      type: string;
      status: string;
      createdAt: string;
    }>;
    recentlyOccupied: Array<{
      id: string;
      roomNumber: number;
      propertyId: string;
      tenantInfo: string;
      occupiedAt: string;
    }>;
  };
  systemMetrics: {
    database: {
      collections: number;
      dataSize: number;
      storageSize: number;
      indexes: number;
      indexSize: number;
    };
    cache: {
      error?: string;
    };
    timestamp: string;
  };
  timestamp: string;
}

export interface PropertyAnalytics {
  propertyDistribution: any[];
  roomTypeDistribution: any[];
  occupancyTrends: any[];
  revenueTrends: any[];
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: any[];
  revenueByProperty: any[];
  revenueByRoomType: any[];
  projectedRevenue: number;
}

export interface AdvancedAnalytics {
  occupancyForecast: any[];
  performanceMetrics: any;
  marketTrends: any[];
  competitiveAnalysis: any;
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number; diskUsage: number;
  activeConnections: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
}

export interface ExportFile {
  fileName: string;
  size: number;
  createdAt: string;
  downloadUrl: string;
}

class RoomService {  // Dashboard Analytics
  async getDashboardOverview(): Promise<RoomAnalytics> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/dashboard/overview`);
    console.log(response.data.data);
    return response.data.data || response.data; // Handle wrapped response
  }

  async getAdvancedDashboard(): Promise<any> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/dashboard/advanced`);
    return response.data.data || response.data;
  }

  async getComprehensiveDashboard(): Promise<any> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/dashboard/comprehensive`);
    return response.data.data || response.data;
  }

  // Analytics
  async getPropertyAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    propertyId?: string;
  }): Promise<PropertyAnalytics> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/analytics/property`, { params });
    return response.data;
  }

  async getRevenueAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    granularity?: 'day' | 'week' | 'month';
  }): Promise<RevenueAnalytics> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/analytics/revenue`, { params });
    return response.data;
  }

  async getAdvancedAnalytics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AdvancedAnalytics> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/analytics/advanced`, { params });
    return response.data;
  }

  async getPerformanceInsights(): Promise<any> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/analytics/insights`);
    return response.data;
  }

  async getOccupancyForecast(params?: {
    days?: number;
    propertyId?: string;
  }): Promise<any> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/analytics/forecast`, { params });
    return response.data;
  }
  // Room Management
  async getAllRooms(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    propertyId?: string;
    roomType?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ rooms: Room[]; total: number; page: number; totalPages: number }> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/rooms`, { params });
    const data = response.data.data || response.data;
    return {
      rooms: data.rooms || [],
      total: data.pagination?.totalRooms || 0,
      page: data.pagination?.currentPage || 1,
      totalPages: data.pagination?.totalPages || 0
    };
  }

  async searchRooms(params: {
    query: string;
    filters?: any;
    page?: number;
    limit?: number;
  }): Promise<{ rooms: Room[]; total: number; page: number; totalPages: number }> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/rooms/search`, { params });
    return response.data;
  }

  async bulkUpdateRooms(data: {
    roomIds: string[];
    updates: Partial<Room>;
  }): Promise<any> {
    const response = await axiosInstance.put(`${ROOM_BASE_URL}/rooms/bulk-update`, data);
    return response.data;
  }

  // System Monitoring
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/system/health`);
    return response.data;
  }

  // Data Export
  async exportData(params: {
    type: 'rooms' | 'analytics' | 'revenue';
    format: 'csv' | 'excel' | 'pdf';
    filters?: any;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  async getExportFiles(): Promise<ExportFile[]> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/export/files`);
    return response.data;
  }

  async downloadExportFile(fileName: string): Promise<Blob> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/export/files/${fileName}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Notifications
  async sendTestNotification(data: {
    title: string;
    message: string;
    recipients?: string[];
  }): Promise<any> {
    const response = await axiosInstance.post(`${ROOM_BASE_URL}/notifications/test`, data);
    return response.data;
  }

  // Reports
  async getScheduledReportsStatus(): Promise<any> {
    const response = await axiosInstance.get(`${ROOM_BASE_URL}/reports/scheduled/status`);
    return response.data;
  }

  async generateManualReport(data: {
    type: string;
    parameters: any;
  }): Promise<any> {
    const response = await axiosInstance.post(`${ROOM_BASE_URL}/reports/generate`, data);
    return response.data;
  }
}

export const roomService = new RoomService();
