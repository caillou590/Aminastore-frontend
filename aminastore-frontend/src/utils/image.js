// src/utils/image.js
export const getImageUrl = (path) => {
  if (!path) return null;
  const BASE_URL = "https://aminastore-backend.onrender.com";
  return `${BASE_URL}${path}`;
};
