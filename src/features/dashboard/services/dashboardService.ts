import axiosInstance from "../../../services/axiosInstance";

export const getOverview = (pgpalId: string) =>
  axiosInstance.get(`/dashboard-service/overview/${pgpalId}`);

export const getCheckins = (pgpalId: string, period: string) =>
  axiosInstance.get(`/dashboard-service/checkins/${pgpalId}?period=${period}`);

export const getVacates = (pgpalId: string, period: string) =>
  axiosInstance.get(`/dashboard-service/vacates/${pgpalId}?period=${period}`);