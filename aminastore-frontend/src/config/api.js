export const API_BASE = "http://localhost:5000/api";

// Authentification clients
export const AUTH_LOGIN = `${API_BASE}/clients/login`;
export const AUTH_REGISTER = `${API_BASE}/clients/register`;

// Clients
export const CLIENTS = `${API_BASE}/clients`;

// Produits
export const PRODUCTS = `${API_BASE}/products`;
export const PRODUCT_IMAGE_DELETE = (id) => `${API_BASE}/products/${id}/image`;
export const PRODUCT_VIDEO_DELETE = (id) => `${API_BASE}/products/${id}/video`;

// Commandes
export const ORDERS = `${API_BASE}/orders`;

// Admin
export const ADMIN_LOGIN = `${API_BASE}/admin/login`;
export const ADMIN_USERS = `${API_BASE}/admin/users`;
export const ADMIN_PRODUCTS = `${API_BASE}/admin/products`;
export const ADMIN_ORDERS = `${API_BASE}/admin/orders`;
