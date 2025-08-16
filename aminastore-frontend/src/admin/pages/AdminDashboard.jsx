// src/admin/pages/AdminDashboard.jsx
import React from "react";
import AdminLayout from "../components/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="container p-4">
        <h1>Bienvenue sur le Dashboard Admin</h1>
        <p>Vous pouvez gérer les produits, les commandes et voir les statistiques ici.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
