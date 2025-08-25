// src/admin/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAdmin(res.data))
        .catch(() => setAdmin(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (payload, token) => {
    setAdmin(payload);
    localStorage.setItem("adminToken", token);
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
