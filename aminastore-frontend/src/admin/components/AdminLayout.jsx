import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminFooter from "./AdminFooter.jsx";

const AdminLayout = () => {
  return (
    <div className="admin-layout d-flex">
      <AdminSidebar />
      <div className="admin-main flex-grow-1 d-flex flex-column">
        <AdminHeader />
        <div className="admin-content flex-grow-1 p-4">
          <Outlet />
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
