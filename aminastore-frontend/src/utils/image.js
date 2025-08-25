// src/utils/image.js
export const getImageUrl = (filename) => {
  return `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
};
