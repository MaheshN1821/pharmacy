import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Dashboard APIs
export const getDashboardSummary = () => api.get("/api/dashboard/summary");
export const getLowStockItems = () => api.get("/api/dashboard/low-stock");
export const getRecentSales = (limit = 10) =>
	api.get("/api/dashboard/recent-sales", { params: { limit } });
export const getPendingOrders = () => api.get("/api/dashboard/pending-orders");

// Inventory APIs
export const getMedicines = (skip = 0, limit = 50, search = "") =>
	api.get("/api/inventory", { params: { skip, limit, search } });
export const getMedicineById = (id) => api.get(`/api/inventory/${id}`);
export const createMedicine = (data) => api.post("/api/inventory", data);
export const updateMedicine = (id, data) =>
	api.put(`/api/inventory/${id}`, data);
export const deleteMedicine = (id) => api.delete(`/api/inventory/${id}`);

// Sales APIs
export const createSale = (data) => api.post("/api/sales", data);

// Purchase Order APIs
export const createPurchaseOrder = (data) =>
	api.post("/api/purchase-orders", data);
export const updatePurchaseOrder = (id, data) =>
	api.put(`/api/purchase-orders/${id}`, data);

// Health check
export const healthCheck = () => api.get("/api/health");

export default api;
