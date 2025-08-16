import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdmin({ token }); // tu pourrais aussi faire un appel API pour vérifier le token
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });
      const { token, admin: adminData } = res.data;

      // ✅ Sauvegarde du token
      localStorage.setItem("adminToken", token);

      // ✅ Mise à jour du state
      setAdmin({ token, ...adminData });

      return true; // succès
    } catch (err) {
      throw new Error(err.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
