import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./components/AdminProducts.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext.jsx";

const Protected = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return <div>Chargement...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
};

const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          path=""
          element={
            <Protected>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminApp;
