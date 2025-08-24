// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Hero.css"; // importe le fichier CSS séparé

const Hero = () => {
  return (
    <section className="hero d-flex align-items-center">
      <div className="container text-center text-md-start">
        <div className="row align-items-center">
          {/* Texte à gauche */}
          <div className="col-md-6 text-white">
            <h1 className="fw-bold display-5">
              Mode unique, prix malins —
              <br /> trouvez la pièce qui vous ressemble.
            </h1>
            <p className="lead mb-4">
              Découvrez notre collection et profitez des meilleures offres.
            </p>
            <Link to="/boutique" className="btn btn-light btn-lg shadow">
              Voir la boutique
            </Link>
          </div>

          {/* Espace vide à droite (ou image produit si besoin) */}
          <div className="col-md-6 d-none d-md-block"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
