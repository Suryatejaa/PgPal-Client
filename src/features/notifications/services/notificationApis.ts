import axiosInstance from "../../auth/axiosInstance";

export const getNotifications = (params?: { ownerId?: string; tenantId?: string; audience?: string }) => {
  // Build query string based on params
  const query = new URLSearchParams();
  if (params?.ownerId) query.append("ownerId", params.ownerId);
  if (params?.tenantId) query.append("tenantId", params.tenantId);
  if (params?.audience) query.append("audience", params.audience);

  return axiosInstance.get(`/notification-service?${query.toString()}`);
};
export const markNotificationAsRead = (id: string) =>
  axiosInstance.put(`/notification-service/${id}/read`);

export const markAllNotificationsAsRead = (userId:any) =>
  axiosInstance.put(`/notification-service/${userId}/read-all`);

export const deleteNotification = (id: string) =>
  axiosInstance.delete(`/notification-service/${id}`);

export const deleteAllNotifications = (userId: string) =>
  axiosInstance.delete(`/notification-service/${userId}/delete-all`);
