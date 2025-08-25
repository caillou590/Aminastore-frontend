// src/utils/image.js
export const getImageUrl = (path) => {
  if (!path) return null;
  // Remplace par l'URL de ton backend déployé sur Render
  const BASE_URL = "https://aminastore-backend.onrender.com"; 
  return `${BASE_URL}${path}`;
};
