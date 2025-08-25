// src/utils/image.js
const BASE_URL = import.meta.env.VITE_API_URL || "https://aminastore-backend.onrender.com";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path; // URL complète déjà fournie
  // Assure-toi de ne pas dupliquer les slashs
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
