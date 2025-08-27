// src/components/NavBar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Aminastore" style={{ height: 40 }} className="me-2" />
          <span className="brand-name">Aminastore</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainnav">
          <span className="navbar-toggler-icon"></span>
        </button>

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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
