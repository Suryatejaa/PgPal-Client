import axios from "axios";

const API = "http://localhost:4000/api/property-service";

export const addProperty = (payload: any) => axios.post(API, payload, { withCredentials: true });
export const updateProperty = (id: string, payload: any) => axios.put(`${API}/${id}`, payload, { withCredentials: true });
export const getOwnProperties = () => axios.get(`${API}/own`, { withCredentials: true });
export const getPropertyById = (id: string) => axios.get(`${API}/property/${id}`, { withCredentials: true });