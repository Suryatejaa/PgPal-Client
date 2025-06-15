import axiosInstance from "../../../services/axiosInstance";


const API = "http://46.62.142.3:4000/api/dashboard-service";

export const getOverview = (pgpalId: string) =>
  axiosInstance.get(`${API}/overview/${pgpalId}`);

export const getCheckins = (pgpalId: string, period: string) =>
  axiosInstance.get(`${API}/checkins/${pgpalId}?period=${period}`);

export const getVacates = (pgpalId: string, period: string) =>
  axiosInstance.get(`${API}/vacates/${pgpalId}?period=${period}`);