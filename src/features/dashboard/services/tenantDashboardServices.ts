import axiosInstance from "../../../services/axiosInstance";

// Get tenant's current stay
export const getCurrentStay = () =>
  axiosInstance.get("/tenant-service/myStay");

// Get nearby PGs (device location required)
export const getNearbyPGs = (latitude: number, longitude: number, maxDistance = 5000) =>
  axiosInstance.get(`/property-service/properties/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`);

// Search PGs by state or query
export const searchPGs = (params: { state?: string; q?: string }) =>
  axiosInstance.get("/property-service/search", { params });