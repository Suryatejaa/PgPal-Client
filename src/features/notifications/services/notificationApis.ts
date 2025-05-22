import axiosInstance from "../../auth/axiosInstance";

export const getNotifications = (params?: any) =>
  axiosInstance.get(`/notification-service?createdBy=${params}`);

export const markNotificationAsRead = (id: string) =>
  axiosInstance.put(`/notification-service/${id}/read`);

export const markAllNotificationsAsRead = (userId:any) =>
  axiosInstance.put(`/notification-service/${userId}/read-all`);

export const deleteNotification = (id: string) =>
  axiosInstance.delete(`/notification-service/${id}`);