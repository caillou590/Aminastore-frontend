// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container py-5 text-center">
    <h3>404 - Page introuvable</h3>
    <p>La page que vous cherchez n'existe pas.</p>
    <Link className="btn btn-primary" to="/">Retour à l'accueil</Link>
  </div>
);

export default NotFound;
