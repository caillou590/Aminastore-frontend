import React from "react";

const Footer = () => (
  <footer className="bg-dark text-light py-4 mt-auto">
    <div className="container text-center">
      <p className="mb-1"><strong>Adresse :</strong> Liberté 6, en face école Assia, rue gy-227, 158</p>
      <p className="mb-1"><strong>Téléphone :</strong> 771083763</p>
      <p className="mb-0">&copy; {new Date().getFullYear()} Amynastore. Tous droits réservés.</p>
    </div>
  </footer>
);
export default Footer;
