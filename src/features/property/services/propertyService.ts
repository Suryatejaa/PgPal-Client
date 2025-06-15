import axiosInstance from "../../../services/axiosInstance";

export const addProperty = (payload: any) => 
  axiosInstance.post("/property-service", payload, { withCredentials: true });

export const updateProperty = (id: string, payload: any) => 
  axiosInstance.put(`/property-service/${id}`, payload, { withCredentials: true });

export const getOwnProperties = () => 
  axiosInstance.get("/property-service/own", { withCredentials: true });

export const getPropertyById = (id: string) => 
  axiosInstance.get(`/property-service/property/${id}`, { withCredentials: true });