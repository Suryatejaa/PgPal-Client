import axios from "axios";

const API = "http://localhost:4000/api/dashboard-service";

export const getOverview = (pgpalId: string) =>
  axios.get(`${API}/overview/${pgpalId}`);

export const getCheckins = (pgpalId: string, period: string) =>
  axios.get(`${API}/checkins/${pgpalId}?period=${period}`);

export const getVacates = (pgpalId: string, period: string) =>
  axios.get(`${API}/vacates/${pgpalId}?period=${period}`);