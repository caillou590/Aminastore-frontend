import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === `/admin/${path}` ? "active" : "");

  return (
    <aside className="admin-sidebar bg-light border-end vh-100 p-3">
      <ul className="list-unstyled">
        <li className={`mb-3 ${isActive("dashboard")}`}><Link to="/admin/dashboard"><FaTachometerAlt /> Dashboard</Link></li>
        <li className={`mb-3 ${isActive("products")}`}><Link to="/admin/products"><FaBoxOpen /> Produits</Link></li>
        <li className={`mb-3 ${isActive("orders")}`}><Link to="/admin/orders"><FaShoppingCart /> Commandes</Link></li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
