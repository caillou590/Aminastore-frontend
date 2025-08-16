import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Aminastore" style={{ height: "40px", marginRight: "10px" }} />
          <span className="fw-bold text-warning">Aminastore</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Accueil</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/boutique">Boutique</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Se connecter</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">S'inscrire</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
