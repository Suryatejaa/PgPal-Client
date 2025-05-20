import axiosInstance from "../../../services/axiosInstance";

export const addMeal = (menuId: string,data:any) =>
    axiosInstance.post(`/kitchen-service/kitchens/menu/${menuId}`,data);

export const updateMeal = (menuId: string, data: any) =>
    axiosInstance.put(`/kitchen-service/kitchens/menu/${menuId}`, data);

export const selectKitchenMenu = (menuId: string) =>
    axiosInstance.put(`/kitchen-service/kitchens/menu/${menuId}/select`);

export const deleteMeal = (menuId: string) =>
    axiosInstance.delete(`/kitchen-service/kitchens/menu/${menuId}`);

export const getMeals = (kitchenId: string) =>
    axiosInstance.get(`/kitchen-service/kitchens/${kitchenId}/menu`);

export const getTodayMeal = (kitchenId: string) =>
    axiosInstance.get(`/kitchen-service/kitchens/${kitchenId}/menu/today`);