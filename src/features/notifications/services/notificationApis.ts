import axiosInstance from "../../../services/axiosInstance";

export const getNotifications = (params?: { ownerId?: string; tenantId?: string; audience?: string }) => {
  // Build query string based on params
  const query = new URLSearchParams();
  if (params?.ownerId) query.append("ownerId", params.ownerId);
  if (params?.tenantId) query.append("tenantId", params.tenantId);
  if (params?.audience) query.append("audience", params.audience);

  const queryString = query.toString();
  return axiosInstance.get(
    `/notification-service${queryString ? "?" + queryString : ""}`
  );
};
export const markNotificationAsRead = (id: string) =>
  axiosInstance.put(`/notification-service/${id}/read`);

export const markAllNotificationsAsRead = (params?: { ownerId?: string; tenantId?: string; audience?: string }) => {
  // Build query string based on params
  const query = new URLSearchParams();
  if (params?.ownerId) query.append("ownerId", params.ownerId);
  if (params?.tenantId) query.append("tenantId", params.tenantId);
  if (params?.audience) query.append("audience", params.audience);
  return axiosInstance.put(
    `/notification-service/read-all${query.toString() ? "?" + query.toString() : ""}`
  );
};

export const deleteNotification = (id: string) =>
  axiosInstance.delete(`/notification-service/${id}`);

export const deleteAllNotifications = (params?: { ownerId?: string; tenantId?: string; }) => {
  // Build query string based on params
  const query = new URLSearchParams();
  if (params?.ownerId) query.append("ownerId", params.ownerId);
  if (params?.tenantId) query.append("tenantId", params.tenantId);
  console.log(query.toString())
  return axiosInstance.delete(
    `/notification-service/delete-all${query.toString() ? "?" + query.toString() : ""}`
  );

}