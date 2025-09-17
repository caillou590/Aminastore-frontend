import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineQuestionCircle } from "react-icons/ai";
import { BiStore } from "react-icons/bi";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav className="custom-navbar">
      <div className="container">
        {/* Groupe gauche */}
        <div className="nav-left">
          <NavLink to="/" className="nav-link">
            <AiOutlineHome /> Accueil
          </NavLink>
          <NavLink to="/boutique" className="nav-link">
            <BiStore /> Boutique
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
            <AiOutlineShoppingCart /> Panier
          </NavLink>
          <NavLink to="/faq" className="nav-link">
            <AiOutlineQuestionCircle /> FAQ
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
