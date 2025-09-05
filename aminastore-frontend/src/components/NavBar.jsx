import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Aminastore" style={{ height: 40 }} className="me-2" />
          <span className="brand-name">Aminastore</span>
        </Link>

        {/* Toggle button pour mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainnav"
          aria-controls="mainnav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Liens de navigation */}
        <div id="mainnav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Accueil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/boutique">
                Boutique
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/panier">
                Panier
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/faq">
                FAQ
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
