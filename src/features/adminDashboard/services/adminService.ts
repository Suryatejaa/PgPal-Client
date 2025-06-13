import axiosInstance from "../../../services/axiosInstance";

const ADMIN_API = "/auth-service/admin";

// Dashboard and Analytics
export const getDashboardStats = () =>
  axiosInstance.get(`${ADMIN_API}/dashboard/stats`);

export const getUserRegistrationTrends = () =>
  axiosInstance.get(`${ADMIN_API}/analytics/registration-trends`);

// User Management
export const getAllUsers = (params?: {
  page?: number;
  limit?: number;
  role?: string;
  isVerified?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.role) query.append("role", params.role);
  if (params?.isVerified !== undefined) query.append("isVerified", params.isVerified.toString());
  if (params?.search) query.append("search", params.search);
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  
  return axiosInstance.get(`${ADMIN_API}/users?${query.toString()}`);
};

export const getUserDetails = (userId: string) =>
  axiosInstance.get(`${ADMIN_API}/users/${userId}`);

export const updateUser = (userId: string, data: {
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
}) =>
  axiosInstance.put(`${ADMIN_API}/users/${userId}`, data);

export const deleteUser = (userId: string) =>
  axiosInstance.delete(`${ADMIN_API}/users/${userId}`);

export const suspendUser = (userId: string, data?: {
  reason?: string;
  duration?: number;
}) => {
  const res = axiosInstance.post(`${ADMIN_API}/suspend-user/${userId}`, data);
  return res;
};

export const activateUser = (userId: string) => {
  const res = axiosInstance.post(`${ADMIN_API}/unsuspend-user/${userId}`);
  return res;
};

// Bulk Operations
export const bulkUserOperations = (data: {
  operation: "delete" | "suspend" | "activate" | "unsuspend";
  userIds: string[];
  reason?: string;
  duration?: number;
}) => {
  const res = axiosInstance.post(`${ADMIN_API}/users/bulk`, data);
  return res;
};

// System Management
export const getSystemHealth = () =>
  axiosInstance.get(`${ADMIN_API}/system/health`);

export const manageCaches = (data: {
  action: "clear" | "refresh";
  cacheType?: string;
}) =>
  axiosInstance.post(`${ADMIN_API}/cache/manage`, data);

// Notifications
export const sendBulkNotification = (data: {
  title: string;
  message: string;
  audience: "all" | "owners" | "tenants";
  userIds?: string[];
}) =>
  axiosInstance.post(`${ADMIN_API}/notifications/bulk-send`, data);

// Data Export
export const exportUserData = (params?: {
  format?: "csv" | "json";
  filters?: any;
}) => {
  const query = new URLSearchParams();
  if (params?.format) query.append("format", params.format);
  if (params?.filters) query.append("filters", JSON.stringify(params.filters));
  
  return axiosInstance.get(`${ADMIN_API}/export/users?${query.toString()}`);
};
