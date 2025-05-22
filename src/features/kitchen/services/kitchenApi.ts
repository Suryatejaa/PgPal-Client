import axiosInstance from "../../../services/axiosInstance";

// Add a menu
export const addMenu = (data: any) =>
  axiosInstance.post(`/kitchen-service/menu`, data);

// Update a menu
export const updateMenu = (pppId: string, menuNo: number, data: any) =>
  axiosInstance.put(`/kitchen-service/update?pppId=${pppId}&menuNo=${menuNo}`, data);

// Get all menus for a property
export const getMenus = (pppId: string) =>
  axiosInstance.get(`/kitchen-service/${pppId}`);

// Delete a menu
export const deleteMenu = (pppId: string, menuNo: number) =>
  axiosInstance.delete(`/kitchen-service/delete?pppId=${pppId}&menuNo=${menuNo}`);

// Select a menu
export const selectMenu = (pppid: string, menuNo: number) =>
  axiosInstance.put(`/kitchen-service/select-menu?pppid=${pppid}&menuNo=${menuNo}`);

// Get today's meal (if needed)
export const getTodayMeal = (kitchenId: string) =>
  axiosInstance.get(`/kitchen-service/kitchens/${kitchenId}/menu/today`);