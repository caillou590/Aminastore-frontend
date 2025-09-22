import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaBars } from "react-icons/fa";
import "../../admin/admin.css";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Bouton hamburger */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>Aminastore</h2>
        <ul>
          <li>
            <NavLink to="/admin/dashboard" onClick={() => window.innerWidth < 992 && toggleSidebar()}>
              <FaTachometerAlt /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" onClick={() => window.innerWidth < 992 && toggleSidebar()}>
              <FaBoxOpen /> Produits
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" onClick={() => window.innerWidth < 992 && toggleSidebar()}>
              <FaShoppingCart /> Commandes
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default AdminSidebar;
