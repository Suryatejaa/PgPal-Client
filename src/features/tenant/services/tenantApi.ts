import axiosInstance from "../../../services/axiosInstance";

export const fetchTenants = (propertyPpid: string) =>
    axiosInstance.get(`/tenant-service/tenants?propertyId=${propertyPpid}`);
  
  export const fetchVacateHistory = (propertyPpid: string) =>
    axiosInstance.get(`/tenant-service/vacateHistory/${propertyPpid}`);

export const addTenant = (data: any) =>
  axiosInstance.post("/tenant-service", data);

export const removeTenant = (tenantId: string,data:any) =>
  axiosInstance.post(`/tenant-service/remove-tenant/${tenantId}`,data);

export const updateRent = (tenantId: string, rentPaid: number, rentPaidMethod: string) =>
  axiosInstance.post(`/tenant-service/rent/update`, { tenantId, rentPaid, rentPaidMethod });

export const fetchTenantByPpid = (ppid: string) =>
  axiosInstance.get(`/tenant-service/tenants?ppid=${ppid}`);

export const fetchRentStatus = (tenantId: string) =>
    axiosInstance.get(`/tenant-service/rent/${tenantId}/status`);

export const retainTenant = (vacateId: string, data: any) =>
  axiosInstance.post(`/tenant-service/retain-tenant/${vacateId}`, data);