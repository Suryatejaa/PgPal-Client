import axiosInstance from "../../../services/axiosInstance";

// Raise a complaint
export const raiseComplaint = (data: any) =>
  axiosInstance.post(`/complaint-service`, data);

// Get all complaints (optionally filter by propertyId client-side)
export const getAllComplaints = (propertyId?: string) =>
    axiosInstance.get(
      `/complaint-service${propertyId ? `?propertyId=${propertyId}` : ""}`
    );
// Get complaint by ID
export const getComplaintById = (complaintId: string) =>
  axiosInstance.get(`/complaint-service/${complaintId}`);

// Update complaint
export const updateComplaint = (complaintId: string, data: any) =>
  axiosInstance.put(`/complaint-service/${complaintId}`, data);

// Delete complaint
export const deleteComplaint = (complaintId: string) =>
  axiosInstance.delete(`/complaint-service/${complaintId}`);

// Get metrics for a property
export const getComplaintMetrics = (propertyId: string) =>
  axiosInstance.get(`/complaint-service/metrics/summary/${propertyId}`);