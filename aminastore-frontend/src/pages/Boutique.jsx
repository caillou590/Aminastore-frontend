import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Boutique = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products?page=1&limit=12");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits :", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Notre Boutique</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.nom}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{product.nom}</h5>
                  <p className="card-text text-truncate">{product.description}</p>
                  <p className="fw-bold text-danger">{product.prix} FCFA</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <Link to={`/boutique/${product._id}`} className="btn btn-outline-primary btn-sm">
                    Voir
                  </Link>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => addToCart(product)}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boutique;
