// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products?page=1&limit=6");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits :", err);
    }
  };

  return (
    <div>
      <NavBar />

      {/* Hero */}
      <div
        className="hero d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url("/hero.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
          position: "relative",
        }}
      >
        <div className="bg-dark bg-opacity-50 p-4 rounded">
          <h1 className="display-4 fw-bold">Mode unique, prix malins</h1>
          <p className="lead mb-4">Trouvez la pièce qui vous ressemble.</p>
          <Link to="/boutique" className="btn btn-primary btn-lg">Voir la boutique</Link>
        </div>
      </div>

      {/* Description */}
      <div className="container my-5">
        <p className="lead text-center">
          Bienvenue chez <strong>Amynastore</strong>, l’endroit où chaque pièce raconte une histoire.
          Découvrez des vêtements stylés, abordables et pleins de caractère.
        </p>
      </div>

      {/* Produits */}
      <div className="container my-5">
        <h2 className="mb-4 text-center">Nos produits phares</h2>
        <div className="row justify-content-center">
          {products.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img src={product.imageUrl} className="card-img-top" alt={product.nom} style={{ height: "250px", objectFit: "cover" }} />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.nom}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="fw-bold text-danger">{product.prix} FCFA</p>
                  <Link to={`/produit/${product._id}`} className="btn btn-outline-primary">Voir le produit</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
