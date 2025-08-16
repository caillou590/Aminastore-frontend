import React from "react";

const AdminHeader = () => {
  return (
    <header className="admin-header d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
      <h2 className="m-0">Amynastore Admin</h2>
      <button className="btn btn-danger">Déconnexion</button>
    </header>
  );
};

export default AdminHeader;
