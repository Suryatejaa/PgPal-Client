// Property Service API Client
import axiosInstance from "../../../services/axiosInstance";
const PROPERTY_BASE_URL = '/property-service/admin';

export interface Property {
  _id: string;
  ownerId: string;
  createdBy: string;
  name: string;
  contact: {
    phone: string;
    email: string;
    website: string;
    _id: string;
  };
  pgGenderType: string;
  rentRange: {
    min: number;
    max: number;
    _id: string;
  };
  depositRange: {
    min: number;
    max: number;
    _id: string;
  };
  address: {
    plotNumber: string;
    line1: string;
    line2: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    _id: string;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  totalRooms: number;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  amenities: string[];
  views: number;
  pgpalId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  ownerInfo?: {
    subscriptionStatus: {
      type: string;
    };
    isInTrialPeriod: boolean;
    isStarterPack: boolean;
    isProfessionalPack: boolean;
    currentPlan: string;
    trialEndDate: string | null;
    subscriptionStartDate: string | null;
    subscriptionEndDate: string | null;
    _id: string;
    username: string;
    email: string;
    phoneNumber: string;
    gender: string;
    role: string;
    pgpalId: string;
    isVerified: boolean;
    profilePicture: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    otp: string | null;
    trialStartDate: string;
  };
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender: string;
  role: string;
  pgpalId: string;
  isVerified: boolean;
  subscriptionStatus: {
    type: string;
  };
  currentPlan: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  summary: {
    totalProperties: number;
    totalActiveProperties: number;
    totalDeletedProperties: number;
    totalReviews: number;
    totalRules: number;
    totalImages: number;
    averageViewsPerProperty: number;
  };
  planDistribution: {
    [key: string]: number;
  };
  recentActivity: {
    recentProperties: Array<{
      id: string;
      pgpalId: string;
      name: string;
      ownerId: string;
      createdAt: string;
      views: number;
    }>;
    topViewedProperties: Array<{
      id: string;
      pgpalId: string;
      name: string;
      ownerId: string;
      views: number;
      createdAt: string;
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

export interface SystemAnalytics {
  userGrowth: any[];
  propertyGrowth: any[];
  revenueGrowth: any[];
  topLocations: any[];
  systemHealth: any;
}

class PropertyService {
  // Dashboard Overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await axiosInstance.get(`${PROPERTY_BASE_URL}/dashboard/overview`);
    return response.data;
  }

  // Property Management
  async getAllProperties(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ properties: Property[]; total: number; page: number; totalPages: number }> {
    const response = await axiosInstance.get(`${PROPERTY_BASE_URL}/properties`, { params });
    return response.data;
  }

  async getPropertyDetails(id: string): Promise<Property> {
    const response = await axiosInstance.get(`${PROPERTY_BASE_URL}/properties/${id}`);
    return response.data;
  }

  async togglePropertyStatus(id: string): Promise<Property> {
    const response = await axiosInstance.patch(`${PROPERTY_BASE_URL}/properties/${id}/toggle-status`);
    return response.data;
  }

  async forceDeleteProperty(id: string): Promise<void> {
    await axiosInstance.delete(`${PROPERTY_BASE_URL}/properties/${id}/force-delete`);
  }

  // User Management
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const response = await axiosInstance.get(`${PROPERTY_BASE_URL}/users`, { params });
    return response.data;
  }

  async getUserDetails(id: string): Promise<User> {
    const response = await axiosInstance.get(`${PROPERTY_BASE_URL}/users/${id}`);
    return response.data;
  }

  async toggleUserStatus(id: string): Promise<User> {
    const response = await axiosInstance.patch(`${PROPERTY_BASE_URL}/users/${id}/toggle-status`);
    return response.data;
  }

  // Analytics
  async getSystemAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    granularity?: 'day' | 'week' | 'month';
  }): Promise<SystemAnalytics> {
    const response = await axiosInstance.get(`${PROPERTY_BASE_URL}/analytics`, { params });
    return response.data;
  }

  // Bulk Operations
  async bulkOperations(data: {
    operation: string;
    targetType: 'properties' | 'users';
    targetIds: string[];
    parameters?: any;
  }): Promise<any> {
    const response = await axiosInstance.post(`${PROPERTY_BASE_URL}/bulk-operations`, data);
    return response.data;
  }

  // Export Data
  async exportData(params: {
    type: 'properties' | 'users' | 'analytics';
    format: 'csv' | 'excel' | 'pdf';
    filters?: any;
  }): Promise<Blob> {
    const response = await axiosInstance.get(`${PROPERTY_BASE_URL}/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  // System Maintenance
  async systemMaintenance(operation: string, parameters?: any): Promise<any> {
    const response = await axiosInstance.post(`${PROPERTY_BASE_URL}/maintenance`, {
      operation,
      parameters
    });
    return response.data;
  }

  // Send Notifications
  async sendSystemNotification(data: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    targetUsers?: string[];
  }): Promise<any> {
    const response = await axiosInstance.post(`${PROPERTY_BASE_URL}/notifications/send`, data);
    return response.data;
  }
}

export const propertyService = new PropertyService();