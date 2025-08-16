import React from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout d-flex">
      <AdminSidebar />
      <div className="admin-main flex-grow-1 d-flex flex-column">
        <AdminHeader />
        <div className="admin-content flex-grow-1 p-4">{children}</div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
