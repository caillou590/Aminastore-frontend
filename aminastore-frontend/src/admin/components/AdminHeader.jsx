import React from "react";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

const AdminHeader = () => {
  const { admin, logout } = useAdminAuth();
  return (
    <header className="admin-header d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
      <h2 className="m-0">Aminastore — Admin</h2>
      <div>
        {admin && <span className="me-3">Bonjour, {admin.email}</span>}
        <button className="btn btn-outline-danger btn-sm" onClick={logout}>Déconnexion</button>
      </div>
    </header>
  );
};

export default AdminHeader;
