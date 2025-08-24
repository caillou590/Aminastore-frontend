// src/admin/components/AdminSidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaBars } from "react-icons/fa";
import "../../admin/admin.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Bouton hamburger mobile */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>Aminastore</h2>
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              <FaTachometerAlt /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              <FaBoxOpen /> Produits
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              <FaShoppingCart /> Commandes
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default AdminSidebar;
