import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav className="custom-navbar">
      <div className="container">
        {/* Groupe gauche */}
        <div className="nav-left">
          <NavLink to="/" className="nav-link">
            🏠 Accueil
          </NavLink>
          <NavLink to="/boutique" className="nav-link">
            🛍️ Boutique
          </NavLink>
        </div>

        {/* Logo centré */}
        <div className="logo-center">
          <img src={logo} alt="Aminastore" />
          <span className="brand-name">Aminastore</span>
        </div>

        {/* Groupe droit */}
        <div className="nav-right">
          <NavLink to="/panier" className="nav-link">
            🛒 Panier
          </NavLink>
          <NavLink to="/faq" className="nav-link">
            ❓ FAQ
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
