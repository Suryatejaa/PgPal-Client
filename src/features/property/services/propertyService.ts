import axiosInstance from "../../../services/axiosInstance";


const API = "http://46.62.142.3:4000/api/property-service";

export const addProperty = (payload: any) => axiosInstance.post(API, payload, { withCredentials: true });
export const updateProperty = (id: string, payload: any) => axiosInstance.put(`${API}/${id}`, payload, { withCredentials: true });
export const getOwnProperties = () => axiosInstance.get(`${API}/own`, { withCredentials: true });
export const getPropertyById = (id: string) => axiosInstance.get(`${API}/property/${id}`, { withCredentials: true });